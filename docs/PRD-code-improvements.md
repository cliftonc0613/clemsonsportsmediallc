# Product Requirements Document: Code Quality Improvements

## WP Starter Theme - Technical Debt & Enhancement Roadmap

**Document Version:** 1.1
**Created:** January 9, 2026
**Status:** ✅ Completed
**Theme Type:** Headless WordPress + Next.js Starter Theme

---

## Executive Summary

This PRD outlines technical improvements identified during a comprehensive code review of the WP Starter Theme. The theme is a work-in-progress starter kit designed to accelerate headless WordPress development. These improvements focus on code consistency, maintainability, security hardening, and alignment with the project's own documented guidelines.

**Goal:** Transform a solid foundation into a production-ready, self-consistent starter theme that developers can confidently use as a base for client projects.

---

## Improvement Categories

| Priority | Category | Items | Estimated Effort |
|----------|----------|-------|------------------|
| P0 | Guideline Compliance | 2 | Small |
| P1 | Code Cleanup | 2 | Small |
| P2 | Configuration | 2 | Medium |
| P3 | Security & Validation | 3 | Medium |
| P4 | Performance | 2 | Small |
| P5 | Developer Experience | 3 | Medium |

---

## P0: Guideline Compliance (Critical)

These items directly violate rules documented in `CLAUDE.md`. Fixing these ensures the starter theme practices what it preaches.

### P0-1: Remove Inline Styles from Header Component

**Problem:**
`frontend/components/Header.tsx` lines 76-83 use JavaScript to set inline styles, violating the project's explicit rule: *"Never, ever use inline styles; always use the global style sheet."*

```tsx
// Current (violates guidelines)
header.style.setProperty("background-color", `oklch(1 0 0 / ${bgOpacity})`);
header.style.setProperty("backdrop-filter", `blur(${blurAmount}px)`);
```

**Requirements:**
- [x] Create CSS custom properties for scroll-based header states
- [x] Use class toggling instead of inline style manipulation
- [x] Maintain the same visual effect (progressive blur/opacity on scroll)

**Acceptance Criteria:**
- Zero inline styles in Header.tsx
- Header still transitions smoothly on scroll
- All styling lives in globals.css

**Implementation Approach:**
```css
/* globals.css - Add stepped classes or CSS custom property approach */
header {
  --header-bg-opacity: 0.6;
  --header-blur: 8px;
  background-color: oklch(1 0 0 / var(--header-bg-opacity));
  backdrop-filter: blur(var(--header-blur));
}

.header-scrolled {
  --header-bg-opacity: 0.95;
  --header-blur: 12px;
}
```

---

### P0-2: Remove Inline Styles from StoryBrandHero Component

**Problem:**
`frontend/components/storybrand/StoryBrandHero.tsx` lines 41-48 use inline styles for background images.

```tsx
// Current (violates guidelines)
style={backgroundImage ? { backgroundImage: `...` } : undefined}
```

**Requirements:**
- [x] Use CSS custom properties or Next.js Image component for backgrounds
- [x] Remove all inline style objects from the component

**Acceptance Criteria:**
- Zero inline styles in StoryBrandHero.tsx
- Background image functionality preserved
- Dark overlay effect maintained

**Implementation Approach:**
```tsx
// Option A: CSS custom property
<section
  className="storybrand-hero"
  style={{ '--bg-image': backgroundImage ? `url(${backgroundImage})` : 'none' } as React.CSSProperties}
>
```
```css
/* globals.css */
.storybrand-hero {
  background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), var(--bg-image, none);
}
```

---

## P1: Code Cleanup (High Priority)

Dead code and duplication that impacts maintainability.

### P1-1: Remove Duplicate Preview Link Functions

**Problem:**
`functions.php` contains two nearly identical preview link functions:
- `starter_theme_preview_link()` (lines 283-316)
- `starter_theme_preview_link_with_type()` (lines 380-403)

The first function is immediately removed and replaced by the second, making it dead code.

**Requirements:**
- [x] Delete `starter_theme_preview_link()` function entirely
- [x] Rename `starter_theme_preview_link_with_type()` to `starter_theme_preview_link()`
- [x] Remove the `remove_filter()` call on line 402

**Acceptance Criteria:**
- Single preview link function exists
- Preview functionality works identically
- No dead code in functions.php

---

### P1-2: Extract Shared Validation Schema

**Problem:**
The contact form Zod schema is duplicated in two files:
- `frontend/components/ContactForm.tsx` (lines 32-41)
- `frontend/app/api/contact/route.ts` (lines 5-14)

**Requirements:**
- [x] Create `frontend/lib/schemas/contact.ts`
- [x] Export the schema from the new file
- [x] Import in both ContactForm.tsx and route.ts

**Acceptance Criteria:**
- Single source of truth for contact form validation
- Both files import from shared location
- No validation logic duplication

**New File Structure:**
```
frontend/lib/
├── schemas/
│   ├── index.ts
│   └── contact.ts    # NEW
├── utils.ts
└── wordpress.ts
```

---

## P2: Configuration (Medium Priority)

Hardcoded values that should be environment-driven for flexibility.

### P2-1: Environment-Driven URL Rewrites

**Problem:**
`frontend/lib/wordpress.ts` lines 479-482 hardcode domain mappings:

```typescript
const URL_REWRITES: Record<string, string> = {
  'http://websiteplayground.local': 'https://wpstarter.mysites.io',
  'https://websiteplayground.local': 'https://wpstarter.mysites.io',
};
```

This breaks when developers clone the starter for their own projects.

**Requirements:**
- [x] Move URL rewrites to environment variables
- [x] Support JSON format in env var for multiple mappings
- [x] Provide sensible default (empty object = no rewrites)
- [x] Document in `.env.example`

**Acceptance Criteria:**
- No hardcoded domains in source code
- Developers can configure their own mappings via env vars
- Existing functionality preserved

**Implementation:**
```typescript
// wordpress.ts
const URL_REWRITES: Record<string, string> = process.env.NEXT_PUBLIC_URL_REWRITES
  ? JSON.parse(process.env.NEXT_PUBLIC_URL_REWRITES)
  : {};
```

```env
# .env.example
NEXT_PUBLIC_URL_REWRITES={"http://local.site":"https://production.site"}
```

---

### P2-2: Align CSS Variable Systems

**Problem:**
Two disconnected CSS variable systems exist:
1. WordPress `style.css` defines variables (unused in headless setup)
2. Next.js `globals.css` references `--font-geist-sans` but actual fonts are DM Sans, Playfair, JetBrains Mono

**Requirements:**
- [x] Remove unused CSS variables from WordPress style.css (keep only theme metadata)
- [x] Ensure globals.css variables match actual font configuration in layout.tsx
- [x] Document the design token system

**Acceptance Criteria:**
- No orphaned CSS variables
- Font variables correctly reference loaded fonts
- Clear documentation of design tokens

---

## P3: Security & Validation (Medium Priority)

Security hardening for when the theme is used in production.

### P3-1: Remove GET Endpoint for Revalidation

**Problem:**
`frontend/app/api/revalidate/route.ts` exposes a GET handler (lines 88-115) that accepts secrets in URL parameters. This is a security risk:
- Secrets appear in server access logs
- Secrets visible in browser history
- Secrets can leak via referrer headers

**Requirements:**
- [x] Remove the GET handler entirely
- [x] Document POST-only usage in code comments
- [x] Update any documentation referencing GET usage

**Acceptance Criteria:**
- Only POST method accepted for revalidation
- GET requests return 405 Method Not Allowed
- WordPress integration continues to work (already uses POST)

---

### P3-2: Improve Phone Number Validation

**Problem:**
Contact form phone validation only checks length, not format:

```typescript
phone: z.string().min(10, "Please enter a valid phone number")
```

A string like "aaaaaaaaaa" passes validation.

**Requirements:**
- [x] Add regex pattern for phone validation
- [x] Support international formats (optional + prefix)
- [x] Provide clear error message

**Acceptance Criteria:**
- Invalid phone formats rejected
- International numbers accepted
- US formats accepted (with or without formatting)

**Implementation:**
```typescript
phone: z.string()
  .min(10, "Phone number too short")
  .regex(
    /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
    "Please enter a valid phone number"
  )
```

---

### P3-3: Add Basic Rate Limiting Strategy

**Problem:**
Contact form API has no rate limiting, making it vulnerable to spam and abuse.

**Requirements:**
- [x] Document recommended rate limiting approaches
- [x] Add honeypot field to contact form (simple spam prevention)
- [x] Create placeholder for production rate limiting

**Acceptance Criteria:**
- Honeypot field added (hidden, fails if filled)
- Documentation for Vercel/production rate limiting
- Comment placeholders for rate limiting integration

**Implementation Notes:**
Since this is a starter theme, full rate limiting implementation depends on hosting. Provide:
1. Honeypot field (works everywhere)
2. Documentation for Vercel Edge Config rate limiting
3. Documentation for alternative approaches (Upstash, etc.)

---

## P4: Performance (Lower Priority)

Optimizations for better runtime performance.

### P4-1: Add Image Sizes Attribute

**Problem:**
`frontend/app/blog/[slug]/page.tsx` Image component missing `sizes` prop:

```tsx
<Image
  src={featuredImageUrl}
  alt={title}
  fill
  className="object-cover"
  priority
/>
```

Without `sizes`, Next.js can't optimize image loading for different viewports.

**Requirements:**
- [x] Add `sizes` attribute to all `fill` mode Images
- [x] Use responsive breakpoints matching the design

**Acceptance Criteria:**
- All fill-mode Images have sizes prop
- Sizes match container's responsive behavior

**Implementation:**
```tsx
<Image
  src={featuredImageUrl}
  alt={title}
  fill
  className="object-cover"
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
/>
```

---

### P4-2: Optimize Related Posts Query

**Problem:**
`blog/[slug]/page.tsx` lines 109-111 fetch 4 posts to use 3:

```tsx
const allPosts = await getPosts({ per_page: 4 });
const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
```

**Requirements:**
- [x] Add `exclude` parameter support to `getPosts()`
- [x] Fetch exactly 3 posts excluding current
- [x] Consider category-based related posts (future enhancement)

**Acceptance Criteria:**
- Only necessary posts fetched
- Current post excluded server-side when possible

**Implementation:**
```typescript
// wordpress.ts - Add exclude param
export async function getPosts(params?: {
  // ... existing params
  exclude?: number[];
}): Promise<WPPost[]> {
  // ...
  if (params?.exclude?.length) {
    queryParams.set('exclude', params.exclude.join(','));
  }
}

// blog/[slug]/page.tsx
const relatedPosts = await getPosts({ per_page: 3, exclude: [post.id] });
```

---

## P5: Developer Experience (Enhancement)

Improvements that make the starter theme easier to use and customize.

### P5-1: Add Error Boundaries for Data Fetching

**Problem:**
Page components fetch data without try/catch. If the WordPress API fails, pages crash without graceful degradation.

**Requirements:**
- [x] Create reusable error handling pattern for data fetching
- [x] Add try/catch to critical data fetching operations
- [x] Provide meaningful error states (not just crashes)

**Acceptance Criteria:**
- API failures don't crash pages
- Users see helpful error messages
- Errors are logged for debugging

---

### P5-2: Create Logging Abstraction

**Problem:**
Multiple `console.warn` and `console.error` statements throughout codebase will clutter production logs.

**Requirements:**
- [x] Create `lib/logger.ts` utility
- [x] Support log levels (debug, info, warn, error)
- [x] Respect environment (verbose in dev, minimal in prod)

**Acceptance Criteria:**
- Centralized logging utility
- Environment-aware output
- Easy to extend for external logging services

**Implementation:**
```typescript
// lib/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: unknown[]) => isDev && console.log('[DEBUG]', ...args),
  info: (...args: unknown[]) => isDev && console.info('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};
```

---

### P5-3: Document Design Token System

**Problem:**
The CSS variable system in globals.css is comprehensive but undocumented. New developers won't know what tokens are available.

**Requirements:**
- [x] Create design tokens documentation
- [x] List all available CSS variables with purposes
- [x] Provide usage examples

**Acceptance Criteria:**
- Documentation exists in docs/ folder
- All CSS variables documented
- Examples for common use cases

---

## Implementation Phases

### Phase 1: Foundation (P0 + P1)
**Focus:** Alignment and cleanup
**Items:** 4 tasks
**Outcome:** Codebase follows its own rules, no dead code

### Phase 2: Configuration (P2)
**Focus:** Flexibility for new projects
**Items:** 2 tasks
**Outcome:** Starter is easily customizable without code changes

### Phase 3: Hardening (P3)
**Focus:** Security improvements
**Items:** 3 tasks
**Outcome:** Safe to use as starting point for client projects

### Phase 4: Polish (P4 + P5)
**Focus:** Performance and DX
**Items:** 5 tasks
**Outcome:** Professional-grade starter theme

---

## Success Metrics

| Metric | Before | Target | Final |
|--------|--------|--------|-------|
| Inline styles | 2 components | 0 components | ✅ 0 |
| Dead code functions | 1 | 0 | ✅ 0 |
| Duplicated schemas | 2 | 1 (shared) | ✅ 1 |
| Hardcoded configs | 2 | 0 | ✅ 0 |
| Images with sizes prop | ~50% | 100% | ✅ 100% |
| Documented design tokens | No | Yes | ✅ Yes |

---

## Out of Scope

The following items are intentionally excluded from this PRD:

1. **Feature additions** - This focuses on fixing/improving existing code
2. **UI/UX redesign** - Visual design is adequate for a starter
3. **Additional integrations** - Email providers, analytics, etc. are documented but not implemented (appropriate for a starter)
4. **Testing infrastructure** - Important but separate initiative
5. **CI/CD setup** - Deployment-specific, varies by project

---

## Appendix: File Reference

| File | Issues | Priority Items |
|------|--------|----------------|
| `functions.php` | Dead code | P1-1 |
| `frontend/components/Header.tsx` | Inline styles | P0-1 |
| `frontend/components/storybrand/StoryBrandHero.tsx` | Inline styles | P0-2 |
| `frontend/components/ContactForm.tsx` | Schema duplication, validation | P1-2, P3-2 |
| `frontend/app/api/contact/route.ts` | Schema duplication, rate limiting | P1-2, P3-3 |
| `frontend/app/api/revalidate/route.ts` | GET endpoint security | P3-1 |
| `frontend/app/blog/[slug]/page.tsx` | Image sizes, query optimization | P4-1, P4-2 |
| `frontend/lib/wordpress.ts` | Hardcoded URLs | P2-1 |
| `frontend/app/globals.css` | Variable alignment | P2-2 |
| `style.css` | Unused variables | P2-2 |
