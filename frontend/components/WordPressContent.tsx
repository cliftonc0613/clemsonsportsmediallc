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


const FacebookEmbed = dynamic(
  () => import("./FacebookEmbed").then((mod) => mod.FacebookEmbed),
  { ssr: false }
);

const InstagramEmbed = dynamic(
  () => import("./InstagramEmbed").then((mod) => mod.InstagramEmbed),
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


interface FacebookEmbedData {
  id: string;
  url: string;
  type?: "post" | "video";
}

interface InstagramEmbedData {
  id: string;
  url: string;
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

/**
 * Check if content has Twitter embeds
 * We don't parse/replace Twitter embeds anymore - we let the HTML pass through
 * and load widgets.js to process the blockquotes natively
 */
function hasTwitterContent(html: string): boolean {
  return /twitter-tweet|is-provider-twitter|wp-block-embed-twitter/i.test(html);
}

/**
 * Parse Facebook embeds from WordPress content
 */
function parseFacebookEmbeds(html: string): { processedHtml: string; embeds: FacebookEmbedData[] } {
  const embeds: FacebookEmbedData[] = [];
  let processedHtml = html;
  let embedIndex = 0;

  // Pattern 1: WordPress Facebook embed blocks
  const figurePattern = /<figure[^>]*class="[^"]*wp-block-embed[^"]*is-provider-facebook[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*facebook\.com[^"]*)"[^>]*>[\s\S]*?<\/figure>/gi;

  processedHtml = processedHtml.replace(figurePattern, (match, url) => {
    const id = `facebook-embed-${embedIndex++}`;
    const type = url.includes("/videos/") || url.includes("/watch/") ? "video" : "post";
    embeds.push({ id, url, type });
    return `<div data-facebook-placeholder="${id}" class="facebook-placeholder my-6"></div>`;
  });

  // Pattern 2: Facebook iframe embeds
  const iframePattern = /<iframe[^>]*src="([^"]*facebook\.com\/plugins\/(?:post|video)[^"]*)"[^>]*>[\s\S]*?<\/iframe>/gi;

  processedHtml = processedHtml.replace(iframePattern, (match, src) => {
    // Extract the href parameter from the iframe src
    const hrefMatch = src.match(/href=([^&]+)/);
    if (hrefMatch) {
      const id = `facebook-embed-${embedIndex++}`;
      const url = decodeURIComponent(hrefMatch[1]);
      const type = src.includes("/video") ? "video" : "post";
      embeds.push({ id, url, type });
      return `<div data-facebook-placeholder="${id}" class="facebook-placeholder my-6"></div>`;
    }
    return match;
  });

  // Pattern 3: Facebook div embeds (fb-post, fb-video classes)
  const divPattern = /<div[^>]*class="[^"]*fb-(?:post|video)[^"]*"[^>]*data-href="([^"]*)"[^>]*>[\s\S]*?<\/div>/gi;

  processedHtml = processedHtml.replace(divPattern, (match, url) => {
    const id = `facebook-embed-${embedIndex++}`;
    const type = match.includes("fb-video") ? "video" : "post";
    embeds.push({ id, url, type });
    return `<div data-facebook-placeholder="${id}" class="facebook-placeholder my-6"></div>`;
  });

  return { processedHtml, embeds };
}

/**
 * Parse Instagram embeds from WordPress content
 */
function parseInstagramEmbeds(html: string): { processedHtml: string; embeds: InstagramEmbedData[] } {
  const embeds: InstagramEmbedData[] = [];
  let processedHtml = html;
  let embedIndex = 0;

  // Pattern 1: WordPress Instagram embed blocks
  const figurePattern = /<figure[^>]*class="[^"]*wp-block-embed[^"]*is-provider-instagram[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*instagram\.com\/(?:p|reel|tv)\/[^"]*)"[^>]*>[\s\S]*?<\/figure>/gi;

  processedHtml = processedHtml.replace(figurePattern, (match, url) => {
    const id = `instagram-embed-${embedIndex++}`;
    embeds.push({ id, url });
    return `<div data-instagram-placeholder="${id}" class="instagram-placeholder my-6"></div>`;
  });

  // Pattern 2: Instagram blockquote embeds (native Instagram embed code)
  const blockquotePattern = /<blockquote[^>]*class="[^"]*instagram-media[^"]*"[^>]*data-instgrm-permalink="([^"]*)"[^>]*>[\s\S]*?<\/blockquote>/gi;

  processedHtml = processedHtml.replace(blockquotePattern, (match, url) => {
    const id = `instagram-embed-${embedIndex++}`;
    embeds.push({ id, url });
    return `<div data-instagram-placeholder="${id}" class="instagram-placeholder my-6"></div>`;
  });

  // Pattern 3: Any Instagram blockquote with link
  const blockquoteLinkPattern = /<blockquote[^>]*class="[^"]*instagram-media[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*instagram\.com\/(?:p|reel|tv)\/[^"]*)"[^>]*>[\s\S]*?<\/blockquote>/gi;

  processedHtml = processedHtml.replace(blockquoteLinkPattern, (match, url) => {
    const id = `instagram-embed-${embedIndex++}`;
    embeds.push({ id, url });
    return `<div data-instagram-placeholder="${id}" class="instagram-placeholder my-6"></div>`;
  });

  return { processedHtml, embeds };
}

export function WordPressContent({ html, className = "" }: WordPressContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Parse content: sanitize first, then embeds, then images
  // Order matters: sanitization happens first for security
  // Note: Twitter embeds are NOT parsed - they pass through and widgets.js processes them
  const { processedHtml, youtubeEmbeds, hasTwitter, facebookEmbeds, instagramEmbeds, images } = useMemo(() => {
    // First sanitize the HTML to prevent XSS attacks
    const sanitizedHtml = sanitizeWordPressHtml(html);

    // Parse YouTube embeds
    const youtubeResult = parseYouTubeEmbeds(sanitizedHtml);

    // Check for Twitter content (don't parse - let widgets.js handle it)
    const hasTwitter = hasTwitterContent(youtubeResult.processedHtml);

    // Parse other social embeds in sequence (skip Twitter)
    const facebookResult = parseFacebookEmbeds(youtubeResult.processedHtml);
    const instagramResult = parseInstagramEmbeds(facebookResult.processedHtml);

    // Finally parse images from the fully processed HTML
    const imageResult = replaceImagesWithPlaceholders(instagramResult.processedHtml);

    return {
      processedHtml: imageResult.html,
      youtubeEmbeds: youtubeResult.embeds,
      hasTwitter,
      facebookEmbeds: facebookResult.embeds,
      instagramEmbeds: instagramResult.embeds,
      images: imageResult.images,
    };
  }, [html]);

  // Single effect for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load Twitter widgets.js to process blockquotes natively
  useEffect(() => {
    if (!mounted || !hasTwitter || !containerRef.current) return;

    // Check if widgets.js already loaded
    const existingScript = document.querySelector('script[src*="platform.twitter.com/widgets.js"]');

    const processTwitter = () => {
      // @ts-expect-error - twttr is loaded by widgets.js
      if (window.twttr?.widgets?.load) {
        // @ts-expect-error - twttr is loaded by widgets.js
        window.twttr.widgets.load(containerRef.current);
      }
    };

    if (existingScript) {
      // Script exists, just process
      processTwitter();
      return;
    }

    // Load widgets.js
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.onload = processTwitter;
    document.head.appendChild(script);
  }, [mounted, hasTwitter]);

  return (
    <div ref={containerRef} className={className}>
      {/* suppressHydrationWarning: Server uses regex sanitization, client uses DOMPurify.
          Content is intentionally re-sanitized on client for security. */}
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} suppressHydrationWarning />

      {/* Render YouTube players via portals */}
      {mounted && youtubeEmbeds.map((embed) => (
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

      {/* Twitter embeds are processed by widgets.js directly - no portal needed */}

      {/* Render Facebook embeds via portals */}
      {mounted && facebookEmbeds.map((embed) => (
        <FacebookEmbedPortal
          key={embed.id}
          targetId={embed.id}
          url={embed.url}
          type={embed.type}
          containerRef={containerRef}
        />
      ))}

      {/* Render Instagram embeds via portals */}
      {mounted && instagramEmbeds.map((embed) => (
        <InstagramEmbedPortal
          key={embed.id}
          targetId={embed.id}
          url={embed.url}
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

// TwitterEmbedPortal removed - Twitter blockquotes are now processed by widgets.js directly

interface FacebookEmbedPortalProps {
  targetId: string;
  url: string;
  type?: "post" | "video";
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function FacebookEmbedPortal({
  targetId,
  url,
  type,
  containerRef,
}: FacebookEmbedPortalProps) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current.querySelector(
      `[data-facebook-placeholder="${targetId}"]`
    );

    if (element && !element.hasAttribute("data-portal-ready")) {
      element.setAttribute("data-portal-ready", "true");
      element.textContent = "";
      setPortalTarget(element);
    }
  }, [containerRef, targetId]);

  if (!portalTarget) return null;

  return createPortal(
    <FacebookEmbed url={url} type={type} />,
    portalTarget
  );
}

interface InstagramEmbedPortalProps {
  targetId: string;
  url: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function InstagramEmbedPortal({
  targetId,
  url,
  containerRef,
}: InstagramEmbedPortalProps) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current.querySelector(
      `[data-instagram-placeholder="${targetId}"]`
    );

    if (element && !element.hasAttribute("data-portal-ready")) {
      element.setAttribute("data-portal-ready", "true");
      element.textContent = "";
      setPortalTarget(element);
    }
  }, [containerRef, targetId]);

  if (!portalTarget) return null;

  return createPortal(
    <InstagramEmbed url={url} />,
    portalTarget
  );
}

export default WordPressContent;
