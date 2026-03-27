import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-[8rem] font-bold leading-none text-[var(--clemson-orange)]">
        404
      </h1>
      <p className="text-2xl font-bold text-[var(--clemson-purple)] mt-2 mb-4">
        Page Not Found
      </p>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-[var(--clemson-orange)] text-white font-bold uppercase tracking-wider px-8 py-3 hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
