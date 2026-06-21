export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  isLive: boolean;
  description: string;
}

export interface YouTubeChannelState {
  isLive: boolean;
  liveVideoId: string | null;
  latestVideo: YouTubeVideo | null;
  recentVideos: YouTubeVideo[];
}

const CHANNEL_ID = "UCwehhoJDFXjg7bcKB22JS2g";
const CHANNEL_HANDLE = "@mk10produtora";

async function fetchOEmbed(videoId: string): Promise<{ title: string } | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title ?? "MK10TV" };
  } catch {
    return null;
  }
}

function parseRssDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return "";
  }
}

async function fetchRssFeed(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml",
        },
        next: { revalidate: 30 },
      }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const videos: YouTubeVideo[] = [];
    const entries = xml.split("<entry>").slice(1);

    for (const entry of entries) {
      const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<media:title>(.*?)<\/media:title>/);
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const descMatch = entry.match(/<media:description[^>]*>([\s\S]*?)<\/media:description>/);

      if (idMatch) {
        videos.push({
          videoId: idMatch[1],
          title: titleMatch ? titleMatch[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"') : "MK10TV",
          thumbnail: `https://img.youtube.com/vi/${idMatch[1]}/hqdefault.jpg`,
          publishedAt: parseRssDate(publishedMatch?.[1] ?? ""),
          isLive: false,
          description: descMatch ? descMatch[1].trim().substring(0, 200) : "",
        });
      }
    }
    return videos;
  } catch {
    return [];
  }
}

async function checkLiveStatus(): Promise<{ isLive: boolean; liveVideoId: string | null }> {
  try {
    const res = await fetch(`https://www.youtube.com/channel/${CHANNEL_ID}/live`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
      next: { revalidate: 15 },
      redirect: "follow",
    });
    const html = await res.text();
    const url = res.url;

    const isLive =
      html.includes('"isLiveBroadcast":true') ||
      html.includes('"isLive":true') ||
      html.includes('"isLiveContent":true') ||
      html.includes('"style":"LIVE"');

    let liveVideoId: string | null = null;

    const urlMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (urlMatch) liveVideoId = urlMatch[1];

    if (!liveVideoId && isLive) {
      const patterns = [
        /"videoId":"([a-zA-Z0-9_-]{11})"[^}]*"isLiveBroadcast"/,
        /"isLiveBroadcast"[^}]*"videoId":"([a-zA-Z0-9_-]{11})"/,
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m) { liveVideoId = m[1]; break; }
      }
    }

    if (!liveVideoId && isLive) {
      const ids = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
      if (ids && ids.length > 0) {
        const first = ids[0].match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        if (first) liveVideoId = first[1];
      }
    }

    return { isLive, liveVideoId };
  } catch {
    return { isLive: false, liveVideoId: null };
  }
}

export async function fetchChannelFeed(): Promise<YouTubeChannelState> {
  const empty: YouTubeChannelState = {
    isLive: false,
    liveVideoId: null,
    latestVideo: null,
    recentVideos: [],
  };

  try {
    const [rssVideos, liveStatus] = await Promise.all([
      fetchRssFeed(),
      checkLiveStatus(),
    ]);

    if (rssVideos.length === 0 && !liveStatus.isLive) return empty;

    let videos = rssVideos;

    if (liveStatus.isLive && liveStatus.liveVideoId) {
      const alreadyHasLive = videos.find((v) => v.videoId === liveStatus.liveVideoId);
      if (!alreadyHasLive) {
        const oembed = await fetchOEmbed(liveStatus.liveVideoId);
        videos.unshift({
          videoId: liveStatus.liveVideoId,
          title: oembed?.title ?? "AO VIVO - MK10TV",
          thumbnail: `https://img.youtube.com/vi/${liveStatus.liveVideoId}/hqdefault.jpg`,
          publishedAt: "",
          isLive: true,
          description: "",
        });
      } else {
        alreadyHasLive.isLive = true;
        const idx = videos.indexOf(alreadyHasLive);
        if (idx > 0) {
          videos.splice(idx, 1);
          videos.unshift(alreadyHasLive);
        }
      }
    }

    const limited = videos.slice(0, 10);

    return {
      isLive: liveStatus.isLive,
      liveVideoId: liveStatus.liveVideoId,
      latestVideo: limited[0] ?? null,
      recentVideos: limited,
    };
  } catch {
    return empty;
  }
}

export function getYouTubeEmbedUrl(videoId: string, autoplay = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function getChannelLiveEmbedUrl(): string {
  return `https://www.youtube.com/embed?listType=channel&list=${CHANNEL_ID}&autoplay=1&mute=1`;
}

export function getChannelId(): string {
  return CHANNEL_ID;
}

export function getChannelHandle(): string {
  return CHANNEL_HANDLE;
}
