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
  // If it's already just an ID (numeric string)
  if (/^\d+$/.test(input)) {
    return input;
  }

  // Match Twitter/X URL patterns - extract just the numeric ID
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

  // Return input as-is if no pattern matches
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const id = extractTweetId(tweetId);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setHasError(false);

    // Use Twitter's publish embed endpoint
    const embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=${theme}&dnt=true`;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframeRef.current = iframe;
    iframe.src = embedUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 800px;
      border: none;
      display: block;
      overflow: hidden;
    `;
    iframe.allowFullscreen = true;
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");

    // Handle load
    iframe.onload = () => {
      setIsLoading(false);
      onLoad?.();
    };

    iframe.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.(new Error("Failed to load tweet"));
    };

    // Clear and append
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(iframe);

    // Listen for height messages from Twitter
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://platform.twitter.com") return;

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // Twitter sends height in twttr.embed object
        if (data["twttr.embed"]) {
          const embedData = data["twttr.embed"];
          if (embedData.height && iframeRef.current) {
            const newHeight = parseInt(embedData.height, 10);
            iframeRef.current.style.height = `${newHeight}px`;
          }
        }

        // Also check for direct height property
        if (data.height && iframeRef.current) {
          const newHeight = parseInt(data.height, 10);
          iframeRef.current.style.height = `${newHeight}px`;
        }
      } catch {
        // Ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);

    // Timeout fallback for loading state
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", handleMessage);
      iframeRef.current = null;
    };
  }, [id, theme, onLoad, onError]);

  return (
    <div
      className={`twitter-embed ${className}`}
      style={{ maxWidth: "550px", margin: "0 auto" }}
    >
      {isLoading && (
        <div
          className="twitter-embed-loading"
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
          className="twitter-embed-error"
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
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
          <span style={{ color: "#666", fontSize: "14px" }}>
            Could not load tweet
          </span>
          <a
            href={`https://twitter.com/i/status/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1DA1F2",
              fontSize: "14px",
              textDecoration: "underline",
            }}
          >
            View on Twitter
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          display: isLoading || hasError ? "none" : "block",
        }}
      />
    </div>
  );
}

export default TwitterEmbed;
