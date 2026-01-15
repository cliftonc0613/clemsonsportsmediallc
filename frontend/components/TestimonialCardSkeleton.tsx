import { Skeleton } from "@/components/ui/skeleton";

/**
 * TestimonialCard Skeleton
 *
 * Loading placeholder that matches TestimonialCard layout.
 * Displays while testimonials are being fetched.
 */
export function TestimonialCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm dark:bg-neutral-900">
      {/* Quote */}
      <div className="mb-6 flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Author section */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Skeleton className="h-12 w-12 rounded-full" />

        {/* Name and company */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Stars */}
        <div className="ml-auto flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Multiple TestimonialCard skeletons for grid layouts
 */
export function TestimonialCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TestimonialCardSkeleton key={i} />
      ))}
    </div>
  );
}
