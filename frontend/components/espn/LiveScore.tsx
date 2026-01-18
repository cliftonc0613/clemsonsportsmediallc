"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CLEMSON_TEAM_ID, SPORT_NAMES } from "@/lib/espn";
import type { SimpleGame, SportType } from "@/lib/espn-types";

interface LiveScoreProps {
  sport: SportType;
  /** Initial game data (optional - will fetch if not provided) */
  initialGame?: SimpleGame | null;
  /** Refresh interval in seconds (default: 30) */
  refreshInterval?: number;
  /** Custom title */
  title?: string;
  className?: string;
}

/**
 * Live score component with auto-refresh
 *
 * Polls ESPN API every 30 seconds during active games
 * Shows live indicator and game clock
 */
export function LiveScore({
  sport,
  initialGame,
  refreshInterval = 30,
  title,
  className,
}: LiveScoreProps) {
  const [game, setGame] = useState<SimpleGame | null>(initialGame || null);
  const [loading, setLoading] = useState(!initialGame);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGame = useCallback(async () => {
    try {
      const response = await fetch(`/api/espn/game?sport=${sport}&gameId=latest`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch game");
      }

      const gameData: SimpleGame = await response.json();
      setGame(gameData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch live score:", err);
      setError("Unable to load live score");
    } finally {
      setLoading(false);
    }
  }, [sport]);

  // Initial fetch
  useEffect(() => {
    if (!initialGame) {
      fetchGame();
    }
  }, [initialGame, fetchGame]);

  // Auto-refresh during live games
  useEffect(() => {
    // Only refresh if game is in progress
    if (!game || game.status.state !== "in") {
      return;
    }

    const intervalId = setInterval(() => {
      fetchGame();
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [game, refreshInterval, fetchGame]);

  // Loading state
  if (loading) {
    return (
      <div className={cn("bg-[var(--clemson-dark-purple)] rounded-lg p-6 animate-pulse", className)}>
        <div className="h-6 bg-gray-700 rounded w-32 mx-auto mb-4" />
        <div className="flex items-center justify-center gap-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full" />
          <div className="w-20 h-10 bg-gray-700 rounded" />
          <div className="w-16 h-16 bg-gray-700 rounded-full" />
        </div>
      </div>
    );
  }

  // Error or no game
  if (error || !game) {
    return (
      <div className={cn("bg-[var(--clemson-dark-purple)] rounded-lg p-6 text-center", className)}>
        <p className="text-gray-400 text-sm">
          {error || `No ${SPORT_NAMES[sport]} game scheduled`}
        </p>
      </div>
    );
  }

  const isLive = game.status.state === "in";
  const isPreGame = game.status.state === "pre";
  const isFinal = game.status.state === "post";

  const awayIsClemson = game.awayTeam.id === CLEMSON_TEAM_ID;
  const homeIsClemson = game.homeTeam.id === CLEMSON_TEAM_ID;

  const awayWon = isFinal && (game.awayScore ?? 0) > (game.homeScore ?? 0);
  const homeWon = isFinal && (game.homeScore ?? 0) > (game.awayScore ?? 0);

  return (
    <div className={cn("bg-[var(--clemson-dark-purple)] rounded-lg overflow-hidden", className)}>
      {/* Header with live indicator */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/20">
        <h3 className="text-white text-sm font-medium">
          {title || `${SPORT_NAMES[sport]}`}
        </h3>
        {isLive && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-red-400 text-xs font-bold uppercase">Live</span>
          </div>
        )}
        {isFinal && (
          <span className="text-gray-400 text-xs uppercase">Final</span>
        )}
      </div>

      {/* Score Content */}
      <div className="p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {game.awayTeam.logo && (
              <div className="relative w-12 h-12 md:w-16 md:h-16">
                <Image
                  src={game.awayTeam.logo}
                  alt={game.awayTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span
              className={cn(
                "text-xs md:text-sm font-bold uppercase",
                awayIsClemson ? "text-[var(--clemson-orange)]" : "text-white"
              )}
            >
              {game.awayTeam.abbreviation}
            </span>
            {game.awayTeam.rank && (
              <span className="text-gray-500 text-xs">#{game.awayTeam.rank}</span>
            )}
          </div>

          {/* Score or Time */}
          <div className="flex flex-col items-center gap-1 min-w-[100px]">
            {isPreGame ? (
              <>
                <span className="text-white text-lg font-bold">
                  {new Date(game.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(game.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-3xl md:text-4xl font-bold tabular-nums",
                      awayWon ? "text-white" : isFinal ? "text-gray-500" : "text-white"
                    )}
                  >
                    {game.awayScore}
                  </span>
                  <span className="text-gray-600 text-xl">-</span>
                  <span
                    className={cn(
                      "text-3xl md:text-4xl font-bold tabular-nums",
                      homeWon ? "text-white" : isFinal ? "text-gray-500" : "text-white"
                    )}
                  >
                    {game.homeScore}
                  </span>
                </div>
                {isLive && game.status.detail && (
                  <span className="text-[var(--clemson-orange)] text-xs font-medium">
                    {game.status.detail}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {game.homeTeam.logo && (
              <div className="relative w-12 h-12 md:w-16 md:h-16">
                <Image
                  src={game.homeTeam.logo}
                  alt={game.homeTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span
              className={cn(
                "text-xs md:text-sm font-bold uppercase",
                homeIsClemson ? "text-[var(--clemson-orange)]" : "text-white"
              )}
            >
              {game.homeTeam.abbreviation}
            </span>
            {game.homeTeam.rank && (
              <span className="text-gray-500 text-xs">#{game.homeTeam.rank}</span>
            )}
          </div>
        </div>

        {/* Venue and Broadcast */}
        {(game.venue || (game.broadcasts && game.broadcasts.length > 0)) && (
          <div className="mt-4 pt-3 border-t border-gray-700 text-center text-xs text-gray-500">
            {game.venue && <span>{game.venue.name}</span>}
            {game.venue && game.broadcasts && game.broadcasts.length > 0 && (
              <span className="mx-2">•</span>
            )}
            {game.broadcasts && game.broadcasts.length > 0 && (
              <span>{game.broadcasts[0]}</span>
            )}
          </div>
        )}

        {/* Last updated indicator for live games */}
        {isLive && lastUpdated && (
          <div className="mt-2 text-center text-xs text-gray-600">
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
