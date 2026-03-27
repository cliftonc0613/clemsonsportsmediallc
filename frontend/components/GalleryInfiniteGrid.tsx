"use client";

import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import type { WPPhotoGallery } from "@/lib/wordpress";
import { GalleryCard } from "@/components/GalleryCard";

interface GalleryInfiniteGridProps {
  initialGalleries: WPPhotoGallery[];
  totalPages: number;
  currentPage: number;
  /** Server-side WordPress API URL passed as prop (env var not available client-side) */
  apiUrl: string;
  eventTypeId?: number;
  search?: string;
}

export function GalleryInfiniteGrid({
  initialGalleries,
  totalPages,
  currentPage,
  apiUrl,
  eventTypeId,
  search,
}: GalleryInfiniteGridProps) {
  const [galleries, setGalleries] =
    useState<WPPhotoGallery[]>(initialGalleries);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  const hasMore = page < totalPages;

  // Animate cards on mount and when new cards are added
  useLayoutEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;
    const startIndex = prevCountRef.current;

    // Animate only new cards (or all on first mount)
    const targets = Array.from(cards).slice(startIndex);
    if (targets.length === 0) return;

    gsap.fromTo(
      targets,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
      }
    );

    prevCountRef.current = cards.length;
  }, [galleries]);

  async function loadMore() {
    const nextPage = page + 1;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("per_page", "12");
      params.set("page", nextPage.toString());
      params.set("_embed", "true");
      if (eventTypeId) params.set("event_type", eventTypeId.toString());
      if (search) params.set("search", search);

      const res = await fetch(
        `${apiUrl}/photo-gallery?${params.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch galleries");

      const newGalleries = (await res.json()) as WPPhotoGallery[];
      setGalleries((prev) => [...prev, ...newGalleries]);
      setPage(nextPage);
    } catch (err) {
      console.error("Gallery load-more error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div ref={gridRef} className="gallery-masonry-grid">
        {galleries.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="gallery-load-more-btn"
          >
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
