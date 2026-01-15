"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronDown, X } from "lucide-react";
import { SearchCommand } from "@/components/SearchCommand";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Headroom from "headroom.js";

// Sports categories for navigation
const sportCategories = [
  { slug: "football", label: "Football" },
  { slug: "basketball", label: "Basketball" },
  { slug: "baseball", label: "Baseball" },
  { slug: "softball", label: "Softball" },
  { slug: "soccer", label: "Soccer" },
  { slug: "recruiting", label: "Recruiting" },
];

// Main navigation items (without Sports dropdown)
const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "News" },
  { href: "/video", label: "Video" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sportsExpanded, setSportsExpanded] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Check if current page is a category page (for Sports active state)
  const isSportsActive = pathname.startsWith("/category/");

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (!headerRef.current) return;

    const headroom = new Headroom(headerRef.current, {
      offset: 100,
      tolerance: {
        up: 10,
        down: 5,
      },
      classes: {
        initial: "headroom",
        pinned: "headroom--pinned",
        unpinned: "headroom--unpinned",
        top: "headroom--top",
        notTop: "headroom--not-top",
        frozen: "headroom--frozen",
      },
    });
    headroom.init();

    return () => {
      headroom.destroy();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full border-b-4 border-[var(--clemson-orange)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90"
    >
      <div className="container mx-auto flex h-[var(--header-height,4rem)] items-center justify-between px-4 transition-[height] duration-300">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-[var(--clemson-purple)]">
            Clemson Sports Media
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {/* Home Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={`font-heading text-sm font-bold uppercase tracking-wider px-4 py-2 transition-colors relative
                    ${isActive("/")
                      ? "text-[var(--clemson-orange)]"
                      : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)]"
                    }
                    ${isActive("/") ? "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[var(--clemson-orange)]" : ""}
                  `}
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Sports Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`font-heading text-sm font-bold uppercase tracking-wider px-4 py-2 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent
                  ${isSportsActive
                    ? "text-[var(--clemson-orange)]"
                    : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)]"
                  }
                `}
              >
                Sports
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] grid-cols-2 gap-2 p-4 bg-white shadow-lg">
                  {sportCategories.map((sport) => (
                    <Link
                      key={sport.slug}
                      href={`/category/${sport.slug}`}
                      className={`block px-4 py-3 font-heading text-sm font-semibold uppercase tracking-wide transition-colors rounded
                        ${pathname === `/category/${sport.slug}`
                          ? "bg-[var(--clemson-orange)] text-white"
                          : "text-[var(--clemson-dark-purple)] hover:bg-[var(--clemson-orange)]/10 hover:text-[var(--clemson-orange)]"
                        }
                      `}
                    >
                      {sport.label}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* News Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className={`font-heading text-sm font-bold uppercase tracking-wider px-4 py-2 transition-colors relative
                    ${isActive("/blog")
                      ? "text-[var(--clemson-orange)]"
                      : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)]"
                    }
                    ${isActive("/blog") ? "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[var(--clemson-orange)]" : ""}
                  `}
                >
                  News
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Video Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/video"
                  className={`font-heading text-sm font-bold uppercase tracking-wider px-4 py-2 transition-colors relative
                    ${isActive("/video")
                      ? "text-[var(--clemson-orange)]"
                      : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)]"
                    }
                    ${isActive("/video") ? "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[var(--clemson-orange)]" : ""}
                  `}
                >
                  Video
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Search */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/10"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Search & Menu */}
        <div className="flex items-center gap-1 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/10"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                className="text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[320px] flex-col overflow-y-auto sm:w-[400px] bg-white">
              <SheetHeader className="border-b-2 border-[var(--clemson-orange)] pb-4">
                <SheetTitle className="text-left font-heading text-xl font-bold text-[var(--clemson-purple)]">
                  Menu
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1 pt-4">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 font-heading text-sm font-bold uppercase tracking-wider transition-colors
                    ${isActive("/")
                      ? "text-[var(--clemson-orange)] bg-[var(--clemson-orange)]/10 border-l-4 border-[var(--clemson-orange)]"
                      : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/5"
                    }
                  `}
                >
                  Home
                </Link>

                {/* Sports Collapsible */}
                <div>
                  <button
                    onClick={() => setSportsExpanded(!sportsExpanded)}
                    className={`w-full flex items-center justify-between py-3 px-4 font-heading text-sm font-bold uppercase tracking-wider transition-colors
                      ${isSportsActive
                        ? "text-[var(--clemson-orange)] bg-[var(--clemson-orange)]/10 border-l-4 border-[var(--clemson-orange)]"
                        : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/5"
                      }
                    `}
                  >
                    <span>Sports</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${sportsExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {sportsExpanded && (
                    <div className="bg-gray-50 py-2">
                      {sportCategories.map((sport) => (
                        <Link
                          key={sport.slug}
                          href={`/category/${sport.slug}`}
                          onClick={() => setIsOpen(false)}
                          className={`block py-2 px-8 font-heading text-sm font-semibold uppercase tracking-wide transition-colors
                            ${pathname === `/category/${sport.slug}`
                              ? "text-[var(--clemson-orange)]"
                              : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)]"
                            }
                          `}
                        >
                          {sport.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* News */}
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 font-heading text-sm font-bold uppercase tracking-wider transition-colors
                    ${isActive("/blog")
                      ? "text-[var(--clemson-orange)] bg-[var(--clemson-orange)]/10 border-l-4 border-[var(--clemson-orange)]"
                      : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/5"
                    }
                  `}
                >
                  News
                </Link>

                {/* Video */}
                <Link
                  href="/video"
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 font-heading text-sm font-bold uppercase tracking-wider transition-colors
                    ${isActive("/video")
                      ? "text-[var(--clemson-orange)] bg-[var(--clemson-orange)]/10 border-l-4 border-[var(--clemson-orange)]"
                      : "text-[var(--clemson-dark-purple)] hover:text-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/5"
                    }
                  `}
                >
                  Video
                </Link>
              </nav>

              {/* Mobile Search CTA */}
              <div className="mt-auto border-t pt-6 px-4 pb-8">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full bg-[var(--clemson-orange)] hover:bg-[var(--clemson-purple)] text-white font-heading font-bold uppercase tracking-wider"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Command Modal */}
        <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </header>
  );
}
