import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRosterByGroup, getSimpleRoster } from "@/lib/espn";
import type { SportType, SimpleRosterPlayer } from "@/lib/espn-types";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

// Available years for roster selection
const AVAILABLE_YEARS = ["2024", "2025", "2026"];

// Sport slug to SportType mapping
const SPORT_SLUG_MAP: Record<string, SportType> = {
  football: "football",
  "mens-basketball": "mensBasketball",
  baseball: "baseball",
};

// Sport display names and configurations
const SPORT_CONFIG: Record<
  string,
  {
    displayName: string;
    shortName: string;
    heroImage: string;
    watermark: string;
    useGroups: boolean;
    positionGroupOrder: string[];
    positionGroupNames: Record<string, string>;
  }
> = {
  football: {
    displayName: "Football",
    shortName: "Football",
    heroImage: "/images/hero-football.jpg",
    watermark: "Football",
    useGroups: true,
    positionGroupOrder: ["offense", "defense", "specialTeam", "special teams"],
    positionGroupNames: {
      offense: "Offense",
      defense: "Defense",
      specialTeam: "Special Teams",
      "special teams": "Special Teams",
    },
  },
  "mens-basketball": {
    displayName: "Men's Basketball",
    shortName: "Men's Basketball",
    heroImage: "/images/hero-basketball.jpg",
    watermark: "Basketball",
    useGroups: false,
    positionGroupOrder: [],
    positionGroupNames: {},
  },
  baseball: {
    displayName: "Baseball",
    shortName: "Baseball",
    heroImage: "/images/hero-baseball.jpg",
    watermark: "Baseball",
    useGroups: true,
    positionGroupOrder: [
      "pitchers",
      "catchers",
      "infielders",
      "outfielders",
      "designated hitters",
    ],
    positionGroupNames: {
      pitchers: "Pitchers",
      catchers: "Catchers",
      infielders: "Infielders",
      outfielders: "Outfielders",
      "designated hitters": "Designated Hitters",
    },
  },
};

// Revalidate every hour
export const revalidate = 3600;

interface PageParams {
  year: string;
  sport: string;
}

// Generate static params for all year/sport combinations
export async function generateStaticParams() {
  const sports = Object.keys(SPORT_SLUG_MAP);
  return AVAILABLE_YEARS.flatMap((year) =>
    sports.map((sport) => ({ year, sport }))
  );
}

// Generate metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { year, sport } = await params;
  const config = SPORT_CONFIG[sport];

  if (!config) {
    return { title: "Not Found" };
  }

  return {
    title: `${year} ${config.displayName} Roster | ${SITE_NAME}`,
    description: `Clemson Tigers ${year} ${config.displayName} roster with player photos, positions, heights, weights, and class information.`,
    openGraph: {
      title: `${year} ${config.displayName} Roster | ${SITE_NAME}`,
      description: `Clemson Tigers ${year} ${config.displayName} roster with player photos, positions, heights, weights, and class information.`,
      type: "website",
      url: `${SITE_URL}/roster/${year}/${sport}`,
    },
  };
}

export default async function RosterPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { year, sport } = await params;

  // Validate sport slug
  const sportType = SPORT_SLUG_MAP[sport];
  const config = SPORT_CONFIG[sport];

  if (!sportType || !config) {
    notFound();
  }

  // Validate year
  if (!AVAILABLE_YEARS.includes(year)) {
    notFound();
  }

  const seasonYear = parseInt(year, 10);

  let rosterGroups: Record<string, SimpleRosterPlayer[]> = {};
  let players: SimpleRosterPlayer[] = [];

  try {
    if (config.useGroups) {
      rosterGroups = await getRosterByGroup(sportType, seasonYear);
    } else {
      players = await getSimpleRoster(sportType, seasonYear);
    }
  } catch (error) {
    console.error(`Failed to fetch ${sport} roster for ${year}:`, error);
  }

  // Sort groups by defined order for this sport
  const sortedGroupNames = config.useGroups
    ? Object.keys(rosterGroups).sort((a, b) => {
        const aIndex = config.positionGroupOrder.indexOf(a.toLowerCase());
        const bIndex = config.positionGroupOrder.indexOf(b.toLowerCase());
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      })
    : [];

  // Sort players by jersey number (for basketball/baseball)
  const sortedPlayers = [...players].sort((a, b) => {
    const aNum = parseInt(a.jersey || "999", 10);
    const bNum = parseInt(b.jersey || "999", 10);
    return aNum - bNum;
  });

  const hasPlayers = config.useGroups
    ? Object.values(rosterGroups).some((group) => group.length > 0)
    : sortedPlayers.length > 0;

  return (
    <>
      <BodyClass className="page-roster" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Roster", url: `${SITE_URL}/roster` },
          { name: config.displayName, url: `${SITE_URL}/roster/${year}/${sport}` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[var(--clemson-dark-purple)] pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${config.heroImage}')` }}
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
              {config.watermark}
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              {year} {config.displayName} Roster
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Year Selector */}
            <YearSelector currentYear={year} sport={sport} />

            {/* Breadcrumb */}
            <nav className="text-base md:text-lg text-gray-300 uppercase mt-4">
              <Link
                href="/"
                className="text-white hover:text-[var(--clemson-orange)]"
              >
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-400">Roster</span>
              <span className="mx-2">/</span>
              <span className="text-[var(--clemson-orange)]">
                {config.shortName}
              </span>
            </nav>
          </div>
        </div>
      </section>

      {/* Roster Section */}
      <section className="py-8 md:py-12 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1200px]">
          {hasPlayers ? (
            config.useGroups ? (
              // Grouped roster (football)
              <div className="space-y-12">
                {sortedGroupNames.map((groupName) => {
                  const groupPlayers = rosterGroups[groupName];
                  if (!groupPlayers || groupPlayers.length === 0) return null;

                  // Sort players by jersey number
                  const sortedGroupPlayers = [...groupPlayers].sort((a, b) => {
                    const aNum = parseInt(a.jersey || "999", 10);
                    const bNum = parseInt(b.jersey || "999", 10);
                    return aNum - bNum;
                  });

                  return (
                    <div key={groupName}>
                      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                        {config.positionGroupNames[groupName.toLowerCase()] ||
                          groupName}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sortedGroupPlayers.map((player) => (
                          <PlayerCard key={player.id} player={player} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Flat roster (basketball/baseball)
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedPlayers.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {year} roster not available. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Data source note */}
      <section className="pb-8 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1200px]">
          <p className="text-center text-xs text-gray-400">
            Roster provided by ESPN. Data refreshes every hour.
          </p>
        </div>
      </section>
    </>
  );
}

function YearSelector({
  currentYear,
  sport,
}: {
  currentYear: string;
  sport: string;
}) {
  return (
    <div className="flex justify-center gap-2 mb-2">
      {AVAILABLE_YEARS.map((year) => {
        const isActive = year === currentYear;
        return (
          <Link
            key={year}
            href={`/roster/${year}/${sport}`}
            className={`
              px-4 py-2 rounded-full text-sm font-bold transition-all duration-200
              ${
                isActive
                  ? "bg-[var(--clemson-orange)] text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
          >
            {year}
          </Link>
        );
      })}
    </div>
  );
}

function PlayerCard({ player }: { player: SimpleRosterPlayer }) {
  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="flex items-center p-4 gap-4">
        {/* Player Photo */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
          {player.headshot ? (
            <Image
              src={player.headshot}
              alt={player.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-bold text-lg text-gray-900 truncate">
              {player.name}
            </span>
            {player.jersey && (
              <span className="text-[var(--clemson-orange)] font-bold text-lg">
                #{player.jersey}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--clemson-purple)] font-medium">
            {player.position}
          </p>
          <p className="text-xs text-gray-500">
            {[player.height, player.weight, player.experience]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>
      </div>
    </div>
  );
}
