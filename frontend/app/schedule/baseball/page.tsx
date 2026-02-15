import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

export const metadata: Metadata = {
  title: `Baseball Schedule 2026 | ${SITE_NAME}`,
  description: "Clemson Tigers Baseball 2026 schedule with game times, opponents, and results.",
  openGraph: {
    title: `Baseball Schedule 2026 | ${SITE_NAME}`,
    description: "Clemson Tigers Baseball 2026 schedule with game times, opponents, and results.",
    type: "website",
    url: `${SITE_URL}/schedule/baseball`,
  },
};

// Revalidate every hour
export const revalidate = 3600;

// Static schedule data for Baseball 2026
interface ScheduleGame {
  id: string;
  date: string;
  time: string;
  opponent: {
    name: string;
    logo: string;
    abbreviation: string;
  };
  isHome: boolean;
  isNeutral?: boolean;
  venue: string;
  location: string;
  isConference: boolean;
  result?: {
    win: boolean;
    score: string;
  };
}

// ESPN team logo helper
const espnLogo = (id: number) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`;

const SCHEDULE_2026: ScheduleGame[] = [
  // February
  {
    id: "1",
    date: "2026-02-13",
    time: "4:00 PM",
    opponent: { name: "Army West Point", abbreviation: "ARMY", logo: espnLogo(349) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "2",
    date: "2026-02-14",
    time: "2:00 PM",
    opponent: { name: "Army West Point", abbreviation: "ARMY", logo: espnLogo(349) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "3",
    date: "2026-02-15",
    time: "12:00 PM",
    opponent: { name: "Army West Point", abbreviation: "ARMY", logo: espnLogo(349) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "4",
    date: "2026-02-17",
    time: "4:00 PM",
    opponent: { name: "Charlotte", abbreviation: "CLT", logo: espnLogo(2429) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "5",
    date: "2026-02-20",
    time: "4:00 PM",
    opponent: { name: "Bryant", abbreviation: "BRY", logo: espnLogo(2803) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "6",
    date: "2026-02-21",
    time: "2:00 PM",
    opponent: { name: "Bryant", abbreviation: "BRY", logo: espnLogo(2803) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "7",
    date: "2026-02-22",
    time: "1:00 PM",
    opponent: { name: "Bryant", abbreviation: "BRY", logo: espnLogo(2803) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "8",
    date: "2026-02-24",
    time: "4:00 PM",
    opponent: { name: "Presbyterian", abbreviation: "PC", logo: espnLogo(2506) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "9",
    date: "2026-02-27",
    time: "7:00 PM",
    opponent: { name: "South Carolina", abbreviation: "SC", logo: espnLogo(2579) },
    isHome: false,
    venue: "Founders Park",
    location: "Columbia, S.C.",
    isConference: false,
  },
  {
    id: "10",
    date: "2026-02-28",
    time: "3:00 PM",
    opponent: { name: "South Carolina", abbreviation: "SC", logo: espnLogo(2579) },
    isHome: false,
    isNeutral: true,
    venue: "Segra Park",
    location: "Columbia, S.C.",
    isConference: false,
  },
  // March
  {
    id: "11",
    date: "2026-03-01",
    time: "3:00 PM",
    opponent: { name: "South Carolina", abbreviation: "SC", logo: espnLogo(2579) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "12",
    date: "2026-03-04",
    time: "6:00 PM",
    opponent: { name: "Michigan State", abbreviation: "MSU", logo: espnLogo(127) },
    isHome: false,
    isNeutral: true,
    venue: "Fluor Field",
    location: "Greenville, S.C.",
    isConference: false,
  },
  {
    id: "13",
    date: "2026-03-06",
    time: "4:00 PM",
    opponent: { name: "La Salle", abbreviation: "LAS", logo: espnLogo(2325) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "14",
    date: "2026-03-07",
    time: "12:00 PM",
    opponent: { name: "La Salle", abbreviation: "LAS", logo: espnLogo(2325) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "15",
    date: "2026-03-07",
    time: "4:00 PM",
    opponent: { name: "La Salle", abbreviation: "LAS", logo: espnLogo(2325) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "16",
    date: "2026-03-08",
    time: "1:00 PM",
    opponent: { name: "La Salle", abbreviation: "LAS", logo: espnLogo(2325) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "17",
    date: "2026-03-10",
    time: "6:30 PM",
    opponent: { name: "Georgia Southern", abbreviation: "GASO", logo: espnLogo(290) },
    isHome: false,
    isNeutral: true,
    venue: "SRP Park",
    location: "North Augusta, S.C.",
    isConference: false,
  },
  {
    id: "18",
    date: "2026-03-12",
    time: "7:00 PM",
    opponent: { name: "Georgia Tech", abbreviation: "GT", logo: espnLogo(59) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "19",
    date: "2026-03-13",
    time: "8:00 PM",
    opponent: { name: "Georgia Tech", abbreviation: "GT", logo: espnLogo(59) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "20",
    date: "2026-03-14",
    time: "3:00 PM",
    opponent: { name: "Georgia Tech", abbreviation: "GT", logo: espnLogo(59) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "21",
    date: "2026-03-17",
    time: "6:00 PM",
    opponent: { name: "College of Charleston", abbreviation: "COFC", logo: espnLogo(232) },
    isHome: false,
    venue: "Patriots Point Stadium",
    location: "Mount Pleasant, S.C.",
    isConference: false,
  },
  {
    id: "22",
    date: "2026-03-18",
    time: "7:00 PM",
    opponent: { name: "The Citadel", abbreviation: "CIT", logo: espnLogo(2643) },
    isHome: false,
    venue: "Joseph P. Riley Jr. Park",
    location: "Charleston, S.C.",
    isConference: false,
  },
  {
    id: "23",
    date: "2026-03-20",
    time: "4:30 PM",
    opponent: { name: "Notre Dame", abbreviation: "ND", logo: espnLogo(87) },
    isHome: false,
    venue: "Frank Eck Stadium",
    location: "Notre Dame, Ind.",
    isConference: true,
  },
  {
    id: "24",
    date: "2026-03-21",
    time: "2:00 PM",
    opponent: { name: "Notre Dame", abbreviation: "ND", logo: espnLogo(87) },
    isHome: false,
    venue: "Frank Eck Stadium",
    location: "Notre Dame, Ind.",
    isConference: true,
  },
  {
    id: "25",
    date: "2026-03-22",
    time: "1:00 PM",
    opponent: { name: "Notre Dame", abbreviation: "ND", logo: espnLogo(87) },
    isHome: false,
    venue: "Frank Eck Stadium",
    location: "Notre Dame, Ind.",
    isConference: true,
  },
  {
    id: "26",
    date: "2026-03-24",
    time: "7:00 PM",
    opponent: { name: "Coastal Carolina", abbreviation: "CCU", logo: espnLogo(324) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "27",
    date: "2026-03-26",
    time: "7:00 PM",
    opponent: { name: "Miami", abbreviation: "MIA", logo: espnLogo(2390) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "28",
    date: "2026-03-27",
    time: "8:00 PM",
    opponent: { name: "Miami", abbreviation: "MIA", logo: espnLogo(2390) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "29",
    date: "2026-03-28",
    time: "3:00 PM",
    opponent: { name: "Miami", abbreviation: "MIA", logo: espnLogo(2390) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  // April
  {
    id: "30",
    date: "2026-04-01",
    time: "6:30 PM",
    opponent: { name: "Wake Forest", abbreviation: "WAKE", logo: espnLogo(154) },
    isHome: false,
    isNeutral: true,
    venue: "Truist Field",
    location: "Charlotte, N.C.",
    isConference: false,
  },
  {
    id: "31",
    date: "2026-04-03",
    time: "9:05 PM",
    opponent: { name: "Stanford", abbreviation: "STAN", logo: espnLogo(24) },
    isHome: false,
    venue: "Klein Field at Sunken Diamond",
    location: "Stanford, Calif.",
    isConference: true,
  },
  {
    id: "32",
    date: "2026-04-04",
    time: "5:05 PM",
    opponent: { name: "Stanford", abbreviation: "STAN", logo: espnLogo(24) },
    isHome: false,
    venue: "Klein Field at Sunken Diamond",
    location: "Stanford, Calif.",
    isConference: true,
  },
  {
    id: "33",
    date: "2026-04-05",
    time: "4:05 PM",
    opponent: { name: "Stanford", abbreviation: "STAN", logo: espnLogo(24) },
    isHome: false,
    venue: "Klein Field at Sunken Diamond",
    location: "Stanford, Calif.",
    isConference: true,
  },
  {
    id: "34",
    date: "2026-04-06",
    time: "9:00 PM",
    opponent: { name: "Santa Clara", abbreviation: "SCU", logo: espnLogo(2541) },
    isHome: false,
    venue: "Stephen Schott Stadium",
    location: "Santa Clara, Calif.",
    isConference: false,
  },
  {
    id: "35",
    date: "2026-04-10",
    time: "6:00 PM",
    opponent: { name: "North Carolina", abbreviation: "UNC", logo: espnLogo(153) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "36",
    date: "2026-04-11",
    time: "2:00 PM",
    opponent: { name: "North Carolina", abbreviation: "UNC", logo: espnLogo(153) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "37",
    date: "2026-04-12",
    time: "12:30 PM",
    opponent: { name: "North Carolina", abbreviation: "UNC", logo: espnLogo(153) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "38",
    date: "2026-04-14",
    time: "6:05 PM",
    opponent: { name: "Charlotte", abbreviation: "CLT", logo: espnLogo(2429) },
    isHome: false,
    venue: "Truist Field",
    location: "Charlotte, N.C.",
    isConference: false,
  },
  {
    id: "39",
    date: "2026-04-16",
    time: "7:00 PM",
    opponent: { name: "Virginia", abbreviation: "UVA", logo: espnLogo(258) },
    isHome: false,
    venue: "Disharoon Park",
    location: "Charlottesville, Va.",
    isConference: true,
  },
  {
    id: "40",
    date: "2026-04-17",
    time: "6:00 PM",
    opponent: { name: "Virginia", abbreviation: "UVA", logo: espnLogo(258) },
    isHome: false,
    venue: "Disharoon Park",
    location: "Charlottesville, Va.",
    isConference: true,
  },
  {
    id: "41",
    date: "2026-04-18",
    time: "1:00 PM",
    opponent: { name: "Virginia", abbreviation: "UVA", logo: espnLogo(258) },
    isHome: false,
    venue: "Disharoon Park",
    location: "Charlottesville, Va.",
    isConference: true,
  },
  {
    id: "42",
    date: "2026-04-21",
    time: "7:00 PM",
    opponent: { name: "USC Upstate", abbreviation: "UPST", logo: espnLogo(2908) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: false,
  },
  {
    id: "43",
    date: "2026-04-24",
    time: "6:00 PM",
    opponent: { name: "Louisville", abbreviation: "LOU", logo: espnLogo(97) },
    isHome: false,
    venue: "Jim Patterson Stadium",
    location: "Louisville, Ky.",
    isConference: true,
  },
  {
    id: "44",
    date: "2026-04-25",
    time: "2:00 PM",
    opponent: { name: "Louisville", abbreviation: "LOU", logo: espnLogo(97) },
    isHome: false,
    venue: "Jim Patterson Stadium",
    location: "Louisville, Ky.",
    isConference: true,
  },
  {
    id: "45",
    date: "2026-04-26",
    time: "2:00 PM",
    opponent: { name: "Louisville", abbreviation: "LOU", logo: espnLogo(97) },
    isHome: false,
    venue: "Jim Patterson Stadium",
    location: "Louisville, Ky.",
    isConference: true,
  },
  // May
  {
    id: "46",
    date: "2026-05-01",
    time: "6:00 PM",
    opponent: { name: "Boston College", abbreviation: "BC", logo: espnLogo(103) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "47",
    date: "2026-05-02",
    time: "2:00 PM",
    opponent: { name: "Boston College", abbreviation: "BC", logo: espnLogo(103) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "48",
    date: "2026-05-03",
    time: "1:00 PM",
    opponent: { name: "Boston College", abbreviation: "BC", logo: espnLogo(103) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "49",
    date: "2026-05-05",
    time: "6:00 PM",
    opponent: { name: "Coastal Carolina", abbreviation: "CCU", logo: espnLogo(324) },
    isHome: false,
    venue: "Springs Brooks Stadium",
    location: "Conway, S.C.",
    isConference: false,
  },
  {
    id: "50",
    date: "2026-05-08",
    time: "6:00 PM",
    opponent: { name: "Florida State", abbreviation: "FSU", logo: espnLogo(52) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "51",
    date: "2026-05-09",
    time: "6:00 PM",
    opponent: { name: "Florida State", abbreviation: "FSU", logo: espnLogo(52) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "52",
    date: "2026-05-10",
    time: "3:00 PM",
    opponent: { name: "Florida State", abbreviation: "FSU", logo: espnLogo(52) },
    isHome: true,
    venue: "Doug Kingsmore Stadium",
    location: "Clemson, S.C.",
    isConference: true,
  },
  {
    id: "53",
    date: "2026-05-12",
    time: "6:00 PM",
    opponent: { name: "USC Upstate", abbreviation: "UPST", logo: espnLogo(2908) },
    isHome: false,
    venue: "Fifth Third Park",
    location: "Spartanburg, S.C.",
    isConference: false,
  },
  {
    id: "54",
    date: "2026-05-14",
    time: "6:00 PM",
    opponent: { name: "Virginia Tech", abbreviation: "VT", logo: espnLogo(259) },
    isHome: false,
    venue: "English Field at Atlantic Union Bank Park",
    location: "Blacksburg, Va.",
    isConference: true,
  },
  {
    id: "55",
    date: "2026-05-15",
    time: "3:00 PM",
    opponent: { name: "Virginia Tech", abbreviation: "VT", logo: espnLogo(259) },
    isHome: false,
    venue: "English Field at Atlantic Union Bank Park",
    location: "Blacksburg, Va.",
    isConference: true,
  },
  {
    id: "56",
    date: "2026-05-16",
    time: "1:00 PM",
    opponent: { name: "Virginia Tech", abbreviation: "VT", logo: espnLogo(259) },
    isHome: false,
    venue: "English Field at Atlantic Union Bank Park",
    location: "Blacksburg, Va.",
    isConference: true,
  },
];

export default function BaseballSchedulePage() {
  const now = new Date();
  const upcomingGames = SCHEDULE_2026.filter((g) => new Date(g.date) > now);
  const pastGames = SCHEDULE_2026.filter((g) => new Date(g.date) <= now && g.result).reverse();

  return (
    <>
      <BodyClass className="page-schedule" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Schedule", url: `${SITE_URL}/schedule` },
          { name: "Baseball", url: `${SITE_URL}/schedule/baseball` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[var(--clemson-dark-purple)] pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/hero-baseball.jpg')" }}
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
              Baseball
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              2026 Baseball Schedule
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
              <span className="text-[var(--clemson-orange)]">Baseball</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-8 md:py-12 bg-gray-100">
        <div className="mx-auto px-4 max-w-[1150px]">
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

            {/* Past Games / Results */}
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

  // Format date components
  const month = gameDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = gameDate.getDate();

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
          game.isNeutral ? "text-gray-500" : game.isHome ? "text-[var(--clemson-orange)]" : "text-[var(--clemson-purple)]"
        )}>
          {game.isNeutral ? "N" : game.isHome ? "VS" : "@"}
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
              {game.time}
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
