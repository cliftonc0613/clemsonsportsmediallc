import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { WPService } from "@/lib/wordpress";
import { stripHtml, decodeHtmlEntities } from "@/lib/wordpress";

interface ServiceCardProps {
  service: WPService;
  showFeatures?: boolean;
  showCta?: boolean;
}

export function ServiceCard({
  service,
  showCta = true,
}: ServiceCardProps) {
  const title = decodeHtmlEntities(service.title.rendered);
  const excerpt = stripHtml(service.excerpt.rendered);
  const ctaText = service.acf?.cta_text || "Book Now";
  const ctaLink = service.acf?.cta_link || `/services/${service.slug}`;

  return (
    <Card className="flex h-full flex-col p-6">
      {/* Icon */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100">
        <Zap className="h-7 w-7 text-neutral-700" />
      </div>

      {/* Title */}
      <h3 className="mb-3 text-xl font-bold text-foreground">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-4 flex-grow text-muted-foreground leading-relaxed">
        {excerpt}
      </p>

      {/* CTA Link */}
      {showCta && (
        <Link
          href={ctaLink}
          className="inline-flex items-center gap-1 font-semibold text-neutral-800 transition-colors hover:text-neutral-600"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </Card>
  );
}
