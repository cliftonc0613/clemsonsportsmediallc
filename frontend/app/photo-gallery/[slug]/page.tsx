import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import {
  getPhotoGallery,
  getPhotoGalleries,
  getGalleryPhotos,
  getGalleryPhotoCount,
  getGalleryEventTypes,
  decodeHtmlEntities,
  rewriteImageUrl,
  isWordPressConfigured,
} from "@/lib/wordpress";
import { PhotoGrid } from "@/components/PhotoGrid";
import type { GalleryPhoto } from "@/components/PhotoGrid";
import { RelatedGalleries } from "@/components/RelatedGalleries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!isWordPressConfigured()) return [];

  try {
    const galleries = await getPhotoGalleries({ per_page: 100, lightweight: true });
    return galleries.map((g) => ({ slug: g.slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getPhotoGallery(slug);

  if (!gallery) {
    return { title: "Gallery Not Found" };
  }

  const title = decodeHtmlEntities(gallery.title.rendered);
  const photoCount = getGalleryPhotoCount(gallery);
  const description = `${title} — ${photoCount} photos from Clemson athletics.`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/photo-gallery/${slug}`,
    },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const gallery = await getPhotoGallery(slug);

  if (!gallery) {
    notFound();
  }

  const title = decodeHtmlEntities(gallery.title.rendered);
  const eventTypes = getGalleryEventTypes(gallery);

  // Fetch full media objects for gallery photos
  const mediaObjects = await getGalleryPhotos(gallery);

  // Transform WPMedia to serializable GalleryPhoto for client components
  const photos: GalleryPhoto[] = mediaObjects.map((m) => ({
    id: m.id,
    src: m.source_url,
    alt: m.alt_text || "",
    width: m.media_details.width,
    height: m.media_details.height,
    largeSrc: m.media_details.sizes?.large?.source_url,
  }));

  const formattedDate = new Date(gallery.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Hero image: featured or first photo
  const featuredMedia = gallery._embedded?.["wp:featuredmedia"]?.[0];
  const heroUrl = rewriteImageUrl(
    gallery.featured_image_url || featuredMedia?.source_url || photos[0]?.src || null
  );

  // Photographer credits
  const photographers: string[] = [];
  if (gallery.gallery_fields?.photographer_one_name?.trim()) {
    photographers.push(gallery.gallery_fields.photographer_one_name.trim());
  }
  if (gallery.gallery_fields?.photographer_two_name?.trim()) {
    photographers.push(gallery.gallery_fields.photographer_two_name.trim());
  }

  // Related galleries: same event_type, exclude current, limit 3
  // Falls back to 3 most recent galleries if no event_type match
  let relatedGalleries: Awaited<ReturnType<typeof getPhotoGalleries>> = [];
  if (eventTypes.length > 0) {
    try {
      relatedGalleries = await getPhotoGalleries({
        event_type: eventTypes.map((et) => et.id),
        exclude: [gallery.id],
        per_page: 3,
        lightweight: true,
      });
    } catch {
      // silently ignore
    }
  }
  if (relatedGalleries.length === 0) {
    try {
      relatedGalleries = await getPhotoGalleries({
        exclude: [gallery.id],
        per_page: 3,
        lightweight: true,
      });
    } catch {
      // silently ignore
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="gallery-hero-section">
        {/* Hero Image — fills entire section including nav offset area */}
        {heroUrl && (
          <div className="absolute inset-0">
            <Image
              src={heroUrl}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--clemson-dark-purple)] via-[var(--clemson-dark-purple)]/40 to-[var(--clemson-dark-purple)]/30" />
          </div>
        )}
        {/* Fallback background when no hero image */}
        {!heroUrl && <div className="absolute inset-0 bg-[var(--clemson-dark-purple)]" />}

        {/* Header Content */}
        <div className="container mx-auto px-4 relative z-10 pt-24 md:pt-28 pb-10">
          {/* Back Link */}
          <Link
            href="/photo-gallery"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-[var(--clemson-orange)] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Galleries
          </Link>

          {/* Sport Tags */}
          {eventTypes.length > 0 && (
            <div className="flex gap-2 mb-3">
              {eventTypes.map((et) => (
                <span
                  key={et.id}
                  className="bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-3 py-1 tracking-wide"
                >
                  {et.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {title}
          </h1>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/60 text-sm">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1.5">
              <Camera className="h-4 w-4" />
              {photos.length} photos
            </span>
            {photographers.length > 0 && (
              <span>
                Photos by {photographers.join(" & ")}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {photos.length > 0 ? (
            <PhotoGrid photos={photos} />
          ) : (
            <div className="py-20 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg text-gray-500">No photos in this gallery yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Galleries */}
      <RelatedGalleries galleries={relatedGalleries} />
    </>
  );
}
