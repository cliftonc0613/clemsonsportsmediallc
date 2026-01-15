import Link from "next/link";
import Image from "next/image";
import {
  WPPost,
  WPCategory,
  WPTag,
  decodeHtmlEntities,
  rewriteImageUrl,
  postHasTag,
  formatDate,
  getPostAuthorName,
  getPostAuthorAvatar,
} from "@/lib/wordpress";
import { SportSectionHeader } from "./SportSectionHeader";
import { AuthorByline } from "./AuthorByline";

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

  // Split posts: 2 large images + 1 text (top row) + 4 small (bottom row)
  const topLeftPost = posts[0];
  const centerPost = posts[1];
  const topRightPost = posts[2];
  const bottomPosts = posts.slice(3, 7);

  return (
    <section className={`bg-gray-100 py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header with Watermark */}
        <SportSectionHeader
          categoryName={categoryName}
          watermarkText={watermarkText}
        />

        {/* Top Row: Large image + Text article + Large image */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Left Large Image Card */}
          {topLeftPost && (
            <LargeImageCard post={topLeftPost} tags={tags} />
          )}

          {/* Center Text Article */}
          {centerPost && (
            <TextArticleCard post={centerPost} tags={tags} />
          )}

          {/* Right Large Image Card */}
          {topRightPost && (
            <LargeImageCard post={topRightPost} tags={tags} />
          )}
        </div>

        {/* Bottom Row: 4 smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bottomPosts.map((post) => (
            <SmallImageCard key={post.id} post={post} tags={tags} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Large image card for top left and right positions
function LargeImageCard({ post, tags }: { post: WPPost; tags: WPTag[] }) {
  const imageUrl = rewriteImageUrl(post.featured_image_url);
  const title = decodeHtmlEntities(post.title.rendered);
  const authorName = getPostAuthorName(post);
  const authorAvatar = getPostAuthorAvatar(post);
  const date = formatDate(post.date);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]" />
        )}
      </div>
      <h3 className="font-heading text-lg md:text-xl font-bold leading-tight mb-2 group-hover:text-[var(--clemson-orange)] transition-colors line-clamp-3">
        {title}
      </h3>
      <AuthorByline
        authorName={authorName}
        authorAvatar={authorAvatar}
        date={date}
      />
    </Link>
  );
}

// Text-only article card for center position
function TextArticleCard({ post, tags }: { post: WPPost; tags: WPTag[] }) {
  const title = decodeHtmlEntities(post.title.rendered);
  const authorName = getPostAuthorName(post);
  const authorAvatar = getPostAuthorAvatar(post);
  const date = formatDate(post.date);
  const isExclusive = postHasTag(post, tags, "exclusive");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block lg:col-span-2 flex flex-col justify-center py-4"
    >
      {/* Exclusive Badge */}
      {isExclusive && (
        <span className="inline-block w-fit bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-2 py-1 mb-3">
          Exclusive
        </span>
      )}

      <h3 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-4 group-hover:text-[var(--clemson-orange)] transition-colors">
        {title}
      </h3>

      <AuthorByline
        authorName={authorName}
        authorAvatar={authorAvatar}
        date={date}
        size="md"
      />
    </Link>
  );
}

// Small image card for bottom row
function SmallImageCard({ post, tags }: { post: WPPost; tags: WPTag[] }) {
  const imageUrl = rewriteImageUrl(post.featured_image_url);
  const title = decodeHtmlEntities(post.title.rendered);
  const authorName = getPostAuthorName(post);
  const authorAvatar = getPostAuthorAvatar(post);
  const date = formatDate(post.date);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
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
      </div>
      <h4 className="font-heading text-base md:text-lg font-bold leading-tight mb-2 group-hover:text-[var(--clemson-orange)] transition-colors line-clamp-2">
        {title}
      </h4>
      <AuthorByline
        authorName={authorName}
        authorAvatar={authorAvatar}
        date={date}
      />
    </Link>
  );
}
