import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPostsByCategorySlugWithPagination,
  getCategories,
  isWordPressConfigured,
  decodeHtmlEntities,
  rewriteImageUrl,
} from "@/lib/wordpress";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import { MultiStructuredData } from "@/components/structured-data";
import { BodyClass } from "@/components/BodyClass";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";
const POSTS_PER_PAGE = 13;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Generate static paths for all categories
export async function generateStaticParams() {
  if (!isWordPressConfigured()) {
    return [];
  }

  try {
    const categories = await getCategories({ per_page: 100 });
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch categories for static generation:", error);
    return [];
  }
}

// Allow dynamic paths not generated at build time
export const dynamicParams = true;

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Generate metadata for each category
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostsByCategorySlugWithPagination(slug, {
    per_page: 1,
  });

  if (!result.category) {
    return {
      title: "Category Not Found",
    };
  }

  const categoryName = decodeHtmlEntities(result.category.name);
  const description =
    result.category.description ||
    `Browse all ${categoryName} articles on ${SITE_NAME}`;

  return {
    title: `${categoryName} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${categoryName} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/category/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${categoryName} | ${SITE_NAME}`,
      description,
    },
  };
}

// Enable ISR with 5 second revalidation
export const revalidate = 5;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const result = await getPostsByCategorySlugWithPagination(slug, {
    per_page: POSTS_PER_PAGE,
    page: currentPage,
  });

  if (!result.category) {
    notFound();
  }

  const categoryName = decodeHtmlEntities(result.category.name);
  const { items: posts, totalPages, totalItems } = result;

  // Dynamic body classes
  const bodyClasses = [
    "archive",
    "category-archive",
    `category-${slug}`,
  ].join(" ");

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: categoryName, url: `${SITE_URL}/category/${slug}` },
  ]);

  return (
    <>
      <BodyClass className={bodyClasses} />
      <MultiStructuredData schemas={[breadcrumbSchema]} />

      {/* Category Header with Watermark */}
      <section className="bg-gray-100 pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/hero-${slug}.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold uppercase text-[var(--clemson-orange)] opacity-75 tracking-widest text-center leading-none">
              {categoryName}
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {categoryName}
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Breadcrumb */}
            <nav className="mb-2 text-base md:text-lg text-gray-500 uppercase">
              <Link href="/" className="text-[var(--clemson-purple)] hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">{categoryName}</span>
            </nav>

            <p className="text-lg md:text-xl text-gray-600">
              {totalItems} {totalItems === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles - First 4 */}
      {posts.length >= 4 && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.slice(0, 4).map((post) => {
                const title = decodeHtmlEntities(post.title.rendered);
                const imageUrl = rewriteImageUrl(post.featured_image_url);
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200" />
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-block bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-3 py-1.5 mb-3">
                          {categoryName}
                        </span>
                        <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight text-white line-clamp-3">
                          {title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice(4).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={`/category/${slug}`}
                  className="mt-12"
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No articles found in this category.
              </p>
              <Link
                href="/blog"
                className="inline-block mt-4 text-[var(--clemson-orange)] hover:underline"
              >
                ← Back to Blog
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
