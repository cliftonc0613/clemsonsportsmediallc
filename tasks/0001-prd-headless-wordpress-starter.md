# PRD: Headless WordPress Starter Theme

**Document ID:** 0001-prd-headless-wordpress-starter
**Created:** January 7, 2025
**Status:** Draft
**Timeline:** 2-4 weeks (Fast MVP)

---

## 1. Introduction/Overview

This PRD defines the requirements for building a **Headless WordPress Starter Theme** - a reusable foundation for service-based business websites. The system combines WordPress as a content management backend with Next.js as a modern, fast frontend.

**Problem Statement:** Small business owners need fast, modern websites but want the familiar WordPress interface for content management. Traditional WordPress themes are slow and difficult to customize, while fully custom solutions are expensive and complex.

**Solution:** A headless architecture that gives business owners WordPress's user-friendly CMS while delivering a lightning-fast Next.js frontend with modern features like Incremental Static Regeneration (ISR).

---

## 2. Goals

| Goal | Metric | Target |
|------|--------|--------|
| **Fast page loads** | Lighthouse Performance Score | > 90 |
| **Lead generation** | Contact form submissions | Trackable via analytics |
| **Content flexibility** | Time to publish new content | < 5 minutes |
| **SEO performance** | Core Web Vitals | All "Good" ratings |
| **Reusability** | Setup time for new projects | < 1 day |

---

## 3. User Stories

### Content Editor (Small Business Owner)

| ID | User Story | Priority |
|----|------------|----------|
| US-01 | As a business owner, I want to edit my website content in WordPress so that I can update my site without developer help | High |
| US-02 | As a business owner, I want to preview my changes before publishing so that I can ensure content looks correct | High |
| US-03 | As a business owner, I want to add new services with pricing and features so that potential clients understand my offerings | High |
| US-04 | As a business owner, I want to manage testimonials so that I can showcase client success stories | Medium |
| US-05 | As a business owner, I want to write blog posts so that I can improve SEO and establish expertise | Medium |

### Website Visitor (Potential Client)

| ID | User Story | Priority |
|----|------------|----------|
| US-06 | As a visitor, I want pages to load quickly so that I don't abandon the site | High |
| US-07 | As a visitor, I want to easily find and understand services offered so that I can determine if this business meets my needs | High |
| US-08 | As a visitor, I want to read testimonials so that I can trust the business | Medium |
| US-09 | As a visitor, I want to contact the business with my project details so that I can get a quote | High |
| US-10 | As a visitor, I want the site to work well on mobile so that I can browse on any device | High |

### Developer

| ID | User Story | Priority |
|----|------------|----------|
| US-11 | As a developer, I want a reusable starter template so that I can quickly spin up new client sites | High |
| US-12 | As a developer, I want clear documentation so that I can customize the theme efficiently | Medium |

---

## 4. Functional Requirements

### 4.1 WordPress Backend

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The system must use Advanced Custom Fields (ACF) to register custom post types | High |
| FR-02 | The system must include a "Services" custom post type with the following fields: title, description, pricing, features (repeater), duration, and CTA button | High |
| FR-03 | The system must include a "Testimonials" custom post type with fields: client name, company, quote, and photo | High |
| FR-04 | The system must expose all custom post types via WordPress REST API | High |
| FR-05 | The system must support WordPress draft preview on the Next.js frontend | High |
| FR-06 | The system must include Yoast SEO integration for meta tags | Medium |

### 4.2 Next.js Frontend

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-07 | The frontend must include a Home page with hero section, featured services, and testimonials | High |
| FR-08 | The frontend must include a Services listing page showing all services | High |
| FR-09 | The frontend must include individual Service detail pages with full information | High |
| FR-10 | The frontend must include a Blog listing page with pagination | High |
| FR-11 | The frontend must include individual Blog post pages | High |
| FR-12 | The frontend must include a Testimonials page or section | Medium |
| FR-13 | The frontend must include a Contact page with a detailed form | High |
| FR-14 | The frontend must implement ISR (Incremental Static Regeneration) for all pages | High |
| FR-15 | The frontend must implement Next.js Draft Mode for WordPress preview | High |
| FR-16 | The frontend must be fully responsive (mobile, tablet, desktop) | High |

### 4.3 Contact Form

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-17 | The contact form must capture: name, email, phone number | High |
| FR-18 | The contact form must capture: service interest (dropdown of services) | High |
| FR-19 | The contact form must capture: message (textarea) | High |
| FR-20 | The contact form must capture: budget range (dropdown) | Medium |
| FR-21 | The contact form must capture: timeline (dropdown) | Medium |
| FR-22 | The contact form must capture: how they heard about us (dropdown) | Medium |
| FR-23 | The contact form must validate all required fields before submission | High |
| FR-24 | The contact form must display success/error messages after submission | High |
| FR-25 | Form submissions must be stored/emailed (via Vercel, Formspree, or similar) | High |

### 4.4 SEO & Performance

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-26 | All pages must include proper meta tags (title, description, OG tags) | High |
| FR-27 | The system must generate a sitemap.xml | Medium |
| FR-28 | The system must include structured data (JSON-LD) for services | Medium |
| FR-29 | Images must be optimized using Next.js Image component | High |
| FR-30 | The site must achieve Lighthouse Performance score > 90 | High |

---

## 5. Non-Goals (Out of Scope)

The following are explicitly **not** included in this MVP:

- E-commerce functionality (shopping cart, checkout, payments)
- User authentication / member areas
- Multi-language support (i18n)
- Advanced search functionality
- Newsletter integration
- Live chat widget
- Social media feed integration
- Custom WordPress admin dashboard modifications
- Automated testing suite

---

## 6. Design Considerations

### 6.1 UI/UX Requirements

| Aspect | Requirement |
|--------|-------------|
| **Framework** | Tailwind CSS (included in starter template) |
| **Typography** | Clean, readable fonts suitable for business sites |
| **Color Scheme** | Configurable via Tailwind config (CSS variables) |
| **Spacing** | Consistent spacing scale using Tailwind defaults |
| **Components** | Reusable React components for cards, buttons, forms |

### 6.2 Page Layouts

| Page | Key Sections |
|------|--------------|
| **Home** | Hero, Services preview (3-4), Testimonials carousel, CTA |
| **Services** | Page header, Services grid/list, CTA |
| **Service Detail** | Title, description, pricing, features list, duration, CTA |
| **Blog** | Page header, Posts grid, Pagination |
| **Blog Post** | Title, meta (date, author), Content, Related posts |
| **Testimonials** | Page header, Testimonials grid |
| **Contact** | Page header, Contact form, Contact info (address, phone, email) |

---

## 7. Technical Considerations

### 7.1 Architecture

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

### 7.2 Tech Stack

| Layer | Technology |
|-------|------------|
| CMS | WordPress on Flywheel |
| API | WordPress REST API |
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Hosting | Vercel (frontend), Flywheel (WordPress) |
| Forms | Vercel Functions or Formspree |

### 7.3 Dependencies

| Dependency | Purpose |
|------------|---------|
| Advanced Custom Fields | Custom post types and fields |
| Yoast SEO | SEO meta tags exposed via REST API |
| next | React framework |
| tailwindcss | Utility-first CSS |

### 7.4 Environment Variables

```env
WORDPRESS_API_URL=https://your-site.flywheelsites.com/wp-json
WORDPRESS_PREVIEW_SECRET=your-secret-key
REVALIDATE_SECRET=your-revalidation-secret
```

---

## 8. Success Metrics

| Metric | Measurement Method | Target |
|--------|-------------------|--------|
| **Lead Form Submissions** | Form analytics / email count | Track baseline, improve 10% monthly |
| **Page Views** | Google Analytics / Vercel Analytics | Track growth month-over-month |
| **Bounce Rate** | Google Analytics | < 50% |
| **Avg. Session Duration** | Google Analytics | > 2 minutes |
| **Pages Per Session** | Google Analytics | > 2.5 pages |
| **Lighthouse Performance** | Lighthouse CI | > 90 |
| **Core Web Vitals** | Google Search Console | All "Good" |
| **Time to First Byte** | Vercel Analytics | < 200ms |

---

## 9. Open Questions

| ID | Question | Status |
|----|----------|--------|
| OQ-01 | Which form service should be used? (Vercel Functions, Formspree, Netlify Forms) | Open |
| OQ-02 | Should blog posts include categories/tags filtering? | Open |
| OQ-03 | Is a search feature needed for blog posts? | Open |
| OQ-04 | Should testimonials be linked to specific services? | Open |
| OQ-05 | What analytics platform will be used? (GA4, Vercel Analytics, Plausible) | Open |
| OQ-06 | Are there specific brand colors/fonts to use? | Open |

---

## 10. Implementation Phases

### Phase 1: WordPress Setup (Week 1)
- Set up Local by Flywheel
- Install and configure ACF
- Create Services CPT with all fields
- Create Testimonials CPT with all fields
- Add sample content
- Test REST API endpoints

### Phase 2: Next.js Frontend (Week 1-2)
- Clone starter template
- Configure environment variables
- Build all page templates
- Implement ISR
- Set up Draft Mode preview
- Style with Tailwind

### Phase 3: Integration & Polish (Week 2-3)
- Connect preview functionality
- Build and integrate contact form
- Implement SEO meta tags
- Performance optimization
- Mobile responsiveness testing

### Phase 4: Deployment (Week 3-4)
- Deploy to Vercel
- Configure production WordPress
- Set up revalidation webhooks
- Final QA and testing
- Launch

---

## Appendix: Services CPT Field Schema

```json
{
  "post_type": "services",
  "fields": [
    {"name": "title", "type": "text", "required": true},
    {"name": "description", "type": "wysiwyg", "required": true},
    {"name": "pricing", "type": "text", "required": true},
    {"name": "features", "type": "repeater", "sub_fields": [
      {"name": "feature", "type": "text"}
    ]},
    {"name": "duration", "type": "text", "required": false},
    {"name": "cta_text", "type": "text", "default": "Get Started"},
    {"name": "cta_link", "type": "url", "required": false}
  ]
}
```

## Appendix: Testimonials CPT Field Schema

```json
{
  "post_type": "testimonials",
  "fields": [
    {"name": "client_name", "type": "text", "required": true},
    {"name": "company", "type": "text", "required": false},
    {"name": "quote", "type": "textarea", "required": true},
    {"name": "photo", "type": "image", "required": false}
  ]
}
```

## Appendix: Contact Form Field Schema

```json
{
  "form_fields": [
    {"name": "name", "type": "text", "required": true},
    {"name": "email", "type": "email", "required": true},
    {"name": "phone", "type": "tel", "required": true},
    {"name": "service_interest", "type": "select", "required": true, "options": "dynamic_from_services"},
    {"name": "message", "type": "textarea", "required": true},
    {"name": "budget_range", "type": "select", "required": false, "options": ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000+"]},
    {"name": "timeline", "type": "select", "required": false, "options": ["ASAP", "1-2 weeks", "1 month", "2-3 months", "Flexible"]},
    {"name": "how_heard", "type": "select", "required": false, "options": ["Google Search", "Social Media", "Referral", "Other"]}
  ]
}
```
