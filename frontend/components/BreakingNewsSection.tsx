import Link from "next/link";
import Image from "next/image";
import { WPPost, WPCategory, getDisplayCategoryName, decodeHtmlEntities, rewriteImageUrl } from "@/lib/wordpress";

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
    <section className={`relative ${className}`}>
      {/* Breaking Ribbon Label */}
      <div className="absolute -top-4 left-4 z-20">
        <div className="bg-[var(--clemson-orange)] text-white font-heading text-lg uppercase px-4 py-2 tracking-wide">
          Breaking
        </div>
      </div>

      {/* 4-column grid of overlay cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {posts.slice(0, 4).map((post) => {
          const imageUrl = rewriteImageUrl(post.featured_image_url);
          const title = decodeHtmlEntities(post.title.rendered);
          const categoryName = getDisplayCategoryName(post, categories);

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              {/* Background Image */}
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]" />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                {/* Category Badge */}
                <span className="inline-block bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-2 py-1 mb-3">
                  {categoryName}
                </span>

                {/* Title */}
                <h3 className="font-heading text-white text-lg leading-tight line-clamp-3">
                  {title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
