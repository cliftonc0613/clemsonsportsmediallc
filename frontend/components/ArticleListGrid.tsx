import Link from "next/link";
import Image from "next/image";
import { WPPost, WPCategory, getDisplayCategoryName, decodeHtmlEntities, rewriteImageUrl } from "@/lib/wordpress";
import { ExclusiveBadge } from "./ExclusiveBadge";

interface ArticleListGridProps {
  posts: WPPost[];
  categories?: WPCategory[];
  className?: string;
}

export function ArticleListGrid({
  posts,
  categories = [],
  className = "",
}: ArticleListGridProps) {
  if (posts.length === 0) return null;

  return (
    <section className={`container mx-auto px-4 py-8 ${className}`}>
      {/* 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
        {posts.slice(0, 8).map((post, index) => {
          const imageUrl = rewriteImageUrl(post.featured_image_url);
          const title = decodeHtmlEntities(post.title.rendered);
          const categoryName = getDisplayCategoryName(post, categories);
          // Show exclusive badge on some posts (e.g., every 3rd post for demo, or based on a field)
          const isExclusive = index % 3 === 2;

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-3"
            >
              {/* Text Content - Left */}
              <div className="flex-1 min-w-0">
                {/* Title with optional Exclusive badge */}
                <div className="mb-1">
                  {isExclusive && (
                    <span className="inline-block bg-[var(--clemson-orange)] text-white text-[10px] font-bold uppercase px-1.5 py-0.5 mr-2">
                      Exclusive
                    </span>
                  )}
                  <h4 className="inline font-heading text-sm leading-tight group-hover:text-[var(--clemson-orange)] transition-colors">
                    {title}
                  </h4>
                </div>

                {/* Category */}
                <span className="text-xs font-semibold text-[var(--clemson-orange)] uppercase">
                  {categoryName}
                </span>
              </div>

              {/* Thumbnail - Right */}
              <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="80px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
