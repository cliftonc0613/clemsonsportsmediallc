'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Twitter, Facebook, Linkedin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

/**
 * ShareButton Component
 *
 * Native share button using the Web Share API with fallback options.
 * - On mobile: Opens native share sheet (iOS/Android)
 * - On desktop (unsupported): Shows copy link + social share buttons
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
 */
export function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const [canShare, setCanShare] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get the current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title;

  useEffect(() => {
    // Check if Web Share API is supported
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed - show fallback
        if ((error as Error).name !== 'AbortError') {
          setShowFallback(true);
        }
      }
    } else {
      setShowFallback(!showFallback);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-sky-500 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-700 hover:text-white',
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="gap-2"
        aria-label="Share this content"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {/* Fallback share options for unsupported browsers */}
      {showFallback && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border bg-background p-2 shadow-lg">
          {/* Copy link button */}
          <button
            onClick={copyToClipboard}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy link'}
          </button>

          {/* Social share links */}
          <div className="my-2 border-t" />
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${social.color}`}
              onClick={() => setShowFallback(false)}
            >
              <social.icon className="h-4 w-4" />
              {social.name}
            </a>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showFallback && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFallback(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * Compact share icon button variant
 */
export function ShareIconButton({ title, text, url, className }: ShareButtonProps) {
  const [canShare, setCanShare] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title;

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {
        // User cancelled - do nothing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className={className}
      aria-label="Share this content"
    >
      <Share2 className="h-5 w-5" />
    </Button>
  );
}
