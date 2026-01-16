/**
 * YouTube Data API v3 Integration
 * Fetch videos from YouTube playlists/channels
 */

// =============================================================================
// Types
// =============================================================================

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailHigh: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  channelTitle: string;
}

interface PlaylistItemSnippet {
  title: string;
  description: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
    maxres?: { url: string };
  };
  channelTitle: string;
  publishedAt: string;
  resourceId: {
    videoId: string;
  };
}

interface PlaylistItemResponse {
  items: Array<{
    snippet: PlaylistItemSnippet;
  }>;
  nextPageToken?: string;
}

interface VideoDetailsResponse {
  items: Array<{
    id: string;
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
    };
  }>;
}

// =============================================================================
// API Functions
// =============================================================================

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error("YOUTUBE_API_KEY environment variable is not set");
  }
  return key;
}

/**
 * Fetch videos from a YouTube playlist
 */
export async function getYouTubePlaylistVideos(
  playlistId: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> {
  const apiKey = getApiKey();

  // Step 1: Get playlist items
  const playlistUrl = `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;

  const playlistResponse = await fetch(playlistUrl, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!playlistResponse.ok) {
    const error = await playlistResponse.text();
    console.error("YouTube API Error (playlist):", error);
    throw new Error(`YouTube API Error: ${playlistResponse.status}`);
  }

  const playlistData: PlaylistItemResponse = await playlistResponse.json();

  if (!playlistData.items || playlistData.items.length === 0) {
    return [];
  }

  // Step 2: Get video details (duration, view count)
  const videoIds = playlistData.items
    .map((item) => item.snippet.resourceId.videoId)
    .join(",");

  const detailsUrl = `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`;

  const detailsResponse = await fetch(detailsUrl, {
    next: { revalidate: 300 },
  });

  if (!detailsResponse.ok) {
    const error = await detailsResponse.text();
    console.error("YouTube API Error (details):", error);
    throw new Error(`YouTube API Error: ${detailsResponse.status}`);
  }

  const detailsData: VideoDetailsResponse = await detailsResponse.json();

  // Create a map of video details for quick lookup
  const detailsMap = new Map(
    detailsData.items.map((item) => [
      item.id,
      {
        duration: item.contentDetails.duration,
        viewCount: item.statistics.viewCount,
      },
    ])
  );

  // Step 3: Combine data
  return playlistData.items.map((item) => {
    const videoId = item.snippet.resourceId.videoId;
    const details = detailsMap.get(videoId);

    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url ||
        "",
      thumbnailHigh:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        "",
      duration: details ? formatDuration(details.duration) : "",
      viewCount: details ? formatViewCount(details.viewCount) : "",
      publishedAt: formatRelativeTime(item.snippet.publishedAt),
      channelTitle: item.snippet.channelTitle,
    };
  });
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Convert ISO 8601 duration (PT50M3S) to readable format (50:03)
 */
export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return "";

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Format view count (1234567 -> "1.2M views")
 */
export function formatViewCount(count: string): string {
  const num = parseInt(count, 10);

  if (isNaN(num)) return "0 views";

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M views`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K views`;
  }

  return `${num} views`;
}

/**
 * Format relative time ("2 months ago")
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
  }
  if (diffMonths > 0) {
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  }
  if (diffWeeks > 0) {
    return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
  }
  if (diffDays > 0) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }
  if (diffHours > 0) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }
  if (diffMinutes > 0) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  }
  return "Just now";
}
