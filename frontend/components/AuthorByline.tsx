import Image from "next/image";

interface AuthorBylineProps {
  authorName: string;
  authorAvatar?: string | null;
  date: string;
  size?: "sm" | "md";
  className?: string;
}

export function AuthorByline({
  authorName,
  authorAvatar,
  date,
  size = "sm",
  className = "",
}: AuthorBylineProps) {
  const avatarSize = size === "sm" ? 24 : 32;
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Author Avatar */}
      <div
        className="relative rounded-full overflow-hidden bg-gray-300 flex-shrink-0"
        style={{ width: avatarSize, height: avatarSize }}
      >
        {authorAvatar ? (
          <Image
            src={authorAvatar}
            alt={authorName}
            fill
            className="object-cover"
            sizes={`${avatarSize}px`}
          />
        ) : (
          <div className="w-full h-full bg-[var(--clemson-purple)] flex items-center justify-center text-white text-xs font-bold">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Author Name and Date */}
      <span className={`${textSize} text-gray-600`}>
        <span className="font-medium text-gray-800">{authorName}</span>
        <span className="mx-1">-</span>
        <span>{date}</span>
      </span>
    </div>
  );
}
