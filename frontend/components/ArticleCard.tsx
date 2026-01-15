import Link from "next/link";
import Image from "next/image";
import { WPPost, decodeHtmlEntities, formatDate, rewriteImageUrl } from "@/lib/wordpress";
import { CategoryBadge } from "./CategoryBadge";
import { ExclusiveBadge } from "./ExclusiveBadge";

interface ArticleCardProps {
  post: WPPost;
  variant: "horizontal" | "vertical" | "compact";
  categoryName?: string;
  isExclusive?: boolean;
  className?: string;
}

export function ArticleCard({
  post,
  variant,
  categoryName = "News",
  isExclusive = false,
  className = "",
}: ArticleCardProps) {
  const imageUrl = rewriteImageUrl(post.featured_image_url);
  const title = decodeHtmlEntities(post.title.rendered);
  const date = formatDate(post.date);

  // Horizontal variant: thumbnail left, text right
  if (variant === "horizontal") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`group flex gap-4 ${className}`}
      >
        {/* Thumbnail */}
        <div className="relative w-[120px] h-[90px] flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="120px"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge name={categoryName} className="text-[10px] px-2 py-0.5" />
            {isExclusive && <ExclusiveBadge />}
          </div>
          <h4 className="font-heading text-sm leading-tight line-clamp-2 group-hover:text-[var(--clemson-orange)] transition-colors">
            {title}
          </h4>
          <span className="text-xs text-muted-foreground mt-1">{date}</span>
        </div>
      </Link>
    );
  }

  // Compact variant: small thumbnail, title only
  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`group flex gap-3 items-center ${className}`}
      >
        {/* Small Thumbnail */}
        <div className="relative w-[80px] h-[60px] flex-shrink-0 overflow-hidden">
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

        {/* Title only */}
        <div className="min-w-0">
          <span className="text-[10px] text-[var(--clemson-orange)] uppercase font-semibold">
            {categoryName}
          </span>
          <h5 className="font-heading text-sm leading-tight line-clamp-2 group-hover:text-[var(--clemson-orange)] transition-colors">
            {title}
          </h5>
        </div>
      </Link>
    );
  }

  // Vertical variant: image top, text below (default)
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden mb-3">
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
        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <CategoryBadge name={categoryName} />
          {isExclusive && <ExclusiveBadge />}
        </div>
      </div>

      {/* Content */}
      <div>
        <h4 className="font-heading text-base leading-tight line-clamp-2 group-hover:text-[var(--clemson-orange)] transition-colors mb-2">
          {title}
        </h4>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
    </Link>
  );
}
