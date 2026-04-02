# Custom Login Page Template

## Goal
Create a WordPress page template with a custom login form that redirects authenticated users to the Posts admin screen (`edit.php`).

## Plan

- [x] **1. Create `page-login.php`** — Self-contained page template
  - Match index.php aesthetic: dark purple gradient, glow orbs, noise texture, bg-logo watermark
  - Playfair Display heading, Inter body font
  - fadeUp animations on form elements
  - If already logged in, redirect to `edit.php`
  - Custom form with nonce, rate limiting, error display
  - Orange CTA button matching index.php `.cta` style
  - Responsive (mobile stacks like index.php)

- [x] **2. Login handler** — Built into page-login.php (self-contained)
  - `wp_signon()` processing with nonce verification
  - Rate limiting: 5 attempts / 15 min via transients
  - Sanitize username, validate redirect URL
  - Generic error message (no user enumeration)
  - Security headers on login template
  - No functions.php changes needed — keeps it simple

## Security (from wordpress-custom-login-security skill)
- CSRF: WordPress nonce on form
- Input sanitization: `sanitize_user()` for username, raw password
- Rate limiting: 5 attempts per 15 minutes via transients
- Security headers: X-Frame-Options, CSP, nosniff
- No user enumeration in error messages
- Secure redirect validation

## Notes
- User creates a WordPress "Page" and selects "Login" template
- Template is self-contained (headless theme has no header.php/footer.php)
- Redirect target: `admin_url('edit.php')` (Posts list)
