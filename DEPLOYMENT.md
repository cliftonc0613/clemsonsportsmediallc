# Deployment Guide

This guide covers deploying the headless WordPress + Next.js application to production.

## Architecture Overview

```
┌─────────────────────────┐        REST API         ┌─────────────────────────┐
│   WordPress (CMS)       │ ◄─────────────────────► │   Next.js (Frontend)    │
│   Flywheel / WP Engine  │                         │   Vercel                │
└─────────────────────────┘                         └─────────────────────────┘
           │                                                   │
           ▼                                                   ▼
    Revalidation Webhook ──────────────────────────► /api/revalidate
    Preview Link ──────────────────────────────────► /api/preview
```

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- Flywheel or WP Engine account for WordPress hosting
- Domain name (optional but recommended)

---

## URL Configuration Reference

When cloning this project to a new WordPress installation, you must update the URLs in the following files to match your new local and production environments.

### Files Requiring URL Updates

#### 1. Environment Files (Primary Configuration)

These are the main files where you define your URLs:

| File | Line | Variable | Replace With |
|------|------|----------|--------------|
| `frontend/.env.local` | 2 | `WORDPRESS_API_URL` | Your local WordPress URL + `/wp-json/wp/v2` |
| `frontend/.env.local` | 11 | `NEXT_PUBLIC_SITE_URL` | Your local Next.js URL (typically `http://localhost:3000`) |
| `frontend/.env.production` | 10 | `WORDPRESS_API_URL` | Your production WordPress URL + `/wp-json/wp/v2` |
| `frontend/.env.production` | 26 | `NEXT_PUBLIC_SITE_URL` | Your production Vercel/hosting URL |

#### 2. Next.js Image Configuration

Update `frontend/next.config.ts` to allow images from your WordPress domains:

| Line | Purpose | Replace With |
|------|---------|--------------|
| 13, 18 | Local image hostname | Your local WordPress domain (e.g., `mysite.local`) |
| 24 | Production image hostname | Your production WordPress domain |

#### 3. Application Files (No Changes Needed)

These files read from environment variables automatically. No manual URL changes required:

| File | Line | Variable Used |
|------|------|---------------|
| `app/page.tsx` | 23 | `NEXT_PUBLIC_SITE_URL` |
| `app/about/page.tsx` | 18 | `NEXT_PUBLIC_SITE_URL` |
| `app/blog/[slug]/page.tsx` | 21 | `NEXT_PUBLIC_SITE_URL` |
| `app/services/[slug]/page.tsx` | 11 | `NEXT_PUBLIC_SITE_URL` |
| `app/[slug]/page.tsx` | 16 | `NEXT_PUBLIC_SITE_URL` |
| `app/sitemap.ts` | 4 | `NEXT_PUBLIC_SITE_URL` |
| `app/robots.ts` | 3 | `NEXT_PUBLIC_SITE_URL` |
| `lib/wordpress.ts` | 8 | `WORDPRESS_API_URL` |

### Quick Setup Steps

1. **Copy environment template**: `cp .env.production.example .env.local`
2. **Update `.env.local`** with your local WordPress URL and Next.js URL
3. **Update `next.config.ts`** with your WordPress domain in the image patterns
4. **For production**: Create `.env.production` with live URLs

---

## Part 1: Deploy Next.js to Vercel

### Step 1: Push Code to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` directory as the root
5. Framework Preset: **Next.js** (auto-detected)

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `WORDPRESS_API_URL` | `https://your-wp-site.com/wp-json/wp/v2` | Production WordPress URL |
| `PREVIEW_SECRET` | `your-secure-secret` | Generate with `openssl rand -base64 32` |
| `REVALIDATION_SECRET` | `your-secure-secret` | Must match WordPress config |
| `NEXT_PUBLIC_SITE_URL` | `https://your-frontend.vercel.app` | Your Vercel deployment URL |
| `NEXT_PUBLIC_SITE_NAME` | `Your Site Name` | Used in structured data |

### Step 4: Deploy

Click "Deploy" and wait for the build to complete. Your site will be live at `your-project.vercel.app`.

---

## Part 2: Deploy WordPress to Production

### Option A: Flywheel Hosting

1. **Create Production Site**
   - Log in to Flywheel dashboard
   - Create new site with production domain

2. **Migrate from Local**
   - In Local by Flywheel, right-click your site
   - Select "Push to Flywheel"
   - Choose your production site

3. **Update wp-config.php**
   Add these constants to your production `wp-config.php`:

   ```php
   // Next.js Frontend URL
   define('STARTER_FRONTEND_URL', 'https://your-frontend.vercel.app');

   // Preview Secret (must match Vercel env var)
   define('STARTER_PREVIEW_SECRET', 'your-secure-secret');

   // Revalidation Secret (must match Vercel env var)
   define('STARTER_REVALIDATION_SECRET', 'your-secure-secret');
   ```

4. **Install SSL Certificate**
   - Go to Flywheel dashboard → SSL
   - Enable Let's Encrypt SSL

### Option B: WP Engine Hosting

1. **Create Environment**
   - Log in to WP Engine User Portal
   - Create new site/environment

2. **Migrate Content**
   - Use WP Engine Migration Plugin or
   - Export/Import using WP CLI or
   - Manual database + uploads migration

3. **Update Configuration**
   Same wp-config.php changes as Flywheel above.

---

## Part 3: Configure Webhooks

### Verify Revalidation is Working

1. **Test Endpoint**
   ```bash
   curl -X POST https://your-frontend.vercel.app/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret": "your-secret", "path": "/"}'
   ```

2. **Expected Response**
   ```json
   {
     "success": true,
     "message": "Revalidated path: /",
     "timestamp": "2025-01-07T..."
   }
   ```

### Verify Preview is Working

1. Log in to WordPress admin
2. Create or edit a post
3. Click "Preview" button
4. Should redirect to Next.js with draft content visible

---

## Part 4: Custom Domain Setup

### Vercel (Frontend)

1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records:
   - `A` record: `76.76.21.21`
   - `CNAME` for `www`: `cname.vercel-dns.com`
4. Wait for SSL certificate provisioning

### WordPress (Backend)

1. Update WordPress URL in Settings → General
2. Update `STARTER_FRONTEND_URL` in wp-config.php
3. Run search-replace for old URLs:
   ```bash
   wp search-replace 'old-url.com' 'new-url.com' --all-tables
   ```

---

## Part 5: Post-Deployment Checklist

### Frontend Verification

- [ ] All pages load correctly
- [ ] Images display from WordPress
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Contact form submits
- [ ] No console errors

### Integration Verification

- [ ] ISR revalidation triggers on content update
- [ ] Preview mode shows draft content
- [ ] Sitemap.xml generated
- [ ] Robots.txt accessible

### SEO Verification

- [ ] Meta tags rendering
- [ ] Open Graph tags present
- [ ] JSON-LD structured data in page source
- [ ] Sitemap submitted to Google Search Console

### Performance Verification

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse SEO > 90

---

## Environment Variable Reference

### Vercel (Next.js)

| Variable | Required | Description |
|----------|----------|-------------|
| `WORDPRESS_API_URL` | Yes | WordPress REST API base URL |
| `PREVIEW_SECRET` | Yes | Secret for preview authentication |
| `REVALIDATION_SECRET` | Yes | Secret for ISR revalidation |
| `NEXT_PUBLIC_SITE_URL` | Yes | Frontend public URL |
| `NEXT_PUBLIC_SITE_NAME` | No | Site name for structured data |

### WordPress (wp-config.php)

| Constant | Required | Description |
|----------|----------|-------------|
| `STARTER_FRONTEND_URL` | Yes | Next.js frontend URL |
| `STARTER_PREVIEW_SECRET` | Yes | Must match Vercel `PREVIEW_SECRET` |
| `STARTER_REVALIDATION_SECRET` | Yes | Must match Vercel `REVALIDATION_SECRET` |

---

## Troubleshooting

### Issue: Images not loading

**Solution:** Ensure WordPress domain is in `next.config.js`:
```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-wp-domain.com',
    },
  ],
}
```

### Issue: CORS errors

**Solution:** WordPress REST API CORS is enabled in development only. In production, ensure proper CORS headers or use same-origin requests.

### Issue: Revalidation not working

**Solution:**
1. Verify `REVALIDATION_SECRET` matches in both environments
2. Check WordPress can reach Vercel URL (no firewall blocks)
3. Check Vercel function logs for errors

### Issue: Preview not working

**Solution:**
1. Verify `PREVIEW_SECRET` matches in both environments
2. Check preview URL in WordPress includes correct parameters
3. Ensure draft content is accessible via REST API

---

## Monitoring & Maintenance

### Recommended Tools

- **Vercel Analytics** - Frontend performance monitoring (included)
- **UptimeRobot** - Uptime monitoring (free tier)
- **Google Search Console** - SEO monitoring
- **Sentry** - Error tracking (optional)

### Ongoing Maintenance

- Keep WordPress plugins updated
- Keep Next.js and dependencies updated
- Monitor Vercel usage and function invocations
- Regular database backups (WordPress)

---

## Support

For issues with:
- **Next.js/Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **WordPress/ACF**: [ACF Documentation](https://www.advancedcustomfields.com/resources/)
- **This starter theme**: Check the project's GitHub issues
