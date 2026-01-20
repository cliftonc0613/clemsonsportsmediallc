"use client";

import { useEffect, useRef, useState } from "react";

interface TwitterEmbedProps {
  /** The tweet URL or tweet ID to embed */
  tweetId: string;
  /** Optional class name for styling */
  className?: string;
  /** Theme: light or dark */
  theme?: "light" | "dark";
  /** Callback when tweet loads */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

// Extract tweet ID from various URL formats
function extractTweetId(input: string): string {
  if (/^\d+$/.test(input)) {
    return input;
  }

  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /twitter\.com\/i\/web\/status\/(\d+)/,
    /x\.com\/i\/web\/status\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }

  return input;
}

export function TwitterEmbed({
  tweetId,
  className = "",
  theme = "light",
  onLoad,
  onError,
}: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const id = extractTweetId(tweetId);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setHasError(false);

    // Use Twitter's publish embed endpoint - simple iframe approach
    const embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=${theme}&dnt=true`;

    const iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.style.cssText = `
      width: 100%;
      min-height: 250px;
      border: none;
      display: block;
    `;
    iframe.allowFullscreen = true;
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");

    iframe.onload = () => {
      setIsLoading(false);
      onLoad?.();
    };

    iframe.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.(new Error("Failed to load tweet"));
    };

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(iframe);

    // Listen for resize messages from Twitter iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://platform.twitter.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data["twttr.embed"]?.height) {
          iframe.style.height = `${data["twttr.embed"].height}px`;
        }
        if (data.height) {
          iframe.style.height = `${data.height}px`;
        }
      } catch {
        // Ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);

    const timeout = setTimeout(() => setIsLoading(false), 5000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", handleMessage);
    };
  }, [id, theme, onLoad, onError]);

  return (
    <div className={`twitter-embed ${className}`} style={{ maxWidth: "550px", margin: "0 auto" }}>
      {isLoading && (
        <div
          style={{
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--muted, #f5f5f5)",
            borderRadius: "12px",
          }}
        >
          <div
            className="animate-pulse"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#1DA1F2",
              opacity: 0.5,
            }}
          />
        </div>
      )}

      {hasError && (
        <div
          style={{
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--muted, #f5f5f5)",
            borderRadius: "12px",
            padding: "1rem",
            gap: "0.5rem",
          }}
        >
          <span style={{ color: "#666", fontSize: "14px" }}>Could not load tweet</span>
          <a
            href={`https://twitter.com/i/status/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1DA1F2", fontSize: "14px", textDecoration: "underline" }}
          >
            View on Twitter
          </a>
        </div>
      )}

      <div ref={containerRef} style={{ display: isLoading || hasError ? "none" : "block" }} />
    </div>
  );
}

export default TwitterEmbed;
