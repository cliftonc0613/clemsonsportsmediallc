import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/wordpress";
import { searchLimiter, getClientIp } from "@/lib/rate-limit";

// SECURITY: Maximum query length to prevent DoS via extremely long queries
const MAX_QUERY_LENGTH = 200;
// SECURITY: Maximum results per page to prevent resource exhaustion
const MAX_PER_PAGE = 50;

export async function GET(request: NextRequest) {
  // SECURITY: Rate limiting to prevent abuse
  const clientIp = getClientIp(request);
  const { success, remaining, reset } = searchLimiter.check(clientIp);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(reset),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(reset),
        },
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  let query = searchParams.get("q") || "";
  const typesParam = searchParams.get("types");
  const perPageParam = parseInt(searchParams.get("per_page") || "10", 10);

  // SECURITY: Truncate query to max length to prevent DoS
  query = query.substring(0, MAX_QUERY_LENGTH);

  // SECURITY: Clamp per_page to prevent resource exhaustion
  const perPage = Math.min(Math.max(1, perPageParam), MAX_PER_PAGE);

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  // Filter out 'static' from types param (for backwards compatibility)
  // Static pages are now automatically included when searching 'page' type
  const types = typesParam
    ? (typesParam.split(",").filter(t => t !== "static") as ("post" | "page" | "service")[])
    : undefined;

  try {
    const results = await search({
      query,
      types,
      per_page: perPage,
    });

    return NextResponse.json(results, {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      },
    });
  } catch (error) {
    // SECURITY: Log error server-side but return generic message to client
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
