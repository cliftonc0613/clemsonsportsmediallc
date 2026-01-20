import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SimpleTeam } from "@/lib/espn-types";

interface TeamColumnProps {
  team: SimpleTeam;
  score?: number;
  isClemson: boolean;
  /** Whether scores should be shown (hidden for pre-game) */
  showScore?: boolean;
  className?: string;
}

/**
 * Displays a team's info in a vertical column:
 * - Team logo from ESPN
 * - Rank + Team Name (in team color)
 * - Record
 * - Score (large, in team color)
 */
export function TeamColumn({
  team,
  score,
  isClemson,
  showScore = true,
  className,
}: TeamColumnProps) {
  // Use Clemson orange for Clemson, opponent's color otherwise
  const teamColor = isClemson
    ? "var(--clemson-orange)"
    : team.color
      ? `#${team.color}`
      : "#333333";

  return (
    <div className={cn("flex-1 text-center", className)}>
      {/* Team Logo */}
      <div className="flex justify-center mb-4">
        {team.logo ? (
          <Image
            src={team.logo}
            alt={`${team.displayName} logo`}
            width={200}
            height={200}
            className="w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 object-contain"
          />
        ) : (
          <div
            className="w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-full flex items-center justify-center text-white font-heading font-bold text-2xl md:text-3xl lg:text-4xl shadow-lg"
            style={{ backgroundColor: teamColor }}
          >
            {team.abbreviation}
          </div>
        )}
      </div>

      {/* Rank + Team Name */}
      <div className="font-heading font-bold text-lg md:text-2xl lg:text-3xl uppercase">
        {team.rank && (
          <span className="text-gray-500 font-normal">#{team.rank} </span>
        )}
        <span style={{ color: teamColor }}>{team.name}</span>
      </div>

      {/* Record */}
      {team.record && (
        <div className="text-xs md:text-sm text-gray-500 mt-1">
          {team.record}
        </div>
      )}

      {/* Score */}
      {showScore && score !== undefined && (
        <div
          className="font-heading font-bold text-5xl md:text-6xl lg:text-8xl mt-4 md:mt-6"
          style={{ color: teamColor }}
          aria-label={`${team.displayName} score: ${score}`}
        >
          {score}
        </div>
      )}
    </div>
  );
}
