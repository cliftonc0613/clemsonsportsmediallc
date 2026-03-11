import Link from "next/link";
import Image from "next/image";
import { Camera } from "lucide-react";
import type { WPPhotoGallery } from "@/lib/wordpress";
import {
  decodeHtmlEntities,
  rewriteImageUrl,
  getGalleryPhotoCount,
  getGalleryEventTypes,
} from "@/lib/wordpress";

interface GalleryCardProps {
  gallery: WPPhotoGallery;
  /** When "16/9", the cover image is cropped to a fixed 16:9 aspect ratio */
  aspectRatio?: "16/9";
}

function getGalleryEventYears(
  gallery: WPPhotoGallery
): Array<{ id: number; name: string; slug: string }> {
  const terms = gallery._embedded?.["wp:term"];
  if (!terms) return [];
  return terms
    .flat()
    .filter((term) => term.taxonomy === "event_year")
    .map((term) => ({ id: term.id, name: term.name, slug: term.slug }));
}

export function GalleryCard({ gallery, aspectRatio }: GalleryCardProps) {
  const title = decodeHtmlEntities(gallery.title.rendered);
  const photoCount = getGalleryPhotoCount(gallery);
  const eventTypes = getGalleryEventTypes(gallery);
  const eventYears = getGalleryEventYears(gallery);

  // Get cover image: featured image or first embedded media
  const featuredMedia = gallery._embedded?.["wp:featuredmedia"]?.[0];
  const coverUrl = rewriteImageUrl(
    gallery.featured_image_url || featuredMedia?.source_url || null
  );

  const formattedDate = new Date(gallery.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group">
      <Link href={`/photo-gallery/${gallery.slug}`} className="block">
        {/* Image container — title/date overlay lives inside here */}
        <div className={`relative overflow-hidden bg-neutral-100${aspectRatio === "16/9" ? " aspect-[16/9]" : ""}`}>
          {coverUrl ? (
            aspectRatio === "16/9" ? (
              <Image
                src={coverUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <Image
                src={coverUrl}
                alt={title}
                width={600}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )
          ) : (
            <div className="aspect-[3/2] flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-100">
              <Camera className="h-12 w-12 text-neutral-300" />
            </div>
          )}

          {/* Gradient overlay with title + date */}
          <div className="gallery-card-overlay">
            <h3 className="font-heading text-base font-bold leading-tight text-white transition-colors group-hover:text-[var(--clemson-orange)] line-clamp-2">
              {title}
            </h3>
            <p className="mt-1 text-xs text-white/70">{formattedDate}</p>
          </div>

          {/* Photo count badge — bottom-right */}
          {photoCount > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              <Camera className="h-3.5 w-3.5" />
              {photoCount}
            </div>
          )}

          {/* Sport tag — top-left */}
          {eventTypes.length > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-[var(--clemson-orange)] text-white text-xs font-bold uppercase px-2.5 py-1 tracking-wide">
                {eventTypes[0].name}
              </span>
            </div>
          )}

          {/* Year ribbon — top-right diagonal */}
          {eventYears.length > 0 && (
            <div className="year-ribbon-wrap">
              <span className="year-ribbon">{eventYears[0].name}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
