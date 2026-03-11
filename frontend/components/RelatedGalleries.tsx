import type { WPPhotoGallery } from "@/lib/wordpress";
import { GalleryCard } from "@/components/GalleryCard";

interface RelatedGalleriesProps {
  galleries: WPPhotoGallery[];
}

export function RelatedGalleries({ galleries }: RelatedGalleriesProps) {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            Related Galleries
          </h2>
          <div className="mt-3 mx-auto h-1 w-16 bg-[var(--clemson-orange)]" />
        </div>
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} aspectRatio="16/9" />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No other galleries available.</p>
        )}
      </div>
    </section>
  );
}
