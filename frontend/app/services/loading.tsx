import { ServiceCardSkeletonGrid } from "@/components/ServiceCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Services Page Loading State
 *
 * Displayed while services are being fetched.
 * Uses skeleton components to match the actual content layout.
 */
export default function ServicesLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page header skeleton */}
      <div className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-64" />
        <Skeleton className="mx-auto h-6 w-80 max-w-full" />
      </div>

      {/* Services grid skeleton */}
      <ServiceCardSkeletonGrid count={6} />
    </div>
  );
}
