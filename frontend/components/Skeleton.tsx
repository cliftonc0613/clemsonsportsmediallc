import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base Skeleton Component
 * Animated placeholder for loading states
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

/**
 * Text Skeleton - Single line placeholder
 */
export function SkeletonText({
  className,
  lines = 1,
}: SkeletonProps & { lines?: number }) {
  if (lines === 1) {
    return <div className={cn("skeleton-text", className)} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "skeleton-text",
            // Last line is shorter for natural appearance
            i === lines - 1 && "w-3/4",
            className
          )}
        />
      ))}
    </div>
  );
}

/**
 * Title Skeleton - Heading placeholder
 */
export function SkeletonTitle({ className }: SkeletonProps) {
  return <div className={cn("skeleton-title", className)} />;
}

/**
 * Avatar Skeleton - Circular placeholder
 */
export function SkeletonAvatar({
  className,
  size = "md",
}: SkeletonProps & { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={cn("skeleton-avatar", sizeClasses[size], className)} />
  );
}

/**
 * Image Skeleton - Aspect ratio placeholder
 */
export function SkeletonImage({
  className,
  aspectRatio = "video",
}: SkeletonProps & { aspectRatio?: "video" | "square" | "portrait" }) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  return (
    <div
      className={cn("skeleton-image", aspectClasses[aspectRatio], className)}
    />
  );
}

/**
 * Blog Post Card Skeleton
 * Complete skeleton for blog post cards
 */
export function SkeletonBlogCard({ className }: SkeletonProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card",
        className
      )}
    >
      <SkeletonImage className="rounded-none" />
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        {/* Category */}
        <div className="skeleton h-5 w-20 rounded-full mb-3" />
        {/* Title */}
        <SkeletonTitle className="mb-2" />
        {/* Excerpt */}
        <SkeletonText lines={2} className="mb-4" />
        {/* Meta */}
        <div className="mt-auto flex items-center gap-3">
          <SkeletonAvatar size="sm" />
          <div className="space-y-1 flex-1">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Blog Post Grid Skeleton
 * Grid of blog card skeletons
 */
export function SkeletonBlogGrid({
  count = 6,
  className,
}: SkeletonProps & { count?: number }) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlogCard key={i} />
      ))}
    </div>
  );
}

/**
 * Service Card Skeleton
 */
export function SkeletonServiceCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6",
        className
      )}
    >
      {/* Icon */}
      <div className="skeleton h-12 w-12 rounded-lg mb-4" />
      {/* Title */}
      <SkeletonTitle className="mb-2 h-6" />
      {/* Description */}
      <SkeletonText lines={3} />
    </div>
  );
}

/**
 * Full Page Content Skeleton
 * For blog post or page detail views
 */
export function SkeletonPageContent({ className }: SkeletonProps) {
  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      {/* Hero image */}
      <SkeletonImage className="mb-8 rounded-lg" />

      {/* Title */}
      <div className="skeleton h-10 w-full mb-2" />
      <div className="skeleton h-10 w-2/3 mb-6" />

      {/* Meta */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
        <SkeletonAvatar />
        <div className="space-y-2">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>

      {/* Content paragraphs */}
      <div className="space-y-6">
        <SkeletonText lines={4} />
        <SkeletonText lines={3} />
        <SkeletonText lines={5} />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}

export default Skeleton;
