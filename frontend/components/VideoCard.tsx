"use client";

import Image from "next/image";
import type { YouTubeVideo } from "@/lib/youtube";

interface VideoCardProps {
  video: YouTubeVideo;
  onPlay: (videoId: string) => void;
  featured?: boolean;
}

export function VideoCard({ video, onPlay, featured = false }: VideoCardProps) {
  return (
    <article
      className="group cursor-pointer"
      onClick={() => onPlay(video.id)}
    >
      {/* Thumbnail with duration badge */}
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        <Image
          src={featured ? video.thumbnailHigh : video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 60vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          }
        />
        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-[var(--clemson-orange)] text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className={`mt-3 font-heading font-bold leading-tight text-[var(--clemson-orange)] group-hover:underline ${
          featured
            ? "text-lg md:text-xl lg:text-2xl"
            : "text-sm md:text-base line-clamp-2"
        }`}
      >
        {video.title}
      </h3>

      {/* Meta info */}
      <p className="mt-1 text-sm text-gray-500">
        {video.viewCount} &bull; {video.publishedAt}
      </p>
    </article>
  );
}

export function FeaturedVideoCard({
  video,
  onPlay,
}: {
  video: YouTubeVideo;
  onPlay: (videoId: string) => void;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <VideoCard video={video} onPlay={onPlay} featured />
    </div>
  );
}
