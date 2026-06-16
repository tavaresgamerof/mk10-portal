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

const KNOWN_VIDEO_IDS = [
  "HJo4w-GLf7M",
  "DlLIvZ0ElL8",
  "gvVPqIKCNx4",
  "jT9k71cjL1Q",
];

async function fetchOEmbed(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      videoId,
      title: data.title ?? "MK10TV",
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      publishedAt: "",
      isLive: data.title?.toLowerCase().includes("ao vivo") || data.title?.toLowerCase().includes("live") || false,
      description: "",
    };
  } catch {
    return null;
  }
}

function extractLiveStatus(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes('"isLive":true') ||
    lower.includes('"isLiveContent":true') ||
    lower.includes("ao vivo")
  );
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
      next: { revalidate: 60 },
    }).catch(() => null))?.text();

    const isLive = pageHtml ? extractLiveStatus(pageHtml) : false;

    const extraIds = pageHtml
      ? (() => {
          const ids: string[] = [];
          const pattern = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
          let m;
          while ((m = pattern.exec(pageHtml)) !== null) {
            if (!ids.includes(m[1]) && !KNOWN_VIDEO_IDS.includes(m[1])) ids.push(m[1]);
          }
          return ids.slice(0, 6);
        })()
      : [];

    const allIds = [...KNOWN_VIDEO_IDS, ...extraIds].slice(0, 8);

    const videos = await Promise.all(allIds.map(fetchOEmbed));
    const validVideos = videos.filter(Boolean) as YouTubeVideo[];

    if (validVideos.length === 0) return { ...empty, isLive };

    const liveVideo = isLive
      ? validVideos.find((v) => v.isLive) ?? validVideos[0]
      : null;

    return {
      isLive,
      liveVideoId: liveVideo?.videoId ?? null,
      latestVideo: validVideos[0],
      recentVideos: validVideos,
    };
  } catch {
    const fallbackVideos = await Promise.all(KNOWN_VIDEO_IDS.map(fetchOEmbed));
    const valid = fallbackVideos.filter(Boolean) as YouTubeVideo[];
    return {
      ...empty,
      recentVideos: valid,
      latestVideo: valid[0] ?? null,
    };
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
