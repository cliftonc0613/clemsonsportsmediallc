"use client";

import { useState, useEffect } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-out after hydration
    setVisible(false);

    // Remove from DOM after CSS transition completes
    const timer = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (mounted) return null;

  return (
    <div className={`app-splash-screen${visible ? "" : " app-splash-screen--hidden"}`}>
      <img
        src="/images/clemson-sports-media-logo.png"
        alt=""
        className="app-splash-screen__logo"
        width={160}
        height={160}
      />
      <div className="app-splash-screen__text">
        CLEMSON SPORTS<br />MEDIA
      </div>
    </div>
  );
}
