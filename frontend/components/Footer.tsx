import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  sports: [
    { href: "/category/football", label: "Football" },
    { href: "/category/basketball", label: "Basketball" },
    { href: "/category/baseball", label: "Baseball" },
    { href: "/category/soccer", label: "Soccer" },
  ],
  company: [
    { href: "/", label: "Home" },
    { href: "/blog", label: "News" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-[var(--clemson-orange)] bg-[var(--clemson-dark-purple)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/images/clemson-sports-media-horz-white-logo@3x.png"
                alt="Clemson Sports Media"
                width={280}
                height={60}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-md text-gray-300">
              Your source for Clemson Tigers athletics coverage. News, analysis,
              and exclusive content for Clemson sports fans.
            </p>
          </div>

          {/* Sports Links */}
          <div>
            <h3 className="mb-4 text-sm font-heading font-bold uppercase tracking-wider text-[var(--clemson-orange)]">
              Sports
            </h3>
            <ul className="space-y-3">
              {footerLinks.sports.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-[var(--clemson-orange)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-heading font-bold uppercase tracking-wider text-[var(--clemson-orange)]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-[var(--clemson-orange)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-[var(--clemson-orange)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {currentYear} Clemson Sports Media. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
