export default function GalleryLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-[var(--clemson-dark-purple)] pt-24 md:pt-28">
        <div className="skeleton-image max-h-[60vh]" style={{ aspectRatio: "21/9" }} />
        <div className="container mx-auto px-4 -mt-20 pb-10">
          <div className="skeleton-text-sm w-24 bg-white/10 mb-6" />
          <div className="skeleton h-6 w-20 bg-[var(--clemson-orange)]/30 mb-3" />
          <div className="skeleton-title bg-white/10" />
          <div className="mt-4 flex gap-4">
            <div className="skeleton-text-sm w-32 bg-white/10" />
            <div className="skeleton-text-sm w-24 bg-white/10" />
          </div>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="photo-masonry-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ aspectRatio: i % 4 === 0 ? "3/4" : i % 4 === 1 ? "1/1" : i % 4 === 2 ? "4/3" : "3/2" }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
