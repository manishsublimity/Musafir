import { NextResponse } from "next/server";
import { search } from "@/lib/cms";

/**
 * Search runs on the server so the entire catalogue — every itinerary, every
 * price — stays out of the client bundle. The overlay sends a query and gets
 * back at most a dozen shaped results.
 */

export const dynamic = "force-static";
export const revalidate = 3600;

const MAX_QUERY = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("q") ?? "";

  // Bound the input before it reaches the tokeniser.
  const query = raw.slice(0, MAX_QUERY).trim();
  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  return NextResponse.json(
    { results: search(query) },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
