import { getPosts, getCategories, isWordPressConfigured } from "@/lib/wordpress";
import type { WPPost, WPCategory } from "@/lib/wordpress";
import { OrganizationSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";
import { MiniHero } from "@/components/MiniHero";
import { HeroGrid } from "@/components/HeroGrid";

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
        getPosts({ per_page: 5 }),
        getCategories({ per_page: 100 }),
      ]);
    } catch (error) {
      console.error("Failed to fetch WordPress content:", error);
    }
  }

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
      <HeroGrid posts={posts} categories={categories} />

      {/* Future sections will be added in subsequent phases:
          - Phase 3: Breaking News Section, Content Cards
          - Phase 4: Per-Sport Category Sections
          - Phase 7: Navigation & Search
      */}
    </>
  );
}
