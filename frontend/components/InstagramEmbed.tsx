"use client";

import { useState } from "react";

interface InstagramEmbedProps {
  /** The Instagram post URL to embed */
  url: string;
  /** Optional class name for styling */
  className?: string;
  /** Max width of the embed (default: 540) */
  maxWidth?: number;
  /** Callback when post loads */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
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

// Determine embed type from URL for proper embed path
function getInstagramEmbedPath(url: string): string {
  if (url.includes("/reel/")) return "reel";
  if (url.includes("/tv/")) return "tv";
  return "p";
}

export function InstagramEmbed({
  url,
  className = "",
  maxWidth = 540,
  onLoad,
  onError,
}: InstagramEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const shortcode = extractInstagramShortcode(url);
  const embedPath = getInstagramEmbedPath(url);

  if (!shortcode) {
    return (
      <div
        className={`instagram-embed-error ${className}`}
        style={{
          minHeight: "100px",
          maxWidth: `${maxWidth}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--muted, #f5f5f5)",
          borderRadius: "3px",
          padding: "1rem",
          gap: "0.5rem",
          margin: "0 auto",
        }}
      >
        <span style={{ color: "#666", fontSize: "14px" }}>
          Invalid Instagram URL
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
    );
  }

  // Use Instagram's direct iframe embed - much faster than loading embed.js
  const embedUrl = `https://www.instagram.com/${embedPath}/${shortcode}/embed/`;

  return (
    <div
      className={`instagram-embed ${className}`}
      style={{ maxWidth: `${maxWidth}px`, margin: "0 auto" }}
    >
      {isLoading && (
        <div
          className="instagram-embed-loading"
          style={{
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--muted, #f5f5f5)",
            borderRadius: "3px",
            position: "absolute",
            inset: 0,
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

      <div style={{ position: "relative", display: hasError ? "none" : "block" }}>
        <iframe
          src={embedUrl}
          style={{
            width: "100%",
            minHeight: "500px",
            border: "none",
            overflow: "hidden",
            borderRadius: "3px",
            background: "#fff",
          }}
          allowFullScreen
          scrolling="no"
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            onError?.(new Error("Failed to load Instagram embed"));
          }}
        />
      </div>
    </div>
  );
}

export default InstagramEmbed;
