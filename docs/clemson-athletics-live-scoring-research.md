# Clemson Athletics Live Scoring System - Technical Research

**Research Date:** January 20, 2026
**Target Site:** https://clemsontigers.com/
**Purpose:** Investigate the technical infrastructure behind college athletics live scoring systems

---

## Executive Summary

Clemson Athletics uses **WMT Games/WMT Media** as their primary technology provider, running on WordPress with custom WMT plugins. Unlike many ACC schools that use Sidearm Sports, Clemson has a proprietary setup. Live scoring during games is handled by third-party providers (StatBroadcast, Sidearm Stats) embedded via iframes or external links.

---

## Primary Technology Stack

### Website Platform
- **CMS:** WordPress
- **Theme:** Custom Clemson Tigers theme
- **Technology Provider:** WMT Games / WMT Media

### WMT Games Configuration

Found in global `wmtGames` JavaScript object:

```javascript
{
  "frontend": {
    "base": "https://wmt.games"
  },
  "api": {
    "base": "https://api.wmt.games",
    "wp": {
      "base": "https://clemsontigers.com/wp-json/wmt-stats-app",
      "nonce": null
    }
  }
}
```

---

## API Endpoints Discovered

### Public Endpoints

| Endpoint | Method | Format | Description |
|----------|--------|--------|-------------|
| `/wp-json/v1/load_schedule` | GET | HTML | Main schedule ticker (262 events) |
| `/wp-json/v1/master_schedules` | GET | JSON | Master schedules list |
| `/wp-json/v1/master_schedules_calendar` | GET | JSON | Calendar view of schedules |
| `/wp-json/v1/external/schedule-events-calendar` | GET | JSON | External calendar integration |
| `/wp-json/v1/load_schedule_records` | GET | JSON | Schedule records |
| `/wp-json/wp/v2/schedule-event` | GET | JSON | WordPress schedule events CPT |

### Authenticated Endpoints (Require Auth)

| Endpoint | Description |
|----------|-------------|
| `/wp-json/wmt-stats-app/schedule` | WMT Stats schedule management |
| `/wp-json/wmt-stats-app/schedule/{id}` | Individual schedule event |
| `/wp-json/wmt-stats-app/wmt-stats/{sport_code}/{season_id}/games` | Games by sport and season |
| `/wp-json/wmt-stats-app/wmt-stats/sports` | Available sports list |
| `/wp-json/wmt-stats-app/wmt-stats/{sport_code}/seasons` | Seasons by sport |
| `/wp-json/wmt-stats-app/roster` | Roster management |
| `/wp-json/wmt-stats-app/teams` | Teams management |
| `/wp-json/wmt-bulk-schedule-api/schedule-event/create` | Bulk schedule creation |

### External APIs

| API | URL | Purpose |
|-----|-----|---------|
| WMT Games API | `https://api.wmt.games` | Backend stats/data (authenticated) |
| Clemson+ Media | `https://api.clemsonplus.com/api/media-feed` | Premium content feed |
| WMT Video | `https://video.wmt.media` | Video streaming platform |

---

## WMT WordPress Plugins

The following WMT plugins are installed on clemsontigers.com:

| Plugin | Version | Purpose |
|--------|---------|---------|
| `wmt-stats-wordpress-plugin` | 0.4.2 | Stats integration and display |
| `wmt-video` | 4.0.4 | Video player and streaming |
| `wmt-360-player` | 1.0.5 | 360-degree video player |
| `wmt-instagram` | 1.0.6 | Instagram feed integration |
| `wmt-twitter` | 1.0.5 | Twitter/X feed integration |
| `wmt-xml` | 1.1.9 | XML data feeds |
| `wmt-bulk-roster-api` | - | Bulk roster management |
| `wmt-bulk-schedule-api` | - | Bulk schedule management |
| `wmt-recap-ai` | - | AI-powered game recaps |
| `wmt-tv-app` | - | TV application integration |
| `wmt-mobile-app` | - | Mobile app backend |

---

## Live Stats Providers (Third-Party)

Clemson defers live in-game scoring to specialized third-party providers:

### StatBroadcast
- **URL Pattern:** `https://stats.statbroadcast.com/broadcast/?id={broadcast_id}`
- **Example:** `https://stats.statbroadcast.com/broadcast/?id=611049`
- **Sports:** Basketball (Men's and Women's)
- **Integration:** Embedded iframe or external link

### Sidearm Stats
- **URL Pattern:** `https://sidearmstats.com/{school}/{sport}/`
- **Example:** `https://sidearmstats.com/columbia/mten/`
- **Sports:** Tennis, various others
- **Integration:** External link

### Flash Results
- **URL Pattern:** `https://flashresults.com/index.htm`
- **Sports:** Track & Field
- **Integration:** External link

### ESPN Watch
- **URL Pattern:** `https://www.espn.com/watch/player/_/id/{video_id}`
- **Purpose:** Live TV broadcasts
- **Networks:** ACCN, ACCNX, ESPN+

---

## Schedule Ticker Data Structure

### HTML Element Structure

```html
<div class="schedule schedule--home">
  <div class="swiper-slide">
    <div class="schedule-item home-game" data-event-id="794691">
      <div class="inner">
        <div class="date">
          <span><strong>Jan 20</strong></span>
        </div>
        <div class="logo">
          <img src="[opponent-logo-url]" alt="NC State"/>
        </div>
        <div class="status">
          <span>vs.</span>
        </div>
        <div class="title">
          <a href="/sports/mens-basketball/" class="sport-link">
            Men's Basketball
          </a>
          <h3>NC State *</h3>
          <span>Littlejohn Coliseum (home)</span>
        </div>
        <div class="results">
          <span><strong>W, 74 - 50</strong></span>
        </div>
        <div class="links">
          <a href="/recap-url/">Recap</a>
          <a href="/boxscore/794691">Box Score</a>
          <a href="https://stats.statbroadcast.com/...">Live Stats</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Data Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-event-id` | Unique event identifier | `794691` |
| `data-past` | Is game completed (0/1) | `1` |
| `data-future` | Is game upcoming (0/1) | `0` |
| `data-swiper-slide-index` | Carousel position | `2` |

### CSS Classes

| Class | Meaning |
|-------|---------|
| `schedule--home` | Homepage schedule variant |
| `schedule-item` | Individual game container |
| `home-game` | Game at home venue |
| `away-game` | Game at away venue |
| `swiper-slide-active` | Currently visible slide |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      clemsontigers.com                          │
│                      (WordPress + WMT)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ Schedule Ticker │    │    Box Scores    │                   │
│  │ (Swiper.js)     │    │ /boxscore/{id}   │                   │
│  └────────┬────────┘    └────────┬─────────┘                   │
│           │                      │                              │
│           ▼                      ▼                              │
│  ┌─────────────────────────────────────────┐                   │
│  │     /wp-json/v1/load_schedule           │                   │
│  │     (Returns pre-rendered HTML)         │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Live Stats (During Games)                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ StatBroadcast│ │ Sidearm Stats│ │ Flash Results│            │
│  │ (Basketball) │ │ (Tennis,etc) │ │ (Track)      │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│        ▲                 ▲                ▲                     │
│        │                 │                │                     │
│        └─────── Embedded iframes / External links ──────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Backend Services (Authenticated)                               │
│  ┌─────────────────┐    ┌─────────────────────────┐            │
│  │ api.wmt.games   │◄──►│ /wp-json/wmt-stats-app/ │            │
│  │ (External API)  │    │ (WordPress REST API)    │            │
│  └─────────────────┘    └─────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Refresh Mechanism

### Schedule Ticker
- **Method:** Server-side rendered HTML
- **Endpoint:** `/wp-json/v1/load_schedule`
- **Refresh:** Likely AJAX polling (interval TBD)
- **Format:** Pre-rendered HTML, not raw JSON

### Live Scores (During Games)
- **Method:** Deferred to third-party providers
- **Providers:** StatBroadcast, Sidearm Stats
- **Integration:** Embedded iframes or external links
- **Refresh:** Handled by third-party (typically 10-30 second intervals)

### Box Scores
- **Method:** Server-side rendered pages
- **URL Pattern:** `/boxscore/{event_id}`
- **Data Source:** WMT Stats API (internal)

---

## Key Findings

### 1. WMT Games is the Primary Provider
Unlike many college athletics sites that use Sidearm Sports (now part of Learfield), Clemson uses WMT Games/WMT Media. This is a less common but full-featured platform.

### 2. Schedule Data is Pre-Rendered HTML
The `/v1/load_schedule` endpoint returns pre-rendered HTML rather than raw JSON. This suggests:
- Scores are updated via server-side processes
- Client-side receives complete markup
- Likely cached for performance

### 3. Live Scoring is Outsourced
Real-time game scoring is handled by:
- **StatBroadcast** for basketball
- **Sidearm Stats** for other sports
- **Flash Results** for track & field

These providers specialize in real-time sports data and have dedicated infrastructure for handling live updates.

### 4. Authenticated API for Management
The WMT Stats API (`/wp-json/wmt-stats-app/`) requires authentication, indicating it's used for:
- Content management
- Data synchronization
- Administrative functions

---

## Comparison: WMT vs Sidearm Sports

| Feature | WMT Games | Sidearm Sports |
|---------|-----------|----------------|
| Platform | WordPress-based | Proprietary CMS |
| Live Stats | Third-party (StatBroadcast) | Built-in |
| Video | WMT Media platform | Sidearm Video |
| Mobile App | WMT Mobile App | Sidearm Mobile |
| Market Share | Smaller | Dominant (200+ schools) |

---

## Implementation Recommendations

### For Clemson Sports Media Site

1. **Schedule Data**
   - Use `/wp-json/v1/load_schedule` for schedule display
   - Parse HTML or request JSON endpoint if available
   - Consider caching responses (5-15 minute TTL)

2. **Live Scores**
   - Embed StatBroadcast iframes for basketball
   - Link to official live stats pages for other sports
   - Consider building custom polling against public endpoints

3. **Box Scores**
   - Link to official Clemson Tigers box score pages
   - Or scrape/parse data from `/boxscore/{event_id}` pages

4. **Alternative Data Sources**
   - ESPN API (if accessible)
   - NCAA Stats API
   - Direct StatBroadcast integration

---

## API Response Examples

### /wp-json/v1/load_schedule

```json
{
  "count": 262,
  "data": "<div class=\"swiper-slide\">...</div>..."
}
```

### Event Data (Extracted from HTML)

```json
{
  "event_id": "794691",
  "date": "Jan 20",
  "sport": "Men's Basketball",
  "opponent": "NC State",
  "venue": "Littlejohn Coliseum",
  "type": "home-game",
  "time": "7:00 PM",
  "result": "W, 74 - 50",
  "links": {
    "recap": "/tigers-defeat-nc-state/",
    "boxscore": "/boxscore/794691",
    "live_stats": "https://stats.statbroadcast.com/broadcast/?id=611049"
  }
}
```

---

## Resources

- **Clemson Tigers Official Site:** https://clemsontigers.com/
- **WMT Games Platform:** https://wmt.games/
- **WMT Video Platform:** https://video.wmt.media/
- **StatBroadcast:** https://statbroadcast.com/
- **Sidearm Stats:** https://sidearmstats.com/

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-20 | Initial research and documentation |
