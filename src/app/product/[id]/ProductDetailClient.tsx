'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MergedProduct, RealProduct, AffiliateProduct } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

interface Props {
  product: MergedProduct;
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { storeMode, addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

  const isReal = product.type === 'real';
  const realProd = isReal ? (product as RealProduct) : null;
  const affProd = !isReal ? (product as AffiliateProduct) : null;

  const images = isReal && realProd ? realProd.images : [affProd!.imageUrl];
  const activeImage = images[selectedImgIndex] || images[0];
  const isOutOfStock = isReal && (realProd?.stockQuantity ?? 0) <= 0;
  const wishlisted = isWishlisted(product._id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (realProd) {
      addToCart(realProd, quantity);
    }
  };

  const handleBuyNow = () => {
    if (realProd) {
      addToCart(realProd, quantity);
      router.push('/checkout');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
      {/* Left Gallery (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm group">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-md">
              {product.badge || (isReal ? 'Momo Original' : "Amazon's Choice")}
            </span>
            {discountPercent && (
              <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product._id)}
            className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              wishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImgIndex(i)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImgIndex === i
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Product Details & Actions (6 cols) */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100/70 px-3 py-1 rounded-lg">
              {product.category}
            </span>
            {isReal ? (
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Momo Original Retail
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                Amazon Prime Direct
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-extrabold text-slate-800">{product.rating.toFixed(1)}</span>
            <span className="text-xs font-medium text-slate-500">
              ({product.reviewCount} customer reviews)
            </span>
          </div>
        </div>

        {/* Price and Stock status */}
        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {isReal && realProd && (
            <div>
              {isOutOfStock ? (
                <span className="text-xs font-extrabold text-rose-600 bg-rose-100/80 px-3 py-1.5 rounded-full">
                  Sold Out
                </span>
              ) : (
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {realProd.stockQuantity} in stock
                </span>
              )}
            </div>
          )}
        </div>

        {/* Short Summary */}
        <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

        {/* Purchase Controls */}
        <div className="pt-2 space-y-4">
          {isReal && realProd ? (
            storeMode === 'affiliate_only' ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-semibold text-center space-y-2">
                <p className="flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Storefront is currently in <strong>Affiliate Mode</strong>.</span>
                </p>
                <p className="text-[11px] text-amber-700">In-house ordering for Momo Originals is temporarily disabled.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 text-slate-500 hover:text-orange-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-extrabold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(realProd.stockQuantity || 10, q + 1))}
                      disabled={quantity >= realProd.stockQuantity}
                      className="p-2.5 text-slate-500 hover:text-orange-600 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                      isOutOfStock
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                        : 'border-slate-900 bg-slate-900 text-white hover:bg-black shadow-md'
                    }`}
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            storeMode === 'retail_only' ? (
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 text-xs font-semibold text-center space-y-2">
                <p className="flex items-center justify-center gap-1.5">
                  <Info className="w-4 h-4 shrink-0 text-slate-600" />
                  <span>Storefront is currently in <strong>Real Product Mode</strong>.</span>
                </p>
                <p className="text-[11px] text-slate-500">Outbound Amazon links are currently disabled.</p>
              </div>
            ) : (
              <div>
                <a
                  href={affProd?.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <span>Buy Now on Amazon</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">
                  Routes directly to Amazon with Prime 1-day or 2-day delivery benefits.
                </p>
              </div>
            )
          )}
        </div>

        {/* Value Promises */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-white border border-slate-100 text-center space-y-1">
            <Truck className="w-5 h-5 text-orange-500 mx-auto" />
            <p className="text-[11px] font-bold text-slate-800">Free Shipping</p>
            <p className="text-[10px] text-slate-400">On orders over $45</p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-100 text-center space-y-1">
            <RotateCcw className="w-5 h-5 text-teal-600 mx-auto" />
            <p className="text-[11px] font-bold text-slate-800">30-Day Returns</p>
            <p className="text-[10px] text-slate-400">Hassle-free guarantee</p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-100 text-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-amber-500 mx-auto" />
            <p className="text-[11px] font-bold text-slate-800">Vet Approved</p>
            <p className="text-[10px] text-slate-400">Non-toxic safety</p>
          </div>
        </div>

        {/* Tabbed Info */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 px-4 border-b-2 transition-colors ${
                activeTab === 'desc'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description & Highlights
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 px-4 border-b-2 transition-colors ${
                activeTab === 'specs'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications & SKU
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 px-4 border-b-2 transition-colors ${
                activeTab === 'shipping'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Shipping & Fulfillment
            </button>
          </div>

          <div className="py-4 text-xs text-slate-600 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-2">
                <p>{product.description}</p>
                <ul className="space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Engineered specifically for feline behavioral enrichment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Durable materials tested against rigorous claw scratches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Backed by Momo - The Cat customer happiness guarantee</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-slate-400">Category:</span>
                    <p className="font-bold text-slate-800">{product.category}</p>
                  </div>
                  {isReal && realProd && (
                    <>
                      <div>
                        <span className="text-slate-400">SKU / Warehouse ID:</span>
                        <p className="font-bold text-slate-800">{realProd.sku}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Shipping Weight:</span>
                        <p className="font-bold text-slate-800">{realProd.weightInOunces} oz</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Stock Availability:</span>
                        <p className="font-bold text-slate-800">{realProd.stockQuantity} units</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>
                  Orders containing Momo Originals are processed from our warehouse within 24-48 business hours. Tracking numbers are automatically updated upon courier dispatch.
                </p>
                <p>
                  Standard domestic delivery: 2-4 business days. Free shipping on all carts totaling over $45.00!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
