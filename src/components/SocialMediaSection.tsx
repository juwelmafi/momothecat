'use client';

import React from 'react';
import { ExternalLink, Flame, Users, Heart, Sparkles, ArrowUpRight } from 'lucide-react';

interface SocialChannel {
  name: string;
  handle: string;
  followers: string;
  description: string;
  actionText: string;
  link: string;
  accentColor: string;
  badge: string;
  iconSvg: React.ReactNode;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: 'Instagram',
    handle: '@momothecat_official',
    followers: '28.4K Followers',
    description: 'Daily feline reels, hilarious play sessions, toy unboxings, and secret Amazon discount drops.',
    actionText: 'Follow on Instagram',
    link: 'https://www.instagram.com',
    accentColor: '#E1306C',
    badge: 'Daily Stories',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    handle: '@momothecat',
    followers: '84.2K Followers',
    description: 'Viral cat tricks, testing internet cat gadgets, cute kitten reactions, and sound trends.',
    actionText: 'Watch on TikTok',
    link: 'https://www.tiktok.com',
    accentColor: '#000000',
    badge: 'Viral Videos',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: '@MomoTheCatTV',
    followers: '15.8K Subscribers',
    description: 'Long-form Amazon cat product reviews, setup guides, and cat room transformation vlogs.',
    actionText: 'Subscribe on YouTube',
    link: 'https://www.youtube.com',
    accentColor: '#FF0000',
    badge: 'Gear Reviews',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    handle: 'Momo Cat Parent Club',
    followers: '12.1K Members',
    description: 'Active feline parent community, vet advice sharing, photo contests, and coupon codes.',
    actionText: 'Join the Community',
    link: 'https://www.facebook.com',
    accentColor: '#1877F2',
    badge: 'Parent Group',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    handle: '@momothecat',
    followers: '45K Monthly Views',
    description: 'Aesthetic cat room setups, modern cat tree inspiration, DIY scratching walls & care tips.',
    actionText: 'Explore Pins',
    link: 'https://www.pinterest.com',
    accentColor: '#BD081C',
    badge: 'Room Inspo',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.39.03-3.42l1-4.25s-.25-.51-.25-1.27c0-1.19.69-2.08 1.55-2.08.73 0 1.08.55 1.08 1.21 0 .74-.47 1.84-.71 2.87-.2.86.43 1.56 1.28 1.56 1.54 0 2.73-1.63 2.73-3.97 0-2.08-1.49-3.53-3.62-3.53-2.47 0-3.92 1.85-3.92 3.76 0 .75.29 1.55.65 1.98.07.09.08.17.06.26-.07.29-.23.94-.26 1.07-.04.18-.15.22-.34.13-1.27-.59-2.06-2.44-2.06-3.93 0-3.2 2.33-6.14 6.71-6.14 3.52 0 6.26 2.51 6.26 5.87 0 3.5-2.21 6.32-5.27 6.32-1.03 0-2-.54-2.34-1.17l-.64 2.43c-.23.89-.86 2.01-1.28 2.7A12 12 0 1 0 12 0z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    handle: '@momothecat',
    followers: '9.4K Followers',
    description: 'Instant lightning deal alerts, Amazon price drops, funny cat tweets, and quick giveaways.',
    actionText: 'Follow Deals',
    link: 'https://twitter.com',
    accentColor: '#000000',
    badge: 'Deal Alerts',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function SocialMediaSection() {
  return (
    <section id="social-section" className="py-16 sm:py-24 bg-[#FFC312] relative overflow-hidden">
      {/* Decorative paw print accents in the background */}
      <div className="absolute top-6 left-8 text-[#232121]/10 text-5xl pointer-events-none select-none -rotate-12">
        🐾
      </div>
      <div className="absolute bottom-6 right-8 text-[#232121]/10 text-5xl pointer-events-none select-none rotate-12">
        🐾
      </div>

      <div className="pettie-container relative z-10">
        
        {/* Section Heading matching Pettie Theme */}
        <div className="text-center mb-12 sm:mb-16 space-y-2">
          <div className="text-[#232121] font-black text-sm tracking-widest uppercase">
            \\ | /
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
            Join Momo&apos;s Social Community
          </h2>
          <p className="text-xs sm:text-sm text-[#232121]/80 max-w-lg mx-auto font-medium">
            Follow our channels for viral cat videos, Amazon lightning deal drops, room decor inspo, and secret coupon codes
          </p>
        </div>

        {/* 6 Social Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {SOCIAL_CHANNELS.map((ch, i) => (
            <a
              key={i}
              href={ch.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white hover:bg-[#FFFDF4] rounded-[24px] p-6 border-2 border-[#232121]/10 hover:border-[#232121] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: ch.accentColor }}
                  >
                    {ch.iconSvg}
                  </div>

                  <span className="bg-[#FFF3D6] text-[#FF6B35] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#FF6B35]/20">
                    {ch.badge}
                  </span>
                </div>

                {/* Platform Name & Handle */}
                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-xl text-[#232121] group-hover:text-[#FF6B35] transition-colors">
                      {ch.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-0.5">
                    <span>{ch.handle}</span>
                    <span>•</span>
                    <span className="text-[#FF6B35] font-bold">{ch.followers}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#555555] leading-relaxed line-clamp-2 mt-2">
                  {ch.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#232121] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1">
                  <span>{ch.actionText}</span>
                </span>
                <span className="w-8 h-8 rounded-full bg-[#FBF9F7] group-hover:bg-[#FF6B35] group-hover:text-white flex items-center justify-center text-xs transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Community Banner */}
        <div className="mt-12 rounded-[24px] bg-[#232121] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-[#FF6B35] flex items-center justify-center text-3xl shrink-0 shadow-xs">
              🐱
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-white">
                Share Your Fur-Baby With #MomoTheCat
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Post your cat with their favorite Amazon picks using <strong className="text-[#FFC312]">#MomoTheCat</strong> for a chance to win monthly Amazon gift cards and get featured!
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pettie-btn pettie-btn-primary text-xs shrink-0 flex items-center gap-2 hover:scale-105 transition-all shadow-md shadow-[#FF6B35]/30"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Tag Us & Get Featured</span>
          </a>
        </div>

      </div>
    </section>
  );
}
