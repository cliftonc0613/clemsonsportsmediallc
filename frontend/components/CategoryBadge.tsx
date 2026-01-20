interface CategoryBadgeProps {
  name: string;
  className?: string;
}

export function CategoryBadge({ name, className = "" }: CategoryBadgeProps) {
  return (
    <span
      className={`bg-[var(--clemson-orange)] text-white text-xs font-semibold uppercase px-3 py-1 ${className}`}
    >
      {name}
    </span>
  );
}
