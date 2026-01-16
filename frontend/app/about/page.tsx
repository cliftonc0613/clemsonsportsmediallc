import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { BodyClass } from "@/components/BodyClass";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

// Team members data
const teamMembers = [
  {
    name: "Anthony Weeks",
    role: "Owner",
    email: "anthony@clemsonsportsmedia.com",
    image: "/images/anthony.jpg",
  },
  {
    name: "Clifton Canady",
    role: "Owner",
    email: "clifton@clemsonsportsmedia.com",
    image: "/images/clifton.jpg",
  },
];

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: "Learn about Clemson Sports Media and our mission to provide comprehensive coverage of Clemson University sports.",
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    description: "Learn about Clemson Sports Media and our mission to provide comprehensive coverage of Clemson University sports.",
    type: "website",
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
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
      <section className="bg-gray-100 pt-10 pb-4 md:pt-32 md:pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold uppercase text-[var(--clemson-orange)] opacity-75 tracking-widest text-center leading-none">
              About
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              About Us
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-4" />

            {/* Breadcrumb */}
            <nav className="text-base md:text-lg text-gray-500 uppercase">
              <Link href="/" className="text-[var(--clemson-purple)] hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">About</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--clemson-orange)] mb-4">
              Mission Statement
            </h2>

            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              At{" "}
              <Link
                href="/"
                className="text-[var(--clemson-orange)] hover:underline"
              >
                Clemson Sports Media
              </Link>
              , our mission is to provide comprehensive and expert coverage of
              Clemson University sports teams to passionate sports fans. We are
              dedicated to staying ahead of the curve with in-depth analysis,
              expert insights, and behind-the-scenes coverage of all things
              Clemson sports. Our goal is to keep our audience informed and
              engaged and to be the go-to source for Clemson sports enthusiasts
              who demand the highest quality of coverage. We are committed to
              excellence, integrity, and providing a platform that celebrates
              the excitement and passion of Clemson sports.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 md:grid-cols-2 md:gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="text-center">
                  {/* Photo */}
                  <div className="relative aspect-square w-full max-w-sm mx-auto mb-6 overflow-hidden bg-gray-200">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover"
                    />
                  </div>

                  {/* Name */}
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                    {member.name}
                  </h2>

                  {/* Role */}
                  <p className="text-[var(--clemson-orange)] uppercase font-bold mb-1">
                    {member.role}
                  </p>

                  {/* Email */}
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-500 hover:text-[var(--clemson-orange)] transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
