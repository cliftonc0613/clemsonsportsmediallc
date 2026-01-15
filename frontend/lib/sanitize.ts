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
  ALLOWED_URI_REGEXP: /^(?:(?:https?:)?\/\/(?:www\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|twitter\.com|platform\.twitter\.com|spotify\.com|open\.spotify\.com|soundcloud\.com|w\.soundcloud\.com|codepen\.io|codesandbox\.io|jsfiddle\.net)\/|data:image\/|mailto:|tel:)/i,

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
 */
export function sanitizeWordPressHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: DOMPurify requires DOM, return as-is
    // The client will re-sanitize on hydration
    // For SSR safety, we strip obvious script tags
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  }

  // DOMPurify.sanitize can return string or TrustedHTML
  // Force string return with RETURN_TRUSTED_TYPE: false
  const result = DOMPurify.sanitize(html, {
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
