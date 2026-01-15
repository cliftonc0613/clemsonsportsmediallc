import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/wordpress";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const typesParam = searchParams.get("types");
  const perPage = parseInt(searchParams.get("per_page") || "10", 10);

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

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
