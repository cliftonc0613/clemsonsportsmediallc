import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatGameDate, formatGameTime, SPORT_NAMES } from "@/lib/espn";
import type { SimpleScheduleGame, SportType } from "@/lib/espn-types";

interface ScheduleWidgetProps {
  games: SimpleScheduleGame[];
  sport: SportType;
  /** Custom title (default: "Upcoming Games") */
  title?: string;
  /** Show past results instead of upcoming */
  showResults?: boolean;
  className?: string;
}

/**
 * Schedule widget displaying upcoming games or recent results
 *
 * Shows up to 5 games with opponent, date/time, home/away indicator
 */
export function ScheduleWidget({
  games,
  sport,
  title,
  showResults = false,
  className,
}: ScheduleWidgetProps) {
  const defaultTitle = showResults
    ? `Recent ${SPORT_NAMES[sport]} Results`
    : `Upcoming ${SPORT_NAMES[sport]} Games`;

  if (games.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
        <h3 className="font-heading text-lg text-[var(--clemson-purple)] mb-4">
          {title || defaultTitle}
        </h3>
        <p className="text-gray-500 text-sm">No games scheduled</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-[var(--clemson-purple)] px-4 py-3">
        <h3 className="font-heading text-white text-lg">
          {title || defaultTitle}
        </h3>
      </div>

      {/* Game List */}
      <div className="divide-y divide-gray-100">
        {games.map((game) => (
          <ScheduleRow key={game.id} game={game} showResult={showResults} />
        ))}
      </div>

      {/* View Full Schedule Link */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <a
          href={`/schedule/${sport}`}
          className="text-sm text-[var(--clemson-orange)] hover:underline font-medium"
        >
          View Full Schedule →
        </a>
      </div>
    </div>
  );
}

interface ScheduleRowProps {
  game: SimpleScheduleGame;
  showResult: boolean;
}

function ScheduleRow({ game, showResult }: ScheduleRowProps) {
  const gameDate = new Date(game.date);
  const isPast = gameDate < new Date();

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
      {/* Date Column */}
      <div className="w-16 text-center flex-shrink-0">
        <div className="text-xs text-gray-500 uppercase">
          {formatGameDate(game.date).split(", ")[0]}
        </div>
        <div className="text-lg font-bold text-[var(--clemson-purple)]">
          {gameDate.getDate()}
        </div>
        <div className="text-xs text-gray-500">
          {gameDate.toLocaleDateString("en-US", { month: "short" })}
        </div>
      </div>

      {/* Opponent */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {game.opponent.logo && (
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={game.opponent.logo}
              alt={game.opponent.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase">
              {game.isHome ? "vs" : "@"}
            </span>
            <span className="font-medium text-gray-900 truncate">
              {game.opponent.displayName}
            </span>
          </div>
          {game.venue && (
            <div className="text-xs text-gray-500 truncate">
              {game.venue}
            </div>
          )}
        </div>
      </div>

      {/* Result or Time */}
      <div className="text-right flex-shrink-0">
        {showResult && game.result ? (
          <div className={cn(
            "font-bold",
            game.result.win ? "text-green-600" : "text-red-600"
          )}>
            {game.result.win ? "W" : "L"} {game.result.score}
          </div>
        ) : isPast ? (
          <span className="text-gray-400 text-sm">Final</span>
        ) : (
          <>
            <div className="text-sm font-medium text-gray-900">
              {formatGameTime(game.date)}
            </div>
            {game.broadcasts && game.broadcasts.length > 0 && (
              <div className="text-xs text-gray-500">
                {game.broadcasts[0]}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
