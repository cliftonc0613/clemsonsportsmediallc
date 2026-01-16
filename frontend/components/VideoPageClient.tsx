"use client";

import { useState } from "react";
import { VideoCard, FeaturedVideoCard } from "@/components/VideoCard";
import { VideoModal } from "@/components/VideoModal";
import type { YouTubeVideo } from "@/lib/youtube";

interface VideoPageClientProps {
  videos: YouTubeVideo[];
}

export function VideoPageClient({ videos }: VideoPageClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const featuredVideo = videos[0];
  const gridVideos = videos.slice(1);

  const handlePlay = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      setSelectedVideo(video);
      setModalOpen(true);
    }
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      // Small delay before clearing video to allow animation
      setTimeout(() => setSelectedVideo(null), 200);
    }
  };

  return (
    <>
      {/* Featured Video */}
      {featuredVideo && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <FeaturedVideoCard video={featuredVideo} onPlay={handlePlay} />
          </div>
        </section>
      )}

      {/* Video Grid */}
      {gridVideos.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gridVideos.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={handlePlay} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </>
  );
}
