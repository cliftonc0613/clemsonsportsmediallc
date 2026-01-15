<?php
/**
 * Main template file - Coming Soon Page
 *
 * A beautiful coming soon page for headless WordPress installations.
 * Settings managed via Settings → Homepage in the admin.
 *
 * @package Starter_WP_Theme
 * @version 1.2.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Get ACF fields
$logo = function_exists('get_field') ? get_field('homepage_logo', 'option') : '';
$title = function_exists('get_field') ? get_field('homepage_title', 'option') : '';
$intro = function_exists('get_field') ? get_field('homepage_intro', 'option') : '';
$frontend_url = function_exists('get_field') ? get_field('homepage_frontend_url', 'option') : '';
$frontend_label = function_exists('get_field') ? get_field('homepage_frontend_label', 'option') : '';
$show_endpoints = function_exists('get_field') ? get_field('homepage_show_endpoints', 'option') : true;
$endpoints = function_exists('get_field') ? get_field('homepage_endpoints', 'option') : array();

// Defaults
if (empty($title)) $title = 'Coming Soon';
if (empty($intro)) $intro = '<p>Something amazing is in the works.</p>';
if (empty($frontend_url)) $frontend_url = defined('STARTER_FRONTEND_URL') ? STARTER_FRONTEND_URL : get_option('starter_frontend_url', '');
if (empty($frontend_label)) $frontend_label = 'Visit Site';

// Default endpoints
if (empty($endpoints) && $show_endpoints) {
    $endpoints = array(
        array('name' => 'Posts', 'path' => '/wp-json/wp/v2/posts', 'description' => 'Blog posts and articles'),
        array('name' => 'Pages', 'path' => '/wp-json/wp/v2/pages', 'description' => 'Static pages content'),
        array('name' => 'Services', 'path' => '/wp-json/wp/v2/services', 'description' => 'Service offerings'),
        array('name' => 'Testimonials', 'path' => '/wp-json/wp/v2/testimonials', 'description' => 'Client testimonials'),
        array('name' => 'Media', 'path' => '/wp-json/wp/v2/media', 'description' => 'Images and attachments'),
    );
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title><?php echo esc_html($title); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #000;
            color: #fff;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Noise texture overlay */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
            z-index: 1;
        }

        /* Gradient glow */
        .glow {
            position: fixed;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(150px);
            opacity: 0.15;
            pointer-events: none;
        }

        .glow-1 {
            top: -200px;
            left: -200px;
            background: #fff;
            animation: pulse 8s ease-in-out infinite;
        }

        .glow-2 {
            bottom: -200px;
            right: -200px;
            background: #888;
            animation: pulse 8s ease-in-out infinite reverse;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(1.1); }
        }

        /* Main container */
        .container {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            text-align: center;
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
        }

        /* Logo */
        .logo {
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards;
        }

        .logo img {
            height: 70px;
            width: auto;
            filter: brightness(0) invert(1);
        }

        /* Title */
        .title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2.5rem, 8vw, 4.5rem);
            font-weight: 500;
            letter-spacing: -0.04em;
            line-height: 0.95;
            margin-bottom: 1.5rem;
            max-width: 1200px;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.2s;
        }

        /* Intro */
        .intro {
            max-width: 400px;
            font-size: 1rem;
            line-height: 1.6;
            color: rgba(255,255,255,0.5);
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.4s;
        }

        .intro p { margin: 0; }

        /* CTA Button */
        .cta {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: #fff;
            color: #000;
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 100px;
            transition: all 0.3s ease;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.6s;
        }

        .cta:hover {
            transform: scale(1.05);
            box-shadow: 0 0 60px rgba(255,255,255,0.3);
        }

        .cta svg {
            width: 16px;
            height: 16px;
            transition: transform 0.3s ease;
        }

        .cta:hover svg {
            transform: translateX(4px);
        }

        .button-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .cta-outline {
            background: transparent;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.25);
        }

        .cta-outline:hover {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.4);
            box-shadow: 0 0 40px rgba(255,255,255,0.1);
        }

        /* API Section */
        .api-section {
            margin-top: 2.5rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.08);
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.8s;
        }

        .api-header {
            margin-bottom: 1.5rem;
        }

        .api-label {
            font-size: 0.625rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: rgba(255,255,255,0.35);
        }

        .api-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
            max-width: 1000px;
            width: 100%;
        }

        .api-card {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1.25rem;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.2s ease;
            flex: 0 1 280px;
            max-width: 320px;
        }

        .api-card:hover {
            background: rgba(255,255,255,0.06);
            border-color: rgba(255,255,255,0.15);
            transform: translateY(-2px);
        }

        .api-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
        }

        .api-card-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: #fff;
        }

        .api-card-method {
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.625rem;
            font-weight: 600;
            color: rgba(255,255,255,0.4);
            background: rgba(255,255,255,0.08);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }

        .api-card code {
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.75rem;
            color: rgba(255,255,255,0.5);
            word-break: break-all;
        }

        .api-card-desc {
            font-size: 0.8125rem;
            color: rgba(255,255,255,0.4);
            line-height: 1.5;
        }


        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @media (max-width: 640px) {
            .container { padding: 1.5rem; }
            .button-group { flex-direction: column; width: 100%; }
            .cta { width: 100%; justify-content: center; }
            .api-section { width: 100%; }
            .api-grid { width: 100%; max-width: 100%; }
            .api-card { padding: 1rem; flex: 1 1 100%; max-width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body>
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>

    <main class="container">
        <?php if ($logo): ?>
            <div class="logo">
                <img src="<?php echo esc_url($logo); ?>" alt="">
            </div>
        <?php endif; ?>

        <h1 class="title"><?php echo esc_html($title); ?></h1>

        <div class="intro"><?php echo wp_kses_post($intro); ?></div>

        <div class="button-group">
            <?php if ($frontend_url): ?>
                <a href="<?php echo esc_url($frontend_url); ?>" class="cta" target="_blank" rel="noopener">
                    <?php echo esc_html($frontend_label); ?>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            <?php endif; ?>
            <a href="<?php echo esc_url(admin_url()); ?>" class="cta cta-outline">
                WordPress Admin
            </a>
        </div>

        <?php if ($show_endpoints && !empty($endpoints)): ?>
            <div class="api-section">
                <div class="api-header">
                    <span class="api-label">REST API Endpoints</span>
                </div>
                <div class="api-grid">
                    <?php foreach ($endpoints as $ep): ?>
                        <a href="<?php echo esc_url(home_url($ep['path'])); ?>" target="_blank" class="api-card">
                            <div class="api-card-header">
                                <span class="api-card-name"><?php echo esc_html($ep['name']); ?></span>
                                <span class="api-card-method">GET</span>
                            </div>
                            <code><?php echo esc_html($ep['path']); ?></code>
                            <?php if (!empty($ep['description'])): ?>
                                <p class="api-card-desc"><?php echo esc_html($ep['description']); ?></p>
                            <?php endif; ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

    </main>
</body>
</html>
