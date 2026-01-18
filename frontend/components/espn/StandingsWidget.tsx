import { cn } from "@/lib/utils";
import Image from "next/image";
import { SPORT_NAMES, CLEMSON_TEAM_ID } from "@/lib/espn";
import type { SimpleStanding, SportType } from "@/lib/espn-types";

interface StandingsWidgetProps {
  standings: SimpleStanding[];
  sport: SportType;
  /** Custom title (default: "ACC Standings") */
  title?: string;
  /** Show only top N teams (default: show all) */
  limit?: number;
  /** Always show Clemson even if outside limit */
  alwaysShowClemson?: boolean;
  className?: string;
}

/**
 * Standings widget displaying ACC conference standings
 *
 * Highlights Clemson's position with orange accent
 */
export function StandingsWidget({
  standings,
  sport,
  title,
  limit,
  alwaysShowClemson = true,
  className,
}: StandingsWidgetProps) {
  const defaultTitle = `ACC ${SPORT_NAMES[sport]} Standings`;

  if (standings.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
        <h3 className="font-heading text-lg text-[var(--clemson-purple)] mb-4">
          {title || defaultTitle}
        </h3>
        <p className="text-gray-500 text-sm">Standings not available</p>
      </div>
    );
  }

  // Apply limit while keeping Clemson visible
  let displayStandings = standings;
  let clemsonStanding: SimpleStanding | undefined;
  let showClemsonSeparately = false;

  if (limit && standings.length > limit) {
    displayStandings = standings.slice(0, limit);
    clemsonStanding = standings.find((s) => s.isClemson);

    if (alwaysShowClemson && clemsonStanding && clemsonStanding.rank > limit) {
      showClemsonSeparately = true;
    }
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-[var(--clemson-purple)] px-4 py-3">
        <h3 className="font-heading text-white text-lg">
          {title || defaultTitle}
        </h3>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
              <th className="px-4 py-2 text-left w-8">#</th>
              <th className="px-4 py-2 text-left">Team</th>
              <th className="px-4 py-2 text-center">W</th>
              <th className="px-4 py-2 text-center">L</th>
              <th className="px-4 py-2 text-center hidden sm:table-cell">Conf</th>
              <th className="px-4 py-2 text-center hidden md:table-cell">Strk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayStandings.map((standing) => (
              <StandingRow key={standing.team.id} standing={standing} />
            ))}
            {/* Show Clemson separately if outside limit */}
            {showClemsonSeparately && clemsonStanding && (
              <>
                <tr>
                  <td colSpan={6} className="px-4 py-1 text-center text-gray-400 text-xs">
                    • • •
                  </td>
                </tr>
                <StandingRow standing={clemsonStanding} />
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* View Full Standings Link */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <a
          href={`/standings/${sport}`}
          className="text-sm text-[var(--clemson-orange)] hover:underline font-medium"
        >
          View Full Standings →
        </a>
      </div>
    </div>
  );
}

interface StandingRowProps {
  standing: SimpleStanding;
}

function StandingRow({ standing }: StandingRowProps) {
  const isClemson = standing.team.id === CLEMSON_TEAM_ID;

  return (
    <tr
      className={cn(
        "hover:bg-gray-50 transition-colors",
        isClemson && "bg-orange-50 hover:bg-orange-100"
      )}
    >
      {/* Rank */}
      <td className="px-4 py-3 text-gray-600 font-medium">
        {standing.rank}
      </td>

      {/* Team */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {standing.team.logo && (
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src={standing.team.logo}
                alt={standing.team.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <span
            className={cn(
              "font-medium truncate",
              isClemson ? "text-[var(--clemson-orange)]" : "text-gray-900"
            )}
          >
            {standing.team.abbreviation || standing.team.name}
          </span>
        </div>
      </td>

      {/* Wins */}
      <td className="px-4 py-3 text-center font-medium text-gray-900">
        {standing.wins}
      </td>

      {/* Losses */}
      <td className="px-4 py-3 text-center font-medium text-gray-900">
        {standing.losses}
      </td>

      {/* Conference Record */}
      <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">
        {standing.conferenceWins}-{standing.conferenceLosses}
      </td>

      {/* Streak */}
      <td className="px-4 py-3 text-center hidden md:table-cell">
        {standing.streak && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded",
              standing.streak.startsWith("W")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {standing.streak}
          </span>
        )}
      </td>
    </tr>
  );
}
