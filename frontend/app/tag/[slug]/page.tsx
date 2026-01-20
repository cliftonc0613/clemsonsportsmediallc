import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostsByTagSlugWithPagination,
  getTags,
  isWordPressConfigured,
  decodeHtmlEntities,
} from "@/lib/wordpress";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import { MultiStructuredData } from "@/components/structured-data";
import { BodyClass } from "@/components/BodyClass";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";
const POSTS_PER_PAGE = 12;

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Generate static paths for all tags
export async function generateStaticParams() {
  if (!isWordPressConfigured()) {
    return [];
  }

  try {
    const tags = await getTags({ per_page: 100 });
    return tags.map((tag) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch tags for static generation:", error);
    return [];
  }
}

// Allow dynamic paths not generated at build time
export const dynamicParams = true;

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Generate metadata for each tag
export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostsByTagSlugWithPagination(slug, {
    per_page: 1,
  });

  if (!result.tag) {
    return {
      title: "Tag Not Found",
    };
  }

  const tagName = decodeHtmlEntities(result.tag.name);
  const description =
    result.tag.description ||
    `Browse all articles tagged with "${tagName}" on ${SITE_NAME}`;

  return {
    title: `#${tagName} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `#${tagName} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/tag/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `#${tagName} | ${SITE_NAME}`,
      description,
    },
  };
}

// Enable ISR with 5 second revalidation
export const revalidate = 5;

export default async function TagPage({
  params,
  searchParams,
}: TagPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const result = await getPostsByTagSlugWithPagination(slug, {
    per_page: POSTS_PER_PAGE,
    page: currentPage,
  });

  if (!result.tag) {
    notFound();
  }

  const tagName = decodeHtmlEntities(result.tag.name);
  const { items: posts, totalPages, totalItems } = result;

  // Dynamic body classes
  const bodyClasses = ["archive", "tag-archive", `tag-${slug}`].join(" ");

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: `#${tagName}`, url: `${SITE_URL}/tag/${slug}` },
  ]);

  return (
    <>
      <BodyClass className={bodyClasses} />
      <MultiStructuredData schemas={[breadcrumbSchema]} />

      {/* Tag Header - Simpler style than category */}
      <section className="bg-gray-100 pt-32 pb-12 md:pt-48 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-500">
              <Link href="/" className="hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-[var(--clemson-orange)]">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">#{tagName}</span>
            </nav>

            {/* Tag Badge */}
            <div className="inline-block bg-[var(--clemson-purple)] text-white text-sm font-semibold uppercase px-4 py-2 mb-4">
              Tag
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              #{tagName}
            </h1>

            {/* Orange accent line */}
            <div className="w-16 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            <p className="text-gray-600">
              {totalItems} {totalItems === 1 ? "article" : "articles"} tagged
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={`/tag/${slug}`}
                  className="mt-12"
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No articles found with this tag.
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
