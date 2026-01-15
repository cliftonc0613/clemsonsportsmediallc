'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, useCallback } from 'react';

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
  /**
   * Optional blur data URL for custom placeholder.
   * If provided, uses Next.js native blur placeholder.
   * If not provided, uses CSS-based blur effect.
   */
  blurDataURL?: string;
}

/**
 * BlurImage - Next.js Image wrapper with blur placeholder support
 *
 * Provides a Medium-style blur-up loading effect for images.
 * - If blurDataURL is provided: uses Next.js native placeholder="blur"
 * - If priority is true: skips blur effect (LCP images should load fast)
 * - Otherwise: uses CSS-based blur effect with smooth transition
 */
export function BlurImage({
  blurDataURL,
  className = '',
  priority,
  ...props
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // If blurDataURL is provided, use Next.js native blur placeholder
  if (blurDataURL) {
    return (
      <Image
        {...props}
        priority={priority}
        className={className}
        placeholder="blur"
        blurDataURL={blurDataURL}
        unoptimized
      />
    );
  }

  // Skip blur effect for priority images (LCP optimization)
  // Priority images are preloaded and should render immediately
  if (priority) {
    return (
      <Image
        {...props}
        priority={priority}
        className={className}
        unoptimized
      />
    );
  }

  // Otherwise, use CSS-based blur effect
  return (
    <Image
      {...props}
      className={`blur-image ${isLoaded ? 'blur-image--loaded' : ''} ${className}`}
      onLoad={handleLoad}
      unoptimized
    />
  );
}

export default BlurImage;
