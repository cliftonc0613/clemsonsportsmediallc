import Link from "next/link";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface TagItem {
  id: number;
  name: string;
  slug: string;
}

interface PostMetaProps {
  categories?: CategoryItem[];
  tags?: TagItem[];
  className?: string;
}

export function PostMeta({
  categories = [],
  tags = [],
  className = "",
}: PostMetaProps) {
  if (categories.length === 0 && tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Category:
          </span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="bg-[var(--clemson-orange)] text-white text-xs font-semibold uppercase px-3 py-1 hover:bg-[var(--clemson-purple)] transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {/* Separator */}
      {categories.length > 0 && tags.length > 0 && (
        <span className="hidden sm:block text-gray-300">|</span>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Tags:
          </span>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="text-sm text-gray-600 hover:text-[var(--clemson-orange)] transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
