"use client";

import { useEffect, useState } from "react";
import { ScoreCard } from "./ScoreCard";
import type { SimpleGame, SportType } from "@/lib/espn-types";

interface ESPNScoreEmbedProps {
  /** Sport type */
  sport: SportType;
  /** ESPN event ID or "latest" */
  gameId: string;
  /** Optional season year */
  season?: string;
  /** Custom title */
  title?: string;
  /** Team name style: "short" or "full" */
  nameStyle?: "short" | "full";
  /** Additional className */
  className?: string;
}

/**
 * ESPN Score Embed Component
 *
 * Client component that fetches and displays a Clemson game scorecard.
 * Used by WordPressContent to render ESPN Score blocks from WordPress.
 */
export function ESPNScoreEmbed({
  sport,
  gameId,
  season,
  title,
  nameStyle = "short",
  className,
}: ESPNScoreEmbedProps) {
  const [game, setGame] = useState<SimpleGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGame() {
      setLoading(true);
      setError(null);

      try {
        // Build API URL with query params
        const params = new URLSearchParams({ sport, gameId });
        if (season) params.set("season", season);

        const response = await fetch(`/api/espn/game?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch game");
        }

        const gameData: SimpleGame = await response.json();

        // Apply nameStyle transformation
        const transformedGame = applyNameStyle(gameData, nameStyle);
        setGame(transformedGame);
      } catch (err) {
        console.error("Failed to fetch ESPN game:", err);
        setError("Failed to load game data");
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [sport, gameId, season, nameStyle]);

  // Loading skeleton
  if (loading) {
    return (
      <div className={`bg-white py-6 md:py-8 lg:py-12 animate-pulse ${className || ""}`}>
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8" />
        <div className="flex justify-between items-start gap-8">
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>
        <div className="border-b-2 border-gray-200 mt-8" />
      </div>
    );
  }

  // Error state
  if (error || !game) {
    return (
      <div className={`bg-white py-8 text-center ${className || ""}`}>
        <p className="text-gray-500">{error || "Unable to load game"}</p>
      </div>
    );
  }

  // Render ScoreCard
  return (
    <ScoreCard
      game={game}
      sport={sport}
      title={title || getDefaultTitle(sport)}
      className={className}
    />
  );
}

/**
 * Apply nameStyle transformation to game data
 * Swaps displayName based on user preference
 */
function applyNameStyle(game: SimpleGame, nameStyle: "short" | "full"): SimpleGame {
  if (nameStyle === "full") {
    // Use full displayName (already the default)
    return game;
  }

  // For "short" style, use shortDisplayName or location as the displayName
  return {
    ...game,
    homeTeam: {
      ...game.homeTeam,
      displayName: getShortName(game.homeTeam),
    },
    awayTeam: {
      ...game.awayTeam,
      displayName: getShortName(game.awayTeam),
    },
  };
}

/**
 * Get short name for team
 */
function getShortName(team: SimpleGame["homeTeam"]): string {
  // Try to extract just the school name (first word or before space)
  // e.g., "Clemson Tigers" -> "Clemson", "Miami Hurricanes" -> "Miami"
  const displayName = team.displayName || team.name;
  const parts = displayName.split(" ");

  // If it's just one word, use it
  if (parts.length === 1) return displayName;

  // For most college teams, first word is the school name
  // Check if first word looks like a school name (not "The" or similar)
  if (parts[0].toLowerCase() === "the") {
    return parts.slice(1, -1).join(" ") || parts[1];
  }

  // Return first word as short name
  return parts[0];
}

/**
 * Get default title based on sport
 */
function getDefaultTitle(sport: SportType): string {
  const sportNames: Record<SportType, string> = {
    football: "Clemson Football Scoreboard",
    mensBasketball: "Clemson Men's Basketball Scoreboard",
    womensBasketball: "Clemson Women's Basketball Scoreboard",
    baseball: "Clemson Baseball Scoreboard",
  };
  return sportNames[sport] || "Clemson Scoreboard";
}
