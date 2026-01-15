# Architecture

**Analysis Date:** 2026-01-14

## Pattern Overview

**Overall:** Headless WordPress with Next.js Frontend (Decoupled/Jamstack Architecture)

**Key Characteristics:**
- WordPress serves as REST API-based content management system
- Next.js 16 powers the frontend with static site generation + ISR
- Two systems communicate exclusively through REST API calls
- StoryBrand framework components for narrative marketing structure
- PWA capabilities for offline support and installation

## Layers

**Content Management (WordPress Backend):**
- Purpose: Content creation, management, and REST API serving
- Contains: Custom post types, ACF fields, theme setup
- Location: Theme root (`functions.php`, `index.php`, `acf-json/`)
- Depends on: WordPress core, ACF plugin
- Used by: Next.js frontend via REST API

**API Integration (Data Fetching):**
- Purpose: Abstracts all WordPress REST API communication
- Contains: Fetch functions, TypeScript interfaces, error handling
- Location: `frontend/lib/wordpress.ts`
- Depends on: WordPress REST API, environment configuration
- Used by: Page components, API routes

**Validation & Sanitization:**
- Purpose: Input validation and content safety
- Contains: Zod schemas, rate limiting, HTML sanitization
- Location: `frontend/lib/sanitize.ts`, `frontend/lib/rate-limit.ts`, `frontend/lib/schemas/`
- Depends on: Zod, DOMPurify
- Used by: API routes, form components

**SEO & Metadata:**
- Purpose: Schema.org JSON-LD generation, meta tags
- Contains: Schema generators, SEO utilities
- Location: `frontend/lib/schema.ts`, `frontend/lib/seo.ts`
- Depends on: Site configuration, page data
- Used by: Page components, layout

**UI Components (React):**
- Purpose: Reusable React components for UI
- Contains: 40+ components including StoryBrand framework, shadcn/ui
- Location: `frontend/components/`, `frontend/components/ui/`, `frontend/components/storybrand/`
- Depends on: React, Radix UI, Tailwind CSS
- Used by: Page components

**Framework & Presentation (Next.js App Router):**
- Purpose: Page routing, server rendering, API routes
- Contains: Page components, layouts, API endpoints
- Location: `frontend/app/`
- Depends on: Next.js, all other layers
- Used by: End users via browser

**Progressive Web App:**
- Purpose: Offline support, installation, caching
- Contains: Service worker, manifest, PWA components
- Location: `frontend/app/sw.ts`, `frontend/app/sw.enhanced.ts`, `frontend/public/manifest.json`
- Depends on: Serwist
- Used by: Browser service worker API

## Data Flow

**Homepage Request Flow:**

1. User request arrives at Next.js server
2. `app/page.tsx` checks `isWordPressConfigured()`
3. Parallel data fetching: `getTestimonials()`, `getPosts()`, `getServices()`
4. WordPress REST API returns JSON data
5. Data validated and sanitized
6. StoryBrand components render with data
7. JSON-LD schema generated
8. HTML response sent with ISR headers (5s revalidation)

**Contact Form Submission Flow:**

1. User input in ContactForm component
2. Client-side validation (react-hook-form + Zod)
3. POST to `/api/contact/route.ts`
4. Rate limiting check (5 submissions/min per IP)
5. Server-side Zod schema validation
6. Success response with rate limit headers
7. Toast notification via Sonner

**WordPress Content Update Flow:**

1. Admin updates content in WordPress
2. WordPress triggers webhook to `/api/revalidate`
3. Token validation against `REVALIDATION_SECRET`
4. Next.js revalidates affected paths
5. Next request serves fresh content

**State Management:**
- Server Components: Data fetched at request time
- Client State: React hooks for local UI state
- Caching: Next.js ISR (5s) + Service Worker offline cache
- No global state management library (Redux/Zustand)

## Key Abstractions

**WordPress Client (`frontend/lib/wordpress.ts`):**
- Purpose: Encapsulate all WordPress API communication
- Examples: `getPosts()`, `getServices()`, `getTestimonials()`, `getPage()`
- Pattern: Async functions with TypeScript return types
- Error handling: Graceful fallback, environment validation

**Schema Generators (`frontend/lib/schema.ts`):**
- Purpose: Generate Schema.org JSON-LD markup
- Examples: `generateOrganizationSchema()`, `generateArticleSchema()`, `generateBreadcrumbSchema()`
- Pattern: Pure functions returning structured data objects

**StoryBrand Components (`frontend/components/storybrand/`):**
- Purpose: Donald Miller's 7-part narrative framework
- Examples: `StoryBrandHero`, `ProblemSection`, `GuideSection`, `PlanSteps`, `SocialProof`
- Pattern: React components with standardized props interface

**UI Primitives (`frontend/components/ui/`):**
- Purpose: Accessible, styled base components
- Examples: `Button`, `Card`, `Dialog`, `Accordion`, `Form`
- Pattern: shadcn/ui wrappers around Radix UI primitives

## Entry Points

**Next.js Root Layout (`frontend/app/layout.tsx`):**
- Triggers: Every page request
- Responsibilities: Typography setup, providers, header/footer wrapper, scroll animations

**Homepage (`frontend/app/page.tsx`):**
- Triggers: Root path requests
- Responsibilities: Fetch WordPress data, render StoryBrand components, ISR revalidation

**API Routes (`frontend/app/api/`):**
- `contact/route.ts` - Form submission with rate limiting
- `search/route.ts` - Full-text search across posts
- `preview/route.ts` - WordPress draft preview mode
- `revalidate/route.ts` - ISR webhook trigger
- `health/route.ts` - Health check endpoint

**WordPress Entry (`functions.php`):**
- Triggers: WordPress theme load
- Responsibilities: Custom post types, ACF setup, theme support

## Error Handling

**Strategy:** Try/catch at boundaries, graceful degradation, user-friendly messages

**Patterns:**
- API routes catch and return structured error responses
- WordPress client returns empty arrays/null on failure
- Sentry captures unhandled exceptions
- Error boundaries for React component failures (`frontend/app/error.tsx`, `frontend/app/global-error.tsx`)

## Cross-Cutting Concerns

**Logging:**
- Custom logger: `frontend/lib/logger.ts`
- Environment-aware: verbose in dev, minimal in prod
- Structured format: timestamp, level, message, context

**Validation:**
- Zod schemas at API boundaries
- React Hook Form for client-side validation
- Type-safe with TypeScript

**Security:**
- HTML sanitization via DOMPurify
- Rate limiting on contact form
- CSRF protection via Next.js
- Honeypot field for bot detection

**Performance:**
- ISR caching (5 second revalidation)
- Image optimization via Next.js
- Service worker for offline caching
- Core Web Vitals tracking

---

*Architecture analysis: 2026-01-14*
*Update when major patterns change*
