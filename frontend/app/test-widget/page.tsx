"use client";

import { useState, useEffect } from "react";
import { GameScoreWidget } from "@/components/espn";
import type { SimpleGame } from "@/lib/espn-types";

const mockGame: SimpleGame = {
  id: "test-123",
  date: new Date().toISOString(),
  status: { state: "pre", detail: "" },
  awayTeam: {
    id: "228",
    name: "Clemson",
    abbreviation: "CLEM",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/228.png",
  },
  homeTeam: {
    id: "99",
    name: "Duke",
    abbreviation: "DUKE",
    logo: "https://a.espncdn.com/i/teamlogos/ncaa/500/99.png",
  },
  awayScore: 0,
  homeScore: 0,
  venue: { name: "Cameron Indoor Stadium" },
  broadcasts: ["ESPN"],
};

export default function TestWidgetPage() {
  const [gameState, setGameState] = useState<"pre" | "in" | "post">("pre");
  const [key, setKey] = useState(0);
  const [postGameTimer, setPostGameTimer] = useState<number | null>(null);

  // Track when we switch to "post" to show countdown
  useEffect(() => {
    if (gameState === "post") {
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setPostGameTimer(60 - elapsed); // 60 seconds = 1 minute
        if (elapsed >= 60) {
          clearInterval(interval);
          setPostGameTimer(null);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setPostGameTimer(null);
    }
  }, [gameState, key]);

  const game: SimpleGame = {
    ...mockGame,
    status: {
      state: gameState,
      detail: gameState === "in" ? "2nd Half - 10:30" : "",
    },
    awayScore: gameState === "pre" ? 0 : 72,
    homeScore: gameState === "pre" ? 0 : 68,
  };

  // Reset component when state changes to simulate fresh mount
  const handleStateChange = (newState: "pre" | "in" | "post") => {
    setGameState(newState);
    setKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-[var(--clemson-purple)] p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">GameScoreWidget Test Page</h1>

        <div className="bg-black/20 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Controls</h2>

          <div className="flex gap-2">
            <button
              onClick={() => handleStateChange("pre")}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                gameState === "pre"
                  ? "bg-[var(--clemson-orange)] text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Pre-Game
            </button>
            <button
              onClick={() => handleStateChange("in")}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                gameState === "in"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => handleStateChange("post")}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                gameState === "post"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Final
            </button>
          </div>

          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <span className="text-gray-500">Current state:</span>{" "}
              <span className="font-mono text-white">{gameState}</span>
            </p>
            <p>
              <span className="text-gray-500">Post-game duration:</span>{" "}
              <span className="font-mono text-white">1 minute</span> (for testing)
            </p>
            {postGameTimer !== null && postGameTimer > 0 && (
              <p>
                <span className="text-gray-500">Switch to CompactScoreCard in:</span>{" "}
                <span className="font-mono text-[var(--clemson-orange)]">{postGameTimer}s</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Expected Behavior</h2>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[var(--clemson-orange)]">Pre-Game:</span>
              <span>Shows CompactScoreCard (bracket design, no scores)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">Live:</span>
              <span>Shows LiveScore (with live indicator, scores, game clock)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">Final:</span>
              <span>Shows LiveScore for 1 minute, then switches to CompactScoreCard</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium text-white">Widget Output</h2>
          <GameScoreWidget
            key={key}
            sport="mensBasketball"
            initialGame={game}
            postGameDuration={1} // 1 minute for testing
          />
        </div>

        <div className="bg-black/20 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-medium text-white">Test Scenarios</h2>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
            <li>Click <strong>Pre-Game</strong> - should show CompactScoreCard</li>
            <li>Click <strong>Live</strong> - should switch to LiveScore</li>
            <li>Click <strong>Final</strong> - should stay on LiveScore, then switch to CompactScoreCard after 1 minute</li>
            <li>While on Final, click <strong>Live</strong> then <strong>Final</strong> again - timer should restart</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
