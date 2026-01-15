"use client";

import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";

import "video.js/dist/video-js.css";
import "videojs-youtube";

interface YouTubePlayerProps {
  videoId: string;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number | string;
  height?: number | string;
  ytControls?: boolean;
  captions?: boolean;
  captionLanguage?: string;
  onReady?: (player: Player) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function YouTubePlayer({
  videoId,
  className = "",
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  width = "100%",
  height = "auto",
  ytControls = false,
  captions = false,
  captionLanguage = "en",
  onReady,
  onPlay,
  onPause,
  onEnded,
}: YouTubePlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  // Track client-side mounting - Video.js requires DOM and cannot run on server
  // This pattern is required since this component may be imported directly (not just via dynamic import)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // No cleanup needed - this only runs once on mount
  }, []);

  useEffect(() => {
    if (!isClient || !videoRef.current || playerRef.current) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered");
    videoElement.classList.add("vjs-16-9");
    videoRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      techOrder: ["youtube"],
      sources: [
        {
          type: "video/youtube",
          src: `https://www.youtube.com/watch?v=${videoId}`,
        },
      ],
      autoplay,
      controls,
      loop,
      muted,
      fluid: true,
      youtube: {
        ytControls: ytControls ? 2 : 0,
        controls: ytControls ? 1 : 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        cc_load_policy: captions ? 1 : 0,
        cc_lang_pref: captionLanguage,
        playsinline: 1,
        disablekb: ytControls ? 0 : 1,
      },
    });

    playerRef.current = player;

    player.ready(() => {
      onReady?.(player);
    });

    if (onPlay) {
      player.on("play", onPlay);
    }

    if (onPause) {
      player.on("pause", onPause);
    }

    if (onEnded) {
      player.on("ended", onEnded);
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isClient, videoId, autoplay, controls, loop, muted, ytControls, captions, captionLanguage, onReady, onPlay, onPause, onEnded]);

  useEffect(() => {
    if (playerRef.current && !playerRef.current.isDisposed()) {
      playerRef.current.src({
        type: "video/youtube",
        src: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  }, [videoId]);

  if (!isClient) {
    return (
      <div
        className={className}
        style={{
          width,
          height: height === "auto" ? undefined : height,
          aspectRatio: height === "auto" ? "16/9" : undefined,
          backgroundColor: "var(--muted, #1a1a1a)",
        }}
      />
    );
  }

  return (
    <div
      ref={videoRef}
      className={className}
      style={{
        width,
        height: height === "auto" ? undefined : height,
      }}
      data-vjs-player
    />
  );
}

export default YouTubePlayer;
