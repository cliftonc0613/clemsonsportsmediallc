import type { Metadata } from "next";
import { getPosts, getCategories, getTags, isWordPressConfigured } from "@/lib/wordpress";
import type { WPPost, WPCategory, WPTag } from "@/lib/wordpress";
import { Hero } from "@/components/Hero";
import { BlogCard } from "@/components/BlogCard";
import { BlogFilters } from "@/components/BlogFilters";
import { BodyClass } from "@/components/BodyClass";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read our latest articles, insights, and updates on industry trends and best practices.",
};

// Force dynamic rendering for filter support
export const dynamic = 'force-dynamic';

interface BlogPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  let posts: WPPost[] = [];
  let categories: WPCategory[] = [];
  let tags: WPTag[] = [];

  if (isWordPressConfigured()) {
    try {
      // Fetch categories and tags for filters
      [categories, tags] = await Promise.all([
        getCategories({ hide_empty: true }),
        getTags({ hide_empty: true }),
      ]);

      // Build filter params
      const filterParams: Parameters<typeof getPosts>[0] = { per_page: 12 };

      // Filter by category slug
      if (params.category) {
        const category = categories.find(c => c.slug === params.category);
        if (category) {
          filterParams.categories = [category.id];
        }
      }

      // Filter by tag slug
      if (params.tag) {
        const tag = tags.find(t => t.slug === params.tag);
        if (tag) {
          filterParams.tags = [tag.id];
        }
      }

      posts = await getPosts(filterParams);
    } catch (error) {
      console.error('Failed to fetch blog data:', error);
    }
  }

  const activeFilterLabel = params.category
    ? categories.find(c => c.slug === params.category)?.name
    : params.tag
    ? tags.find(t => t.slug === params.tag)?.name
    : null;

  return (
    <>
      <BodyClass className="page-blog" />

      <Hero
        title="Our Blog"
        subtitle="Insights, updates, and resources to help you stay informed and grow your business."
        size="default"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Filters */}
          {categories.length > 0 && (
            <div className="mb-8">
              <BlogFilters categories={categories} tags={tags} />
              {activeFilterLabel && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Showing posts in: <span className="font-medium">{activeFilterLabel}</span>
                </p>
              )}
            </div>
          )}

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                {activeFilterLabel
                  ? `No posts found in "${activeFilterLabel}". Try a different filter.`
                  : "No blog posts yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
