import Link from "next/link";
import Image from "next/image";
import { decodeHtmlEntities, formatDate, rewriteImageUrl } from "@/lib/wordpress";
import type { WPPost } from "@/lib/wordpress";

interface RecentPostsWidgetProps {
  posts: WPPost[];
  currentPostId?: number;
}

export function RecentPostsWidget({ posts, currentPostId }: RecentPostsWidgetProps) {
  // Filter out current post and take first 3
  const recentPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 3);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="inline-block bg-[var(--clemson-purple)] text-white text-sm font-bold uppercase tracking-wider px-4 py-2 mb-4">
        Latest Articles
      </div>

      <div className="space-y-4">
        {recentPosts.map((post) => {
          const title = decodeHtmlEntities(post.title.rendered);
          const imageUrl = rewriteImageUrl(post.featured_image_url);
          const date = formatDate(post.date);
          // Build date-based URL (year/month/day/slug)
          const postDate = new Date(post.date);
          const year = postDate.getFullYear();
          const month = String(postDate.getMonth() + 1).padStart(2, "0");
          const day = String(postDate.getDate()).padStart(2, "0");
          const postUrl = `/${year}/${month}/${day}/${post.slug}`;

          return (
            <Link
              key={post.id}
              href={postUrl}
              className="group flex gap-3"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-heading text-sm font-bold text-[var(--clemson-purple)] group-hover:text-[var(--clemson-orange)] transition-colors line-clamp-2 leading-tight">
                  {title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{date}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RecentPostsWidget;
