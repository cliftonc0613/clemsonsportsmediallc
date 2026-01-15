"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TwitterEmbedProps {
  /** The tweet URL or tweet ID to embed */
  tweetId: string;
  /** Optional class name for styling */
  className?: string;
  /** Theme: light or dark */
  theme?: "light" | "dark";
  /** Align: left, center, or right */
  align?: "left" | "center" | "right";
  /** Hide conversation thread */
  hideConversation?: boolean;
  /** Hide media (images, videos, GIFs) */
  hideMedia?: boolean;
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
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: Record<string, unknown>
        ) => Promise<HTMLElement | undefined>;
      };
      ready: (callback: () => void) => void;
      _e?: Array<() => void>;
    };
  }
}

// Extract tweet ID from various URL formats
function extractTweetId(input: string): string {
  // If it's already just an ID (numeric string)
  if (/^\d+$/.test(input)) {
    return input;
  }

  // Match Twitter/X URL patterns
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
let scriptLoadPromise: Promise<void> | null = null;

function loadTwitterScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.twttr?.widgets) {
      resolve();
      return;
    }

    // Initialize twttr queue
    window.twttr = window.twttr || ({ _e: [] } as unknown as typeof window.twttr);

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => {
      window.twttr?.ready(() => {
        resolve();
      });
    };

    script.onerror = () => {
      reject(new Error("Failed to load Twitter widgets script"));
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export function TwitterEmbed({
  tweetId,
  className = "",
  theme = "light",
  align = "center",
  hideConversation = false,
  hideMedia = false,
  onLoad,
  onError,
}: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Track client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const embedTweet = useCallback(async () => {
    if (!containerRef.current || !isClient) return;

    const id = extractTweetId(tweetId);

    try {
      setIsLoading(true);
      setHasError(false);

      await loadTwitterScript();

      // Clear container
      containerRef.current.innerHTML = "";

      // Build options
      const options: Record<string, unknown> = {
        theme,
        align,
        dnt: true, // Do not track
      };

      if (hideConversation) {
        options.conversation = "none";
      }

      if (hideMedia) {
        options.cards = "hidden";
      }

      // Create the tweet embed
      const tweetElement = await window.twttr?.widgets.createTweet(
        id,
        containerRef.current,
        options
      );

      if (tweetElement) {
        setIsLoading(false);
        onLoad?.();
      } else {
        throw new Error("Tweet not found or could not be embedded");
      }
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(error instanceof Error ? error : new Error("Failed to embed tweet"));
    }
  }, [tweetId, theme, align, hideConversation, hideMedia, isClient, onLoad, onError]);

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
          backgroundColor: "var(--muted, #f5f5f5)",
          borderRadius: "12px",
        }}
      />
    );
  }

  return (
    <div className={`twitter-embed ${className}`}>
      {isLoading && (
        <div
          className="twitter-embed-loading"
          style={{
            minHeight: "200px",
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
            href={`https://twitter.com/i/status/${extractTweetId(tweetId)}`}
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
        style={{ display: isLoading || hasError ? "none" : "block" }}
      />
    </div>
  );
}

export default TwitterEmbed;
