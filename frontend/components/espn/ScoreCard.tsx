import { cn } from "@/lib/utils";
import { TeamColumn } from "./TeamColumn";
import { GameInfoColumn } from "./GameInfoColumn";
import { CLEMSON_TEAM_ID } from "@/lib/espn";
import type { SimpleGame, SportType } from "@/lib/espn-types";

interface ScoreCardProps {
  game: SimpleGame;
  sport: SportType;
  /** Custom title (default: "Clemson Tiger Scoreboard") */
  title?: string;
  /** Whether to show venue info */
  showVenue?: boolean;
  /** Whether to show broadcast info */
  showBroadcast?: boolean;
  className?: string;
}

/**
 * Horizontal scoreboard displaying game between two teams
 *
 * Desktop: Three-column layout (Away | Game Info | Home)
 * Mobile: Two-column teams + game info below
 */
export function ScoreCard({
  game,
  sport,
  title = "Clemson Tiger Scoreboard",
  showVenue = true,
  showBroadcast = true,
  className,
}: ScoreCardProps) {
  const isPreGame = game.status.state === "pre";
  const showScores = !isPreGame;

  // Check which team is Clemson
  const awayIsClemson = game.awayTeam.id === CLEMSON_TEAM_ID;
  const homeIsClemson = game.homeTeam.id === CLEMSON_TEAM_ID;

  return (
    <div className={cn("bg-transparent py-6 md:py-8 lg:py-12", className)}>
      {/* Header */}
      <h2 className="text-center font-heading italic text-xl md:text-2xl lg:text-3xl text-[var(--clemson-purple)] mb-6 md:mb-8">
        {title}
      </h2>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Teams Row - always side by side */}
        <div className="flex justify-between items-start gap-4 md:gap-8 lg:gap-12">
          {/* Away Team (Left) */}
          <TeamColumn
            team={game.awayTeam}
            score={game.awayScore}
            isClemson={awayIsClemson}
            showScore={showScores}
          />

          {/* Game Info (Center) - Desktop only */}
          <div className="hidden md:flex flex-1 justify-center">
            <GameInfoColumn
              game={game}
              sport={sport}
              showVenue={showVenue}
              showBroadcast={showBroadcast}
            />
          </div>

          {/* Home Team (Right) */}
          <TeamColumn
            team={game.homeTeam}
            score={game.homeScore}
            isClemson={homeIsClemson}
            showScore={showScores}
          />
        </div>

        {/* Game Info - Mobile only (below teams) */}
        <div className="md:hidden mt-6 pt-6 border-t border-gray-100">
          <GameInfoColumn
            game={game}
            sport={sport}
            showVenue={false}
            showBroadcast={false}
          />
        </div>
      </div>

      {/* Bottom Border */}
      <div className="border-b-2 border-gray-200 mt-6 md:mt-8" />
    </div>
  );
}
