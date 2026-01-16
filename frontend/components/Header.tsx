"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronDown } from "lucide-react";
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
  { href: "/atp-podcast", label: "ATP Podcast" },
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
      className="fixed top-0 z-50 w-full border-b-4 border-[var(--clemson-purple)] bg-[var(--clemson-orange)]"
    >
      <div className="container mx-auto flex h-[var(--header-height,4rem)] items-center justify-between px-4 transition-[height] duration-300">
        {/* Logo - White version for orange background */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/clemson-sports-media-horz-white-logo@3x.png"
            alt="Clemson Sports Media"
            width={280}
            height={60}
            className="h-10 md:h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {/* Home Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={`font-heading text-sm font-bold uppercase tracking-wider px-4 py-2 transition-colors relative text-white hover:text-white/80
                    ${isActive("/") ? "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-white" : ""}
                  `}
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Sports Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="font-heading text-sm font-bold uppercase tracking-wider px-4 py-2 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent text-white hover:text-white/80"
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
                          ? "bg-[var(--clemson-dark-purple)] text-white"
                          : "text-[var(--clemson-dark-purple)] hover:bg-[var(--clemson-purple)]/10 hover:text-[var(--clemson-purple)]"
                        }
                      `}
                    >
                      {sport.label}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ATP Podcast Link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/atp-podcast"
                  className={`font-heading text-sm font-bold uppercase tracking-wider px-4 py-2 transition-colors relative text-white hover:text-white/80
                    ${isActive("/atp-podcast") ? "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-white" : ""}
                  `}
                >
                  ATP Podcast
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
            className="text-white hover:text-white/80 hover:bg-white/20"
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
            className="text-white hover:text-white/80 hover:bg-white/20"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                className="text-white hover:text-white/80 hover:bg-white/20"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[320px] flex-col overflow-y-auto sm:w-[400px] bg-[var(--clemson-orange)] border-l-0">
              <SheetHeader className="border-b-2 border-white/30 pb-4">
                <SheetTitle className="text-left font-heading text-xl font-bold text-white">
                  Menu
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1 pt-4">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 font-heading text-sm font-bold uppercase tracking-wider transition-colors text-white
                    ${isActive("/")
                      ? "bg-white/20 border-l-4 border-white"
                      : "hover:bg-white/10"
                    }
                  `}
                >
                  Home
                </Link>

                {/* Sports Collapsible */}
                <div>
                  <button
                    onClick={() => setSportsExpanded(!sportsExpanded)}
                    className={`w-full flex items-center justify-between py-3 px-4 font-heading text-sm font-bold uppercase tracking-wider transition-colors text-white
                      ${isSportsActive
                        ? "bg-white/20 border-l-4 border-white"
                        : "hover:bg-white/10"
                      }
                    `}
                  >
                    <span>Sports</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${sportsExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {sportsExpanded && (
                    <div className="bg-white/10 py-2">
                      {sportCategories.map((sport) => (
                        <Link
                          key={sport.slug}
                          href={`/category/${sport.slug}`}
                          onClick={() => setIsOpen(false)}
                          className={`block py-2 px-8 font-heading text-sm font-semibold uppercase tracking-wide transition-colors text-white
                            ${pathname === `/category/${sport.slug}`
                              ? "bg-white/20"
                              : "hover:bg-white/10"
                            }
                          `}
                        >
                          {sport.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* ATP Podcast */}
                <Link
                  href="/atp-podcast"
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 font-heading text-sm font-bold uppercase tracking-wider transition-colors text-white
                    ${isActive("/atp-podcast")
                      ? "bg-white/20 border-l-4 border-white"
                      : "hover:bg-white/10"
                    }
                  `}
                >
                  ATP Podcast
                </Link>
              </nav>

              {/* Mobile Search CTA */}
              <div className="mt-auto border-t border-white/30 pt-6 px-4 pb-8">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full bg-white hover:bg-white/90 text-[var(--clemson-orange)] font-heading font-bold uppercase tracking-wider"
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
