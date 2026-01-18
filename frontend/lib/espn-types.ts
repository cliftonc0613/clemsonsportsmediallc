/**
 * ESPN API TypeScript Interfaces
 * Based on ESPN's undocumented public API
 * @see https://github.com/pseudo-r/Public-ESPN-API
 */

// =============================================================================
// Core Types
// =============================================================================

export type SportType = 'football' | 'mensBasketball' | 'womensBasketball' | 'baseball';

export interface ESPNLogo {
  href: string;
  width: number;
  height: number;
  alt?: string;
  rel: string[];
}

export interface ESPNLink {
  language?: string;
  rel: string[];
  href: string;
  text?: string;
  shortText?: string;
  isExternal?: boolean;
  isPremium?: boolean;
}

// =============================================================================
// Team Types
// =============================================================================

export interface ESPNTeam {
  id: string;
  uid?: string;
  slug?: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName?: string;
  color?: string;
  alternateColor?: string;
  isActive?: boolean;
  /** Single logo URL (used in scoreboard responses) */
  logo?: string;
  /** Array of logo objects (used in team detail responses) */
  logos?: ESPNLogo[];
  links?: ESPNLink[];
  record?: ESPNRecordItem[];
}

export interface ESPNRecordItem {
  name?: string;
  abbreviation?: string;
  type: string;
  summary: string;
  stats?: ESPNRecordStat[];
}

export interface ESPNRecordStat {
  name: string;
  value: number;
}

export interface ESPNTeamResponse {
  team: ESPNTeamDetail;
}

export interface ESPNTeamDetail extends Omit<ESPNTeam, 'record'> {
  nickname?: string;
  standingSummary?: string;
  nextEvent?: ESPNEvent[];
  record?: {
    items: ESPNRecordItem[];
  };
}

// =============================================================================
// Event/Game Types
// =============================================================================

export interface ESPNEvent {
  id: string;
  uid?: string;
  date: string;
  name: string;
  shortName: string;
  season?: {
    year: number;
    type: number;
    slug?: string;
  };
  week?: {
    number: number;
    text?: string;
  };
  competitions: ESPNCompetition[];
  links?: ESPNLink[];
  status: ESPNEventStatus;
}

export interface ESPNEventStatus {
  clock?: number;
  displayClock?: string;
  period?: number;
  type: {
    id: string;
    name: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface ESPNCompetition {
  id: string;
  uid?: string;
  date: string;
  attendance?: number;
  type?: {
    id: string;
    abbreviation?: string;
  };
  timeValid?: boolean;
  neutralSite?: boolean;
  conferenceCompetition?: boolean;
  playByPlayAvailable?: boolean;
  recent?: boolean;
  venue?: ESPNVenue;
  competitors: ESPNCompetitor[];
  notes?: ESPNNote[];
  situation?: ESPNSituation;
  status: ESPNEventStatus;
  broadcasts?: ESPNBroadcast[];
  leaders?: ESPNLeaderCategory[];
  headlines?: ESPNHeadline[];
  odds?: ESPNOdds[];
}

export interface ESPNCompetitor {
  id: string;
  uid?: string;
  type: string;
  order: number;
  homeAway: 'home' | 'away';
  winner?: boolean;
  team: ESPNTeam;
  score?: string;
  linescores?: { value: number }[];
  statistics?: ESPNStatistic[];
  records?: ESPNRecordItem[];
  leaders?: ESPNLeader[];
}

export interface ESPNVenue {
  id: string;
  fullName: string;
  address?: {
    city: string;
    state?: string;
    country?: string;
  };
  capacity?: number;
  indoor?: boolean;
}

export interface ESPNNote {
  type: string;
  headline: string;
}

export interface ESPNSituation {
  lastPlay?: {
    id: string;
    type: { id: string; text: string };
    text: string;
    scoreValue?: number;
    team?: { id: string };
  };
  down?: number;
  yardLine?: number;
  distance?: number;
  isRedZone?: boolean;
  homeTimeouts?: number;
  awayTimeouts?: number;
  possession?: string;
}

export interface ESPNBroadcast {
  market: string;
  names: string[];
}

export interface ESPNHeadline {
  description: string;
  type: string;
  shortLinkText?: string;
}

export interface ESPNOdds {
  provider: {
    id: string;
    name: string;
    priority: number;
  };
  details?: string;
  overUnder?: number;
  spread?: number;
  overOdds?: number;
  underOdds?: number;
  awayTeamOdds?: { team: { id: string }; moneyLine?: number };
  homeTeamOdds?: { team: { id: string }; moneyLine?: number };
}

// =============================================================================
// Statistics & Leaders
// =============================================================================

export interface ESPNStatistic {
  name: string;
  abbreviation?: string;
  displayValue: string;
  value?: number;
}

export interface ESPNLeaderCategory {
  name: string;
  displayName: string;
  shortDisplayName?: string;
  abbreviation: string;
  leaders: ESPNLeader[];
}

export interface ESPNLeader {
  displayValue: string;
  value?: number;
  athlete?: ESPNAthlete;
  team?: ESPNTeam;
  statistics?: ESPNStatistic[];
}

export interface ESPNAthlete {
  id: string;
  fullName: string;
  displayName: string;
  shortName?: string;
  headshot?: {
    href: string;
    alt?: string;
  };
  jersey?: string;
  position?: {
    abbreviation: string;
  };
  team?: {
    id: string;
  };
  links?: ESPNLink[];
}

// =============================================================================
// Standings Types
// =============================================================================

export interface ESPNStandingsResponse {
  uid?: string;
  id?: string;
  name?: string;
  abbreviation?: string;
  children?: ESPNStandingsGroup[];
}

export interface ESPNStandingsGroup {
  uid?: string;
  id?: string;
  name: string;
  abbreviation?: string;
  standings?: {
    id?: string;
    name?: string;
    displayName?: string;
    links?: ESPNLink[];
    season?: number;
    seasonType?: number;
    seasonDisplayName?: string;
    entries: ESPNStandingsEntry[];
  };
}

export interface ESPNStandingsEntry {
  team: ESPNTeam;
  stats: ESPNStandingStat[];
}

export interface ESPNStandingStat {
  name: string;
  displayName?: string;
  shortDisplayName?: string;
  description?: string;
  abbreviation: string;
  type: string;
  value?: number;
  displayValue: string;
}

// =============================================================================
// Schedule Types
// =============================================================================

export interface ESPNScheduleResponse {
  team?: ESPNTeamDetail;
  events?: ESPNEvent[];
  requestedSeason?: {
    year: number;
    type: number;
    name: string;
    displayName: string;
  };
  byeWeek?: number;
}

// =============================================================================
// Scoreboard Types
// =============================================================================

export interface ESPNScoreboardResponse {
  leagues?: ESPNLeague[];
  season?: {
    type: number;
    year: number;
  };
  week?: {
    number: number;
    teamsOnBye?: ESPNTeam[];
  };
  events: ESPNEvent[];
}

export interface ESPNLeague {
  id: string;
  uid?: string;
  name: string;
  abbreviation: string;
  slug?: string;
  season?: {
    year: number;
    startDate: string;
    endDate: string;
    displayName: string;
    type: {
      id: string;
      type: number;
      name: string;
      abbreviation: string;
    };
  };
  logos?: ESPNLogo[];
  calendarType?: string;
  calendarIsWhitelist?: boolean;
  calendarStartDate?: string;
  calendarEndDate?: string;
  calendar?: string[] | ESPNCalendarEntry[];
}

export interface ESPNCalendarEntry {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
  entries?: {
    label: string;
    alternateLabel?: string;
    detail: string;
    value: string;
    startDate: string;
    endDate: string;
  }[];
}

// =============================================================================
// News Types
// =============================================================================

export interface ESPNNewsResponse {
  header: string;
  link: ESPNLink;
  articles: ESPNArticle[];
}

export interface ESPNArticle {
  dataSourceIdentifier?: string;
  description: string;
  headline: string;
  images?: ESPNImage[];
  links: {
    api?: {
      news?: { href: string };
      self?: { href: string };
    };
    web?: { href: string };
    mobile?: { href: string };
  };
  premium?: boolean;
  published: string;
  lastModified?: string;
  type: string;
  categories?: ESPNCategory[];
  byline?: string;
}

export interface ESPNImage {
  name?: string;
  width: number;
  height: number;
  alt?: string;
  caption?: string;
  url: string;
}

export interface ESPNCategory {
  id?: number;
  description?: string;
  type: string;
  sportId?: number;
  teamId?: number;
  team?: ESPNTeam;
  uid?: string;
  athleteId?: number;
  athlete?: ESPNAthlete;
}

// =============================================================================
// Rankings Types
// =============================================================================

export interface ESPNRankingsResponse {
  rankings: ESPNRanking[];
}

export interface ESPNRanking {
  id: string;
  name: string;
  shortName?: string;
  type: string;
  headline?: string;
  shortHeadline?: string;
  date?: string;
  lastUpdated?: string;
  ranks: ESPNRankEntry[];
}

export interface ESPNRankEntry {
  current: number;
  previous: number;
  points?: number;
  firstPlaceVotes?: number;
  trend?: string;
  team: ESPNTeam;
  recordSummary?: string;
}

// =============================================================================
// Processed/Simplified Types (for components)
// =============================================================================

export interface SimpleTeam {
  id: string;
  name: string;
  abbreviation: string;
  displayName: string;
  logo?: string;
  color?: string;
  record?: string;
  rank?: number;
}

export interface SimpleGame {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: {
    state: 'pre' | 'in' | 'post';
    detail: string;
    displayClock?: string;
    period?: number;
    completed: boolean;
  };
  homeTeam: SimpleTeam;
  awayTeam: SimpleTeam;
  homeScore?: number;
  awayScore?: number;
  venue?: {
    name: string;
    city: string;
  };
  broadcasts?: string[];
  isConference?: boolean;
  link?: string;
}

export interface SimpleStanding {
  rank: number;
  team: SimpleTeam;
  wins: number;
  losses: number;
  conferenceWins: number;
  conferenceLosses: number;
  winPct: number;
  streak?: string;
  isClemson: boolean;
}

export interface SimpleScheduleGame {
  id: string;
  date: string;
  opponent: SimpleTeam;
  isHome: boolean;
  result?: {
    win: boolean;
    score: string;
  };
  venue?: string;
  broadcasts?: string[];
  link?: string;
}

// =============================================================================
// Roster Types
// =============================================================================

export interface ESPNRosterResponse {
  team?: ESPNTeamDetail;
  athletes?: ESPNRosterGroup[];
  coach?: ESPNCoach[];
  season?: {
    year: number;
    displayName: string;
    type: number;
    name: string;
  };
}

export interface ESPNRosterGroup {
  position?: string;
  items: ESPNRosterAthlete[];
}

export interface ESPNRosterAthlete {
  id: string;
  uid?: string;
  guid?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  shortName?: string;
  weight?: number;
  displayWeight?: string;
  height?: number;
  displayHeight?: string;
  age?: number;
  dateOfBirth?: string;
  birthPlace?: {
    city?: string;
    state?: string;
    country?: string;
  };
  jersey?: string;
  position: {
    id?: string;
    name: string;
    displayName: string;
    abbreviation: string;
    leaf?: boolean;
  };
  headshot?: {
    href: string;
    alt?: string;
  };
  experience?: {
    years: number;
    displayValue?: string;
  };
  college?: {
    id: string;
    name: string;
    shortName?: string;
  };
  status?: {
    id: string;
    name: string;
    type: string;
    abbreviation: string;
  };
  links?: ESPNLink[];
}

export interface ESPNCoach {
  id: string;
  firstName: string;
  lastName: string;
  experience?: number;
  headshot?: {
    href: string;
    alt?: string;
  };
}

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
}
