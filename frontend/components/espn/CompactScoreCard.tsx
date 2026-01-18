import { cn } from "@/lib/utils";
import Image from "next/image";
import { CLEMSON_TEAM_ID } from "@/lib/espn";
import type { SimpleGame, SportType } from "@/lib/espn-types";

interface CompactScoreCardProps {
  game: SimpleGame;
  sport: SportType;
  className?: string;
}

/**
 * Compact horizontal scoreboard - single row layout
 *
 * Layout: [Rank - TEAM] [Record] [Score] [Logo] | STATUS | [Logo] [Score] [TEAM] [Record]
 */
export function CompactScoreCard({
  game,
  sport,
  className,
}: CompactScoreCardProps) {
  const isPreGame = game.status.state === "pre";
  const isLive = game.status.state === "in";
  const isFinal = game.status.state === "post";
  const showScores = !isPreGame;

  // Check which team is Clemson
  const awayIsClemson = game.awayTeam.id === CLEMSON_TEAM_ID;
  const homeIsClemson = game.homeTeam.id === CLEMSON_TEAM_ID;

  // Determine winner for styling
  const awayWon = isFinal && (game.awayScore ?? 0) > (game.homeScore ?? 0);
  const homeWon = isFinal && (game.homeScore ?? 0) > (game.awayScore ?? 0);

  // Format record as [W-L, CW-CL]
  const formatRecord = (record: string | undefined) => {
    if (!record) return "";
    return `[${record.replace(/, /g, ", ")}]`;
  };

  // Get status display text
  const getStatusText = () => {
    if (isPreGame) {
      return game.status.detail || "Upcoming";
    }
    if (isLive) {
      return game.status.detail || "LIVE";
    }
    return "FINAL";
  };

  return (
    <div
      className={cn(
        "bg-[var(--clemson-dark-purple)] py-4 px-6 rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {/* Away Team Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Rank + Team Name + Record - hidden on mobile */}
          <div className="hidden md:block text-right">
            <div className="flex items-center justify-end gap-2">
              {game.awayTeam.rank && (
                <span className="text-gray-400 text-sm md:text-base">
                  {game.awayTeam.rank} -
                </span>
              )}
              <span
                className={cn(
                  "font-bold text-sm md:text-lg uppercase tracking-wide",
                  awayIsClemson
                    ? "text-[var(--clemson-orange)]"
                    : "text-white"
                )}
              >
                {game.awayTeam.abbreviation || game.awayTeam.name}
              </span>
            </div>
            <div className="text-gray-500 text-xs md:text-sm font-mono">
              {formatRecord(game.awayTeam.record)}
            </div>
          </div>

          {/* Away Score */}
          {showScores && (
            <span
              className={cn(
                "text-3xl md:text-5xl font-bold tabular-nums",
                awayWon ? "text-white" : "text-gray-400"
              )}
            >
              {game.awayScore}
            </span>
          )}

          {/* Away Team Logo */}
          {game.awayTeam.logo && (
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
              <Image
                src={game.awayTeam.logo}
                alt={game.awayTeam.name}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Center Status */}
        <div className="flex items-center gap-3 px-4">
          <span className="text-gray-600 text-2xl md:text-3xl font-light">]</span>
          <div className="text-center">
            <span
              className={cn(
                "text-xs md:text-sm font-bold uppercase tracking-widest",
                isLive ? "text-red-500" : "text-gray-400"
              )}
            >
              {getStatusText()}
            </span>
            {/* Accent line */}
            <div className="w-full h-0.5 bg-[var(--clemson-orange)] mt-1" />
          </div>
          <span className="text-gray-600 text-2xl md:text-3xl font-light">[</span>
        </div>

        {/* Home Team Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Home Team Logo */}
          {game.homeTeam.logo && (
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
              <Image
                src={game.homeTeam.logo}
                alt={game.homeTeam.name}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Home Score */}
          {showScores && (
            <span
              className={cn(
                "text-3xl md:text-5xl font-bold tabular-nums",
                homeWon ? "text-white" : "text-gray-400"
              )}
            >
              {game.homeScore}
            </span>
          )}

          {/* Team Name + Record - hidden on mobile */}
          <div className="hidden md:block text-left">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-bold text-sm md:text-lg uppercase tracking-wide",
                  homeIsClemson
                    ? "text-[var(--clemson-orange)]"
                    : "text-white"
                )}
              >
                {game.homeTeam.abbreviation || game.homeTeam.name}
              </span>
              {game.homeTeam.rank && (
                <span className="text-gray-400 text-sm md:text-base">
                  - {game.homeTeam.rank}
                </span>
              )}
            </div>
            <div className="text-gray-500 text-xs md:text-sm font-mono">
              {formatRecord(game.homeTeam.record)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
