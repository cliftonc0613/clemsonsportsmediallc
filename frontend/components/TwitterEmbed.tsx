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
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: {
            theme?: "light" | "dark";
            dnt?: boolean;
            conversation?: "none" | "all";
          }
        ) => Promise<HTMLElement | undefined>;
      };
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

// Load Twitter widgets.js script with polling for readiness
let twttrScriptLoadPromise: Promise<void> | null = null;

function loadTwitterWidgets(): Promise<void> {
  if (twttrScriptLoadPromise) return twttrScriptLoadPromise;

  twttrScriptLoadPromise = new Promise((resolve, reject) => {
    // If already loaded and ready
    if (window.twttr?.widgets?.createTweet) {
      resolve();
      return;
    }

    // Poll function to check if twttr is ready
    const pollForReady = () => {
      const poll = setInterval(() => {
        if (window.twttr?.widgets?.createTweet) {
          clearInterval(poll);
          resolve();
        }
      }, 50);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(poll);
        if (!window.twttr?.widgets?.createTweet) {
          reject(new Error("Twitter widgets.js load timeout"));
        }
      }, 10000);
    };

    // Check if script already exists but not ready yet
    const existingScript = document.querySelector(
      'script[src*="platform.twitter.com/widgets.js"]'
    );
    if (existingScript) {
      pollForReady();
      return;
    }

    // Load fresh script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;

    script.onload = () => {
      pollForReady();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Twitter widgets.js"));
    };

    document.head.appendChild(script);
  });

  return twttrScriptLoadPromise;
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

      // Clear container
      containerRef.current.innerHTML = "";

      // Load Twitter widgets.js
      await loadTwitterWidgets();

      // Create tweet using Twitter's official API
      // This automatically handles height sizing
      const element = await window.twttr?.widgets.createTweet(
        id,
        containerRef.current,
        {
          theme,
          dnt: true,
        }
      );

      if (element) {
        setIsLoading(false);
        onLoad?.();
      } else {
        // Tweet might not exist or be private
        setIsLoading(false);
        setHasError(true);
        onError?.(new Error("Tweet not found or unavailable"));
      }
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
