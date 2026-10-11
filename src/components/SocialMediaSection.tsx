'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, Camera } from 'lucide-react';

interface SocialChannel {
  name: string;
  handle: string;
  followers: string;
  link: string;
  accentColor: string;
  iconSvg: React.ReactNode;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: 'Instagram',
    handle: '@momothecat_official',
    followers: '28.4K Followers',
    link: 'https://www.instagram.com',
    accentColor: '#E1306C',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    handle: '@momothecat',
    followers: '84.2K Followers',
    link: 'https://www.tiktok.com',
    accentColor: '#000000',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: '@MomoTheCatTV',
    followers: '15.8K Subscribers',
    link: 'https://www.youtube.com',
    accentColor: '#FF0000',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    handle: 'Momo Cat Parent Club',
    followers: '12.1K Members',
    link: 'https://www.facebook.com',
    accentColor: '#1877F2',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function SocialMediaSection() {
  return (
    <section id="social-section" className="py-12 sm:py-20 bg-[#FFC312] relative overflow-hidden">
      <div className="pettie-container relative z-10">
        
        {/* Section Heading matching Pettie Theme */}
        <div className="text-center mb-8 sm:mb-12 space-y-1.5">
          <div className="text-[#232121] font-black text-sm tracking-widest uppercase">
            \\ | /
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#232121]">
            Join Momo&apos;s Social Community
          </h2>
          <p className="text-xs sm:text-sm text-[#232121]/80 max-w-md mx-auto font-medium">
            Connect with us for viral cat videos, Amazon deal alerts, and member perks
          </p>
        </div>

        {/* 4 Compact & Direct Social Channels Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {SOCIAL_CHANNELS.map((ch) => (
            <a
              key={ch.name}
              href={ch.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white hover:bg-[#FFFDF4] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#232121]/10 hover:border-[#232121] shadow-xs hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-3 hover:-translate-y-1"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: ch.accentColor }}
                >
                  {ch.iconSvg}
                </div>

                <div className="min-w-0">
                  <h3 className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors truncate">
                    {ch.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate">
                    {ch.followers}
                  </p>
                </div>
              </div>

              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FBF9F7] group-hover:bg-[#FF6B35] group-hover:text-white flex items-center justify-center text-[#232121] shrink-0 transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* Community Banner */}
        <div className="mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl bg-[#232121] text-white p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-lg">
          <div className="flex items-center gap-3.5 sm:gap-4 text-center sm:text-left">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0 shadow-xs text-white">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-white">
                Share Your Fur-Baby With #MomoTheCat
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 max-w-xl">
                Post your cat with their favorite picks using <strong className="text-[#FFC312]">#MomoTheCat</strong> to be featured!
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pettie-btn pettie-btn-primary text-[10px] sm:text-xs shrink-0 py-2 sm:py-2.5 px-4 sm:px-6 flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-all shadow-md shadow-[#FF6B35]/30 w-full sm:w-auto justify-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Tag Us & Get Featured</span>
          </a>
        </div>

      </div>
    </section>
  );
}
