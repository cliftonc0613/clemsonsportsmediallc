interface SportSectionHeaderProps {
  categoryName: string;
  watermarkText?: string;
  className?: string;
}

export function SportSectionHeader({
  categoryName,
  watermarkText,
  className = "",
}: SportSectionHeaderProps) {
  const watermark = watermarkText || categoryName.toUpperCase();

  return (
    <div className={`relative py-16 ${className}`}>
      {/* Watermark Background Text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
        aria-hidden="true"
      >
        <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold uppercase text-gray-200 tracking-widest text-center leading-none">
          {watermark}
        </span>
      </div>

      {/* Category Title */}
      <div className="relative z-10 text-center">
        <h2 className="inline-block font-heading text-2xl md:text-3xl font-bold text-black pb-2 border-b-4 border-[var(--clemson-orange)]">
          {categoryName}
        </h2>
      </div>
    </div>
  );
}
