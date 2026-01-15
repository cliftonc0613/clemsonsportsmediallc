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
  className?: string;
}

/**
 * Alternating Grid Layout
 *
 * Top Row: Image | Text | Image | Text (4 columns)
 * Bottom Rows: Image cards with titles (4 columns)
 *
 * Requires at least 4 posts for the alternating pattern.
 * If fewer than 4 posts, all are shown as image cards.
 */
export function AlternatingGrid({
  posts,
  tags = [],
  className = "",
}: AlternatingGridProps) {
  if (posts.length === 0) return null;

  // If fewer than 4 posts, show all as image cards with titles
  // If 4+ posts, use Image|Text|Image|Text pattern for first 4
  const useAlternatingLayout = posts.length >= 4;
  const topRowPosts = useAlternatingLayout ? posts.slice(0, 4) : [];
  const remainingPosts = useAlternatingLayout ? posts.slice(4) : posts;

  return (
    <div className={className}>
      {/* Top Row: Image | Text | Image | Text (only if 4+ posts) */}
      {useAlternatingLayout && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <ImageCard post={topRowPosts[0]} />
          <TextCard post={topRowPosts[1]} tags={tags} showExclusive />
          <ImageCard post={topRowPosts[2]} />
          <TextCard post={topRowPosts[3]} tags={tags} />
        </div>
      )}

      {/* Remaining Posts (or all posts if fewer than 4): Image cards with titles */}
      {remainingPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {remainingPosts.map((post) => (
            <ImageCardWithTitle key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

// Image-only card (no title) for top row positions 1 & 3
function ImageCard({ post }: { post: WPPost }) {
  const imageUrl = rewriteImageUrl(post.featured_image_url);
  const title = decodeHtmlEntities(post.title.rendered);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden">
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

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col justify-center"
    >
      {isExclusive && (
        <span className="inline-block w-fit bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-2 py-1 mb-3">
          Exclusive
        </span>
      )}

      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--clemson-orange)] transition-colors">
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

// Image card with title and byline for bottom rows
function ImageCardWithTitle({ post }: { post: WPPost }) {
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
