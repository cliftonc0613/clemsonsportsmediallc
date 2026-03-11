export default function PhotoGalleryLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-[var(--clemson-dark-purple)] pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="skeleton-title mx-auto bg-white/10" />
          <div className="mt-4 mx-auto h-1 w-20 bg-[var(--clemson-orange)]" />
          <div className="mt-4 mx-auto skeleton-text w-32 bg-white/10" />
        </div>
      </section>

      {/* Filter bar skeleton */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-20" />
            ))}
          </div>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="gallery-masonry-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton-image" style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/3" : "1/1" }} />
                <div className="mt-3 space-y-2">
                  <div className="skeleton-text w-3/4" />
                  <div className="skeleton-text-sm w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
