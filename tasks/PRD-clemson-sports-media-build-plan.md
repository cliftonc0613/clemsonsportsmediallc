# Clemson Sports Media Website
## Build Plan: Headless WordPress + Next.js Implementation

**Document Version:** 1.0  
**Date:** January 14, 2026  
**Project Manager:** Claude  
**Client:** Clifton - CT Web Design Shop Inc.

---

## Executive Summary

This document translates the original Astro-based PRD into a Headless WordPress + Next.js architecture, mapping all features to the new stack, identifying gaps and considerations, and providing a phased build plan with timeline estimates.

**Key Architecture Change:** Moving from Astro (static site generator) to Next.js (hybrid SSR/SSG framework) with your existing PWA theme as the foundation, while retaining WordPress as the headless CMS backend.

---

## Architecture Overview

### Original Stack (PRD)
- Frontend: Astro (Static Site Generator)
- Deployment: Netlify
- Content: WordPress REST API
- Email: Mailchimp

### New Stack (Implementation)
- Frontend: Next.js 14+ (App Router)
- Backend: Headless WordPress (existing at clemsonsportsmedia.com)
- Theme Base: Your existing PWA starter theme
- Deployment: Vercel (recommended) or Netlify
- Email: Mailchimp
- API Layer: WordPress REST API + WPGraphQL (recommended)

---

## Stack Translation Matrix

| PRD Feature | Astro Approach | Next.js Approach | Notes |
|-------------|---------------|------------------|-------|
| Static Generation | `getStaticPaths` + `.astro` files | `generateStaticParams` + Server Components | ISR enables real-time updates |
| API Fetching | Astro fetch at build | Server Components + fetch cache | More flexible caching strategies |
| Routing | File-based (`/pages`) | App Router (`/app`) | Dynamic routes with `[slug]` |
| SEO Meta | Astro SEO component | Next.js `metadata` API | Built-in, more powerful |
| Image Optimization | Astro Image | `next/image` | Automatic optimization |
| CSS/Styling | Tailwind CSS | Tailwind CSS | No change needed |
| Performance | Static HTML | ISR + Edge caching | Comparable with more flexibility |

---

## Feature Mapping & Requirements

### 1. Homepage

**Original Requirements:**
- Hero section with featured/latest posts
- Category-based content sections
- Newsletter subscription form
- Navigation menu
- Search functionality
- Mobile hamburger menu

**Next.js Implementation:**

```
/app
├── page.tsx                    # Homepage (Server Component)
├── components/
│   ├── Hero.tsx               # Featured posts hero
│   ├── CategorySection.tsx    # Category content blocks
│   ├── NewsletterForm.tsx     # Mailchimp integration (Client Component)
│   ├── Navigation/
│   │   ├── MainNav.tsx        # Desktop navigation
│   │   └── MobileNav.tsx      # Hamburger menu
│   └── SearchBar.tsx          # Search (Client Component)
```

**Data Fetching Strategy:**
```typescript
// Server Component - fetches at request time with revalidation
async function getHomepageData() {
  const featured = await fetch(
    'https://clemsonsportsmedia.com/wp-json/wp/v2/posts?sticky=true&per_page=3',
    { next: { revalidate: 300 } } // 5-minute cache
  );
  // Additional category fetches...
}
```

**PWA Theme Integration Points:**
- Leverage existing layout structure
- Adapt navigation component patterns
- Integrate with existing global styles

---

### 2. Blog Post Pages

**Original Requirements:**
- Full post content from WP REST API
- Featured image, date, author
- Category/tag displays
- Social sharing buttons
- Related posts section
- Newsletter CTA
- Full SEO implementation

**Next.js Implementation:**

```
/app
├── [slug]/
│   └── page.tsx               # Dynamic post pages
├── components/
│   ├── PostContent.tsx        # Rendered post content
│   ├── PostMeta.tsx          # Author, date, categories
│   ├── SocialShare.tsx       # Share buttons (Client Component)
│   ├── RelatedPosts.tsx      # Related content grid
│   └── PostNewsletter.tsx    # In-post CTA
```

**SEO Implementation:**
```typescript
// app/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt.rendered,
      images: [post._embedded['wp:featuredmedia']?.[0]?.source_url],
      url: `https://yoursite.com/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post._embedded.author[0].name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: post.excerpt.rendered,
      images: [post._embedded['wp:featuredmedia']?.[0]?.source_url],
    },
  };
}
```

**Schema.org/JSON-LD:**
```typescript
// components/ArticleSchema.tsx
export function ArticleSchema({ post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title.rendered,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Person',
      name: post._embedded.author[0].name,
    },
    image: post._embedded['wp:featuredmedia']?.[0]?.source_url,
    publisher: {
      '@type': 'Organization',
      name: 'Clemson Sports Media',
      logo: { '@type': 'ImageObject', url: 'https://yoursite.com/logo.png' }
    }
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

### 3. Category Archive Pages

**Original Requirements:**
- Paginated listings (12 posts/page)
- Category title/description
- Post previews with thumbnails
- Pagination controls

**Next.js Implementation:**

```
/app
├── category/
│   └── [slug]/
│       └── page.tsx           # Category archive
│       └── [page]/
│           └── page.tsx       # Paginated pages
```

**Pagination Strategy:**
```typescript
// Using route-based pagination
// /category/football -> page 1
// /category/football/2 -> page 2

export async function generateStaticParams() {
  const categories = await getCategories();
  const params = [];
  
  for (const cat of categories) {
    const totalPages = Math.ceil(cat.count / 12);
    for (let page = 1; page <= totalPages; page++) {
      params.push({ slug: cat.slug, page: page.toString() });
    }
  }
  return params;
}
```

---

### 4. Tag Archive Pages

**Implementation:** Mirror category structure

```
/app
├── tag/
│   └── [slug]/
│       └── page.tsx
│       └── [page]/
│           └── page.tsx
```

---

### 5. Newsletter Subscription (Mailchimp)

**Original Requirements:**
- Email/name inputs
- Privacy checkbox
- Success/error messaging
- Multiple placements (footer, post, popup)

**Next.js Implementation:**

```
/app
├── api/
│   └── newsletter/
│       └── route.ts           # Server-side Mailchimp API
├── components/
│   ├── NewsletterForm.tsx     # Reusable form (Client Component)
│   └── ExitIntentPopup.tsx    # Optional popup (Client Component)
```

**API Route (Server-side for security):**
```typescript
// app/api/newsletter/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, firstName } = await request.json();
  
  const response = await fetch(
    `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // Double opt-in
        merge_fields: { FNAME: firstName },
      }),
    }
  );
  
  if (response.ok) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Subscription failed' }, { status: 400 });
}
```

---

### 6. Navigation & Search

**Search Implementation Options:**

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| WordPress REST API Search | Simple, native | Slower, limited | For MVP |
| Algolia | Fast, powerful | Monthly cost | For scale |
| Fuse.js (client-side) | Free, fast | Loads all posts | For small sites |
| WP Search API + Caching | Balanced | Setup complexity | Best balance |

**Recommended Approach:**
```typescript
// Start with WordPress REST API, optimize later
// app/search/page.tsx

async function searchPosts(query: string) {
  const res = await fetch(
    `https://clemsonsportsmedia.com/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=20&_embed`
  );
  return res.json();
}
```

---

### 7. Performance Optimization

**Next.js Performance Strategy:**

| PRD Target | Next.js Solution |
|------------|------------------|
| LCP < 2.5s | `next/image` with priority, Server Components |
| FCP < 1.5s | Edge caching, minimal JS hydration |
| CLS < 0.1 | Image dimensions, font display swap |
| FID < 100ms | Code splitting, minimal client JS |

**Configuration:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['clemsonsportsmedia.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

**Caching Strategy:**
```typescript
// Revalidation periods
const CACHE_TIMES = {
  homepage: 300,      // 5 minutes
  postListing: 600,   // 10 minutes
  singlePost: 3600,   // 1 hour
  categories: 86400,  // 24 hours
};
```

---

## Identified Gaps & Considerations

### 1. WordPress Backend Enhancements Needed

| Enhancement | Priority | Reason |
|-------------|----------|--------|
| WPGraphQL Plugin | Medium | More efficient queries, fewer requests |
| ACF for custom fields | Low | If you need custom post metadata |
| JWT Authentication | Low | Only if you need authenticated features |
| Yoast SEO API data | High | Exposes SEO fields via REST API |
| Featured Posts field | Medium | Easier featured content management |

**Recommended WordPress Plugins:**
1. **WPGraphQL** - Better query efficiency
2. **Yoast SEO** - SEO data in API
3. **WP REST Cache** - API response caching
4. **Application Passwords** - Secure API access

### 2. PWA Theme Integration Gaps

| Gap | Solution |
|-----|----------|
| Layout structure compatibility | Audit PWA theme, create adapter components |
| Styling approach alignment | Ensure Tailwind config matches |
| Component patterns | Document PWA patterns, adapt as needed |
| Service Worker integration | May need updates for Next.js routing |

### 3. Feature Gaps from Original PRD

| Feature | Status | Notes |
|---------|--------|-------|
| Exit-intent popup | Nice-to-have | Add in Phase 3 |
| Search autocomplete | Nice-to-have | Add after MVP |
| Comment system | Not in PRD | Clarify if needed |
| Author pages | Not in PRD | Recommend adding |

### 4. Deployment Considerations

**Netlify vs Vercel:**

| Factor | Netlify | Vercel |
|--------|---------|--------|
| Next.js support | Good | Native (recommended) |
| ISR support | Limited | Full |
| Edge functions | Available | Native |
| Pricing | Competitive | Competitive |
| Build times | Fast | Very fast |

**Recommendation:** Vercel for optimal Next.js performance, but Netlify works if preferred.

---

## Project Structure

```
clemson-sports-media/
├── app/
│   ├── layout.tsx              # Root layout with PWA theme
│   ├── page.tsx                # Homepage
│   ├── [slug]/
│   │   └── page.tsx            # Single posts
│   ├── category/
│   │   └── [slug]/
│   │       ├── page.tsx        # Category archive
│   │       └── [page]/page.tsx # Paginated
│   ├── tag/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── [page]/page.tsx
│   ├── search/
│   │   └── page.tsx            # Search results
│   ├── api/
│   │   └── newsletter/
│   │       └── route.ts        # Mailchimp API
│   └── sitemap.ts              # Dynamic sitemap
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostGrid.tsx
│   │   ├── FeaturedPost.tsx
│   │   └── RelatedPosts.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── SearchBar.tsx
│   │   └── Pagination.tsx
│   ├── forms/
│   │   └── NewsletterForm.tsx
│   └── seo/
│       ├── ArticleSchema.tsx
│       └── BreadcrumbSchema.tsx
├── lib/
│   ├── wordpress.ts            # WP API client
│   ├── mailchimp.ts           # Mailchimp client
│   └── utils.ts               # Utilities
├── styles/
│   └── globals.css            # Tailwind + custom
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
└── next.config.js
```

---

## Build Plan & Timeline

### Phase 1: Foundation (Week 1-2)
**Goal:** Core infrastructure and basic content display

| Task | Estimate | Dependencies |
|------|----------|--------------|
| Project setup with Next.js 14 | 2 hours | None |
| PWA theme integration | 4 hours | Project setup |
| WordPress API client library | 3 hours | Project setup |
| Basic layout (Header, Footer) | 4 hours | Theme integration |
| Homepage with featured posts | 6 hours | API client, Layout |
| Single post pages | 6 hours | API client |
| Tailwind configuration | 2 hours | Project setup |
| Design system (colors, typography) | 3 hours | Tailwind config |

**Deliverables:**
- [ ] Next.js project with PWA theme base
- [ ] Working homepage with real WordPress data
- [ ] Single post pages with full content
- [ ] Responsive navigation

**Total Phase 1:** ~30 hours

---

### Phase 2: Content Architecture (Week 2-3)
**Goal:** Complete content structure and navigation

| Task | Estimate | Dependencies |
|------|----------|--------------|
| Category archive pages | 4 hours | Phase 1 |
| Tag archive pages | 3 hours | Phase 1 |
| Pagination component | 3 hours | Archive pages |
| Breadcrumb navigation | 2 hours | Phase 1 |
| Related posts component | 3 hours | Single post |
| Post metadata display | 2 hours | Single post |
| Image optimization setup | 2 hours | Phase 1 |

**Deliverables:**
- [ ] Category archives with pagination
- [ ] Tag archives with pagination
- [ ] Related posts on single pages
- [ ] Breadcrumb navigation
- [ ] Optimized image loading

**Total Phase 2:** ~19 hours

---

### Phase 3: SEO & Social (Week 3-4)
**Goal:** Complete SEO implementation

| Task | Estimate | Dependencies |
|------|----------|--------------|
| Dynamic metadata API | 3 hours | Phase 2 |
| Open Graph implementation | 2 hours | Metadata |
| Twitter Cards | 1 hour | Metadata |
| JSON-LD structured data | 4 hours | Phase 2 |
| Sitemap generation | 2 hours | Phase 2 |
| Robots.txt | 0.5 hours | Project setup |
| Canonical URLs | 1 hour | Metadata |
| Social sharing buttons | 3 hours | Single post |

**Deliverables:**
- [ ] Complete meta tag implementation
- [ ] Schema.org/JSON-LD on all pages
- [ ] Dynamic sitemap.xml
- [ ] Social sharing functionality

**Total Phase 3:** ~16.5 hours

---

### Phase 4: Newsletter & Search (Week 4)
**Goal:** User engagement features

| Task | Estimate | Dependencies |
|------|----------|--------------|
| Mailchimp API integration | 3 hours | None |
| Newsletter form component | 3 hours | Mailchimp API |
| Form placements (footer, post) | 2 hours | Newsletter form |
| Search functionality | 4 hours | Phase 2 |
| Search results page | 3 hours | Search |
| Mobile search experience | 2 hours | Search |

**Deliverables:**
- [ ] Working newsletter subscription
- [ ] Search across all posts
- [ ] Search results page

**Total Phase 4:** ~17 hours

---

### Phase 5: Performance & Polish (Week 5)
**Goal:** Production-ready optimization

| Task | Estimate | Dependencies |
|------|----------|--------------|
| Performance audit | 2 hours | All phases |
| Core Web Vitals optimization | 4 hours | Audit |
| Caching strategy implementation | 3 hours | Phase 1-4 |
| Error handling & 404 pages | 2 hours | Phase 1 |
| Loading states & skeletons | 3 hours | Phase 1-4 |
| Accessibility audit | 3 hours | All phases |
| Cross-browser testing | 2 hours | All phases |
| Mobile testing | 2 hours | All phases |

**Deliverables:**
- [ ] Lighthouse scores > 95
- [ ] Core Web Vitals passing
- [ ] Error handling
- [ ] Loading states
- [ ] Accessibility compliant

**Total Phase 5:** ~21 hours

---

### Phase 6: Deployment & Launch (Week 5-6)
**Goal:** Production deployment

| Task | Estimate | Dependencies |
|------|----------|--------------|
| Vercel/Netlify setup | 2 hours | All phases |
| Environment configuration | 1 hour | Deployment setup |
| Domain configuration | 1 hour | Deployment setup |
| SSL verification | 0.5 hours | Domain |
| CI/CD pipeline | 2 hours | Deployment |
| Monitoring setup | 2 hours | Deployment |
| Final QA testing | 4 hours | Everything |
| Launch | 1 hour | QA |

**Deliverables:**
- [ ] Production deployment
- [ ] Domain configured
- [ ] Monitoring active
- [ ] Site live

**Total Phase 6:** ~13.5 hours

---

## Total Project Estimate

| Phase | Hours | Weeks |
|-------|-------|-------|
| Phase 1: Foundation | 30 | 1-2 |
| Phase 2: Content Architecture | 19 | 2-3 |
| Phase 3: SEO & Social | 16.5 | 3-4 |
| Phase 4: Newsletter & Search | 17 | 4 |
| Phase 5: Performance & Polish | 21 | 5 |
| Phase 6: Deployment & Launch | 13.5 | 5-6 |
| **Total** | **117 hours** | **~6 weeks** |

**Buffer:** Add 20% for unknowns = **~140 hours total**

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| PWA theme incompatibility | Medium | High | Early audit, component adapters |
| WordPress API limitations | Low | Medium | WPGraphQL fallback |
| Performance targets missed | Low | High | Continuous monitoring, ISR tuning |
| Mailchimp integration issues | Low | Low | Well-documented API |
| Scope creep | Medium | Medium | Strict PRD adherence |

---

## Success Criteria

1. **Performance:** Lighthouse scores > 95 across all categories
2. **SEO:** All pages indexed, valid structured data
3. **Functionality:** All PRD features working
4. **Mobile:** Fully responsive, PWA-ready
5. **Content:** Real-time WordPress updates via ISR

---

## Next Steps

1. **Immediate:** Review and approve this build plan
2. **This Week:** Audit existing PWA theme structure
3. **Setup:** Initialize Next.js project with agreed configuration
4. **Kickoff:** Begin Phase 1 development

---

## Questions for Clarification

1. **PWA Theme:** Can you share the current PWA starter theme structure for integration planning?
2. **WordPress Plugins:** Are you open to adding WPGraphQL for better query efficiency?
3. **Hosting Preference:** Vercel (recommended) or stick with Netlify?
4. **Author Pages:** Should we add `/author/[slug]` routes?
5. **Comments:** Is a comment system needed, or will you use social engagement instead?
6. **Analytics:** Google Analytics, Plausible, or other preference?

---

*Document prepared by Claude | CT Web Design Shop Inc.*
