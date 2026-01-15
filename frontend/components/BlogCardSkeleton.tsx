import { Skeleton } from "@/components/ui/skeleton";

/**
 * BlogCard Skeleton
 *
 * Loading placeholder that matches BlogCard layout.
 * Displays while blog posts are being fetched.
 */
export function BlogCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-900">
      {/* Image skeleton */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category tag */}
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title */}
        <div className="mb-3 space-y-2">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-3/4" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Multiple BlogCard skeletons for grid layouts
 */
export function BlogCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
