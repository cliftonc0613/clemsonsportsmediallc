<?php
/**
 * Template Name: Login
 *
 * Custom login page template matching the Coming Soon aesthetic.
 * Redirects authenticated users to the Posts admin screen.
 *
 * @package Starter_WP_Theme
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Redirect logged-in users to Posts
if (is_user_logged_in()) {
    wp_safe_redirect(admin_url('edit.php'));
    exit;
}

// Security headers
if (!headers_sent()) {
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header("Content-Security-Policy: frame-ancestors 'none';");
}

$login_error = '';

// Process login form
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['csm_login_nonce'])) {
    // Verify nonce
    if (!wp_verify_nonce($_POST['csm_login_nonce'], 'csm_login_action')) {
        $login_error = 'Security check failed. Please try again.';
    } else {
        $username = isset($_POST['log']) ? sanitize_user($_POST['log']) : '';
        $password = isset($_POST['pwd']) ? $_POST['pwd'] : '';

        if (empty($username) || empty($password)) {
            $login_error = 'Please enter your username and password.';
        } else {
            // Rate limiting
            $transient_key = 'csm_login_attempts_' . md5($username . $_SERVER['REMOTE_ADDR']);
            $attempts = (int) get_transient($transient_key);

            if ($attempts >= 5) {
                $login_error = 'Too many login attempts. Please try again in 15 minutes.';
            } else {
                $creds = array(
                    'user_login'    => $username,
                    'user_password' => $password,
                    'remember'      => !empty($_POST['rememberme']),
                );

                $user = wp_signon($creds, is_ssl());

                if (is_wp_error($user)) {
                    // Increment attempts
                    set_transient($transient_key, $attempts + 1, 15 * MINUTE_IN_SECONDS);
                    // Generic message to prevent user enumeration
                    $login_error = 'Invalid username or password.';
                } else {
                    // Clear attempts on success
                    delete_transient($transient_key);
                    wp_safe_redirect(admin_url('edit.php'));
                    exit;
                }
            }
        }
    }
}

// Get logos
$logo = function_exists('get_field') ? get_field('homepage_logo', 'option') : '';
$logo_path = get_template_directory_uri() . '/frontend/public/images/clemson-sports-media-logo.png';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Login &mdash; <?php bloginfo('name'); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo esc_url(get_stylesheet_uri()); ?>?ver=<?php echo STARTER_THEME_VERSION; ?>">
</head>
<body class="login-page">
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
    <div class="glow glow-3"></div>
    <img src="<?php echo esc_url($logo_path); ?>" alt="" class="bg-logo">

    <main class="login-container">
        <?php if ($logo): ?>
            <div class="login-logo">
                <img src="<?php echo esc_url($logo); ?>" alt="Clemson Sports Media">
            </div>
        <?php endif; ?>
        <h1 class="login-title">Sign In</h1>
        <p class="login-subtitle">Clemson Sports Media</p>

        <div class="login-card">
            <?php if ($login_error): ?>
                <div class="login-error"><?php echo esc_html($login_error); ?></div>
            <?php endif; ?>

            <form method="post" action="">
                <?php wp_nonce_field('csm_login_action', 'csm_login_nonce'); ?>

                <div class="login-form-group">
                    <label class="login-form-label" for="user_login">Username or Email</label>
                    <input
                        type="text"
                        id="user_login"
                        name="log"
                        class="login-form-input"
                        autocomplete="username"
                        required
                        maxlength="60"
                        placeholder="Enter your username"
                        value="<?php echo isset($_POST['log']) ? esc_attr(sanitize_user($_POST['log'])) : ''; ?>"
                    >
                </div>

                <div class="login-form-group">
                    <label class="login-form-label" for="user_pass">Password</label>
                    <input
                        type="password"
                        id="user_pass"
                        name="pwd"
                        class="login-form-input"
                        autocomplete="current-password"
                        required
                        placeholder="Enter your password"
                    >
                </div>

                <div class="login-form-remember">
                    <input type="checkbox" id="rememberme" name="rememberme" value="forever">
                    <label for="rememberme">Remember me</label>
                </div>

                <button type="submit" class="login-btn">
                    Sign In
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </button>
            </form>
        </div>

        <div class="login-back-link">
            <a href="<?php echo esc_url(home_url('/')); ?>">&larr; Back to site</a>
        </div>
    </main>
</body>
</html>
