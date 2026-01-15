import Link from "next/link";
import Image from "next/image";
import { WPPost, decodeHtmlEntities, formatDate, rewriteImageUrl } from "@/lib/wordpress";
import { CategoryBadge } from "./CategoryBadge";

interface HeroArticleCardProps {
  post: WPPost;
  variant: "large" | "small";
  categoryName?: string;
  className?: string;
  /** Priority loading for LCP optimization - use for above-fold hero images */
  priority?: boolean;
}

export function HeroArticleCard({
  post,
  variant,
  categoryName = "News",
  className = "",
  priority = false,
}: HeroArticleCardProps) {
  const imageUrl = rewriteImageUrl(post.featured_image_url);
  const title = decodeHtmlEntities(post.title.rendered);
  const date = formatDate(post.date);
  const author = post.author_name || "Staff Writer";

  const isLarge = variant === "large";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative block overflow-hidden ${className}`}
    >
      {/* Background Image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={isLarge ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay-dark-purple" />

      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <CategoryBadge name={categoryName} />
      </div>

      {/* Content */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 ${
          isLarge ? "p-6" : "p-4"
        }`}
      >
        {/* Author + Date */}
        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>

        {/* Headline */}
        <h3
          className={`font-heading text-white leading-tight ${
            isLarge
              ? "text-2xl md:text-3xl lg:text-4xl"
              : "text-lg md:text-xl"
          }`}
        >
          {title}
        </h3>
      </div>
    </Link>
  );
}
