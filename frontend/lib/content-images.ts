/**
 * Content Image Parser Utilities
 *
 * Lightweight regex-based utilities to parse and transform img tags in WordPress HTML content.
 * Avoids heavy DOM parsers (jsdom/cheerio) for server-side compatibility and smaller bundle.
 */

export interface ContentImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  /** Original index position for placeholder mapping */
  index: number;
}

export interface ParsedContent {
  html: string;
  images: ContentImage[];
}

/**
 * Regex pattern to match img tags with attributes.
 * Captures the full tag and individual attributes.
 */
const IMG_TAG_PATTERN = /<img\s+([^>]*?)\/?>/gi;

/**
 * Extract a specific attribute value from an img tag's attribute string.
 */
function getAttribute(attrString: string, name: string): string | undefined {
  // Match both single and double quoted attribute values
  const patterns = [
    new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'),
    new RegExp(`${name}\\s*=\\s*'([^']*)'`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = attrString.match(pattern);
    if (match) return match[1];
  }
  return undefined;
}

/**
 * Parse a numeric attribute, returning undefined if not a valid number.
 */
function parseNumericAttribute(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
}

/**
 * Extract all images from HTML content.
 *
 * @param html - WordPress HTML content
 * @returns Array of ContentImage objects with extracted data
 */
export function extractImages(html: string): ContentImage[] {
  const images: ContentImage[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  // Reset regex state
  IMG_TAG_PATTERN.lastIndex = 0;

  while ((match = IMG_TAG_PATTERN.exec(html)) !== null) {
    const attrString = match[1];

    const src = getAttribute(attrString, 'src');
    // Skip images without src
    if (!src) continue;

    // Skip data URIs and SVGs (typically placeholders or icons)
    if (src.startsWith('data:') || src.endsWith('.svg')) continue;

    images.push({
      src,
      alt: getAttribute(attrString, 'alt') || '',
      width: parseNumericAttribute(getAttribute(attrString, 'width')),
      height: parseNumericAttribute(getAttribute(attrString, 'height')),
      className: getAttribute(attrString, 'class'),
      index,
    });

    index++;
  }

  return images;
}

/**
 * Replace img tags with placeholder divs for React portal rendering.
 * The first image is kept as native HTML for LCP optimization.
 *
 * @param html - WordPress HTML content
 * @returns Object with transformed HTML and extracted image data
 */
export function replaceImagesWithPlaceholders(html: string): ParsedContent {
  const images: ContentImage[] = [];
  let imageIndex = 0;

  // Reset regex state
  IMG_TAG_PATTERN.lastIndex = 0;

  const processedHtml = html.replace(IMG_TAG_PATTERN, (fullMatch, attrString) => {
    const src = getAttribute(attrString, 'src');

    // Keep images without src unchanged
    if (!src) return fullMatch;

    // Keep data URIs and SVGs unchanged
    if (src.startsWith('data:') || src.endsWith('.svg')) return fullMatch;

    const currentIndex = imageIndex++;

    // Keep the FIRST image as native HTML for LCP optimization
    // Portal-based rendering delays client-side hydration, hurting LCP
    // Native img loads immediately with server-rendered HTML
    if (currentIndex === 0) {
      // Add loading="eager" and fetchpriority="high" for LCP
      const existingLoading = getAttribute(attrString, 'loading');
      const existingFetchpriority = getAttribute(attrString, 'fetchpriority');

      let enhancedTag = fullMatch;

      // Add loading="eager" if not present
      if (!existingLoading) {
        enhancedTag = enhancedTag.replace(/<img\s/, '<img loading="eager" ');
      }

      // Add fetchpriority="high" if not present
      if (!existingFetchpriority) {
        enhancedTag = enhancedTag.replace(/<img\s/, '<img fetchpriority="high" ');
      }

      return enhancedTag;
    }

    images.push({
      src,
      alt: getAttribute(attrString, 'alt') || '',
      width: parseNumericAttribute(getAttribute(attrString, 'width')),
      height: parseNumericAttribute(getAttribute(attrString, 'height')),
      className: getAttribute(attrString, 'class'),
      index: currentIndex,
    });

    // Return placeholder div for React portal (images after the first)
    return `<div data-content-image="${currentIndex}" class="content-image-placeholder"></div>`;
  });

  return {
    html: processedHtml,
    images,
  };
}
