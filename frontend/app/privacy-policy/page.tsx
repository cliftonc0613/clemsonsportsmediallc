import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BodyClass className="page-privacy-policy legal-page" />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Privacy Policy", url: `${SITE_URL}/privacy-policy` },
        ]}
      />

      {/* Page Header */}
      <section className="bg-muted pb-16 pt-32 md:pb-24 md:pt-48">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg mx-auto max-w-3xl">
            <h2>Introduction</h2>
            <p>
              Welcome to {SITE_NAME}. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our
              website and tell you about your privacy rights.
            </p>

            <h2>Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
            <ul>
              <li><strong>Identity Data:</strong> first name, last name, username or similar identifier</li>
              <li><strong>Contact Data:</strong> email address, telephone numbers, and mailing address</li>
              <li><strong>Technical Data:</strong> internet protocol (IP) address, browser type and version,
                time zone setting, browser plug-in types and versions, operating system and platform</li>
              <li><strong>Usage Data:</strong> information about how you use our website and services</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Respond to your inquiries and fulfill your requests</li>
              <li>Send you marketing and promotional communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Contact Form Data</h2>
            <p>
              When you submit our contact form, we collect the information you provide including your name,
              email address, phone number, and message. This information is used solely to respond to your
              inquiry and will not be shared with third parties except as necessary to fulfill your request.
            </p>

            <h2>Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small text files
              placed on your device that help us provide a better user experience. You can set your browser
              to refuse all or some browser cookies, but this may affect your ability to use some features
              of our website.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services that collect, monitor and analyze data to improve our service.
              These third parties have their own privacy policies addressing how they use such information.
            </p>

            <h2>Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being
              accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal
              data to those employees, agents, contractors and other third parties who have a business need
              to know.
            </p>

            <h2>Your Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
            <ul>
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h2>Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please{" "}
              <Link href="/contact" className="text-primary underline">
                contact us
              </Link>.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
