import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPost,
  getPosts,
  getAdjacentPosts,
  stripHtml,
  decodeHtmlEntities,
  formatDate,
  getReadingTime,
  isWordPressConfigured,
  rewriteImageUrl,
  rewriteContentUrls,
  getPostAuthorAvatar,
  getPostAuthorBio,
  getPostCategories,
  getPostTags,
} from "@/lib/wordpress";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { AuthorBio } from "@/components/AuthorBio";
import { PostMeta } from "@/components/PostMeta";

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
  const authorAvatar = getPostAuthorAvatar(post);
  const authorBio = getPostAuthorBio(post);
  const categories = getPostCategories(post);
  const tags = getPostTags(post);

  // Rewrite image URLs from local to production
  const featuredImageUrl = rewriteImageUrl(post.featured_image_url);
  const contentHtml = rewriteContentUrls(post.content.rendered);

  // Fetch related posts (latest 3 posts excluding current)
  const relatedPosts = await getPosts({ per_page: 3, exclude: [post.id] });

  // Fetch adjacent posts for navigation
  const { previous: previousPost, next: nextPost } = await getAdjacentPosts(post.date, post.id);

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

      {/* Hero with Faded Background */}
      <section className="bg-gray-100 pt-16 pb-32 md:pt-24 md:pb-48 relative overflow-hidden">
        {/* Faded Background Image */}
        {featuredImageUrl && (
          <div className="absolute inset-0">
            <BlurImage
              src={featuredImageUrl}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-20"
              priority
            />
          </div>
        )}
      </section>

      {/* Hanging Featured Image + Title Section */}
      <section className="relative -mt-24 md:-mt-40 pb-8">
        <div className="container mx-auto px-4">
          {/* Featured Image - Hanging */}
          {featuredImageUrl && (
            <div className="mx-auto max-w-4xl mb-8">
              <div className="relative aspect-video overflow-hidden">
                <BlurImage
                  src={featuredImageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Photo Credit */}
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-2">
                Photo Credit: {(post.acf?.photo_credit as string) || "Clemson Sports Media"}
              </p>
            </div>
          )}

          {/* Title & Meta Below Image */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Category Badges */}
            {categories.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="bg-[var(--clemson-orange)] text-white text-xs font-semibold uppercase px-3 py-1 hover:bg-[var(--clemson-purple)] transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[var(--clemson-orange)]">
              {title}
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <span>{date}</span>
              <span className="text-[var(--clemson-orange)]">•</span>
              <span>{readingTime} min read</span>
              <span className="text-[var(--clemson-orange)]">•</span>
              <span>By {authorName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <WordPressContent
              html={contentHtml}
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-[var(--clemson-orange)] prose-a:no-underline hover:prose-a:underline prose-img:rounded-none prose-blockquote:border-l-[var(--clemson-purple)] prose-blockquote:border-l-4"
            />
          </div>

          {/* Post Meta: Categories & Tags */}
          <div className="mx-auto max-w-3xl mt-12 pt-8 border-t border-gray-200">
            <PostMeta categories={categories} tags={tags} />
          </div>

          {/* Site Blurb */}
          <div className="mx-auto max-w-3xl mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 leading-relaxed">
              Stay up-to-date with all things Clemson sports by visiting Clemson Sports Media,
              your one-stop website for everything Clemson. We provide post-game interviews,
              in-depth analysis, and comprehensive coverage of all Clemson sports. Don&apos;t miss
              out on the latest news and updates, visit{" "}
              <Link href="/" className="text-[var(--clemson-orange)] font-semibold hover:underline">
                Clemson Sports Media
              </Link>{" "}
              today.
            </p>
          </div>

          {/* Previous/Next Navigation */}
          {(previousPost || nextPost) && (
            <div className="mx-auto max-w-3xl mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-stretch">
                {/* Previous */}
                <div className="flex-1 pr-4">
                  {previousPost && (
                    <Link href={`/blog/${previousPost.slug}`} className="group flex items-start gap-3">
                      <ChevronLeft className="h-5 w-5 mt-1 text-gray-400 group-hover:text-[var(--clemson-purple)] flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--clemson-orange)]">
                          Previous
                        </span>
                        <h4 className="font-heading text-sm font-bold text-[var(--clemson-purple)] group-hover:underline mt-1 line-clamp-2">
                          {decodeHtmlEntities(previousPost.title.rendered)}
                        </h4>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-200" />

                {/* Next */}
                <div className="flex-1 pl-4 text-right">
                  {nextPost && (
                    <Link href={`/blog/${nextPost.slug}`} className="group flex items-start gap-3 justify-end">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--clemson-orange)]">
                          Next
                        </span>
                        <h4 className="font-heading text-sm font-bold text-[var(--clemson-purple)] group-hover:underline mt-1 line-clamp-2">
                          {decodeHtmlEntities(nextPost.title.rendered)}
                        </h4>
                      </div>
                      <ChevronRight className="h-5 w-5 mt-1 text-gray-400 group-hover:text-[var(--clemson-purple)] flex-shrink-0" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions: Back to Blog, Save Offline & Share */}
          <div className="mx-auto max-w-3xl mt-8 flex flex-wrap items-center justify-between gap-4">
            <Button asChild variant="outline" className="border-[var(--clemson-purple)] text-[var(--clemson-purple)] hover:bg-[var(--clemson-purple)] hover:text-white">
              <Link href="/">← Back to Blog</Link>
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

          {/* Author Bio */}
          <div className="mx-auto max-w-3xl mt-12">
            <AuthorBio
              name={authorName}
              avatar={authorAvatar}
              bio={authorBio}
            />
          </div>
        </div>
      </article>

      {/* Related Posts - Clemson Style */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-gray-100 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight inline-block pb-2 border-b-4 border-[var(--clemson-orange)]">
                Related Posts
              </h2>
            </div>
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
