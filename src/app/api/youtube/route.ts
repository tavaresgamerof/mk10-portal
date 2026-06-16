import { NextResponse } from "next/server";
import { fetchChannelFeed } from "@/lib/youtube";

export async function GET() {
  const data = await fetchChannelFeed();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
