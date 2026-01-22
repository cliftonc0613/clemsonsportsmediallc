"use client";

import Image from "next/image";
import { Facebook, Youtube } from "lucide-react";
import { RecentPostsWidget } from "./RecentPostsWidget";
import type { WPPost } from "@/lib/wordpress";

// X (formerly Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialLink {
  platform: string;
  icon: React.ReactNode;
  count: string;
  label: string;
  action: string;
  url: string;
  bgColor: string;
}

const socialLinks: SocialLink[] = [
  {
    platform: "Facebook",
    icon: <Facebook className="h-6 w-6" />,
    count: "2.5K",
    label: "Fans",
    action: "LIKE",
    url: "https://www.facebook.com/cusportsmedia",
    bgColor: "bg-[#3b5998]",
  },
  {
    platform: "X",
    icon: <XIcon className="h-5 w-5" />,
    count: "8.2K",
    label: "Followers",
    action: "FOLLOW",
    url: "https://x.com/CUSportsMedia",
    bgColor: "bg-black",
  },
  {
    platform: "YouTube",
    icon: <Youtube className="h-6 w-6" />,
    count: "15K",
    label: "Subscribers",
    action: "SUBSCRIBE",
    url: "https://www.youtube.com/@clemson_sports_media",
    bgColor: "bg-[#cd201f]",
  },
];

interface BlogSidebarProps {
  recentPosts?: WPPost[];
  currentPostId?: number;
}

export function BlogSidebar({ recentPosts = [], currentPostId }: BlogSidebarProps) {
  return (
    <aside className="w-full lg:w-[300px] flex-shrink-0">
      {/* Stay Connected Section */}
      <div className="mb-8">
        <div className="inline-block bg-[var(--clemson-orange)] text-white text-sm font-bold uppercase tracking-wider px-4 py-2 mb-4">
          Stay Connected
        </div>

        <div className="space-y-2">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${social.bgColor} flex items-center text-white hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-black/20">
                {social.icon}
              </div>
              <div className="flex-1 flex items-center px-4">
                <span className="font-bold mr-2">{social.count}</span>
                <span className="text-white/90">{social.label}</span>
              </div>
              <div className="px-4 py-3 font-bold text-sm">
                {social.action}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t-2 border-[var(--clemson-orange)] mb-8" />

      {/* Recent Posts Widget */}
      {recentPosts.length > 0 && (
        <RecentPostsWidget posts={recentPosts} currentPostId={currentPostId} />
      )}

      {/* Sponsorship Box */}
      <div className="mb-8">
        <div className="bg-gray-100 border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 text-center">
            Sponsored
          </p>
          <div className="w-[300px] h-[250px] bg-gray-200 flex flex-col items-center justify-center mx-auto">
            <Image
              src="/images/clemson-sports-media@3x.png"
              alt="Clemson Sports Media"
              width={150}
              height={150}
              className="object-contain"
            />
            <p className="text-lg font-bold text-gray-500 mt-2">300 x 250</p>
            <p className="text-sm text-gray-500">Ad Space</p>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2 uppercase tracking-wider">
            <a href="/contact" className="hover:text-[var(--clemson-orange)]">
              Advertise with us
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

export default BlogSidebar;
