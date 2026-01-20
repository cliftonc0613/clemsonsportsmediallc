"use client";

import { useState, useEffect, useRef } from "react";
import { CompactScoreCard } from "./CompactScoreCard";
import { LiveScore } from "./LiveScore";
import type { SimpleGame, SportType } from "@/lib/espn-types";

interface GameScoreWidgetProps {
  sport: SportType;
  initialGame: SimpleGame;
  /** Minutes to show LiveScore after game ends (default: 30) */
  postGameDuration?: number;
  /** Custom title for LiveScore */
  title?: string;
  className?: string;
}

/**
 * GameScoreWidget - Conditional display wrapper for game scores
 *
 * Shows different components based on game state:
 * - Pre-game: CompactScoreCard
 * - During game: LiveScore with auto-refresh
 * - Post-game (30 min window): LiveScore
 * - After 30 min: CompactScoreCard
 */
export function GameScoreWidget({
  sport,
  initialGame,
  postGameDuration = 30,
  title,
  className,
}: GameScoreWidgetProps) {
  const [game, setGame] = useState(initialGame);
  const [gameEndedAt, setGameEndedAt] = useState<Date | null>(null);
  const [showLiveScore, setShowLiveScore] = useState(false);
  const previousState = useRef(initialGame.status.state);

  // Determine which component to show
  useEffect(() => {
    const state = game.status.state;

    // Track when game ends (state transitions from 'in' to 'post')
    if (previousState.current === "in" && state === "post") {
      setGameEndedAt(new Date());
    }
    previousState.current = state;

    // Logic for which component to display
    if (state === "pre") {
      setShowLiveScore(false);
    } else if (state === "in") {
      setShowLiveScore(true);
    } else if (state === "post") {
      // Check if within post-game window
      if (gameEndedAt) {
        const elapsed = Date.now() - gameEndedAt.getTime();
        const windowMs = postGameDuration * 60 * 1000;
        setShowLiveScore(elapsed < windowMs);
      } else {
        // Game was already post when component mounted
        // Default to CompactScoreCard
        setShowLiveScore(false);
      }
    }
  }, [game, gameEndedAt, postGameDuration]);

  // Timer to switch back after post-game window
  useEffect(() => {
    if (!gameEndedAt || !showLiveScore) return;

    const windowMs = postGameDuration * 60 * 1000;
    const elapsed = Date.now() - gameEndedAt.getTime();
    const remaining = windowMs - elapsed;

    if (remaining > 0) {
      const timer = setTimeout(() => {
        setShowLiveScore(false);
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [gameEndedAt, showLiveScore, postGameDuration]);

  // Callback to update game state from LiveScore
  const handleGameUpdate = (updatedGame: SimpleGame) => {
    setGame(updatedGame);
  };

  if (showLiveScore) {
    return (
      <LiveScore
        sport={sport}
        initialGame={game}
        onGameUpdate={handleGameUpdate}
        title={title}
        className={className}
      />
    );
  }

  return <CompactScoreCard game={game} sport={sport} className={className} />;
}
