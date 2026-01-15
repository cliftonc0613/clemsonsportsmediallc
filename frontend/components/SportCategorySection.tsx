import { WPPost, WPCategory, WPTag } from "@/lib/wordpress";
import { SportSectionHeader } from "./SportSectionHeader";
import { AlternatingGrid } from "./AlternatingGrid";

interface SportCategorySectionProps {
  posts: WPPost[];
  categories?: WPCategory[];
  tags?: WPTag[];
  categoryName: string;
  watermarkText?: string;
  className?: string;
}

export function SportCategorySection({
  posts,
  categories = [],
  tags = [],
  categoryName,
  watermarkText,
  className = "",
}: SportCategorySectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className={`bg-gray-100 py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header with Watermark */}
        <SportSectionHeader
          categoryName={categoryName}
          watermarkText={watermarkText}
        />

        {/* Alternating Grid Layout */}
        <AlternatingGrid posts={posts} tags={tags} />
      </div>
    </section>
  );
}
