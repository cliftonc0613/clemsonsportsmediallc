import { WPPost, WPCategory, WPTag } from "@/lib/wordpress";
import { SportSectionHeader } from "./SportSectionHeader";
import { AlternatingGrid } from "./AlternatingGrid";
import { ReactNode } from "react";

interface SportCategorySectionProps {
  posts: WPPost[];
  categories?: WPCategory[];
  tags?: WPTag[];
  categoryName: string;
  categorySlug: string;
  watermarkText?: string;
  className?: string;
  /** Optional content to render between header and grid (e.g., scoreboard) */
  children?: ReactNode;
}

export function SportCategorySection({
  posts,
  categories = [],
  tags = [],
  categoryName,
  categorySlug,
  watermarkText,
  className = "",
  children,
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

        {/* Optional content (e.g., scoreboard) */}
        {children}

        {/* Alternating Grid Layout */}
        <AlternatingGrid posts={posts} tags={tags} categorySlug={categorySlug} />
      </div>
    </section>
  );
}
