import type { Metadata } from "next";
import Link from "next/link";
import { getClemsonGame, getUpcomingGames, getRecentResults, getACCStandings, SPORT_NAMES } from "@/lib/espn";
import type { SimpleGame, SimpleScheduleGame, SimpleStanding, SportType } from "@/lib/espn-types";
import { ScoreCard, ScheduleWidget, StandingsWidget } from "@/components/espn";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

export const metadata: Metadata = {
  title: `Scores | ${SITE_NAME}`,
  description: "Live scores and recent results for Clemson Tigers football, basketball, and more.",
  openGraph: {
    title: `Scores | ${SITE_NAME}`,
    description: "Live scores and recent results for Clemson Tigers football, basketball, and more.",
    type: "website",
    url: `${SITE_URL}/scores`,
  },
};

// Revalidate every 60 seconds for live scores
export const revalidate = 60;

// Sports to display on the scores page
const SPORTS_TO_SHOW: SportType[] = [
  "football",
  "mensBasketball",
  "womensBasketball",
];

interface SportData {
  sport: SportType;
  game: SimpleGame | null;
  upcomingGames: SimpleScheduleGame[];
  recentResults: SimpleScheduleGame[];
  standings: SimpleStanding[];
}

export default async function ScoresPage() {
  // Fetch all data for each sport in parallel
  const sportDataPromises = SPORTS_TO_SHOW.map(async (sport): Promise<SportData> => {
    try {
      const [game, upcomingGames, recentResults, standings] = await Promise.all([
        getClemsonGame(sport),
        getUpcomingGames(sport, 5),
        getRecentResults(sport, 5),
        getACCStandings(sport),
      ]);
      return { sport, game, upcomingGames, recentResults, standings };
    } catch (error) {
      console.error(`Failed to fetch ${sport} data:`, error);
      return { sport, game: null, upcomingGames: [], recentResults: [], standings: [] };
    }
  });

  const sportsData = await Promise.all(sportDataPromises);

  // Filter to only sports with some data
  const sportsWithData = sportsData.filter(
    (data) => data.game || data.upcomingGames.length > 0 || data.recentResults.length > 0
  );

  return (
    <>
      <BodyClass className="page-scores" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Scores", url: `${SITE_URL}/scores` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gray-100 pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold uppercase text-[var(--clemson-orange)] opacity-75 tracking-widest text-center leading-none">
              Scores
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Clemson Scores
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Breadcrumb */}
            <nav className="text-base md:text-lg text-gray-500 uppercase">
              <Link href="/" className="text-[var(--clemson-purple)] hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Scores</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Scores Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {sportsWithData.length > 0 ? (
            <div className="space-y-12 md:space-y-16">
              {sportsWithData.map((data) => (
                <SportSection key={data.sport} data={data} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No recent games available. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Note about data source */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-gray-400">
            Scores provided by ESPN. Data refreshes every minute.
          </p>
        </div>
      </section>
    </>
  );
}

/**
 * Sport section with scorecard and widgets
 */
function SportSection({ data }: { data: SportData }) {
  const { sport, game, upcomingGames, recentResults, standings } = data;
  const sportName = SPORT_NAMES[sport];

  return (
    <div className="border-b border-gray-200 pb-12 last:border-0">
      {/* Sport Header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--clemson-purple)]">
          {sportName}
        </h2>
        <div className="flex-1 h-0.5 bg-[var(--clemson-orange)]" />
        <Link
          href={`/category/${sport === "mensBasketball" ? "basketball" : sport}`}
          className="text-sm text-[var(--clemson-orange)] hover:underline font-medium"
        >
          View All Articles →
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Column - Scorecard and Recent Results */}
        <div className="space-y-6">
          {/* Current/Latest Game Scorecard */}
          {game && (
            <ScoreCard
              game={game}
              sport={sport}
              title={`Clemson ${sportName} Scoreboard`}
            />
          )}

          {/* Recent Results */}
          {recentResults.length > 0 && (
            <ScheduleWidget
              games={recentResults}
              sport={sport}
              title="Recent Results"
              showResults
            />
          )}
        </div>

        {/* Right Column - Upcoming Games and Standings */}
        <div className="space-y-6">
          {/* Upcoming Games */}
          {upcomingGames.length > 0 && (
            <ScheduleWidget
              games={upcomingGames}
              sport={sport}
              title="Upcoming Games"
            />
          )}

          {/* ACC Standings */}
          {standings.length > 0 && (
            <StandingsWidget
              standings={standings}
              sport={sport}
              limit={8}
              alwaysShowClemson
            />
          )}
        </div>
      </div>
    </div>
  );
}
