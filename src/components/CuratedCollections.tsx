'use client';

import React from 'react';
import { ExternalLink, Flame, Star, CheckCircle2 } from 'lucide-react';

const COLLECTIONS = [
  {
    title: 'Indoor Boredom Busters Kit',
    category: 'Interactive Toys',
    price: 'From $19.99',
    rating: '4.9',
    reviews: '2,140',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    description: 'Automated 360° laser chaser, chirping bird ball & feather teaser keeping indoor cats agile.',
    features: ['3 Best-Selling Toys', 'Prime 1-Day Dispatch', 'Vet Approved'],
    link: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
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
    badge: 'Trending Pick',
  },
  {
    title: 'Claw Gym & Sisal Perch Tree',
    category: 'Scratchers & Trees',
    price: 'From $38.99',
    rating: '5.0',
    reviews: '1,780',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy natural sisal scratching tower with plush resting hammock to protect curtains and sofas.',
    features: ['100% Natural Sisal', 'Heavy Stable Base', 'Saves Your Sofa'],
    link: 'https://www.amazon.com/dp/B07XYZ9871?tag=momothecat-20',
    badge: 'Top Rated',
  },
];

export default function CuratedCollections() {
  return (
    <section id="curated-collections" className="py-16 sm:py-24 bg-white relative">
      <div className="pettie-container">
        
        {/* Section Heading matching Pettie Theme */}
        <div className="text-center mb-12 sm:mb-16 space-y-2">
          <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase">
            \\ | /
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
            Curated Feline Starter Kits
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
            Amazon Prime top-rated collections tailored for playtime, royal sleep, and wholesome hydration
          </p>
        </div>

        {/* 4 Themed Product Collection Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 sm:gap-8">
          {COLLECTIONS.map((c, i) => (
            <div
              key={i}
              className="group bg-[#FBF9F7] hover:bg-[#FFF9DE]/60 rounded-2xl sm:rounded-[28px] p-2.5 sm:p-5 border border-[#ECECEC] transition-all duration-300 hover:shadow-xl flex flex-col justify-between h-full"
            >
              <div>
                {/* Image Container with 20px radius and badge */}
                <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-[20px] overflow-hidden bg-white mb-2 sm:mb-4 shadow-2xs border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Amazon badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#FF6B35] text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#FFC312] text-[#FFC312]" />
                    <span>{c.badge}</span>
                  </div>

                  {/* Rating Pill */}
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/75 backdrop-blur-xs text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#FFC312] text-[#FFC312]" />
                    <span>{c.rating}</span>
                    <span className="text-white/60 hidden sm:inline">({c.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6B35] truncate max-w-[90px] sm:max-w-none">
                      {c.category}
                    </span>
                    <span className="font-display font-bold text-xs sm:text-sm text-[#232121]">
                      {c.price}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xs sm:text-lg text-[#232121] group-hover:text-[#FF6B35] transition-colors leading-tight sm:leading-snug line-clamp-2 min-h-[28px] sm:min-h-[44px]">
                    {c.title}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-[#666666] leading-tight sm:leading-relaxed line-clamp-2">
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

              {/* Action Button: Amazon Outbound */}
              <div className="pt-2 sm:pt-5">
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pettie-btn pettie-btn-primary pettie-btn-card w-full shadow-xs flex items-center justify-center gap-1"
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
