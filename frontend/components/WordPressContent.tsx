"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { replaceImagesWithPlaceholders, type ContentImage } from "@/lib/content-images";
import { ContentImage as ContentImageComponent } from "./ContentImage";
import { sanitizeWordPressHtml } from "@/lib/sanitize";

const YouTubePlayer = dynamic(
  () => import("./YouTubePlayer").then((mod) => mod.YouTubePlayer),
  { ssr: false }
);

interface WordPressContentProps {
  html: string;
  className?: string;
}

interface YouTubeEmbed {
  id: string;
  videoId: string;
  autoplay: boolean;
  captions: boolean;
  captionLanguage: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&"]+)/,
    /youtube\.com\/embed\/([^?"]+)/,
    /youtu\.be\/([^?"]+)/,
    /youtube-nocookie\.com\/embed\/([^?"]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function parseYouTubeEmbeds(html: string): { processedHtml: string; embeds: YouTubeEmbed[] } {
  const embeds: YouTubeEmbed[] = [];
  let processedHtml = html;
  let embedIndex = 0;

  // Helper to create embed entry
  const createEmbed = (src: string) => {
    const videoId = extractYouTubeId(src);
    if (videoId) {
      const id = `yt-embed-${embedIndex++}`;
      embeds.push({
        id,
        videoId,
        autoplay: src.includes("autoplay=1"),
        captions: src.includes("cc_load_policy=1"),
        captionLanguage: "en",
      });
      return `<div data-youtube-placeholder="${id}" class="youtube-placeholder aspect-video"></div>`;
    }
    return null;
  };

  // Pattern 1: WordPress figure blocks with YouTube embeds (most common)
  // Matches: <figure class="wp-block-embed is-type-video is-provider-youtube...">
  const figurePattern = /<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<iframe[^>]*src="([^"]*(?:youtube|youtu\.be|youtube-nocookie)[^"]*)"[^>]*>[\s\S]*?<\/iframe>[\s\S]*?<\/figure>/gi;

  processedHtml = processedHtml.replace(figurePattern, (match, src) => {
    return createEmbed(src) || match;
  });

  // Pattern 2: WordPress embed wrapper divs
  const wrapperPattern = /<div[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<iframe[^>]*src="([^"]*(?:youtube|youtu\.be|youtube-nocookie)[^"]*)"[^>]*>[\s\S]*?<\/iframe>[\s\S]*?<\/div>/gi;

  processedHtml = processedHtml.replace(wrapperPattern, (match, src) => {
    return createEmbed(src) || match;
  });

  // Pattern 3: Any standalone YouTube iframe (catch-all)
  const iframePattern = /<iframe[^>]*src="([^"]*(?:youtube\.com\/embed|youtu\.be|youtube-nocookie\.com\/embed)[^"]*)"[^>]*>[\s\S]*?<\/iframe>/gi;

  processedHtml = processedHtml.replace(iframePattern, (match, src) => {
    return createEmbed(src) || match;
  });

  // Pattern 4: Custom shortcode output [youtube_player id="..."]
  const shortcodePattern = /<div[^>]*data-youtube-player[^>]*data-video-id="([^"]+)"([^>]*)>[\s\S]*?<\/div>/gi;

  processedHtml = processedHtml.replace(shortcodePattern, (match, videoId, attrs) => {
    const id = `yt-embed-${embedIndex++}`;
    const autoplayMatch = attrs.match(/data-autoplay="([^"]*)"/);
    const captionsMatch = attrs.match(/data-captions="([^"]*)"/);
    const captionLangMatch = attrs.match(/data-caption-language="([^"]*)"/);

    embeds.push({
      id,
      videoId,
      autoplay: autoplayMatch?.[1] === "true" || autoplayMatch?.[1] === "1",
      captions: captionsMatch?.[1] === "true" || captionsMatch?.[1] === "1",
      captionLanguage: captionLangMatch?.[1] || "en",
    });
    return `<div data-youtube-placeholder="${id}" class="youtube-placeholder aspect-video"></div>`;
  });

  // Pattern 5: Lite-youtube custom elements
  const liteYoutubePattern = /<lite-youtube[^>]*videoid="([^"]+)"[^>]*>[\s\S]*?<\/lite-youtube>/gi;

  processedHtml = processedHtml.replace(liteYoutubePattern, (match, videoId) => {
    const id = `yt-embed-${embedIndex++}`;
    embeds.push({
      id,
      videoId,
      autoplay: false,
      captions: false,
      captionLanguage: "en",
    });
    return `<div data-youtube-placeholder="${id}" class="youtube-placeholder aspect-video"></div>`;
  });

  return { processedHtml, embeds };
}

export function WordPressContent({ html, className = "" }: WordPressContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Parse content: sanitize first, then YouTube embeds, then images
  // Order matters: sanitization happens first for security
  const { processedHtml, embeds, images } = useMemo(() => {
    // First sanitize the HTML to prevent XSS attacks
    const sanitizedHtml = sanitizeWordPressHtml(html);
    // Then parse YouTube embeds
    const youtubeResult = parseYouTubeEmbeds(sanitizedHtml);
    // Then parse images from the YouTube-processed HTML
    const imageResult = replaceImagesWithPlaceholders(youtubeResult.processedHtml);

    return {
      processedHtml: imageResult.html,
      embeds: youtubeResult.embeds,
      images: imageResult.images,
    };
  }, [html]);

  // Single effect for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />

      {/* Render YouTube players via portals */}
      {mounted && embeds.map((embed) => (
        <YouTubePlayerPortal
          key={embed.id}
          targetId={embed.id}
          videoId={embed.videoId}
          autoplay={embed.autoplay}
          captions={embed.captions}
          captionLanguage={embed.captionLanguage}
          containerRef={containerRef}
        />
      ))}

      {/* Render optimized images via portals */}
      {mounted && images.map((image) => (
        <ContentImagePortal
          key={`content-image-${image.index}`}
          image={image}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

interface YouTubePlayerPortalProps {
  targetId: string;
  videoId: string;
  autoplay: boolean;
  captions: boolean;
  captionLanguage: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function YouTubePlayerPortal({
  targetId,
  videoId,
  autoplay,
  captions,
  captionLanguage,
  containerRef,
}: YouTubePlayerPortalProps) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current.querySelector(
      `[data-youtube-placeholder="${targetId}"]`
    );

    if (element && !element.hasAttribute("data-portal-ready")) {
      // Mark as ready and clear placeholder content once
      element.setAttribute("data-portal-ready", "true");
      element.textContent = "";
      setPortalTarget(element);
    }
  }, [containerRef, targetId]);

  // Use React portal to render into the placeholder element
  if (!portalTarget) return null;

  return createPortal(
    <div className="youtube-player-wrapper my-6">
      <YouTubePlayer
        videoId={videoId}
        autoplay={autoplay}
        muted={autoplay}
        captions={captions}
        captionLanguage={captionLanguage}
      />
    </div>,
    portalTarget
  );
}

interface ContentImagePortalProps {
  image: ContentImage;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ContentImagePortal({ image, containerRef }: ContentImagePortalProps) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current.querySelector(
      `[data-content-image="${image.index}"]`
    );

    if (element && !element.hasAttribute("data-portal-ready")) {
      // Mark as ready and clear placeholder content once
      element.setAttribute("data-portal-ready", "true");
      element.textContent = "";
      setPortalTarget(element);
    }
  }, [containerRef, image.index]);

  // Use React portal to render into the placeholder element
  if (!portalTarget) return null;

  return createPortal(
    <ContentImageComponent image={image} index={image.index} />,
    portalTarget
  );
}

export default WordPressContent;
