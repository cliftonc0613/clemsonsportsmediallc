# Clemson Sports Media

## Vision

A modern sports media platform delivering Clemson athletics coverage with a newspaper-style design, optimized for performance and mobile reading.

## Core Value

**Blog content delivery** and **Performance & SEO** - The platform must deliver sports content fast and rank well in search to build audience.

## Success Criteria

- [ ] Lighthouse score 95+ across all pages
- [ ] Content publishing workflow smooth and efficient
- [ ] Mobile reading experience excellent
- [ ] SEO fundamentals properly implemented

## Scope

### In Scope (v1)

- Homepage rebuild with sports-focused grid layout
- Blog posts with rich metadata and social sharing
- Category archives (Sport > Content Type hierarchy)
- Tag archives (Seasons/years, Topics)
- Navigation and search
- Performance optimization (95+ Lighthouse)
- PWA enhancement (offline reading, push notifications)
- Social sharing integration

### Out of Scope (v1)

- E-commerce/payments
- Advanced search (faceted filtering)
- Newsletter integration (deferred to later)
- Player name tags
- Video hosting/streaming

## Constraints

- **Must use existing WordPress** as CMS backend
- **Must deploy to Vercel** for frontend hosting
- **Performance targets mandatory** (Lighthouse 95+, LCP <2.5s)
- **Existing codebase** - brownfield Next.js 16 + React 19 project

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Orange | `#F56600` | CTAs, category badges, accent lines |
| Primary Purple | `#522D80` | Secondary elements, links |
| Dark Purple | `#2E1A47` | Hero backgrounds, gradients, overlays |
| White | `#FFFFFF` | Backgrounds, text on dark |

### Typography

- **Headlines**: Bold, condensed font (sports newspaper style)
- **Body**: Clean, readable sans-serif
- **Style**: Modern sports newspaper aesthetic

### Visual Elements

- Category badges (colored pills with sport names)
- "EXCLUSIVE" tags for special content
- Author avatars with names and dates
- Dark gradient overlays on hero images
- Orange accent lines under section headers
- Large watermark text behind section headings

## Homepage Design

### Section 1: Hero Grid (Below Navigation)

**Layout**: Large featured article (50% width) + 2x2 smaller grid (50% width)

**Featured Article (Left)**:
- Full-height image with dark purple gradient overlay
- Sport category badge (top-left, orange)
- Author icon + name + date (bottom)
- Large bold headline (bottom, white text)

**Grid Articles (Right, 2x2)**:
- Each card: image with gradient overlay
- Sport category badge (top-left)
- Author + date metadata
- Bold headline (white text on image)
- Mix of sports (Basketball, Football, etc.)

### Section 2: Breaking News

**Top Bar**: Social media CTA ("For even more exclusive content!") + social icons

**Featured Row**: 4 equal-width cards
- Large images with dark overlays
- Category badges
- Bold white headlines on images

**Article Grid Below**:
- 4-column layout
- Compact cards: thumbnail right, title + category left
- "EXCLUSIVE" badges where applicable

### Section 3: Sport Category Sections

**Per-Sport Sections** (Football, Basketball, etc.):

**Header**:
- Large watermark text behind (e.g., "FOOTBALL")
- Bold section title with underline
- "VIEW ALL →" link

**Layout Options**:
- Asymmetric grid (large + small cards mixed)
- 3-column image cards + text-only list below
- Author avatars, dates, category badges

### Section 4: More Content Lists

**Layout**: Section header + orange accent line + "VIEW ALL →"
- 3 featured image cards (top)
- 3-column text-only article lists (below)
- Author, dates, "EXCLUSIVE" badges

## Content Structure

### Categories (Hierarchical)

**Parent Categories (Sports)**:
- Football
- Basketball (Men's/Women's)
- Baseball
- Softball
- Soccer
- Track & Field
- Swimming & Diving
- Golf
- Tennis
- Volleyball
- Rowing
- Other Sports

**Child Categories (Content Types)**:
- Game Recaps
- News
- Features
- Analysis
- Recruiting
- Interviews

### Tags

- **Seasons/Years**: 2024, 2025, 2024-25 Season
- **Topics**: Transfer Portal, Rankings, Awards, Injuries, Schedule

## Technical Requirements

### Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| LCP (Largest Contentful Paint) | <2.5s |
| FID (First Input Delay) | <100ms |
| CLS (Cumulative Layout Shift) | <0.1 |
| Time to Interactive | <3.5s |

### WordPress REST API

- Posts with categories, tags, featured images
- Author data with avatars
- Custom fields via ACF (if needed)
- Category/tag archives with pagination

### PWA Features

- Offline reading capability
- Push notifications (future)
- App-like installation
- Background sync for content updates

### SEO Requirements

- Schema.org markup (Article, Organization, BreadcrumbList)
- Open Graph and Twitter Cards
- Semantic HTML structure
- XML sitemap generation
- Canonical URLs

## Mobile Experience

- Fast loading (<3s on 3G)
- Easy reading (proper typography scaling)
- Easy navigation (sticky header, clear hierarchy)
- Touch-friendly (large tap targets)
- Responsive grid layouts

## Existing Codebase

**Stack**: Next.js 16.1.1 + React 19.2.3 + TypeScript + Tailwind CSS 4

**Key Files**:
- `frontend/lib/wordpress.ts` - WordPress API client
- `frontend/components/` - React components (40+)
- `frontend/app/` - Next.js App Router pages

**Current State**:
- StoryBrand homepage (to be replaced)
- Blog functionality exists
- PWA configured via Serwist
- Sentry error tracking
- ISR caching (5s revalidation)

**Tech Debt**:
- Contact form email not implemented
- Default secrets in .env.local
- Newsletter integration missing

---

*Project initialized: 2026-01-14*
*Codebase mapped: 2026-01-14*
