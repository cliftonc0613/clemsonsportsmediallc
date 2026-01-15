import { WPPost, WPCategory, getDisplayCategoryName } from "@/lib/wordpress";
import { ArticleCard } from "./ArticleCard";

interface BreakingNewsSectionProps {
  posts: WPPost[];
  categories?: WPCategory[];
  className?: string;
}

export function BreakingNewsSection({
  posts,
  categories = [],
  className = "",
}: BreakingNewsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className={`container mx-auto px-4 py-8 ${className}`}>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight">
            Breaking News
          </h2>
          <div className="flex-1 h-1 bg-[var(--clemson-orange)]" />
        </div>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.slice(0, 4).map((post) => (
          <ArticleCard
            key={post.id}
            post={post}
            variant="vertical"
            categoryName={getDisplayCategoryName(post, categories)}
          />
        ))}
      </div>
    </section>
  );
}
