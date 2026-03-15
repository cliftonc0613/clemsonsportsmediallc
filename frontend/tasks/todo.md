# Alternating Top Row Layout on Mobile Only

## Plan
On mobile, alternate the top 2 stories in each sport category section: Post 1 = `[Image][Text]`, Post 2 = `[Text][Image]`. Desktop stays unchanged.

## Tasks
- [x] Wrap Post 2's `ImageCard` with `order-last sm:order-none` in `components/AlternatingGrid.tsx`
- [x] Verify `npm run build` passes

## Review

### Files Modified (1)
- `components/AlternatingGrid.tsx` (line 48) — Wrapped Post 2's `ImageCard` in a `<div className="order-last sm:order-none">` so it appears below the text on mobile but stays in normal grid position on desktop.

### Summary
Single-line change. On mobile (`grid-cols-1`), `order-last` pushes Post 2's image below its text, creating the alternating `[Text][Image]` layout. On `sm+` breakpoints, `order-none` restores normal DOM order within the 4-column grid.
