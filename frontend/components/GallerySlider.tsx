"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { GalleryCard } from "@/components/GalleryCard";
import type { WPPhotoGallery } from "@/lib/wordpress";

interface GallerySliderProps {
  galleries: WPPhotoGallery[];
}

export function GallerySlider({ galleries }: GallerySliderProps) {
  if (galleries.length === 0) return null;

  return (
    <section className="gallery-slider-section">
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">
            Photo Galleries
          </h2>
          <Link
            href="/photo-gallery"
            className="text-sm font-semibold uppercase tracking-wide text-[var(--clemson-orange)] hover:underline"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="gallery-swiper-wrapper">
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={15}
          loop={true}
          speed={600}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {galleries.map((gallery) => (
            <SwiperSlide key={gallery.id}>
              <GalleryCard gallery={gallery} aspectRatio="16/9" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
