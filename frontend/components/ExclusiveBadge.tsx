interface ExclusiveBadgeProps {
  className?: string;
}

export function ExclusiveBadge({ className = "" }: ExclusiveBadgeProps) {
  return (
    <span
      className={`bg-[var(--clemson-dark-purple)] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wide ${className}`}
    >
      Exclusive
    </span>
  );
}
