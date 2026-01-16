import type { Metadata } from "next";
import { getYouTubePlaylistVideos, type YouTubeVideo } from "@/lib/youtube";
import { VideoPageClient } from "@/components/VideoPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";
const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID || "";

export const metadata: Metadata = {
  title: `Video | ${SITE_NAME}`,
  description: `Watch the latest Clemson Tigers videos, podcasts, and exclusive content from ${SITE_NAME}.`,
  openGraph: {
    title: `Video | ${SITE_NAME}`,
    description: `Watch the latest Clemson Tigers videos, podcasts, and exclusive content.`,
    type: "website",
    url: `${SITE_URL}/video`,
  },
  twitter: {
    card: "summary",
    title: `Video | ${SITE_NAME}`,
    description: `Watch the latest Clemson Tigers videos, podcasts, and exclusive content.`,
  },
};

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function VideoPage() {
  let videos: YouTubeVideo[] = [];

  try {
    if (PLAYLIST_ID) {
      videos = await getYouTubePlaylistVideos(PLAYLIST_ID, 50);
    }
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        {/* Watermark Background */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
          aria-hidden="true"
        >
          <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold uppercase text-[var(--clemson-orange)] opacity-75 tracking-widest text-center leading-none">
            VIDEO
          </span>
        </div>

        {/* Header Content */}
        <div className="relative z-10 text-center">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Video
          </h1>

          {/* Orange accent line */}
          <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

          <p className="text-lg md:text-xl text-gray-600">
            {videos.length} {videos.length === 1 ? "video" : "videos"}
          </p>
        </div>
      </section>

      {/* Videos Section - Client Component for Interactivity */}
      {videos.length > 0 ? (
        <VideoPageClient videos={videos} />
      ) : (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-gray-600">
              No videos available at this time.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
