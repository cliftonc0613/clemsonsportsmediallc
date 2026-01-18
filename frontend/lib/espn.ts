/**
 * ESPN API Service Layer
 * Fetches live sports data from ESPN's undocumented public API
 * @see https://github.com/pseudo-r/Public-ESPN-API
 */

import type {
  SportType,
  ESPNTeamResponse,
  ESPNScheduleResponse,
  ESPNScoreboardResponse,
  ESPNStandingsResponse,
  ESPNNewsResponse,
  ESPNRankingsResponse,
  ESPNRosterResponse,
  ESPNRosterAthlete,
  ESPNEvent,
  ESPNCompetition,
  ESPNCompetitor,
  ESPNStandingsEntry,
  SimpleGame,
  SimpleTeam,
  SimpleStanding,
  SimpleScheduleGame,
  SimpleRosterPlayer,
} from './espn-types';

// =============================================================================
// Configuration
// =============================================================================

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';
const ESPN_CORE_URL = 'https://sports.core.api.espn.com/v2/sports';

/** Clemson Tigers team ID (same across all sports) */
export const CLEMSON_TEAM_ID = '228';

/** ACC Conference ID for filtering */
export const ACC_CONFERENCE_ID = '1';

/** Sport endpoint paths */
export const SPORT_PATHS: Record<SportType, string> = {
  football: 'football/college-football',
  mensBasketball: 'basketball/mens-college-basketball',
  womensBasketball: 'basketball/womens-college-basketball',
  baseball: 'baseball/college-baseball',
} as const;

/** Sport display names */
export const SPORT_NAMES: Record<SportType, string> = {
  football: 'Football',
  mensBasketball: "Men's Basketball",
  womensBasketball: "Women's Basketball",
  baseball: 'Baseball',
} as const;

/** Map category slugs to sport types */
export const CATEGORY_TO_SPORT: Record<string, SportType> = {
  football: 'football',
  basketball: 'mensBasketball',
  'mens-basketball': 'mensBasketball',
  'womens-basketball': 'womensBasketball',
  baseball: 'baseball',
} as const;

// =============================================================================
// Cache Configuration (Next.js fetch options)
// =============================================================================

type CacheConfig = {
  revalidate: number;
  tags?: string[];
};

const CACHE_TIMES: Record<string, CacheConfig> = {
  /** Team info rarely changes */
  teamInfo: { revalidate: 86400, tags: ['espn-team'] }, // 24 hours
  /** Schedule changes occasionally */
  schedule: { revalidate: 3600, tags: ['espn-schedule'] }, // 1 hour
  /** Standings update after games */
  standings: { revalidate: 900, tags: ['espn-standings'] }, // 15 minutes
  /** Scoreboard needs frequent updates during games */
  scoreboard: { revalidate: 60, tags: ['espn-scoreboard'] }, // 1 minute
  /** Live scores need very frequent updates */
  liveScores: { revalidate: 30, tags: ['espn-live'] }, // 30 seconds
  /** News updates periodically */
  news: { revalidate: 300, tags: ['espn-news'] }, // 5 minutes
  /** Rankings update weekly */
  rankings: { revalidate: 3600, tags: ['espn-rankings'] }, // 1 hour
  /** Roster data rarely changes during season */
  roster: { revalidate: 3600, tags: ['espn-roster'] }, // 1 hour
};

// =============================================================================
// API Fetching Utilities
// =============================================================================

interface FetchOptions {
  cache?: CacheConfig;
  params?: Record<string, string | number>;
}

/**
 * Fetch data from ESPN API with error handling and caching
 */
async function fetchESPN<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { cache = CACHE_TIMES.teamInfo, params } = options;

  // Build URL with query params
  const url = new URL(endpoint);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  try {
    const response = await fetch(url.toString(), {
      next: {
        revalidate: cache.revalidate,
        tags: cache.tags,
      },
    });

    if (!response.ok) {
      console.error(`ESPN API error: ${response.status} for ${url.toString()}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`ESPN API fetch failed for ${url.toString()}:`, error);
    return null;
  }
}

// =============================================================================
// Team Data
// =============================================================================

/**
 * Get Clemson team information for a specific sport
 */
export async function getTeamInfo(sport: SportType): Promise<ESPNTeamResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  return fetchESPN<ESPNTeamResponse>(
    `${ESPN_BASE_URL}/${sportPath}/teams/${CLEMSON_TEAM_ID}`,
    { cache: CACHE_TIMES.teamInfo }
  );
}

/**
 * Get simplified team data with logo and record
 */
export async function getSimpleTeamInfo(sport: SportType): Promise<SimpleTeam | null> {
  const data = await getTeamInfo(sport);
  if (!data?.team) return null;

  const { team } = data;
  const logo = team.logos?.find((l) => l.rel.includes('default'))?.href;
  const record = team.record?.items?.find((r) => r.type === 'total')?.summary;

  return {
    id: team.id,
    name: team.name,
    abbreviation: team.abbreviation,
    displayName: team.displayName,
    logo,
    color: team.color,
    record,
  };
}

// =============================================================================
// Schedule Data
// =============================================================================

/**
 * Get Clemson's schedule for a specific sport
 */
export async function getSchedule(sport: SportType): Promise<ESPNScheduleResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  return fetchESPN<ESPNScheduleResponse>(
    `${ESPN_BASE_URL}/${sportPath}/teams/${CLEMSON_TEAM_ID}/schedule`,
    { cache: CACHE_TIMES.schedule }
  );
}

/**
 * Get upcoming games (not yet played)
 */
export async function getUpcomingGames(
  sport: SportType,
  limit: number = 5
): Promise<SimpleScheduleGame[]> {
  const data = await getSchedule(sport);
  if (!data?.events) return [];

  const now = new Date();

  return data.events
    .filter((event) => new Date(event.date) > now)
    .slice(0, limit)
    .map((event) => transformToSimpleScheduleGame(event));
}

/**
 * Get recent results (games already played)
 */
export async function getRecentResults(
  sport: SportType,
  limit: number = 5
): Promise<SimpleScheduleGame[]> {
  const data = await getSchedule(sport);
  if (!data?.events) return [];

  const now = new Date();

  return data.events
    .filter((event) => {
      const gameDate = new Date(event.date);
      return gameDate < now && event.status.type.completed;
    })
    .slice(-limit)
    .reverse()
    .map((event) => transformToSimpleScheduleGame(event));
}

// =============================================================================
// Scoreboard Data
// =============================================================================

/**
 * Get today's scoreboard for a sport
 */
export async function getScoreboard(
  sport: SportType,
  params?: { dates?: string; groups?: string; limit?: number }
): Promise<ESPNScoreboardResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  return fetchESPN<ESPNScoreboardResponse>(
    `${ESPN_BASE_URL}/${sportPath}/scoreboard`,
    {
      cache: CACHE_TIMES.scoreboard,
      params: params as Record<string, string | number>,
    }
  );
}

/**
 * Get Clemson's current or most recent game
 */
export async function getClemsonGame(sport: SportType): Promise<SimpleGame | null> {
  const scoreboard = await getScoreboard(sport);
  if (!scoreboard?.events) return null;

  // Find game with Clemson
  const clemsonGame = scoreboard.events.find((event) =>
    event.competitions[0]?.competitors.some(
      (c) => c.team.id === CLEMSON_TEAM_ID
    )
  );

  if (!clemsonGame) return null;
  return transformToSimpleGame(clemsonGame);
}

/**
 * Get live scores for games in progress (uses shorter cache)
 */
export async function getLiveScores(sport: SportType): Promise<SimpleGame[]> {
  const data = await fetchESPN<ESPNScoreboardResponse>(
    `${ESPN_BASE_URL}/${SPORT_PATHS[sport]}/scoreboard`,
    { cache: CACHE_TIMES.liveScores }
  );

  if (!data?.events) return [];

  return data.events
    .filter((event) => event.status.type.state === 'in')
    .map((event) => transformToSimpleGame(event));
}

/**
 * Check if Clemson has a game in progress
 */
export async function isClemsonGameLive(sport: SportType): Promise<boolean> {
  const game = await getClemsonGame(sport);
  return game?.status.state === 'in';
}

/**
 * Get Clemson game by specific event ID
 * Used by WordPress ESPN Score block to display specific games
 *
 * @param sport - Sport type
 * @param gameId - ESPN event ID or "latest" for most recent game
 * @param season - Optional season year (e.g., "2024")
 * @returns SimpleGame or null if not found
 */
export async function getClemsonGameById(
  sport: SportType,
  gameId: string,
  season?: string
): Promise<SimpleGame | null> {
  // If "latest", use the existing getClemsonGame function
  if (gameId === 'latest') {
    // First try scoreboard for live/today's games
    const currentGame = await getClemsonGame(sport);
    if (currentGame) return currentGame;

    // Fall back to next upcoming game from schedule
    const schedule = await getScheduleWithSeason(sport, season);
    if (!schedule?.events?.length) return null;

    const now = new Date();

    // Find the next upcoming game (first game in the future)
    const upcomingGames = schedule.events.filter(
      (event) => new Date(event.date) > now
    );

    // If there's an upcoming game, use it; otherwise fall back to most recent past game
    const targetEvent = upcomingGames.length > 0
      ? upcomingGames[0]  // Next upcoming game
      : schedule.events[schedule.events.length - 1];  // Most recent if no upcoming

    const game = transformToSimpleGameFromSchedule(targetEvent);

    // Schedule endpoint doesn't include team records - fetch from scoreboard
    if (!game.homeTeam.record || !game.awayTeam.record) {
      const currentRecords = await getCurrentTeamRecords(sport);
      if (currentRecords) {
        if (!game.homeTeam.record && currentRecords[game.homeTeam.id]) {
          game.homeTeam.record = currentRecords[game.homeTeam.id].record;
          if (!game.homeTeam.rank) {
            game.homeTeam.rank = currentRecords[game.homeTeam.id].rank;
          }
        }
        if (!game.awayTeam.record && currentRecords[game.awayTeam.id]) {
          game.awayTeam.record = currentRecords[game.awayTeam.id].record;
          if (!game.awayTeam.rank) {
            game.awayTeam.rank = currentRecords[game.awayTeam.id].rank;
          }
        }
      }
    }

    // If Clemson's record is still missing, fetch directly from team endpoint
    const clemsonIsHome = game.homeTeam.id === CLEMSON_TEAM_ID;
    const clemsonTeam = clemsonIsHome ? game.homeTeam : game.awayTeam;
    if (!clemsonTeam.record) {
      const clemsonInfo = await getSimpleTeamInfo(sport);
      if (clemsonInfo?.record) {
        if (clemsonIsHome) {
          game.homeTeam.record = clemsonInfo.record;
        } else {
          game.awayTeam.record = clemsonInfo.record;
        }
      }
    }

    return game;
  }

  // Fetch schedule to find the specific game
  const schedule = await getScheduleWithSeason(sport, season);
  if (!schedule?.events) return null;

  // Find the game by ID
  const event = schedule.events.find((e) => e.id === gameId);
  if (!event) return null;

  // Transform the schedule event to SimpleGame
  const game = transformToSimpleGameFromSchedule(event);

  // Schedule endpoint doesn't include team records for future games
  // Try to get current records from scoreboard and merge them in
  if (!game.homeTeam.record || !game.awayTeam.record) {
    const currentRecords = await getCurrentTeamRecords(sport);
    if (currentRecords) {
      if (!game.homeTeam.record && currentRecords[game.homeTeam.id]) {
        game.homeTeam.record = currentRecords[game.homeTeam.id].record;
        if (!game.homeTeam.rank) {
          game.homeTeam.rank = currentRecords[game.homeTeam.id].rank;
        }
      }
      if (!game.awayTeam.record && currentRecords[game.awayTeam.id]) {
        game.awayTeam.record = currentRecords[game.awayTeam.id].record;
        if (!game.awayTeam.rank) {
          game.awayTeam.rank = currentRecords[game.awayTeam.id].rank;
        }
      }
    }
  }

  return game;
}

/**
 * Get current team records and rankings from scoreboard
 * Used to supplement schedule data which doesn't include records
 */
async function getCurrentTeamRecords(
  sport: SportType
): Promise<Record<string, { record?: string; rank?: number }> | null> {
  try {
    const scoreboard = await getScoreboard(sport);
    if (!scoreboard?.events) return null;

    const records: Record<string, { record?: string; rank?: number }> = {};

    for (const event of scoreboard.events) {
      const competition = event.competitions?.[0];
      if (!competition?.competitors) continue;

      for (const competitor of competition.competitors) {
        const teamId = competitor.team.id;
        if (records[teamId]) continue; // Already have this team

        // Extract record from scoreboard data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const competitorAny = competitor as any;
        let record: string | undefined;

        if (competitorAny.records) {
          record = competitorAny.records.find((r: any) => r.type === 'total')?.summary
            || competitorAny.records.find((r: any) => r.type === 'overall')?.summary
            || competitorAny.records[0]?.summary;
        }

        // Extract rank
        const rankValue = competitorAny.curatedRank?.current;
        const rank = rankValue && rankValue !== 99 ? rankValue : undefined;

        if (record || rank) {
          records[teamId] = { record, rank };
        }
      }
    }

    return Object.keys(records).length > 0 ? records : null;
  } catch {
    return null;
  }
}

/**
 * Get schedule with optional season parameter
 */
async function getScheduleWithSeason(
  sport: SportType,
  season?: string
): Promise<ESPNScheduleResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  const params: Record<string, string | number> = {};
  if (season) {
    params.season = season;
  }

  return fetchESPN<ESPNScheduleResponse>(
    `${ESPN_BASE_URL}/${sportPath}/teams/${CLEMSON_TEAM_ID}/schedule`,
    { cache: CACHE_TIMES.schedule, params }
  );
}

/**
 * Transform schedule event to SimpleGame
 * Schedule events have a slightly different structure than scoreboard events
 */
function transformToSimpleGameFromSchedule(event: ESPNEvent): SimpleGame {
  const competition = event.competitions?.[0];

  // Get competitors - schedule uses different structure
  const homeCompetitor = competition?.competitors?.find((c) => c.homeAway === 'home');
  const awayCompetitor = competition?.competitors?.find((c) => c.homeAway === 'away');

  return {
    id: event.id,
    date: event.date,
    name: event.name,
    shortName: event.shortName,
    status: {
      state: event.status?.type?.state || 'pre',
      detail: event.status?.type?.detail || event.status?.type?.shortDetail || 'Scheduled',
      displayClock: event.status?.displayClock,
      period: event.status?.period,
      completed: event.status?.type?.completed || false,
    },
    homeTeam: transformCompetitorToSimpleTeam(homeCompetitor),
    awayTeam: transformCompetitorToSimpleTeam(awayCompetitor),
    homeScore: homeCompetitor?.score !== undefined
      ? parseInt(String(homeCompetitor.score), 10)
      : undefined,
    awayScore: awayCompetitor?.score !== undefined
      ? parseInt(String(awayCompetitor.score), 10)
      : undefined,
    venue: competition?.venue
      ? {
          name: competition.venue.fullName,
          city: competition.venue.address?.city || '',
        }
      : undefined,
    broadcasts: extractBroadcasts(competition, event),
    isConference: competition?.conferenceCompetition,
    link: event.links?.find((l) => l.rel?.includes('summary'))?.href,
  };
}

/**
 * Extract broadcast names from competition and/or event data
 * Handles multiple ESPN API structures:
 * - Scoreboard: competition.broadcasts: [{names: ["ESPN"]}]
 * - Schedule: competition.broadcasts: [{media: {shortName: "ESPN"}}]
 * - Either: competition.geoBroadcasts: [{media: {shortName: "ESPN"}}]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractBroadcasts(competition?: ESPNCompetition, event?: any): string[] {
  // Helper to extract from broadcast/geoBroadcast objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractFromBroadcastArray = (broadcasts: any[]): string[] => {
    if (!broadcasts?.length) return [];
    return broadcasts
      .map((b) => {
        // Schedule format: {media: {shortName: "The CW Network"}}
        if (b.media?.shortName) return b.media.shortName;
        if (b.media?.name) return b.media.name;
        // Scoreboard format: {names: ["ESPN", "ABC"]}
        if (b.names?.length) return b.names[0];
        // Direct shortName
        if (b.shortName) return b.shortName;
        return null;
      })
      .filter(Boolean);
  };

  // Try competition.broadcasts (both scoreboard and schedule endpoints)
  if (competition?.broadcasts?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const names = extractFromBroadcastArray(competition.broadcasts as any[]);
    if (names.length) return names;
  }

  // Try competition.geoBroadcasts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compGeoBroadcasts = (competition as any)?.geoBroadcasts;
  if (compGeoBroadcasts?.length) {
    const geoNames = extractFromBroadcastArray(compGeoBroadcasts);
    if (geoNames.length) return geoNames;
  }

  // Try event-level broadcasts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventBroadcasts = event?.competitions?.[0]?.broadcasts as any[];
  if (eventBroadcasts?.length) {
    const eventNames = extractFromBroadcastArray(eventBroadcasts);
    if (eventNames.length) return eventNames;
  }

  // Try event-level geoBroadcasts
  const eventGeoBroadcasts = event?.competitions?.[0]?.geoBroadcasts;
  if (eventGeoBroadcasts?.length) {
    const eventGeoNames = extractFromBroadcastArray(eventGeoBroadcasts);
    if (eventGeoNames.length) return eventGeoNames;
  }

  return [];
}

// =============================================================================
// Standings Data
// =============================================================================

/**
 * Get conference standings
 */
export async function getStandings(sport: SportType): Promise<ESPNStandingsResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  return fetchESPN<ESPNStandingsResponse>(
    `${ESPN_BASE_URL}/${sportPath}/standings`,
    {
      cache: CACHE_TIMES.standings,
      params: { group: ACC_CONFERENCE_ID },
    }
  );
}

/**
 * Get ACC standings as simple array
 */
export async function getACCStandings(sport: SportType): Promise<SimpleStanding[]> {
  const data = await getStandings(sport);
  if (!data) return [];

  // Find ACC standings in the response
  const accGroup = data.children?.find(
    (group) => group.abbreviation === 'ACC' || group.name?.includes('ACC')
  );

  if (!accGroup?.standings?.entries) {
    // Try direct entries if no children
    return [];
  }

  return accGroup.standings.entries.map((entry, index) =>
    transformToSimpleStanding(entry, index + 1)
  );
}

/**
 * Get Clemson's current standing
 */
export async function getClemsonStanding(sport: SportType): Promise<SimpleStanding | null> {
  const standings = await getACCStandings(sport);
  return standings.find((s) => s.isClemson) || null;
}

// =============================================================================
// Rankings Data
// =============================================================================

/**
 * Get current rankings (AP Poll, Coaches Poll, CFP Rankings)
 */
export async function getRankings(sport: SportType): Promise<ESPNRankingsResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  return fetchESPN<ESPNRankingsResponse>(
    `${ESPN_BASE_URL}/${sportPath}/rankings`,
    { cache: CACHE_TIMES.rankings }
  );
}

/**
 * Get Clemson's current ranking (if ranked)
 */
export async function getClemsonRanking(
  sport: SportType
): Promise<{ rank: number; poll: string; record: string } | null> {
  const data = await getRankings(sport);
  if (!data?.rankings) return null;

  // Check AP Poll first, then Coaches Poll
  for (const ranking of data.rankings) {
    const clemsonRank = ranking.ranks.find(
      (r) => r.team.id === CLEMSON_TEAM_ID
    );
    if (clemsonRank) {
      return {
        rank: clemsonRank.current,
        poll: ranking.shortName || ranking.name,
        record: clemsonRank.recordSummary || '',
      };
    }
  }

  return null;
}

// =============================================================================
// News Data
// =============================================================================

/**
 * Get news articles for a sport (filtered by Clemson if available)
 */
export async function getNews(
  sport: SportType,
  limit: number = 10
): Promise<ESPNNewsResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  return fetchESPN<ESPNNewsResponse>(
    `${ESPN_BASE_URL}/${sportPath}/news`,
    {
      cache: CACHE_TIMES.news,
      params: { limit },
    }
  );
}

// =============================================================================
// Roster Data
// =============================================================================

/**
 * Get Clemson's roster for a specific sport
 * @param sport - Sport type
 * @param season - Optional season year (e.g., 2024, 2025)
 */
export async function getRoster(sport: SportType, season?: number): Promise<ESPNRosterResponse | null> {
  const sportPath = SPORT_PATHS[sport];
  const params: Record<string, string | number> = {};
  if (season) {
    params.season = season;
  }
  return fetchESPN<ESPNRosterResponse>(
    `${ESPN_BASE_URL}/${sportPath}/teams/${CLEMSON_TEAM_ID}/roster`,
    { cache: CACHE_TIMES.roster, params }
  );
}

/**
 * Get simplified roster data for components
 * Handles both grouped (football) and flat (basketball) roster structures
 * @param sport - Sport type
 * @param season - Optional season year (e.g., 2024, 2025)
 */
export async function getSimpleRoster(sport: SportType, season?: number): Promise<SimpleRosterPlayer[]> {
  const data = await getRoster(sport, season);
  if (!data?.athletes) return [];

  const players: SimpleRosterPlayer[] = [];

  // Check if athletes is grouped (has 'items') or flat array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstEntry = data.athletes[0] as any;
  const isGrouped = firstEntry && 'items' in firstEntry;

  if (isGrouped) {
    // Grouped structure (football): [{position, items: [athletes]}]
    for (const group of data.athletes) {
      const groupItems = (group as { position?: string; items: ESPNRosterAthlete[] }).items || [];
      for (const athlete of groupItems) {
        players.push(transformAthleteToSimplePlayer(athlete, group.position));
      }
    }
  } else {
    // Flat structure (basketball): [athlete, athlete, ...]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const athlete of data.athletes as any[]) {
      players.push(transformAthleteToSimplePlayer(athlete, undefined));
    }
  }

  return players;
}

/**
 * Transform ESPN athlete to SimpleRosterPlayer
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformAthleteToSimplePlayer(athlete: any, group?: string): SimpleRosterPlayer {
  return {
    id: athlete.id,
    name: athlete.displayName || athlete.fullName,
    firstName: athlete.firstName,
    lastName: athlete.lastName,
    jersey: athlete.jersey,
    position: athlete.position?.displayName || athlete.position?.name || 'Unknown',
    positionAbbr: athlete.position?.abbreviation || '',
    height: athlete.displayHeight,
    weight: athlete.displayWeight,
    experience: athlete.experience?.displayValue,
    hometown: athlete.birthPlace
      ? [athlete.birthPlace.city, athlete.birthPlace.state]
          .filter(Boolean)
          .join(', ')
      : undefined,
    headshot: athlete.headshot?.href,
    group,
  };
}

/**
 * Get roster grouped by position category
 * Handles both grouped (football) and flat (basketball) roster structures
 * @param sport - Sport type
 * @param season - Optional season year (e.g., 2024, 2025)
 */
export async function getRosterByGroup(
  sport: SportType,
  season?: number
): Promise<Record<string, SimpleRosterPlayer[]>> {
  const data = await getRoster(sport, season);
  if (!data?.athletes) return {};

  const groups: Record<string, SimpleRosterPlayer[]> = {};

  // Check if athletes is grouped (has 'items') or flat array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstEntry = data.athletes[0] as any;
  const isGrouped = firstEntry && 'items' in firstEntry;

  if (isGrouped) {
    // Grouped structure (football): [{position, items: [athletes]}]
    for (const group of data.athletes) {
      const groupName = group.position || 'Other';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      const groupItems = (group as { position?: string; items: ESPNRosterAthlete[] }).items || [];
      for (const athlete of groupItems) {
        groups[groupName].push(transformAthleteToSimplePlayer(athlete, group.position));
      }
    }
  } else {
    // Flat structure (basketball): [athlete, athlete, ...]
    // Group by position
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const athlete of data.athletes as any[]) {
      const groupName = athlete.position?.name || 'Other';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(transformAthleteToSimplePlayer(athlete, groupName));
    }
  }

  return groups;
}

// =============================================================================
// Data Transformation Utilities
// =============================================================================

/**
 * Transform ESPN event to SimpleGame
 */
function transformToSimpleGame(event: ESPNEvent): SimpleGame {
  const competition = event.competitions[0];
  const homeCompetitor = competition?.competitors.find((c) => c.homeAway === 'home');
  const awayCompetitor = competition?.competitors.find((c) => c.homeAway === 'away');

  return {
    id: event.id,
    date: event.date,
    name: event.name,
    shortName: event.shortName,
    status: {
      state: event.status.type.state,
      detail: event.status.type.detail,
      displayClock: event.status.displayClock,
      period: event.status.period,
      completed: event.status.type.completed,
    },
    homeTeam: transformCompetitorToSimpleTeam(homeCompetitor),
    awayTeam: transformCompetitorToSimpleTeam(awayCompetitor),
    homeScore: homeCompetitor?.score ? parseInt(homeCompetitor.score, 10) : undefined,
    awayScore: awayCompetitor?.score ? parseInt(awayCompetitor.score, 10) : undefined,
    venue: competition?.venue
      ? {
          name: competition.venue.fullName,
          city: competition.venue.address?.city || '',
        }
      : undefined,
    broadcasts: competition?.broadcasts?.flatMap((b) => b.names) || [],
    isConference: competition?.conferenceCompetition,
    link: event.links?.find((l) => l.rel.includes('summary'))?.href,
  };
}

/**
 * Transform ESPN competitor to SimpleTeam
 */
function transformCompetitorToSimpleTeam(competitor?: ESPNCompetitor): SimpleTeam {
  if (!competitor) {
    return {
      id: '',
      name: 'TBD',
      abbreviation: 'TBD',
      displayName: 'TBD',
    };
  }

  const { team } = competitor;

  // Get logo - scoreboard uses team.logo (string), team details uses team.logos (array)
  let logo = team.logo; // Check singular first (scoreboard endpoint)

  // If no singular logo, try the logos array (team detail endpoint)
  if (!logo && team.logos?.length) {
    logo = team.logos.find((l) => l.rel.includes('default'))?.href;
    if (!logo) {
      logo = team.logos.find((l) => l.rel.includes('full'))?.href;
    }
    if (!logo) {
      logo = team.logos[0]?.href;
    }
  }

  // Get record - different endpoints use different structures
  // Scoreboard: competitor.records[].summary (plural)
  // Schedule: competitor.record[].displayValue (singular)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const competitorAny = competitor as any;

  let record: string | undefined;

  // Try scoreboard format first (records with summary)
  if (competitorAny.records) {
    record = competitorAny.records.find((r: any) => r.type === 'total')?.summary
      || competitorAny.records.find((r: any) => r.type === 'overall')?.summary
      || competitorAny.records[0]?.summary;
  }

  // Try schedule format (record with displayValue)
  if (!record && competitorAny.record) {
    record = competitorAny.record.find((r: any) => r.type === 'total')?.displayValue
      || competitorAny.record.find((r: any) => r.type === 'overall')?.displayValue
      || competitorAny.record[0]?.displayValue;
  }

  // Get team name - ESPN API can return different fields for different sports/endpoints
  // Priority: name (mascot), but if empty use shortDisplayName or location
  const teamName = team.name || team.shortDisplayName || team.location || team.displayName || 'TBD';

  // Get rank - ESPN uses curatedRank.current (99 means unranked)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rankValue = (competitor as any).curatedRank?.current;
  const rank = rankValue && rankValue !== 99 ? rankValue : undefined;

  return {
    id: team.id,
    name: teamName,
    abbreviation: team.abbreviation || team.id,
    displayName: team.displayName || `${team.location} ${team.name}`.trim() || 'TBD',
    logo,
    color: team.color,
    record,
    rank,
  };
}

/**
 * Transform ESPN event to SimpleScheduleGame
 */
function transformToSimpleScheduleGame(event: ESPNEvent): SimpleScheduleGame {
  const competition = event.competitions[0];
  const clemsonCompetitor = competition?.competitors.find(
    (c) => c.team.id === CLEMSON_TEAM_ID
  );
  const opponentCompetitor = competition?.competitors.find(
    (c) => c.team.id !== CLEMSON_TEAM_ID
  );

  const isHome = clemsonCompetitor?.homeAway === 'home';
  const clemsonScore = clemsonCompetitor?.score
    ? parseInt(clemsonCompetitor.score, 10)
    : undefined;
  const opponentScore = opponentCompetitor?.score
    ? parseInt(opponentCompetitor.score, 10)
    : undefined;

  let result: SimpleScheduleGame['result'];
  if (event.status.type.completed && clemsonScore !== undefined && opponentScore !== undefined) {
    result = {
      win: clemsonScore > opponentScore,
      score: isHome
        ? `${clemsonScore}-${opponentScore}`
        : `${opponentScore}-${clemsonScore}`,
    };
  }

  return {
    id: event.id,
    date: event.date,
    opponent: transformCompetitorToSimpleTeam(opponentCompetitor),
    isHome,
    result,
    venue: competition?.venue?.fullName,
    broadcasts: competition?.broadcasts?.flatMap((b) => b.names) || [],
    link: event.links?.find((l) => l.rel.includes('summary'))?.href,
  };
}

/**
 * Transform ESPN standings entry to SimpleStanding
 */
function transformToSimpleStanding(
  entry: ESPNStandingsEntry,
  rank: number
): SimpleStanding {
  const getStat = (name: string): number => {
    const stat = entry.stats.find((s) => s.name === name);
    return stat?.value ?? 0;
  };

  const logo = entry.team.logos?.find((l) => l.rel.includes('default'))?.href;

  return {
    rank,
    team: {
      id: entry.team.id,
      name: entry.team.name,
      abbreviation: entry.team.abbreviation,
      displayName: entry.team.displayName,
      logo,
      color: entry.team.color,
    },
    wins: getStat('wins'),
    losses: getStat('losses'),
    conferenceWins: getStat('conferenceWins') || getStat('divisionWins'),
    conferenceLosses: getStat('conferenceLosses') || getStat('divisionLosses'),
    winPct: getStat('winPercent') || getStat('gamesBehind'),
    streak: entry.stats.find((s) => s.name === 'streak')?.displayValue,
    isClemson: entry.team.id === CLEMSON_TEAM_ID,
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format game date for display
 */
export function formatGameDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format game time for display
 */
export function formatGameTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Get sport type from category slug
 */
export function getSportFromCategory(categorySlug: string): SportType | null {
  return CATEGORY_TO_SPORT[categorySlug.toLowerCase()] || null;
}

/**
 * Check if ESPN API is configured and accessible
 */
export async function isESPNAvailable(): Promise<boolean> {
  try {
    const response = await fetch(
      `${ESPN_BASE_URL}/football/college-football/teams/${CLEMSON_TEAM_ID}`,
      { next: { revalidate: 3600 } }
    );
    return response.ok;
  } catch {
    return false;
  }
}
