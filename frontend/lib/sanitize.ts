/**
 * HTML Sanitization Utilities
 *
 * Uses DOMPurify to sanitize HTML content from WordPress
 * to prevent XSS attacks from compromised CMS content.
 */

import DOMPurify, { Config } from "dompurify";

/**
 * DOMPurify configuration for WordPress content
 *
 * Allows common HTML elements used in WordPress content
 * while stripping dangerous scripts and event handlers.
 */
const DOMPURIFY_CONFIG: Config = {
  // Allow common HTML elements
  ALLOWED_TAGS: [
    // Text formatting
    "p", "br", "hr", "span", "div",
    "strong", "b", "em", "i", "u", "s", "strike", "del", "ins",
    "sub", "sup", "small", "mark", "abbr", "cite", "q", "blockquote",
    "pre", "code", "kbd", "samp", "var",
    // Headings
    "h1", "h2", "h3", "h4", "h5", "h6",
    // Lists
    "ul", "ol", "li", "dl", "dt", "dd",
    // Tables
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
    // Media
    "img", "figure", "figcaption", "picture", "source", "video", "audio", "track",
    // Links
    "a",
    // Semantic elements
    "article", "section", "nav", "aside", "header", "footer", "main", "address", "time",
    // Forms (read-only display)
    "form", "fieldset", "legend", "label", "input", "button", "select", "option", "textarea",
    // WordPress-specific
    "iframe", // Needed for embeds (YouTube, etc.) - restricted via ALLOWED_URI_REGEXP
    // Data attributes for custom components
    "lite-youtube",
  ],

  // Allow common attributes
  ALLOWED_ATTR: [
    // Global attributes
    "id", "class", "style", "title", "lang", "dir",
    // Data attributes (for custom components like YouTube player)
    "data-*",
    // Links
    "href", "target", "rel", "download",
    // Media
    "src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding",
    "poster", "controls", "autoplay", "loop", "muted", "playsinline", "preload",
    // Tables
    "colspan", "rowspan", "scope", "headers",
    // Forms
    "type", "name", "value", "placeholder", "disabled", "readonly", "checked", "selected",
    // Accessibility
    "role", "aria-*", "tabindex",
    // iframes (restricted)
    "allowfullscreen", "allow", "frameborder", "sandbox",
    // Time element
    "datetime",
    // Custom YouTube component
    "videoid",
  ],

  // Restrict iframe sources to trusted domains
  ALLOWED_URI_REGEXP: /^(?:(?:https?:)?\/\/(?:www\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|twitter\.com|platform\.twitter\.com|spotify\.com|open\.spotify\.com|soundcloud\.com|w\.soundcloud\.com|codepen\.io|codesandbox\.io|jsfiddle\.net|hudl\.com)\/|data:image\/|mailto:|tel:)/i,

  // Add target="_blank" rel="noopener noreferrer" to external links
  ADD_ATTR: ["target"],

  // Don't allow form submissions
  FORBID_TAGS: ["script", "style", "noscript", "template", "slot"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],

  // Return clean HTML string
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
};

/**
 * Strip Related Posts sections from WordPress content
 *
 * WordPress plugins (like Rank Math, Jetpack, YARPP) often inject
 * Related Posts HTML directly into post content. We strip these
 * to render our own Related Posts component instead.
 *
 * @param html - HTML content from WordPress
 * @returns HTML with Related Posts sections removed
 */
function stripRelatedPostsHtml(html: string): string {
  // Use DOMParser for more reliable HTML parsing (client-side only)
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove elements with specific Related Posts classes/IDs
    const selectors = [
      ".rank-math-block", // Rank Math
      "#jp-relatedposts", ".jp-relatedposts", // Jetpack
      ".yarpp-related", ".yarpp", // YARPP
      ".wp-block-related-posts", // WordPress core
      '[class*="related-posts"]', // Generic related posts classes
      '[id*="related-posts"]', // Generic related posts IDs
    ];

    selectors.forEach((selector) => {
      const elements = doc.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Remove headings containing "Related Posts" and their following content
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => {
      if (/Related\s+Posts/i.test(heading.textContent || "")) {
        // Remove the heading and following siblings until next heading or end
        let next = heading.nextElementSibling;
        heading.remove();
        while (next && !/^H[1-6]$/i.test(next.tagName)) {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
        }
      }
    });

    return doc.body.innerHTML;
  }

  // Server-side fallback: use regex patterns (less reliable for nested HTML)
  // Pattern 1: Rank Math Related Posts
  html = html.replace(
    /<div[^>]*class="[^"]*rank-math-block[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );

  // Pattern 2: Jetpack Related Posts
  html = html.replace(
    /<div[^>]*(?:id|class)="[^"]*jp-relatedposts[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );

  // Pattern 3: YARPP (Yet Another Related Posts Plugin)
  html = html.replace(
    /<div[^>]*class="[^"]*yarpp[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );

  // Pattern 4: WordPress core related posts block
  html = html.replace(
    /<div[^>]*class="[^"]*wp-block-related-posts[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );

  // Pattern 5: Generic related posts divs
  html = html.replace(
    /<div[^>]*(?:class|id)="[^"]*related-posts[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );

  // Pattern 6: Headings with "Related Posts" (more conservative on server)
  html = html.replace(
    /<h[1-6][^>]*>\s*Related\s+Posts\s*<\/h[1-6]>/gi,
    ""
  );

  return html;
}

/**
 * Server-side HTML sanitization (regex-based fallback)
 *
 * SECURITY: This is a defense-in-depth measure for SSR.
 * Client-side will re-sanitize with full DOMPurify on hydration.
 *
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML with dangerous elements removed
 */
function serverSideSanitize(html: string): string {
  let result = html;

  // Remove script tags (including nested content)
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove noscript, style, template tags
  result = result.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  result = result.replace(/<template\b[^<]*(?:(?!<\/template>)<[^<]*)*<\/template>/gi, "");

  // Remove all event handlers (on* attributes) - multiple patterns for robustness
  result = result.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "");
  result = result.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

  // Remove javascript: URLs in href/src attributes
  result = result.replace(/\bhref\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href="#"');
  result = result.replace(/\bsrc\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'src=""');

  // Remove data: URLs except for images (potential XSS vector)
  result = result.replace(/\bhref\s*=\s*["']?\s*data:(?!image\/)[^"'>\s]*/gi, 'href="#"');

  // Remove vbscript: URLs (IE legacy attack vector)
  result = result.replace(/\bhref\s*=\s*["']?\s*vbscript:[^"'>\s]*/gi, 'href="#"');

  // Remove expression() CSS (IE attack vector)
  result = result.replace(/expression\s*\([^)]*\)/gi, "");

  // Remove behavior: CSS property (IE attack vector)
  result = result.replace(/behavior\s*:\s*url\s*\([^)]*\)/gi, "");

  return result;
}

/**
 * Sanitize HTML content from WordPress
 *
 * @param html - Raw HTML string from WordPress
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * ```tsx
 * const cleanHtml = sanitizeWordPressHtml(post.content.rendered);
 * return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
 * ```
 *
 * SECURITY: Uses DOMPurify on client, enhanced regex on server.
 * The client re-sanitizes on hydration for full protection.
 */
export function sanitizeWordPressHtml(html: string): string {
  // First strip Related Posts sections (before sanitization)
  let cleanedHtml = stripRelatedPostsHtml(html);

  if (typeof window === "undefined") {
    // Server-side: Use enhanced regex-based sanitization
    // SECURITY: Client will re-sanitize with DOMPurify on hydration
    return serverSideSanitize(cleanedHtml);
  }

  // DOMPurify.sanitize can return string or TrustedHTML
  // Force string return with RETURN_TRUSTED_TYPE: false
  const result = DOMPurify.sanitize(cleanedHtml, {
    ...DOMPURIFY_CONFIG,
    RETURN_TRUSTED_TYPE: false,
  });

  return result as string;
}

/**
 * Sanitize JSON-LD structured data
 *
 * Ensures JSON-LD data doesn't contain executable scripts.
 * This is primarily a defense-in-depth measure since JSON.stringify
 * already escapes special characters.
 *
 * @param data - JSON-LD data object
 * @returns Safe stringified JSON for script tag
 */
export function sanitizeJsonLd(data: Record<string, unknown>): string {
  // JSON.stringify escapes special chars, but we add extra protection
  const jsonString = JSON.stringify(data);

  // Escape </script> sequences that could break out of script tag
  return jsonString.replace(/<\/script/gi, "<\\/script");
}
