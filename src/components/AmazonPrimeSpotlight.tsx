'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Check, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MergedProduct, AffiliateProduct } from '@/lib/types';

interface AmazonPrimeSpotlightProps {
  products?: MergedProduct[];
}

export default function AmazonPrimeSpotlight({ products = [] }: AmazonPrimeSpotlightProps) {
  const { isBD, settings } = useCart();

  // Dynamically select real store products (deals, featured, or top rated). No fake placeholder mock products.
  const spotlightItems = React.useMemo(() => {
    if (!products || products.length === 0) return [];

    // Prioritize products with active discounts or marked featured
    const deals = products.filter(
      (p) => (p.originalPrice && p.originalPrice > p.price) || p.isFeatured
    );

    const pool = deals.length >= 4 ? deals : [...deals, ...products.filter((p) => !deals.includes(p))];
    return pool.slice(0, 4);
  }, [products]);

  // Gracefully return null if no real products exist
  if (spotlightItems.length === 0) {
    return null;
  }

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
                ? (settings.darazAffiliateTag
                    ? `https://www.daraz.com.bd/catalog/?q=cat+supplies`
                    : 'https://www.daraz.com.bd/catalog/?q=cat+supplies')
                : `https://www.amazon.com?tag=${settings.affiliateTag || 'momothecat-20'}`
            }
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="pettie-btn pettie-btn-white text-xs shadow-xs hidden md:flex items-center gap-1.5"
          >
            <span>{isBD ? 'Explore All Deals on Daraz' : 'Explore All Amazon Deals'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF6B35]" />
          </a>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {spotlightItems.map((item) => {
            const isAffiliate = item.type === 'affiliate';
            const aff = isAffiliate ? (item as AffiliateProduct) : null;
            
            const itemUrl = isAffiliate
              ? isBD && aff?.darazLink
                ? aff.darazLink
                : aff?.affiliateLink || '#'
              : `/product/${item._id}`;

            const itemBadge = item.badge || (isBD ? 'Daraz Pick' : "Amazon's Choice");
            const itemImage = isAffiliate
              ? aff?.imageUrl || ''
              : item.images?.[0] || '';

            const origPrice = item.originalPrice && item.originalPrice > item.price
              ? item.originalPrice
              : item.price * 1.25;

            const discountText = item.originalPrice && item.originalPrice > item.price
              ? `${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF`
              : 'DEAL';

            const itemPerk = isAffiliate
              ? isBD
                ? 'Express Home Delivery in BD'
                : 'Prime One-Day Dispatch'
              : 'Momo Direct Boutique Dispatch';

            const platformName = isAffiliate ? (isBD ? 'Daraz' : 'Amazon') : 'Store';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border border-black/5 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Full Width Cover */}
                  <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#FBF9F7] mb-2 sm:mb-4">
                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 bg-[#E64A19] text-white text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                      {discountText}
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
                      src={itemImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xs sm:text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h3>

                  {/* Pricing & Tag */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                    <span className="text-[10px] sm:text-xs text-[#888888] line-through">
                      ${origPrice.toFixed(2)}
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
