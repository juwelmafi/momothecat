'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { RealProduct, AffiliateProduct } from '@/lib/types';
import {
  X,
  Star,
  ExternalLink,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
} from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, storeMode, isBD } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const isReal = quickViewProduct.type === 'real';
  const realProd = isReal ? (quickViewProduct as RealProduct) : null;
  const affProd = !isReal ? (quickViewProduct as AffiliateProduct) : null;

  const isDaraz = isBD && Boolean(affProd?.darazLink);
  const affUrl = (isDaraz ? affProd?.darazLink : affProd?.affiliateLink) || '#';
  const affPlatform = isDaraz ? 'Daraz' : 'Amazon';

  const images = isReal && realProd ? realProd.images : [affProd!.imageUrl];
  const activeImage = images[selectedImageIndex] || images[0];
  const isOutOfStock = isReal && (realProd?.stockQuantity ?? 0) <= 0;

  const handleClose = () => {
    setQuickViewProduct(null);
    setSelectedImageIndex(0);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (realProd) {
      addToCart(realProd, qty);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden z-10 animate-fade-in border border-slate-100">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200/80 mb-3 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i
                        ? 'border-orange-500 scale-105 shadow-sm'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & CTA */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                  {quickViewProduct.category}
                </span>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md">
                  {quickViewProduct.badge || (isReal ? 'Momo Original' : 'Amazon Pick')}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                {quickViewProduct.name}
              </h3>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>{quickViewProduct.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-medium">
                  ({quickViewProduct.reviewCount} pet parent reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-black text-slate-900">
                  ${quickViewProduct.price.toFixed(2)}
                </span>
                {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ${quickViewProduct.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                {quickViewProduct.description}
              </p>

              {isReal && realProd && (
                <div className="text-xs space-y-1 text-slate-500 pt-1">
                  <p>
                    <strong>SKU:</strong> {realProd.sku}
                  </p>
                  <p>
                    <strong>Stock:</strong>{' '}
                    <span className={isOutOfStock ? 'text-rose-500 font-bold' : 'text-emerald-600 font-bold'}>
                      {isOutOfStock ? 'Currently Sold Out' : `${realProd.stockQuantity} available to ship`}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
              {isReal ? (
                storeMode === 'affiliate_only' ? (
                  <div className="p-3 bg-amber-50 text-amber-800 text-xs font-semibold rounded-xl text-center border border-amber-200">
                    Real product ordering is disabled in Affiliate Mode.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">Quantity:</span>
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="p-2 text-slate-500 hover:text-orange-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800">{qty}</span>
                        <button
                          onClick={() => setQty((q) => Math.min(realProd?.stockQuantity || 10, q + 1))}
                          disabled={qty >= (realProd?.stockQuantity || 1)}
                          className="p-2 text-slate-500 hover:text-orange-600 disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                    </button>
                  </div>
                )
              ) : (
                storeMode === 'retail_only' ? (
                  <div className="p-3 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl text-center border border-slate-200">
                    Affiliate outbound links are disabled in Real Product Mode.
                  </div>
                ) : (
                  <a
                    href={affUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 ${
                      isDaraz
                        ? 'bg-gradient-to-r from-[#F85606] to-[#ff7a2f] hover:from-[#e04c00] hover:to-[#f0681d]'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                    } text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all`}
                  >
                    <span>Buy on {affPlatform}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )
              )}

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Verified Safe
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-orange-500" />
                  Fast Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
