# Build Your Own WordPress S3 Media Offloader Plugin

**Complete Step-by-Step Development Guide — From AWS Setup to Production Deployment**

No Paid Plugins Required | CT Web Design Shop Inc. | February 2026

---

## Table of Contents

- [Phase 1: AWS Infrastructure Setup](#phase-1-aws-infrastructure-setup)
- [Phase 2: Local Development Environment](#phase-2-local-development-environment)
- [Phase 3: Plugin Scaffolding](#phase-3-plugin-scaffolding)
- [Phase 4: AWS SDK Integration](#phase-4-aws-sdk-integration)
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

### 1.2 Create a Dedicated IAM User

Never use your root account credentials in your plugin. Create a dedicated user with minimal permissions.

- **Navigate:** AWS Console → IAM → Users → Create User
- **User name:** `wordpress-s3-uploader`
- **Access type:** Programmatic access (Access Key)
- **Do NOT** attach any AWS managed policies — we will create a custom one

### 1.3 Create the S3 Bucket

- **Navigate:** AWS Console → S3 → Create Bucket
- **Bucket name:** `your-site-media` (must be globally unique)
- **Region:** Choose the region closest to your server (e.g., `us-east-1`)
- **Block Public Access:** Keep ALL four checkboxes **ENABLED**
  - We will serve files through CloudFront, not directly from S3
  - This is the most secure architecture
- **Versioning:** Disabled (unless you want file history)
- **Encryption:** SSE-S3 (default, free)

### 1.4 Create a Custom IAM Policy

This policy grants only the four S3 operations your plugin needs — nothing more.

- **Navigate:** IAM → Policies → Create Policy → JSON tab

Paste this policy (replace `your-site-media` with your actual bucket name):

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

- **Policy name:** `WordPress-S3-Media-Access`
- Attach this policy to your `wordpress-s3-uploader` IAM user

### 1.5 Generate Access Keys

- **Navigate:** IAM → Users → wordpress-s3-uploader → Security Credentials
- Click **Create Access Key** → select "Application running outside AWS"
- **Save both keys immediately** — the Secret Key is shown only once

> ⚠️ Store these keys securely. You will add them to **wp-config.php** in Phase 4. Never commit them to Git or store them in the WordPress database.

### 1.6 Configure CORS on Your Bucket

CORS allows the WordPress admin to interact with S3 for media library operations.

- **Navigate:** S3 → your-site-media → Permissions → CORS

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

> ⚠️ Replace `https://yourdomain.com` with your actual WordPress site URL.

---

## Phase 2: Local Development Environment

Set up your local development environment with the tools you need to build and test the plugin.

### 2.1 Prerequisites

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| PHP | 8.1+ | Required by AWS SDK v3 |
| Composer | 2.x | PHP dependency manager |
| WordPress | 6.0+ | Core platform |
| WP-CLI | 2.x | Migration commands |
| AWS CLI | 2.x (optional) | Bulk migration helper |

### 2.2 Install Composer (if not installed)

```bash
# macOS
brew install composer

# Linux
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Verify
composer --version
```

### 2.3 Local WordPress Setup

Use your existing local WordPress environment (LocalWP, MAMP, Docker, Vagrant, etc). The plugin will be developed directly in:

```
wp-content/plugins/s3-media-offloader/
```

---

## Phase 3: Plugin Scaffolding

Create the complete directory structure and all files your plugin needs before writing any logic.

### 3.1 Create the Plugin Directory Structure

Run these commands from your WordPress installation root:

```bash
cd wp-content/plugins/
mkdir -p s3-media-offloader/src/S3
mkdir -p s3-media-offloader/src/CLI
mkdir -p s3-media-offloader/src/Admin
mkdir -p s3-media-offloader/assets/css
mkdir -p s3-media-offloader/assets/js
cd s3-media-offloader
```

### 3.2 Create composer.json

This file manages the AWS SDK dependency and sets up PSR-4 autoloading for your classes.

```json
{
  "name": "ctwebdesign/s3-media-offloader",
  "description": "WordPress S3 Media Offloader",
  "type": "wordpress-plugin",
  "require": {
    "php": ">=8.1",
    "aws/aws-sdk-php": "^3.0"
  },
  "autoload": {
    "psr-4": {
      "S3MediaOffloader\\": "src/"
    }
  }
}
```

### 3.3 Create the Main Plugin Bootstrap File

Create `s3-media-offloader.php` in the plugin root. This is the entry point WordPress reads:

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

// Load Composer autoloader
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    add_action('admin_notices', function() {
        echo '<div class="error"><p>S3 Media Offloader: ' .
             'Run <code>composer install</code> in the ' .
             'plugin directory.</p></div>';
    });
    return;
}

// Boot the plugin
add_action('plugins_loaded', function() {
    $plugin = new S3MediaOffloader\Plugin();
    $plugin->init();
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

### 3.4 Create the uninstall.php File

This file runs ONLY when the plugin is deleted from WordPress, not when deactivated. It cleans up all plugin data.

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

### 3.5 Create the Plugin Main Class

Create `src/Plugin.php` — this is the orchestrator that wires all hooks together:

```php
<?php
namespace S3MediaOffloader;

use S3MediaOffloader\S3\Client;
use S3MediaOffloader\S3\Uploader;
use S3MediaOffloader\Admin\SettingsPage;

class Plugin {
    private ?Client $client = null;

    public function init(): void {
        // Only initialize if credentials are configured
        if (!$this->has_credentials()) {
            add_action('admin_notices', [$this, 'missing_config_notice']);
            return;
        }

        $this->client = new Client();
        $uploader = new Uploader($this->client);
        $uploader->register_hooks();

        // Admin settings
        if (is_admin()) {
            $settings = new SettingsPage($this->client);
            $settings->register_hooks();

            // Add S3 status column to media list
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
            \WP_CLI::add_command(
                's3-offload',
                'S3MediaOffloader\CLI\Commands'
            );
        }
    }

    private function has_credentials(): bool {
        return defined('S3MO_BUCKET')
            && defined('S3MO_REGION')
            && defined('S3MO_KEY')
            && defined('S3MO_SECRET');
    }

    public function missing_config_notice(): void {
        echo '<div class="notice notice-warning"><p>';
        echo '<strong>S3 Media Offloader:</strong> ';
        echo 'Add S3MO_BUCKET, S3MO_REGION, S3MO_KEY, ';
        echo 'and S3MO_SECRET constants to wp-config.php';
        echo '</p></div>';
    }
}
```

---

## Phase 4: AWS SDK Integration

Install the AWS SDK and create the client wrapper class that handles all S3 communication.

### 4.1 Install the AWS SDK via Composer

```bash
cd wp-content/plugins/s3-media-offloader
composer install
```

This downloads the AWS SDK and all dependencies into the `vendor/` directory. The autoloader handles class loading automatically.

> ⚠️ **Add `vendor/` to your `.gitignore`** and run `composer install` on deployment. Never commit the vendor directory to Git.

### 4.2 Add Credentials to wp-config.php

Open your `wp-config.php` and add these constants **ABOVE** the "That's all, stop editing" comment:

```php
/* S3 Media Offloader Configuration */
define('S3MO_BUCKET', 'your-site-media');
define('S3MO_REGION', 'us-east-1');
define('S3MO_KEY',    'AKIAIOSFODNN7EXAMPLE');
define('S3MO_SECRET', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY');
define('S3MO_CDN_URL', '');  // Empty until Phase 11
```

### 4.3 Create the S3 Client Wrapper

Create `src/S3/Client.php` — this wraps the AWS SDK in a clean interface:

```php
<?php
namespace S3MediaOffloader\S3;

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class Client {
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

    public function get_bucket(): string {
        return $this->bucket;
    }

    public function get_url_base(): string {
        $cdn = defined('S3MO_CDN_URL') ? S3MO_CDN_URL : '';
        if (!empty($cdn)) return rtrim($cdn, '/');
        return "https://{$this->bucket}.s3.{$this->region}.amazonaws.com";
    }

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

Create `src/S3/Uploader.php`:

```php
<?php
namespace S3MediaOffloader\S3;

class Uploader {
    private Client $client;
    private string $prefix;

    public function __construct(Client $client) {
        $this->client = $client;
        $this->prefix = get_option(
            's3mo_path_prefix',
            'wp-content/uploads'
        );
    }

    public function register_hooks(): void {
        // Upload after all thumbnails are generated
        add_filter(
            'wp_generate_attachment_metadata',
            [$this, 'handle_upload'],
            20, 3
        );

        // URL rewriting
        add_filter(
            'wp_get_attachment_url',
            [$this, 'rewrite_url'],
            99, 2
        );

        // Responsive image srcset rewriting
        add_filter(
            'wp_calculate_image_srcset',
            [$this, 'rewrite_srcset'],
            99, 5
        );

        // Image src array rewriting
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

    /**
     * Upload original + all thumbnails to S3
     */
    public function handle_upload(
        array $metadata,
        int $attachment_id,
        string $context
    ): array {
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
        if (!empty($metadata['original_image'])) {
            $this->client->upload(
                $base_dir . '/' . $metadata['original_image'],
                $this->prefix . '/'
                    . dirname($attached_file) . '/'
                    . $metadata['original_image']
            );
        }

        // Mark as offloaded
        update_post_meta(
            $attachment_id, '_s3mo_offloaded', true
        );

        // Optionally delete local copy
        if (get_option('s3mo_delete_local', false)) {
            $this->delete_local_files(
                $metadata, $upload_dir, $attached_file
            );
        }

        return $metadata;
    }

    private function delete_local_files(
        array $metadata,
        array $upload_dir,
        string $attached_file
    ): void {
        $basedir = trailingslashit($upload_dir['basedir']);
        @unlink($basedir . $attached_file);

        if (!empty($metadata['sizes'])) {
            $dir = dirname($attached_file);
            foreach ($metadata['sizes'] as $data) {
                @unlink($basedir . $dir . '/' . $data['file']);
            }
        }

        if (!empty($metadata['original_image'])) {
            @unlink(
                $basedir . dirname($attached_file)
                . '/' . $metadata['original_image']
            );
        }
    }

    // =========================================================
    // URL REWRITING (Phase 6)
    // =========================================================

    /**
     * Rewrite single attachment URL to S3/CDN
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
    // DELETION HANDLER (Phase 7)
    // =========================================================

    /**
     * Delete all S3 objects when attachment is deleted
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

> ⚠️ **About `big_image_size_threshold`:** Since WordPress 5.3, images larger than 2560px are scaled down. The original is stored in `metadata["original_image"]`. Your plugin must upload this file too, or full-resolution downloads will break.

---

## Phase 6: URL Rewriting System

With files on S3, WordPress still generates local URLs. The three rewriting methods in the Uploader class above handle every URL path.

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

The `handle_delete` method in the Uploader class (shown above) removes all S3 objects when an attachment is deleted from the WordPress media library.

> ⚠️ **Hook timing:** `delete_attachment` fires BEFORE WordPress removes the database records, so `wp_get_attachment_metadata()` and `get_post_meta()` still work. This is why it is the correct hook — using `deleted_post` would be too late.

---

## Phase 8: Admin Settings Page

Create a settings page under Media in the WordPress admin that shows connection status, lets admins configure options, and test the S3 connection.

### 8.1 Create the Settings Page Class

Create `src/Admin/SettingsPage.php`:

```php
<?php
namespace S3MediaOffloader\Admin;

use S3MediaOffloader\S3\Client;

class SettingsPage {
    private Client $client;

    public function __construct(Client $client) {
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
                    <p style="color:green;">
                        &#10004; Connected to bucket:
                        <strong>
                            <?= esc_html(S3MO_BUCKET) ?>
                        </strong>
                    </p>
                <?php else: ?>
                    <p style="color:red;">
                        &#10008;
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
                            <input type="text" name="s3mo_path_prefix"
                                value="<?= esc_attr(
                                    get_option('s3mo_path_prefix',
                                    'wp-content/uploads')
                                ) ?>"
                                class="regular-text">
                            <p class="description">
                                S3 key prefix for uploaded files.
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
                                Delete local copies after upload
                            </label>
                            <p class="description">
                                Saves disk space but breaks local
                                image editing tools.
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
        ?>
        <div class="card" style="max-width:600px;padding:16px;">
            <h2>Media Library Stats</h2>
            <p>Total attachments: <strong>
               <?= $total ?></strong></p>
            <p>Offloaded to S3: <strong>
               <?= $offloaded ?></strong></p>
            <p>Remaining: <strong>
               <?= $total - $offloaded ?></strong></p>
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

For existing media libraries, you need a way to bulk-migrate files to S3. WP-CLI is the right tool — it runs from the command line with no timeout limits.

### 9.1 Create the CLI Commands Class

Create `src/CLI/Commands.php`:

```php
<?php
namespace S3MediaOffloader\CLI;

use S3MediaOffloader\S3\Client;
use WP_CLI;

class Commands {

    /**
     * Migrate existing media to S3.
     *
     * ## OPTIONS
     *
     * [--batch=<number>]
     * : Process in batches. Default 50.
     *
     * [--dry-run]
     * : Show what would be migrated.
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

        $client = new Client();
        $test   = $client->test_connection();
        if (!$test['success']) {
            WP_CLI::error('Cannot connect: ' . $test['message']);
        }

        $prefix = get_option('s3mo_path_prefix',
            'wp-content/uploads');

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
            WP_CLI::success('All attachments already offloaded.');
            return;
        }

        WP_CLI::log("Found {$count} attachments to migrate.");

        if ($dry) {
            WP_CLI::success('Dry run complete. No files uploaded.');
            return;
        }

        $progress = \WP_CLI\Utils\make_progress_bar(
            'Migrating', $count
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

            // Upload main file
            if (!file_exists($main_path)) {
                $failed++;
                $progress->tick();
                continue;
            }

            $ok = $client->upload(
                $main_path, $prefix . '/' . $attached
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

            // Upload original_image
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
            "Done. {$success} migrated, {$failed} failed."
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
        WP_CLI::log("Total attachments: {$total}");
        WP_CLI::log("Offloaded to S3:   {$offloaded}");
        WP_CLI::log(
            "Remaining:         " . ($total - $offloaded)
        );

        $client = new Client();
        $test   = $client->test_connection();
        WP_CLI::log('S3 Connection: '
            . ($test['success'] ? 'OK' : 'FAILED'));
    }
}
```

### 9.2 Usage

```bash
# Check status
wp s3-offload status

# Dry run (see what would be migrated)
wp s3-offload migrate --dry-run

# Run the migration
wp s3-offload migrate

# Larger batches for big libraries
wp s3-offload migrate --batch=200
```

---

## Phase 10: Media Library UI Enhancements

The S3 status column is already included in the `Plugin.php` class from Phase 3.5. When you view the Media Library in list mode, you will see a new "S3 Status" column showing:

- **✅ On S3** (green) — for offloaded files
- **❌ Local Only** (red) — for files not yet migrated

---

## Phase 11: CloudFront CDN Setup

CloudFront sits in front of S3 and delivers your images from edge locations worldwide. S3-to-CloudFront transfer is free, and CloudFront egress is cheaper than direct S3 egress.

### 11.1 Create a CloudFront Distribution

- **Navigate:** AWS Console → CloudFront → Create Distribution
- **Origin domain:** Select your S3 bucket (NOT the website endpoint)
- **Origin Access:** Origin Access Control (OAC) — Create new OAC
- **Viewer Protocol Policy:** Redirect HTTP to HTTPS
- **Cache Policy:** CachingOptimized (managed)
- **Alternate Domain (CNAME):** `cdn.yourdomain.com`
- **SSL Certificate:** Request via ACM in `us-east-1` region

### 11.2 Update S3 Bucket Policy for OAC

CloudFront will prompt you to update the bucket policy. Apply this (replacing `ACCOUNT_ID` and `DIST_ID`):

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

Add a CNAME record in your DNS:

```
cdn.yourdomain.com  CNAME  d1234abcdef.cloudfront.net
```

### 11.4 Update wp-config.php

Replace the empty CDN URL with your CloudFront domain:

```php
define('S3MO_CDN_URL', 'https://cdn.yourdomain.com');
```

The plugin will now rewrite all media URLs to use your CloudFront CDN automatically.

---

## Phase 12: Testing & Deployment

Before going live, systematically test every part of the plugin.

### 12.1 Testing Checklist

| # | Test | Expected Result |
|---|------|----------------|
| 1 | Upload a new image via Media Library | Image appears on S3 with all thumb sizes |
| 2 | View image URL in browser (right-click → copy) | URL points to CDN, not local server |
| 3 | Inspect page source for srcset attribute | All srcset URLs point to CDN |
| 4 | Delete an image from Media Library | Objects removed from S3 bucket |
| 5 | Upload image > 2560px wide | Scaled + original_image both on S3 |
| 6 | Upload a PDF / non-image file | File uploads to S3, URL rewrites |
| 7 | Run `wp s3-offload status` | Shows correct counts |
| 8 | Run `wp s3-offload migrate --dry-run` | Reports count without uploading |
| 9 | Check Media Library S3 Status column | Green check for offloaded items |
| 10 | Deactivate and reactivate plugin | No data loss, images still serve from S3 |

### 12.2 Production Deployment Steps

1. Upload the plugin directory to your production server (excluding `vendor/`)
2. SSH into the server and run: `cd wp-content/plugins/s3-media-offloader && composer install --no-dev`
3. Add `S3MO_*` constants to production `wp-config.php`
4. Activate the plugin in WordPress admin
5. Check the S3 Offloader settings page for green connection status
6. Upload a test image to verify everything works
7. Run: `wp s3-offload migrate --dry-run` to preview the migration
8. Run: `wp s3-offload migrate` to migrate existing media

> ⚠️ **Backup first!** Before running the migration, back up your database and `wp-content/uploads` directory. The migration is additive (copies to S3) but you should always have a rollback plan.

---

## Appendix A: Complete File Structure

```
s3-media-offloader/
├── composer.json              # Dependencies + autoloading
├── s3-media-offloader.php     # Main bootstrap file
├── uninstall.php              # Cleanup on plugin deletion
├── .gitignore                 # vendor/, .env
├── vendor/                    # Composer dependencies (gitignored)
├── src/
│   ├── Plugin.php             # Main orchestrator class
│   ├── S3/
│   │   ├── Client.php         # AWS SDK wrapper
│   │   └── Uploader.php       # Upload, URL rewrite, delete hooks
│   ├── CLI/
│   │   └── Commands.php       # WP-CLI migration commands
│   └── Admin/
│       └── SettingsPage.php   # Admin settings UI
└── assets/
    ├── css/
    └── js/
```

---

## Appendix B: Realistic Cost Breakdown

S3 Standard storage: **$0.023 per GB/month**. Data transfer to CloudFront: **free**. CloudFront to internet: **$0.085/GB** (first 10 TB).

| Site Profile | S3 Storage | CloudFront Delivery | Monthly Total |
|-------------|-----------|--------------------| --------------|
| 5 GB / 50K views | $0.12 | ~$9.00 | **~$9** |
| 10 GB / 100K views | $0.23 | ~$18.00 | **~$18** |
| 50 GB / 200K views | $1.15 | ~$90.00 | **~$91** |

> CloudFront's Free Tier includes 100 GB transfer and 1M requests/month — perpetually, not just the first 12 months. Many small WordPress sites can operate within this free tier indefinitely.

---

## Appendix C: Troubleshooting

**"Access Denied" on upload**
Your IAM policy is missing `s3:PutObject` permission, or the bucket name in the policy doesn't match `S3MO_BUCKET`. Double-check the ARN format: `arn:aws:s3:::bucket-name/*` (three colons before bucket name).

**Images upload but URLs are still local**
The `_s3mo_offloaded` meta isn't being set, or the URL rewrite filter priority is too low. Check that your `wp_get_attachment_url` filter runs at priority 99 so it fires after all other plugins.

**Responsive images (srcset) not showing CDN URLs**
WordPress validates that srcset URLs share a common base with the primary `src`. If `src` is rewritten but `srcset` is not, WordPress silently strips the entire `srcset` attribute. Ensure your `wp_calculate_image_srcset` filter is registered and running.

**"Class not found" errors after deployment**
You forgot to run `composer install` on the production server, or the `vendor/autoload.php` file is missing. SSH in and run: `cd wp-content/plugins/s3-media-offloader && composer install --no-dev`

**Migration command times out**
WP-CLI should not have PHP timeout limits, but if your host enforces them, add `set_time_limit(0)` at the start of the migrate command, or use `--batch=25` for smaller batches.

**CloudFront returns 403 Forbidden**
The bucket policy is missing or the OAC `SourceArn` condition doesn't match your distribution. Copy the exact ARN from the CloudFront console and update the bucket policy.

---

*Built by CT Web Design Shop Inc. — ctwebdesignshop.com*
