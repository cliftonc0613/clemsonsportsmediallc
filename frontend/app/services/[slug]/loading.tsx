import { SkeletonPageContent } from "@/components/Skeleton";

/**
 * Service Detail Loading State
 *
 * Shows a full page content skeleton that matches the
 * service detail layout during navigation.
 */
export default function ServiceDetailLoading() {
  return (
    <article className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SkeletonPageContent />
      </div>
    </article>
  );
}
