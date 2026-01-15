'use client';

import { BlurImage } from './BlurImage';
import type { ContentImage as ContentImageData } from '@/lib/content-images';

interface ContentImageProps {
  image: ContentImageData;
  /** Index of this image in the content (0-based) */
  index?: number;
}

/**
 * ContentImage - Optimized image component for WordPress content images
 *
 * Wraps BlurImage to handle images embedded in WordPress content.
 * Supports both dimensioned images (uses explicit width/height) and
 * non-dimensioned images (uses fill with aspect-ratio container).
 *
 * The first image (index 0) gets priority loading for LCP optimization.
 */
export function ContentImage({ image, index = 0 }: ContentImageProps) {
  const { src, alt, width, height, className } = image;

  // First content image gets priority (likely above fold, could be LCP)
  const isPriority = index === 0;

  // If we have dimensions, use them directly
  if (width && height) {
    return (
      <BlurImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className || ''}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 720px"
        priority={isPriority}
      />
    );
  }

  // For images without dimensions, use fill with aspect-ratio container
  // Default to 16:9 which is common for content images
  return (
    <div
      className="content-image-container relative w-full"
      style={{ aspectRatio: '16 / 9' }}
    >
      <BlurImage
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className || ''}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 720px"
        priority={isPriority}
      />
    </div>
  );
}

export default ContentImage;
