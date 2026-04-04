import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

export const metadata: Metadata = {
  title: `Men's Soccer Schedule 2025-26 | ${SITE_NAME}`,
  description: "Clemson Tigers Men's Soccer 2025-26 schedule with game times, opponents, and results.",
  openGraph: {
    title: `Men's Soccer Schedule 2025-26 | ${SITE_NAME}`,
    description: "Clemson Tigers Men's Soccer 2025-26 schedule with game times, opponents, and results.",
    type: "website",
    url: `${SITE_URL}/schedule/mens-soccer`,
  },
};

// Revalidate every hour
export const dynamic = "force-dynamic";

// Static schedule data for Men's Soccer 2025-26
interface ScheduleGame {
  id: string;
  date: string;
  time?: string;
  opponent: {
    name: string;
    logo?: string;
    abbreviation: string;
  };
  isHome: boolean;
  venue: string;
  location: string;
  isConference: boolean;
  isExhibition: boolean;
  isPostseason?: boolean;
  postseasonName?: string;
  result?: {
    win: boolean;
    tie?: boolean;
    score: string;
  };
}

const SCHEDULE_2025_26: ScheduleGame[] = [
  // Fall 2025 - Exhibition Games
  {
    id: "ex-1",
    date: "2025-08-09",
    time: "6:00 PM",
    opponent: { name: "Charlotte", abbreviation: "CLT", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2429.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: true,
  },
  {
    id: "ex-2",
    date: "2025-08-12",
    time: "6:00 PM",
    opponent: { name: "USC Upstate", abbreviation: "UPST", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2908.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: true,
  },
  {
    id: "ex-3",
    date: "2025-08-16",
    time: "7:00 PM",
    opponent: { name: "Georgia State", abbreviation: "GAST", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2247.png" },
    isHome: false,
    venue: "GSU Soccer Field",
    location: "Atlanta, Ga.",
    isConference: false,
    isExhibition: true,
  },
  // Fall 2025 - Regular Season
  {
    id: "1",
    date: "2025-08-21",
    opponent: { name: "Indiana", abbreviation: "IND", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/84.png" },
    isHome: false,
    venue: "Jerry Yeagley Field",
    location: "Bloomington, Ind.",
    isConference: false,
    isExhibition: false,
    result: { win: false, tie: true, score: "2-2" },
  },
  {
    id: "2",
    date: "2025-08-26",
    opponent: { name: "South Carolina", abbreviation: "SC", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: true, score: "4-1" },
  },
  {
    id: "3",
    date: "2025-08-29",
    opponent: { name: "UAB", abbreviation: "UAB", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/5.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: true, score: "6-0" },
  },
  {
    id: "4",
    date: "2025-09-05",
    opponent: { name: "Pittsburgh", abbreviation: "PITT", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/221.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "3-2" },
  },
  {
    id: "5",
    date: "2025-09-09",
    opponent: { name: "VCU", abbreviation: "VCU", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2670.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: false, score: "1-2" },
  },
  {
    id: "6",
    date: "2025-09-13",
    opponent: { name: "SMU", abbreviation: "SMU", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2567.png" },
    isHome: false,
    venue: "Washburne Soccer & Track Stadium",
    location: "Dallas, Texas",
    isConference: true,
    isExhibition: false,
    result: { win: false, tie: true, score: "1-1" },
  },
  {
    id: "7",
    date: "2025-09-16",
    opponent: { name: "Queens", abbreviation: "QU", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/3101.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: false, score: "0-1" },
  },
  {
    id: "8",
    date: "2025-09-19",
    opponent: { name: "California", abbreviation: "CAL", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/25.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "3-1" },
  },
  {
    id: "9",
    date: "2025-09-26",
    opponent: { name: "Wake Forest", abbreviation: "WAKE", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/154.png" },
    isHome: false,
    venue: "Spry Stadium",
    location: "Winston-Salem, N.C.",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "4-3" },
  },
  {
    id: "10",
    date: "2025-10-04",
    opponent: { name: "Elon", abbreviation: "ELON", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2210.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: true, score: "1-0" },
  },
  {
    id: "11",
    date: "2025-10-10",
    opponent: { name: "NC State", abbreviation: "NCST", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/152.png" },
    isHome: false,
    venue: "Dail Soccer Field",
    location: "Raleigh, N.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, score: "0-1" },
  },
  {
    id: "12",
    date: "2025-10-17",
    opponent: { name: "Duke", abbreviation: "DUKE", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/150.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: true, score: "3-0" },
  },
  {
    id: "13",
    date: "2025-10-21",
    opponent: { name: "UNCW", abbreviation: "UNCW", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/350.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    result: { win: true, score: "6-0" },
  },
  {
    id: "14",
    date: "2025-10-25",
    opponent: { name: "Virginia", abbreviation: "UVA", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/258.png" },
    isHome: false,
    venue: "Klöckner Stadium",
    location: "Charlottesville, Va.",
    isConference: true,
    isExhibition: false,
    result: { win: false, score: "0-4" },
  },
  {
    id: "15",
    date: "2025-10-31",
    opponent: { name: "Virginia Tech", abbreviation: "VT", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/259.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    result: { win: false, tie: true, score: "3-3" },
  },
  // ACC Tournament
  {
    id: "16",
    date: "2025-11-05",
    opponent: { name: "Pittsburgh", abbreviation: "PITT", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/221.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: true,
    isExhibition: false,
    isPostseason: true,
    postseasonName: "ACC Tournament",
    result: { win: false, score: "0-1" },
  },
  // NCAA Tournament
  {
    id: "17",
    date: "2025-11-20",
    opponent: { name: "Western Michigan", abbreviation: "WMU", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2711.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: false,
    isPostseason: true,
    postseasonName: "NCAA Tournament",
    result: { win: false, score: "0-1" },
  },
  // Spring 2026
  {
    id: "sp-1",
    date: "2026-02-18",
    time: "7:00 PM",
    opponent: { name: "Portland Hearts of Pine", abbreviation: "PHP", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/22528.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: true,
  },
  {
    id: "sp-2",
    date: "2026-02-26",
    time: "7:00 PM",
    opponent: { name: "Furman", abbreviation: "FUR", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/231.png" },
    isHome: false,
    venue: "Stone Soccer Stadium",
    location: "Greenville, S.C.",
    isConference: false,
    isExhibition: true,
  },
  {
    id: "sp-3",
    date: "2026-03-07",
    time: "6:00 PM",
    opponent: { name: "Greenville Triumph", abbreviation: "GVL", logo: "https://a.espncdn.com/i/teamlogos/soccer/500/19964.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: true,
  },
  {
    id: "sp-4",
    date: "2026-03-28",
    time: "2:00 PM",
    opponent: { name: "Crown Legacy", abbreviation: "CLF", logo: "https://clemsontigers.com/wp-content/uploads/2026/01/Crown_Legacy_FC_logo.png" },
    isHome: false,
    venue: "Sportsplex at Matthews",
    location: "Matthews, N.C.",
    isConference: false,
    isExhibition: true,
  },
  {
    id: "sp-5",
    date: "2026-04-12",
    time: "2:00 PM",
    opponent: { name: "Presbyterian", abbreviation: "PC", logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/2506.png" },
    isHome: true,
    venue: "Historic Riggs Field",
    location: "Clemson, S.C.",
    isConference: false,
    isExhibition: true,
  },
];

export default function MensSoccerSchedulePage() {
  // Separate games by category
  const fallExhibition = SCHEDULE_2025_26.filter(g =>
    g.isExhibition && new Date(g.date).getFullYear() === 2025
  );

  const regularSeason = SCHEDULE_2025_26.filter(g =>
    !g.isExhibition && !g.isPostseason && new Date(g.date).getFullYear() === 2025
  );

  const postseason = SCHEDULE_2025_26.filter(g => g.isPostseason);

  const spring2026 = SCHEDULE_2025_26.filter(g =>
    new Date(g.date).getFullYear() === 2026
  );

  return (
    <>
      <BodyClass className="page-schedule" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Schedule", url: `${SITE_URL}/schedule` },
          { name: "Men's Soccer", url: `${SITE_URL}/schedule/mens-soccer` },
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
              2025-26 Men&apos;s Soccer Schedule
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
              <span className="text-[var(--clemson-orange)]">Men&apos;s Soccer</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-8 md:py-12 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1150px]">
          <div className="space-y-12">
            {/* Spring 2026 */}
            {spring2026.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                  Spring 2026
                </h2>
                <div className="space-y-3">
                  {spring2026.map((game) => (
                    <ScheduleRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}

            {/* Fall 2025 Exhibition */}
            {fallExhibition.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                  Fall 2025 Exhibition
                </h2>
                <div className="space-y-3">
                  {fallExhibition.map((game) => (
                    <ScheduleRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}

            {/* Fall 2025 Regular Season */}
            {regularSeason.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-[var(--clemson-purple)]">
                  Fall 2025 Regular Season
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
                  Postseason
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
