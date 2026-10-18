'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Flame,
  Star,
  Sparkles,
  Heart,
  Zap,
  CheckCircle2,
  Home,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MergedProduct, AffiliateProduct } from '@/lib/types';

interface ViralCatFavoritesProps {
  products?: MergedProduct[];
}

const TABS = [
  { id: 'tech', label: 'Smart Tech & Gadgets', icon: Zap },
  { id: 'toys', label: 'High-Energy Toys', icon: Sparkles },
  { id: 'cozy', label: 'Cozy Sanctuary', icon: Home },
  { id: 'wellness', label: 'Gourmet & Wellness', icon: Heart },
];

export default function ViralCatFavorites({ products = [] }: ViralCatFavoritesProps) {
  const { isBD } = useCart();
  const [activeTab, setActiveTab] = useState('tech');

  // Categorize real store products into the 4 viral tabs
  const tabProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return { tech: [], toys: [], cozy: [], wellness: [] };
    }

    const tech: MergedProduct[] = [];
    const toys: MergedProduct[] = [];
    const cozy: MergedProduct[] = [];
    const wellness: MergedProduct[] = [];

    products.forEach((p) => {
      const cat = p.category.toLowerCase();
      const name = p.name.toLowerCase();

      if (
        name.includes('laser') ||
        name.includes('automatic') ||
        name.includes('smart') ||
        name.includes('fountain') ||
        name.includes('robot')
      ) {
        tech.push(p);
      } else if (cat.includes('toy') || name.includes('toy') || name.includes('ball') || name.includes('teaser')) {
        toys.push(p);
      } else if (cat.includes('bed') || cat.includes('scratcher') || cat.includes('furniture') || name.includes('bed')) {
        cozy.push(p);
      } else if (cat.includes('food') || cat.includes('treat') || cat.includes('grooming')) {
        wellness.push(p);
      } else {
        // Fallback into general toys
        toys.push(p);
      }
    });

    // If tech is empty, borrow from toys or all
    if (tech.length === 0) tech.push(...products.slice(0, 4));
    if (toys.length === 0) toys.push(...products.slice(0, 4));
    if (cozy.length === 0) cozy.push(...products.slice(0, 4));
    if (wellness.length === 0) wellness.push(...products.slice(0, 4));

    return {
      tech: tech.slice(0, 4),
      toys: toys.slice(0, 4),
      cozy: cozy.slice(0, 4),
      wellness: wellness.slice(0, 4),
    };
  }, [products]);

  const currentItems = tabProducts[activeTab as keyof typeof tabProducts] || [];

  // Gracefully return null if no products at all
  if (!products || products.length === 0 || currentItems.length === 0) {
    return null;
  }

  return (
    <section id="viral-favorites" className="py-16 sm:py-24 bg-[#FBF9F7] border-y border-black/5">
      <div className="pettie-container">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] font-black text-xs uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-[#FF6B35]" />
            <span>Trending Feline Favorites</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
            Viral Community Favorites
          </h2>
          <p className="text-xs sm:text-sm text-[#666666]">
            {isBD
              ? 'Hand-picked pet essentials trending across TikTok & verified Daraz top picks.'
              : 'Hand-picked pet essentials trending across TikTok & verified Amazon top picks.'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10 sm:mb-12">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                  isActive
                    ? 'bg-[#232121] text-white shadow-md scale-105'
                    : 'bg-white text-[#232121] hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFC312]' : 'text-[#FF6B35]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {currentItems.map((item) => {
            const isAffiliate = item.type === 'affiliate';
            const aff = isAffiliate ? (item as AffiliateProduct) : null;

            const itemUrl = isAffiliate
              ? isBD && aff?.darazLink
                ? aff.darazLink
                : aff?.affiliateLink || '#'
              : `/product/${item._id}`;

            const itemBadge = item.badge || (isBD ? 'Daraz Pick' : 'Viral Pick');
            const itemImage = isAffiliate
              ? aff?.imageUrl || ''
              : item.images?.[0] || '';

            const origPrice = item.originalPrice && item.originalPrice > item.price
              ? item.originalPrice
              : item.price * 1.25;

            const discountText = item.originalPrice && item.originalPrice > item.price
              ? `${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF`
              : 'POPULAR';

            const platformName = isAffiliate ? (isBD ? 'Daraz' : 'Amazon') : 'Store';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border border-black/5 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Full Width Cover */}
                  <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#FBF9F7] mb-2 sm:mb-4">
                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 bg-[#FF6B35] text-white text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                      {discountText}
                    </span>
                    <span
                      className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 ${
                        isBD ? 'bg-[#F85606]' : 'bg-[#232121]'
                      } text-white text-[7px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs`}
                    >
                      {itemBadge}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mt-1 sm:mt-1.5">
                    <div className="flex items-center text-[#FFC312]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 ml-1">
                      {item.rating || 4.9} ({item.reviewCount || 1200})
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                    <span className="text-[10px] sm:text-xs text-[#888888] line-through">
                      ${origPrice.toFixed(2)}
                    </span>
                    <span className="font-display font-bold text-xs sm:text-base text-[#232121]">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 sm:pt-4">
                  {isAffiliate ? (
                    <a
                      href={itemUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className={`pettie-btn ${
                        isBD
                          ? 'bg-[#F85606] hover:bg-[#e04c00] text-white'
                          : 'pettie-btn-primary'
                      } pettie-btn-card w-full shadow-xs flex items-center justify-center gap-1`}
                    >
                      <span>View on {platformName}</span>
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={itemUrl}
                      className="pettie-btn pettie-btn-primary pettie-btn-card w-full shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>View Product</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
