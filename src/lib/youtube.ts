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

async function fetchOEmbed(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      videoId,
      title: data.title ?? "MK10TV",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: "",
      isLive: false,
      description: "",
    };
  } catch {
    return null;
  }
}

function extractVideoIds(html: string): string[] {
  const ids: string[] = [];
  const patterns = [
    /"videoId":"([a-zA-Z0-9_-]{11})"/g,
    /\/watch\?v=([a-zA-Z0-9_-]{11})/g,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/g,
  ];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(html)) !== null) {
      if (!ids.includes(m[1])) ids.push(m[1]);
    }
  }
  return ids;
}

function extractLiveStatus(html: string): { isLive: boolean; liveVideoId: string | null } {
  const lower = html.toLowerCase();

  const isLive =
    lower.includes('"isLive":true') ||
    lower.includes('"isLiveContent":true') ||
    lower.includes('"isLiveBroadcast":true') ||
    lower.includes('"style":"LIVE"') ||
    lower.includes('class="badge-style-type-live-now');

  let liveVideoId: string | null = null;
  if (isLive) {
    const livePatterns = [
      /"videoId":"([a-zA-Z0-9_-]{11})"[^}]*"isLiveBroadcast":\s*true/,
      /"isLiveBroadcast":\s*true[^}]*"videoId":"([a-zA-Z0-9_-]{11})"/,
      /"style":"LIVE"[^}]*"videoId":"([a-zA-Z0-9_-]{11})"/,
      /"videoId":"([a-zA-Z0-9_-]{11})"[^}]*"style":"LIVE"/,
    ];
    for (const pattern of livePatterns) {
      const match = pattern.exec(html);
      if (match) {
        liveVideoId = match[1];
        break;
      }
    }
    if (!liveVideoId) {
      const allIds = extractVideoIds(html);
      if (allIds.length > 0) liveVideoId = allIds[0];
    }
  }

  return { isLive, liveVideoId };
}

export async function fetchChannelFeed(): Promise<YouTubeChannelState> {
  const empty: YouTubeChannelState = {
    isLive: false,
    liveVideoId: null,
    latestVideo: null,
    recentVideos: [],
  };

  try {
    const pageHtml = await (await fetch(`https://www.youtube.com/channel/${CHANNEL_ID}/videos`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 30 },
    }).catch(() => null))?.text();

    if (!pageHtml) return empty;

    const { isLive, liveVideoId } = extractLiveStatus(pageHtml);

    let videoIds = extractVideoIds(pageHtml);

    const seen = new Set<string>();
    videoIds = videoIds.filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    if (videoIds.length === 0) return { ...empty, isLive };

    const videosToFetch = videoIds.slice(0, 10);
    const videos = await Promise.all(videosToFetch.map(fetchOEmbed));
    const validVideos = videos.filter(Boolean) as YouTubeVideo[];

    if (isLive && liveVideoId && validVideos.length > 0) {
      let liveVideo = validVideos.find((v) => v.videoId === liveVideoId);
      if (!liveVideo) {
        const fetched = await fetchOEmbed(liveVideoId);
        if (fetched) {
          liveVideo = fetched;
          validVideos.unshift(liveVideo);
        }
      }
      if (liveVideo) {
        liveVideo.isLive = true;
        const idx = validVideos.findIndex((v) => v.videoId === liveVideoId);
        if (idx > 0) {
          validVideos.splice(idx, 1);
          validVideos.unshift(liveVideo);
        }
      }
    }

    return {
      isLive,
      liveVideoId: liveVideoId ?? null,
      latestVideo: validVideos[0] ?? null,
      recentVideos: validVideos,
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
