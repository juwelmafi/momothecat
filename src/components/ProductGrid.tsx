'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MergedProduct, StoreMode, AffiliateProduct, StoreSettings } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import ProductCard from './ProductCard';
import HeroBanner from './HeroBanner';
import CategoryShowcase from './CategoryShowcase';
import PassionBanner from './PassionBanner';
import DealsBanner from './DealsBanner';
import PromoCards from './PromoCards';
import TestimonialsSection from './TestimonialsSection';
import DiscountsBanner from './DiscountsBanner';
import AmazonPrimeSpotlight from './AmazonPrimeSpotlight';
import CuratedCollections from './CuratedCollections';
import ViralCatFavorites from './ViralCatFavorites';
import InstagramFeed from './InstagramFeed';
import SocialMediaSection from './SocialMediaSection';
import {
  Flame,
  Sparkles,
  LayoutGrid,
  Utensils,
  Activity,
  Armchair,
  Palmtree,
  PackageOpen,
} from 'lucide-react';

interface ProductGridProps {
  initialProducts: MergedProduct[];
  activeCategory?: string;
  searchQuery?: string;
  activeFilter?: string;
  initialView?: string;
  storeMode?: StoreMode;
  serverSettings?: StoreSettings;
  serverCountry?: string;
}

const CIRCLE_CATEGORIES = [
  { name: 'All Products', label: 'All Products', icon: LayoutGrid },
  { name: 'Cat Food & Treats', label: 'Cat Food', icon: Utensils },
  { name: 'Cat Toys', label: 'Cat Toys', icon: Activity },
  { name: 'Beds & Furniture', label: 'Cat Beds', icon: Armchair },
  { name: 'Scratchers & Trees', label: 'Scratchers', icon: Palmtree },
  { name: 'Grooming & Care', label: 'Grooming', icon: Sparkles },
];

const DEFAULT_SECTIONS_ORDER = [
  'hero',
  'categories',
  'passion',
  'products',
  'promo_cards',
  'spotlight',
  'testimonials',
  'discounts',
  'collections',
  'viral',
  'instagram',
  'social',
];

export default function ProductGrid({
  initialProducts,
  activeCategory = 'All Products',
  searchQuery = '',
  activeFilter = 'all',
  initialView = '',
  storeMode,
  serverSettings,
  serverCountry,
}: ProductGridProps) {
  const { storeMode: contextMode, settings: contextSettings, isBD: contextIsBD, userCountry, wishlist } = useCart();
  const currentMode = storeMode || contextMode || 'hybrid';
  const settings = { ...serverSettings, ...contextSettings };
  const isBD = userCountry ? userCountry === 'BD' : (serverCountry ? serverCountry === 'BD' : contextIsBD);

  const [selectedCategory, setSelectedCategory] = useState(
    activeCategory === 'All' ? 'All Products' : activeCategory
  );
  const [selectedType, setSelectedType] = useState<'all' | 'affiliate' | 'real'>(
    activeFilter === 'amazon' ? 'affiliate' : activeFilter === 'momo' ? 'real' : 'all'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [currentSearch, setCurrentSearch] = useState(searchQuery);

  // 1. Base Geo & Architecture Filter:
  // In Bangladesh: show ONLY Daraz affiliate products (must have valid darazLink, not amazon-only, not global-only)
  // Outside Bangladesh: show ONLY Amazon affiliate products (must have valid affiliateLink, not daraz-only, not bd-only)
  const geoFilteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Respect storefront mode
      if (currentMode === 'affiliate_only' && product.type !== 'affiliate') return false;
      if (currentMode === 'retail_only' && product.type !== 'real') return false;

      // Strict geo-targeting
      if (product.type === 'affiliate') {
        const aff = product as AffiliateProduct;
        const platform = aff.platform || 'amazon';
        if (isBD) {
          // Visitor from Bangladesh: Show ONLY Daraz affiliate products. Amazon products are hidden!
          const isDaraz = platform === 'daraz' || (platform === 'both' && Boolean(aff.darazLink));
          if (!isDaraz) return false;
        } else {
          // Visitor from other countries: Show ONLY Amazon affiliate products. Daraz products are hidden!
          const isAmazon = platform === 'amazon' || (platform === 'both' && Boolean(aff.affiliateLink));
          if (!isAmazon) return false;
        }
      }

      return true;
    });
  }, [initialProducts, currentMode, isBD]);

  // 2. User Interactive Filter & Sort (Category, Type filter, Search, Wishlist, Sort)
  const filteredProducts = useMemo(() => {
    return geoFilteredProducts.filter((product) => {
      // Wishlist view filter
      if (initialView === 'wishlist' && !wishlist.includes(product._id)) return false;

      if (selectedType === 'affiliate' && product.type !== 'affiliate') return false;
      if (selectedType === 'real' && product.type !== 'real') return false;

      if (
        selectedCategory !== 'All Products' &&
        selectedCategory !== 'All' &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (currentSearch.trim()) {
        const q = currentSearch.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [geoFilteredProducts, wishlist, initialView, selectedCategory, selectedType, sortBy, currentSearch]);

  // Section Ordering (Shopify CMS dynamic order)
  const sectionsOrder = useMemo(() => {
    if (settings.homepageSectionsOrder && Array.isArray(settings.homepageSectionsOrder) && settings.homepageSectionsOrder.length > 0) {
      // Ensure all standard sections are represented
      const existing = new Set(settings.homepageSectionsOrder);
      const missing = DEFAULT_SECTIONS_ORDER.filter((s) => !existing.has(s));
      return [...settings.homepageSectionsOrder, ...missing];
    }
    return DEFAULT_SECTIONS_ORDER;
  }, [settings.homepageSectionsOrder]);

  // Section Component Renderer
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        if (settings.showHeroBanner === false) return null;
        return <HeroBanner key="hero" />;

      case 'categories':
        if (settings.showCategoryShowcase === false) return null;
        return (
          <CategoryShowcase
            key="categories"
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              const el = document.getElementById('products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        );

      case 'passion':
        if (settings.showPassionBanner === false) return null;
        return <PassionBanner key="passion" />;

      case 'products':
        if (settings.showProductGrid === false) return null;
        return (
          <section id="products-section" key="products" className="py-16 sm:py-24 bg-[#FBF9F7] border-y border-black/5">
            <div className="pettie-container">
              {initialView === 'wishlist' && (
                <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-[#FFF9DE] border border-[#F2D70A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">❤️</span>
                    <div>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-[#232121]">My Wishlist</h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {filteredProducts.length === 0
                          ? 'No items saved to your wishlist yet.'
                          : `Showing ${filteredProducts.length} saved product${filteredProducts.length === 1 ? '' : 's'}.`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#232121] text-white text-xs font-bold hover:bg-[#FF6B35] transition-colors self-start sm:self-auto"
                  >
                    Browse All Products
                  </Link>
                </div>
              )}

              {/* Section Heading with decorative \ | / dashes */}
              <div className="text-center mb-10 space-y-2">
                <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase">
                  \ | /
                </div>
                <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
                  {settings.productsHeading || 'Organic & Top-Rated Products'}
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
                  {settings.productsSubheading || 'Select category to discover prime essentials and handcrafted comfort'}
                </p>
              </div>

              {/* CIRCULAR CATEGORY BUTTONS (Exact Pettie Demo Layout) */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap pb-10">
                {CIRCLE_CATEGORIES.map((cat) => {
                  const isSelected =
                    selectedCategory === cat.name ||
                    (selectedCategory === 'All' && cat.name === 'All Products');

                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className="group flex flex-col items-center focus:outline-none transition-transform hover:-translate-y-1.5"
                    >
                      {/* Active \ | / Sparkle */}
                      <div className="h-4 text-[#FF6B35] text-[11px] font-black">
                        {isSelected ? '\\ | /' : ''}
                      </div>

                      {/* Circular Button */}
                      <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-300 border-4 ${
                          isSelected
                            ? 'bg-[#FFC312] border-white ring-4 ring-[#FFC312]/30 scale-105'
                            : 'bg-[#FF6B35] border-white group-hover:bg-[#FF9933]'
                        }`}
                      >
                        <cat.icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${isSelected ? 'text-[#232121]' : 'text-white'}`} />
                      </div>

                      {/* Title Below Circle */}
                      <span
                        className={`mt-2.5 font-display text-xs sm:text-sm font-bold tracking-tight text-center max-w-[100px] leading-tight ${
                          isSelected ? 'text-[#FF6B35]' : 'text-[#232121]'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Filters: All, Amazon Picks, Momo Originals */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-10 border-b border-black/5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedType('all');
                      setSelectedCategory('All Products');
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedType === 'all' && selectedCategory === 'All Products'
                        ? 'bg-[#232121] text-white shadow-xs'
                        : 'bg-white text-[#232121] hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    All Items ({initialProducts.length})
                  </button>

                  {/* Affiliate Picks: Hidden in Real Product Mode */}
                  {currentMode !== 'retail_only' && (
                    <button
                      onClick={() => setSelectedType('affiliate')}
                      className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        selectedType === 'affiliate'
                          ? isBD
                            ? 'bg-[#F85606] text-white shadow-xs'
                            : 'bg-[#FF6B35] text-white shadow-xs'
                          : 'bg-white text-[#232121] hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 fill-[#FFC312] text-[#FFC312]" />
                      <span>{isBD ? 'Daraz Picks' : 'Amazon Picks'}</span>
                    </button>
                  )}

                  {/* Momo Originals: Hidden in Affiliate Mode */}
                  {currentMode !== 'affiliate_only' && (
                    <button
                      onClick={() => setSelectedType('real')}
                      className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        selectedType === 'real'
                          ? 'bg-[#2FA5FB] text-white shadow-xs'
                          : 'bg-white text-[#232121] hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Momo Originals</span>
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-bold uppercase bg-white border border-slate-200 rounded-full px-4 py-2 outline-none text-[#232121] cursor-pointer focus:border-[#FF6B35]"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Search Result Clearer */}
              {currentSearch && (
                <div className="inline-flex items-center gap-2 p-2 bg-[#FFEFEA] text-[#FF6B35] rounded-full text-xs font-bold px-4 mb-6">
                  <span>Search: &ldquo;{currentSearch}&rdquo;</span>
                  <button onClick={() => setCurrentSearch('')} className="underline text-[11px]">
                    Clear
                  </button>
                </div>
              )}

              {/* Product Cards 4-Column Grid matching Pettie */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
                  <PackageOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-display font-bold text-lg text-[#232121]">No products found</h3>
                  <p className="text-xs text-[#666666]">
                    Try changing the category or reset your filter to view all items.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All Products');
                      setSelectedType('all');
                      setCurrentSearch('');
                    }}
                    className="pettie-btn pettie-btn-primary text-[10px] sm:text-xs"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 sm:gap-7">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}


            </div>
          </section>
        );

      case 'promo_cards':
        if (!settings.showPromoCards) return null;
        return (
          <div key="promo_cards" className="pettie-container py-6">
            <PromoCards />
          </div>
        );

      case 'deals':
        return null;

      case 'spotlight':
        // Only show if explicitly enabled by admin, and uses real products with NO placeholder items
        if (!settings.showSpotlight || currentMode === 'retail_only') return null;
        return <AmazonPrimeSpotlight key="spotlight" products={geoFilteredProducts} />;

      case 'testimonials':
        if (settings.showTestimonials === false) return null;
        return <TestimonialsSection key="testimonials" />;

      case 'discounts':
        if (settings.showDiscountsBanner === false) return null;
        return <DiscountsBanner key="discounts" />;

      case 'collections':
        // Only show if explicitly enabled by admin, and uses real products with NO placeholder items
        if (!settings.showCuratedCollections) return null;
        return <CuratedCollections key="collections" products={geoFilteredProducts} />;

      case 'viral':
        // Only show if explicitly enabled by admin, and uses real products with NO placeholder items
        if (!settings.showViralFavorites || currentMode === 'retail_only') return null;
        return <ViralCatFavorites key="viral" products={geoFilteredProducts} />;

      case 'instagram':
        if (settings.showInstagramFeed === false) return null;
        return <InstagramFeed key="instagram" />;

      case 'social':
        if (settings.showSocialMedia === false) return null;
        return <SocialMediaSection key="social" />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {sectionsOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
