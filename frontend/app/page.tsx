import { getPosts, getCategories, getPostsByCategorySlug, isWordPressConfigured } from "@/lib/wordpress";
import type { WPPost, WPCategory } from "@/lib/wordpress";

// Category slug for Breaking News posts
const BREAKING_NEWS_CATEGORY = "breaking-news";
import { OrganizationSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";
import { MiniHero } from "@/components/MiniHero";
import { HeroGrid } from "@/components/HeroGrid";
import { BreakingNewsSection } from "@/components/BreakingNewsSection";
import { ArticleListGrid } from "@/components/ArticleListGrid";
import { SocialCTABar } from "@/components/SocialCTABar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

// Enable ISR with 5 second revalidation
export const revalidate = 5;

/**
 * Clemson Sports Media Homepage
 *
 * A newspaper-style sports media homepage featuring:
 * - Hero Grid: 1 large featured article + 4 smaller grid articles
 * - Breaking News: 4 overlay cards with category badges
 * - Article List: 4x2 grid with thumbnails
 */
export default async function HomePage() {
  // Fetch data from WordPress with graceful fallback
  let posts: WPPost[] = [];
  let breakingNewsPosts: WPPost[] = [];
  let categories: WPCategory[] = [];

  if (isWordPressConfigured()) {
    try {
      // Fetch all data in parallel
      [posts, breakingNewsPosts, categories] = await Promise.all([
        getPosts({ per_page: 20 }),
        getPostsByCategorySlug(BREAKING_NEWS_CATEGORY, { per_page: 4 }),
        getCategories({ per_page: 100 }),
      ]);
    } catch (error) {
      console.error("Failed to fetch WordPress content:", error);
    }
  }

  // Split posts for different sections
  const heroGridPosts = posts.slice(0, 5);
  const articleListPosts = posts.slice(5, 13);

  return (
    <>
      <BodyClass className="page-home" />

      {/* Organization Schema for SEO */}
      <OrganizationSchema
        name={SITE_NAME}
        url={SITE_URL}
        description="Clemson Sports Media - Your source for Clemson athletics coverage, breaking news, and in-depth sports analysis."
        sameAs={[
          // Add social media URLs here
        ]}
      />

      {/* Mini Hero with Logo */}
      <MiniHero />

      {/* Hero Grid Section */}
      <HeroGrid posts={heroGridPosts} categories={categories} />

      {/* Social CTA Bar */}
      <SocialCTABar className="my-6" />

      {/* Breaking News Section - 4 overlay cards */}
      <div className="container mx-auto px-4 pt-8">
        <BreakingNewsSection posts={breakingNewsPosts} categories={categories} />
      </div>

      {/* Article List Grid - 4x2 grid */}
      <ArticleListGrid posts={articleListPosts} categories={categories} />
    </>
  );
}
