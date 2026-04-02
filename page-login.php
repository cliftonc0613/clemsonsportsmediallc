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

// Get logo for watermark
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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: linear-gradient(135deg, #1a0a2e 0%, #16082a 50%, #0d0515 100%);
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

        /* Gradient glows */
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
            background: #ff6b35;
            animation: pulse 8s ease-in-out infinite;
        }

        .glow-2 {
            bottom: -200px;
            right: -200px;
            background: #9b59b6;
            animation: pulse 8s ease-in-out infinite reverse;
        }

        .glow-3 {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #8e44ad;
            opacity: 0.08;
            animation: pulse 10s ease-in-out infinite 2s;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(1.1); }
        }

        /* Background watermark logo */
        .bg-logo {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 93vmin;
            height: auto;
            opacity: 0.04;
            pointer-events: none;
            z-index: 0;
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
        }

        /* Title */
        .title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2rem, 6vw, 3.5rem);
            font-weight: 500;
            letter-spacing: -0.04em;
            line-height: 0.95;
            margin-bottom: 0.75rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards;
        }

        .subtitle {
            font-size: 1rem;
            color: rgba(255,255,255,0.5);
            margin-bottom: 2.5rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.2s;
        }

        /* Login form card */
        .login-card {
            width: 100%;
            max-width: 400px;
            padding: 2.5rem;
            background: rgba(155, 89, 182, 0.05);
            border: 1px solid rgba(155, 89, 182, 0.15);
            border-radius: 16px;
            backdrop-filter: blur(20px);
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.4s;
        }

        /* Error message */
        .login-error {
            background: rgba(255, 59, 48, 0.1);
            border: 1px solid rgba(255, 59, 48, 0.3);
            color: #ff6b6b;
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            text-align: left;
        }

        /* Form fields */
        .form-group {
            margin-bottom: 1.25rem;
            text-align: left;
        }

        .form-label {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: rgba(255,255,255,0.5);
            margin-bottom: 0.5rem;
        }

        .form-input {
            width: 100%;
            padding: 0.875rem 1rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(155, 89, 182, 0.2);
            border-radius: 10px;
            color: #fff;
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 0.9375rem;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            outline: none;
        }

        .form-input:focus {
            border-color: rgba(255, 107, 53, 0.5);
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .form-input::placeholder {
            color: rgba(255,255,255,0.2);
        }

        /* Remember me */
        .form-remember {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .form-remember input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: #ff6b35;
            cursor: pointer;
        }

        .form-remember label {
            font-size: 0.875rem;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
        }

        /* Submit button */
        .login-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            padding: 1rem 2rem;
            background: #ff6b35;
            color: #fff;
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            border: none;
            border-radius: 100px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .login-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 0 60px rgba(255, 107, 53, 0.4);
        }

        .login-btn svg {
            width: 16px;
            height: 16px;
            transition: transform 0.3s ease;
        }

        .login-btn:hover svg {
            transform: translateX(4px);
        }

        /* Back link */
        .back-link {
            margin-top: 2rem;
            opacity: 0;
            animation: fadeUp 1s ease forwards 0.6s;
        }

        .back-link a {
            color: rgba(255,255,255,0.4);
            font-size: 0.875rem;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .back-link a:hover {
            color: rgba(255,255,255,0.7);
        }

        /* Animations */
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
            .container { padding: 1.5rem; }
            .login-card { padding: 1.5rem; }
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
    <div class="glow glow-3"></div>
    <img src="<?php echo esc_url($logo_path); ?>" alt="" class="bg-logo">

    <main class="container">
        <h1 class="title">Sign In</h1>
        <p class="subtitle">Clemson Sports Media</p>

        <div class="login-card">
            <?php if ($login_error): ?>
                <div class="login-error"><?php echo esc_html($login_error); ?></div>
            <?php endif; ?>

            <form method="post" action="">
                <?php wp_nonce_field('csm_login_action', 'csm_login_nonce'); ?>

                <div class="form-group">
                    <label class="form-label" for="user_login">Username or Email</label>
                    <input
                        type="text"
                        id="user_login"
                        name="log"
                        class="form-input"
                        autocomplete="username"
                        required
                        maxlength="60"
                        placeholder="Enter your username"
                        value="<?php echo isset($_POST['log']) ? esc_attr(sanitize_user($_POST['log'])) : ''; ?>"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label" for="user_pass">Password</label>
                    <input
                        type="password"
                        id="user_pass"
                        name="pwd"
                        class="form-input"
                        autocomplete="current-password"
                        required
                        placeholder="Enter your password"
                    >
                </div>

                <div class="form-remember">
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

        <div class="back-link">
            <a href="<?php echo esc_url(home_url('/')); ?>">&larr; Back to site</a>
        </div>
    </main>
</body>
</html>
