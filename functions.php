<?php
/**
 * Starter WP Theme functions and definitions
 *
 * @package Starter_WP_Theme
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Constants
 */
define('STARTER_THEME_VERSION', '1.0.0');
define('STARTER_THEME_DIR', get_template_directory());
define('STARTER_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function starter_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Add support for editor styles
    add_theme_support('editor-styles');

    // Add support for responsive embeds
    add_theme_support('responsive-embeds');

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'starter-wp-theme'),
        'footer'  => __('Footer Menu', 'starter-wp-theme'),
    ));

    // Set content width
    if (!isset($content_width)) {
        $content_width = 1200;
    }
}
add_action('after_setup_theme', 'starter_theme_setup');

/**
 * Enqueue Scripts and Styles
 */
function starter_theme_scripts() {
    // Enqueue main stylesheet
    wp_enqueue_style(
        'starter-theme-style',
        get_stylesheet_uri(),
        array(),
        STARTER_THEME_VERSION
    );
}
add_action('wp_enqueue_scripts', 'starter_theme_scripts');

/**
 * Register Custom Post Types
 */
function starter_theme_register_post_types() {
    // Services CPT
    register_post_type('services', array(
        'labels' => array(
            'name'                  => __('Services', 'starter-wp-theme'),
            'singular_name'         => __('Service', 'starter-wp-theme'),
            'menu_name'             => __('Services', 'starter-wp-theme'),
            'add_new'               => __('Add New', 'starter-wp-theme'),
            'add_new_item'          => __('Add New Service', 'starter-wp-theme'),
            'edit_item'             => __('Edit Service', 'starter-wp-theme'),
            'new_item'              => __('New Service', 'starter-wp-theme'),
            'view_item'             => __('View Service', 'starter-wp-theme'),
            'view_items'            => __('View Services', 'starter-wp-theme'),
            'search_items'          => __('Search Services', 'starter-wp-theme'),
            'not_found'             => __('No services found', 'starter-wp-theme'),
            'not_found_in_trash'    => __('No services found in Trash', 'starter-wp-theme'),
            'all_items'             => __('All Services', 'starter-wp-theme'),
            'archives'              => __('Service Archives', 'starter-wp-theme'),
            'attributes'            => __('Service Attributes', 'starter-wp-theme'),
            'insert_into_item'      => __('Insert into service', 'starter-wp-theme'),
            'uploaded_to_this_item' => __('Uploaded to this service', 'starter-wp-theme'),
            'featured_image'        => __('Service Image', 'starter-wp-theme'),
            'set_featured_image'    => __('Set service image', 'starter-wp-theme'),
            'remove_featured_image' => __('Remove service image', 'starter-wp-theme'),
            'use_featured_image'    => __('Use as service image', 'starter-wp-theme'),
        ),
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => true,
        'show_in_rest'        => true,
        'rest_base'           => 'services',
        'query_var'           => true,
        'rewrite'             => array('slug' => 'services', 'with_front' => false),
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-portfolio',
        'supports'            => array('title', 'editor', 'thumbnail', 'excerpt', 'revisions'),
    ));

    // Testimonials CPT
    register_post_type('testimonials', array(
        'labels' => array(
            'name'                  => __('Testimonials', 'starter-wp-theme'),
            'singular_name'         => __('Testimonial', 'starter-wp-theme'),
            'menu_name'             => __('Testimonials', 'starter-wp-theme'),
            'add_new'               => __('Add New', 'starter-wp-theme'),
            'add_new_item'          => __('Add New Testimonial', 'starter-wp-theme'),
            'edit_item'             => __('Edit Testimonial', 'starter-wp-theme'),
            'new_item'              => __('New Testimonial', 'starter-wp-theme'),
            'view_item'             => __('View Testimonial', 'starter-wp-theme'),
            'view_items'            => __('View Testimonials', 'starter-wp-theme'),
            'search_items'          => __('Search Testimonials', 'starter-wp-theme'),
            'not_found'             => __('No testimonials found', 'starter-wp-theme'),
            'not_found_in_trash'    => __('No testimonials found in Trash', 'starter-wp-theme'),
            'all_items'             => __('All Testimonials', 'starter-wp-theme'),
            'archives'              => __('Testimonial Archives', 'starter-wp-theme'),
            'attributes'            => __('Testimonial Attributes', 'starter-wp-theme'),
            'insert_into_item'      => __('Insert into testimonial', 'starter-wp-theme'),
            'uploaded_to_this_item' => __('Uploaded to this testimonial', 'starter-wp-theme'),
            'featured_image'        => __('Client Photo', 'starter-wp-theme'),
            'set_featured_image'    => __('Set client photo', 'starter-wp-theme'),
            'remove_featured_image' => __('Remove client photo', 'starter-wp-theme'),
            'use_featured_image'    => __('Use as client photo', 'starter-wp-theme'),
        ),
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => false,
        'show_in_rest'        => true,
        'rest_base'           => 'testimonials',
        'query_var'           => true,
        'rewrite'             => array('slug' => 'testimonials', 'with_front' => false),
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 6,
        'menu_icon'           => 'dashicons-format-quote',
        'supports'            => array('title', 'thumbnail', 'revisions'),
    ));
}
add_action('init', 'starter_theme_register_post_types');

/**
 * Flush rewrite rules on theme activation
 */
function starter_theme_rewrite_flush() {
    starter_theme_register_post_types();
    flush_rewrite_rules();
}
add_action('after_switch_theme', 'starter_theme_rewrite_flush');

/**
 * ACF JSON Save Point
 * Save ACF field groups to theme directory for version control
 */
function starter_theme_acf_json_save_point($path) {
    return STARTER_THEME_DIR . '/acf-json';
}
add_filter('acf/settings/save_json', 'starter_theme_acf_json_save_point');

/**
 * ACF JSON Load Point
 * Load ACF field groups from theme directory
 */
function starter_theme_acf_json_load_point($paths) {
    // Remove original path
    unset($paths[0]);

    // Add theme path
    $paths[] = STARTER_THEME_DIR . '/acf-json';

    return $paths;
}
add_filter('acf/settings/load_json', 'starter_theme_acf_json_load_point');

/**
 * Register ACF Options Sub-Page under Settings
 * Provides customizable homepage settings for the headless landing page
 */
function starter_theme_acf_options_page() {
    if (function_exists('acf_add_options_sub_page')) {
        acf_add_options_sub_page(array(
            'page_title'  => __('Homepage Settings', 'starter-wp-theme'),
            'menu_title'  => __('Homepage', 'starter-wp-theme'),
            'menu_slug'   => 'homepage-settings',
            'parent_slug' => 'options-general.php',
            'capability'  => 'manage_options',
        ));
    }
}
add_action('acf/init', 'starter_theme_acf_options_page');

/**
 * Add ACF fields to REST API response
 */
function starter_theme_add_acf_to_rest() {
    // Get all public post types
    $post_types = get_post_types(array('public' => true), 'names');

    foreach ($post_types as $post_type) {
        register_rest_field(
            $post_type,
            'acf',
            array(
                'get_callback' => function($object) {
                    return get_fields($object['id']);
                },
                'schema' => null,
            )
        );
    }
}
add_action('rest_api_init', 'starter_theme_add_acf_to_rest');

/**
 * Add featured image URL to REST API response
 */
function starter_theme_add_featured_image_to_rest() {
    $post_types = get_post_types(array('public' => true), 'names');

    foreach ($post_types as $post_type) {
        register_rest_field(
            $post_type,
            'featured_image_url',
            array(
                'get_callback' => function($object) {
                    if ($object['featured_media']) {
                        $img = wp_get_attachment_image_src($object['featured_media'], 'full');
                        return $img ? $img[0] : null;
                    }
                    return null;
                },
                'schema' => null,
            )
        );
    }
}
add_action('rest_api_init', 'starter_theme_add_featured_image_to_rest');

/**
 * Enable CORS for REST API (development only)
 * Remove or restrict in production
 */
function starter_theme_cors_headers() {
    // Only enable for development
    if (defined('WP_DEBUG') && WP_DEBUG) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        starter_theme_cors_headers();
        return $value;
    });
});

/**
 * Customize REST API response for better Next.js integration
 * Add author name directly to post response
 */
function starter_theme_add_author_to_rest() {
    register_rest_field(
        'post',
        'author_name',
        array(
            'get_callback' => function($object) {
                return get_the_author_meta('display_name', $object['author']);
            },
            'schema' => null,
        )
    );
}
add_action('rest_api_init', 'starter_theme_add_author_to_rest');

/**
 * Modify preview link to point to Next.js frontend
 */
function starter_theme_preview_link($preview_link, $post) {
    // Get the Next.js frontend URL from environment or options
    $frontend_url = defined('STARTER_FRONTEND_URL')
        ? STARTER_FRONTEND_URL
        : get_option('starter_frontend_url', 'http://localhost:3000');

    // Get preview secret - SECURITY: No default fallback to prevent accidental exposure
    $preview_secret = defined('STARTER_PREVIEW_SECRET')
        ? STARTER_PREVIEW_SECRET
        : get_option('starter_preview_secret', '');

    // Warn if preview secret is not configured
    if (empty($preview_secret)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('STARTER_PREVIEW_SECRET is not configured. Preview links will not work correctly.');
        }
        return $preview_link; // Return original link if secret not configured
    }

    // Build the preview URL with type parameter for proper routing
    return add_query_arg(
        array(
            'secret' => $preview_secret,
            'slug'   => $post->post_name,
            'id'     => $post->ID,
            'type'   => $post->post_type,
        ),
        $frontend_url . '/api/preview'
    );
}
add_filter('preview_post_link', 'starter_theme_preview_link', 10, 2);

/**
 * Trigger Next.js revalidation when content is published or updated
 */
function starter_theme_trigger_revalidation($post_id, $post, $update) {
    // Don't trigger for autosaves or revisions
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }

    // Only trigger for published content
    if ($post->post_status !== 'publish') {
        return;
    }

    // Get the frontend URL and revalidation secret
    $frontend_url = defined('STARTER_FRONTEND_URL')
        ? STARTER_FRONTEND_URL
        : get_option('starter_frontend_url', 'http://localhost:3000');

    // Get revalidation secret - SECURITY: No default fallback to prevent accidental exposure
    $revalidation_secret = defined('STARTER_REVALIDATION_SECRET')
        ? STARTER_REVALIDATION_SECRET
        : get_option('starter_revalidation_secret', '');

    // Skip revalidation if secret is not configured
    if (empty($revalidation_secret)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('STARTER_REVALIDATION_SECRET is not configured. Cache revalidation is disabled.');
        }
        return;
    }

    // Build the revalidation URL
    $revalidate_url = $frontend_url . '/api/revalidate';

    // Send the revalidation request
    $response = wp_remote_post($revalidate_url, array(
        'timeout'   => 10,
        'blocking'  => false, // Don't wait for response
        'headers'   => array(
            'Content-Type' => 'application/json',
        ),
        'body'      => wp_json_encode(array(
            'secret' => $revalidation_secret,
            'type'   => $post->post_type,
            'slug'   => $post->post_name,
        )),
    ));

    // Log errors in debug mode
    if (defined('WP_DEBUG') && WP_DEBUG && is_wp_error($response)) {
        error_log('Revalidation error: ' . $response->get_error_message());
    }
}
add_action('save_post', 'starter_theme_trigger_revalidation', 10, 3);

/**
 * Also trigger revalidation when post is trashed or untrashed
 */
function starter_theme_trigger_revalidation_on_status_change($new_status, $old_status, $post) {
    // Trigger on publish, trash, or untrash
    if (in_array($new_status, array('publish', 'trash')) || in_array($old_status, array('publish'))) {
        starter_theme_trigger_revalidation($post->ID, $post, true);
    }
}
add_action('transition_post_status', 'starter_theme_trigger_revalidation_on_status_change', 10, 3);

/**
 * Disable Gutenberg for this headless theme (optional)
 * Uncomment if you prefer the classic editor
 */
// add_filter('use_block_editor_for_post', '__return_false');

/**
 * YouTube Player Shortcode for Video.js Integration
 *
 * Usage: [youtube_player id="VIDEO_ID" autoplay="false" loop="false" muted="false" captions="true" caption_language="en"]
 *
 * Attributes:
 * - id: YouTube video ID (required)
 * - autoplay: Auto-start video (default: false)
 * - loop: Loop video playback (default: false)
 * - muted: Start muted (default: false)
 * - controls: Show player controls (default: true)
 * - captions: Show captions/subtitles by default (default: false)
 * - caption_language: Preferred caption language code (default: en)
 *
 * This shortcode outputs a data attribute div that the Next.js frontend
 * will detect and replace with the Video.js YouTube player component.
 *
 * @param array $atts Shortcode attributes
 * @return string HTML output
 */
function starter_theme_youtube_player_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'id'               => '',
            'autoplay'         => 'false',
            'loop'             => 'false',
            'muted'            => 'false',
            'controls'         => 'true',
            'captions'         => 'false',
            'caption_language' => 'en',
        ),
        $atts,
        'youtube_player'
    );

    // Validate video ID
    if (empty($atts['id'])) {
        return '<!-- YouTube Player: No video ID provided -->';
    }

    // Sanitize the video ID (alphanumeric, hyphens, underscores only)
    $video_id = preg_replace('/[^a-zA-Z0-9_-]/', '', $atts['id']);

    // Sanitize caption language (2-letter language code)
    $caption_lang = preg_replace('/[^a-zA-Z-]/', '', $atts['caption_language']);

    // Build data attributes
    $data_attrs = sprintf(
        'data-youtube-player data-video-id="%s" data-autoplay="%s" data-loop="%s" data-muted="%s" data-controls="%s" data-captions="%s" data-caption-language="%s"',
        esc_attr($video_id),
        esc_attr($atts['autoplay']),
        esc_attr($atts['loop']),
        esc_attr($atts['muted']),
        esc_attr($atts['controls']),
        esc_attr($atts['captions']),
        esc_attr($caption_lang)
    );

    // Return the placeholder div that will be hydrated by React
    return sprintf(
        '<div class="youtube-player-shortcode" %s></div>',
        $data_attrs
    );
}
add_shortcode('youtube_player', 'starter_theme_youtube_player_shortcode');

/**
 * Add YouTube Player block pattern for Gutenberg
 */
function starter_theme_register_youtube_pattern() {
    if (!function_exists('register_block_pattern')) {
        return;
    }

    register_block_pattern(
        'starter-theme/youtube-player',
        array(
            'title'       => __('YouTube Player (Video.js)', 'starter-wp-theme'),
            'description' => __('Embed a YouTube video using the custom Video.js player', 'starter-wp-theme'),
            'categories'  => array('media'),
            'content'     => '<!-- wp:shortcode -->[youtube_player id="YOUR_VIDEO_ID"]<!-- /wp:shortcode -->',
        )
    );
}
add_action('init', 'starter_theme_register_youtube_pattern');

/**
 * Register Photo Credit ACF Field Group
 */
function starter_theme_register_photo_credit_field() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_photo_credit',
        'title' => 'Photo Credit',
        'fields' => array(
            array(
                'key' => 'field_photo_credit',
                'label' => 'Photo Credit',
                'name' => 'photo_credit',
                'type' => 'text',
                'instructions' => 'Credit for the featured image. Leave blank for default "Clemson Sports Media".',
                'required' => 0,
                'default_value' => '',
                'placeholder' => 'e.g., Sean / Chelsea Weaver',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'post',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'side',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'active' => true,
    ));
}
add_action('acf/init', 'starter_theme_register_photo_credit_field');

/**
 * Include additional functionality files
 */
// Uncomment when files are created:
// require_once STARTER_THEME_DIR . '/inc/rest-api.php';
// require_once STARTER_THEME_DIR . '/inc/acf-fields.php';
