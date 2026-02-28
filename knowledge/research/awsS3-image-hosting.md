# WordPress to S3 media offloading without paid plugins

**You can build a production-ready S3 media offloading system using five core WordPress filters, the AWS SDK for PHP, and about 200 lines of custom plugin code — or skip the build entirely with two excellent free open-source solutions.** The critical hook is `wp_generate_attachment_metadata`, which fires once after all thumbnail sizes are generated and gives you a single interception point to upload everything to S3. Combined with `wp_get_attachment_url` for URL rewriting and `wp_calculate_image_srcset` for responsive images, this covers the complete media pipeline. For a typical WordPress site with **10 GB of images**, S3 storage costs roughly **$0.23/month** for storage alone, or around **$15–18/month** with CloudFront CDN delivery — a fraction of what most managed hosting charges for equivalent storage and bandwidth.

---

## The five WordPress hooks that power S3 offloading

WordPress's media upload pipeline follows a predictable sequence: `async-upload.php` or the REST API receives the file, `wp_handle_upload()` moves it to `wp-content/uploads/YYYY/MM/`, `wp_insert_attachment()` creates the database entry, and `wp_generate_attachment_metadata()` creates all thumbnail sizes. Understanding this flow reveals exactly where to intercept.

**`wp_generate_attachment_metadata`** is the primary hook. It fires once after all sub-sizes have been generated, receiving the complete metadata array including every thumbnail. The WordPress Core team explicitly recommended this hook (Andrew Ozz, November 2019) as the canonical "upload is complete" signal. Its signature:

```php
add_filter('wp_generate_attachment_metadata', function($metadata, $attachment_id, $context) {
    // $metadata['sizes'] contains all thumbnails
    // $context is 'create' for new uploads, 'update' for regeneration
    // Upload original + all sizes to S3 here
    return $metadata;
}, 20, 3);
```

The `$metadata['sizes']` array contains every registered image size — thumbnail, medium, medium_large, large, plus any custom sizes from `add_image_size()`. Since WordPress 5.3, the `big_image_size_threshold` (default **2560px**) scales down originals, storing the unscaled file in `$metadata['original_image']`. Your S3 upload logic must handle this additional file.

**`wp_get_attachment_url`** handles URL rewriting, replacing local paths with S3 or CloudFront URLs. Hook at priority **99** to ensure it runs after other plugins:

```php
add_filter('wp_get_attachment_url', function($url, $attachment_id) {
    if (!get_post_meta($attachment_id, '_s3_offloaded', true)) return $url;
    $upload_dir = wp_get_upload_dir();
    return str_replace($upload_dir['baseurl'], 'https://cdn.example.com/wp-content/uploads', $url);
}, 99, 2);
```

**`wp_calculate_image_srcset`** rewrites responsive image source sets. WordPress validates that srcset URLs share a common base directory with the primary `src` — if you rewrite `src` but not `srcset`, responsive images silently break. This filter receives a `$sources` array keyed by width, and you must rewrite each URL to match your CDN base.

**`delete_attachment`** fires before WordPress removes an attachment, while metadata is still available. Iterate through `$metadata['sizes']` to delete all thumbnails from S3, plus the original and any `original_image` file.

**`wp_update_attachment_metadata`** should be avoided as a primary hook. Since WordPress 5.3, it fires **repeatedly** during upload — once after each intermediate size is created, potentially 5–10+ times for a single image. This caused significant bugs in WP Offload Media and other plugins that relied on it.

Additional hooks for complete coverage include `wp_prepare_attachment_for_js` (media modal data), `get_attached_file` (critical if you delete local copies, since WordPress and other plugins expect local file access), and `wp_get_attachment_image_src` (image src arrays used in templates).

---

## Building the custom plugin: complete implementation

A plugin is the only appropriate architecture for S3 integration — never use `functions.php`. A theme-based approach breaks instantly on theme switch, potentially leaving your media library pointing to deleted local files with no S3 URL rewriting active. Plugins provide `register_activation_hook()` and `register_deactivation_hook()` for proper lifecycle management, survive theme changes, package Composer dependencies cleanly, and can be promoted to `mu-plugins/` for mission-critical deployments that prevent accidental deactivation.

The recommended directory structure follows PSR-4 conventions with Composer autoloading:

```
s3-media-offloader/
├── composer.json
├── s3-media-offloader.php       # Bootstrap
├── uninstall.php                # Clean removal
├── vendor/                      # Composer deps (AWS SDK)
├── src/
│   ├── Plugin.php               # Singleton main class
│   ├── S3/Client.php            # S3 client wrapper
│   ├── S3/Uploader.php          # Upload + URL rewrite logic
│   └── CLI/Commands.php         # WP-CLI migration commands
└── assets/css/, js/
```

The `composer.json` requires `aws/aws-sdk-php` (current version needs **PHP 8.1+**, Guzzle 7.4.5+) and maps `S3MediaOffloader\\` to `src/` via PSR-4. Run `composer dump-autoload -o` for production-optimized class maps.

Here is the core implementation with all essential hooks wired together:

```php
<?php
/**
 * Plugin Name: S3 Media Offloader
 * Requires PHP: 8.1
 */
defined('ABSPATH') || exit;
require_once __DIR__ . '/vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class S3_Media_Offloader {
    private S3Client $s3;
    private string $bucket;
    private string $cdn_base;

    public function __construct() {
        $this->bucket   = defined('S3MO_BUCKET') ? S3MO_BUCKET : '';
        $this->cdn_base = defined('S3MO_CDN_URL') ? S3MO_CDN_URL
                          : "https://{$this->bucket}.s3.amazonaws.com";

        $this->s3 = new S3Client([
            'version'     => 'latest',
            'region'      => defined('S3MO_REGION') ? S3MO_REGION : 'us-east-1',
            'credentials' => [
                'key'    => defined('S3MO_KEY') ? S3MO_KEY : '',
                'secret' => defined('S3MO_SECRET') ? S3MO_SECRET : '',
            ],
        ]);

        add_filter('wp_generate_attachment_metadata', [$this, 'upload_to_s3'], 20, 3);
        add_filter('wp_get_attachment_url', [$this, 'rewrite_url'], 99, 2);
        add_filter('wp_calculate_image_srcset', [$this, 'rewrite_srcset'], 99, 5);
        add_filter('wp_get_attachment_image_src', [$this, 'rewrite_image_src'], 99, 4);
        add_action('delete_attachment', [$this, 'delete_from_s3'], 10, 2);
    }

    public function upload_to_s3(array $metadata, int $attachment_id, string $context): array {
        if ($context !== 'create') return $metadata;

        $upload_dir    = wp_get_upload_dir();
        $attached_file = get_post_meta($attachment_id, '_wp_attached_file', true);
        $base_dir      = trailingslashit($upload_dir['basedir']) . dirname($attached_file);

        // Upload original
        $this->put_object(
            trailingslashit($upload_dir['basedir']) . $attached_file,
            'wp-content/uploads/' . $attached_file
        );

        // Upload all thumbnail sizes
        if (!empty($metadata['sizes'])) {
            foreach ($metadata['sizes'] as $size_data) {
                $this->put_object(
                    $base_dir . '/' . $size_data['file'],
                    'wp-content/uploads/' . dirname($attached_file) . '/' . $size_data['file']
                );
            }
        }

        // Upload original_image (WP 5.3+ big image handling)
        if (!empty($metadata['original_image'])) {
            $this->put_object(
                $base_dir . '/' . $metadata['original_image'],
                'wp-content/uploads/' . dirname($attached_file) . '/' . $metadata['original_image']
            );
        }

        update_post_meta($attachment_id, '_s3_offloaded', true);
        return $metadata;
    }

    private function put_object(string $local_path, string $s3_key): void {
        try {
            $this->s3->putObject([
                'Bucket'       => $this->bucket,
                'Key'          => $s3_key,
                'SourceFile'   => $local_path,
                'ContentType'  => mime_content_type($local_path) ?: 'application/octet-stream',
                'CacheControl' => 'max-age=31536000',
            ]);
        } catch (AwsException $e) {
            error_log('S3 Upload Error: ' . $e->getMessage());
        }
    }

    public function rewrite_url(string $url, int $attachment_id): string {
        if (!get_post_meta($attachment_id, '_s3_offloaded', true)) return $url;
        return str_replace(wp_get_upload_dir()['baseurl'],
            rtrim($this->cdn_base, '/') . '/wp-content/uploads', $url);
    }

    public function rewrite_srcset(array $sources, $size_array, $image_src, $image_meta, int $attachment_id): array {
        if (!get_post_meta($attachment_id, '_s3_offloaded', true)) return $sources;
        $base = wp_get_upload_dir()['baseurl'];
        $cdn  = rtrim($this->cdn_base, '/') . '/wp-content/uploads';
        foreach ($sources as &$source) {
            $source['url'] = str_replace($base, $cdn, $source['url']);
        }
        return $sources;
    }

    public function rewrite_image_src($image, int $attachment_id, $size, bool $icon) {
        if (!$image || !get_post_meta($attachment_id, '_s3_offloaded', true)) return $image;
        $image[0] = str_replace(wp_get_upload_dir()['baseurl'],
            rtrim($this->cdn_base, '/') . '/wp-content/uploads', $image[0]);
        return $image;
    }

    public function delete_from_s3(int $post_id, $post): void {
        if (!get_post_meta($post_id, '_s3_offloaded', true)) return;
        $metadata      = wp_get_attachment_metadata($post_id);
        $attached_file = get_post_meta($post_id, '_wp_attached_file', true);

        $this->s3->deleteObject(['Bucket' => $this->bucket, 'Key' => 'wp-content/uploads/' . $attached_file]);

        if (!empty($metadata['sizes'])) {
            $prefix = dirname($attached_file);
            foreach ($metadata['sizes'] as $size_data) {
                $this->s3->deleteObject([
                    'Bucket' => $this->bucket,
                    'Key'    => 'wp-content/uploads/' . $prefix . '/' . $size_data['file'],
                ]);
            }
        }
    }
}

new S3_Media_Offloader();
```

The corresponding `wp-config.php` constants:

```php
define('S3MO_BUCKET', 'my-wordpress-media');
define('S3MO_REGION', 'us-east-1');
define('S3MO_KEY', 'AKIAIOSFODNN7EXAMPLE');
define('S3MO_SECRET', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
define('S3MO_CDN_URL', 'https://cdn.example.com');  // CloudFront distribution
```

Store credentials as `wp-config.php` constants, never in the options table. For EC2/ECS-hosted WordPress, use IAM instance profiles instead — the SDK discovers credentials automatically, eliminating static keys entirely.

---

## AWS infrastructure: IAM, S3, and CloudFront configuration

### Least-privilege IAM policy

Create a dedicated IAM user with the minimum permissions needed. This policy grants only the four operations your plugin requires:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
            "Resource": "arn:aws:s3:::my-wordpress-media"
        },
        {
            "Effect": "Allow",
            "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
            "Resource": "arn:aws:s3:::my-wordpress-media/*"
        }
    ]
}
```

The AWS Lightsail blog post referenced by the user describes a broader policy (`s3:Put*`, `s3:Get*`, `s3:List*`, `s3:CreateBucket`) — that's unnecessarily permissive. The policy above is sufficient for all plugin operations. Add `s3:PutObjectAcl` only if you need to set per-object ACL permissions (unnecessary when using CloudFront OAC with a private bucket).

### S3 bucket setup for CloudFront delivery

The recommended architecture uses a **private S3 bucket** with CloudFront Origin Access Control (OAC) — not a public bucket. Keep **Block Public Access fully enabled** on the bucket. This eliminates the risk of accidentally exposing objects.

**CORS configuration** (needed for WordPress admin media library operations):

```json
[{
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
}]
```

### CloudFront with Origin Access Control

OAC replaced the legacy Origin Access Identity (OAI) and supports all AWS regions, SSE-KMS encryption, and granular IAM policies. Create an OAC, create a CloudFront distribution pointing to your S3 bucket's REST API endpoint, and add this bucket policy:

```json
{
    "Version": "2012-10-17",
    "Statement": {
        "Effect": "Allow",
        "Principal": {"Service": "cloudfront.amazonaws.com"},
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::my-wordpress-media/*",
        "Condition": {
            "StringEquals": {
                "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
            }
        }
    }
}
```

Set `Cache-Control: max-age=31536000` on uploaded objects (as shown in the plugin code above). Use the CachingOptimized managed cache policy. Configure a custom domain (e.g., `cdn.yourdomain.com`) via CNAME with an ACM certificate in `us-east-1`. This architecture means **S3-to-CloudFront data transfer is always free** — you pay only CloudFront egress rates, which are lower than direct S3 egress.

---

## Two free open-source alternatives worth considering before building

Before writing custom code, two genuinely free solutions deserve serious evaluation.

**Advanced Media Offloader** is the best fully-free plugin option with a GUI. Available on WordPress.org with **3,000+ active installations**, last updated January 2026 (v4.3.1), rated **4.7/5 stars**, and critically — no premium tier exists. Every feature is free: automatic offloading of new uploads, bulk migration of existing media, URL rewriting via WordPress filters (no database URL modification), full thumbnail handling including srcset, WP-CLI commands (`wp advmo offload`, `wp advmo upload`), configurable file retention policies, and support for S3, Cloudflare R2, DigitalOcean Spaces, Backblaze B2, Wasabi, and MinIO. It exposes developer hooks like `advmo_should_offload_attachment` for custom filtering logic.

**S3-Uploads by Human Made** is the gold standard for developers. Hosted on GitHub with **2,100+ stars** and 400+ forks, latest release v4.0.0 (August 2025) with PHP 8.4 fixes, and actively maintained with the most recent commit in November 2025. It takes a fundamentally different architectural approach: instead of hooking into upload filters, it registers an `s3://` PHP stream wrapper that replaces `wp_upload_dir()` paths entirely. All files are written directly to S3 during generation — thumbnails never touch local disk. It requires Composer installation and `wp-config.php` configuration with zero admin UI, making it ideal for infrastructure-as-code deployments. Human Made runs this on sites with millions of monthly pageviews and terabyte-scale multisite installations (including CUNY). Installation is straightforward:

```bash
composer require humanmade/s3-uploads
```
```php
// wp-config.php — before wp-settings.php
require_once __DIR__ . '/vendor/autoload.php';
define('S3_UPLOADS_BUCKET', 'my-bucket/wp-content/uploads');
define('S3_UPLOADS_REGION', 'us-east-1');
define('S3_UPLOADS_KEY', 'your-key');
define('S3_UPLOADS_SECRET', 'your-secret');
```

For comparison: **WP Offload Media Lite** is freemium and cannot migrate existing media without paying $39–249/year. **Media Cloud** has a generous free version including bulk import, but uses Freemius tracking and weighs 87MB. Neither qualifies as "truly free."

---

## Migrating existing media to S3

For existing media libraries, three approaches work depending on scale. The fastest for large libraries is **AWS CLI sync** followed by URL rewriting:

```bash
aws s3 sync wp-content/uploads/ s3://my-bucket/wp-content/uploads/ --cache-control "max-age=31536000"
```

Then mark all attachments as offloaded in the database:

```sql
INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
SELECT ID, '_s3_offloaded', '1' FROM wp_posts WHERE post_type = 'attachment';
```

For a more controlled migration, build a **WP-CLI command** that iterates through attachments in batches, uploads each file and its thumbnails, and marks them individually. Use `\WP_CLI\Utils\make_progress_bar()` for progress tracking:

```php
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('s3-offload migrate', function($args, $assoc_args) {
        $attachments = get_posts([
            'post_type'      => 'attachment',
            'posts_per_page' => -1,
            'meta_query'     => [['key' => '_s3_offloaded', 'compare' => 'NOT EXISTS']],
            'fields'         => 'ids',
        ]);
        $progress = \WP_CLI\Utils\make_progress_bar('Migrating', count($attachments));
        foreach ($attachments as $id) {
            // Upload logic per attachment...
            update_post_meta($id, '_s3_offloaded', true);
            $progress->tick();
        }
        $progress->finish();
        WP_CLI::success(count($attachments) . ' attachments migrated.');
    });
}
```

As a safety net during migration, configure an **nginx fallback** to redirect any missing local file requests to S3:

```nginx
location ~ "^/wp-content/uploads/(.*)$" {
    try_files $uri @s3_fallback;
}
location @s3_fallback {
    rewrite "^/wp-content/uploads/(.*)$" "https://cdn.example.com/wp-content/uploads/$1" redirect;
}
```

If you delete local files after offloading, you **must** also filter `get_attached_file` — WordPress core and plugins like image editors, regeneration tools, and WooCommerce expect local file access. The standard pattern is to download from S3 on demand into a temporary local path when WordPress requests the file.

---

## What S3 and CloudFront actually cost

S3 Standard storage costs **$0.023 per GB per month** in US East (N. Virginia). Request pricing is negligible: $0.005 per 1,000 PUT requests and $0.0004 per 1,000 GET requests. Data transfer into S3 is free. The critical cost lever is **egress**: direct S3-to-internet transfer costs $0.09/GB after the first free 100 GB/month, but S3-to-CloudFront transfer is **always free**.

CloudFront introduced flat-rate pricing plans in 2025. The **Free tier** includes 100 GB transfer and 1 million requests monthly (perpetual, not time-limited). The **Pro plan** at **$15/month** includes 50 TB transfer, 10 million requests, and 50 GB of S3 storage — often the sweet spot for WordPress sites. Pay-as-you-go CloudFront charges $0.085/GB for the first 10 TB in North America/Europe.

Realistic monthly cost estimates:

| Site size | S3 storage | CloudFront delivery | Total (pay-as-you-go) | With Pro plan |
|-----------|-----------|--------------------|-----------------------|---------------|
| 5 GB images, 50K pageviews | $0.12 | ~$9.00 | **~$9/month** | $15/month |
| 10 GB images, 100K pageviews | $0.23 | ~$18.00 | **~$18/month** | $15/month |
| 50 GB images, 200K pageviews | $1.15 | ~$90.00 | **~$91/month** | $15/month* |

*The Pro plan's 50 TB transfer limit vastly exceeds what even large WordPress sites need.

**Cost optimization strategies**: transition older media to S3 Standard-IA (**$0.0125/GB**, 46% savings) via lifecycle rules after 30–60 days. Use S3 Intelligent-Tiering for unpredictable access patterns at a $0.0025/1,000 objects monitoring fee. Compress images to WebP/AVIF before upload to reduce both storage and transfer costs. Set long `Cache-Control` headers to maximize CloudFront cache hits and minimize origin requests.

---

## Plugin development patterns that matter for this use case

For the settings page, check for `wp-config.php` constants first and display credentials as masked/disabled fields with a "Defined in wp-config.php" notice when constants exist. Fall back to the WordPress Settings API for sites where developers prefer database-stored configuration. Always show a **Test Connection** button that performs an AJAX `headBucket` call with proper nonce verification (`check_ajax_referer`) and capability checks (`current_user_can('manage_options')`).

Use **Action Scheduler** (by Automattic, included in WooCommerce) for background batch migration rather than rolling your own `WP_Background_Process`. It handles batching, failure retry, and provides an admin UI for monitoring. Schedule migration tasks with `as_enqueue_async_action('s3mo_offload_single', ['attachment_id' => $id])`.

Add a custom column to the Media Library list table via `manage_media_columns` and `manage_media_custom_column` to show offload status — a green cloud icon for offloaded items, an orange upload icon for local-only items. Extend the attachment detail modal via `attachment_fields_to_edit` to display S3 status and the remote URL.

For the `uninstall.php` cleanup (preferred over `register_uninstall_hook` per the Plugin Handbook, since it doesn't require loading the plugin), delete all plugin options, drop any custom tables, and clean up `_s3mo_*` post meta. Never delete options or tables in the deactivation hook — that's exclusively for uninstall.

## Conclusion

The custom plugin approach requires hooking five filters centered on `wp_generate_attachment_metadata` for uploads and `wp_get_attachment_url` plus `wp_calculate_image_srcset` for URL rewriting. The complete implementation is roughly 200 lines of PHP plus AWS SDK integration via Composer. However, **S3-Uploads by Human Made** already implements this at enterprise scale as a fully open-source, zero-cost solution with a more elegant stream-wrapper architecture — and **Advanced Media Offloader** provides the same capabilities with a full admin GUI, also completely free. Building custom makes sense only if you need non-standard behavior (custom S3 key structures, conditional offloading logic, integration with proprietary systems) or want full control over the dependency chain. For most 17-year WordPress veterans, the pragmatic choice is deploying S3-Uploads via Composer and spending the saved development time on CloudFront optimization and lifecycle policies that actually reduce costs.