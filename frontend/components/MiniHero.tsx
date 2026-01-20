interface MiniHeroProps {
  logoSrc?: string;
  className?: string;
}

export function MiniHero({
  logoSrc = "/images/clemson-sports-media-logo.png",
  className = ""
}: MiniHeroProps) {
  return (
    <section className={`relative h-[200px] overflow-hidden hidden lg:block ${className}`}>
      {/* Background image with gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(245, 102, 0, 0.5) 0%,
            rgba(82, 45, 128, 0.5) 50%,
            rgba(46, 26, 71, 0.5) 100%
          ), url('/images/home-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
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
