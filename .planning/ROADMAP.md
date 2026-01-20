# Roadmap: Clemson Sports Media

## Overview

Transform the existing Next.js frontend from a StoryBrand marketing site into a modern sports media platform. Starting with design system foundation, we'll build the newspaper-style homepage grid sections, then create content templates for posts and archives, and finish with navigation polish and PWA performance optimization.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Design system setup with Clemson colors, Apotek/Basic Sans fonts, CSS variables
- [x] **Phase 2: Hero Grid** - Featured article layout with large card + 2x2 grid, category badges, gradient overlays
- [x] **Phase 3: Content Cards** - Breaking news section, article cards, compact list views, EXCLUSIVE badges
- [x] **Phase 4: Sport Sections** - Per-sport category sections with watermark headers, asymmetric grids
- [x] **Phase 5: Blog Post Template** - Single post page with social sharing, author info, related posts
- [x] **Phase 6: Archive Pages** - Category and tag archive pages with pagination
- [x] **Phase 7: Navigation & Search** - Header navigation, mobile menu, search functionality
- [x] **Phase 8: PWA & Performance** - Lighthouse 95+, offline reading, push notifications
- [x] **Phase 9: ESPN API Integration** - Live scores, schedules, standings from ESPN public API

## Phase Details

### Phase 1: Foundation
**Goal**: Establish design system with Clemson colors, typography, and base component styles
**Depends on**: Nothing (first phase)
**Research**: Unlikely (Adobe Fonts embed provided)
**Plans**: 1 plan

Plans:
- [x] 01-01: Typography & Clemson Colors (Adobe Fonts, CSS variables)

Key deliverables:
- CSS variables for color palette (#F56600, #522D80, #2E1A47, #FFFFFF)
- Adobe Fonts integration (Apotek headlines, Basic Sans body)
- Base component styles (badges, buttons, cards)
- Gradient overlay utilities
- Remove/replace StoryBrand components

### Phase 2: Hero Grid
**Goal**: Build the main homepage hero section with featured article and grid layout
**Depends on**: Phase 1
**Research**: Unlikely (internal UI patterns)
**Plans**: 1 plan

Plans:
- [x] 02-01: Hero Grid Components & Homepage Integration

Key deliverables:
- Large featured article card (50% width, full height)
- 2x2 smaller article grid (50% width)
- Sport category badges (orange pills)
- Dark purple gradient overlays on images
- Author + date metadata display
- Bold Apotek headlines on images

### Phase 3: Content Cards
**Goal**: Create reusable article card components for various layouts
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Key deliverables:
- Breaking news section with 4-column featured row
- Compact article list (thumbnail + title + category)
- EXCLUSIVE badge component
- Social media CTA bar
- Card hover effects and transitions

### Phase 4: Sport Sections
**Goal**: Build per-sport category sections for homepage
**Depends on**: Phase 3
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Key deliverables:
- Section header with watermark text background
- "VIEW ALL →" link component
- Orange accent line under headers
- Asymmetric grid layouts
- 3-column image cards + text-only list below
- Author avatars with names/dates

### Phase 5: Blog Post Template
**Goal**: Create single blog post page with full article display
**Depends on**: Phase 4
**Research**: Unlikely (existing WordPress patterns)
**Plans**: 1 plan

Plans:
- [x] 05-01: Blog Post Template with Clemson Styling

Key deliverables:
- Full article layout with featured image
- Author bio section with avatar
- Social sharing buttons (Twitter, Facebook, LinkedIn)
- Category and tag display
- Related posts section
- Reading time estimate

### Phase 6: Archive Pages
**Goal**: Build category and tag archive pages
**Depends on**: Phase 5
**Research**: Unlikely (existing WordPress API patterns)
**Plans**: 1 plan

Plans:
- [x] 06-01: Category and Tag Archives with Pagination

Key deliverables:
- Category archive page (Sport > Content Type hierarchy)
- Tag archive page (Seasons, Topics)
- Pagination component
- Archive header with category/tag info
- Article grid layout for archives
- Filter/sort options (if needed)

### Phase 7: Navigation & Search
**Goal**: Implement header navigation and search functionality
**Depends on**: Phase 6
**Research**: Unlikely (existing patterns)
**Plans**: 2 plans

Plans:
- [x] 07-01: Header Redesign with Clemson Branding
- [x] 07-02: Search Results Page

Key deliverables:
- Desktop navigation with sport dropdowns
- Mobile hamburger menu
- Search input with autocomplete
- Search results page
- Sticky header behavior
- Active state indicators

### Phase 8: PWA & Performance
**Goal**: Achieve Lighthouse 95+ and enhance PWA capabilities
**Depends on**: Phase 7
**Research**: Not needed (existing Serwist setup covers PWA infrastructure)
**Plans**: 2 plans

Plans:
- [x] 08-01: Lighthouse Performance Optimization (LCP, CLS, bundle size)
- [x] 08-02: Push Notifications & PWA Polish

Key deliverables:
- Lighthouse Performance 95+
- LCP < 2.5s optimization
- CLS < 0.1 fixes
- Offline reading capability
- Push notification setup
- Image optimization audit
- Bundle size optimization

### Phase 9: ESPN API Integration
**Goal**: Integrate ESPN public API for live sports data
**Depends on**: Phase 8
**Research**: Complete (API documentation reviewed)
**Plans**: 2 plans

Plans:
- [x] 09-01: ESPN API Service Layer & Components
- [x] 09-02: Add Women's Basketball to Homepage (gap closure)

Key deliverables:
- ESPN API service layer with caching
- TypeScript interfaces for ESPN data
- ScoreCard component for game scores
- ScheduleWidget for upcoming games
- StandingsWidget for ACC standings
- LiveScore component with auto-refresh
- Homepage and category page integration
- Error handling and fallbacks
- Women's basketball scoreboard on homepage

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2026-01-14 |
| 2. Hero Grid | 1/1 | Complete | 2026-01-14 |
| 3. Content Cards | 1/1 | Complete | 2026-01-15 |
| 4. Sport Sections | 1/1 | Complete | 2026-01-15 |
| 5. Blog Post Template | 1/1 | Complete | 2026-01-15 |
| 6. Archive Pages | 1/1 | Complete | 2026-01-15 |
| 7. Navigation & Search | 2/2 | Complete | 2026-01-15 |
| 8. PWA & Performance | 2/2 | Complete | 2026-01-15 |
| 9. ESPN API Integration | 2/2 | Complete | 2026-01-20 |

---

*Roadmap created: 2026-01-14*
*Milestone: v1.0 Sports Media Platform*
