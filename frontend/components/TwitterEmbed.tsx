"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

// Declare Twitter widgets type
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
      ready: (callback: () => void) => void;
    };
  }
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

// Load Twitter widgets.js script once
let twitterScriptLoadPromise: Promise<void> | null = null;

function loadTwitterScript(): Promise<void> {
  if (twitterScriptLoadPromise) return twitterScriptLoadPromise;

  twitterScriptLoadPromise = new Promise((resolve) => {
    // Check if already loaded
    if (window.twttr?.widgets?.load) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="platform.twitter.com/widgets.js"]'
    );
    if (existingScript) {
      // Wait for it to load
      const checkReady = () => {
        if (window.twttr?.widgets?.load) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
      return;
    }

    // Load fresh script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => {
      const checkReady = () => {
        if (window.twttr?.widgets?.load) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    document.head.appendChild(script);
  });

  return twitterScriptLoadPromise;
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
  const [isClient, setIsClient] = useState(false);

  const id = extractTweetId(tweetId);

  // Track client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const embedTweet = useCallback(async () => {
    if (!containerRef.current || !isClient) return;

    try {
      setIsLoading(true);
      setHasError(false);

      // Build the tweet URL
      const tweetUrl = `https://twitter.com/i/status/${id}`;

      // Create the blockquote element that Twitter expects
      // This is the same format used on the production site
      const blockquote = document.createElement("blockquote");
      blockquote.className = "twitter-tweet";
      blockquote.setAttribute("data-theme", theme);
      blockquote.setAttribute("data-dnt", "true");

      // Add a link to the tweet (required by Twitter)
      const link = document.createElement("a");
      link.href = tweetUrl;
      blockquote.appendChild(link);

      // Clear container and add blockquote
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(blockquote);

      // Load Twitter widgets.js and process the blockquote
      await loadTwitterScript();

      // Let Twitter process the blockquote
      window.twttr?.widgets.load(containerRef.current);

      // Watch for the embed to be rendered
      const checkRendered = () => {
        const rendered = containerRef.current?.querySelector(
          ".twitter-tweet-rendered, iframe"
        );
        if (rendered) {
          setIsLoading(false);
          onLoad?.();
          return;
        }
        // Keep checking
        setTimeout(checkRendered, 200);
      };

      // Start checking after a delay
      setTimeout(checkRendered, 500);

      // Timeout fallback
      setTimeout(() => {
        setIsLoading(false);
        // Check if it actually rendered
        const rendered = containerRef.current?.querySelector(
          ".twitter-tweet-rendered, iframe"
        );
        if (!rendered) {
          setHasError(true);
          onError?.(new Error("Tweet failed to render"));
        } else {
          onLoad?.();
        }
      }, 8000);
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(
        error instanceof Error ? error : new Error("Failed to embed tweet")
      );
    }
  }, [id, theme, isClient, onLoad, onError]);

  useEffect(() => {
    embedTweet();
  }, [embedTweet]);

  // Server-side placeholder
  if (!isClient) {
    return (
      <div
        className={`twitter-embed-placeholder ${className}`}
        style={{
          minHeight: "200px",
          maxWidth: "550px",
          backgroundColor: "var(--muted, #f5f5f5)",
          borderRadius: "12px",
          margin: "0 auto",
        }}
      />
    );
  }

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
