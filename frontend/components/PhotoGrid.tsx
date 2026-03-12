"use client";

import Image from "next/image";
import { rewriteImageUrl } from "@/lib/wordpress";
import "photoswipe/style.css";

/** Serializable photo shape passed from server to client */
export interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  largeSrc?: string;
}

interface PhotoGridProps {
  photos: GalleryPhoto[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const openLightbox = async (index: number) => {
    const PhotoSwipe = (await import("photoswipe")).default;

    const dataSource = photos.map((p) => ({
      src: rewriteImageUrl(p.largeSrc || p.src) || p.src,
      width: p.width,
      height: p.height,
      alt: p.alt,
    }));

    const isMobile = window.innerWidth <= 768;

    const pswp = new PhotoSwipe({
      dataSource,
      index,
      showHideAnimationType: "fade",
      showAnimationDuration: 400,
      hideAnimationDuration: 300,
      zoomAnimationDuration: 350,
      padding: isMobile
        ? { top: 40, bottom: 40, left: 10, right: 10 }
        : { top: 60, bottom: 60, left: 80, right: 80 },
      bgOpacity: 0.92,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    });

    pswp.init();
  };

  return (
    <div className="photo-masonry-grid">
      {photos.map((photo, index) => {
        const imageUrl = rewriteImageUrl(photo.largeSrc || photo.src);
        if (!imageUrl) return null;

        return (
          <button
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="block w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--clemson-orange)] group"
            aria-label={photo.alt || `View photo ${index + 1}`}
          >
            <Image
              src={imageUrl}
              alt={photo.alt || ""}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto transition-opacity duration-200 group-hover:opacity-90"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </button>
        );
      })}
    </div>
  );
}
