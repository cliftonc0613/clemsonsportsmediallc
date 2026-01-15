interface MiniHeroProps {
  logoSrc?: string;
  className?: string;
}

export function MiniHero({
  logoSrc = "/images/clemson-sports-media-logo.png",
  className = ""
}: MiniHeroProps) {
  return (
    <section className={`relative h-[200px] overflow-hidden ${className}`}>
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            var(--clemson-orange) 0%,
            var(--clemson-purple) 50%,
            var(--clemson-dark-purple) 100%
          )`
        }}
      />


      {/* Logo centered */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="Clemson Tigers"
          className="h-32 w-auto object-contain"
        />
      </div>

      {/* Orange accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--clemson-orange)]" />
    </section>
  );
}
