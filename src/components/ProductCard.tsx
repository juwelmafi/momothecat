'use client';

import React from 'react';
import Link from 'next/link';
import { MergedProduct, RealProduct, AffiliateProduct } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import {
  ExternalLink,
  ShoppingBag,
  Heart,
  Eye,
  Flame,
  Sparkles,
} from 'lucide-react';

interface ProductCardProps {
  product: MergedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { storeMode, addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useCart();
  const isReal = product.type === 'real';
  const isAffiliate = product.type === 'affiliate';

  const realProd = isReal ? (product as RealProduct) : null;
  const affProd = isAffiliate ? (product as AffiliateProduct) : null;

  const displayImage = isReal ? realProd!.images[0] : affProd!.imageUrl;
  const isOutOfStock = isReal && (realProd?.stockQuantity ?? 0) <= 0;
  const wishlisted = isWishlisted(product._id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="product-wrapper group relative flex flex-col justify-between h-full">
      {/* 1. PRODUCT THUMB CONTAINER (Pettie exact border-radius: 20px, white/soft bg, border) */}
      <div className="product-thumb relative w-full aspect-square rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#FBF9F7] group-hover:bg-[#FFF9DE]/60 transition-colors duration-300 border border-[#EAEAEA] flex items-center justify-center p-2.5 sm:p-5 lg:p-6 shadow-2xs">
        {/* Top-Left Discount or Brand Badge */}
        <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10">
          {discountPercent ? (
            <span className="bg-[#E64A19] text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs">
              GET {discountPercent}% OFF
            </span>
          ) : isAffiliate ? (
            <span className="bg-[#FF6B35] text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current text-[#FFC312]" />
              Amazon Pick
            </span>
          ) : (
            <span className="bg-[#2FA5FB] text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Momo Original
            </span>
          )}
        </div>

        {/* Top-Right Heart Wishlist Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          className={`absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
            wishlisted
              ? 'bg-[#FF6B35] text-white shadow-md'
              : 'bg-white/80 sm:bg-transparent text-[#232121]/70 hover:text-[#FF6B35] hover:scale-110 shadow-xs sm:shadow-none'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current' : 'stroke-[1.5]'}`} />
        </button>

        {/* Product Image */}
        {isReal ? (
          <Link href={`/product/${product._id}`} className="block w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        ) : (
          <a
            href={affProd?.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
            />
          </a>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1.5 sm:gap-2">
          {isAffiliate && storeMode !== 'retail_only' ? (
            <a
              href={affProd?.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 sm:py-2.5 bg-[#FF6B35] hover:bg-[#FF9933] text-white text-[9px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center justify-center gap-1 transition-all"
            >
              <span>View on Amazon</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
          ) : isReal && storeMode !== 'affiliate_only' ? (
            <button
              onClick={() => addToCart(realProd!)}
              disabled={isOutOfStock}
              className="flex-1 py-1.5 sm:py-2.5 bg-[#FF6B35] hover:bg-[#FF9933] text-white text-[9px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center justify-center gap-1 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          ) : null}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-slate-100 text-[#232121] flex items-center justify-center shadow-md shrink-0"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#232121]" />
          </button>
        </div>
      </div>

      {/* 2. PRODUCT DETAILS SECTION (Outside the image box, centered) */}
      <div className="product-details pt-2 sm:pt-3.5 pb-1 sm:pb-2 text-center space-y-0.5 sm:space-y-1">
        {/* Title in Fredoka One bold */}
        <div className="product-title min-h-[32px] sm:min-h-[40px] flex items-center justify-center">
          {isReal ? (
            <Link
              href={`/product/${product._id}`}
              className="font-display font-bold text-xs sm:text-base lg:text-lg text-[#232121] hover:text-[#FF6B35] line-clamp-2 transition-colors leading-tight sm:leading-snug"
            >
              {product.name}
            </Link>
          ) : (
            <a
              href={affProd?.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold text-xs sm:text-base lg:text-lg text-[#232121] hover:text-[#FF6B35] line-clamp-2 transition-colors leading-tight sm:leading-snug"
            >
              {product.name}
            </a>
          )}
        </div>

        {/* Price Centered below title */}
        <div className="product-price flex items-center justify-center gap-1.5 sm:gap-2">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] sm:text-sm text-slate-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="font-display font-bold text-xs sm:text-base text-[#232121]">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
