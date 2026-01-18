/**
 * Custom Roster Service
 * Manages JSON-based roster data for Clemson Sports Media
 */

import type {
  RosterData,
  RosterSportSlug,
  SimpleRosterPlayer,
  AnyPlayer,
  isBaseballPlayer,
} from './roster-types';

// =============================================================================
// Data Loading
// =============================================================================

/**
 * Load roster data from JSON file
 * @param sport - Sport slug (football, mens-basketball, etc.)
 * @param season - Season year (2025, 2024, etc.)
 * @returns Roster data or null if not found
 */
export async function getRosterData(
  sport: RosterSportSlug,
  season: number | string
): Promise<RosterData | null> {
  try {
    // Dynamic import of JSON data
    const rosterModule = await import(
      `@/data/rosters/${season}/${sport}.json`
    );
    return rosterModule.default as RosterData;
  } catch (error) {
    console.error(`Failed to load roster for ${sport} ${season}:`, error);
    return null;
  }
}

// =============================================================================
// Type Guard
// =============================================================================

/**
 * Check if player has bats/throws data (baseball/softball)
 */
function hasBaseballFields(player: AnyPlayer): player is AnyPlayer & { bats: 'L' | 'R' | 'S'; throws: 'L' | 'R' } {
  return 'bats' in player && 'throws' in player;
}

// =============================================================================
// Data Transformation
// =============================================================================

/**
 * Convert raw player to simplified display format
 */
function toSimplePlayer(player: AnyPlayer, groupName?: string): SimpleRosterPlayer {
  const simple: SimpleRosterPlayer = {
    id: player.id,
    name: `${player.firstName} ${player.lastName}`,
    firstName: player.firstName,
    lastName: player.lastName,
    jersey: player.number,
    position: player.positionFull || player.position,
    positionAbbr: player.position,
    height: player.height,
    weight: player.weight,
    experience: player.isRedshirt ? `R-${player.year}` : player.year,
    hometown: player.hometown,
    headshot: player.headshot,
    group: groupName,
    highSchool: player.highSchool,
    isRedshirt: player.isRedshirt,
  };

  // Add baseball/softball specific fields
  if (hasBaseballFields(player)) {
    simple.bats = player.bats;
    simple.throws = player.throws;
  }

  return simple;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Get complete roster as flat array of simplified players
 * @param sport - Sport slug
 * @param season - Season year
 * @returns Array of simplified player objects
 */
export async function getSimpleRoster(
  sport: RosterSportSlug,
  season: number | string
): Promise<SimpleRosterPlayer[]> {
  const data = await getRosterData(sport, season);
  if (!data) return [];

  const players: SimpleRosterPlayer[] = [];
  for (const group of data.groups) {
    for (const player of group.players) {
      players.push(toSimplePlayer(player, group.name));
    }
  }

  return players;
}

/**
 * Get roster organized by position groups
 * @param sport - Sport slug
 * @param season - Season year
 * @returns Object with group names as keys and player arrays as values
 */
export async function getRosterByGroup(
  sport: RosterSportSlug,
  season: number | string
): Promise<Record<string, SimpleRosterPlayer[]>> {
  const data = await getRosterData(sport, season);
  if (!data) return {};

  const groups: Record<string, SimpleRosterPlayer[]> = {};
  for (const group of data.groups) {
    groups[group.name] = group.players.map((p) => toSimplePlayer(p, group.name));
  }

  return groups;
}

/**
 * Get a single player by ID
 * @param sport - Sport slug
 * @param season - Season year
 * @param playerId - Player's unique ID
 * @returns Player object or null if not found
 */
export async function getPlayer(
  sport: RosterSportSlug,
  season: number | string,
  playerId: string
): Promise<SimpleRosterPlayer | null> {
  const data = await getRosterData(sport, season);
  if (!data) return null;

  for (const group of data.groups) {
    const player = group.players.find((p) => p.id === playerId);
    if (player) {
      return toSimplePlayer(player, group.name);
    }
  }

  return null;
}

/**
 * Get available seasons for a sport
 * @param sport - Sport slug
 * @returns Array of available season years
 */
export function getAvailableSeasons(sport: RosterSportSlug): string[] {
  // These should match the directories in data/rosters/
  // For now, hardcoded - could be made dynamic with fs in the future
  return ['2024', '2025', '2026'];
}

/**
 * Get roster metadata (last updated, sport info)
 * @param sport - Sport slug
 * @param season - Season year
 */
export async function getRosterMetadata(
  sport: RosterSportSlug,
  season: number | string
): Promise<{ lastUpdated: string; playerCount: number } | null> {
  const data = await getRosterData(sport, season);
  if (!data) return null;

  const playerCount = data.groups.reduce(
    (sum, group) => sum + group.players.length,
    0
  );

  return {
    lastUpdated: data.lastUpdated,
    playerCount,
  };
}
