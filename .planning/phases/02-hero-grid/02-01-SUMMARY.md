# Summary: Hero Grid Components & Homepage Integration

**Phase:** 02-hero-grid
**Plan:** 01
**Completed:** 2026-01-14

## Accomplishments

1. **CategoryBadge Component**: Created reusable orange pill badge for sport categories
   - Uses `--clemson-orange` CSS variable
   - White text, uppercase, rounded-full styling

2. **Gradient Overlay Utility**: Added `.gradient-overlay-dark-purple` CSS class
   - Dark purple gradient fading from bottom to transparent at top
   - Uses oklch color functions for smooth transitions

3. **HeroArticleCard Component**: Article cards with large/small variants
   - Full-bleed background images with gradient overlays
   - Category badge positioned top-left
   - Author name + date metadata
   - Bold Apotek headlines at bottom
   - Hover effect with image scale
   - Links to `/blog/[slug]`

4. **HeroGrid Section**: Main homepage hero layout
   - Left side: Large featured article (50% width, full 600px height)
   - Right side: 2x2 grid of 4 smaller articles
   - Small gap (gap-1) between cards, no border radius
   - Mobile: Stacked layout with aspect ratios
   - Desktop: Fixed 600px height with flexbox layout

5. **MiniHero Component**: Brand header above hero grid
   - 200px height with orange-to-purple gradient
   - Centered tiger logo
   - Orange accent line at bottom
   - Optional stadium background overlay

6. **Homepage Rebuilt**: Replaced StoryBrand marketing template with sports content layout

## Files Created

- `frontend/components/CategoryBadge.tsx`
- `frontend/components/HeroArticleCard.tsx`
- `frontend/components/HeroGrid.tsx`
- `frontend/components/MiniHero.tsx`

## Files Modified

- `frontend/app/globals.css` - Added `.gradient-overlay-dark-purple` utility
- `frontend/app/page.tsx` - Replaced StoryBrand with MiniHero + HeroGrid

## Decisions Made

1. **Flexbox over CSS Grid**: Used flexbox for main hero layout (easier height control with fixed 600px)
2. **No border radius**: Clean edge-to-edge card design per design spec
3. **Small gap (gap-1)**: Tight 4px gaps between cards for newspaper feel
4. **Aspect ratios for mobile**: Cards use aspect-[4/5] and aspect-[4/3] on mobile, then fill container on desktop
5. **Regular img tag for logo**: Used native img instead of Next.js Image to avoid optimization issues with local development

## Issues Encountered

1. **Card height collapse**: Initial CSS Grid approach with `aspect-auto` caused cards to collapse - fixed by using flexbox with explicit container height
2. **Logo not displaying**: Next.js Image component had issues - switched to regular img tag

## Verification

- [x] `npm run build` succeeds without errors
- [x] HeroGrid displays 1 large + 4 small article cards
- [x] Category badges display with orange background
- [x] Gradient overlays render correctly (dark purple fade)
- [x] Headlines use Apotek font (font-heading)
- [x] Mobile layout stacks properly with aspect ratios
- [x] Cards link to correct blog post URLs
- [x] MiniHero displays with gradient and logo
- [x] Fixed 600px height on desktop

## Next Step

Ready for **Phase 3: Content Cards** - Breaking news section, article cards, compact list views, EXCLUSIVE badges.
