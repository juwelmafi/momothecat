'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function DealsBanner() {
  const { settings } = useCart();

  return (
    <section id="deals-section" className="py-12 sm:py-16 bg-[#F8F7F5] relative overflow-hidden border-y border-black/5">
      <div className="pettie-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Dog sleeping on bed with treat bone on nose */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Dog-Food.png"
                alt="Deals Ended Soon"
                className="w-full h-auto object-contain drop-shadow-md rounded-2xl hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: Heading, description, and BUY NOW button */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div>
              {/* Sparkle dashes */}
              <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase mb-1">
                \ | /
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121] leading-tight">
                {settings.dealsHeading || 'Deals Ended Soon'}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#555555] max-w-md mx-auto lg:mx-0 leading-relaxed">
              {settings.dealsDescription || "Don't miss out on today's flash discounts! Save up to 40% on top-rated Amazon Prime cat toys, orthopedic beds, and organic treats before timers expire."}
            </p>

            <div className="pt-2">
              <a
                href="#products-section"
                className="pettie-btn pettie-btn-primary shadow-md shadow-[#FF6B35]/25 hover:scale-105 transition-all text-xs"
              >
                <span>{settings.dealsButtonText || 'CLAIM AMAZON DEALS'}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
