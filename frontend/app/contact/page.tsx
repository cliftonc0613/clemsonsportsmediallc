import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ContactForm } from "@/components/ContactForm";
import { getServices } from "@/lib/wordpress";
import { Phone, Mail, MapPin } from "lucide-react";
import { BodyClass } from "@/components/BodyClass";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with us. We'd love to hear from you and discuss how we can help your business grow.",
};

// Revalidate services list every 5 seconds
export const revalidate = 5;

export default async function ContactPage() {
  // Fetch services to populate the dropdown
  const services = await getServices({ per_page: 100 });

  return (
    <>
      <BodyClass className="page-contact" />

      <Hero
        title="Contact Us"
        subtitle="Have a question or want to work together? We'd love to hear from you."
        size="default"
      />

      {/* Contact Information Section */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-neutral-600">
              Ready to get started? Contact our professional team for free estimates,
              expert consultation, and personalized solutions. We&apos;re here to help
              with reliable, licensed services.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {/* Phone Card */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <Phone className="h-7 w-7 text-neutral-700" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900">Phone</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Call us for immediate assistance
              </p>
              <a
                href="tel:+11234567890"
                className="mt-3 inline-block font-semibold text-neutral-900 hover:underline"
              >
                (123) 456-7890
              </a>
            </div>

            {/* Email Card */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <Mail className="h-7 w-7 text-neutral-700" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900">Email</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Send us a message anytime
              </p>
              <a
                href="mailto:hello@example.com"
                className="mt-3 inline-block font-semibold text-neutral-900 hover:underline"
              >
                hello@example.com
              </a>
            </div>

            {/* Address Card */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <MapPin className="h-7 w-7 text-neutral-700" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900">Address</h3>
              <p className="mt-2 text-sm text-neutral-500">
                Visit our office location
              </p>
              <address className="mt-3 not-italic font-semibold text-neutral-900">
                123 Main Street
                <br />
                City, State 12345
              </address>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-heading text-3xl font-bold text-neutral-800">
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
