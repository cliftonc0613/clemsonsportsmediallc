import { WPPost, WPCategory, getDisplayCategoryName } from "@/lib/wordpress";
import { HeroArticleCard } from "./HeroArticleCard";

interface HeroGridProps {
  posts: WPPost[];
  categories?: WPCategory[];
}

export function HeroGrid({ posts, categories = [] }: HeroGridProps) {
  if (posts.length === 0) {
    return null;
  }

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1, 5);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-1 lg:h-[600px]">
        {/* Large featured article - left side */}
        <div className="lg:w-1/2">
          <HeroArticleCard
            post={featuredPost}
            variant="large"
            categoryName={getDisplayCategoryName(featuredPost, categories)}
            className="aspect-[4/5] lg:aspect-auto h-full"
          />
        </div>

        {/* 2x2 grid - right side */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-1">
          {gridPosts.map((post) => (
            <HeroArticleCard
              key={post.id}
              post={post}
              variant="small"
              categoryName={getDisplayCategoryName(post, categories)}
              className="aspect-[4/3] lg:aspect-auto h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
