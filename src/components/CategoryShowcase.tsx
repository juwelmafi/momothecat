'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Props {
  onSelectCategory?: (cat: string) => void;
}

export default function CategoryShowcase({ onSelectCategory }: Props) {
  const { settings } = useCart();

  const arches = [
    {
      title: 'Dog Treats & Food',
      subtitle: 'Nutritious & Delicious',
      image:
        settings.categoryArch1Image ||
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-Dog-Image-1.png',
      bg: '#D2EDF8',
      category: 'Cat Food & Treats',
    },
    {
      title: 'Active Toys & Play',
      subtitle: 'Interactive Teasers',
      image:
        settings.categoryArch2Image ||
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-bird-Image-1.png',
      bg: '#FDF3CA',
      category: 'Cat Toys',
    },
    {
      title: 'Royal Cat Comfort',
      subtitle: 'Beds & Scratchers',
      image:
        settings.categoryArch3Image ||
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-cat-Image-1-1.png',
      bg: '#FDE4D8',
      category: 'Beds & Furniture',
    },
  ];

  return (
    <section className="py-6 sm:py-12 -mt-12 sm:-mt-20 relative z-20">
      <div className="pettie-container">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {arches.map((arch, i) => (
            <div
              key={i}
              className="group relative rounded-2xl sm:rounded-[32px] p-3.5 sm:p-6 md:p-8 flex flex-col justify-between items-center text-center overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-black/5 last:col-span-2 md:last:col-span-1"
              style={{ backgroundColor: arch.bg }}
            >
              {/* Heading */}
              <div className="space-y-0.5 sm:space-y-1 z-10">
                <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#232121]/70">
                  {arch.subtitle}
                </span>
                <h3 className="font-display font-bold text-base sm:text-2xl md:text-3xl text-[#232121] line-clamp-2 leading-tight sm:leading-snug">
                  {arch.title}
                </h3>
              </div>

              {/* Arch cutout image matching Pettie */}
              <div className="relative my-3 sm:my-6 w-28 sm:w-52 md:w-56 h-36 sm:h-60 md:h-64 rounded-t-full overflow-hidden bg-white/70 shadow-md border-2 sm:border-4 border-white group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={arch.image}
                  alt={arch.title}
                  className="w-full h-full object-contain object-bottom pt-2 sm:pt-4"
                />
              </div>

              {/* Discover Button in Pettie 12px 42px pill */}
              <button
                onClick={() => onSelectCategory && onSelectCategory(arch.category)}
                className="pettie-btn pettie-btn-primary pettie-btn-card shadow-xs group-hover:scale-105 transition-transform"
              >
                <span>discover</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
