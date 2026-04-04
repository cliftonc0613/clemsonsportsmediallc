import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { getServices } from "@/lib/wordpress";
import { Mail } from "lucide-react";
import { BodyClass } from "@/components/BodyClass";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with us. We'd love to hear from you and discuss how we can help your business grow.",
};

// Revalidate services list every 5 seconds

export default async function ContactPage() {
  // Fetch services to populate the dropdown
  const services = await getServices({ per_page: 100, lightweight: true });

  return (
    <>
      <BodyClass className="page-contact" />

      {/* Hero Section */}
      <section className="bg-[var(--clemson-dark-purple)] pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] font-heading font-bold uppercase text-white opacity-10 tracking-widest text-center leading-none">
              Contact
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Contact Us
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Breadcrumb */}
            <nav className="text-base md:text-lg text-gray-300 uppercase">
              <Link href="/" className="text-white hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--clemson-orange)]">Contact</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-lg leading-relaxed text-neutral-600">
              Ready to connect? Reach out for story tips, sponsorship opportunities,
              or to learn more about Clemson Sports Media.
            </p>
            <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--clemson-orange)]/20 bg-white px-6 py-3 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--clemson-orange)]/10">
                <Mail className="h-5 w-5 text-[var(--clemson-orange)]" />
              </div>
              <a
                href="mailto:info@clemsonsportsmedia.com"
                className="font-semibold text-[var(--clemson-purple)] transition-colors hover:text-[var(--clemson-orange)]"
              >
                info@clemsonsportsmedia.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-heading text-3xl font-bold text-[var(--clemson-purple)]">
            Send Us a Message
          </h2>
          <div className="mx-auto max-w-2xl">
            <ContactForm services={services} />
          </div>
        </div>
      </section>
    </>
  );
}
