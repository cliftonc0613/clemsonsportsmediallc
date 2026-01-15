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

// Declare Twitter widgets type
declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: {
            theme?: string;
            dnt?: boolean;
            conversation?: string;
            cards?: string;
            align?: string;
          }
        ) => Promise<HTMLElement | undefined>;
      };
      ready?: (callback: () => void) => void;
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

// Load Twitter widgets.js script
function loadTwitterScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.twttr?.widgets) {
      resolve();
      return;
    }

    // Check if script is already in DOM
    if (document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.twttr?.widgets) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.twttr?.widgets) {
          resolve();
        } else {
          reject(new Error("Twitter script timeout"));
        }
      }, 10000);
      return;
    }

    // Add new script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => {
      // Twitter widgets.js calls twttr.ready when ready
      if (window.twttr?.ready) {
        window.twttr.ready(() => resolve());
      } else {
        resolve();
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Twitter widgets script"));
    };

    document.head.appendChild(script);
  });
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
    let mounted = true;

    async function embedTweet() {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setHasError(false);

        // Load Twitter script
        await loadTwitterScript();

        if (!mounted || !containerRef.current) return;

        // Clear container
        containerRef.current.innerHTML = "";

        // Create tweet using Twitter's official API
        const tweetElement = await window.twttr?.widgets.createTweet(
          id,
          containerRef.current,
          {
            theme,
            dnt: true,
            align: "center",
          }
        );

        if (!mounted) return;

        if (tweetElement) {
          setIsLoading(false);
          onLoad?.();
        } else {
          throw new Error("Tweet not found or could not be embedded");
        }
      } catch (error) {
        if (!mounted) return;

        setIsLoading(false);
        setHasError(true);
        onError?.(error instanceof Error ? error : new Error("Failed to embed tweet"));
      }
    }

    embedTweet();

    return () => {
      mounted = false;
    };
  }, [id, theme, onLoad, onError]);

  return (
    <div className={`twitter-embed ${className}`} style={{ maxWidth: "550px", margin: "1.5rem auto" }}>
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
