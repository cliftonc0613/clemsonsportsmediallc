import { TestimonialCardSkeletonGrid } from "@/components/TestimonialCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Testimonials Page Loading State
 *
 * Displayed while testimonials are being fetched.
 * Uses skeleton components to match the actual content layout.
 */
export default function TestimonialsLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page header skeleton */}
      <div className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-72" />
        <Skeleton className="mx-auto h-6 w-96 max-w-full" />
      </div>

      {/* Testimonials grid skeleton */}
      <TestimonialCardSkeletonGrid count={6} />
    </div>
  );
}
