"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface InstagramEmbedProps {
  /** The Instagram post URL to embed */
  url: string;
  /** Optional class name for styling */
  className?: string;
  /** Max width of the embed (default: 540) */
  maxWidth?: number;
  /** Hide caption (default: false) */
  hideCaptions?: boolean;
  /** Callback when post loads */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

// Declare Instagram embed type
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: (element?: HTMLElement) => void;
      };
    };
  }
}

// Extract Instagram shortcode from URL
function extractInstagramShortcode(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([^/?]+)/,
    /instagram\.com\/reel\/([^/?]+)/,
    /instagram\.com\/tv\/([^/?]+)/,
    /instagr\.am\/p\/([^/?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// Determine embed type from URL
function getInstagramEmbedType(url: string): "post" | "reel" | "tv" {
  if (url.includes("/reel/")) return "reel";
  if (url.includes("/tv/")) return "tv";
  return "post";
}

// Load Instagram embed.js script once
let igScriptLoadPromise: Promise<void> | null = null;

function loadInstagramScript(): Promise<void> {
  if (igScriptLoadPromise) return igScriptLoadPromise;

  igScriptLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.instgrm?.Embeds) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;

    script.onload = () => {
      // Instagram script loads async, wait for it to be ready
      const checkReady = () => {
        if (window.instgrm?.Embeds) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Instagram embed script"));
    };

    document.head.appendChild(script);
  });

  return igScriptLoadPromise;
}

export function InstagramEmbed({
  url,
  className = "",
  maxWidth = 540,
  hideCaptions = false,
  onLoad,
  onError,
}: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Track client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const embedPost = useCallback(async () => {
    if (!containerRef.current || !isClient) return;

    const shortcode = extractInstagramShortcode(url);
    if (!shortcode) {
      setHasError(true);
      onError?.(new Error("Invalid Instagram URL"));
      return;
    }

    const embedType = getInstagramEmbedType(url);

    try {
      setIsLoading(true);
      setHasError(false);

      await loadInstagramScript();

      // Clear container
      containerRef.current.innerHTML = "";

      // Build the blockquote element that Instagram expects
      const blockquote = document.createElement("blockquote");
      blockquote.className = "instagram-media";
      blockquote.setAttribute("data-instgrm-captioned", (!hideCaptions).toString());
      blockquote.setAttribute("data-instgrm-permalink", url);
      blockquote.setAttribute("data-instgrm-version", "14");
      blockquote.style.cssText = `
        background: #FFF;
        border: 0;
        border-radius: 3px;
        box-shadow: 0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15);
        margin: 1px;
        max-width: ${maxWidth}px;
        min-width: 326px;
        padding: 0;
        width: calc(100% - 2px);
      `;

      // Add placeholder link
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.cssText = `
        display: block;
        padding: 16px;
        text-align: center;
        color: #c9c8cd;
        font-family: Arial, sans-serif;
        font-size: 14px;
        text-decoration: none;
      `;
      link.textContent = `View this ${embedType} on Instagram`;

      blockquote.appendChild(link);
      containerRef.current.appendChild(blockquote);

      // Process the embed
      window.instgrm?.Embeds.process(containerRef.current);

      // Monitor for the embed to complete
      const checkLoaded = () => {
        const iframe = containerRef.current?.querySelector("iframe");
        if (iframe) {
          setIsLoading(false);
          onLoad?.();
          return;
        }
        // Keep checking for a bit
        setTimeout(checkLoaded, 200);
      };

      // Start checking after a delay
      setTimeout(checkLoaded, 500);

      // Timeout fallback
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          onLoad?.();
        }
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(error instanceof Error ? error : new Error("Failed to embed Instagram post"));
    }
  }, [url, maxWidth, hideCaptions, isClient, isLoading, onLoad, onError]);

  useEffect(() => {
    embedPost();
  }, [embedPost]);

  // Server-side placeholder
  if (!isClient) {
    return (
      <div
        className={`instagram-embed-placeholder ${className}`}
        style={{
          minHeight: "400px",
          maxWidth: `${maxWidth}px`,
          backgroundColor: "var(--muted, #f5f5f5)",
          borderRadius: "3px",
          margin: "0 auto",
        }}
      />
    );
  }

  return (
    <div
      className={`instagram-embed ${className}`}
      style={{ maxWidth: `${maxWidth}px`, margin: "0 auto" }}
    >
      {isLoading && (
        <div
          className="instagram-embed-loading"
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--muted, #f5f5f5)",
            borderRadius: "3px",
          }}
        >
          <div
            className="animate-pulse"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              opacity: 0.5,
            }}
          />
        </div>
      )}

      {hasError && (
        <div
          className="instagram-embed-error"
          style={{
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--muted, #f5f5f5)",
            borderRadius: "3px",
            padding: "1rem",
            gap: "0.5rem",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#666" }}
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span style={{ color: "#666", fontSize: "14px" }}>
            Could not load Instagram post
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#E1306C",
              fontSize: "14px",
              textDecoration: "underline",
            }}
          >
            View on Instagram
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          display: isLoading || hasError ? "none" : "block",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

export default InstagramEmbed;
