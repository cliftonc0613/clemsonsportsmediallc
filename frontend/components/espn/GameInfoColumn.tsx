import { cn } from "@/lib/utils";
import { QuarterIndicator } from "./QuarterIndicator";
import { formatGameDate, formatGameTime } from "@/lib/espn";
import type { SimpleGame, SportType } from "@/lib/espn-types";

interface GameInfoColumnProps {
  game: SimpleGame;
  sport: SportType;
  /** Whether to show venue info */
  showVenue?: boolean;
  /** Whether to show broadcast info */
  showBroadcast?: boolean;
  className?: string;
}

/**
 * Displays game information in the center column:
 * - Quarter/Period indicator dots
 * - Game status (Final, 1st Quarter, etc.)
 * - Date and time
 * - Venue (optional)
 * - Broadcast channel (optional)
 */
export function GameInfoColumn({
  game,
  sport,
  showVenue = true,
  showBroadcast = true,
  className,
}: GameInfoColumnProps) {
  const isFootball = sport === "football";
  const isBasketball = sport === "mensBasketball" || sport === "womensBasketball";

  // Football has 4 quarters, basketball has 2 halves (or 4 quarters in college)
  const totalPeriods = isFootball ? 4 : isBasketball ? 2 : 4;
  const periodLabel = isFootball ? "Quarter" : isBasketball ? "Half" : "Period";

  const isPreGame = game.status.state === "pre";
  const isLive = game.status.state === "in";
  const isFinal = game.status.state === "post";

  return (
    <div className={cn("text-center", className)} role="status" aria-live="polite">
      {/* Quarter/Period Label - only show during live or completed games */}
      {!isPreGame && (
        <>
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            {periodLabel}
          </div>

          {/* Quarter/Period Dots */}
          <QuarterIndicator
            current={game.status.period || 0}
            total={totalPeriods}
            isComplete={game.status.completed}
          />
        </>
      )}

      {/* Status */}
      <div className={cn(
        "text-lg font-semibold mt-3",
        isLive && "text-red-600"
      )}>
        {isLive && game.status.displayClock && (
          <span className="mr-2">{game.status.displayClock}</span>
        )}
        {game.status.detail}
      </div>

      {/* Date */}
      <div className="text-sm text-gray-600 mt-4">
        {formatGameDate(game.date)}
      </div>

      {/* Time (only show for pre-game or include with date for final) */}
      {isPreGame && (
        <div className="text-sm text-gray-600">
          {formatGameTime(game.date)}
        </div>
      )}

      {/* Venue */}
      {showVenue && game.venue && (
        <>
          <div className="text-sm text-gray-500 mt-2 uppercase">
            {game.venue.city}
          </div>
          <div className="text-sm text-gray-500 uppercase">
            {game.venue.name}
          </div>
        </>
      )}

      {/* Broadcast */}
      {showBroadcast && game.broadcasts && game.broadcasts.length > 0 && game.broadcasts[0] && (
        <div className="text-sm mt-2">
          Watch on:{" "}
          <span className="text-blue-600 font-medium">
            {game.broadcasts[0]}
          </span>
        </div>
      )}
    </div>
  );
}
