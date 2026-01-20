import type { Metadata } from "next";
import Link from "next/link";
import { BodyClass } from "@/components/BodyClass";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { ExternalLink } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

export const metadata: Metadata = {
  title: `Men's Soccer Schedule | ${SITE_NAME}`,
  description: "Clemson Tigers Men's Soccer schedule with game times, opponents, and results.",
  openGraph: {
    title: `Men's Soccer Schedule | ${SITE_NAME}`,
    description: "Clemson Tigers Men's Soccer schedule with game times, opponents, and results.",
    type: "website",
    url: `${SITE_URL}/schedule/mens-soccer`,
  },
};

export default function MensSoccerSchedulePage() {
  return (
    <>
      <BodyClass className="page-schedule" />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Schedule", url: `${SITE_URL}/schedule` },
          { name: "Men's Soccer", url: `${SITE_URL}/schedule/mens-soccer` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[var(--clemson-dark-purple)] pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--clemson-orange)] to-transparent" />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]/70" />

        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] font-heading font-bold uppercase text-white opacity-10 tracking-widest text-center leading-none">
              Soccer
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Men&apos;s Soccer Schedule
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Breadcrumb */}
            <nav className="text-base md:text-lg text-gray-300 uppercase">
              <Link href="/" className="text-white hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-400">Schedule</span>
              <span className="mx-2">/</span>
              <span className="text-[var(--clemson-orange)]">Men&apos;s Soccer</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="mx-auto px-4 max-w-[800px]">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-[var(--clemson-purple)]">
              2025 Season Schedule
            </h2>
            <p className="text-gray-600 mb-6">
              View the complete Clemson Men&apos;s Soccer schedule on the official Clemson Tigers website.
            </p>
            <a
              href="https://clemsontigers.com/sports/mens-soccer/schedule/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/90 text-white font-heading font-bold uppercase tracking-wider px-8 py-4 rounded transition-colors"
            >
              View Official Schedule
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/roster/mens-soccer"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center"
            >
              <h3 className="font-heading text-lg font-bold text-[var(--clemson-purple)] mb-2">
                View Roster
              </h3>
              <p className="text-sm text-gray-500">
                Meet the 2025 Men&apos;s Soccer team
              </p>
            </Link>
            <a
              href="https://clemsontigers.com/sports/mens-soccer/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center"
            >
              <h3 className="font-heading text-lg font-bold text-[var(--clemson-purple)] mb-2">
                Official Site
              </h3>
              <p className="text-sm text-gray-500">
                Visit ClemsonTigers.com for more
              </p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
