'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function PromoCards() {
  const { settings } = useCart();

  return (
    <section className="py-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {/* Card 1: Deals Ended Soon (Soft Cream Background) */}
      <div className="relative bg-[#F6F6F4] rounded-[36px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden border border-slate-100 group">
        <div className="space-y-3 z-10 max-w-xs">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#FF5838] bg-[#FFEBE7] px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Deals Ended Soon</span>
          </div>

          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#111111] leading-tight">
            Save Up To 40% On Momo Loungers & Scratchers
          </h3>

          <p className="text-xs text-[#666666]">
            Limited stock on our hand-finished velvet beds and sisal climbers.
          </p>

          <div className="pt-2">
            <a
              href="#products-section"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5838] hover:bg-[#E84525] text-white rounded-full font-black text-xs uppercase tracking-wider shadow-md shadow-[#FF5838]/20 transition-all hover:scale-105"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Kitten cutout photo overlapping */}
        <div className="absolute -bottom-4 -right-4 w-48 sm:w-60 h-48 sm:h-60 rounded-full overflow-hidden opacity-95 group-hover:scale-105 transition-transform duration-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              settings.promoCard1Image ||
              'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80'
            }
            alt="Sleeping Cat in Lounger"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Card 2: Get Enticing Discounts (Sunflower Yellow #F7CE00 Background) */}
      <div className="relative bg-[#F7CE00] rounded-[36px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm group">
        <div className="space-y-3 z-10 max-w-xs">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white bg-[#FF5838] px-3 py-1 rounded-full shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>20% Flash Offer</span>
          </div>

          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#111111] leading-tight">
            Get Enticing Discounts for Your Feline Friend
          </h3>

          <p className="text-xs text-[#444444]">
            Amazon Prime top-rated interactive toys with guaranteed next-day delivery.
          </p>

          <div className="pt-2">
            <Link
              href="/?filter=amazon"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-black text-white rounded-full font-black text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105"
            >
              <span>Shop Amazon Picks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Cat cutout photo overlapping */}
        <div className="absolute -bottom-4 -right-4 w-48 sm:w-60 h-48 sm:h-60 rounded-full overflow-hidden opacity-95 group-hover:scale-105 transition-transform duration-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              settings.promoCard2Image ||
              'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80'
            }
            alt="Curious Kitten"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
