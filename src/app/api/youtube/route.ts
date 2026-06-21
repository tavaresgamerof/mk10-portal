import { NextResponse } from "next/server";
import { fetchChannelFeed } from "@/lib/youtube";

export async function GET() {
  const data = await fetchChannelFeed();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": data.isLive
        ? "public, s-maxage=10, stale-while-revalidate=15"
        : "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
