"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      // Check if it's an anchor link (starts with #)
      if (href && href.startsWith("#")) {
        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();

          // Get header height for offset
          const header = document.querySelector("header");
          const headerHeight = header?.offsetHeight || 0;

          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: targetElement,
              offsetY: headerHeight + 20,
            },
            ease: "power3.inOut",
          });

          // Keep URL clean - don't add hash
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
