'use client';

import React from 'react';
import Link from 'next/link';

export default function DiscountsBanner() {
  return (
    <section className="py-8 sm:py-12">
      <div className="pettie-container">
        <div className="relative rounded-[32px] bg-[#FFC312] overflow-hidden p-8 sm:p-12 shadow-md flex items-center justify-between min-h-[220px]">
          
          {/* Radial Sunburst Rays Background Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'repeating-conic-gradient(from 0deg, #FFFFFF 0deg 15deg, transparent 15deg 30deg)',
            }}
          />

          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Left: 20% Offer Orange Circle Badge */}
            <div className="shrink-0 flex items-center gap-4">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#FF6B35] text-white flex flex-col items-center justify-center shadow-lg border-4 border-white rotate-[-6deg] hover:rotate-0 transition-transform">
                <span className="font-display font-black text-2xl sm:text-3xl leading-none">20%</span>
                <span className="font-display font-bold text-lg sm:text-xl leading-none mt-1">Offer</span>
              </div>
            </div>

            {/* Center: Heading and SHOP NOW button */}
            <div className="text-center space-y-4">
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#232121] tracking-tight">
                Get Enticing Discounts
              </h2>
              <div>
                <a
                  href="#products-section"
                  className="pettie-btn pettie-btn-primary shadow-lg shadow-[#FF6B35]/30 text-xs hover:scale-105 transition-transform"
                >
                  <span>SHOP NOW</span>
                </a>
              </div>
            </div>

            {/* Right: Pet cutout popping out with flying kibble */}
            <div className="shrink-0 relative w-44 sm:w-60 h-36 sm:h-44 hidden md:flex items-end justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-dog.png"
                alt="Happy Pet"
                className="w-full h-full object-contain object-bottom hover:scale-105 transition-transform"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
