import type { Metadata } from "next";
import Link from "next/link";
import { getServices, isWordPressConfigured } from "@/lib/wordpress";
import type { WPService } from "@/lib/wordpress";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { BodyClass } from "@/components/BodyClass";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore our comprehensive range of services designed to help your business grow and succeed.",
};

// Enable ISR with 5 second revalidation
export const revalidate = 5;

export default async function ServicesPage() {
  let services: WPService[] = [];

  if (isWordPressConfigured()) {
    try {
      services = await getServices({ per_page: 100 });
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  }

  return (
    <>
      <BodyClass className="page-services" />

      <Hero
        title="Our Services"
        subtitle="Comprehensive solutions tailored to your business needs. We offer a wide range of services to help you succeed."
        primaryCta={{ text: "Get a Quote", href: "/contact" }}
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {services.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                No services available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Not Sure Which Service is Right for You?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let&apos;s have a conversation about your needs and goals.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
