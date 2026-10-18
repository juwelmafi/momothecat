'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Flame, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MergedProduct, AffiliateProduct } from '@/lib/types';

interface CuratedCollectionsProps {
  products?: MergedProduct[];
}

export default function CuratedCollections({ products = [] }: CuratedCollectionsProps) {
  const { isBD } = useCart();

  // Curate bundles from real store products across categories
  const collections = React.useMemo(() => {
    if (!products || products.length === 0) return [];

    const geoFiltered = products.filter((p) => {
      if (p.type === 'affiliate') {
        const aff = p as AffiliateProduct;
        const platform = aff.platform || 'amazon';
        if (isBD) {
          return platform === 'daraz' || (platform === 'both' && Boolean(aff.darazLink));
        } else {
          return platform === 'amazon' || (platform === 'both' && Boolean(aff.affiliateLink));
        }
      }
      return true;
    });

    // Distinct categories if possible
    const selected: MergedProduct[] = [];
    const usedCategories = new Set<string>();

    for (const p of geoFiltered) {
      if (!usedCategories.has(p.category)) {
        selected.push(p);
        usedCategories.add(p.category);
        if (selected.length === 4) break;
      }
    }

    // Fill up to 4 if fewer than 4 categories
    if (selected.length < 4) {
      for (const p of geoFiltered) {
        if (!selected.includes(p)) {
          selected.push(p);
          if (selected.length === 4) break;
        }
      }
    }

    return selected.slice(0, 4);
  }, [products, isBD]);

  // Gracefully return null if no products
  if (collections.length === 0) {
    return null;
  }

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
              ? 'Hand-picked cat supply packages routed directly from top-rated merchants.'
              : 'Hand-picked bundles tested by real feline experts with 1-click checkout.'}
          </p>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {collections.map((item) => {
            const isAffiliate = item.type === 'affiliate';
            const aff = isAffiliate ? (item as AffiliateProduct) : null;
            const isDaraz = aff?.platform === 'daraz' || (aff?.platform === 'both' && isBD);

            const itemUrl = isAffiliate
              ? (isDaraz ? (aff?.darazLink || aff?.affiliateLink) : aff?.affiliateLink) || '#'
              : `/product/${item._id}`;

            const itemBadge = isDaraz
              ? (item.badge?.includes('Amazon') ? 'Daraz Pick' : item.badge || 'Popular')
              : (item.badge || "Curated Pick");

            const itemImage = isAffiliate
              ? aff?.imageUrl || ''
              : item.images?.[0] || '';

            const platformName = isAffiliate ? (isDaraz ? 'Daraz' : 'Amazon') : 'Store';

            return (
              <div
                key={item._id}
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
                    {isAffiliate ? (
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        className="block w-full h-full cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={itemImage}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </a>
                    ) : (
                      <Link href={itemUrl} className="block w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={itemImage}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 sm:space-y-2">
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                      {item.category}
                    </span>

                    <div className="min-h-[32px] sm:min-h-[40px] flex items-center">
                      {isAffiliate ? (
                        <a
                          href={itemUrl}
                          target="_blank"
                          rel="sponsored nofollow noopener noreferrer"
                          className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug cursor-pointer"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          href={itemUrl}
                          className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>

                    {/* Price */}
                    <p className="font-display font-bold text-xs sm:text-sm text-[#232121]">
                      From ${item.price.toFixed(2)}
                    </p>

                    {/* Description - hidden on mobile for clean card ratio */}
                    <p className="text-[11px] text-[#666666] line-clamp-2 leading-relaxed hidden sm:block">
                      {item.description || 'Premium feline essentials tested for comfort, durability and delight.'}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1 pt-1 sm:pt-2 hidden sm:block">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#232121] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                        <span>Vet & Feline Approved</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#232121] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                        <span>Express Delivery Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 sm:pt-5">
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
