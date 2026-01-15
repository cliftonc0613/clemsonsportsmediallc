import Link from "next/link";
import Image from "next/image";
import { WPPost, WPCategory, WPTag, getDisplayCategoryName, decodeHtmlEntities, rewriteImageUrl, postHasTag } from "@/lib/wordpress";

interface ArticleListGridProps {
  posts: WPPost[];
  categories?: WPCategory[];
  tags?: WPTag[];
  className?: string;
}

export function ArticleListGrid({
  posts,
  categories = [],
  tags = [],
  className = "",
}: ArticleListGridProps) {
  if (posts.length === 0) return null;

  return (
    <section className={`container mx-auto px-4 py-8 ${className}`}>
      {/* 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
        {posts.slice(0, 8).map((post) => {
          const imageUrl = rewriteImageUrl(post.featured_image_url);
          const title = decodeHtmlEntities(post.title.rendered);
          const categoryName = getDisplayCategoryName(post, categories);
          // Show exclusive badge if post has "exclusive" tag
          const isExclusive = postHasTag(post, tags, "exclusive");

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-3"
            >
              {/* Text Content - Left */}
              <div className="flex-1 min-w-0">
                {/* Title with optional Exclusive badge */}
                <div className="mb-2">
                  {isExclusive && (
                    <span className="inline-block bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-2 py-1 mr-2">
                      Exclusive
                    </span>
                  )}
                  <h4 className="inline font-heading text-base md:text-lg leading-snug group-hover:text-[var(--clemson-orange)] transition-colors">
                    {title}
                  </h4>
                </div>

                {/* Category */}
                <span className="text-sm font-semibold text-[var(--clemson-orange)] uppercase">
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
