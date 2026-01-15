import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices, stripHtml, decodeHtmlEntities, isWordPressConfigured, rewriteImageUrl, rewriteContentUrls } from "@/lib/wordpress";
import { getRankMathMeta, generateSeoMetadata } from "@/lib/seo";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiStructuredData } from "@/components/structured-data";
import { BodyClass } from "@/components/BodyClass";
import { WordPressContent } from "@/components/WordPressContent";
import { BlurImage } from "@/components/BlurImage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all services
export async function generateStaticParams() {
  // If WordPress isn't configured during build, return empty array
  // Pages will be generated on-demand with ISR
  if (!isWordPressConfigured()) {
    console.warn('WORDPRESS_API_URL not set - skipping static generation for services');
    return [];
  }

  try {
    const services = await getServices({ per_page: 100 });
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Failed to fetch services for static generation:', error);
    return [];
  }
}

// Allow dynamic paths not generated at build time
export const dynamicParams = true;

// Generate metadata for each service
export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const title = decodeHtmlEntities(service.title.rendered);
  const description = stripHtml(service.excerpt.rendered);
  const ogImageUrl = rewriteImageUrl(service.featured_image_url);

  // Try to get RankMath SEO metadata
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const pageUrl = `${siteUrl}/services/${slug}`;
  const rankMathMeta = await getRankMathMeta(pageUrl);

  // Fallback metadata from WordPress service data
  const fallback: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };

  // Use RankMath metadata with fallback
  return generateSeoMetadata(rankMathMeta, fallback);
}

// Enable ISR with 5 second revalidation
export const revalidate = 5;

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const title = decodeHtmlEntities(service.title.rendered);
  const features = service.acf?.features || [];
  const pricing = service.acf?.pricing;
  const duration = service.acf?.duration;
  const ctaText = service.acf?.cta_text || "Get Started";
  const ctaLink = service.acf?.cta_link || "/contact";

  // Rewrite image URLs from local to production
  const featuredImageUrl = rewriteImageUrl(service.featured_image_url);
  const contentHtml = rewriteContentUrls(service.content.rendered);

  const serviceUrl = `${SITE_URL}/services/${slug}`;

  // Dynamic body classes for CSS targeting
  const bodyClasses = [
    "service-single",
    `service-${slug}`,
    featuredImageUrl ? "has-thumbnail" : "no-thumbnail",
    pricing ? "has-pricing" : "no-pricing",
    features.length > 0 ? "has-features" : "no-features",
  ].join(" ");

  // Generate structured data schemas
  const serviceSchema = generateServiceSchema(service, SITE_URL, {
    provider: { name: SITE_NAME, url: SITE_URL },
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: title, url: serviceUrl },
  ]);

  return (
    <>
      <BodyClass className={bodyClasses} />

      {/* Structured Data */}
      <MultiStructuredData schemas={[serviceSchema, breadcrumbSchema]} />

      {/* Hero Section */}
      <section className="bg-muted pb-16 pt-32 md:pb-24 md:pt-48">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {title}
              </h1>
              {(pricing || duration) && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {pricing && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-lg font-semibold text-primary">
                      {pricing}
                    </span>
                  )}
                  {duration && (
                    <span className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-lg text-muted-foreground">
                      {duration}
                    </span>
                  )}
                </div>
              )}
              <WordPressContent
                html={contentHtml}
                className="prose prose-lg mt-6 max-w-none text-muted-foreground"
              />
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              </div>
            </div>
            {featuredImageUrl && (
              <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
                <BlurImage
                  src={featuredImageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
              What&apos;s Included
            </h2>
            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
              {features.map((item, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      ✓
                    </span>
                    <span className="font-medium">{item.feature}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Ready to Get Started with {title}?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Contact us today to discuss your project and how we can help you
                achieve your goals.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/services">View All Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
