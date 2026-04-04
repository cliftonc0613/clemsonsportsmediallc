# Fix: WordPress post updates not purging Vercel cache

## Problem
When a WordPress post is updated, the `save_post` hook fires and calls `/api/revalidate` on Vercel. The endpoint returns HTTP 200 success, but pages continue serving stale content.

## Root Cause
`revalidatePath("/")` marks the page route as stale, but the underlying `fetch()` calls in `wordpress.ts` have their own `next: { revalidate: 3600 }` data cache. `revalidatePath` alone doesn't reliably invalidate the fetch data cache on Vercel.

## Fix
- [ ] 1. Add `next: { tags: ["wordpress"] }` to `fetchAPI` in `wordpress.ts`
- [ ] 2. Add `revalidateTag("wordpress")` to revalidation route
- [ ] 3. Deploy to Vercel and test

## Files to change
- `frontend/lib/wordpress.ts` - Add cache tag to `fetchAPI`
- `frontend/app/api/revalidate/route.ts` - Add `revalidateTag`
