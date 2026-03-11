import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getPhotoGalleriesWithPagination,
  getEventTypes,
  getEventTypeBySlug,
  isWordPressConfigured,
} from "@/lib/wordpress";
import { GalleryFilterTabs } from "@/components/GalleryFilterTabs";
import { GalleryInfiniteGrid } from "@/components/GalleryInfiniteGrid";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";
const GALLERIES_PER_PAGE = 12;

export const metadata: Metadata = {
  title: `Photo Gallery | ${SITE_NAME}`,
  description: `Browse photo galleries from Clemson athletics events, games, and behind-the-scenes coverage.`,
  openGraph: {
    title: `Photo Gallery | ${SITE_NAME}`,
    description: `Browse photo galleries from Clemson athletics events, games, and behind-the-scenes coverage.`,
    type: "website",
    url: `${SITE_URL}/photo-gallery`,
  },
};

export const revalidate = 5;

interface PhotoGalleryPageProps {
  searchParams: Promise<{ page?: string; sport?: string; search?: string }>;
}

export default async function PhotoGalleryPage({
  searchParams,
}: PhotoGalleryPageProps) {
  const { page, sport, search } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // Resolve sport slug to event_type ID
  let eventTypeFilter: number[] | undefined;
  if (sport) {
    const eventType = await getEventTypeBySlug(sport);
    if (eventType) {
      eventTypeFilter = [eventType.id];
    }
  }

  // Parallel fetch
  const [eventTypes, galleriesResult] = await Promise.all([
    isWordPressConfigured()
      ? getEventTypes({ per_page: 50, hide_empty: true })
      : Promise.resolve([]),
    isWordPressConfigured()
      ? getPhotoGalleriesWithPagination({
          per_page: GALLERIES_PER_PAGE,
          page: currentPage,
          event_type: eventTypeFilter,
          search: search || undefined,
        })
      : Promise.resolve({
          items: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
        }),
  ]);

  const { items: galleries, totalPages, totalItems } = galleriesResult;

  // Pass the server-side WordPress API URL to the client component
  const apiUrl = process.env.WORDPRESS_API_URL || "";

  return (
    <>
      {/* Hero Header */}
      <section className="bg-[var(--clemson-dark-purple)] pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[14rem] font-heading font-bold uppercase text-white opacity-[0.04] tracking-widest leading-none">
            Gallery
          </span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
            Photo Gallery
          </h1>
          <div className="mt-4 mx-auto h-1 w-20 bg-[var(--clemson-orange)]" />
          <p className="mt-4 text-center text-lg text-white/60">
            {totalItems} {totalItems === 1 ? "gallery" : "galleries"}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <Suspense fallback={null}>
            <GalleryFilterTabs eventTypes={eventTypes} />
          </Suspense>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          {galleries.length > 0 ? (
            <GalleryInfiniteGrid
              key={`${sport || "all"}-${search || ""}-${currentPage}`}
              initialGalleries={galleries}
              totalPages={totalPages}
              currentPage={currentPage}
              apiUrl={apiUrl}
              eventTypeId={eventTypeFilter?.[0]}
              search={search}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-500">No galleries found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
