"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface FacebookEmbedProps {
  /** The Facebook post URL to embed */
  url: string;
  /** Optional class name for styling */
  className?: string;
  /** Width of the embed (default: 500) */
  width?: number;
  /** Show the full post text (default: true) */
  showText?: boolean;
  /** Embed type: post or video */
  type?: "post" | "video";
  /** Callback when post loads */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

// Declare Facebook SDK type
declare global {
  interface Window {
    FB?: {
      init: (params: {
        appId?: string;
        version: string;
        xfbml: boolean;
      }) => void;
      XFBML: {
        parse: (element?: HTMLElement, callback?: () => void) => void;
      };
    };
    fbAsyncInit?: () => void;
  }
}

// Load Facebook SDK script once
let fbScriptLoadPromise: Promise<void> | null = null;

function loadFacebookScript(): Promise<void> {
  if (fbScriptLoadPromise) return fbScriptLoadPromise;

  fbScriptLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.FB) {
      resolve();
      return;
    }

    // Set up the async init callback
    window.fbAsyncInit = () => {
      window.FB?.init({
        version: "v18.0",
        xfbml: true,
      });
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onerror = () => {
      reject(new Error("Failed to load Facebook SDK"));
    };

    // Set a timeout for loading
    const timeout = setTimeout(() => {
      if (!window.FB) {
        reject(new Error("Facebook SDK load timeout"));
      }
    }, 10000);

    const originalInit = window.fbAsyncInit;
    window.fbAsyncInit = () => {
      clearTimeout(timeout);
      originalInit?.();
    };

    document.head.appendChild(script);
  });

  return fbScriptLoadPromise;
}

// Parse Facebook URL to extract post/video info
function parseFacebookUrl(url: string): { type: "post" | "video"; embedUrl: string } | null {
  try {
    const urlObj = new URL(url);

    // Video URLs
    if (url.includes("/videos/") || url.includes("/watch/")) {
      return { type: "video", embedUrl: url };
    }

    // Post URLs (including /posts/, /photos/, /permalink/)
    if (
      url.includes("/posts/") ||
      url.includes("/photos/") ||
      url.includes("/permalink/") ||
      urlObj.searchParams.has("story_fbid")
    ) {
      return { type: "post", embedUrl: url };
    }

    // Default to post
    return { type: "post", embedUrl: url };
  } catch {
    return null;
  }
}

export function FacebookEmbed({
  url,
  className = "",
  width = 500,
  showText = true,
  type,
  onLoad,
  onError,
}: FacebookEmbedProps) {
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

    const parsed = parseFacebookUrl(url);
    if (!parsed) {
      setHasError(true);
      onError?.(new Error("Invalid Facebook URL"));
      return;
    }

    const embedType = type || parsed.type;

    try {
      setIsLoading(true);
      setHasError(false);

      await loadFacebookScript();

      // Clear container and add Facebook embed div
      containerRef.current.innerHTML = "";

      if (embedType === "video") {
        // Video embed
        const videoDiv = document.createElement("div");
        videoDiv.className = "fb-video";
        videoDiv.setAttribute("data-href", url);
        videoDiv.setAttribute("data-width", width.toString());
        videoDiv.setAttribute("data-show-text", showText.toString());
        videoDiv.setAttribute("data-allowfullscreen", "true");
        containerRef.current.appendChild(videoDiv);
      } else {
        // Post embed
        const postDiv = document.createElement("div");
        postDiv.className = "fb-post";
        postDiv.setAttribute("data-href", url);
        postDiv.setAttribute("data-width", width.toString());
        postDiv.setAttribute("data-show-text", showText.toString());
        containerRef.current.appendChild(postDiv);
      }

      // Parse the new embed
      window.FB?.XFBML.parse(containerRef.current, () => {
        setIsLoading(false);
        onLoad?.();
      });

      // Set a timeout in case parse callback doesn't fire
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(error instanceof Error ? error : new Error("Failed to embed Facebook post"));
    }
  }, [url, width, showText, type, isClient, onLoad, onError]);

  useEffect(() => {
    embedPost();
  }, [embedPost]);

  // Server-side placeholder
  if (!isClient) {
    return (
      <div
        className={`facebook-embed-placeholder ${className}`}
        style={{
          minHeight: "200px",
          maxWidth: `${width}px`,
          backgroundColor: "var(--muted, #f5f5f5)",
          borderRadius: "8px",
          margin: "0 auto",
        }}
      />
    );
  }

  return (
    <div
      className={`facebook-embed ${className}`}
      style={{ maxWidth: `${width}px`, margin: "0 auto" }}
    >
      {isLoading && (
        <div
          className="facebook-embed-loading"
          style={{
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--muted, #f5f5f5)",
            borderRadius: "8px",
          }}
        >
          <div
            className="animate-pulse"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#1877F2",
              opacity: 0.5,
            }}
          />
        </div>
      )}

      {hasError && (
        <div
          className="facebook-embed-error"
          style={{
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--muted, #f5f5f5)",
            borderRadius: "8px",
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
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          <span style={{ color: "#666", fontSize: "14px" }}>
            Could not load Facebook post
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1877F2",
              fontSize: "14px",
              textDecoration: "underline",
            }}
          >
            View on Facebook
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

export default FacebookEmbed;
