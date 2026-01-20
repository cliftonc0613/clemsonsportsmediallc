import { NextRequest, NextResponse } from "next/server";
import { getClemsonGameById } from "@/lib/espn";
import type { SportType } from "@/lib/espn-types";

// Valid sport types
const VALID_SPORTS: SportType[] = ["football", "mensBasketball", "womensBasketball", "baseball"];

/**
 * GET /api/espn/game
 * Fetches Clemson game data from ESPN API
 *
 * Query params:
 * - sport: SportType (required)
 * - gameId: string (default: "latest")
 * - season: string (optional)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sport = searchParams.get("sport") as SportType | null;
  const gameId = searchParams.get("gameId") || "latest";
  const season = searchParams.get("season") || undefined;

  // Validate sport parameter
  if (!sport || !VALID_SPORTS.includes(sport)) {
    return NextResponse.json(
      { error: "Invalid or missing sport parameter" },
      { status: 400 }
    );
  }

  try {
    const game = await getClemsonGameById(sport, gameId, season);

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(game, {
      headers: {
        // Cache for 60 seconds
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("ESPN API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch game data" },
      { status: 500 }
    );
  }
}
