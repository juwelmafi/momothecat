'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function PassionBanner() {
  const { settings } = useCart();
  const perks = [
    { title: 'Amazon Prime 1-Day Delivery' },
    { title: '100% Non-Toxic & Vet-Approved' },
    { title: 'Handpicked Top-Rated Brands' },
    { title: 'Tested by Real Cat Parents' },
    { title: 'Hassle-Free Amazon Returns' },
    { title: 'Best Value Price Guarantee' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="pettie-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Pettie Girl + Pet with Yellow Circle Backdrop */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-80 sm:w-96 h-80 sm:h-96 flex items-center justify-center">
              {/* Yellow circular backdrop matching Pettie demo */}
              <div className="absolute inset-0 rounded-full bg-[#FFC312] -z-10 shadow-lg" />
              
              {/* Portrait image cutout */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  settings.passionBannerImage ||
                  'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Grid-Sec-Img-a-1.png'
                }
                alt="Our Passion Is Providing Premium Cat Products"
                className="w-full h-auto max-h-[460px] object-contain drop-shadow-xl relative z-10 -mt-8 hover:scale-105 transition-transform duration-500"
              />

              {/* Paw Prints decoration on the right side of the circle */}
              <div className="absolute -right-6 top-1/3 flex flex-col gap-3 text-[#232121]/80 select-none pointer-events-none">
                <span className="text-2xl rotate-12">🐾</span>
                <span className="text-xl -rotate-12">🐾</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Perks, and Contact details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Sparkle dashes */}
              <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase mb-1">
                \ | /
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121] leading-tight">
                {settings.passionHeading || 'Our Passion Is Providing Premium Cat Products'}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              {settings.passionDescription || 'Every toy, food recipe, and scratching post on Momo - The Cat is hand-curated from top-tier Amazon Prime sellers and tested for durability, safety, and feline delight. We connect you directly with the best Amazon cat deals with zero hassle.'}
            </p>

            {/* 6 Perks Grid with Paw Bullet Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg text-[#232121]">🐾</span>
                  <span className="font-display font-bold text-sm sm:text-base text-[#232121]">
                    {perk.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Contact & CTA Row */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a
                href="#products-section"
                className="pettie-btn pettie-btn-primary text-xs shadow-md shadow-[#FF6B35]/25 hover:scale-105 transition-all"
              >
                <span>{settings.passionButtonText || 'EXPLORE AMAZON PICKS'}</span>
              </a>

              {/* Call Us Box */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <p className="text-[11px] font-normal text-[#666666]">Product Hotline</p>
                  <a
                    href={`tel:${settings.contactPhone?.replace(/[^0-9+]/g, '') || '18002286666'}`}
                    className="font-bold text-xs sm:text-sm text-[#232121] hover:text-[#FF6B35] transition-colors"
                  >
                    {settings.contactPhone || '(+1) 800-CAT-MOMO'}
                  </a>
                </div>
              </div>

              {/* Email Us Box */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#232121] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-normal text-[#666666]">Recommendations</p>
                  <a
                    href={`mailto:${settings.contactEmail || 'hello@momothecat.shop'}`}
                    className="font-bold text-xs sm:text-sm text-[#232121] hover:text-[#FF6B35] transition-colors"
                  >
                    {settings.contactEmail || 'hello@momothecat.shop'}
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
