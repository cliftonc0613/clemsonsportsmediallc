import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSchedule } from "@/lib/espn";
import type { SimpleScheduleGame } from "@/lib/espn-types";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

export const metadata: Metadata = {
  title: `Men's Basketball Schedule | ${SITE_NAME}`,
  description: "Clemson Tigers Men's Basketball schedule with game times, opponents, and results.",
  openGraph: {
    title: `Men's Basketball Schedule | ${SITE_NAME}`,
    description: "Clemson Tigers Men's Basketball schedule with game times, opponents, and results.",
    type: "website",
    url: `${SITE_URL}/schedule/mens-basketball`,
  },
};

// Revalidate every hour
export const revalidate = 3600;

// Transform schedule event to SimpleScheduleGame
function transformEvent(event: any): SimpleScheduleGame {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors || [];

  // Find Clemson and opponent
  const clemsonTeam = competitors.find((c: any) => c.team.id === "228");
  const opponentTeam = competitors.find((c: any) => c.team.id !== "228");

  const isHome = clemsonTeam?.homeAway === "home";
  // Status is in competition, not event
  const isCompleted = competition?.status?.type?.completed || event.status?.type?.completed;

  let result: SimpleScheduleGame["result"] | undefined;
  if (isCompleted && clemsonTeam && opponentTeam) {
    // Handle different ESPN score formats
    const clemsonScore = parseInt(
      clemsonTeam.score?.displayValue ||
      clemsonTeam.score?.value ||
      clemsonTeam.score ||
      "0",
      10
    );
    const opponentScore = parseInt(
      opponentTeam.score?.displayValue ||
      opponentTeam.score?.value ||
      opponentTeam.score ||
      "0",
      10
    );
    if (clemsonScore > 0 || opponentScore > 0) {
      result = {
        win: clemsonScore > opponentScore,
        score: `${clemsonScore}-${opponentScore}`,
      };
    }
  }

  return {
    id: event.id,
    date: event.date,
    opponent: {
      id: opponentTeam?.team?.id || "",
      name: opponentTeam?.team?.displayName || opponentTeam?.team?.name || "TBD",
      abbreviation: opponentTeam?.team?.abbreviation || "",
      displayName: opponentTeam?.team?.displayName || "TBD",
      logo: opponentTeam?.team?.logo || opponentTeam?.team?.logos?.[0]?.href,
      color: opponentTeam?.team?.color,
      record: opponentTeam?.records?.[0]?.summary,
      rank: opponentTeam?.curatedRank?.current,
    },
    isHome,
    result,
    venue: competition?.venue?.fullName,
    broadcasts: competition?.broadcasts?.[0]?.names || [],
    link: event.links?.[0]?.href,
  };
}

export default async function MensBasketballSchedulePage() {
  let games: SimpleScheduleGame[] = [];

  try {
    const schedule = await getSchedule("mensBasketball");
    if (schedule?.events) {
      games = schedule.events.map(transformEvent);
    }
  } catch (error) {
    console.error("Failed to fetch men's basketball schedule:", error);
  }

  const now = new Date();
  const upcomingGames = games.filter((g) => new Date(g.date) > now);
  const pastGames = games.filter((g) => new Date(g.date) <= now).reverse();

  return (
    <>
      <BodyClass className="page-schedule" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Schedule", url: `${SITE_URL}/schedule` },
          { name: "Men's Basketball", url: `${SITE_URL}/schedule/mens-basketball` },
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
              Basketball
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Men&apos;s Basketball Schedule
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Breadcrumb */}
            <nav className="text-base md:text-lg text-gray-300 uppercase">
              <Link href="/" className="text-white hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-400">Schedule</span>
              <span className="mx-2">/</span>
              <span className="text-[var(--clemson-orange)]">Men&apos;s Basketball</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-8 md:py-12 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1150px]">
          {games.length > 0 ? (
            <div className="space-y-12">
              {/* Upcoming Games */}
              {upcomingGames.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                    Upcoming Games
                  </h2>
                  <div className="space-y-3">
                    {upcomingGames.map((game) => (
                      <ScheduleRow key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Games */}
              {pastGames.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                    Results
                  </h2>
                  <div className="space-y-3">
                    {pastGames.map((game) => (
                      <ScheduleRow key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Schedule not available. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Data source note */}
      <section className="pb-8 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1150px]">
          <p className="text-center text-xs text-gray-400">
            Schedule provided by ESPN. Data refreshes every hour.
          </p>
        </div>
      </section>
    </>
  );
}

function ScheduleRow({ game }: { game: SimpleScheduleGame }) {
  const gameDate = new Date(game.date);
  const isCompleted = !!game.result;
  const isWin = game.result?.win;

  // Format date components
  const month = gameDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = gameDate.getDate();

  // Format time
  const timeStr = gameDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toUpperCase();

  // Get city from venue for away games
  const getCity = (venue: string | undefined) => {
    if (!venue) return null;
    // Try to extract city, state from venue name
    const parts = venue.split(",");
    if (parts.length >= 2) {
      return parts.slice(-2).join(",").trim().toUpperCase();
    }
    return venue.split(" ").slice(-2).join(" ").toUpperCase();
  };

  return (
    <div className="group flex h-16 md:h-20 overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Left Side - White section with date/time */}
      <div className="flex-1 bg-white flex items-center px-4 md:px-6 gap-3 md:gap-6">
        {/* Date */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-2xl md:text-4xl font-bold text-gray-800 tracking-tight">
            {month} {day}
          </span>
        </div>

        {/* VS/@ indicator */}
        <span className={cn(
          "font-bold text-sm md:text-base",
          game.isHome ? "text-[var(--clemson-orange)]" : "text-[var(--clemson-purple)]"
        )}>
          {game.isHome ? "VS" : "@"}
        </span>

        {/* Time/Result and Location */}
        <div className="flex flex-col justify-center">
          {isCompleted ? (
            <span className={cn(
              "text-base md:text-lg font-black",
              isWin ? "text-emerald-600" : "text-rose-600"
            )}>
              {isWin ? "W" : "L"} {game.result?.score}
            </span>
          ) : (
            <span className="text-lg md:text-2xl font-bold text-gray-800">
              {timeStr}
            </span>
          )}
          {!game.isHome && game.venue && (
            <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">
              ({getCity(game.venue)})
            </span>
          )}
        </div>

        {/* Team Name */}
        <span className="hidden md:block ml-auto font-heading text-lg lg:text-xl font-bold text-gray-800 truncate max-w-[300px]">
          {game.opponent.displayName}
        </span>
      </div>

      {/* Right Side - Purple section with logo */}
      <div className="w-24 md:w-32 bg-[var(--clemson-purple)] flex items-center justify-center relative">
        {game.opponent.logo ? (
          <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform duration-300 group-hover:scale-110">
            <Image
              src={game.opponent.logo}
              alt={game.opponent.name}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <span className="text-white font-bold text-lg md:text-xl">
            {game.opponent.abbreviation || "TBD"}
          </span>
        )}
      </div>
    </div>
  );
}
