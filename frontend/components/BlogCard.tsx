import Link from "next/link";
import Image from "next/image";
import { Zap, FileText } from "lucide-react";
import type { WPPost } from "@/lib/wordpress";
import { stripHtml, decodeHtmlEntities, getReadingTime, rewriteImageUrl } from "@/lib/wordpress";

interface BlogCardProps {
  post: WPPost;
  showExcerpt?: boolean;
  showReadingTime?: boolean;
  category?: string;
}

export function BlogCard({
  post,
  showExcerpt = true,
  showReadingTime = true,
  category = "Blog",
}: BlogCardProps) {
  const title = decodeHtmlEntities(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);
  const readingTime = getReadingTime(post.content.rendered);
  const isQuickRead = readingTime <= 5;
  const featuredImageUrl = rewriteImageUrl(post.featured_image_url);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-800">
      {/* Image Section */}
      <Link href={`/blog/${post.slug}`} className="relative block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-700">
          {featuredImageUrl ? (
            <Image
              src={featuredImageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-700 dark:to-neutral-600">
              <FileText className="h-16 w-16 text-neutral-300 dark:text-neutral-500" />
            </div>
          )}
        </div>

        {/* Quick Read Badge */}
        {showReadingTime && isQuickRead && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 shadow-md dark:bg-neutral-900 dark:text-white">
            <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
            Quick Read
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category Tag */}
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
          <span className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-2xl font-bold leading-tight text-neutral-900 dark:text-white">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <span className="line-clamp-2">{title}</span>
          </Link>
        </h3>

        {/* Excerpt */}
        {showExcerpt && (
          <p className="line-clamp-4 font-mono text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {excerpt}
          </p>
        )}
      </div>
    </div>
  );
}
