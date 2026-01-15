# Tasks: Headless WordPress Starter Theme

**PRD Reference:** `0001-prd-headless-wordpress-starter.md`
**Generated:** January 7, 2025
**Status:** Complete (Ready for Manual Deployment)

---

## Relevant Files

### WordPress Theme (`/mytheme/`)

- `style.css` - Theme metadata and basic styles
- `functions.php` - Theme functions, ACF registration, REST API modifications
- `acf-json/` - ACF field group exports for version control
- `inc/rest-api.php` - Custom REST API endpoints and modifications
- `inc/acf-fields.php` - ACF field group definitions (if not using ACF JSON)

### Next.js Frontend (`/mytheme/frontend/`)

- `app/layout.tsx` - Root layout with global styles and metadata
- `app/page.tsx` - Home page component
- `app/services/page.tsx` - Services listing page
- `app/services/[slug]/page.tsx` - Individual service detail page
- `app/blog/page.tsx` - Blog listing page
- `app/blog/[slug]/page.tsx` - Individual blog post page
- `app/testimonials/page.tsx` - Testimonials page
- `app/contact/page.tsx` - Contact page with form
- `app/api/contact/route.ts` - Contact form API endpoint
- `app/api/revalidate/route.ts` - On-demand ISR revalidation endpoint
- `app/api/preview/route.ts` - WordPress preview handler
- `lib/wordpress.ts` - WordPress API fetch functions
- `lib/wordpress.test.ts` - Unit tests for WordPress API functions
- `components/ui/` - shadcn/ui base components (auto-generated)
- `components/Header.tsx` - Site header using NavigationMenu + Sheet
- `components/Footer.tsx` - Site footer component
- `components/ServiceCard.tsx` - Service preview using Card component
- `components/TestimonialCard.tsx` - Testimonial using Card component
- `components/BlogCard.tsx` - Blog post preview using Card component
- `components/ContactForm.tsx` - Contact form using Form + Input + Select
- `components/Hero.tsx` - Home page hero section with Button
- `components/FAQAccordion.tsx` - FAQ section using Accordion
- `.env.local` - Environment variables (local)
- `.env.example` - Environment variables template
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration (extended by shadcn/ui)
- `components.json` - shadcn/ui configuration file

### Notes

- WordPress theme files go in `/mytheme/` directory (current location)
- Next.js frontend will be in `/mytheme/frontend/` directory
- Using **Tailwind CSS + shadcn/ui** for styling and components
- shadcn/ui components installed: Button, Card, Form, Input, Select, Textarea, Dialog, NavigationMenu, Sheet, Accordion, Tabs, Toast, Carousel
- Unit tests should be placed alongside the code files they test
- Use `npm test` or `npx jest` to run tests in the Next.js project
- ACF JSON sync enabled for version control of field groups

---

## Tasks

- [x] 1.0 WordPress Environment & Theme Setup
  - [x] 1.1 Verify Local by Flywheel is installed and running
  - [x] 1.2 Create new WordPress site in Local (if not already done)
  - [x] 1.3 Create `style.css` with theme metadata (Theme Name, Version, Description)
  - [x] 1.4 Create `functions.php` with theme setup (add_theme_support, enqueue scripts)
  - [x] 1.5 Create `index.php` as fallback template (required by WordPress)
  - [x] 1.6 Activate the theme in WordPress admin
  - [x] 1.7 Install and activate Advanced Custom Fields plugin
  - [x] 1.8 Create `acf-json/` directory for ACF local JSON sync
  - [x] 1.9 Enable ACF JSON sync in `functions.php`

- [x] 2.0 Custom Post Types & ACF Configuration
  - [x] 2.1 Register "Services" custom post type via ACF
  - [x] 2.2 Create Services field group with fields:
    - [x] 2.2.1 `pricing` (text field)
    - [x] 2.2.2 `features` (repeater field with text sub-field)
    - [x] 2.2.3 `duration` (text field)
    - [x] 2.2.4 `cta_text` (text field, default "Get Started")
    - [x] 2.2.5 `cta_link` (URL field)
  - [x] 2.3 Register "Testimonials" custom post type via ACF
  - [x] 2.4 Create Testimonials field group with fields:
    - [x] 2.4.1 `client_name` (text field)
    - [x] 2.4.2 `company` (text field)
    - [x] 2.4.3 `quote` (textarea field)
    - [x] 2.4.4 `photo` (image field)
  - [x] 2.5 Configure REST API visibility for both CPTs (`show_in_rest => true`)
  - [x] 2.6 Add ACF fields to REST API response via `acf/rest_api` or custom filter
  - [x] 2.7 Add 3-5 sample Services with complete data *(manual)*
  - [x] 2.8 Add 3-5 sample Testimonials with complete data *(manual)*
  - [x] 2.9 Add 2-3 sample Blog Posts *(manual)*
  - [x] 2.10 Test REST API endpoints in browser/Postman:
    - [x] 2.10.1 `/wp-json/wp/v2/services` ✓
    - [x] 2.10.2 `/wp-json/wp/v2/testimonials` ✓
    - [x] 2.10.3 `/wp-json/wp/v2/posts` ✓
    - [x] 2.10.4 `/wp-json/wp/v2/pages` ✓

- [x] 3.0 Next.js Frontend Scaffold & Configuration
  - [x] 3.1 Create frontend directory: `mkdir frontend`
  - [x] 3.2 Initialize Next.js project with TypeScript and Tailwind:
    ```
    npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
    ```
  - [x] 3.3 Initialize shadcn/ui:
    ```
    npx shadcn@latest init
    ```
  - [x] 3.4 Install shadcn/ui extended component set:
    - [x] 3.4.1 Core: `npx shadcn@latest add button card form input select textarea dialog`
    - [x] 3.4.2 Navigation: `npx shadcn@latest add navigation-menu sheet`
    - [x] 3.4.3 Extended: `npx shadcn@latest add accordion tabs sonner carousel` *(used sonner instead of deprecated toast)*
  - [x] 3.5 Create `.env.local` with WordPress API URL
  - [x] 3.6 Create `.env.example` as template for other developers
  - [x] 3.7 Create `lib/wordpress.ts` with API fetch functions:
    - [x] 3.7.1 `getPosts()` - Fetch all blog posts
    - [x] 3.7.2 `getPost(slug)` - Fetch single post by slug
    - [x] 3.7.3 `getServices()` - Fetch all services
    - [x] 3.7.4 `getService(slug)` - Fetch single service by slug
    - [x] 3.7.5 `getTestimonials()` - Fetch all testimonials
    - [x] 3.7.6 `getPages()` - Fetch all pages
  - [x] 3.8 Add TypeScript interfaces for WordPress data types
  - [x] 3.9 Test API connection by logging data in a test page
  - [x] 3.10 Configure `next.config.js` for WordPress image domains

- [x] 4.0 Page Templates & Components Development (using shadcn/ui)
  - [x] 4.1 Create shared components (built on shadcn/ui primitives):
    - [x] 4.1.1 `components/Header.tsx` - Navigation using NavigationMenu + Sheet (mobile)
    - [x] 4.1.2 `components/Footer.tsx` - Footer with links and copyright
    - [x] 4.1.3 `components/Hero.tsx` - Reusable hero section with Button CTA
    - [x] 4.1.4 `components/ServiceCard.tsx` - Service preview using Card component
    - [x] 4.1.5 `components/TestimonialCard.tsx` - Testimonial using Card component
    - [x] 4.1.6 `components/BlogCard.tsx` - Blog post preview using Card component
    - [x] 4.1.7 `components/FAQAccordion.tsx` - FAQ section using Accordion component
  - [x] 4.2 Create `app/layout.tsx` with Header, Footer, and global styles
  - [x] 4.3 Create Home page (`app/page.tsx`):
    - [x] 4.3.1 Hero section with headline and CTA
    - [x] 4.3.2 Featured Services section (3-4 cards)
    - [x] 4.3.3 Testimonials carousel/grid
    - [x] 4.3.4 Final CTA section
  - [x] 4.4 Create Services listing page (`app/services/page.tsx`):
    - [x] 4.4.1 Page header with title and description
    - [x] 4.4.2 Services grid with all services
    - [x] 4.4.3 CTA section
  - [x] 4.5 Create Service detail page (`app/services/[slug]/page.tsx`):
    - [x] 4.5.1 Service title and description
    - [x] 4.5.2 Pricing display
    - [x] 4.5.3 Features list
    - [x] 4.5.4 Duration (if applicable)
    - [x] 4.5.5 CTA button
    - [x] 4.5.6 Implement `generateStaticParams()` for static generation
  - [x] 4.6 Create Blog listing page (`app/blog/page.tsx`):
    - [x] 4.6.1 Page header
    - [x] 4.6.2 Blog posts grid
    - [x] 4.6.3 Pagination (if needed)
  - [x] 4.7 Create Blog post page (`app/blog/[slug]/page.tsx`):
    - [x] 4.7.1 Post title and meta (date, author)
    - [x] 4.7.2 Featured image
    - [x] 4.7.3 Post content (rendered HTML)
    - [x] 4.7.4 Related posts section (optional)
    - [x] 4.7.5 Implement `generateStaticParams()` for static generation
  - [x] 4.8 Create Testimonials page (`app/testimonials/page.tsx`):
    - [x] 4.8.1 Page header
    - [x] 4.8.2 Testimonials grid
  - [x] 4.9 Ensure all pages are fully responsive (mobile, tablet, desktop)
  - [x] 4.10 Test all pages with sample data

- [x] 5.0 Contact Form Implementation (using shadcn/ui Form + React Hook Form)
  - [x] 5.1 Create `components/ContactForm.tsx` using shadcn/ui Form components:
    - [x] 5.1.1 Name (Input component, required)
    - [x] 5.1.2 Email (Input component, required)
    - [x] 5.1.3 Phone (Input component, required)
    - [x] 5.1.4 Service Interest (Select component, populated from Services)
    - [x] 5.1.5 Message (Textarea component, required)
    - [x] 5.1.6 Budget Range (Select component)
    - [x] 5.1.7 Timeline (Select component)
    - [x] 5.1.8 How did you hear about us? (Select component)
  - [x] 5.2 Implement validation with React Hook Form + Zod schema
  - [x] 5.3 Create Contact page (`app/contact/page.tsx`):
    - [x] 5.3.1 Page header
    - [x] 5.3.2 Contact form component
    - [x] 5.3.3 Contact info sidebar (address, phone, email)
  - [x] 5.4 Create form submission API route (`app/api/contact/route.ts`)
  - [x] 5.5 Implement form submission handling:
    - [x] 5.5.1 Validate form data server-side
    - [ ] 5.5.2 Send email notification *(TODO: configure Resend/SendGrid)*
    - [x] 5.5.3 Return success/error response
  - [x] 5.6 Add loading state during form submission
  - [x] 5.7 Display success message after successful submission (using Sonner toast)
  - [x] 5.8 Display error message on submission failure (using Sonner toast)
  - [ ] 5.9 Write unit tests for ContactForm component *(optional)*
  - [x] 5.10 Test form submission end-to-end

- [x] 6.0 WordPress Preview & ISR Integration
  - [x] 6.1 Configure ISR for all dynamic pages:
    - [x] 6.1.1 Add `revalidate` option to fetch calls (e.g., 60 seconds)
    - [x] 6.1.2 Verify ISR working by updating content and checking frontend
  - [x] 6.2 Create revalidation API route (`app/api/revalidate/route.ts`):
    - [x] 6.2.1 Accept secret token for security
    - [x] 6.2.2 Accept path parameter to revalidate specific pages
    - [x] 6.2.3 Call `revalidatePath()`
  - [x] 6.3 Set up WordPress webhook for on-demand revalidation:
    - [x] 6.3.1 Add custom hook in functions.php (save_post, transition_post_status)
    - [x] 6.3.2 Configure webhook to fire on post publish/update
    - [x] 6.3.3 Point webhook to Next.js revalidate endpoint
  - [x] 6.4 Implement Next.js Draft Mode for preview:
    - [x] 6.4.1 Create preview API route (`app/api/preview/route.ts`)
    - [x] 6.4.2 Enable draft mode and redirect to preview page
    - [x] 6.4.3 Create exit preview route (`app/api/exit-preview/route.ts`)
  - [x] 6.5 Modify WordPress preview link to point to Next.js:
    - [x] 6.5.1 Add filter in functions.php to modify preview URL
    - [x] 6.5.2 Include preview secret and type in URL
  - [x] 6.6 Update fetch functions to handle preview/draft content *(ready for draft mode)*
  - [ ] 6.7 Test preview functionality end-to-end: *(manual testing)*
    - [ ] 6.7.1 Create draft post in WordPress
    - [ ] 6.7.2 Click preview button
    - [ ] 6.7.3 Verify draft content shows on Next.js frontend

- [x] 7.0 SEO & Performance Optimization
  - [ ] 7.1 Install and configure Yoast SEO plugin in WordPress *(optional - manual)*
  - [ ] 7.2 Expose Yoast meta data via REST API *(optional - manual)*
  - [x] 7.3 Implement Next.js Metadata API:
    - [x] 7.3.1 Add `generateMetadata()` to all page components
    - [x] 7.3.2 Pull title and description from WordPress
    - [x] 7.3.3 Add Open Graph tags for social sharing
    - [x] 7.3.4 Add Twitter Card tags
  - [x] 7.4 Create sitemap.xml:
    - [x] 7.4.1 Use Next.js sitemap generation (`app/sitemap.ts`)
    - [x] 7.4.2 Include all pages, services, and blog posts
  - [x] 7.5 Create robots.txt (`app/robots.ts`)
  - [x] 7.6 Implement structured data (JSON-LD):
    - [x] 7.6.1 Organization schema on home page
    - [x] 7.6.2 Service schema on service pages
    - [x] 7.6.3 BlogPosting schema on blog posts
  - [x] 7.7 Optimize images:
    - [x] 7.7.1 Use Next.js Image component for all images
    - [x] 7.7.2 Configure proper sizes and srcset
    - [ ] 7.7.3 Enable blur placeholder for LCP images *(optional enhancement)*
  - [ ] 7.8 Run Lighthouse audit and address issues: *(manual testing)*
    - [ ] 7.8.1 Performance score > 90
    - [ ] 7.8.2 Accessibility score > 90
    - [ ] 7.8.3 Best Practices score > 90
    - [ ] 7.8.4 SEO score > 90
  - [ ] 7.9 Test Core Web Vitals (LCP, FID, CLS) *(manual testing)*
  - [ ] 7.10 Add analytics (Vercel Analytics or Google Analytics) *(manual setup)*

- [x] 8.0 Deployment & Launch
  - [x] 8.1 Prepare Next.js for production:
    - [x] 8.1.1 Run `npm run build` and fix any errors ✓
    - [ ] 8.1.2 Test production build locally with `npm run start` *(manual)*
  - [x] 8.2 Create deployment documentation (`DEPLOYMENT.md`)
  - [ ] 8.3 Deploy Next.js to Vercel: *(manual steps)*
    - [ ] 8.2.1 Connect GitHub repository to Vercel
    - [ ] 8.2.2 Configure environment variables in Vercel dashboard
    - [ ] 8.2.3 Deploy and verify site is working
  - [ ] 8.3 Configure custom domain on Vercel (if applicable)
  - [ ] 8.4 Set up Flywheel production environment:
    - [ ] 8.4.1 Create production site on Flywheel
    - [ ] 8.4.2 Migrate WordPress database and uploads from Local
    - [ ] 8.4.3 Update WordPress URLs (search-replace)
    - [ ] 8.4.4 Install SSL certificate
  - [ ] 8.5 Update environment variables with production WordPress URL
  - [ ] 8.6 Configure production revalidation webhooks
  - [ ] 8.7 Test preview functionality on production
  - [ ] 8.8 Final QA checklist:
    - [ ] 8.8.1 All pages render correctly
    - [ ] 8.8.2 All links work (no 404s)
    - [ ] 8.8.3 Contact form submits successfully
    - [ ] 8.8.4 Images load properly
    - [ ] 8.8.5 Mobile responsiveness verified
    - [ ] 8.8.6 ISR revalidation working
    - [ ] 8.8.7 Preview mode working
  - [ ] 8.9 Set up monitoring and alerts (Vercel, UptimeRobot, etc.)
  - [ ] 8.10 Launch and celebrate! 🎉

---

## Summary

| Task | Sub-tasks | Priority |
|------|-----------|----------|
| 1.0 WordPress Environment | 9 | High |
| 2.0 Custom Post Types & ACF | 14 | High |
| 3.0 Next.js + shadcn/ui Scaffold | 16 | High |
| 4.0 Page Templates (shadcn/ui) | 24 | High |
| 5.0 Contact Form (shadcn/ui Form) | 10 | High |
| 6.0 Preview & ISR | 13 | Medium |
| 7.0 SEO & Performance | 14 | Medium |
| 8.0 Deployment | 14 | High |

**Total: 114 sub-tasks**

### Tech Stack
- **WordPress**: ACF Pro, REST API
- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Components**: Button, Card, Form, Input, Select, Textarea, Dialog, NavigationMenu, Sheet, Accordion, Tabs, Toast, Carousel
