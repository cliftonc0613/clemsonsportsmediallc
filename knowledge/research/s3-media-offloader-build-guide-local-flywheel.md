# Build Your Own WordPress S3 Media Offloader Plugin

**Complete Step-by-Step Development Guide — Local by Flywheel Edition**

No Paid Plugins Required | No Composer Required | CT Web Design Shop Inc. | February 2026

---

## Table of Contents

- [Phase 1: AWS Infrastructure Setup](#phase-1-aws-infrastructure-setup)
- [Phase 2: Local by Flywheel Environment](#phase-2-local-by-flywheel-environment)
- [Phase 3: Plugin Scaffolding](#phase-3-plugin-scaffolding)
- [Phase 4: AWS SDK Integration (No Composer)](#phase-4-aws-sdk-integration-no-composer)
- [Phase 5: Core Upload Hook](#phase-5-core-upload-hook)
- [Phase 6: URL Rewriting System](#phase-6-url-rewriting-system)
- [Phase 7: Deletion Handler](#phase-7-deletion-handler)
- [Phase 8: Admin Settings Page](#phase-8-admin-settings-page)
- [Phase 9: WP-CLI Migration Command](#phase-9-wp-cli-migration-command)
- [Phase 10: Media Library UI Enhancements](#phase-10-media-library-ui-enhancements)
- [Phase 11: CloudFront CDN Setup](#phase-11-cloudfront-cdn-setup)
- [Phase 12: Testing & Deployment](#phase-12-testing--deployment)
- [Appendix A: Complete File Structure](#appendix-a-complete-file-structure)
- [Appendix B: Cost Breakdown](#appendix-b-cost-breakdown)
- [Appendix C: Troubleshooting](#appendix-c-troubleshooting)

---

## Phase 1: AWS Infrastructure Setup

Before writing a single line of PHP, you need your AWS foundation in place. This phase creates the S3 bucket, IAM user, and security policies that your plugin will connect to.

### 1.1 Create an AWS Account (if needed)

- Go to **aws.amazon.com** and create a free account
- Add a payment method (you will only be charged for actual usage)
- Enable MFA on your root account immediately for security

> ⚠️ The AWS Free Tier includes 5 GB of S3 Standard storage, 20,000 GET requests, and 2,000 PUT requests per month for 12 months.

### 1.2 Create the Custom IAM Policy FIRST

You need the policy to exist before you can attach it to a user. Do this step first.

- **Navigate:** AWS Console → IAM → Policies → Create Policy → JSON tab
- Click the **JSON** tab and replace everything with this (swap `your-site-media` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::your-site-media"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-site-media/*"
    }
  ]
}
```

- Click **Next**
- **Policy name:** `WordPress-S3-Media-Access`
- Click **Create policy**

### 1.3 Create a Dedicated IAM User

Never use your root account credentials in your plugin. Create a dedicated user with minimal permissions.

- **Navigate:** AWS Console → IAM → Users → Create User
- **User name:** `wordpress-s3-uploader`
- **UNCHECK** "Provide user access to the AWS Management Console" — your plugin only needs API access, not console login
- Click **Next**

### 1.4 Set Permissions for the User

On the Set Permissions screen:

- Select **"Attach policies directly"** (the third option on the right)
- In the search box, type `WordPress-S3-Media-Access`
- Check the box next to your custom policy
- Click **Next**

### 1.5 Review and Create

Verify you see:

- **User name:** `wordpress-s3-uploader`
- **Permissions summary:** `WordPress-S3-Media-Access` (Customer managed)

If you only see `IAMUserChangePassword`, go **Previous** and re-attach the S3 policy. Then click **Create user**.

### 1.6 Generate Access Keys

After the user is created:

- **Navigate:** IAM → Users → wordpress-s3-uploader → **Security credentials** tab
- Scroll down to **Access keys** → Click **Create access key**
- Select **"Application running outside AWS"**
- Click **Next** → **Create access key**
- **Save both keys immediately** — the Secret Access Key is shown only once

> ⚠️ Store these keys securely. You will add them to **wp-config.php** in Phase 4. Never commit them to Git or store them in the WordPress database.

### 1.7 Create the S3 Bucket

- **Navigate:** AWS Console → S3 → Create Bucket
- **Bucket name:** `your-site-media` (must be globally unique — use your domain like `ctwebdesign-media`)
- **Region:** Choose the region closest to your server (e.g., `us-east-1`)
- **Block Public Access:** Keep ALL four checkboxes **ENABLED**
  - We will serve files through CloudFront, not directly from S3
  - This is the most secure architecture
- **Versioning:** Disabled (unless you want file history)
- **Encryption:** SSE-S3 (default, free)
- Click **Create bucket**

### 1.8 Configure CORS on Your Bucket

CORS allows the WordPress admin to interact with S3 for media library operations.

- **Navigate:** S3 → your-site-media → **Permissions** tab → scroll to **Cross-origin resource sharing (CORS)** → Edit

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

> ⚠️ For local development, add your Local by Flywheel URL too: `"http://yoursite.local"`

---

## Phase 2: Local by Flywheel Environment

Since you're using Local by Flywheel, your development environment is already set up. Here's what you need to know about where things live.

### 2.1 Find Your Site's File Path

In Local by Flywheel:

1. Click on your site name
2. Look at the **Site path** — this is your WordPress root
3. Or click **"Go to site folder"** to open it in Finder/Explorer

Your plugin will live at:

```
{Site Path}/app/public/wp-content/plugins/s3-media-offloader/
```

### 2.2 Access the WP-CLI Shell

Local by Flywheel includes WP-CLI. To access it:

1. Right-click your site in Local
2. Select **"Open Site Shell"** (this opens a terminal with the correct PHP/MySQL paths)
3. You can now run `wp` commands directly

### 2.3 Find wp-config.php

Your `wp-config.php` is at:

```
{Site Path}/app/public/wp-config.php
```

You can also click **"Go to site folder"** → `app` → `public` → `wp-config.php`

### 2.4 Prerequisites Check

Open the Site Shell and verify:

```bash
php -v          # Should be 8.1+ (check your Local site's PHP version)
wp --version    # WP-CLI should be available
```

If your PHP version is below 8.1, click your site in Local → scroll to PHP version → change to 8.1 or higher → restart the site.

---

## Phase 3: Plugin Scaffolding

Create the complete directory structure and all files your plugin needs before writing any logic.

### 3.1 Create the Plugin Directory Structure

Open the **Site Shell** in Local by Flywheel and run:

```bash
cd app/public/wp-content/plugins/
mkdir -p s3-media-offloader/includes
mkdir -p s3-media-offloader/admin
mkdir -p s3-media-offloader/aws-sdk
mkdir -p s3-media-offloader/cli
cd s3-media-offloader
```

> ⚠️ **Note the different structure from the Composer version.** Since we're not using Composer's PSR-4 autoloading, we use `includes/` for our classes and `aws-sdk/` for the manually downloaded SDK. All files use `require_once` instead of autoloading.

### 3.2 Create the Main Plugin Bootstrap File

Create `s3-media-offloader.php` in the plugin root:

```php
<?php
/**
 * Plugin Name: S3 Media Offloader
 * Plugin URI:  https://ctwebdesignshop.com
 * Description: Offload WordPress media to Amazon S3.
 * Version:     1.0.0
 * Author:      CT Web Design Shop Inc.
 * Requires PHP: 8.1
 * License:     GPL-2.0+
 */

// Prevent direct file access
defined('ABSPATH') || exit;

// Plugin constants
define('S3MO_VERSION', '1.0.0');
define('S3MO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('S3MO_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load the AWS SDK
$aws_autoloader = S3MO_PLUGIN_DIR . 'aws-sdk/aws-autoloader.php';
if (!file_exists($aws_autoloader)) {
    add_action('admin_notices', function() {
        echo '<div class="error"><p><strong>S3 Media Offloader:</strong> ';
        echo 'AWS SDK not found. Download it and place it in the ';
        echo '<code>aws-sdk/</code> folder. ';
        echo 'See the plugin readme for instructions.</p></div>';
    });
    return;
}
require_once $aws_autoloader;

// Load plugin classes
require_once S3MO_PLUGIN_DIR . 'includes/class-s3mo-client.php';
require_once S3MO_PLUGIN_DIR . 'includes/class-s3mo-uploader.php';
require_once S3MO_PLUGIN_DIR . 'admin/class-s3mo-settings-page.php';

// Boot the plugin
add_action('plugins_loaded', function() {
    // Only initialize if credentials are configured
    if (!defined('S3MO_BUCKET')
        || !defined('S3MO_REGION')
        || !defined('S3MO_KEY')
        || !defined('S3MO_SECRET')
    ) {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-warning"><p>';
            echo '<strong>S3 Media Offloader:</strong> ';
            echo 'Add S3MO_BUCKET, S3MO_REGION, S3MO_KEY, ';
            echo 'and S3MO_SECRET constants to wp-config.php';
            echo '</p></div>';
        });
        return;
    }

    // Initialize S3 client
    $client = new S3MO_Client();

    // Initialize uploader (handles uploads, URL rewriting, deletion)
    $uploader = new S3MO_Uploader($client);
    $uploader->register_hooks();

    // Admin settings page
    if (is_admin()) {
        $settings = new S3MO_Settings_Page($client);
        $settings->register_hooks();

        // S3 status column in Media Library
        add_filter('manage_media_columns', function($columns) {
            $columns['s3_status'] = 'S3 Status';
            return $columns;
        });

        add_action('manage_media_custom_column', function($column, $post_id) {
            if ($column !== 's3_status') return;
            $offloaded = get_post_meta($post_id, '_s3mo_offloaded', true);
            if ($offloaded) {
                echo '<span style="color:#46b450;">&#9989; On S3</span>';
            } else {
                echo '<span style="color:#dc3232;">&#10060; Local Only</span>';
            }
        }, 10, 2);
    }

    // WP-CLI commands
    if (defined('WP_CLI') && WP_CLI) {
        require_once S3MO_PLUGIN_DIR . 'cli/class-s3mo-commands.php';
        WP_CLI::add_command('s3-offload', 'S3MO_Commands');
    }
});

// Activation hook
register_activation_hook(__FILE__, function() {
    add_option('s3mo_delete_local', false);
    add_option('s3mo_path_prefix', 'wp-content/uploads');
});

// Deactivation hook (cleanup transients only)
register_deactivation_hook(__FILE__, function() {
    delete_transient('s3mo_connection_status');
});
```

### 3.3 Create the uninstall.php File

This file runs ONLY when the plugin is deleted from WordPress, not when deactivated:

```php
<?php
// Prevent direct access
defined('WP_UNINSTALL_PLUGIN') || exit;

// Remove plugin options
delete_option('s3mo_delete_local');
delete_option('s3mo_path_prefix');
delete_option('s3mo_cdn_url');

// Remove all _s3mo_offloaded post meta
global $wpdb;
$wpdb->delete(
    $wpdb->postmeta,
    ['meta_key' => '_s3mo_offloaded']
);
```

> ⚠️ Never delete options or data in the deactivation hook. Deactivation should be reversible. Uninstall is permanent.

---

## Phase 4: AWS SDK Integration (No Composer)

Instead of Composer, we'll download the AWS SDK zip file directly and drop it into the plugin.

### 4.1 Download the AWS SDK for PHP

1. Go to: **https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/getting-started_installation.html**
2. Scroll to the **"Installing by Using the Zip file"** section
3. Download the `.zip` file (it will be named something like `aws.zip`)
4. **Extract the zip contents**
5. Copy the **entire contents** of the extracted folder into your plugin's `aws-sdk/` directory

Your `aws-sdk/` folder should contain:

```
s3-media-offloader/aws-sdk/
├── aws-autoloader.php      ← This is the key file
├── Aws/
│   ├── S3/
│   ├── Credentials/
│   ├── ... (many folders)
├── GuzzleHttp/
├── Psr/
└── ... (other dependencies)
```

> ⚠️ **The critical file is `aws-autoloader.php`** in the root of the aws-sdk folder. This replaces Composer's `vendor/autoload.php`. If you don't see it, you may have an extra nested folder — the autoloader must be at `aws-sdk/aws-autoloader.php`, not `aws-sdk/aws/aws-autoloader.php`.

### 4.2 Verify the SDK is Loaded

After placing the SDK, activate your plugin in WordPress. If you see an error about the SDK not being found, double-check the path. You can verify in the Site Shell:

```bash
ls app/public/wp-content/plugins/s3-media-offloader/aws-sdk/aws-autoloader.php
```

### 4.3 Add Credentials to wp-config.php

Open your `wp-config.php` (in Local: Site folder → `app/public/wp-config.php`) and add these constants **ABOVE** the `/* That's all, stop editing! */` line:

```php
/* S3 Media Offloader Configuration */
define('S3MO_BUCKET', 'your-site-media');
define('S3MO_REGION', 'us-east-1');
define('S3MO_KEY',    'AKIAIOSFODNN7EXAMPLE');
define('S3MO_SECRET', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
define('S3MO_CDN_URL', '');  // Empty until Phase 11
```

Replace the example values with your actual IAM Access Key ID, Secret Access Key, bucket name, and region.

### 4.4 Create the S3 Client Wrapper

Create `includes/class-s3mo-client.php`:

```php
<?php
// Prevent direct access
defined('ABSPATH') || exit;

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class S3MO_Client {
    private S3Client $s3;
    private string $bucket;
    private string $region;

    public function __construct() {
        $this->bucket = S3MO_BUCKET;
        $this->region = S3MO_REGION;

        $this->s3 = new S3Client([
            'version'     => 'latest',
            'region'      => $this->region,
            'credentials' => [
                'key'    => S3MO_KEY,
                'secret' => S3MO_SECRET,
            ],
        ]);
    }

    /**
     * Upload a file to S3
     */
    public function upload(string $local_path, string $s3_key): bool {
        try {
            $this->s3->putObject([
                'Bucket'       => $this->bucket,
                'Key'          => $s3_key,
                'SourceFile'   => $local_path,
                'ContentType'  => $this->get_mime($local_path),
                'CacheControl' => 'max-age=31536000',
            ]);
            return true;
        } catch (AwsException $e) {
            error_log('[S3MO] Upload failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete a file from S3
     */
    public function delete(string $s3_key): bool {
        try {
            $this->s3->deleteObject([
                'Bucket' => $this->bucket,
                'Key'    => $s3_key,
            ]);
            return true;
        } catch (AwsException $e) {
            error_log('[S3MO] Delete failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Test the connection to S3
     */
    public function test_connection(): array {
        try {
            $this->s3->headBucket([
                'Bucket' => $this->bucket
            ]);
            return ['success' => true, 'message' => 'Connected'];
        } catch (AwsException $e) {
            return [
                'success' => false,
                'message' => $e->getAwsErrorMessage()
            ];
        }
    }

    /**
     * Get the bucket name
     */
    public function get_bucket(): string {
        return $this->bucket;
    }

    /**
     * Get the base URL for S3/CDN
     */
    public function get_url_base(): string {
        $cdn = defined('S3MO_CDN_URL') ? S3MO_CDN_URL : '';
        if (!empty($cdn)) return rtrim($cdn, '/');
        return "https://{$this->bucket}.s3.{$this->region}.amazonaws.com";
    }

    /**
     * Get MIME type for a file
     */
    private function get_mime(string $path): string {
        return mime_content_type($path) ?: 'application/octet-stream';
    }
}
```

---

## Phase 5: Core Upload Hook

This is the heart of the plugin. The Uploader class hooks into the WordPress media pipeline to automatically upload files to S3 whenever media is added.

### 5.1 Understanding the Upload Flow

When someone uploads an image through the WordPress media library, this sequence happens:

1. WordPress receives the file via `async-upload.php` or REST API
2. `wp_handle_upload()` moves it to `wp-content/uploads/YYYY/MM/`
3. `wp_insert_attachment()` creates the database record
4. `wp_generate_attachment_metadata()` creates ALL thumbnails
5. **← YOUR HOOK FIRES HERE** — all sizes exist, upload everything to S3

> ⚠️ **Critical:** Do NOT use `wp_update_attachment_metadata`. Since WordPress 5.3, it fires repeatedly during upload (once per thumbnail size), causing duplicate uploads and race conditions.

### 5.2 Create the Uploader Class

Create `includes/class-s3mo-uploader.php`. This single file handles uploads, URL rewriting, and deletion:

```php
<?php
// Prevent direct access
defined('ABSPATH') || exit;

class S3MO_Uploader {
    private S3MO_Client $client;
    private string $prefix;

    public function __construct(S3MO_Client $client) {
        $this->client = $client;
        $this->prefix = get_option(
            's3mo_path_prefix',
            'wp-content/uploads'
        );
    }

    /**
     * Register all WordPress hooks
     */
    public function register_hooks(): void {
        // Upload after all thumbnails are generated
        add_filter(
            'wp_generate_attachment_metadata',
            [$this, 'handle_upload'],
            20, 3
        );

        // URL rewriting - single URL
        add_filter(
            'wp_get_attachment_url',
            [$this, 'rewrite_url'],
            99, 2
        );

        // URL rewriting - responsive srcset
        add_filter(
            'wp_calculate_image_srcset',
            [$this, 'rewrite_srcset'],
            99, 5
        );

        // URL rewriting - image src arrays
        add_filter(
            'wp_get_attachment_image_src',
            [$this, 'rewrite_image_src'],
            99, 4
        );

        // Delete from S3 when attachment deleted
        add_action(
            'delete_attachment',
            [$this, 'handle_delete'],
            10, 2
        );
    }

    // =========================================================
    // UPLOAD HANDLER
    // =========================================================

    /**
     * Upload original + all thumbnails to S3
     */
    public function handle_upload(
        array $metadata,
        int $attachment_id,
        string $context
    ): array {
        // Only process new uploads, not regenerations
        if ($context !== 'create') return $metadata;

        $upload_dir    = wp_get_upload_dir();
        $attached_file = get_post_meta(
            $attachment_id, '_wp_attached_file', true
        );
        $base_dir = trailingslashit($upload_dir['basedir'])
                  . dirname($attached_file);

        // Upload the main file
        $main_path = trailingslashit(
            $upload_dir['basedir']
        ) . $attached_file;

        $success = $this->client->upload(
            $main_path,
            $this->prefix . '/' . $attached_file
        );

        // If main upload failed, bail out
        if (!$success) return $metadata;

        // Upload each thumbnail size
        if (!empty($metadata['sizes'])) {
            $sub_dir = dirname($attached_file);
            foreach ($metadata['sizes'] as $size => $data) {
                $this->client->upload(
                    $base_dir . '/' . $data['file'],
                    $this->prefix . '/'
                        . $sub_dir . '/' . $data['file']
                );
            }
        }

        // Upload original_image (WP 5.3+ big images)
        // When an image is > 2560px, WordPress scales it down
        // and stores the unscaled original in this field
        if (!empty($metadata['original_image'])) {
            $this->client->upload(
                $base_dir . '/' . $metadata['original_image'],
                $this->prefix . '/'
                    . dirname($attached_file) . '/'
                    . $metadata['original_image']
            );
        }

        // Mark this attachment as offloaded
        update_post_meta(
            $attachment_id, '_s3mo_offloaded', true
        );

        // Optionally delete local copy to save disk space
        if (get_option('s3mo_delete_local', false)) {
            $this->delete_local_files(
                $metadata, $upload_dir, $attached_file
            );
        }

        return $metadata;
    }

    /**
     * Remove local files after successful S3 upload
     */
    private function delete_local_files(
        array $metadata,
        array $upload_dir,
        string $attached_file
    ): void {
        $basedir = trailingslashit($upload_dir['basedir']);

        // Delete main file
        @unlink($basedir . $attached_file);

        // Delete thumbnails
        if (!empty($metadata['sizes'])) {
            $dir = dirname($attached_file);
            foreach ($metadata['sizes'] as $data) {
                @unlink($basedir . $dir . '/' . $data['file']);
            }
        }

        // Delete original_image
        if (!empty($metadata['original_image'])) {
            @unlink(
                $basedir . dirname($attached_file)
                . '/' . $metadata['original_image']
            );
        }
    }

    // =========================================================
    // URL REWRITING
    // =========================================================

    /**
     * Rewrite single attachment URL to S3/CDN
     *
     * This handles: featured images, get_the_post_thumbnail(),
     * direct wp_get_attachment_url() calls
     */
    public function rewrite_url(
        string $url,
        int $attachment_id
    ): string {
        if (!get_post_meta($attachment_id, '_s3mo_offloaded', true)) {
            return $url;
        }

        $upload_dir = wp_get_upload_dir();
        $cdn_base   = $this->client->get_url_base()
                    . '/' . $this->prefix;

        return str_replace(
            $upload_dir['baseurl'],
            $cdn_base,
            $url
        );
    }

    /**
     * Rewrite responsive srcset URLs
     *
     * This handles: all responsive images. If you skip this,
     * WordPress will silently strip the entire srcset attribute
     * because it validates that srcset URLs share a common base
     * with the primary src.
     */
    public function rewrite_srcset(
        array $sources,
        array $size_array,
        string $image_src,
        array $image_meta,
        int $attachment_id
    ): array {
        if (!get_post_meta($attachment_id, '_s3mo_offloaded', true)) {
            return $sources;
        }

        $upload_dir = wp_get_upload_dir();
        $cdn_base   = $this->client->get_url_base()
                    . '/' . $this->prefix;

        foreach ($sources as &$source) {
            $source['url'] = str_replace(
                $upload_dir['baseurl'],
                $cdn_base,
                $source['url']
            );
        }

        return $sources;
    }

    /**
     * Rewrite image src arrays
     *
     * This handles: wp_get_attachment_image(),
     * Gutenberg image blocks, wp_get_attachment_image_src()
     */
    public function rewrite_image_src(
        $image,
        int $attachment_id,
        $size,
        bool $icon
    ) {
        if (!$image) return $image;
        if (!get_post_meta($attachment_id, '_s3mo_offloaded', true)) {
            return $image;
        }

        $upload_dir = wp_get_upload_dir();
        $cdn_base   = $this->client->get_url_base()
                    . '/' . $this->prefix;

        $image[0] = str_replace(
            $upload_dir['baseurl'],
            $cdn_base,
            $image[0]
        );

        return $image;
    }

    // =========================================================
    // DELETION HANDLER
    // =========================================================

    /**
     * Delete all S3 objects when attachment is deleted
     *
     * delete_attachment fires BEFORE WordPress removes the
     * database records, so metadata is still available.
     */
    public function handle_delete(
        int $post_id,
        $post
    ): void {
        if (!get_post_meta($post_id, '_s3mo_offloaded', true)) {
            return;
        }

        $metadata      = wp_get_attachment_metadata($post_id);
        $attached_file = get_post_meta(
            $post_id, '_wp_attached_file', true
        );

        // Delete main file
        $this->client->delete(
            $this->prefix . '/' . $attached_file
        );

        // Delete all thumbnails
        if (!empty($metadata['sizes'])) {
            $sub_dir = dirname($attached_file);
            foreach ($metadata['sizes'] as $size_data) {
                $this->client->delete(
                    $this->prefix . '/'
                    . $sub_dir . '/' . $size_data['file']
                );
            }
        }

        // Delete original_image if it exists
        if (!empty($metadata['original_image'])) {
            $this->client->delete(
                $this->prefix . '/'
                . dirname($attached_file) . '/'
                . $metadata['original_image']
            );
        }
    }
}
```

---

## Phase 6: URL Rewriting System

The URL rewriting is already built into the Uploader class above (Phase 5.2). Here's why all three filters are needed:

### 6.1 Why Three Separate Filters?

WordPress serves images through multiple code paths, and each needs its own filter:

| Filter | What It Handles | If Missing, Breaks... |
|--------|----------------|----------------------|
| `wp_get_attachment_url` | Single image URL | Featured images, `get_the_post_thumbnail()` |
| `wp_calculate_image_srcset` | Responsive srcset URLs | All responsive images (srcset attribute silently drops) |
| `wp_get_attachment_image_src` | Image src arrays | `wp_get_attachment_image()`, Gutenberg image blocks |

> ⚠️ **Srcset validation:** WordPress checks that all srcset URLs share a common upload directory base with the primary `src`. If your `src` is rewritten but `srcset` is not, WordPress will silently strip the entire `srcset` attribute — your responsive images will just stop working with no error message.

---

## Phase 7: Deletion Handler

The deletion handler is already built into the Uploader class above (Phase 5.2, bottom section).

> ⚠️ **Hook timing:** `delete_attachment` fires BEFORE WordPress removes the database records, so `wp_get_attachment_metadata()` and `get_post_meta()` still work. This is why it is the correct hook — using `deleted_post` would be too late.

---

## Phase 8: Admin Settings Page

Create a settings page under Media in the WordPress admin that shows connection status, configuration options, and media library stats.

### 8.1 Create the Settings Page Class

Create `admin/class-s3mo-settings-page.php`:

```php
<?php
// Prevent direct access
defined('ABSPATH') || exit;

class S3MO_Settings_Page {
    private S3MO_Client $client;

    public function __construct(S3MO_Client $client) {
        $this->client = $client;
    }

    public function register_hooks(): void {
        add_action('admin_menu', [$this, 'add_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action(
            'wp_ajax_s3mo_test_connection',
            [$this, 'ajax_test_connection']
        );
    }

    public function add_menu(): void {
        add_media_page(
            'S3 Offloader Settings',
            'S3 Offloader',
            'manage_options',
            's3-media-offloader',
            [$this, 'render_page']
        );
    }

    public function register_settings(): void {
        register_setting('s3mo_settings', 's3mo_delete_local');
        register_setting('s3mo_settings', 's3mo_path_prefix');
    }

    public function render_page(): void {
        $result = $this->client->test_connection();
        ?>
        <div class="wrap">
            <h1>S3 Media Offloader</h1>

            <!-- Connection Status Box -->
            <div class="card" style="max-width:600px;
                 padding:16px;margin-bottom:20px;">
                <h2>Connection Status</h2>
                <?php if ($result['success']): ?>
                    <p style="color:green;font-size:16px;">
                        &#10004; Connected to bucket:
                        <strong>
                            <?= esc_html(S3MO_BUCKET) ?>
                        </strong>
                    </p>
                <?php else: ?>
                    <p style="color:red;font-size:16px;">
                        &#10008; Connection Failed:
                        <?= esc_html($result['message']) ?>
                    </p>
                <?php endif; ?>
                <p><strong>Region:</strong>
                   <?= esc_html(S3MO_REGION) ?></p>
                <p><strong>CDN URL:</strong>
                   <?= esc_html(
                       $this->client->get_url_base()
                   ) ?></p>
            </div>

            <!-- Settings Form -->
            <form method="post" action="options.php">
                <?php settings_fields('s3mo_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th>S3 Path Prefix</th>
                        <td>
                            <input type="text"
                                name="s3mo_path_prefix"
                                value="<?= esc_attr(
                                    get_option('s3mo_path_prefix',
                                    'wp-content/uploads')
                                ) ?>"
                                class="regular-text">
                            <p class="description">
                                S3 key prefix for uploaded files.
                                Default: wp-content/uploads
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th>Delete Local Files</th>
                        <td>
                            <label>
                                <input type="checkbox"
                                    name="s3mo_delete_local"
                                    value="1"
                                    <?php checked(
                                        get_option(
                                            's3mo_delete_local'
                                        ), true
                                    ); ?>>
                                Delete local copies after
                                successful S3 upload
                            </label>
                            <p class="description">
                                Saves disk space on your server
                                but breaks local image editing
                                and thumbnail regeneration.
                            </p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>

            <!-- Stats -->
            <?php $this->render_stats(); ?>
        </div>
        <?php
    }

    private function render_stats(): void {
        global $wpdb;
        $total = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM $wpdb->posts
             WHERE post_type = 'attachment'"
        );
        $offloaded = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM $wpdb->postmeta
                 WHERE meta_key = %s",
                '_s3mo_offloaded'
            )
        );
        $remaining = $total - $offloaded;
        $percent   = $total > 0
                   ? round(($offloaded / $total) * 100)
                   : 0;
        ?>
        <div class="card" style="max-width:600px;padding:16px;">
            <h2>Media Library Stats</h2>
            <p>Total attachments:
                <strong><?= $total ?></strong></p>
            <p>Offloaded to S3:
                <strong style="color:#46b450;">
                    <?= $offloaded ?>
                </strong>
                (<?= $percent ?>%)</p>
            <p>Remaining on local:
                <strong style="color:#dc3232;">
                    <?= $remaining ?>
                </strong></p>
            <?php if ($remaining > 0): ?>
                <p><em>Use WP-CLI to migrate:
                    <code>wp s3-offload migrate</code></em></p>
            <?php endif; ?>
        </div>
        <?php
    }

    public function ajax_test_connection(): void {
        check_ajax_referer('s3mo_test_nonce');
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        wp_send_json($this->client->test_connection());
    }
}
```

---

## Phase 9: WP-CLI Migration Command

For existing media libraries, you need a way to bulk-migrate files to S3. WP-CLI runs from the command line with no timeout limits — perfect for large libraries.

### 9.1 Create the CLI Commands Class

Create `cli/class-s3mo-commands.php`:

```php
<?php
// Prevent direct access
defined('ABSPATH') || exit;

class S3MO_Commands {

    /**
     * Migrate existing media to S3.
     *
     * ## OPTIONS
     *
     * [--batch=<number>]
     * : Process in batches. Default 50.
     *
     * [--dry-run]
     * : Show what would be migrated without uploading.
     *
     * ## EXAMPLES
     *
     *     wp s3-offload migrate
     *     wp s3-offload migrate --batch=100
     *     wp s3-offload migrate --dry-run
     */
    public function migrate($args, $assoc_args) {
        $batch = (int) ($assoc_args['batch'] ?? 50);
        $dry   = isset($assoc_args['dry-run']);

        $client = new S3MO_Client();
        $test   = $client->test_connection();
        if (!$test['success']) {
            WP_CLI::error(
                'Cannot connect to S3: ' . $test['message']
            );
        }

        $prefix = get_option(
            's3mo_path_prefix', 'wp-content/uploads'
        );

        // Get un-offloaded attachments
        $ids = get_posts([
            'post_type'      => 'attachment',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'meta_query'     => [[
                'key'     => '_s3mo_offloaded',
                'compare' => 'NOT EXISTS'
            ]],
        ]);

        $count = count($ids);
        if ($count === 0) {
            WP_CLI::success(
                'All attachments are already on S3!'
            );
            return;
        }

        WP_CLI::log("Found {$count} attachments to migrate.");

        if ($dry) {
            WP_CLI::success(
                'Dry run complete. No files were uploaded.'
            );
            return;
        }

        $progress = \WP_CLI\Utils\make_progress_bar(
            'Migrating to S3', $count
        );

        $success = 0;
        $failed  = 0;

        foreach ($ids as $id) {
            $upload_dir = wp_get_upload_dir();
            $attached   = get_post_meta(
                $id, '_wp_attached_file', true
            );

            if (empty($attached)) {
                $failed++;
                $progress->tick();
                continue;
            }

            $base_dir = trailingslashit(
                $upload_dir['basedir']
            ) . dirname($attached);

            $main_path = trailingslashit(
                $upload_dir['basedir']
            ) . $attached;

            // Skip if local file doesn't exist
            if (!file_exists($main_path)) {
                WP_CLI::warning(
                    "File not found for attachment {$id}: "
                    . $attached
                );
                $failed++;
                $progress->tick();
                continue;
            }

            // Upload main file
            $ok = $client->upload(
                $main_path,
                $prefix . '/' . $attached
            );

            if (!$ok) {
                $failed++;
                $progress->tick();
                continue;
            }

            // Upload thumbnails
            $meta = wp_get_attachment_metadata($id);
            if (!empty($meta['sizes'])) {
                $sub = dirname($attached);
                foreach ($meta['sizes'] as $data) {
                    $thumb = $base_dir
                        . '/' . $data['file'];
                    if (file_exists($thumb)) {
                        $client->upload(
                            $thumb,
                            $prefix . '/' . $sub
                                . '/' . $data['file']
                        );
                    }
                }
            }

            // Upload original_image (WP 5.3+)
            if (!empty($meta['original_image'])) {
                $orig = $base_dir
                    . '/' . $meta['original_image'];
                if (file_exists($orig)) {
                    $client->upload(
                        $orig,
                        $prefix . '/'
                            . dirname($attached) . '/'
                            . $meta['original_image']
                    );
                }
            }

            update_post_meta(
                $id, '_s3mo_offloaded', true
            );
            $success++;
            $progress->tick();
        }

        $progress->finish();
        WP_CLI::success(
            "Done! {$success} migrated, {$failed} failed."
        );
    }

    /**
     * Show offload status.
     *
     * ## EXAMPLES
     *
     *     wp s3-offload status
     */
    public function status() {
        global $wpdb;
        $total = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM $wpdb->posts
             WHERE post_type = 'attachment'"
        );
        $offloaded = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM $wpdb->postmeta
                 WHERE meta_key = %s",
                '_s3mo_offloaded'
            )
        );
        $remaining = $total - $offloaded;

        WP_CLI::log("Total attachments: {$total}");
        WP_CLI::log("Offloaded to S3:   {$offloaded}");
        WP_CLI::log("Remaining:         {$remaining}");

        $client = new S3MO_Client();
        $test   = $client->test_connection();
        WP_CLI::log(
            'S3 Connection: '
            . ($test['success'] ? '✅ OK' : '❌ FAILED')
        );
    }
}
```

### 9.2 Using WP-CLI in Local by Flywheel

To run WP-CLI commands:

1. **Right-click your site** in Local by Flywheel
2. Select **"Open Site Shell"**
3. Run commands:

```bash
# Check status
wp s3-offload status

# Dry run (see what would be migrated)
wp s3-offload migrate --dry-run

# Run the actual migration
wp s3-offload migrate

# Larger batches for big libraries
wp s3-offload migrate --batch=200
```

---

## Phase 10: Media Library UI Enhancements

The S3 status column is already included in the main plugin bootstrap file (Phase 3.2). When you view the Media Library in **list mode**, you will see a new "S3 Status" column showing:

- **✅ On S3** (green) — for offloaded files
- **❌ Local Only** (red) — for files not yet migrated

To switch to list mode: in the Media Library, click the list icon (looks like horizontal lines) in the top-left area next to "Add New Media."

---

## Phase 11: CloudFront CDN Setup

CloudFront sits in front of S3 and delivers your images from edge locations worldwide. S3-to-CloudFront transfer is free, and CloudFront egress is cheaper than direct S3 egress.

### 11.1 Create a CloudFront Distribution

- **Navigate:** AWS Console → CloudFront → Create Distribution
- **Origin domain:** Select your S3 bucket from the dropdown (NOT the website endpoint)
- **Origin Access:** Origin Access Control (OAC) — click "Create new OAC"
- **Viewer Protocol Policy:** Redirect HTTP to HTTPS
- **Cache Policy:** CachingOptimized (managed)
- **Alternate Domain (CNAME):** `cdn.yourdomain.com`
- **SSL Certificate:** Request via ACM (must be in `us-east-1` region)
- Click **Create distribution**

### 11.2 Update S3 Bucket Policy for OAC

CloudFront will show a yellow banner prompting you to update the bucket policy. Click the **"Copy policy"** button, then:

- **Navigate:** S3 → your-site-media → Permissions → Bucket Policy → Edit
- Paste the policy (it will look like this — AWS fills in the IDs for you):

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Principal": {
      "Service": "cloudfront.amazonaws.com"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-site-media/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn":
          "arn:aws:cloudfront::ACCOUNT_ID:distribution/DIST_ID"
      }
    }
  }
}
```

### 11.3 Configure DNS

Add a CNAME record with your domain registrar or DNS provider:

```
cdn.yourdomain.com  CNAME  d1234abcdef.cloudfront.net
```

(Replace `d1234abcdef.cloudfront.net` with your actual CloudFront distribution domain — shown on the distribution's details page.)

### 11.4 Update wp-config.php

Replace the empty CDN URL with your CloudFront domain:

```php
define('S3MO_CDN_URL', 'https://cdn.yourdomain.com');
```

The plugin will now rewrite all media URLs to use your CloudFront CDN automatically. No code changes needed — the Client class checks this constant.

---

## Phase 12: Testing & Deployment

Before going live, systematically test every part of the plugin.

### 12.1 Testing Checklist (Local by Flywheel)

| # | Test | Expected Result |
|---|------|----------------|
| 1 | Activate plugin in WP Admin | No errors, settings page appears under Media |
| 2 | Visit Media → S3 Offloader | Green checkmark, shows your bucket name |
| 3 | Upload a new image via Media Library | Image appears on S3 with all thumb sizes |
| 4 | View image URL (right-click → copy image address) | URL points to S3/CDN, not local server |
| 5 | Inspect page source for `srcset` attribute | All srcset URLs point to S3/CDN |
| 6 | Delete an image from Media Library | Objects removed from S3 bucket |
| 7 | Upload image > 2560px wide | Scaled + original_image both on S3 |
| 8 | Upload a PDF / non-image file | File uploads to S3, URL rewrites correctly |
| 9 | Open Site Shell, run `wp s3-offload status` | Shows correct counts |
| 10 | Run `wp s3-offload migrate --dry-run` | Reports count without uploading |
| 11 | Check Media Library list view | S3 Status column shows green/red indicators |
| 12 | Deactivate and reactivate plugin | No data loss, images still serve from S3 |

### 12.2 Deploying to Production

Since you're using Local by Flywheel for development, here's how to deploy to your live server:

**Step 1 — Prepare the plugin folder:**

Copy your entire `s3-media-offloader/` directory including the `aws-sdk/` folder. The folder should contain:

```
s3-media-offloader/
├── s3-media-offloader.php
├── uninstall.php
├── includes/
├── admin/
├── cli/
└── aws-sdk/         ← This is ~50MB, it's normal
```

**Step 2 — Upload to production:**

Upload the plugin folder to your production server via SFTP/SSH:

```
/your-site/wp-content/plugins/s3-media-offloader/
```

Or zip the folder and install via **Plugins → Add New → Upload Plugin** in WordPress admin.

**Step 3 — Add credentials to production wp-config.php:**

```php
/* S3 Media Offloader Configuration */
define('S3MO_BUCKET', 'your-site-media');
define('S3MO_REGION', 'us-east-1');
define('S3MO_KEY',    'YOUR_ACTUAL_ACCESS_KEY');
define('S3MO_SECRET', 'YOUR_ACTUAL_SECRET_KEY');
define('S3MO_CDN_URL', 'https://cdn.yourdomain.com');
```

**Step 4 — Activate and verify:**

1. Activate the plugin in WordPress admin
2. Go to **Media → S3 Offloader** — verify green connection status
3. Upload a test image to confirm it reaches S3

**Step 5 — Migrate existing media:**

SSH into your production server and run:

```bash
# Preview what will be migrated
wp s3-offload migrate --dry-run

# Run the migration
wp s3-offload migrate
```

> ⚠️ **Backup first!** Before running the migration, back up your database and `wp-content/uploads` directory. The migration is additive (copies to S3) but always have a rollback plan.

---

## Appendix A: Complete File Structure

```
s3-media-offloader/
├── s3-media-offloader.php          # Main bootstrap file
├── uninstall.php                   # Cleanup on plugin deletion
├── includes/
│   ├── class-s3mo-client.php       # AWS SDK wrapper
│   └── class-s3mo-uploader.php     # Upload, URL rewrite, delete
├── admin/
│   └── class-s3mo-settings-page.php  # Admin settings UI
├── cli/
│   └── class-s3mo-commands.php     # WP-CLI migration commands
└── aws-sdk/                        # AWS SDK (downloaded zip)
    ├── aws-autoloader.php          # SDK autoloader
    ├── Aws/
    ├── GuzzleHttp/
    ├── Psr/
    └── ...
```

**Key differences from Composer version:**

| Aspect | Composer Version | Local by Flywheel Version |
|--------|-----------------|--------------------------|
| SDK loading | `vendor/autoload.php` | `aws-sdk/aws-autoloader.php` |
| Class loading | PSR-4 autoload | Manual `require_once` |
| Class naming | Namespaced (`S3MediaOffloader\S3\Client`) | Prefixed (`S3MO_Client`) |
| Directory layout | `src/S3/`, `src/CLI/`, `src/Admin/` | `includes/`, `cli/`, `admin/` |
| Dependency install | `composer install` | Download zip, extract |
| Deployment | Upload code + run composer | Upload entire folder including aws-sdk/ |

---

## Appendix B: Realistic Cost Breakdown

S3 Standard storage: **$0.023 per GB/month**. Data transfer to CloudFront: **free**. CloudFront to internet: **$0.085/GB** (first 10 TB).

| Site Profile | S3 Storage | CloudFront Delivery | Monthly Total |
|-------------|-----------|--------------------| --------------|
| 5 GB / 50K views | $0.12 | ~$9.00 | **~$9** |
| 10 GB / 100K views | $0.23 | ~$18.00 | **~$18** |
| 50 GB / 200K views | $1.15 | ~$90.00 | **~$91** |

> CloudFront's Free Tier includes 100 GB transfer and 1M requests/month — perpetually, not just the first 12 months. Many small WordPress sites can operate entirely within this free tier.

---

## Appendix C: Troubleshooting

**"AWS SDK not found" admin notice**
The `aws-autoloader.php` file isn't at the expected path. Check that it's at `wp-content/plugins/s3-media-offloader/aws-sdk/aws-autoloader.php`. If you extracted the zip into a subfolder, you may have `aws-sdk/aws/aws-autoloader.php` instead — move the contents up one level.

**"Access Denied" on upload**
Your IAM policy is missing `s3:PutObject` permission, or the bucket name in the policy doesn't match `S3MO_BUCKET`. Double-check the ARN format: `arn:aws:s3:::bucket-name/*` (three colons before bucket name).

**Plugin shows "Add constants to wp-config.php" warning**
You either haven't added the `S3MO_*` constants, or they're placed BELOW the `/* That's all, stop editing! */` line. Move them above that line.

**Images upload but URLs are still local**
The `_s3mo_offloaded` meta isn't being set, or the URL rewrite filter priority is too low. Verify by checking the database: `wp postmeta list --meta_key=_s3mo_offloaded` in the Site Shell.

**Responsive images (srcset) not showing CDN URLs**
WordPress validates that srcset URLs share a common base with the primary `src`. If `src` is rewritten but `srcset` is not, WordPress silently strips the entire `srcset` attribute. Ensure the `wp_calculate_image_srcset` filter is running (check for plugin conflicts at priority 99).

**WP-CLI commands not found**
Make sure you're using Local by Flywheel's **Site Shell** (right-click → "Open Site Shell"), not your system terminal. The Site Shell has the correct PHP and WP-CLI paths configured.

**Migration command times out**
WP-CLI shouldn't hit PHP timeout limits, but if your host enforces them, use smaller batches: `wp s3-offload migrate --batch=25`

**CloudFront returns 403 Forbidden**
The bucket policy is missing or the OAC `SourceArn` condition doesn't match your distribution. The easiest fix: go to your CloudFront distribution, click the Origins tab, and re-copy the bucket policy from the yellow banner.

**Plugin is slow to activate**
The AWS SDK zip is ~50MB. First activation may take a moment as PHP parses the autoloader. This is normal and only happens once per page load — the autoloader only loads classes as they're needed.

---

*Built by CT Web Design Shop Inc. — ctwebdesignshop.com*
