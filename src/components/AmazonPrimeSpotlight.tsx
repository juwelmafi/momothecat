'use client';

import React, { useState } from 'react';
import { ExternalLink, Flame, Star, Sparkles, Check, Zap } from 'lucide-react';

const SPOTLIGHT_ITEMS = [
  {
    category: 'Deals',
    title: 'Smart Interactive Laser & Chirping Ball',
    originalPrice: 28.99,
    price: 19.99,
    discount: '31% OFF',
    rating: 4.8,
    reviews: '1,420',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
    badge: "Amazon's Choice",
    perk: 'Prime One-Day Dispatch',
  },
  {
    category: 'Deals',
    title: 'Ultra-Quiet Stainless Steel Cat Fountain (2.5L)',
    originalPrice: 35.00,
    price: 27.99,
    discount: '20% OFF',
    rating: 4.9,
    reviews: '3,120',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.amazon.com/dp/B09ABC4567?tag=momothecat-20',
    badge: 'Best Seller',
    perk: 'Free Shipping with Prime',
  },
  {
    category: 'Toys',
    title: 'Natural Sisal Cat Scratching Post & Perch',
    originalPrice: 42.00,
    price: 34.50,
    discount: '18% OFF',
    rating: 4.9,
    reviews: '890',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.amazon.com/dp/B07XYZ9871?tag=momothecat-20',
    badge: 'Popular',
    perk: 'Endures Heavy Claws',
  },
  {
    category: 'Comfort',
    title: 'Orthopedic Calming Donut Cuddle Cat Bed',
    originalPrice: 49.99,
    price: 38.99,
    discount: '22% OFF',
    rating: 4.7,
    reviews: '2,310',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.amazon.com/dp/B08N567891?tag=momothecat-20',
    badge: 'Top Rated',
    perk: 'Machine Washable Plush',
  },
];

export default function AmazonPrimeSpotlight() {
  return (
    <section className="py-16 sm:py-20 bg-[#FDFBF7] border-y border-black/5">
      <div className="pettie-container">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-[#FF6B35] font-black text-xs uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 fill-[#FF6B35]" />
              <span>Amazon Prime Spotlight</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#232121]">
              Today&apos;s Highest-Rated Amazon Deals
            </h2>
          </div>

          <a
            href="https://www.amazon.com?tag=momothecat-20"
            target="_blank"
            rel="noopener noreferrer"
            className="pettie-btn pettie-btn-dark text-xs flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-[#FFC312] fill-current" />
            <span>Open Amazon Store Hub</span>
          </a>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 sm:gap-7">
          {SPOTLIGHT_ITEMS.map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl sm:rounded-[24px] p-2.5 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                {/* Image Box */}
                <div className="relative w-full aspect-square rounded-xl sm:rounded-[20px] overflow-hidden bg-[#FBF9F7] mb-2 sm:mb-4 p-2 sm:p-4 flex items-center justify-center border border-slate-100">
                  {/* Badge */}
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#E64A19] text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
                    {item.discount}
                  </span>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-[#FFC312] mb-1 sm:mb-1.5">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FFC312]" />
                  <span className="text-[#232121]">{item.rating}</span>
                  <span className="text-slate-400 font-normal hidden sm:inline">({item.reviews})</span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-tight sm:leading-snug min-h-[28px] sm:min-h-[40px]">
                  {item.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                  <span className="font-display font-bold text-xs sm:text-lg text-[#232121]">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-[#2FA5FB] bg-[#D2EDF8] px-1.5 sm:px-2 py-0.5 rounded-full ml-auto">
                    Prime
                  </span>
                </div>

                {/* Perk */}
                <p className="text-[9px] sm:text-[11px] text-[#555555] flex items-center gap-1 mt-1 sm:mt-2 line-clamp-1">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF6B35] shrink-0" />
                  <span className="truncate">{item.perk}</span>
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 sm:pt-4">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pettie-btn pettie-btn-primary w-full py-1.5 sm:py-2.5 text-[10px] sm:text-xs px-1 sm:px-4 shadow-xs flex items-center justify-center gap-1"
                >
                  <span>View on Amazon</span>
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
