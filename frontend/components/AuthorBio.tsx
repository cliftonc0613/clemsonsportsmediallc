import Image from "next/image";
import Link from "next/link";

interface AuthorBioProps {
  name: string;
  avatar?: string | null;
  bio?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  className?: string;
}

export function AuthorBio({
  name,
  avatar,
  bio,
  twitterUrl,
  linkedinUrl,
  className = "",
}: AuthorBioProps) {
  const hasSocialLinks = twitterUrl || linkedinUrl;

  return (
    <div
      className={`border-t-4 border-[var(--clemson-orange)] bg-gray-50 p-6 md:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
        {/* Author Avatar */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-[var(--clemson-purple)] flex-shrink-0">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-heading font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">
            Written by
          </p>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {name}
          </h3>

          {bio && (
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
              {bio}
            </p>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="flex items-center gap-3">
              {twitterUrl && (
                <Link
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[var(--clemson-orange)] transition-colors"
                  aria-label={`Follow ${name} on X (Twitter)`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              )}
              {linkedinUrl && (
                <Link
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[var(--clemson-orange)] transition-colors"
                  aria-label={`Connect with ${name} on LinkedIn`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
