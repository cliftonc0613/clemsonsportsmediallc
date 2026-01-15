import { getPosts, getCategories, getTags, getPostsByCategorySlug, isWordPressConfigured } from "@/lib/wordpress";
import type { WPPost, WPCategory, WPTag } from "@/lib/wordpress";

// Category slugs
const BREAKING_NEWS_CATEGORY = "breaking-news";
const SPORT_CATEGORIES = [
  { slug: "football", name: "Football", watermark: "CLEMSON" },
  { slug: "basketball", name: "Basketball", watermark: "TIGERS" },
  { slug: "transfer-portal", name: "Transfer Portal", watermark: "PORTAL" },
  { slug: "baseball", name: "Baseball", watermark: "CLEMSON" },
  { slug: "softball", name: "Softball", watermark: "TIGERS" },
  { slug: "soccer", name: "Soccer", watermark: "CLEMSON" },
  { slug: "recruiting", name: "Recruiting", watermark: "RECRUITING" },
];

import { OrganizationSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";
import { MiniHero } from "@/components/MiniHero";
import { HeroGrid } from "@/components/HeroGrid";
import { BreakingNewsSection } from "@/components/BreakingNewsSection";
import { ArticleListGrid } from "@/components/ArticleListGrid";
import { SocialCTABar } from "@/components/SocialCTABar";
import { SportCategorySection } from "@/components/SportCategorySection";

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
  let tags: WPTag[] = [];
  let sportPosts: Record<string, WPPost[]> = {};

  if (isWordPressConfigured()) {
    try {
      // Fetch main data in parallel
      [posts, breakingNewsPosts, categories, tags] = await Promise.all([
        getPosts({ per_page: 20 }),
        getPostsByCategorySlug(BREAKING_NEWS_CATEGORY, { per_page: 4 }),
        getCategories({ per_page: 100 }),
        getTags({ per_page: 100 }),
      ]);

      // Fetch ALL sport category posts in parallel
      const sportPromises = SPORT_CATEGORIES.map(async (cat) => {
        const catPosts = await getPostsByCategorySlug(cat.slug, { per_page: 100 });
        return { slug: cat.slug, posts: catPosts };
      });

      const sportResults = await Promise.all(sportPromises);
      sportPosts = sportResults.reduce((acc, { slug, posts }) => {
        acc[slug] = posts;
        return acc;
      }, {} as Record<string, WPPost[]>);
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
      <ArticleListGrid posts={articleListPosts} categories={categories} tags={tags} />

      {/* Sport Category Sections */}
      {(() => {
        // Track which posts have been shown to avoid duplicates across sections
        const shownPostIds = new Set<number>();

        return SPORT_CATEGORIES.map((cat) => {
          const catPosts = sportPosts[cat.slug] || [];
          // Filter out posts already shown in previous sections
          const uniquePosts = catPosts.filter((post) => !shownPostIds.has(post.id));

          if (uniquePosts.length === 0) return null;

          // Mark these posts as shown
          uniquePosts.forEach((post) => shownPostIds.add(post.id));

          return (
            <SportCategorySection
              key={cat.slug}
              posts={uniquePosts}
              categories={categories}
              tags={tags}
              categoryName={cat.name}
              watermarkText={cat.watermark}
            />
          );
        });
      })()}
    </>
  );
}
