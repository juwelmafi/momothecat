'use client';

import React from 'react';
import { ExternalLink, Flame, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const COLLECTIONS = [
  {
    title: 'Indoor Boredom Busters Kit',
    category: 'Interactive Toys',
    price: 'From $19.99',
    rating: '4.9',
    reviews: '2,140',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    description: 'Automated 360° laser chaser, chirping bird ball & feather teaser keeping indoor cats agile.',
    features: ['3 Best-Selling Toys', 'Express Delivery', 'Vet Approved'],
    link: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
    darazLink: 'https://www.daraz.com.bd/catalog/?q=interactive+cat+laser+ball',
    badge: "Amazon's Choice",
  },
  {
    title: 'Royal Slumber & Calming Bed',
    category: 'Orthopedic Comfort',
    price: 'From $34.50',
    rating: '4.8',
    reviews: '3,890',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    description: 'Anti-anxiety high-loft donut bed with orthopedic neck support for deep, stress-free slumber.',
    features: ['Machine Washable', 'Self-Warming Core', 'Anti-Slip Base'],
    link: 'https://www.amazon.com/dp/B08N567891?tag=momothecat-20',
    darazLink: 'https://www.daraz.com.bd/catalog/?q=calming+cat+bed+donut',
    badge: 'Best Seller',
  },
  {
    title: 'Hydration & Nutrition Feast Set',
    category: 'Feeding & Bowls',
    price: 'From $27.99',
    rating: '4.9',
    reviews: '4,120',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-quiet 304 food-grade stainless fountain + whisker-friendly tilted ceramic feeding bowls.',
    features: ['Triple Filtration', 'Prevents Kidney Stress', 'Dishwasher Safe'],
    link: 'https://www.amazon.com/dp/B09ABC4567?tag=momothecat-20',
    darazLink: 'https://www.daraz.com.bd/catalog/?q=cat+water+fountain+stainless+steel',
    badge: "Amazon's Choice",
  },
  {
    title: 'Precision Grooming & Shed Kit',
    category: 'Coat & Hygiene',
    price: 'From $14.99',
    rating: '4.7',
    reviews: '1,830',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    description: 'Self-cleaning undercoat slicker brush with ergonomic stainless teeth and soft massage tip pins.',
    features: ['One-Click Ejection', 'Gentle On Skin', 'Reduces Hairballs'],
    link: 'https://www.amazon.com/dp/B07UVW1234?tag=momothecat-20',
    darazLink: 'https://www.daraz.com.bd/catalog/?q=cat+deshedding+brush',
    badge: 'Top Rated',
  },
];

export default function CuratedCollections() {
  const { isBD } = useCart();

  return (
    <section id="curated-collections" className="py-16 sm:py-24 bg-white">
      <div className="pettie-container">
        
        {/* Section Heading matching Pettie */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2">
          <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase">
            \ | /
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
            Curated Bundles & Essentials
          </h2>
          <p className="text-xs sm:text-sm text-[#666666]">
            {isBD
              ? 'Hand-picked cat supply packages routed directly from top-rated Daraz merchants.'
              : 'Hand-picked bundles tested by real feline experts with 1-click Amazon checkout.'}
          </p>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {COLLECTIONS.map((c, i) => {
            const itemUrl = isBD && c.darazLink ? c.darazLink : c.link;
            const itemBadge = isBD
              ? c.badge.includes('Amazon')
                ? 'Daraz Pick'
                : c.badge
              : c.badge;
            const platformName = isBD ? 'Daraz' : 'Amazon';

            return (
              <div
                key={i}
                className="bg-[#FBF9F7] rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border border-black/5 hover:border-[#FF6B35]/30 hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image with Edge Cover Fit */}
                  <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white mb-2 sm:mb-4">
                    <span
                      className={`absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 ${
                        isBD ? 'bg-[#F85606]' : 'bg-[#FF6B35]'
                      } text-white text-[7px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1`}
                    >
                      <Flame className="w-2.5 h-2.5 fill-current text-[#FFC312]" />
                      {itemBadge}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1 sm:space-y-2">
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                      {c.category}
                    </span>

                    <h3 className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                      {c.title}
                    </h3>

                    {/* Price */}
                    <p className="font-display font-bold text-xs sm:text-sm text-[#232121]">
                      {c.price}
                    </p>

                    {/* Description - hidden on mobile for clean card ratio */}
                    <p className="text-[11px] text-[#666666] line-clamp-2 leading-relaxed hidden sm:block">
                      {c.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1 pt-1 sm:pt-2 hidden sm:block">
                      {c.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#232121] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 sm:pt-5">
                  <a
                    href={itemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`pettie-btn ${
                      isBD
                        ? 'bg-[#F85606] hover:bg-[#e04c00] text-white'
                        : 'pettie-btn-primary'
                    } pettie-btn-card w-full shadow-xs flex items-center justify-center gap-1`}
                  >
                    <span>View on {platformName}</span>
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
