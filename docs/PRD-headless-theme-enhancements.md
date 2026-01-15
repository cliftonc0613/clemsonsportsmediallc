# Product Requirements Document: Headless WordPress Theme Enhancements

**Document Version:** 1.0
**Date:** January 11, 2026
**Author:** Claude Code
**Status:** Draft
**Project:** mytheme Headless WordPress Enhancement

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Goals & Objectives](#3-goals--objectives)
4. [Scope](#4-scope)
5. [Feature Requirements](#5-feature-requirements)
   - [Phase 1: SEO & Discoverability](#phase-1-seo--discoverability)
   - [Phase 2: Performance & Caching](#phase-2-performance--caching)
   - [Phase 3: Search & Filtering](#phase-3-search--filtering)
   - [Phase 4: Testing & Monitoring](#phase-4-testing--monitoring)
6. [Technical Architecture](#6-technical-architecture)
7. [Dependencies & Prerequisites](#7-dependencies--prerequisites)
8. [Success Metrics & KPIs](#8-success-metrics--kpis)
9. [Risk Assessment](#9-risk-assessment)
10. [Timeline & Milestones](#10-timeline--milestones)
11. [Appendices](#11-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This PRD outlines a comprehensive enhancement plan for the mytheme headless WordPress theme to improve SEO discoverability, performance, search functionality, and code reliability through testing and monitoring.

### 1.2 Background

The current mytheme implementation is a production-ready headless WordPress starter theme (v1.2.0) with:
- WordPress backend with custom post types (Services, Testimonials)
- Next.js 16.1.1 frontend with App Router
- REST API integration with ACF fields
- Preview mode and ISR revalidation
- YouTube video player integration

### 1.3 Problem Statement

While functional, the current implementation lacks:
- Comprehensive SEO optimization (structured data, sitemaps, meta management)
- Advanced caching strategies for optimal performance
- Search functionality for content discovery
- Automated testing and error monitoring

### 1.4 Proposed Solution

Implement four enhancement phases that address these gaps while maintaining the existing architecture and developer experience.

---

## 2. Current State Analysis

### 2.1 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| CMS | WordPress | Latest |
| Theme Framework | Custom PHP | 1.2.0 |
| Frontend Framework | Next.js | 16.1.1 |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS | 4.0 |
| Component Library | shadcn/ui + Radix | Latest |
| Animation | GSAP | 3.14.2 |
| Video | Video.js | 8.23.4 |
| Forms | React Hook Form + Zod | 7.70.0 / 4.3.5 |

### 2.2 Current Features

#### WordPress Backend
- Custom Post Types: Services, Testimonials
- ACF field groups with REST API exposure
- Custom REST fields (featured_image_url, author_name, acf)
- Preview mode integration
- ISR revalidation webhooks
- YouTube player shortcode and block pattern

#### Next.js Frontend
- App Router with dynamic routes
- TypeScript interfaces for WordPress data
- Comprehensive fetch functions (575 lines)
- Contact form with validation
- Dark mode support
- GSAP scroll animations
- Headroom.js smart header

### 2.3 Current Gaps

| Area | Gap | Impact |
|------|-----|--------|
| SEO | No structured data | Lower search rankings |
| SEO | No dynamic sitemap | Poor crawlability |
| SEO | Basic meta tags only | Missing rich snippets |
| Performance | No SWR caching | Unnecessary API calls |
| Performance | Basic image handling | Slow page loads |
| Search | No search endpoint | Poor content discovery |
| Search | No filtering | Limited navigation |
| Quality | No automated tests | Regression risk |
| Quality | No error tracking | Silent failures |

---

## 3. Goals & Objectives

### 3.1 Primary Goals

1. **Improve SEO Performance**
   - Achieve Lighthouse SEO score > 95
   - Enable rich snippets in search results
   - Ensure complete site crawlability

2. **Optimize Performance**
   - Achieve Lighthouse Performance score > 90
   - Reduce Time to First Byte (TTFB) < 200ms
   - Implement efficient caching strategies

3. **Enable Content Discovery**
   - Provide site-wide search functionality
   - Enable category/tag filtering
   - Surface related content

4. **Ensure Code Quality**
   - Achieve > 80% test coverage on critical paths
   - Implement real-time error tracking
   - Enable proactive monitoring

### 3.2 Success Criteria

- All Lighthouse scores > 90
- Search response time < 200ms
- Zero critical errors in production
- 99.9% uptime
- Complete test coverage for API layer

---

## 4. Scope

### 4.1 In Scope

- SEO metadata management and structured data
- Dynamic sitemap and robots.txt generation
- Client-side caching with SWR
- Image optimization pipeline
- Search functionality (frontend + API)
- Content filtering and related posts
- Unit and integration testing setup
- Error tracking and monitoring
- Health check endpoints

### 4.2 Out of Scope

- GraphQL implementation (future consideration)
- User authentication/JWT (separate initiative)
- E-commerce functionality
- Multi-language support (i18n)
- WordPress admin UI customization
- Database optimization
- CDN configuration
- Server-side caching (Redis/Memcached)

### 4.3 Assumptions

- RankMath SEO plugin will be installed on WordPress with Headless CMS Support enabled
- Vercel hosting for Next.js frontend
- Flywheel/WP Engine hosting for WordPress
- GitHub for version control
- Team has access to Sentry or similar monitoring service

### 4.4 Constraints

- Must maintain backward compatibility with existing content
- Cannot modify WordPress core files
- Must work with existing ACF field structure
- Budget constraints on third-party services

---

## 5. Feature Requirements

## Phase 1: SEO & Discoverability

### F1.1 RankMath SEO REST API Integration

**Priority:** P0 (Critical)
**Effort:** Medium

#### Description
Integrate RankMath SEO plugin data into Next.js frontend for comprehensive meta tag management using RankMath's headless CMS support.

#### User Stories
- As a content editor, I want SEO settings from WordPress to automatically appear on the frontend
- As a developer, I want a simple API to fetch SEO metadata for any page/post

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F1.1.1 | Fetch RankMath meta from REST API | `/wp-json/rankmath/v1/getHead` endpoint returns head data |
| F1.1.2 | Dynamic metadata generation | Next.js `generateMetadata()` uses RankMath data |
| F1.1.3 | Fallback meta tags | Default meta tags when RankMath data unavailable |
| F1.1.4 | Open Graph tags | OG title, description, image from RankMath |
| F1.1.5 | Twitter Card tags | Twitter meta tags from RankMath |
| F1.1.6 | Canonical URLs | Proper canonical URL handling |

#### Technical Specifications

> **Note:** RankMath returns an HTML string containing all meta tags, unlike Yoast which provides structured JSON. A parsing utility is required to extract individual meta values.

**Interfaces and Types:**
```typescript
interface RankMathMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  og_title: string;
  og_description: string;
  og_image: { url: string; width?: number; height?: number }[];
  og_type: string;
  og_locale: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  schema: object[];
}

interface RankMathResponse {
  success: boolean;
  head: string; // HTML string containing all meta tags
}
```

**New Function: `getRankMathMeta(pageUrl: string)`**
```typescript
/**
 * Fetch SEO metadata from RankMath REST API
 * Note: Requires full URL, not just slug
 */
async function getRankMathMeta(pageUrl: string): Promise<RankMathMeta> {
  const endpoint = `${process.env.WORDPRESS_API_URL}/rankmath/v1/getHead`;
  const response = await fetch(`${endpoint}?url=${encodeURIComponent(pageUrl)}`);
  const data: RankMathResponse = await response.json();

  if (!data.success) {
    throw new Error('Failed to fetch RankMath meta');
  }

  return parseRankMathHead(data.head);
}
```

**Parsing Utility: `parseRankMathHead(html: string)`**
```typescript
/**
 * Parse HTML head string into structured RankMathMeta object
 */
function parseRankMathHead(html: string): RankMathMeta {
  // Extract title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const title = titleMatch?.[1] || '';

  // Extract meta description
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  const description = descMatch?.[1] || '';

  // Extract canonical
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
  const canonical = canonicalMatch?.[1] || '';

  // Extract robots
  const robotsMatch = html.match(/<meta name="robots" content="([^"]*)"/);
  const robots = robotsMatch?.[1] || '';

  // Extract Open Graph tags
  const ogTitle = extractMetaProperty(html, 'og:title');
  const ogDesc = extractMetaProperty(html, 'og:description');
  const ogImage = extractMetaProperty(html, 'og:image');
  const ogType = extractMetaProperty(html, 'og:type');
  const ogLocale = extractMetaProperty(html, 'og:locale');

  // Extract Twitter tags
  const twitterCard = extractMetaName(html, 'twitter:card');
  const twitterTitle = extractMetaName(html, 'twitter:title');
  const twitterDesc = extractMetaName(html, 'twitter:description');
  const twitterImage = extractMetaName(html, 'twitter:image');

  // Extract JSON-LD schema
  const schemaMatches = html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g);
  const schema = [...schemaMatches].map(m => JSON.parse(m[1]));

  return {
    title,
    description,
    canonical,
    robots,
    og_title: ogTitle,
    og_description: ogDesc,
    og_image: ogImage ? [{ url: ogImage }] : [],
    og_type: ogType,
    og_locale: ogLocale,
    twitter_card: twitterCard,
    twitter_title: twitterTitle,
    twitter_description: twitterDesc,
    twitter_image: twitterImage,
    schema,
  };
}

function extractMetaProperty(html: string, property: string): string {
  const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`));
  return match?.[1] || '';
}

function extractMetaName(html: string, name: string): string {
  const match = html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`));
  return match?.[1] || '';
}
```

**Files to Modify:**
- `frontend/lib/wordpress.ts` - Add `getSeoMeta()` function
- `frontend/app/layout.tsx` - Default metadata configuration
- `frontend/app/[slug]/page.tsx` - Dynamic page metadata
- `frontend/app/blog/[slug]/page.tsx` - Blog post metadata
- `frontend/app/services/[slug]/page.tsx` - Service metadata

#### Dependencies
- RankMath SEO WordPress plugin (free version sufficient)
- Headless CMS Support enabled in RankMath settings

> **RankMath Setup Required:** Enable Headless CMS Support in WordPress admin:
> Rank Math SEO → General Settings → Others → Enable "Headless CMS Support"

---

### F1.2 Structured Data (Schema.org)

**Priority:** P0 (Critical)
**Effort:** Medium

#### Description
Implement JSON-LD structured data for enhanced search result appearance (rich snippets).

#### User Stories
- As a business owner, I want my services to appear with rich snippets in Google
- As a blog reader, I want to see article metadata in search results

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F1.2.1 | Organization schema | Site-wide organization data in JSON-LD |
| F1.2.2 | LocalBusiness schema | Business info for local SEO |
| F1.2.3 | Article schema | Blog posts with article markup |
| F1.2.4 | Service schema | Service offerings with pricing |
| F1.2.5 | BreadcrumbList schema | Navigation breadcrumbs |
| F1.2.6 | FAQPage schema | FAQ sections with Q&A markup |
| F1.2.7 | Review schema | Testimonials as reviews |

#### Technical Specifications

**New Component: `StructuredData`**
```typescript
interface StructuredDataProps {
  type: 'Organization' | 'LocalBusiness' | 'Article' | 'Service' | 'FAQPage' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

function StructuredData({ type, data }: StructuredDataProps): JSX.Element
```

**Schema Library: `frontend/lib/schema.ts`**
```typescript
export function generateOrganizationSchema(data: OrganizationData): object;
export function generateArticleSchema(post: WPPost): object;
export function generateServiceSchema(service: WPService): object;
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object;
export function generateFAQSchema(faqs: FAQ[]): object;
export function generateReviewSchema(testimonial: WPTestimonial): object;
```

**Files to Create:**
- `frontend/lib/schema.ts` - Schema generation functions
- `frontend/components/structured-data.tsx` - JSON-LD component

**Files to Modify:**
- `frontend/app/layout.tsx` - Organization schema
- `frontend/app/[slug]/page.tsx` - Page-specific schemas
- `frontend/app/blog/[slug]/page.tsx` - Article schema
- `frontend/app/services/[slug]/page.tsx` - Service schema
- `frontend/app/testimonials/page.tsx` - Review schema

---

### F1.3 Dynamic Sitemap Generation

**Priority:** P0 (Critical)
**Effort:** Low

#### Description
Generate XML sitemap dynamically from WordPress content using Next.js App Router.

#### User Stories
- As a search engine, I want to discover all pages on the site
- As an SEO manager, I want the sitemap to update automatically with new content

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F1.3.1 | Dynamic sitemap route | `/sitemap.xml` returns valid XML |
| F1.3.2 | Include all content types | Posts, pages, services in sitemap |
| F1.3.3 | Last modified dates | `lastmod` from WordPress modified date |
| F1.3.4 | Change frequency | Appropriate `changefreq` per content type |
| F1.3.5 | Priority settings | Priority based on content importance |
| F1.3.6 | Exclude private content | Draft/private content excluded |

#### Technical Specifications

**New File: `frontend/app/sitemap.ts`**
```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const pages = await getPages();
  const services = await getServices();

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...pages.map(page => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.modified),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    })),
    // ... posts, services
  ];
}
```

---

### F1.4 Robots.txt Configuration

**Priority:** P1 (High)
**Effort:** Low

#### Description
Dynamic robots.txt generation with proper crawl directives.

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F1.4.1 | Dynamic robots.txt | `/robots.txt` returns valid format |
| F1.4.2 | Sitemap reference | Points to sitemap.xml |
| F1.4.3 | Crawl directives | Allow/disallow appropriate paths |
| F1.4.4 | Environment awareness | Different rules for staging vs production |

#### Technical Specifications

**New File: `frontend/app/robots.ts`**
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

---

## Phase 2: Performance & Caching

### F2.1 SWR Data Fetching Hooks

**Priority:** P1 (High)
**Effort:** Medium

#### Description
Implement SWR (stale-while-revalidate) hooks for client-side data fetching with automatic caching and revalidation.

#### User Stories
- As a user, I want pages to load instantly from cache while fresh data loads
- As a developer, I want simple hooks for fetching WordPress data

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F2.1.1 | usePosts hook | Fetch posts with SWR caching |
| F2.1.2 | useServices hook | Fetch services with SWR caching |
| F2.1.3 | useTestimonials hook | Fetch testimonials with SWR |
| F2.1.4 | useSearch hook | Search with debounced queries |
| F2.1.5 | Global SWR config | Shared configuration for all hooks |
| F2.1.6 | Error handling | Graceful error states |
| F2.1.7 | Loading states | Skeleton/loading UI support |

#### Technical Specifications

**New File: `frontend/lib/hooks/use-wordpress.ts`**
```typescript
import useSWR from 'swr';

export function usePosts(options?: PostsOptions) {
  return useSWR(['posts', options], () => getPosts(options), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useServices() {
  return useSWR('services', getServices);
}

export function useSearch(query: string) {
  return useSWR(
    query ? ['search', query] : null,
    () => searchContent(query),
    { dedupingInterval: 300 }
  );
}
```

**New File: `frontend/lib/swr-config.tsx`**
```typescript
'use client';
import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 60000,
    }}>
      {children}
    </SWRConfig>
  );
}
```

#### Dependencies
- `swr` package (^2.2.0)

---

### F2.2 Image Optimization Component

**Priority:** P1 (High)
**Effort:** Medium

#### Description
Enhanced image component optimized for WordPress media with blur placeholders, responsive sizing, and lazy loading.

#### User Stories
- As a user, I want images to load progressively without layout shift
- As a developer, I want a drop-in component for WordPress images

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F2.2.1 | Blur placeholder | Low-quality image placeholder while loading |
| F2.2.2 | Responsive srcset | Multiple sizes for different viewports |
| F2.2.3 | Lazy loading | Images load when entering viewport |
| F2.2.4 | Aspect ratio | Prevent layout shift with fixed ratios |
| F2.2.5 | WebP/AVIF support | Modern format delivery |
| F2.2.6 | Error fallback | Graceful handling of missing images |
| F2.2.7 | WordPress integration | Accept WPImage/ACFImage types |

#### Technical Specifications

**New Component: `frontend/components/wp-image.tsx`**
```typescript
interface WPImageProps {
  image: WPImage | ACFImage;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

export function WPImage({
  image,
  alt,
  sizes = '100vw',
  priority = false,
  aspectRatio = 'auto',
}: WPImageProps): JSX.Element
```

**Configuration: `frontend/next.config.ts`**
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.flavorsofclt.com' },
    { protocol: 'https', hostname: '*.flavorsofclt.local' },
  ],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
}
```

---

### F2.3 Bundle Optimization

**Priority:** P2 (Medium)
**Effort:** Medium

#### Description
Analyze and optimize JavaScript bundle size through code splitting and dynamic imports.

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F2.3.1 | Bundle analysis | Visual bundle size report |
| F2.3.2 | Dynamic imports | Heavy libs loaded on demand |
| F2.3.3 | Tree shaking | Unused code eliminated |
| F2.3.4 | Font optimization | Subset fonts, display swap |
| F2.3.5 | Code splitting | Route-based chunks |

#### Technical Specifications

**Dynamic Import Examples:**
```typescript
// Video.js loaded only when needed
const VideoPlayer = dynamic(() => import('@/components/video-player'), {
  loading: () => <VideoSkeleton />,
  ssr: false,
});

// GSAP loaded only for animated pages
const AnimatedSection = dynamic(() => import('@/components/animated-section'));
```

**Bundle Analyzer Script:**
```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

#### Dependencies
- `@next/bundle-analyzer` (^14.0.0)

---

## Phase 3: Search & Filtering

### F3.1 Search Endpoint Integration

**Priority:** P1 (High)
**Effort:** Low

#### Description
Integrate WordPress REST API search endpoint for full-text content search.

#### User Stories
- As a user, I want to search for content across the entire site
- As a developer, I want a typed search function

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F3.1.1 | Search function | Query WordPress search endpoint |
| F3.1.2 | Type filtering | Filter by post type |
| F3.1.3 | Result formatting | Consistent result structure |
| F3.1.4 | Highlight matching | Return context around matches |
| F3.1.5 | Pagination | Support paginated results |

#### Technical Specifications

**New Function: `searchContent()`**
```typescript
interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  type: 'post' | 'page' | 'service';
  date: string;
}

interface SearchOptions {
  query: string;
  type?: 'post' | 'page' | 'service' | 'any';
  page?: number;
  perPage?: number;
}

async function searchContent(options: SearchOptions): Promise<{
  results: SearchResult[];
  total: number;
  totalPages: number;
}>
```

**WordPress REST API Endpoint:**
```
GET /wp-json/wp/v2/search?search={query}&type={type}&per_page={perPage}&page={page}
```

---

### F3.2 Search UI Components

**Priority:** P1 (High)
**Effort:** Medium

#### Description
Search bar component with real-time suggestions and full search results page.

#### User Stories
- As a user, I want to see search suggestions as I type
- As a user, I want a dedicated page to view all search results

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F3.2.1 | Search bar | Input with search icon |
| F3.2.2 | Debounced input | 300ms debounce on typing |
| F3.2.3 | Quick results | Dropdown with top 5 results |
| F3.2.4 | Results page | `/search?q={query}` route |
| F3.2.5 | Result cards | Title, excerpt, type badge |
| F3.2.6 | No results state | Helpful message when empty |
| F3.2.7 | Loading state | Skeleton while searching |
| F3.2.8 | Keyboard navigation | Arrow keys, Enter to select |

#### Technical Specifications

**New Files:**
- `frontend/components/search-bar.tsx` - Search input component
- `frontend/components/search-results.tsx` - Results display
- `frontend/app/search/page.tsx` - Search results page

**Search Bar Component:**
```typescript
interface SearchBarProps {
  placeholder?: string;
  showQuickResults?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = 'Search...',
  showQuickResults = true,
}: SearchBarProps): JSX.Element
```

---

### F3.3 Category & Tag Filtering

**Priority:** P2 (Medium)
**Effort:** Medium

#### Description
Filter blog posts by category and tag with URL-based state management.

#### User Stories
- As a reader, I want to filter blog posts by category
- As a user, I want to share filtered views via URL

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F3.3.1 | Category filter | Dropdown/pills for categories |
| F3.3.2 | Tag filter | Multi-select for tags |
| F3.3.3 | URL state | `/blog?category=news&tag=featured` |
| F3.3.4 | Active indicators | Visual feedback for active filters |
| F3.3.5 | Clear filters | Reset all filters button |
| F3.3.6 | Result count | Show "X posts found" |

#### Technical Specifications

**Modified File: `frontend/app/blog/page.tsx`**
```typescript
interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getPosts({
    category: searchParams.category,
    tag: searchParams.tag,
    page: parseInt(searchParams.page || '1'),
  });
  // ...
}
```

**New Component: `frontend/components/blog-filters.tsx`**
```typescript
interface BlogFiltersProps {
  categories: WPCategory[];
  tags: WPTag[];
  activeCategory?: string;
  activeTags?: string[];
}
```

---

### F3.4 Related Content

**Priority:** P2 (Medium)
**Effort:** Low

#### Description
Display related posts/services based on shared categories or tags.

#### User Stories
- As a reader, I want to discover related articles after reading a post
- As a service browser, I want to see similar services

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F3.4.1 | Related posts | 3-4 posts with shared categories/tags |
| F3.4.2 | Related services | Services in same category |
| F3.4.3 | Fallback content | Recent posts if no matches |
| F3.4.4 | Exclude current | Don't show current post in related |

#### Technical Specifications

**New Function: `getRelatedContent()`**
```typescript
async function getRelatedPosts(
  currentId: number,
  categories: number[],
  tags: number[],
  limit?: number
): Promise<WPPost[]>
```

**New Component: `frontend/components/related-posts.tsx`**
```typescript
interface RelatedPostsProps {
  currentPostId: number;
  categories: number[];
  tags: number[];
  title?: string;
}
```

---

## Phase 4: Testing & Monitoring

### F4.1 Unit Testing Setup

**Priority:** P1 (High)
**Effort:** Medium

#### Description
Establish Jest testing framework with React Testing Library for component and utility testing.

#### User Stories
- As a developer, I want to run tests before deploying
- As a team member, I want confidence that changes don't break existing functionality

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F4.1.1 | Jest configuration | Jest configured for Next.js |
| F4.1.2 | API function tests | Tests for wordpress.ts functions |
| F4.1.3 | Component tests | Tests for key components |
| F4.1.4 | Schema tests | Tests for validation schemas |
| F4.1.5 | Mock utilities | WordPress API mocks |
| F4.1.6 | Coverage reporting | Coverage report generation |
| F4.1.7 | CI integration | Tests run on PR/push |

#### Technical Specifications

**New Files:**
- `frontend/jest.config.js` - Jest configuration
- `frontend/jest.setup.js` - Test setup file
- `frontend/__tests__/lib/wordpress.test.ts` - API tests
- `frontend/__tests__/lib/schema.test.ts` - Schema tests
- `frontend/__tests__/components/*.test.tsx` - Component tests
- `frontend/__mocks__/wordpress.ts` - API mocks

**Jest Configuration:**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
});
```

#### Dependencies
- `jest` (^29.0.0)
- `@testing-library/react` (^14.0.0)
- `@testing-library/jest-dom` (^6.0.0)

---

### F4.2 E2E Testing

**Priority:** P2 (Medium)
**Effort:** Medium

#### Description
End-to-end testing with Playwright for critical user flows.

#### User Stories
- As a QA engineer, I want automated tests for user journeys
- As a developer, I want to catch integration issues before production

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F4.2.1 | Playwright setup | Playwright configured for Next.js |
| F4.2.2 | Navigation tests | Test page navigation |
| F4.2.3 | Form tests | Test contact form submission |
| F4.2.4 | Search tests | Test search functionality |
| F4.2.5 | Responsive tests | Test mobile/desktop views |
| F4.2.6 | Visual regression | Screenshot comparisons |

#### Technical Specifications

**New Files:**
- `frontend/playwright.config.ts` - Playwright configuration
- `frontend/e2e/navigation.spec.ts` - Navigation tests
- `frontend/e2e/contact-form.spec.ts` - Form tests
- `frontend/e2e/search.spec.ts` - Search tests

**Playwright Configuration:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Dependencies
- `@playwright/test` (^1.40.0)

---

### F4.3 Error Tracking

**Priority:** P1 (High)
**Effort:** Low

#### Description
Implement Sentry for real-time error tracking and performance monitoring.

#### User Stories
- As a developer, I want to be alerted when errors occur in production
- As a team lead, I want visibility into error trends

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F4.3.1 | Sentry initialization | Sentry SDK configured |
| F4.3.2 | Error capture | Client and server errors tracked |
| F4.3.3 | Source maps | Readable stack traces |
| F4.3.4 | Performance monitoring | Core Web Vitals tracked |
| F4.3.5 | Release tracking | Errors linked to releases |
| F4.3.6 | User context | User info attached to errors |
| F4.3.7 | Custom tags | Environment, route tags |

#### Technical Specifications

**Sentry Configuration:**
```typescript
// frontend/sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
});
```

**API Error Wrapping:**
```typescript
// In wordpress.ts
try {
  const response = await fetch(url);
  // ...
} catch (error) {
  Sentry.captureException(error, {
    tags: { api: 'wordpress', endpoint: url },
  });
  throw error;
}
```

#### Dependencies
- `@sentry/nextjs` (^8.0.0)

---

### F4.4 Health Checks & Logging

**Priority:** P2 (Medium)
**Effort:** Low

#### Description
Health check endpoint and structured logging for monitoring and debugging.

#### User Stories
- As an ops engineer, I want to monitor application health
- As a developer, I want structured logs for debugging

#### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F4.4.1 | Health endpoint | `/api/health` returns status |
| F4.4.2 | WordPress check | Verify WordPress API connectivity |
| F4.4.3 | Response times | Track API response latency |
| F4.4.4 | Structured logging | JSON log format |
| F4.4.5 | Log levels | Debug, info, warn, error levels |

#### Technical Specifications

**New File: `frontend/app/api/health/route.ts`**
```typescript
export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    wordpress: await checkWordPress(),
    uptime: process.uptime(),
  };

  const isHealthy = checks.wordpress.status === 'up';

  return Response.json(checks, {
    status: isHealthy ? 200 : 503,
  });
}

async function checkWordPress() {
  const start = Date.now();
  try {
    await fetch(`${process.env.WORDPRESS_API_URL}/posts?per_page=1`);
    return { status: 'up', latency: Date.now() - start };
  } catch {
    return { status: 'down', latency: null };
  }
}
```

**New File: `frontend/lib/logger.ts`**
```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function log(level: LogLevel, message: string, meta?: object) {
  console.log(JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  }));
}
```

---

## 6. Technical Architecture

### 6.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Frontend (Vercel)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ SEO/Meta │  │  Search  │  │  SWR     │  │ Structured Data  │ │
│  │ Manager  │  │  UI      │  │ Caching  │  │ (JSON-LD)        │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    wordpress.ts API Layer                 │   │
│  │  getPosts() | getServices() | searchContent() | getSeo()  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────────┐   │
│  │  Sentry  │  │  Health  │  │        Jest/Playwright       │   │
│  │ Tracking │  │  Checks  │  │           Tests              │   │
│  └──────────┘  └──────────┘  └──────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  WordPress Backend (Flywheel)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ RankMath │  │   ACF    │  │  Custom  │  │   Preview/ISR    │ │
│  │   SEO    │  │  Fields  │  │  CPTs    │  │   Webhooks       │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Data Flow

```
SEO Request Flow:
Page Load → generateMetadata() → getRankMathMeta(url) → WordPress REST API
         → RankMath /getHead endpoint → Parse HTML → Return to Next.js → Render meta tags

Search Flow:
User Types → Debounce (300ms) → searchContent(query) → WordPress /search
          → Format Results → SWR Cache → Display Results

Image Flow:
WordPress Media → WPImage Component → Next.js Image Optimization
               → Blur Placeholder → Progressive Loading → Display
```

### 6.3 File Structure (New/Modified)

```
frontend/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts           [NEW]
│   ├── search/
│   │   └── page.tsx               [NEW]
│   ├── sitemap.ts                 [NEW]
│   ├── robots.ts                  [NEW]
│   ├── layout.tsx                 [MODIFY]
│   ├── [slug]/
│   │   └── page.tsx               [MODIFY]
│   ├── blog/
│   │   ├── page.tsx               [MODIFY]
│   │   └── [slug]/
│   │       └── page.tsx           [MODIFY]
│   └── services/
│       └── [slug]/
│           └── page.tsx           [MODIFY]
├── components/
│   ├── search-bar.tsx             [NEW]
│   ├── search-results.tsx         [NEW]
│   ├── blog-filters.tsx           [NEW]
│   ├── related-posts.tsx          [NEW]
│   ├── structured-data.tsx        [NEW]
│   └── wp-image.tsx               [NEW]
├── lib/
│   ├── wordpress.ts               [MODIFY]
│   ├── schema.ts                  [NEW]
│   ├── logger.ts                  [NEW]
│   ├── swr-config.tsx             [NEW]
│   └── hooks/
│       └── use-wordpress.ts       [NEW]
├── __tests__/
│   ├── lib/
│   │   ├── wordpress.test.ts      [NEW]
│   │   └── schema.test.ts         [NEW]
│   └── components/
│       └── *.test.tsx             [NEW]
├── __mocks__/
│   └── wordpress.ts               [NEW]
├── e2e/
│   ├── navigation.spec.ts         [NEW]
│   ├── contact-form.spec.ts       [NEW]
│   └── search.spec.ts             [NEW]
├── jest.config.js                 [NEW]
├── jest.setup.js                  [NEW]
├── playwright.config.ts           [NEW]
├── sentry.client.config.ts        [NEW]
├── sentry.server.config.ts        [NEW]
└── next.config.ts                 [MODIFY]
```

---

## 7. Dependencies & Prerequisites

### 7.1 New NPM Packages

| Package | Version | Purpose | Phase |
|---------|---------|---------|-------|
| `swr` | ^2.2.0 | Client-side caching | 2 |
| `@sentry/nextjs` | ^8.0.0 | Error tracking | 4 |
| `jest` | ^29.0.0 | Unit testing | 4 |
| `@testing-library/react` | ^14.0.0 | Component testing | 4 |
| `@testing-library/jest-dom` | ^6.0.0 | Jest matchers | 4 |
| `@playwright/test` | ^1.40.0 | E2E testing | 4 |
| `@next/bundle-analyzer` | ^14.0.0 | Bundle analysis | 2 |

### 7.2 WordPress Plugins Required

| Plugin | Purpose | Required |
|--------|---------|----------|
| RankMath SEO | SEO metadata management | Yes (Phase 1) |
| ACF Pro | Custom fields (existing) | Already installed |

### 7.3 External Services

| Service | Purpose | Cost |
|---------|---------|------|
| Sentry | Error tracking | Free tier available |
| Vercel | Frontend hosting | Free tier available |

### 7.4 Environment Variables (New)

```env
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx

# Search (optional custom endpoint)
SEARCH_API_URL=https://xxx/search
```

---

## 8. Success Metrics & KPIs

### 8.1 SEO Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Lighthouse SEO | ~80 | >95 | Lighthouse audit |
| Indexed pages | Unknown | 100% | Google Search Console |
| Rich snippets | 0 | All eligible pages | Search Console |
| Sitemap coverage | None | 100% | Search Console |

### 8.2 Performance Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Lighthouse Performance | ~75 | >90 | Lighthouse audit |
| LCP | Unknown | <2.5s | Core Web Vitals |
| FID | Unknown | <100ms | Core Web Vitals |
| CLS | Unknown | <0.1 | Core Web Vitals |
| Bundle size | Unknown | <200KB (JS) | Bundle analyzer |

### 8.3 Search Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Search response time | <200ms | Performance monitoring |
| Search result relevance | >80% CTR | Analytics |
| Zero-result rate | <10% | Analytics |

### 8.4 Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test coverage (lib) | >80% | Jest coverage |
| Test coverage (components) | >60% | Jest coverage |
| E2E test pass rate | 100% | Playwright |
| Error rate (production) | <1% | Sentry |
| Uptime | 99.9% | Health checks |

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| RankMath API changes | Low | Medium | Version lock, fallback meta |
| SWR cache staleness | Medium | Low | Configure revalidation intervals |
| Test flakiness | Medium | Low | Retry logic, stable selectors |
| Bundle size increase | Medium | Medium | Dynamic imports, tree shaking |
| Sentry quota exceeded | Low | Low | Sample rate configuration |

### 9.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SEO ranking changes | Low | High | Gradual rollout, monitoring |
| Performance regression | Low | Medium | Lighthouse CI, alerts |
| Development delays | Medium | Medium | Phased approach, MVP first |

### 9.3 Mitigation Strategies

1. **Feature flags** - Roll out new features incrementally
2. **Monitoring** - Set up alerts for key metrics
3. **Rollback plan** - Document rollback procedures
4. **Testing** - Comprehensive testing before production

---

## 10. Timeline & Milestones

### 10.1 Phase Timeline

| Phase | Duration | Start | Deliverables |
|-------|----------|-------|--------------|
| Phase 1: SEO | 1 sprint | Week 1 | RankMath, sitemap, structured data |
| Phase 2: Performance | 1 sprint | Week 2 | SWR, images, bundles |
| Phase 3: Search | 1 sprint | Week 3 | Search UI, filters, related |
| Phase 4: Testing | 1 sprint | Week 4 | Jest, Playwright, Sentry |

### 10.2 Milestones

| Milestone | Criteria | Target |
|-----------|----------|--------|
| M1: SEO Complete | Lighthouse SEO >95 | End of Phase 1 |
| M2: Performance Complete | Lighthouse Perf >90 | End of Phase 2 |
| M3: Search Live | Search functional in production | End of Phase 3 |
| M4: Quality Gates | >80% test coverage, Sentry active | End of Phase 4 |
| M5: Production Ready | All phases complete, stable | Project end |

### 10.3 Definition of Done

Each feature is considered "done" when:
- [ ] Code implemented and reviewed
- [ ] Unit tests written (if applicable)
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA verified
- [ ] Deployed to production
- [ ] Monitoring confirmed

---

## 11. Appendices

### A. API Reference Updates

#### A.1 New wordpress.ts Functions

```typescript
// SEO
getRankMathMeta(pageUrl: string): Promise<RankMathMeta>

// Search
searchContent(options: SearchOptions): Promise<SearchResults>
getRelatedPosts(postId: number, categories: number[], tags: number[]): Promise<WPPost[]>

// Filtering
getPosts(options: PostsOptions & { category?: string; tag?: string }): Promise<WPPost[]>
getCategories(): Promise<WPCategory[]>
getTags(): Promise<WPTag[]>
```

#### A.2 New Hook Signatures

```typescript
// SWR Hooks
usePosts(options?: PostsOptions): SWRResponse<WPPost[]>
useServices(): SWRResponse<WPService[]>
useSearch(query: string): SWRResponse<SearchResults>
useCategories(): SWRResponse<WPCategory[]>
```

### B. Schema Examples

#### B.1 Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Business Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://facebook.com/business",
    "https://twitter.com/business"
  ]
}
```

#### B.2 Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "datePublished": "2026-01-11",
  "dateModified": "2026-01-11",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Business Name",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
}
```

### C. Test Examples

#### C.1 API Function Test

```typescript
// __tests__/lib/wordpress.test.ts
describe('searchContent', () => {
  it('returns formatted search results', async () => {
    const results = await searchContent({ query: 'test' });
    expect(results.results).toBeInstanceOf(Array);
    expect(results.results[0]).toHaveProperty('title');
    expect(results.results[0]).toHaveProperty('url');
  });

  it('filters by post type', async () => {
    const results = await searchContent({ query: 'test', type: 'post' });
    results.results.forEach(r => expect(r.type).toBe('post'));
  });
});
```

#### C.2 E2E Test

```typescript
// e2e/search.spec.ts
test('search returns relevant results', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'services');
  await page.waitForSelector('[data-testid="search-results"]');
  const results = await page.locator('[data-testid="search-result"]').count();
  expect(results).toBeGreaterThan(0);
});
```

### D. Glossary

| Term | Definition |
|------|------------|
| ACF | Advanced Custom Fields - WordPress plugin for custom fields |
| CPT | Custom Post Type - WordPress content type |
| ISR | Incremental Static Regeneration - Next.js feature |
| JSON-LD | JavaScript Object Notation for Linked Data |
| LCP | Largest Contentful Paint - Core Web Vital |
| SWR | Stale-While-Revalidate - caching strategy |

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | Claude Code | Initial draft |

---

*End of PRD*
