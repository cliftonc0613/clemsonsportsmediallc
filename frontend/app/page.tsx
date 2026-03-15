import { getPosts, getCategories, getTags, getPostsByCategorySlug, getPhotoGalleries, isWordPressConfigured } from "@/lib/wordpress";
import type { WPPost, WPCategory, WPTag, WPPhotoGallery } from "@/lib/wordpress";
import { getClemsonGameById } from "@/lib/espn";
import type { SimpleGame } from "@/lib/espn-types";
import { GameScoreWidget } from "@/components/espn";

// Category slugs
const BREAKING_NEWS_CATEGORY = "breaking-news";
const SPORT_CATEGORIES = [
  { slug: "football", name: "Football" },
  { slug: "basketball", name: "Basketball" },
  { slug: "baseball", name: "Baseball" },
  { slug: "softball", name: "Softball" },
  { slug: "soccer", name: "Soccer" },
  { slug: "recruiting", name: "Recruiting" },
];

import { OrganizationSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";
import { MiniHero } from "@/components/MiniHero";
import { HeroGrid } from "@/components/HeroGrid";
import { BreakingNewsSection } from "@/components/BreakingNewsSection";
import { ArticleListGrid } from "@/components/ArticleListGrid";
import { SocialCTABar } from "@/components/SocialCTABar";
import { SportCategorySection } from "@/components/SportCategorySection";
import { GallerySlider } from "@/components/GallerySlider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

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
  let mensBasketballGame: SimpleGame | null = null;
  let womensBasketballGame: SimpleGame | null = null;
  let baseballGame: SimpleGame | null = null;
  let photoGalleries: WPPhotoGallery[] = [];

  if (isWordPressConfigured()) {
    try {
      // Fetch ALL data in parallel — ESPN + WordPress together
      const [
        mainPosts,
        breakingNews,
        cats,
        allTags,
        mensGame,
        womensGame,
        baseballGameResult,
        galleries,
        ...sportResults
      ] = await Promise.all([
        getPosts({ per_page: 20 }),
        getPostsByCategorySlug(BREAKING_NEWS_CATEGORY, { per_page: 4 }),
        getCategories({ per_page: 100 }),
        getTags({ per_page: 100 }),
        getClemsonGameById("mensBasketball", "latest").catch(() => null),
        getClemsonGameById("womensBasketball", "latest").catch(() => null),
        getClemsonGameById("baseball", "latest").catch(() => null),
        getPhotoGalleries({ per_page: 30 }).catch(() => [] as WPPhotoGallery[]),
        ...SPORT_CATEGORIES.map((cat) =>
          getPostsByCategorySlug(cat.slug, { per_page: 14 }).then((catPosts) => ({
            slug: cat.slug,
            posts: catPosts,
          }))
        ),
      ]);

      posts = mainPosts;
      breakingNewsPosts = breakingNews;
      categories = cats;
      tags = allTags;
      mensBasketballGame = mensGame;
      womensBasketballGame = womensGame;
      baseballGame = baseballGameResult;
      // Shuffle galleries (Fisher-Yates) and take 15 for random variety per ISR cycle
      const shuffled = [...(galleries as WPPhotoGallery[])];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      photoGalleries = shuffled.slice(0, 15);

      sportPosts = (sportResults as { slug: string; posts: WPPost[] }[]).reduce(
        (acc, { slug, posts }) => {
          acc[slug] = posts;
          return acc;
        },
        {} as Record<string, WPPost[]>
      );
    } catch (error) {
      console.error("Failed to fetch homepage content:", error);
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

          // Render scoreboard for basketball and baseball sections
          const isBasketball = cat.slug === "basketball";
          const isBaseball = cat.slug === "baseball";

          return (
            <SportCategorySection
              key={cat.slug}
              posts={uniquePosts}
              categories={categories}
              tags={tags}
              categoryName={cat.name}
              categorySlug={cat.slug}
            >
              {isBasketball && (mensBasketballGame || womensBasketballGame) && (
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mensBasketballGame && (
                    <GameScoreWidget
                      sport="mensBasketball"
                      initialGame={mensBasketballGame}
                      postGameDuration={30}
                      title="Men's Basketball"
                    />
                  )}
                  {womensBasketballGame && (
                    <GameScoreWidget
                      sport="womensBasketball"
                      initialGame={womensBasketballGame}
                      postGameDuration={30}
                      title="Women's Basketball"
                    />
                  )}
                </div>
              )}
              {isBaseball && baseballGame && (
                <div className="mb-8">
                  <GameScoreWidget
                    sport="baseball"
                    initialGame={baseballGame}
                    postGameDuration={30}
                    title="Baseball"
                  />
                </div>
              )}
            </SportCategorySection>
          );
        });
      })()}

      {/* Photo Gallery Slider */}
      <GallerySlider galleries={photoGalleries} />
    </>
  );
}
