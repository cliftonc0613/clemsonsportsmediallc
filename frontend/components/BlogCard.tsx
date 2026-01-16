import Link from "next/link";
import Image from "next/image";
import { Zap, FileText } from "lucide-react";
import type { WPPost } from "@/lib/wordpress";
import { decodeHtmlEntities, rewriteImageUrl, getPostAuthorName, getPostAuthorAvatar, getReadingTime } from "@/lib/wordpress";

interface BlogCardProps {
  post: WPPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const title = decodeHtmlEntities(post.title.rendered);
  const featuredImageUrl = rewriteImageUrl(post.featured_image_url);
  const authorName = getPostAuthorName(post);
  const avatarUrl = getPostAuthorAvatar(post);
  const readingTime = getReadingTime(post.content.rendered);
  const isQuickRead = readingTime <= 5;

  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group flex h-full flex-col">
      {/* Image Section */}
      <Link href={`/blog/${post.slug}`} className="relative block">
        <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
          {featuredImageUrl ? (
            <Image
              src={featuredImageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-100">
              <FileText className="h-16 w-16 text-neutral-300" />
            </div>
          )}
          {/* Quick Read Badge */}
          {isQuickRead && (
            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 shadow-md">
              <Zap className="h-4 w-4 fill-[var(--clemson-orange)] text-[var(--clemson-orange)]" />
              Quick Read
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col pt-4">
        {/* Title */}
        <h3 className="mb-3 text-xl md:text-2xl font-heading font-bold leading-tight text-neutral-900">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-[var(--clemson-orange)]"
          >
            <span className="line-clamp-3">{title}</span>
          </Link>
        </h3>

        {/* Author info */}
        <div className="flex items-center gap-3 mt-auto">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt={authorName}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{authorName}</span>
            <span className="mx-2">-</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
