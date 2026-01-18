# Phase 10: Clemson Schedule Scraper

## Goal
Create a Playwright-based schedule scraper for ClemsonTigers.com as a backup/alternative to ESPN API for sports ESPN doesn't cover (e.g., men's soccer, women's soccer).

## Current State
- ✅ ESPN API integration exists for football, basketball, baseball
- ✅ Playwright roster scraper works well (`scripts/scrape-full-roster.ts`)
- ✅ Schedule pages exist but men's soccer just links to external site
- ❌ No local schedule data for non-ESPN sports

## Target Sports
- Men's Soccer
- Women's Soccer

## Data Structure

Match the existing `SimpleScheduleGame` format used by ESPN integration:

```typescript
interface ScheduleGame {
  id: string;                    // e.g., "2025-08-22-wake-forest"
  date: string;                  // ISO 8601 format
  opponent: {
    name: string;                // "Wake Forest"
    abbreviation?: string;       // "WF"
    logo?: string;               // Local logo path if available
  };
  isHome: boolean;
  result?: {                     // Only for completed games
    win: boolean;
    score: string;               // "2-1" or "W 2-1"
  };
  venue?: string;                // "Historic Riggs Field"
  time?: string;                 // "7:00 PM" for upcoming games
  broadcasts?: string[];         // ["ACCNX", "ESPN+"]
  link?: string;                 // Link to game details
}

interface ScheduleData {
  sport: string;
  season: string;
  lastUpdated: string;
  games: ScheduleGame[];
}
```

## Implementation Steps

### Step 1: Create Schedule Scraper Script

**File:** `frontend/scripts/scrape-schedule.ts`

```typescript
// Sports config - schedules use same URL pattern as rosters
const SCHEDULE_CONFIG = {
  "mens-soccer": {
    url: "https://clemsontigers.com/sports/mens-soccer/schedule/",
    displayName: "Men's Soccer"
  },
  "womens-soccer": {
    url: "https://clemsontigers.com/sports/womens-soccer/schedule/",
    displayName: "Women's Soccer"
  },
};
```

**Scraping approach:**
1. Launch Playwright browser
2. Navigate to schedule page, wait for table to render
3. Extract game rows from schedule table
4. Parse: date, opponent, home/away, result (if completed), venue, time
5. Save to `data/schedules/{year}/{sport}.json`

### Step 2: Create Schedule Loading Library

**File:** `frontend/lib/schedule.ts`

```typescript
export async function getScheduleData(sport: string, season: string): Promise<ScheduleData | null> {
  try {
    const data = await import(`@/data/schedules/${season}/${sport}.json`);
    return data.default;
  } catch {
    return null;
  }
}

export function getUpcomingGames(schedule: ScheduleData, limit = 5): ScheduleGame[] {
  const now = new Date();
  return schedule.games
    .filter(g => new Date(g.date) > now)
    .slice(0, limit);
}

export function getPastGames(schedule: ScheduleData, limit = 5): ScheduleGame[] {
  const now = new Date();
  return schedule.games
    .filter(g => new Date(g.date) <= now)
    .reverse()
    .slice(0, limit);
}
```

### Step 3: Update Men's Soccer Schedule Page

**File:** `frontend/app/schedule/mens-soccer/page.tsx`

- Load local JSON schedule data
- Display using same row format as football/basketball
- Fall back to "View Official Schedule" link if data unavailable

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/scripts/scrape-schedule.ts` | Playwright schedule scraper |
| `frontend/lib/schedule.ts` | Schedule data loading utilities |
| `frontend/data/schedules/2025/mens-soccer.json` | Scraped schedule data |
| `frontend/data/schedules/2025/womens-soccer.json` | Scraped schedule data |

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/app/schedule/mens-soccer/page.tsx` | Display scraped data instead of external link |

## CLI Usage

```bash
# Scrape single sport
npx tsx scripts/scrape-schedule.ts --sport mens-soccer --year 2025

# Scrape all non-ESPN sports
npx tsx scripts/scrape-schedule.ts --all --year 2025
```

## Verification Checklist

- [ ] Run scraper: `npx tsx scripts/scrape-schedule.ts --sport mens-soccer --year 2025`
- [ ] Verify JSON created at `data/schedules/2025/mens-soccer.json`
- [ ] Check schedule page displays games correctly
- [ ] Verify upcoming/past game filtering works
- [ ] Build passes: `npm run build`

## Dependencies

- Playwright (already installed from roster scraper)
