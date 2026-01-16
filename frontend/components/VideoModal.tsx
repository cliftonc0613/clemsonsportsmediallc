"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import type { YouTubeVideo } from "@/lib/youtube";

interface VideoModalProps {
  video: YouTubeVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoModal({ video, open, onOpenChange }: VideoModalProps) {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl w-full p-0 bg-black border-none overflow-hidden"
        showCloseButton={false}
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">{video.title}</DialogTitle>

        {/* Close button - custom positioned for video */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute -top-10 right-0 z-50 text-white hover:text-gray-300 transition-colors"
          aria-label="Close video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video Player */}
        <div className="aspect-video w-full">
          <YouTubePlayer
            videoId={video.id}
            autoplay
            controls
            className="w-full h-full"
          />
        </div>

        {/* Video Info */}
        <div className="p-4 bg-[var(--clemson-dark-purple)]">
          <h2 className="font-heading text-lg md:text-xl font-bold text-white line-clamp-2">
            {video.title}
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            {video.viewCount} &bull; {video.publishedAt}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
