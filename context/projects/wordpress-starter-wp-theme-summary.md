# Starter WP Theme - Headless WordPress Project Plan

**Generated:** January 7, 2025
**Project Type:** Business/Services
**Timeline:** Fast MVP (2-4 weeks)
**Budget:** Minimal ($0-50/month)

---

## Architecture Overview

```
┌─────────────────────┐      REST API       ┌─────────────────────┐
│   WordPress CMS     │ ◄─────────────────► │     Next.js         │
│   (Flywheel)        │                     │   (Presentation)    │
└─────────────────────┘                     └─────────────────────┘
         │                                           │
         ▼                                           ▼
   Local by Flywheel                             Vercel
   (Development)                            (Production + ISR)
```

---

## Recommended Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **WordPress Backend** | Flywheel + Local | Managed hosting with excellent local dev experience |
| **API Strategy** | REST API | Built-in, simple caching, perfect for moderate complexity |
| **Frontend Framework** | Next.js | Best React framework for headless WP, native ISR support |
| **Rendering** | ISR (Hybrid) | Static pages with on-demand revalidation |
| **Frontend Hosting** | Vercel | Native Next.js support, free tier, deploy previews |
| **Preview** | Next.js Draft Mode | Real-time preview of WordPress drafts |

---

## Content Types

| Type | Custom Fields | Notes |
|------|--------------|-------|
| **Blog Posts** | Standard | WordPress native |
| **Pages** | Standard | WordPress native |
| **Services** | Yes (ACF) | Name, description, pricing, features |
| **Testimonials** | Yes (ACF) | Client name, company, quote, photo |

---

## Required WordPress Plugins

### Essential (Free)

| Plugin | Purpose |
|--------|---------|
| **Advanced Custom Fields** | Custom post types and custom fields for Services, Testimonials |

### Recommended (Free)

| Plugin | Purpose |
|--------|---------|
| **Yoast SEO** | SEO optimization, meta tags for REST API |
| **WP REST Cache** | Cache REST API responses |

---

## Starter Template

**Recommended:** [Vercel WordPress Starter](https://vercel.com/templates/next.js/nextjs-wordpress-headless-cms)

- One-click deploy to Vercel
- Pre-configured for WordPress REST API
- ISR support out of the box
- Perfect for fast MVP timeline

**Alternatives:**
- [next-wp](https://github.com/9d8dev/next-wp) - TypeScript, modern patterns
- [gregrickaby starter](https://github.com/gregrickaby/nextjs-wordpress) - Well-documented, App Router

---

## Implementation Checklist

### Phase 1: WordPress Setup (Week 1)

- [ ] Set up Local by Flywheel development environment
- [ ] Install and configure WordPress
- [ ] Install ACF plugin
- [ ] Create "Services" custom post type via ACF
  - [ ] Add fields: pricing, features, duration
- [ ] Create "Testimonials" custom post type via ACF
  - [ ] Add fields: client_name, company, photo
- [ ] Add sample content for testing
- [ ] Install Yoast SEO (optional)
- [ ] Test REST API endpoints: `/wp-json/wp/v2/`

### Phase 2: Next.js Frontend (Week 1-2)

- [ ] Clone Vercel WordPress Starter template
- [ ] Configure environment variables for WordPress API
- [ ] Set up pages structure:
  - [ ] Home page
  - [ ] Services listing
  - [ ] Individual service pages
  - [ ] Blog listing
  - [ ] Individual blog posts
  - [ ] Testimonials section/page
  - [ ] Contact page
- [ ] Implement ISR with revalidation
- [ ] Set up Draft Mode for WordPress preview
- [ ] Style with Tailwind CSS (included in starter)

### Phase 3: Integration & Polish (Week 2-3)

- [ ] Connect WordPress preview to Next.js Draft Mode
- [ ] Set up on-demand revalidation webhook
- [ ] Implement SEO meta tags from Yoast
- [ ] Add contact form (Vercel or third-party)
- [ ] Performance optimization
- [ ] Mobile responsiveness testing

### Phase 4: Deployment (Week 3-4)

- [ ] Deploy Next.js to Vercel
- [ ] Configure custom domain
- [ ] Set up Flywheel production environment
- [ ] Configure revalidation webhooks
- [ ] Final testing and QA
- [ ] Launch!

---

## Environment Variables (Next.js)

```env
# WordPress API
WORDPRESS_API_URL=https://your-site.flywheelsites.com/wp-json
WORDPRESS_GRAPHQL_ENDPOINT= # Not needed for REST API

# Preview Mode
WORDPRESS_PREVIEW_SECRET=your-secret-key

# Revalidation
REVALIDATE_SECRET=your-revalidation-secret
```

---

## Estimated Costs (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| **Flywheel** | Tiny ($15) or free trial | $0-15 |
| **Vercel** | Hobby (free) | $0 |
| **Domain** | If needed | ~$12/year |
| **Total** | | **$0-15/month** |

---

## Next Steps

1. **Clone starter template**: `npx create-next-app --example cms-wordpress`
2. **Set up Local by Flywheel**: Download and install WordPress locally
3. **Install ACF**: Advanced Custom Fields for CPTs and custom fields
4. **Create custom post types**: Services, Testimonials (via ACF)
5. **Start building!**

---

## Files Generated

- `context/projects/wordpress-starter-wp-theme-config.json` - Full configuration
- `context/projects/wordpress-starter-wp-theme-summary.md` - This file
