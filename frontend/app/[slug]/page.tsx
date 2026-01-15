import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPage,
  getPages,
  stripHtml,
  decodeHtmlEntities,
  rewriteImageUrl,
  rewriteContentUrls,
  isWordPressConfigured,
} from "@/lib/wordpress";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";
import { WordPressContent } from "@/components/WordPressContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Reserved slugs that have their own routes - exclude from this catch-all
const RESERVED_SLUGS = [
  "blog",
  "services",
  "contact",
  "testimonials",
  "about",
  "api",
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all pages
export async function generateStaticParams() {
  if (!isWordPressConfigured()) {
    console.warn("WORDPRESS_API_URL not set - skipping static generation for pages");
    return [];
  }

  try {
    const pages = await getPages({ per_page: 100 });
    return pages
      .filter((page) => !RESERVED_SLUGS.includes(page.slug))
      .map((page) => ({
        slug: page.slug,
      }));
  } catch (error) {
    console.error("Failed to fetch pages for static generation:", error);
    return [];
  }
}

// Allow dynamic paths not generated at build time
export const dynamicParams = true;

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Return 404 for reserved slugs (they have their own routes)
  if (RESERVED_SLUGS.includes(slug)) {
    return { title: "Page Not Found" };
  }

  const page = await getPage(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  const title = decodeHtmlEntities(page.title.rendered);
  const description = stripHtml(page.excerpt.rendered) || `${title} page`;
  const ogImageUrl = rewriteImageUrl(page.featured_image_url);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

// Enable ISR with 5 second revalidation
export const revalidate = 5;

export default async function PageSingle({ params }: PageProps) {
  const { slug } = await params;

  // Return 404 for reserved slugs
  if (RESERVED_SLUGS.includes(slug)) {
    notFound();
  }

  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  const title = decodeHtmlEntities(page.title.rendered);
  const featuredImageUrl = rewriteImageUrl(page.featured_image_url);
  const contentHtml = rewriteContentUrls(page.content.rendered);

  // Dynamic body classes for CSS targeting
  const bodyClasses = [
    "page-single",
    `page-${slug}`,
    featuredImageUrl ? "has-thumbnail" : "no-thumbnail",
  ].join(" ");

  return (
    <>
      <BodyClass className={bodyClasses} />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: title, url: `${SITE_URL}/${slug}` },
        ]}
      />

      {/* Page Hero */}
      <section className="bg-muted pb-16 pt-32 md:pb-24 md:pt-48">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
          </div>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={featuredImageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Page Content */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <WordPressContent
              html={contentHtml}
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
            />
          </div>
        </div>
      </article>
    </>
  );
}
