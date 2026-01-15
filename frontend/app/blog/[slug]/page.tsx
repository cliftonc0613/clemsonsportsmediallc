import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPost,
  getPosts,
  stripHtml,
  decodeHtmlEntities,
  formatDate,
  getReadingTime,
  isWordPressConfigured,
  rewriteImageUrl,
  rewriteContentUrls,
} from "@/lib/wordpress";
import { getRankMathMeta, generateSeoMetadata } from "@/lib/seo";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";
import { MultiStructuredData } from "@/components/structured-data";
import { BodyClass } from "@/components/BodyClass";
import { WordPressContent } from "@/components/WordPressContent";
import { BlurImage } from "@/components/BlurImage";
import { ShareButton } from "@/components/ShareButton";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SaveOfflineButton } from "@/components/SaveOfflineButton";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  // If WordPress isn't configured during build, return empty array
  // Pages will be generated on-demand with ISR
  if (!isWordPressConfigured()) {
    console.warn('WORDPRESS_API_URL not set - skipping static generation for blog posts');
    return [];
  }

  try {
    const posts = await getPosts({ per_page: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to fetch posts for static generation:', error);
    return [];
  }
}

// Allow dynamic paths not generated at build time
export const dynamicParams = true;

// Force dynamic rendering to always fetch fresh data from WordPress
export const dynamic = 'force-dynamic';

// Generate metadata for each post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = decodeHtmlEntities(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered);
  const ogImageUrl = rewriteImageUrl(post.featured_image_url);

  // Try to get RankMath SEO metadata
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const pageUrl = `${siteUrl}/blog/${slug}`;
  const rankMathMeta = await getRankMathMeta(pageUrl);

  // Fallback metadata from WordPress post data
  const fallback: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.author_name ? [post.author_name] : undefined,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };

  // Use RankMath metadata with fallback
  return generateSeoMetadata(rankMathMeta, fallback);
}

// Enable ISR with 5 second revalidation
export const revalidate = 5;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const title = decodeHtmlEntities(post.title.rendered);
  const date = formatDate(post.date);
  const readingTime = getReadingTime(post.content.rendered);
  const authorName = post.author_name || "Unknown Author";

  // Rewrite image URLs from local to production
  const featuredImageUrl = rewriteImageUrl(post.featured_image_url);
  const contentHtml = rewriteContentUrls(post.content.rendered);

  // Fetch related posts (latest 3 posts excluding current)
  const relatedPosts = await getPosts({ per_page: 3, exclude: [post.id] });

  const postUrl = `${SITE_URL}/blog/${slug}`;

  // Dynamic body classes for CSS targeting
  const bodyClasses = [
    "post-single",
    `post-${slug}`,
    `author-${authorName.toLowerCase().replace(/\s+/g, "-")}`,
    featuredImageUrl ? "has-thumbnail" : "no-thumbnail",
    readingTime <= 5 ? "quick-read" : "long-read",
  ].join(" ");

  // Generate structured data schemas
  const articleSchema = generateArticleSchema(post, SITE_URL, {
    author: { name: authorName },
    publisher: { name: SITE_NAME },
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: title, url: postUrl },
  ]);

  return (
    <>
      <BodyClass className={bodyClasses} />
      <ReadingProgress />

      {/* Structured Data */}
      <MultiStructuredData schemas={[articleSchema, breadcrumbSchema]} />

      {/* Article Header */}
      <section className="bg-muted pb-16 pt-32 md:pb-24 md:pt-48">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Meta */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>{date}</span>
              <span>•</span>
              <span>{readingTime} min read</span>
              <span>•</span>
              <span>By {authorName}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
          </div>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <BlurImage
                  src={featuredImageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <WordPressContent
              html={contentHtml}
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
            />
          </div>

          {/* Actions: Back to Blog, Save Offline & Share */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <Button asChild variant="outline">
              <Link href="/blog">← Back to Blog</Link>
            </Button>
            <div className="flex items-center gap-2">
              <SaveOfflineButton url={postUrl} title={title} />
              <ShareButton
                title={title}
                text={stripHtml(post.excerpt.rendered)}
                url={postUrl}
              />
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Related Posts
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
