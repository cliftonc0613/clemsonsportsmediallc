import { Skeleton } from "@/components/ui/skeleton";

/**
 * ServiceCard Skeleton
 *
 * Loading placeholder that matches ServiceCard layout.
 * Displays while services are being fetched.
 */
export function ServiceCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm dark:bg-neutral-900">
      {/* Icon placeholder */}
      <Skeleton className="mb-4 h-12 w-12 rounded-lg" />

      {/* Title */}
      <Skeleton className="mb-2 h-6 w-3/4" />

      {/* Description */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Features list */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* CTA button */}
      <div className="mt-auto">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Multiple ServiceCard skeletons for grid layouts
 */
export function ServiceCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}
