"use client";

import { useEffect } from "react";

interface BodyClassProps {
  className: string;
}

/**
 * Adds classes to the body tag for CSS targeting.
 * Classes are automatically removed when component unmounts.
 *
 * @example
 * <BodyClass className="post-single post-my-slug has-thumbnail" />
 */
export function BodyClass({ className }: BodyClassProps) {
  useEffect(() => {
    const classes = className.split(" ").filter(Boolean);

    // Add classes to body
    classes.forEach((cls) => {
      document.body.classList.add(cls);
    });

    // Cleanup: remove classes when component unmounts
    return () => {
      classes.forEach((cls) => {
        document.body.classList.remove(cls);
      });
    };
  }, [className]);

  return null;
}
