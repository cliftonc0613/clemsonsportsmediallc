import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { WPTestimonial } from "@/lib/wordpress";
import { decodeHtmlEntities } from "@/lib/wordpress";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  testimonial: WPTestimonial;
  showRating?: boolean;
  variant?: "default" | "featured";
}

// Get initials from name (up to 2 characters)
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function TestimonialCard({
  testimonial,
  showRating = true,
  variant = "default",
}: TestimonialCardProps) {
  const clientName =
    testimonial.acf?.client_name ||
    decodeHtmlEntities(testimonial.title.rendered);
  const company = testimonial.acf?.company;
  const quote = testimonial.acf?.quote;
  const rating = testimonial.acf?.rating || 5;
  const photo = testimonial.acf?.photo;

  const isFeatured = variant === "featured";

  return (
    <Card className={`h-full border-neutral-200 bg-white ${isFeatured ? "shadow-none" : ""}`}>
      <CardContent className={`flex h-full flex-col ${isFeatured ? "p-8 text-center" : "p-6"}`}>
        {/* Rating Stars */}
        {showRating && (
          <div className={`mb-4 flex gap-0.5 ${isFeatured ? "justify-center" : ""}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-neutral-200 text-neutral-200"}`}
              />
            ))}
          </div>
        )}

        {/* Quote */}
        {quote && (
          <blockquote className={`flex-grow text-neutral-700 ${isFeatured ? "text-xl leading-relaxed" : "leading-relaxed"}`}>
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}

        {/* Client Info */}
        <div className={`mt-6 flex items-center gap-3 ${isFeatured ? "justify-center" : ""}`}>
          {photo?.url ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={photo.url}
                alt={clientName}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-600">
              {getInitials(clientName)}
            </div>
          )}
          <div className={isFeatured ? "text-left" : ""}>
            <p className="font-semibold text-neutral-900">{clientName}</p>
            {company && (
              <p className="text-sm text-neutral-500">{company}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
