import { BlogCardSkeletonGrid } from "@/components/BlogCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Blog Page Loading State
 *
 * Displayed while blog posts are being fetched.
 * Uses skeleton components to match the actual content layout.
 */
export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page header skeleton */}
      <div className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-48" />
        <Skeleton className="mx-auto h-6 w-96 max-w-full" />
      </div>

      {/* Blog grid skeleton */}
      <BlogCardSkeletonGrid count={6} />
    </div>
  );
}
