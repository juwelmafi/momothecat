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
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useCart();
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
    <div className="product-wrapper group relative flex flex-col justify-between">
      {/* 1. PRODUCT THUMB CONTAINER (Pettie exact border-radius: 20px, white/soft bg, border) */}
      <div className="product-thumb relative w-full aspect-square rounded-[20px] overflow-hidden bg-[#FBF9F7] group-hover:bg-[#FFF9DE]/60 transition-colors duration-300 border border-[#EAEAEA] flex items-center justify-center p-6 shadow-2xs">
        {/* Top-Left Discount or Brand Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          {discountPercent ? (
            <span className="bg-[#E64A19] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              GET {discountPercent}% OFF
            </span>
          ) : isAffiliate ? (
            <span className="bg-[#FF6B35] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current text-[#FFC312]" />
              Amazon Pick
            </span>
          ) : (
            <span className="bg-[#2FA5FB] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
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
          className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            wishlisted
              ? 'bg-[#FF6B35] text-white shadow-md'
              : 'text-[#232121]/70 hover:text-[#FF6B35] hover:scale-110'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : 'stroke-[1.5]'}`} />
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
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          {isAffiliate ? (
            <a
              href={affProd?.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-[#FF9933] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <span>View on Amazon</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              onClick={() => addToCart(realProd!)}
              disabled={isOutOfStock}
              className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-[#FF9933] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-[#232121] flex items-center justify-center shadow-md shrink-0"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4 text-[#232121]" />
          </button>
        </div>
      </div>

      {/* 2. PRODUCT DETAILS SECTION (Outside the image box, centered) */}
      <div className="product-details pt-3.5 pb-2 text-center space-y-1">
        {/* Title in Fredoka One bold */}
        <div className="product-title">
          {isReal ? (
            <Link
              href={`/product/${product._id}`}
              className="font-display font-bold text-lg text-[#232121] hover:text-[#FF6B35] line-clamp-1 transition-colors leading-snug"
            >
              {product.name}
            </Link>
          ) : (
            <a
              href={affProd?.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold text-lg text-[#232121] hover:text-[#FF6B35] line-clamp-1 transition-colors leading-snug"
            >
              {product.name}
            </a>
          )}
        </div>

        {/* Price Centered below title */}
        <div className="product-price flex items-center justify-center gap-2">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="font-display font-bold text-base text-[#232121]">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
