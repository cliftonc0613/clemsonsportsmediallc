import { getPosts, getCategories, isWordPressConfigured } from "@/lib/wordpress";
import type { WPPost, WPCategory } from "@/lib/wordpress";
import { OrganizationSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";
import { MiniHero } from "@/components/MiniHero";
import { HeroGrid } from "@/components/HeroGrid";
import { BreakingNewsSection } from "@/components/BreakingNewsSection";
import { CompactArticleList } from "@/components/CompactArticleList";
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
 * - Future phases will add: Breaking news, sport sections, etc.
 */
export default async function HomePage() {
  // Fetch data from WordPress with graceful fallback
  let posts: WPPost[] = [];
  let categories: WPCategory[] = [];

  if (isWordPressConfigured()) {
    try {
      [posts, categories] = await Promise.all([
        getPosts({ per_page: 20 }), // Fetch more posts for all sections
        getCategories({ per_page: 100 }),
      ]);
    } catch (error) {
      console.error("Failed to fetch WordPress content:", error);
    }
  }

  // Split posts for different sections
  const heroGridPosts = posts.slice(0, 5);
  const breakingNewsPosts = posts.slice(5, 9);
  const latestPosts = posts.slice(9, 14);

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

      {/* Breaking News Section - 4 column grid */}
      <BreakingNewsSection posts={breakingNewsPosts} categories={categories} />

      {/* Social CTA Bar */}
      <SocialCTABar className="my-8" />

      {/* Latest Articles Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Latest articles list */}
          <div className="lg:col-span-2">
            <CompactArticleList
              posts={latestPosts}
              categories={categories}
              title="Latest"
              viewAllLink="/blog"
              viewAllText="VIEW ALL ARTICLES →"
            />
          </div>

          {/* Sidebar placeholder - will be populated in Phase 4 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-heading text-lg uppercase tracking-tight">
                    Popular
                  </h3>
                  <div className="flex-1 h-0.5 bg-[var(--clemson-purple)]" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Popular articles section coming in Phase 4
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Future sections will be added in subsequent phases:
          - Phase 4: Per-Sport Category Sections
          - Phase 7: Navigation & Search
      */}
    </>
  );
}
