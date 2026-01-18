import type { Metadata } from "next";
import Link from "next/link";
import { getClemsonGame, SPORT_NAMES } from "@/lib/espn";
import type { SimpleGame, SportType } from "@/lib/espn-types";
import { ScoreCard } from "@/components/espn";
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

export default async function ScoresPage() {
  // Fetch all games in parallel
  const gamePromises = SPORTS_TO_SHOW.map(async (sport) => {
    try {
      const game = await getClemsonGame(sport);
      return { sport, game };
    } catch (error) {
      console.error(`Failed to fetch ${sport} game:`, error);
      return { sport, game: null };
    }
  });

  const results = await Promise.all(gamePromises);

  // Filter to only sports with games
  const gamesWithData = results.filter(
    (r): r is { sport: SportType; game: SimpleGame } => r.game !== null
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
          {gamesWithData.length > 0 ? (
            <div className="space-y-8 md:space-y-12">
              {gamesWithData.map(({ sport, game }) => (
                <div key={sport}>
                  <ScoreCard
                    game={game}
                    sport={sport}
                    title={`Clemson ${SPORT_NAMES[sport]} Scoreboard`}
                  />
                </div>
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
