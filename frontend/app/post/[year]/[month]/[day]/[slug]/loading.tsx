import { SkeletonPageContent } from "@/components/Skeleton";

/**
 * Blog Post Loading State
 *
 * Shows a full page content skeleton that matches the
 * actual blog post layout during navigation.
 */
export default function BlogPostLoading() {
  return (
    <article className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SkeletonPageContent />
      </div>
    </article>
  );
}
