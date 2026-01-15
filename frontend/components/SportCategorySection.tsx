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

  // If fewer than 4 posts, show all as image cards with titles
  // If 4+ posts, use Image|Text|Image|Text pattern for first 4
  const useAlternatingLayout = posts.length >= 4;
  const topRowPosts = useAlternatingLayout ? posts.slice(0, 4) : [];
  const remainingPosts = useAlternatingLayout ? posts.slice(4) : posts;

  return (
    <section className={`bg-gray-100 py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header with Watermark */}
        <SportSectionHeader
          categoryName={categoryName}
          watermarkText={watermarkText}
        />

        {/* Top Row: Image | Text | Image | Text (only if 4+ posts) */}
        {useAlternatingLayout && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <TopImageCard post={topRowPosts[0]} />
            <TextArticleCard post={topRowPosts[1]} tags={tags} showExclusive />
            <TopImageCard post={topRowPosts[2]} />
            <TextArticleCard post={topRowPosts[3]} tags={tags} />
          </div>
        )}

        {/* Remaining Posts (or all posts if fewer than 4): Image cards with titles */}
        {remainingPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {remainingPosts.map((post) => (
              <BottomImageCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Top row image card - portrait image only (no title)
function TopImageCard({ post }: { post: WPPost }) {
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

// Text-only article card for top row
function TextArticleCard({
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
      {/* Exclusive Badge */}
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

// Bottom row image card - portrait image with title and byline below
function BottomImageCard({ post }: { post: WPPost }) {
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
