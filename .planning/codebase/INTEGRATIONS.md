# External Integrations

**Analysis Date:** 2026-01-14

## APIs & External Services

**Content Management:**
- WordPress REST API - Headless CMS content source
  - SDK/Client: Custom fetch functions in `frontend/lib/wordpress.ts`
  - Auth: No authentication required for public content
  - Endpoints: Posts, Pages, Services, Testimonials, Categories, Tags
  - Base URL: `WORDPRESS_API_URL` environment variable
  - Local dev: `http://wp.clemsonsportsmediacom.local/wp-json/wp/v2`

**Email/SMS:**
- Email integration templates available (commented) - `frontend/app/api/contact/route.ts`
  - Resend, SendGrid, Nodemailer, AWS SES options documented
  - Currently: Contact form logs to console (TODO: implement provider)

## Data Storage

**Databases:**
- WordPress MySQL - Content storage (via WordPress)
  - Connection: Managed by WordPress/Local by Flywheel
  - No direct database access from Next.js

**File Storage:**
- WordPress Media Library - Image and file uploads
  - Accessed via REST API `featured_image_url` field
  - Local storage via WordPress uploads directory

**Caching:**
- Next.js ISR - Incremental Static Regeneration
  - Revalidation: 5 seconds for blog/service pages
  - Webhook trigger: `POST /api/revalidate`
- Service Worker - Offline caching via Serwist
  - App shell caching for offline support

## Authentication & Identity

**Auth Provider:**
- WordPress Preview Mode - Draft content preview
  - Implementation: Token-based preview via `PREVIEW_SECRET`
  - Token storage: Next.js cookies
  - Endpoints: `GET /api/preview`, `POST /api/exit-preview`

**No User Authentication:**
- Public-facing site, no user login required
- Admin authentication handled by WordPress dashboard

## Monitoring & Observability

**Error Tracking:**
- Sentry - Client and server error monitoring
  - Client DSN: `NEXT_PUBLIC_SENTRY_DSN` env var
  - Server DSN: `SENTRY_DSN` env var
  - Config files: `frontend/sentry.client.config.ts`, `frontend/sentry.server.config.ts`, `frontend/sentry.edge.config.ts`
  - Source maps: Optional via `SENTRY_AUTH_TOKEN`

**Analytics:**
- Web Vitals tracking - `frontend/lib/web-vitals.ts`
  - Core Web Vitals monitoring for performance

**Logs:**
- Custom logger abstraction - `frontend/lib/logger.ts`
  - Environment-aware (verbose in dev, minimal in prod)
  - Structured logging with JSON context

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js deployment target
  - Deployment: Automatic on push (recommended)
  - Environment vars: Configured in Vercel dashboard

**WordPress Hosting:**
- Local by Flywheel - Development environment
  - Production: Flywheel, WP Engine, or similar recommended

**CI Pipeline:**
- Not configured (manual deployment)
- Test scripts available: `npm test`, `npm run test:e2e`

## Environment Configuration

**Development:**
- Required env vars:
  - `WORDPRESS_API_URL` (WordPress REST API endpoint)
  - `PREVIEW_SECRET` (Preview mode token)
  - `REVALIDATION_SECRET` (ISR webhook token)
  - `NEXT_PUBLIC_SITE_URL` (Frontend URL)
  - `NEXT_PUBLIC_SITE_NAME` (Site name for metadata)
- Secrets location: `frontend/.env.local` (gitignored)
- Template: `frontend/.env.example`

**Production:**
- Same variables as development
- Secrets management: Vercel environment variables
- WordPress must be accessible from Vercel servers

## Webhooks & Callbacks

**Incoming:**
- ISR Revalidation - `POST /api/revalidate`
  - Verification: `REVALIDATION_SECRET` token matching
  - Trigger: WordPress content updates (via plugin)
  - Action: Revalidates Next.js static cache

**Outgoing:**
- None configured

## WordPress Integration Details

**Custom Post Types:**
- Services - `frontend/lib/wordpress.ts` → `getServices()`, `getService()`
- Testimonials - `frontend/lib/wordpress.ts` → `getTestimonials()`

**Advanced Custom Fields:**
- ACF JSON sync enabled - `acf-json/` directory
- Field groups: Homepage Settings, Services Fields, Testimonials Fields

**REST API Endpoints Used:**
- `GET /wp/v2/posts` - Blog posts
- `GET /wp/v2/pages` - Static pages
- `GET /wp/v2/services` - Custom post type
- `GET /wp/v2/testimonials` - Custom post type
- `GET /wp/v2/categories` - Taxonomy
- `GET /wp/v2/tags` - Taxonomy

---

*Integration audit: 2026-01-14*
*Update when adding/removing external services*
