# Hotfix: WordPress 500 Errors — Replace _embed with _fields

## Problem
WordPress on Flywheel runs out of PHP memory when Next.js makes API calls with `_embed=true`. The homepage was fixed in v1.4.0, but many other pages still use full embedding and cause 500 errors.

## Root Cause
`_embed=true` tells WordPress to resolve all relationships (authors, media, categories, tags) server-side, multiplying memory usage. `_fields` requests only the specific columns needed.

## Strategy
Add `lightweight` flag support (same pattern as `getPosts`) to all list-fetching functions. For pages that only need slugs/dates (sitemap, generateStaticParams), use minimal `_fields`.

---

## Tasks

### CRITICAL — High traffic / large payloads

- [x] **1. Sitemap** (`frontend/app/sitemap.ts`)
  - Added `lightweight: true` to all 4 calls (posts, services, pages, galleries)

- [x] **2. RSS Feed** (`frontend/app/feed.xml/route.ts`)
  - Added `lightweight: true` to `getPosts` call

### HIGH — Per-page-view API calls

- [x] **3. Blog post related/recent posts** (`frontend/app/post/[year]/[month]/[day]/[slug]/page.tsx`)
  - Added `lightweight: true` to related posts (3) and recent posts (4)
  - Adjacent posts in `getAdjacentPosts` also updated

### MEDIUM — Pagination functions in wordpress.ts

- [x] **4. `getPostsWithPagination`** — Added `lightweight` param with `_fields`
- [x] **5. `getServices`** — Added `lightweight` param with `_fields`
- [x] **6. `getPages`** — Added `lightweight` param with `_fields`
- [x] **7. `getTestimonials`** — Added `lightweight` param with `_fields`
- [x] **8. `getPhotoGalleries`** — Added `lightweight` param with `_fields`
- [x] **9. `getPhotoGalleriesWithPagination`** — Added `lightweight` param with `_fields`

### CALLERS — Update page-level calls to use lightweight

- [x] **10. Sitemap** — `lightweight: true` on all 4 calls
- [x] **11. RSS feed** — `lightweight: true` on getPosts
- [x] **12. Blog post page** — `lightweight: true` on related, recent, adjacent
- [x] **13. Category/tag pages** — `lightweight: true` on both metadata and page calls
- [x] **14. Services pages** — listing, detail generateStaticParams, contact dropdown
- [x] **15. Testimonials page** — listing call
- [x] **16. Photo gallery pages** — generateStaticParams, related galleries, pagination list
- [x] **17. Homepage** — `getPhotoGalleries` call

---

## Review

### Files Modified (10 files)
1. `frontend/lib/wordpress.ts` — Added `lightweight` param to 8 functions, added `modified`+`content` to post _fields
2. `frontend/app/sitemap.ts` — 4 calls now lightweight
3. `frontend/app/feed.xml/route.ts` — 1 call now lightweight
4. `frontend/app/post/[year]/[month]/[day]/[slug]/page.tsx` — 2 calls now lightweight
5. `frontend/app/category/[slug]/page.tsx` — 2 calls now lightweight
6. `frontend/app/tag/[slug]/page.tsx` — 2 calls now lightweight
7. `frontend/app/services/page.tsx` — 1 call now lightweight
8. `frontend/app/services/[slug]/page.tsx` — 1 call now lightweight (generateStaticParams)
9. `frontend/app/contact/page.tsx` — 1 call now lightweight
10. `frontend/app/testimonials/page.tsx` — 1 call now lightweight
11. `frontend/app/photo-gallery/[slug]/page.tsx` — 3 calls now lightweight
12. `frontend/app/photo-gallery/page.tsx` — 1 call now lightweight
13. `frontend/app/page.tsx` — 1 call now lightweight (homepage galleries)

### Approach
- Same pattern as existing homepage fix: `lightweight: true` → `_fields` instead of `_embed`
- No new abstractions or refactoring
- Single-post detail views (getPost, getService, getPhotoGallery) still use `_embed` since they need full data
- TypeScript compiles cleanly with zero errors
