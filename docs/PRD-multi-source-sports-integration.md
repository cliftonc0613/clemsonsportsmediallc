# PRD: Multi-Source Sports Data Integration

**Created:** January 20, 2026
**Status:** Planning
**Priority:** High

---

## Overview

Extend the Clemson Sports Media site to display live scores, schedules, and stats for all major Clemson sports by integrating multiple data sources. Currently, the site uses ESPN's API for football and basketball. This plan adds support for soccer and softball using the NCAA API.

---

## Problem Statement

The ESPN API does not provide data for all college sports. Specifically:
- Men's Soccer: **Not available** on ESPN API (returns 400 error)
- Women's Soccer: **Not available** on ESPN API (returns 400 error)
- Softball: **Not available** on ESPN API (returns 400 error)

To provide comprehensive Clemson sports coverage, we need to integrate a secondary data source.

---

## Goals

1. Add live scores and schedules for Men's Soccer, Women's Soccer, and Softball
2. Maintain existing ESPN integration for Football, Basketball, and Baseball
3. Create a unified API layer that abstracts the data source from components
4. Ensure consistent data format across all sports regardless of source

---

## Non-Goals

- Real-time WebSocket connections (polling is sufficient)
- Historical statistics beyond current season
- Player-level statistics for NCAA API sports (limited data available)

---

## Current State

### ESPN API Integration (Implemented)

| Sport | Endpoint | Status |
|-------|----------|--------|
| Football | `football/college-football` | ✅ Working |
| Men's Basketball | `basketball/mens-college-basketball` | ✅ Working |
| Women's Basketball | `basketball/womens-college-basketball` | ✅ Working |
| Baseball | `baseball/college-baseball` | ✅ Working |

**Location:** `frontend/lib/espn.ts`, `frontend/lib/espn-types.ts`

### ESPN API Gaps (Not Available)

| Sport | Endpoint Attempted | Result |
|-------|-------------------|--------|
| Men's Soccer | `soccer/college-soccer-men` | ❌ 400 Error |
| Women's Soccer | `soccer/college-soccer-women` | ❌ 400 Error |
| Softball | `softball/college-softball` | ❌ 400 Error |

---

## Proposed Solution

### Data Source Routing

```
┌─────────────────────────────────────────────────────────────┐
│                   Component Layer                           │
│         (ScoreWidget, ScheduleList, etc.)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              lib/sports-data.ts (Unified API)               │
│                                                             │
│   getSchedule(sport) → routes to correct source            │
│   getScoreboard(sport) → routes to correct source          │
│   getTeamInfo(sport) → routes to correct source            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌─────────────────┐          ┌─────────────────┐        │
│    │  lib/espn.ts    │          │  lib/ncaa.ts    │        │
│    │                 │          │                 │        │
│    │  • Football     │          │  • Men's Soccer │        │
│    │  • M Basketball │          │  • W Soccer     │        │
│    │  • W Basketball │          │  • Softball     │        │
│    │  • Baseball     │          │                 │        │
│    └────────┬────────┘          └────────┬────────┘        │
│             │                            │                  │
│             ▼                            ▼                  │
│    site.api.espn.com           ncaa-api.henrygd.me         │
│    (or self-hosted)                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sport to Data Source Mapping

| Sport | Type Key | Data Source | API Endpoint |
|-------|----------|-------------|--------------|
| Football | `football` | ESPN | `football/college-football` |
| Men's Basketball | `mensBasketball` | ESPN | `basketball/mens-college-basketball` |
| Women's Basketball | `womensBasketball` | ESPN | `basketball/womens-college-basketball` |
| Baseball | `baseball` | ESPN | `baseball/college-baseball` |
| Men's Soccer | `mensSoccer` | NCAA | `soccer-men/d1` |
| Women's Soccer | `womensSoccer` | NCAA | `soccer-women/d1` |
| Softball | `softball` | NCAA | `softball/d1` |

---

## Technical Specification

### New Files to Create

#### 1. `frontend/lib/ncaa.ts`
NCAA API service layer mirroring ESPN service structure.

```typescript
// Key exports needed:
export async function getScoreboard(sport: NCAASportType): Promise<NCAAScoreboardResponse>
export async function getSchedule(sport: NCAASportType, date?: string): Promise<NCAAScheduleResponse>
export async function findClemsonGames(games: NCAAGame[]): NCAAGame[]
export function transformToSimpleGame(game: NCAAGame): SimpleGame
```

#### 2. `frontend/lib/ncaa-types.ts`
TypeScript interfaces for NCAA API responses.

```typescript
// Key types needed:
export type NCAASportType = 'mensSoccer' | 'womensSoccer' | 'softball';

export interface NCAAGame {
  gameID: string;
  gameState: 'pre' | 'live' | 'final';
  startTime: string;
  startDate: string;
  home: NCAATeam;
  away: NCAATeam;
  network?: string;
  url: string;
}

export interface NCAATeam {
  score: string;
  names: {
    char6: string;
    short: string;
    seo: string;
    full: string;
  };
  winner: boolean;
  conferences: Array<{ conferenceName: string; conferenceSeo: string }>;
}
```

#### 3. `frontend/lib/sports-data.ts`
Unified service that routes requests to the correct API.

```typescript
// Key exports needed:
export type AllSportTypes = ESPNSportType | NCAASportType;
export type DataSource = 'espn' | 'ncaa';

export function getDataSource(sport: AllSportTypes): DataSource;
export async function getSchedule(sport: AllSportTypes): Promise<SimpleScheduleGame[]>;
export async function getScoreboard(sport: AllSportTypes): Promise<SimpleGame[]>;
export async function getClemsonGame(sport: AllSportTypes): Promise<SimpleGame | null>;
```

### Files to Modify

#### 1. `frontend/lib/espn-types.ts`
- Rename `SportType` to `ESPNSportType`
- Export combined `AllSportTypes`

#### 2. `frontend/lib/espn.ts`
- Update imports to use `ESPNSportType`
- No functional changes needed

#### 3. Components using ESPN directly
- Update to import from `sports-data.ts` instead of `espn.ts`
- Use `AllSportTypes` instead of `SportType`

---

## NCAA API Details

### Base URL
- Public: `https://ncaa-api.henrygd.me`
- Self-hosted (recommended): `http://localhost:3001`

### Endpoints Needed

| Endpoint | Purpose |
|----------|---------|
| `/scoreboard/{sport}/{division}` | Live/recent scores |
| `/schedule/{sport}/{division}` | Season schedule |
| `/game/{gameId}` | Game details |

### Data Format Differences

| Field | ESPN Format | NCAA Format |
|-------|-------------|-------------|
| Team ID | Numeric (`228`) | SEO slug (`clemson`) |
| Team Name | `team.name` | `names.short` |
| Score | `competitor.score` (string) | `home.score` / `away.score` |
| Game State | `pre`, `in`, `post` | `pre`, `live`, `final` |
| Logo | Included in response | Not included (use local) |
| Record | `records[].summary` | `description` field |

### Finding Clemson Games

NCAA API doesn't support team filtering. Strategy:
1. Fetch all games for the sport/date
2. Filter client-side for `seo === 'clemson'` or `short === 'Clemson'`

```typescript
function findClemsonGames(games: NCAAGame[]): NCAAGame[] {
  return games.filter(game =>
    game.home.names.seo === 'clemson' ||
    game.away.names.seo === 'clemson'
  );
}
```

---

## Implementation Phases

### Phase 1: NCAA API Service (Week 1)
- [ ] Create `lib/ncaa-types.ts` with TypeScript interfaces
- [ ] Create `lib/ncaa.ts` with core API functions
- [ ] Add fetch utilities with caching
- [ ] Add Clemson game filtering logic
- [ ] Write unit tests for transformations

### Phase 2: Unified Service Layer (Week 1)
- [ ] Create `lib/sports-data.ts` routing layer
- [ ] Update type exports in `espn-types.ts`
- [ ] Create consistent `SimpleGame` transformations
- [ ] Test both APIs through unified layer

### Phase 3: Component Updates (Week 2)
- [ ] Update `SPORT_PATHS` and `SPORT_NAMES` constants
- [ ] Add sport selector options for new sports
- [ ] Update score widgets to use unified service
- [ ] Update schedule components

### Phase 4: Self-Hosting & Production (Week 2)
- [ ] Set up Docker container for NCAA API
- [ ] Configure environment variables
- [ ] Add health checks and fallbacks
- [ ] Deploy and test

---

## Caching Strategy

| Data Type | ESPN Cache | NCAA Cache |
|-----------|------------|------------|
| Live Scores | 30 seconds | 60 seconds |
| Scoreboard | 1 minute | 2 minutes |
| Schedule | 1 hour | 1 hour |
| Team Info | 24 hours | N/A (local) |

NCAA API has rate limit of 5 requests/second/IP on public endpoint.

---

## Fallback Strategy

```typescript
async function getScoreboardWithFallback(sport: AllSportTypes): Promise<SimpleGame[]> {
  const source = getDataSource(sport);

  try {
    if (source === 'espn') {
      return await espn.getScoreboard(sport);
    }
    return await ncaa.getScoreboard(sport);
  } catch (error) {
    console.error(`${source} API failed for ${sport}:`, error);
    return []; // Graceful degradation
  }
}
```

---

## Logos & Assets

NCAA API doesn't include team logos. Solutions:

1. **Clemson Logo:** Already have in assets
2. **Opponent Logos:**
   - Option A: Use ESPN team endpoint to fetch logos separately
   - Option B: Store common ACC/SEC team logos locally
   - Option C: Use placeholder for missing logos

Recommended: Option B for ACC teams + placeholder fallback.

---

## Testing Plan

### Unit Tests
- NCAA API response parsing
- Clemson game filtering
- Data transformation accuracy
- Cache behavior

### Integration Tests
- ESPN + NCAA unified responses
- Error handling and fallbacks
- Rate limiting behavior

### E2E Tests
- Score widget displays all sports
- Schedule shows correct data source
- Live updates work for both APIs

---

## Success Metrics

1. **Coverage:** All 7 major sports have live scores
2. **Reliability:** < 1% API error rate
3. **Performance:** < 500ms average response time
4. **Consistency:** Identical UI/UX across all sports

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| NCAA API goes down | High | Self-host the API |
| NCAA API changes format | Medium | Version pin, add tests |
| Rate limiting on public API | Medium | Self-host or add caching |
| Missing opponent logos | Low | Use placeholders |

---

## Dependencies

- Docker (for self-hosting NCAA API)
- henrygd/ncaa-api Docker image
- Existing ESPN integration working

---

## References

- [ESPN Integration Research](./clemson-athletics-live-scoring-research.md)
- [henrygd/ncaa-api GitHub](https://github.com/henrygd/ncaa-api)
- [Current ESPN Service](../frontend/lib/espn.ts)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-20 | Initial PRD created |
