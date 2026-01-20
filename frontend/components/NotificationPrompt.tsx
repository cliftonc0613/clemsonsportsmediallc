"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  shouldShowPrompt,
  subscribeToPush,
  dismissPrompt,
  getNotificationPermission,
} from "@/lib/push-notifications";

/**
 * NotificationPrompt Component
 *
 * A non-intrusive banner that asks users to enable push notifications
 * for breaking news alerts. Shows after a delay on first visit.
 *
 * Features:
 * - Respects user preference (remembers dismissal)
 * - Shows only when permission is "default"
 * - Delays appearance by 5 seconds
 * - Can be dismissed temporarily (7 days) or permanently
 */
export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Delay showing the prompt by 5 seconds
    const timer = setTimeout(() => {
      if (shouldShowPrompt()) {
        setVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const subscription = await subscribeToPush();
      if (subscription) {
        // Successfully subscribed
        setVisible(false);

        // Optional: Send subscription to server here
        // await fetch('/api/push-subscribe', {
        //   method: 'POST',
        //   body: JSON.stringify(subscription.toJSON()),
        // });
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    } finally {
      setLoading(false);

      // Hide prompt regardless of outcome (permission was asked)
      if (getNotificationPermission() !== "default") {
        setVisible(false);
      }
    }
  };

  const handleDismiss = (permanent: boolean = false) => {
    dismissPrompt(permanent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-lg border border-[var(--clemson-orange)]/20 bg-white p-4 shadow-lg">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--clemson-orange)]/10">
            <Bell className="h-5 w-5 text-[var(--clemson-orange)]" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-sm font-bold text-[var(--clemson-dark-purple)]">
              Breaking News Alerts
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Get notified when there&apos;s breaking Clemson sports news.
            </p>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handleEnable}
                disabled={loading}
                className="bg-[var(--clemson-orange)] hover:bg-[var(--clemson-purple)] text-white font-heading font-bold uppercase text-xs tracking-wide"
              >
                {loading ? "Enabling..." : "Enable Alerts"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDismiss(false)}
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                Maybe Later
              </Button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => handleDismiss(true)}
            className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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

export default NotificationPrompt;
