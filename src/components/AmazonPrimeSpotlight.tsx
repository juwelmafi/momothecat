'use client';

import React from 'react';
import { ExternalLink, Check, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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
    darazLink: 'https://www.daraz.com.bd/catalog/?q=interactive+cat+laser+ball',
    badge: "Amazon's Choice",
    darazBadge: 'Daraz Pick',
    perk: 'Prime One-Day Dispatch',
    darazPerk: 'Express Home Delivery in BD',
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
    darazLink: 'https://www.daraz.com.bd/catalog/?q=cat+water+fountain+stainless+steel',
    badge: 'Best Seller',
    darazBadge: 'Daraz Choice',
    perk: 'Free Shipping with Prime',
    darazPerk: 'Cash on Delivery in BD',
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
    darazLink: 'https://www.daraz.com.bd/catalog/?q=cat+scratching+post+sisal',
    badge: 'Popular',
    darazBadge: 'Top Trending',
    perk: 'Endures Heavy Claws',
    darazPerk: 'Fast Delivery Nationwide',
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
    darazLink: 'https://www.daraz.com.bd/catalog/?q=calming+cat+bed+donut',
    badge: 'Top Rated',
    darazBadge: 'Customer Favorite',
    perk: 'Machine Washable Plush',
    darazPerk: 'Super Soft Velvet Plush',
  },
];

export default function AmazonPrimeSpotlight() {
  const { isBD } = useCart();

  return (
    <section className="py-16 sm:py-20 bg-[#FDFBF7] border-y border-black/5">
      <div className="pettie-container">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-[#FF6B35] font-black text-xs uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 fill-[#FF6B35]" />
              <span>{isBD ? 'Daraz Express Spotlight' : 'Amazon Prime Spotlight'}</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#232121]">
              {isBD
                ? "Today's Highest-Rated Daraz Deals"
                : "Today's Highest-Rated Amazon Deals"}
            </h2>
          </div>

          <a
            href={
              isBD
                ? 'https://www.daraz.com.bd/catalog/?q=cat+supplies'
                : 'https://www.amazon.com?tag=momothecat-20'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="pettie-btn pettie-btn-white text-xs shadow-xs hidden md:flex items-center gap-1.5"
          >
            <span>{isBD ? 'Explore All Deals on Daraz' : 'Explore All Amazon Deals'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF6B35]" />
          </a>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {SPOTLIGHT_ITEMS.map((item, idx) => {
            const itemUrl = isBD && item.darazLink ? item.darazLink : item.link;
            const itemBadge = isBD ? item.darazBadge : item.badge;
            const itemPerk = isBD ? item.darazPerk : item.perk;
            const platformName = isBD ? 'Daraz' : 'Amazon';

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border border-black/5 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Full Width Cover */}
                  <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#FBF9F7] mb-2 sm:mb-4">
                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 bg-[#E64A19] text-white text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                      {item.discount}
                    </span>
                    <span
                      className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 ${
                        isBD ? 'bg-[#F85606]' : 'bg-[#FF6B35]'
                      } text-white text-[7px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs`}
                    >
                      {itemBadge}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Pricing & Tag */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                    <span className="text-[10px] sm:text-xs text-[#888888] line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                    <span className="font-display font-bold text-xs sm:text-base text-[#232121]">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-[#2FA5FB] bg-[#D2EDF8] px-1.5 sm:px-2 py-0.5 rounded-full ml-auto">
                      {isBD ? 'BD' : 'Prime'}
                    </span>
                  </div>

                  {/* Perk */}
                  <p className="text-[9px] sm:text-[11px] text-[#555555] flex items-center gap-1 mt-1 sm:mt-2 line-clamp-1">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF6B35] shrink-0" />
                    <span className="truncate">{itemPerk}</span>
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2 sm:pt-4">
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
