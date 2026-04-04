import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

export const metadata: Metadata = {
  title: `Women's Soccer Schedule 2025 | ${SITE_NAME}`,
  description: "Clemson Tigers Women's Soccer 2025 schedule with game times, opponents, and results.",
  openGraph: {
    title: `Women's Soccer Schedule 2025 | ${SITE_NAME}`,
    description: "Clemson Tigers Women's Soccer 2025 schedule with game times, opponents, and results.",
    type: "website",
    url: `${SITE_URL}/schedule/womens-soccer`,
  },
};

// Revalidate every hour
export const dynamic = "force-dynamic";

// Static schedule data for Women's Soccer 2025
interface ScheduleGame {
  id: string;
  date: string;
  time?: string;
  opponent: {
    name: string;
    logo: string;
    abbreviation: string;
    rank?: number;
  };
  isHome: boolean;
  venue: string;
  location: string;
  isConference: boolean;
  isExhibition?: boolean;
  isPostseason?: boolean;
  postseasonName?: string;
  result?: {
    win: boolean;
    tie?: boolean;
    score: string;
    overtime?: string;
  };
}

// ESPN team logo helper
const espnLogo = (id: number) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`;

const SCHEDULE_2025: ScheduleGame[] = [
  // Preseason Scrimmages
  {
    id: "ex-1",
    date: "2025-08-04",
    opponent: { name: "Alabama", abbreviation: "ALA", logo: espnLogo(333) },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: true,
  },
  {
    id: "ex-2",
    date: "2025-08-09",
    opponent: { name: "Tennessee", abbreviation: "TENN", logo: espnLogo(2633) },
    isHome: false,
    venue: "Regal Soccer Stadium",
    location: "Knoxville, Tenn.",
    isConference: false,
    isExhibition: true,
  },
  // Regular Season
  {
    id: "1",
    date: "2025-08-14",
    opponent: { name: "Ohio State", abbreviation: "OSU", logo: espnLogo(194), rank: 18 },
    isHome: false,
    venue: "Jesse Owens Memorial Stadium",
    location: "Columbus, Ohio",
    isConference: false,
    isExhibition: false,
    result: { win: false, tie: true, score: "1-1" },
  },
  {
    id: "2",
    date: "2025-08-17",
    opponent: { name: "Ohio", abbreviation: "OHIO", logo: espnLogo(195) },
    isHome: false,
    venue: "Chessa Field",
    location: "Athens, Ohio",
    isConference: false,
    isExhibition: false,
    result: { win: true, score: "1-0" },
  },
  {
    id: "3",
    date: "2025-08-21",
    opponent: { name: "Virginia Tech", abbreviation: "VT", logo: espnLogo(259), rank: 15 },
    isHome: false,
    venue: "Thompson Field",
    location: "Blacksburg, Va.",
    isConference: false,
    isExhibition: false,
    result: { win: false, score: "0-4" },
  },
  {
    id: "4",
    date: "2025-08-28",
    opponent: { name: "South Carolina", abbreviation: "SC", logo: espnLogo(2579), rank: 12 },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, tie: true, score: "0-0" },
  },
  {
    id: "5",
    date: "2025-08-31",
    opponent: { name: "Appalachian State", abbreviation: "APP", logo: espnLogo(2026) },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: true, score: "3-0" },
  },
  {
    id: "6",
    date: "2025-09-04",
    opponent: { name: "Charlotte", abbreviation: "CLT", logo: espnLogo(2429) },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: true, score: "2-0" },
  },
  {
    id: "7",
    date: "2025-09-07",
    opponent: { name: "Georgia", abbreviation: "UGA", logo: espnLogo(61), rank: 15 },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: false, tie: true, score: "1-1" },
  },
  {
    id: "8",
    date: "2025-09-11",
    opponent: { name: "Stanford", abbreviation: "STAN", logo: espnLogo(24), rank: 3 },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, tie: true, score: "2-2" },
  },
  {
    id: "9",
    date: "2025-09-14",
    opponent: { name: "California", abbreviation: "CAL", logo: espnLogo(25) },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, tie: true, score: "2-2" },
  },
  {
    id: "10",
    date: "2025-09-19",
    opponent: { name: "Louisville", abbreviation: "LOU", logo: espnLogo(97) },
    isHome: false,
    venue: "Lynn Stadium",
    location: "Louisville, Ky.",
    isConference: true,
    isExhibition: false,
    result: { win: false, score: "0-1" },
  },
  {
    id: "11",
    date: "2025-09-25",
    opponent: { name: "Virginia", abbreviation: "UVA", logo: espnLogo(258), rank: 1 },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, score: "0-3" },
  },
  {
    id: "12",
    date: "2025-09-28",
    opponent: { name: "Notre Dame", abbreviation: "ND", logo: espnLogo(87), rank: 2 },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, score: "1-5" },
  },
  {
    id: "13",
    date: "2025-10-05",
    opponent: { name: "Syracuse", abbreviation: "SYR", logo: espnLogo(183) },
    isHome: false,
    venue: "SU Soccer Stadium",
    location: "Syracuse, N.Y.",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "2-1" },
  },
  {
    id: "14",
    date: "2025-10-09",
    opponent: { name: "SMU", abbreviation: "SMU", logo: espnLogo(2567) },
    isHome: false,
    venue: "Washburne Soccer & Track Stadium",
    location: "Dallas, Texas",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "3-2" },
  },
  {
    id: "15",
    date: "2025-10-16",
    opponent: { name: "Wake Forest", abbreviation: "WAKE", logo: espnLogo(154), rank: 17 },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "1-0" },
  },
  {
    id: "16",
    date: "2025-10-24",
    opponent: { name: "Boston College", abbreviation: "BC", logo: espnLogo(103) },
    isHome: false,
    venue: "Newton Campus Field",
    location: "Boston, Mass.",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "1-0" },
  },
  {
    id: "17",
    date: "2025-10-30",
    opponent: { name: "Duke", abbreviation: "DUKE", logo: espnLogo(150), rank: 10 },
    isHome: false,
    venue: "Koskinen Stadium",
    location: "Durham, N.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, score: "2-3" },
  },
  // NCAA Tournament
  {
    id: "18",
    date: "2025-11-14",
    opponent: { name: "Liberty", abbreviation: "LIB", logo: espnLogo(2335) },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    isPostseason: true,
    postseasonName: "NCAA Round 1",
    result: { win: true, score: "2-1" },
  },
  {
    id: "19",
    date: "2025-11-21",
    opponent: { name: "Vanderbilt", abbreviation: "VAN", logo: espnLogo(238) },
    isHome: false,
    venue: "Vanderbilt Soccer Stadium",
    location: "Nashville, Tenn.",
    isConference: false,
    isExhibition: false,
    isPostseason: true,
    postseasonName: "NCAA Round 2",
    result: { win: false, score: "2-3", overtime: "2OT" },
  },
];

export default function WomensSoccerSchedulePage() {
  // Separate games by category
  const exhibitions = SCHEDULE_2025.filter((g) => g.isExhibition);
  const regularSeason = SCHEDULE_2025.filter((g) => !g.isExhibition && !g.isPostseason);
  const postseason = SCHEDULE_2025.filter((g) => g.isPostseason);

  return (
    <>
      <BodyClass className="page-schedule" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Schedule", url: `${SITE_URL}/schedule` },
          { name: "Women's Soccer", url: `${SITE_URL}/schedule/womens-soccer` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[var(--clemson-dark-purple)] pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/hero-soccer.jpg')" }}
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
              Soccer
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              2025 Women&apos;s Soccer Schedule
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
              <span className="text-[var(--clemson-orange)]">Women&apos;s Soccer</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-8 md:py-12 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1150px]">
          <div className="space-y-12">
            {/* Preseason/Exhibition */}
            {exhibitions.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                  Preseason
                </h2>
                <div className="space-y-3">
                  {exhibitions.map((game) => (
                    <ScheduleRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Season */}
            {regularSeason.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                  Regular Season
                </h2>
                <div className="space-y-3">
                  {regularSeason.map((game) => (
                    <ScheduleRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}

            {/* Postseason */}
            {postseason.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                  NCAA Tournament
                </h2>
                <div className="space-y-3">
                  {postseason.map((game) => (
                    <ScheduleRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data source note */}
      <section className="pb-8 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1150px]">
          <p className="text-center text-xs text-gray-400">
            Schedule data from clemsontigers.com. * denotes ACC game.
          </p>
        </div>
      </section>
    </>
  );
}

function ScheduleRow({ game }: { game: ScheduleGame }) {
  const gameDate = new Date(game.date);
  const isCompleted = !!game.result;
  const isWin = game.result?.win;
  const isTie = game.result?.tie;

  // Format date components
  const month = gameDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = gameDate.getDate();

  // Format time or use TBD
  const timeStr = game.time || "TBD";

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
              isWin ? "text-emerald-600" : isTie ? "text-gray-600" : "text-rose-600"
            )}>
              {isWin ? "W" : isTie ? "T" : "L"} {game.result?.score}
              {game.result?.overtime && ` (${game.result.overtime})`}
            </span>
          ) : (
            <span className="text-lg md:text-2xl font-bold text-gray-800">
              {timeStr}
            </span>
          )}
          {!game.isHome && (
            <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">
              ({game.location})
            </span>
          )}
        </div>

        {/* Team Name and Tags */}
        <div className="hidden md:flex ml-auto items-center gap-2">
          {game.opponent.rank && (
            <span className="text-xs bg-gray-800 text-white px-1.5 py-0.5 rounded font-bold">
              #{game.opponent.rank}
            </span>
          )}
          <span className="font-heading text-lg lg:text-xl font-bold text-gray-800 truncate max-w-[250px]">
            {game.opponent.name}
            {game.isConference && "*"}
          </span>
          {game.isExhibition && (
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">
              Exhibition
            </span>
          )}
          {game.isPostseason && (
            <span className="text-xs bg-[var(--clemson-orange)] text-white px-2 py-0.5 rounded font-medium">
              {game.postseasonName}
            </span>
          )}
        </div>
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
            {game.opponent.abbreviation}
          </span>
        )}
      </div>
    </div>
  );
}
