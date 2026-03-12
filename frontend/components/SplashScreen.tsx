"use client";

import { useState, useEffect } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only show splash screen for mobile PWA standalone mode
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    if (!(isMobile && isStandalone)) {
      setMounted(true); // Skip splash for non-PWA users
      return;
    }

    // PWA on mobile: show splash with fade-out
    setVisible(false);
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
