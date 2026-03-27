import Link from "next/link";
import Image from "next/image";
import {
  WPPost,
  WPTag,
  decodeHtmlEntities,
  rewriteImageUrl,
  postHasTag,
  formatDate,
  getPostAuthorName,
  getPostAuthorAvatar,
} from "@/lib/wordpress";
import { AuthorByline } from "./AuthorByline";

interface AlternatingGridProps {
  posts: WPPost[];
  tags?: WPTag[];
  categorySlug?: string;
  className?: string;
}

/**
 * Alternating Grid Layout
 *
 * Top Row: Image | Text | Image | Text pattern (fills available posts)
 * Bottom Rows: Image cards with titles (4 columns)
 *
 * Pattern: Position 0,2,4,6... = Image, Position 1,3,5,7... = Text
 */
export function AlternatingGrid({
  posts,
  tags = [],
  categorySlug,
  className = "",
}: AlternatingGridProps) {
  if (posts.length === 0) return null;

  // First 2 posts go in the alternating top row (each gets image + text pair)
  const topRowPosts = posts.slice(0, 2);
  const remainingPosts = posts.slice(2, 14);

  return (
    <div className={className}>
      {/* Top Row: Image | Text | Image | Text pattern */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {topRowPosts[0] && <ImageCard post={topRowPosts[0]} />}
        {topRowPosts[0] && <TextCard post={topRowPosts[0]} tags={tags} showExclusive />}
        {topRowPosts[1] && <div className="order-last sm:order-none"><ImageCard post={topRowPosts[1]} /></div>}
        {topRowPosts[1] && <TextCard post={topRowPosts[1]} tags={tags} />}
      </div>

      {/* Remaining Posts: Image cards with titles */}
      {remainingPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {remainingPosts.map((post) => (
            <ImageCardWithTitle key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* View More Button */}
      {categorySlug && (
        <div className="flex justify-center mt-8">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-2 bg-[var(--clemson-orange)] text-white font-heading font-bold uppercase px-6 py-3 hover:bg-[var(--clemson-purple)] transition-colors duration-200"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

// Helper to get post URL with date format (year/month/day/slug)
function getPostUrl(post: WPPost) {
  const postDate = new Date(post.date);
  const year = postDate.getFullYear();
  const month = String(postDate.getMonth() + 1).padStart(2, "0");
  const day = String(postDate.getDate()).padStart(2, "0");
  return `/${year}/${month}/${day}/${post.slug}`;
}

// Image-only card (no title) for top row positions 1 & 3
function ImageCard({ post }: { post: WPPost }) {
  const imageUrl = rewriteImageUrl(post.featured_image_url);
  const title = decodeHtmlEntities(post.title.rendered);
  const postUrl = getPostUrl(post);

  return (
    <Link href={postUrl} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden">
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
    </Link>
  );
}

// Text-only card for top row positions 2 & 4
function TextCard({
  post,
  tags,
  showExclusive = false,
}: {
  post: WPPost;
  tags: WPTag[];
  showExclusive?: boolean;
}) {
  const title = decodeHtmlEntities(post.title.rendered);
  const authorName = getPostAuthorName(post);
  const authorAvatar = getPostAuthorAvatar(post);
  const date = formatDate(post.date);
  const isExclusive = showExclusive && postHasTag(post, tags, "exclusive");
  const postUrl = getPostUrl(post);

  return (
    <Link
      href={postUrl}
      className="group flex flex-col justify-center"
    >
      {isExclusive && (
        <span className="inline-block w-fit bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-2 py-1 mb-3">
          Exclusive
        </span>
      )}

      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--clemson-orange)] transition-colors line-clamp-3">
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

// Image card with title and byline for bottom rows (shorter aspect ratio)
function ImageCardWithTitle({ post }: { post: WPPost }) {
  const imageUrl = rewriteImageUrl(post.featured_image_url);
  const title = decodeHtmlEntities(post.title.rendered);
  const authorName = getPostAuthorName(post);
  const authorAvatar = getPostAuthorAvatar(post);
  const date = formatDate(post.date);
  const postUrl = getPostUrl(post);

  return (
    <Link href={postUrl} className="group block">
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
