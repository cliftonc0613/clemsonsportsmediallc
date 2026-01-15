import Link from "next/link";
import { WPPost, WPCategory } from "@/lib/wordpress";
import { ArticleCard } from "./ArticleCard";

interface CompactArticleListProps {
  posts: WPPost[];
  categories?: WPCategory[];
  title?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export function CompactArticleList({
  posts,
  categories = [],
  title = "Latest",
  viewAllLink,
  viewAllText = "VIEW ALL →",
  className = "",
}: CompactArticleListProps) {
  if (posts.length === 0) return null;

  const getCategoryName = (post: WPPost): string => {
    if (post.categories.length === 0) return "News";
    const categoryId = post.categories[0];
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "News";
  };

  return (
    <div className={className}>
      {/* Section Title with orange accent */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-heading text-lg uppercase tracking-tight">
            {title}
          </h3>
          <div className="flex-1 h-0.5 bg-[var(--clemson-orange)]" />
        </div>
      </div>

      {/* Compact article list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <ArticleCard
            key={post.id}
            post={post}
            variant="horizontal"
            categoryName={getCategoryName(post)}
          />
        ))}
      </div>

      {/* View All link */}
      {viewAllLink && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href={viewAllLink}
            className="text-sm font-semibold text-[var(--clemson-orange)] hover:text-[var(--clemson-purple)] transition-colors uppercase tracking-wide"
          >
            {viewAllText}
          </Link>
        </div>
      )}
    </div>
  );
}
