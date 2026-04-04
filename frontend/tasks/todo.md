# Switch to 60-second TTL caching (Option 2)

## Problem
On-demand revalidation via WordPress webhooks is unreliable on Vercel due to multi-layer caching. Too many moving parts that fail silently.

## Solution
Replace on-demand revalidation with a simple 60-second TTL. Content is at most 1 minute stale. No webhook chain to debug.

## Tasks
- [ ] 1. Change `fetchAPI` default revalidate from 3600 to 60, remove tags
- [ ] 2. Set all page-level `export const revalidate` to 60
- [ ] 3. Delete revalidation endpoint (`app/api/revalidate/route.ts`)
- [ ] 4. Remove revalidation hook from `functions.php`
- [ ] 5. Remove diagnostic endpoint from `functions.php`
- [ ] 6. Deploy and test
