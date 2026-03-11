# Fix: Baseball section first article links to wrong post

## Problem
In `AlternatingGrid.tsx`, the top row renders Image|Text|Image|Text using 4 separate posts. The image (post[0]) and text (post[1]) appear side-by-side but are different articles, causing confusion.

## Plan
- [ ] Update `AlternatingGrid.tsx` top row to pair image+text from the same post
  - Post[0] -> ImageCard (col 1) + TextCard (col 2)
  - Post[1] -> ImageCard (col 3) + TextCard (col 4)
- [ ] Adjust `topRowPosts` slice to only take 2 posts (not 4)
- [ ] Adjust `remainingPosts` slice to start from index 2 (not 4)
- [ ] Verify no other components are affected

## Review
(to be filled after completion)
