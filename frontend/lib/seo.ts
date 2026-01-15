/**
 * SEO Library - RankMath Integration
 * Fetch and parse SEO metadata from WordPress RankMath plugin
 */

import type { Metadata } from "next";

// =============================================================================
// TypeScript Interfaces
// =============================================================================

/**
 * Parsed SEO metadata from RankMath
 */
export interface RankMathMeta {
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  og_url: string | null;
  og_site_name: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  schema: string[];
}

/**
 * RankMath API response shape
 */
export interface RankMathResponse {
  success: boolean;
  head: string;
}

// =============================================================================
// HTML Parsing Utilities
// =============================================================================

/**
 * Extract content from meta tag with property attribute (for og:* tags)
 * @param html - HTML string containing meta tags
 * @param property - Property name to extract (e.g., "og:title")
 * @returns Content value or null if not found
 */
export function extractMetaProperty(html: string, property: string): string | null {
  // Match: <meta property="og:title" content="...">
  const regex = new RegExp(
    `<meta[^>]+property=["']${escapeRegExp(property)}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return decodeHtmlEntities(match[1]);

  // Also try reversed order: content before property
  const regexReversed = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${escapeRegExp(property)}["']`,
    "i"
  );
  const matchReversed = html.match(regexReversed);
  if (matchReversed) return decodeHtmlEntities(matchReversed[1]);

  return null;
}

/**
 * Extract content from meta tag with name attribute (for standard meta tags)
 * @param html - HTML string containing meta tags
 * @param name - Name attribute value (e.g., "description", "robots")
 * @returns Content value or null if not found
 */
export function extractMetaName(html: string, name: string): string | null {
  // Match: <meta name="description" content="...">
  const regex = new RegExp(
    `<meta[^>]+name=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return decodeHtmlEntities(match[1]);

  // Also try reversed order: content before name
  const regexReversed = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${escapeRegExp(name)}["']`,
    "i"
  );
  const matchReversed = html.match(regexReversed);
  if (matchReversed) return decodeHtmlEntities(matchReversed[1]);

  return null;
}

/**
 * Extract title from HTML head
 * @param html - HTML string containing title tag
 * @returns Title text or null if not found
 */
function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? decodeHtmlEntities(match[1]) : null;
}

/**
 * Extract canonical URL from link tag
 * @param html - HTML string containing link tags
 * @returns Canonical URL or null if not found
 */
function extractCanonical(html: string): string | null {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  if (match) return match[1];

  // Try reversed order
  const matchReversed = html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  return matchReversed ? matchReversed[1] : null;
}

/**
 * Extract JSON-LD schema scripts from HTML
 * @param html - HTML string containing script tags
 * @returns Array of JSON-LD schema strings
 */
function extractSchemas(html: string): string[] {
  const schemas: string[] = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    schemas.push(match[1].trim());
  }
  return schemas;
}

/**
 * Parse full RankMath head HTML into structured metadata
 * @param html - HTML string from RankMath getHead endpoint
 * @returns Parsed RankMathMeta object
 */
export function parseRankMathHead(html: string): RankMathMeta {
  return {
    title: extractTitle(html),
    description: extractMetaName(html, "description"),
    canonical: extractCanonical(html),
    robots: extractMetaName(html, "robots"),
    og_title: extractMetaProperty(html, "og:title"),
    og_description: extractMetaProperty(html, "og:description"),
    og_image: extractMetaProperty(html, "og:image"),
    og_type: extractMetaProperty(html, "og:type"),
    og_url: extractMetaProperty(html, "og:url"),
    og_site_name: extractMetaProperty(html, "og:site_name"),
    twitter_card: extractMetaName(html, "twitter:card"),
    twitter_title: extractMetaName(html, "twitter:title"),
    twitter_description: extractMetaName(html, "twitter:description"),
    twitter_image: extractMetaName(html, "twitter:image"),
    schema: extractSchemas(html),
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Escape special regex characters in string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Decode common HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&#39;": "'",
    "&#8217;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&nbsp;": " ",
    "&#x27;": "'",
    "&#x2F;": "/",
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Get RankMath API base URL from WordPress API URL
 * RankMath uses /wp-json/rankmath/v1/ instead of /wp-json/wp/v2/
 */
function getRankMathApiUrl(): string | null {
  const wpApiUrl = process.env.WORDPRESS_API_URL;
  if (!wpApiUrl) return null;

  // Replace /wp/v2 with empty string to get base /wp-json/ URL
  // Then append rankmath/v1
  const baseUrl = wpApiUrl.replace(/\/wp\/v2\/?$/, "");
  return `${baseUrl}/rankmath/v1`;
}

// =============================================================================
// Main API Function
// =============================================================================

/**
 * Fetch SEO metadata from RankMath for a specific page URL
 * @param pageUrl - Full URL of the page to get metadata for
 * @returns Parsed RankMathMeta or null if fetch fails
 */
export async function getRankMathMeta(pageUrl: string): Promise<RankMathMeta | null> {
  const apiUrl = getRankMathApiUrl();
  if (!apiUrl) {
    console.warn("RankMath SEO: WORDPRESS_API_URL not configured");
    return null;
  }

  try {
    const endpoint = `${apiUrl}/getHead?url=${encodeURIComponent(pageUrl)}`;

    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.warn(`RankMath SEO: API returned ${response.status} for ${pageUrl}`);
      return null;
    }

    const data: RankMathResponse = await response.json();

    if (!data.success || !data.head) {
      console.warn(`RankMath SEO: No head data returned for ${pageUrl}`);
      return null;
    }

    return parseRankMathHead(data.head);
  } catch (error) {
    console.error("RankMath SEO: Failed to fetch metadata:", error);
    return null;
  }
}

// =============================================================================
// Next.js Metadata Helper
// =============================================================================

/**
 * Convert RankMath metadata to Next.js Metadata format
 * Falls back to provided fallback metadata when RankMath data is unavailable
 * @param meta - Parsed RankMath metadata or null
 * @param fallback - Fallback metadata to use when RankMath data is unavailable
 * @returns Next.js Metadata object
 */
export function generateSeoMetadata(
  meta: RankMathMeta | null,
  fallback: Metadata
): Metadata {
  // If no RankMath data, return fallback
  if (!meta) {
    return fallback;
  }

  // Build metadata object, preferring RankMath data but falling back as needed
  const metadata: Metadata = {
    title: meta.title || fallback.title,
    description: meta.description || fallback.description,
  };

  // Canonical URL
  if (meta.canonical) {
    metadata.alternates = {
      canonical: meta.canonical,
    };
  }

  // Robots directives
  if (meta.robots) {
    const robotsDirectives = meta.robots.split(",").map((d) => d.trim().toLowerCase());
    metadata.robots = {
      index: !robotsDirectives.includes("noindex"),
      follow: !robotsDirectives.includes("nofollow"),
    };
  }

  // OpenGraph
  const hasOgData = meta.og_title || meta.og_description || meta.og_image;
  const fallbackOg = fallback.openGraph;

  if (hasOgData || fallbackOg) {
    metadata.openGraph = {
      title: meta.og_title || (fallbackOg && "title" in fallbackOg ? fallbackOg.title : undefined),
      description:
        meta.og_description ||
        (fallbackOg && "description" in fallbackOg ? fallbackOg.description : undefined),
      url: meta.og_url || (fallbackOg && "url" in fallbackOg ? fallbackOg.url : undefined),
      siteName:
        meta.og_site_name ||
        (fallbackOg && "siteName" in fallbackOg ? fallbackOg.siteName : undefined),
      images: meta.og_image
        ? [{ url: meta.og_image }]
        : fallbackOg && "images" in fallbackOg
          ? fallbackOg.images
          : undefined,
      type: (meta.og_type as "website" | "article") ||
        (fallbackOg && "type" in fallbackOg ? fallbackOg.type : undefined),
    };
  }

  // Twitter
  const hasTwitterData =
    meta.twitter_card || meta.twitter_title || meta.twitter_description || meta.twitter_image;
  const fallbackTwitter = fallback.twitter;

  if (hasTwitterData || fallbackTwitter) {
    metadata.twitter = {
      card:
        (meta.twitter_card as "summary" | "summary_large_image" | "player" | "app") ||
        (fallbackTwitter && "card" in fallbackTwitter ? fallbackTwitter.card : "summary_large_image"),
      title:
        meta.twitter_title ||
        (fallbackTwitter && "title" in fallbackTwitter ? fallbackTwitter.title : undefined),
      description:
        meta.twitter_description ||
        (fallbackTwitter && "description" in fallbackTwitter
          ? fallbackTwitter.description
          : undefined),
      images: meta.twitter_image
        ? [meta.twitter_image]
        : fallbackTwitter && "images" in fallbackTwitter
          ? fallbackTwitter.images
          : undefined,
    };
  }

  return metadata;
}
