/**
 * Custom Roster System TypeScript Interfaces
 * Self-managed JSON-based roster for Clemson Sports Media
 */

// =============================================================================
// Core Roster Types
// =============================================================================

/**
 * Base player interface with common fields for all sports
 */
export interface RosterPlayer {
  /** Unique identifier (slug format: first-last) */
  id: string;
  /** Jersey number */
  number: string;
  firstName: string;
  lastName: string;
  /** Position abbreviation (QB, WR, C, etc.) */
  position: string;
  /** Full position name (Quarterback, Wide Receiver, etc.) */
  positionFull?: string;
  /** Height in feet-inches format (e.g., "6-2") */
  height: string;
  /** Weight in pounds (e.g., "210") */
  weight?: string;
  /** Academic year: Fr., So., Jr., Sr., Gr. */
  year: string;
  /** Redshirt designation */
  isRedshirt?: boolean;
  /** Hometown in "City, State" format */
  hometown: string;
  /** High school name */
  highSchool?: string;
  /** Previous college (for transfers) */
  previousSchool?: string;
  /** Player headshot URL */
  headshot?: string;
  /** Social media handles */
  social?: {
    twitter?: string;
    instagram?: string;
  };
}

/**
 * Extended player interface for baseball/softball with batting/throwing info
 */
export interface BaseballPlayer extends RosterPlayer {
  /** Batting hand: L (Left), R (Right), S (Switch) */
  bats: 'L' | 'R' | 'S';
  /** Throwing hand: L (Left), R (Right) */
  throws: 'L' | 'R';
}

/**
 * Union type for all player types
 */
export type AnyPlayer = RosterPlayer | BaseballPlayer;

// =============================================================================
// Roster Structure Types
// =============================================================================

/**
 * Group of players (e.g., Offense, Defense, Pitchers)
 */
export interface RosterGroup {
  /** Group name (Offense, Defense, Pitchers, etc.) */
  name: string;
  /** Players in this group */
  players: AnyPlayer[];
}

/**
 * Complete roster file structure
 */
export interface RosterData {
  /** Sport slug (football, mens-basketball, etc.) */
  sport: string;
  /** Season year (2025, 2024, etc.) */
  season: string;
  /** ISO 8601 timestamp of last update */
  lastUpdated: string;
  /** Grouped roster data */
  groups: RosterGroup[];
}

// =============================================================================
// Sport Configuration Types
// =============================================================================

/**
 * Supported sports for roster system
 */
export type RosterSportSlug =
  | 'football'
  | 'mens-basketball'
  | 'womens-basketball'
  | 'mens-soccer'
  | 'womens-soccer'
  | 'baseball'
  | 'softball';

/**
 * Sport-specific configuration
 */
export interface RosterSportConfig {
  /** Display name (e.g., "Men's Basketball") */
  displayName: string;
  /** Short name for breadcrumbs */
  shortName: string;
  /** Hero background image path */
  heroImage: string;
  /** Watermark text for hero section */
  watermark: string;
  /** Whether this sport uses position groups */
  useGroups: boolean;
  /** Order of position groups for display */
  positionGroupOrder: string[];
  /** Display names for position groups */
  positionGroupNames: Record<string, string>;
  /** Whether this sport has bats/throws data */
  hasBatsThrows?: boolean;
}

// =============================================================================
// Service Response Types
// =============================================================================

/**
 * Simplified player for display (compatible with existing UI)
 */
export interface SimpleRosterPlayer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  jersey?: string;
  position: string;
  positionAbbr: string;
  height?: string;
  weight?: string;
  experience?: string;
  hometown?: string;
  headshot?: string;
  group?: string;
  /** For baseball/softball */
  bats?: 'L' | 'R' | 'S';
  throws?: 'L' | 'R';
  /** High school info */
  highSchool?: string;
  /** Redshirt status */
  isRedshirt?: boolean;
}

/**
 * Type guard to check if player is a baseball player
 */
export function isBaseballPlayer(player: AnyPlayer): player is BaseballPlayer {
  return 'bats' in player && 'throws' in player;
}
