import type { Metadata } from "next";
import Link from "next/link";
import {
  getSimpleTeamStats,
  getACCStandings,
  getSchedule,
  getTeamLeaders,
  CLEMSON_TEAM_ID,
} from "@/lib/espn";
import { StatsComparisonWidget, StandingsWidget, SeasonLeadersWidget } from "@/components/espn";
import type { ComparisonStat, ComparisonTeam } from "@/components/espn";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { AnimatedStatsGrid } from "@/components/ui/AnimatedStatBox";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

export const metadata: Metadata = {
  title: `Men's Basketball Stats | ${SITE_NAME}`,
  description:
    "Clemson Tigers Men's Basketball team statistics, matchup comparisons, and ACC standings.",
  openGraph: {
    title: `Men's Basketball Stats | ${SITE_NAME}`,
    description:
      "Clemson Tigers Men's Basketball team statistics, matchup comparisons, and ACC standings.",
    type: "website",
    url: `${SITE_URL}/stats/mens-basketball`,
  },
};

// Revalidate every 15 minutes
export const revalidate = 900;

interface OpponentInfo {
  id: string;
  name: string;
  gameDate: Date;
  gameTime: string;
  isUpcoming: boolean;
  isLive: boolean;
}

/**
 * Get the current/next game opponent from the schedule
 * Priority: 1) Currently live game, 2) Next upcoming game, 3) Most recent completed game
 */
async function getNextOpponent(): Promise<OpponentInfo | null> {
  try {
    const schedule = await getSchedule("mensBasketball");
    if (!schedule?.events) return null;

    const now = new Date();
    let nextUpcoming: OpponentInfo | null = null;
    let mostRecentCompleted: OpponentInfo | null = null;

    for (const event of schedule.events) {
      const competition = event.competitions?.[0];
      const competitors = competition?.competitors || [];
      const opponent = competitors.find((c: any) => c.team?.id !== CLEMSON_TEAM_ID);

      if (!opponent?.team?.id) continue;

      const gameDate = new Date(event.date);
      const status = competition?.status?.type;
      const isCompleted = status?.completed === true;
      const isInProgress = status?.state === "in" || status?.description === "In Progress";

      // Format game time
      const gameTime = gameDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const opponentInfo: OpponentInfo = {
        id: opponent.team.id,
        name: opponent.team.displayName || opponent.team.name || "Opponent",
        gameDate,
        gameTime,
        isUpcoming: !isCompleted,
        isLive: isInProgress,
      };

      // Priority 1: Currently live game - return immediately
      if (isInProgress) {
        return opponentInfo;
      }

      // Priority 2: Track the next upcoming game (earliest future game)
      if (!isCompleted && gameDate > now) {
        if (!nextUpcoming || gameDate < nextUpcoming.gameDate) {
          nextUpcoming = opponentInfo;
        }
      }

      // Priority 3: Track most recent completed game
      if (isCompleted) {
        if (!mostRecentCompleted || gameDate > mostRecentCompleted.gameDate) {
          mostRecentCompleted = opponentInfo;
        }
      }
    }

    // Return in priority order
    return nextUpcoming || mostRecentCompleted;
  } catch (error) {
    console.error("Failed to get opponent:", error);
    return null;
  }
}

export default async function MensBasketballStatsPage() {
  // Fetch data in parallel
  const [clemsonStats, standings, opponentInfo, clemsonLeaders] = await Promise.all([
    getSimpleTeamStats("mensBasketball"),
    getACCStandings("mensBasketball"),
    getNextOpponent(),
    getTeamLeaders("mensBasketball"),
  ]);

  // Get opponent stats and leaders if we have an opponent
  const [opponentStats, opponentLeaders] = opponentInfo
    ? await Promise.all([
        getSimpleTeamStats("mensBasketball", opponentInfo.id),
        getTeamLeaders("mensBasketball", opponentInfo.id),
      ])
    : [null, null];

  // Build comparison data
  let comparisonStats: ComparisonStat[] = [];
  let awayTeam: ComparisonTeam | null = null;
  let homeTeam: ComparisonTeam | null = null;

  if (clemsonStats && opponentStats) {
    // Set up teams
    awayTeam = {
      id: opponentStats.team.id,
      name: opponentStats.team.name,
      abbreviation: opponentStats.team.abbreviation,
      logo: opponentStats.team.logo,
      color: opponentStats.team.color,
    };

    homeTeam = {
      id: clemsonStats.team.id,
      name: clemsonStats.team.name,
      abbreviation: clemsonStats.team.abbreviation,
      logo: clemsonStats.team.logo,
      color: clemsonStats.team.color,
    };

    // Build comparison stats
    const getStatValue = (
      stats: Record<string, number>,
      perGameStats: Record<string, number>,
      key: string
    ): number => {
      // Try per-game stats first for averaging stats
      if (key.startsWith("avg") && perGameStats[key]) {
        return perGameStats[key];
      }
      return stats[key] || 0;
    };

    // Build comparison stats using actual ESPN stat names
    comparisonStats = [
      {
        label: "Points",
        awayValue: opponentStats.stats.avgPoints || 0,
        homeValue: clemsonStats.stats.avgPoints || 0,
        higherIsBetter: true,
      },
      {
        label: "Field Goal %",
        awayValue: opponentStats.stats.fieldGoalPct || 0,
        homeValue: clemsonStats.stats.fieldGoalPct || 0,
        higherIsBetter: true,
        isPercentage: true,
      },
      {
        label: "3-Point %",
        awayValue: opponentStats.stats.threePointFieldGoalPct || 0,
        homeValue: clemsonStats.stats.threePointFieldGoalPct || 0,
        higherIsBetter: true,
        isPercentage: true,
      },
      {
        label: "Free Throw %",
        awayValue: opponentStats.stats.freeThrowPct || 0,
        homeValue: clemsonStats.stats.freeThrowPct || 0,
        higherIsBetter: true,
        isPercentage: true,
      },
      {
        label: "Rebounds",
        awayValue: opponentStats.stats.avgRebounds || 0,
        homeValue: clemsonStats.stats.avgRebounds || 0,
        higherIsBetter: true,
      },
      {
        label: "Assists",
        awayValue: opponentStats.stats.avgAssists || 0,
        homeValue: clemsonStats.stats.avgAssists || 0,
        higherIsBetter: true,
      },
      {
        label: "Steals",
        awayValue: opponentStats.stats.avgSteals || 0,
        homeValue: clemsonStats.stats.avgSteals || 0,
        higherIsBetter: true,
      },
      {
        label: "Blocks",
        awayValue: opponentStats.stats.avgBlocks || 0,
        homeValue: clemsonStats.stats.avgBlocks || 0,
        higherIsBetter: true,
      },
      {
        label: "Turnovers",
        awayValue: opponentStats.stats.avgTurnovers || 0,
        homeValue: clemsonStats.stats.avgTurnovers || 0,
        higherIsBetter: false,
      },
    ];
  }

  return (
    <>
      <BodyClass className="page-stats" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Stats", url: `${SITE_URL}/stats` },
          { name: "Men's Basketball", url: `${SITE_URL}/stats/mens-basketball` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[var(--clemson-dark-purple)] pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/hero-basketball.jpg')" }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]/70" />

        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] font-heading font-bold uppercase text-white opacity-10 tracking-widest text-center leading-none">
              Statistics
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Men&apos;s Basketball Stats
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Breadcrumb */}
            <nav className="text-base md:text-lg text-gray-300 uppercase">
              <Link href="/" className="text-white hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-400">Stats</span>
              <span className="mx-2">/</span>
              <span className="text-[var(--clemson-orange)]">Men&apos;s Basketball</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Stats Section - Full Width Dashboard */}
      <section className="py-8 md:py-12 bg-gray-100">
        <div className="px-4 md:px-8 lg:px-12">
          {/* Row 1: Matchup Header (centered) */}
          {opponentInfo && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-500 uppercase tracking-wide text-center">
                  {opponentInfo.isLive ? (
                    <span className="text-red-600 font-bold">LIVE NOW</span>
                  ) : opponentInfo.isUpcoming ? (
                    <>
                      Next Game •{" "}
                      {opponentInfo.gameDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      • {opponentInfo.gameTime}
                    </>
                  ) : (
                    <>
                      Recent Game •{" "}
                      {opponentInfo.gameDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </>
                  )}
                </p>
                <h2 className="font-heading text-xl md:text-2xl text-center mt-2 text-[var(--clemson-purple)]">
                  Clemson vs {opponentInfo.name}
                </h2>
              </div>
            </div>
          )}

          {/* Row 2: Featured Widgets (Team Stats ~60% + Season Leaders ~40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Team Stats Comparison - 60% width */}
            <div className="lg:col-span-3">
              {awayTeam && homeTeam && comparisonStats.length > 0 ? (
                <StatsComparisonWidget
                  awayTeam={awayTeam}
                  homeTeam={homeTeam}
                  stats={comparisonStats}
                  title="TEAM STATS"
                />
              ) : clemsonStats ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center h-full">
                  <h2 className="font-heading text-xl text-[var(--clemson-purple)] mb-4">
                    Team Comparison
                  </h2>
                  <p className="text-gray-500">
                    {opponentInfo
                      ? `Loading comparison with ${opponentInfo.name}...`
                      : "No upcoming games scheduled. Check back soon!"}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center h-full">
                  <h2 className="font-heading text-xl text-[var(--clemson-purple)] mb-4">
                    Team Stats
                  </h2>
                  <p className="text-gray-500">
                    Team statistics are not available at this time.
                    Check back during the season!
                  </p>
                </div>
              )}
            </div>

            {/* Season Leaders + Quick Links - 40% width */}
            <div className="lg:col-span-2 space-y-6">
              {clemsonLeaders && opponentLeaders ? (
                <SeasonLeadersWidget
                  awayLeaders={opponentLeaders}
                  homeLeaders={clemsonLeaders}
                  title="SEASON LEADERS"
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h2 className="font-heading text-xl text-[var(--clemson-purple)] mb-4">
                    Season Leaders
                  </h2>
                  <p className="text-gray-500">
                    Leader statistics will appear when data is available.
                  </p>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[var(--clemson-purple)] px-4 py-3">
                  <h3 className="font-heading text-white text-lg">Quick Links</h3>
                </div>
                <div className="p-4 space-y-2">
                  <Link
                    href="/schedule/mens-basketball"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--clemson-orange)] transition-colors"
                  >
                    View Schedule →
                  </Link>
                  <Link
                    href="/roster/2025/mens-basketball"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--clemson-orange)] transition-colors"
                  >
                    View Roster →
                  </Link>
                  <Link
                    href="/category/mens-basketball"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--clemson-orange)] transition-colors"
                  >
                    Latest News →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Secondary Widgets (Averages 50% + Standings 50%) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clemson Season Averages */}
            <div>
              {clemsonStats ? (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
                  <div className="bg-[var(--clemson-purple)] px-4 py-3">
                    <h3 className="font-heading text-white text-lg">
                      Clemson Season Averages
                    </h3>
                  </div>
                  <div className="p-4">
                    <AnimatedStatsGrid
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                      stats={[
                        { label: "PPG", value: clemsonStats.stats.avgPoints },
                        { label: "RPG", value: clemsonStats.stats.avgRebounds },
                        { label: "APG", value: clemsonStats.stats.avgAssists },
                        { label: "SPG", value: clemsonStats.stats.avgSteals },
                        { label: "FG%", value: clemsonStats.stats.fieldGoalPct, isPercentage: true },
                        { label: "3P%", value: clemsonStats.stats.threePointFieldGoalPct, isPercentage: true },
                        { label: "FT%", value: clemsonStats.stats.freeThrowPct, isPercentage: true },
                        { label: "TO/G", value: clemsonStats.stats.avgTurnovers },
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center h-full">
                  <h3 className="font-heading text-xl text-[var(--clemson-purple)] mb-4">
                    Clemson Season Averages
                  </h3>
                  <p className="text-gray-500">Stats will appear during the season.</p>
                </div>
              )}
            </div>

            {/* ACC Standings */}
            <div>
              <StandingsWidget
                standings={standings}
                sport="mensBasketball"
                title="ACC Standings"
                limit={10}
                alwaysShowClemson
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data source note */}
      <section className="pb-8 bg-gray-100">
        <div className="px-4 md:px-8 lg:px-12">
          <p className="text-center text-xs text-gray-400">
            Statistics provided by ESPN. Data refreshes every 15 minutes.
          </p>
        </div>
      </section>
    </>
  );
}

