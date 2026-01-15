import Image from "next/image";
import { Award, Users, Clock } from "lucide-react";

interface AuthorityMarker {
  icon?: React.ReactNode;
  stat: string;
  label: string;
}

interface GuideSectionProps {
  empathyStatement?: string;
  authorityStatement?: string;
  imageSrc?: string;
  imageAlt?: string;
  authorityMarkers?: AuthorityMarker[];
}

/**
 * StoryBrand Guide Section
 *
 * Purpose: Position your brand as the trusted GUIDE
 *
 * In StoryBrand, your brand is NOT the hero - the customer is.
 * You are the GUIDE (think Yoda, not Luke).
 *
 * A good guide demonstrates:
 * 1. EMPATHY - "We understand your struggle"
 * 2. AUTHORITY - "We have the experience to help you win"
 *
 * Keep this section brief. It's about building trust, not telling your life story.
 */
export function GuideSection({
  empathyStatement = "[EMPATHY: We understand what it's like to struggle with [problem]. You shouldn't have to figure this out alone.]",
  authorityStatement = "[AUTHORITY: With [X years/clients/results], we've helped [type of customer] achieve [specific outcome]. We know the path to success because we've walked it many times before.]",
  imageSrc,
  imageAlt = "Our team",
  authorityMarkers = [
    {
      icon: <Clock className="h-6 w-6" />,
      stat: "[X]+",
      label: "Years Experience",
    },
    {
      icon: <Users className="h-6 w-6" />,
      stat: "[X]+",
      label: "Happy Clients",
    },
    {
      icon: <Award className="h-6 w-6" />,
      stat: "[X]%",
      label: "Success Rate",
    },
  ],
}: GuideSectionProps) {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Image/Visual side */}
          <div className="relative">
            {imageSrc ? (
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="absolute inset-0 flex items-center justify-center p-[10px]">
                  <div className="text-center text-muted-foreground">
                    <Users className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-4">[GUIDE IMAGE: Team photo or founder headshot]</p>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative element */}
            <div className="absolute -bottom-[3px] left-0 -z-10 h-full w-full rotate-[7deg] rounded-2xl bg-primary/10" />
          </div>

          {/* Content side */}
          <div className="space-y-6">
            {/* Eyebrow */}
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Meet Your Guide
            </span>

            {/* Empathy statement */}
            <p className="text-xl leading-relaxed text-foreground">
              {empathyStatement}
            </p>

            {/* Authority statement */}
            <p className="text-lg text-muted-foreground">
              {authorityStatement}
            </p>

            {/* Authority markers */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {authorityMarkers.map((marker, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-background p-4 text-center"
                >
                  <div className="mb-2 inline-flex text-primary">
                    {marker.icon}
                  </div>
                  <div className="text-2xl font-bold">{marker.stat}</div>
                  <div className="text-sm text-muted-foreground">
                    {marker.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
