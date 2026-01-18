---
status: testing
phase: 09-espn-api
source: 09-01-PLAN.md (features discovered via codebase analysis)
started: 2026-01-18T14:30:00Z
updated: 2026-01-18T14:30:00Z
---

## Current Test

number: 1
name: View Clemson Game Score on Homepage
expected: |
  Homepage displays a Clemson game scorecard showing team logos, team names, scores (if game completed or in progress), game status (scheduled/in progress/final), and basic game info.
awaiting: user response

## Tests

### 1. View Clemson Game Score on Homepage
expected: Homepage displays a Clemson game scorecard showing team logos, team names, scores (if game completed or in progress), game status (scheduled/in progress/final), and basic game info.
result: [pending]

### 2. ScoreCard Shows Correct Team Information
expected: Both teams show correct logos, team names, and records. Clemson should be identifiable (highlighted or styled differently).
result: [pending]

### 3. ScoreCard Shows Game Status Correctly
expected: Pre-game shows scheduled date/time. In-progress shows live indicator with period/clock. Completed games show "Final" with final scores.
result: [pending]

### 4. Mobile Responsive Scorecard
expected: On mobile viewport, scorecard adapts - teams remain side by side, game info moves below teams for better readability.
result: [pending]

### 5. ESPN API Error Handling
expected: If ESPN API is unavailable, the scorecard shows a graceful error message instead of breaking the page.
result: [pending]

### 6. Loading State Display
expected: While fetching game data, a skeleton/loading indicator appears instead of empty content or layout shifts.
result: [pending]

### 7. ESPN Score Block in WordPress Content
expected: When viewing a blog post with an ESPN Score block, the embedded scorecard renders correctly showing the specified game.
result: [pending]

## Summary

total: 7
passed: 0
issues: 0
pending: 7
skipped: 0

## Gaps

[none yet]
