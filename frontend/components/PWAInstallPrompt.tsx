"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// localStorage keys
const STORAGE_KEYS = {
  DISMISSED: "csm-pwa-install-dismissed",
  DISMISSED_UNTIL: "csm-pwa-install-dismissed-until",
  INSTALLED: "csm-pwa-installed",
} as const;

/**
 * PWAInstallPrompt Component
 *
 * Captures the beforeinstallprompt event and shows a custom install banner.
 * Only shows on supported browsers when the PWA is installable.
 *
 * Features:
 * - Captures native install prompt
 * - Shows after 10 second delay
 * - Respects dismissal preference
 * - Tracks install completion
 */
export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== "undefined") {
      const installed = localStorage.getItem(STORAGE_KEYS.INSTALLED) === "true";
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

      if (installed || isStandalone) {
        setIsInstalled(true);
        return;
      }
    }

    // Check if dismissed
    const isDismissed = () => {
      if (localStorage.getItem(STORAGE_KEYS.DISMISSED) === "true") {
        return true;
      }
      const dismissedUntil = localStorage.getItem(STORAGE_KEYS.DISMISSED_UNTIL);
      if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
        return true;
      }
      return false;
    };

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after delay if not dismissed
      setTimeout(() => {
        if (!isDismissed()) {
          setVisible(true);
        }
      }, 10000);
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setVisible(false);
      localStorage.setItem(STORAGE_KEYS.INSTALLED, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        localStorage.setItem(STORAGE_KEYS.INSTALLED, "true");
        setIsInstalled(true);
      }
    } catch (error) {
      console.error("Install prompt failed:", error);
    }

    setVisible(false);
    setInstallPrompt(null);
  };

  const handleDismiss = (permanent: boolean = false) => {
    if (permanent) {
      localStorage.setItem(STORAGE_KEYS.DISMISSED, "true");
    } else {
      const dismissUntil = new Date();
      dismissUntil.setDate(dismissUntil.getDate() + 14); // Show again in 14 days
      localStorage.setItem(STORAGE_KEYS.DISMISSED_UNTIL, dismissUntil.toISOString());
    }
    setVisible(false);
  };

  // Don't render if installed or not visible
  if (isInstalled || !visible || !installPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-lg bg-[var(--clemson-dark-purple)] p-4 shadow-lg">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Smartphone className="h-5 w-5 text-[var(--clemson-orange)]" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-sm font-bold text-white">
              Install Clemson Sports Media
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Add to your home screen for quick access and offline reading.
            </p>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-[var(--clemson-orange)] hover:bg-[var(--clemson-orange)]/90 text-white font-heading font-bold uppercase text-xs tracking-wide"
              >
                <Download className="h-3 w-3 mr-1" />
                Install App
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDismiss(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
              >
                Not Now
              </Button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => handleDismiss(true)}
            className="shrink-0 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white/80"
            aria-label="Don't show again"
            title="Don't show again"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
