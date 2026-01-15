import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getPage,
  stripHtml,
  decodeHtmlEntities,
  rewriteImageUrl,
  rewriteContentUrls,
} from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { StakesSection } from "@/components/storybrand/StakesSection";
import { AboutSection } from "@/components/AboutSection";
import { BodyClass } from "@/components/BodyClass";
import { WordPressContent } from "@/components/WordPressContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

// Stats data - can be moved to WordPress custom fields later
const stats = [
  { value: "10+", title: "Years Experience" },
  { value: "200+", title: "Projects Completed" },
  { value: "50+", title: "Happy Clients" },
  { value: "99%", title: "Client Satisfaction" },
];

// Team members data - can be moved to WordPress custom fields or CPT later
const teamMembers = [
  {
    name: "Jane Smith",
    role: "Founder & CEO",
    image: "/images/team/jane.jpg",
    bio: "Passionate about creating exceptional digital experiences.",
  },
  {
    name: "John Doe",
    role: "Lead Developer",
    image: "/images/team/john.jpg",
    bio: "Full-stack developer with 10+ years of experience.",
  },
  {
    name: "Sarah Johnson",
    role: "Design Director",
    image: "/images/team/sarah.jpg",
    bio: "Award-winning designer focused on user-centered design.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about");

  if (!page) {
    return {
      title: "About Us",
      description: `Learn more about ${SITE_NAME}`,
    };
  }

  const title = decodeHtmlEntities(page.title.rendered);
  const description = stripHtml(page.excerpt.rendered) || `Learn more about ${SITE_NAME}`;
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

export const revalidate = 5;

export default async function AboutPage() {
  const page = await getPage("about");

  // Fallback content if WordPress page doesn't exist
  const title = page ? decodeHtmlEntities(page.title.rendered) : "About Us";
  const content = page ? rewriteContentUrls(page.content.rendered) : "";
  const featuredImageUrl = page ? rewriteImageUrl(page.featured_image_url) : null;

  return (
    <>
      <BodyClass className="page-about" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-muted pb-16 pt-32 md:pb-24 md:pt-48">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {title}
            </h1>

            {/* WordPress content or fallback - uses sanitized WordPressContent */}
            {content ? (
              <WordPressContent
                html={content}
                className="prose prose-lg mx-auto max-w-2xl text-muted-foreground prose-p:text-muted-foreground"
              />
            ) : (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                We&apos;re passionate about creating exceptional digital experiences
                that help businesses grow and succeed in the modern world.
              </p>
            )}
          </div>

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="mx-auto mt-12 max-w-5xl">
              <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={featuredImageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1024px, 1280px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <StakesSection variant="stats" items={stats} className="py-6 md:py-8" />

      {/* Meet Your Guide Section */}
      <AboutSection
        heading="Our Story"
        paragraphs={[
          "We understand what it's like to struggle with digital challenges. You shouldn't have to figure this out alone.",
          "With over 10 years of experience and 200+ successful projects, we've helped businesses like yours achieve their digital goals.",
          "Our approach combines strategic thinking with hands-on expertise to deliver solutions that actually work for your business.",
          "Whether you're just starting out or looking to scale, we're here to guide you every step of the way.",
        ]}
      />

      {/* Team Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Meet Our Team
            </h2>
            <p className="mb-16 text-lg text-muted-foreground">
              The talented people behind our success
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group text-center"
              >
                <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full bg-muted">
                  {/* Placeholder - replace with actual images */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <span className="text-4xl font-bold text-primary/40">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  {/* Uncomment when images are available:
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="192px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  */}
                </div>
                <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Work Together?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">View Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
