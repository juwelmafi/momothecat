'use client';

import React from 'react';
import { Star, ShieldCheck, Heart } from 'lucide-react';

export default function TestimonialsAndBrands() {
  const brands = [
    'Amazon Associates',
    'Catit Senses',
    'Purina Pro Plan',
    'Feliway Classic',
    'Royal Canin',
    'Momo Feline Labs',
  ];

  return (
    <section className="space-y-16 py-12">
      {/* 1. TESTIMONIALS SECTION (Pettie theme circular portrait & review) */}
      <div className="bg-white rounded-[36px] p-8 sm:p-12 border border-slate-100 shadow-xs">
        <div className="text-center mb-10">
          <div className="text-[#FF5838] font-black text-sm tracking-widest uppercase mb-1">
            \\ | /
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#111111]">
            Views Of Our Happy Cat Parents
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            Real feedback from devoted cat lovers across the country
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Customer Photo */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <div className="absolute inset-0 rounded-full border-4 border-[#F7CE00] bg-[#FFF8D6] shadow-md" />
              <div className="absolute inset-2 rounded-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Happy Cat Parent Chloe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-2 w-10 h-10 rounded-full bg-[#FF5838] text-white flex items-center justify-center text-lg shadow-md border-2 border-white">
                🐾
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#F7CE00] text-[#F7CE00]" />
              ))}
            </div>

            <blockquote className="font-display font-medium text-lg sm:text-xl text-[#111111] leading-relaxed">
              &ldquo;Momo&apos;s interactive laser ball and velvet cloud bed completely transformed our indoor cat&apos;s daily routine. We also love buying their curated Amazon picks with Prime 1-day delivery. Best pet store ever!&rdquo;
            </blockquote>

            <div>
              <h4 className="font-display font-bold text-base text-[#111111]">
                Chloe Mitchell
              </h4>
              <p className="text-xs text-[#666666] font-semibold">
                Parent to Luna (2-yr old Persian) · <span className="text-[#FF5838]">Verified Buyer</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PARTNERS & BRANDS BAR (Pettie Sunflower Yellow #F7CE00 bar) */}
      <div className="bg-[#F7CE00] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#111111]/70">
              Trusted Network
            </span>
            <h3 className="font-display font-bold text-xl text-[#111111]">
              Our Best Partners
            </h3>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8">
            {brands.map((b, i) => (
              <div
                key={i}
                className="bg-white/90 hover:bg-white text-[#111111] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-transform hover:scale-105"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
