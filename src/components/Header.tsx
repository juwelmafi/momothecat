'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Heart,
  ShieldCheck,
  Menu,
  X,
  Flame,
  Sparkles,
  ArrowRight,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CATEGORIES } from '@/lib/initialData';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const { storeMode, itemCount, subtotal, setIsCartOpen, wishlist, settings, isBD, setUserCountry } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When near the top of the page, always show header
      if (currentScrollY <= 60) {
        setIsVisible(true);
        setIsScrolled(false);
        lastScrollY = currentScrollY;
        return;
      }

      setIsScrolled(true);

      // Don't toggle on tiny jitter movements
      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) < 8) return;

      if (currentScrollY > lastScrollY) {
        // Scrolling DOWN -> hide header (unless mobile drawer is open)
        if (!mobileMenuOpen) {
          setIsVisible(false);
          setSearchOpen(false);
        }
      } else {
        // Scrolling UP -> reveal header
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-[#F2D70A] border-b border-[#e2c700] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'shadow-lg' : ''}`}
    >
      {/* 1. TOP ANNOUNCEMENT BAR (Pettie Gold #F2D70A) */}
      <div className="text-[#232121] text-xs font-semibold py-2 px-4 sm:px-8 border-b border-[#e2c700]/70">
        <div className="pettie-container flex items-center justify-between gap-2">
          {/* Promo code announcement */}
          <div className="flex items-center gap-2 text-center md:text-left text-[#232121] truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#232121]" />
            <span className="tracking-wide text-[11px] sm:text-xs font-bold truncate">
              {settings?.announcementText || 'Get 15% Off When You Spend $50+ W. Code:'}{' '}
              {settings?.announcementCode && (
                <strong className="underline underline-offset-2 decoration-[#232121]">
                  {settings.announcementCode}
                </strong>
              )}
            </span>
          </div>

          {/* Region Switcher: Bangladesh (Daraz) vs Global (Amazon) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setUserCountry(isBD ? 'US' : 'BD')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/10 hover:bg-black/20 text-[#232121] text-[10px] sm:text-xs font-bold transition-all shadow-2xs"
              title="Click to toggle between Bangladesh (Daraz) and Global (Amazon)"
            >
              <span>{isBD ? '🇧🇩 BD (Daraz)' : '🌐 Global (Amazon)'}</span>
              <span className="text-[9px] bg-[#232121] text-white px-1.5 py-0.2 rounded-full font-mono uppercase">
                Switch
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Pettie Container: max-width 1280px) */}
      <div className="pettie-container py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo matching Pettie */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            {settings?.websiteLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.websiteLogo}
                alt={settings.brandName || 'Momo'}
                className="h-10 sm:h-12 w-auto object-contain max-w-[140px] group-hover:scale-105 transition-transform shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFC312] flex items-center justify-center text-[#232121] shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-5 h-5 text-[#232121]" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#232121] group-hover:text-[#FF6B35] transition-colors truncate">
                  {settings?.brandName || 'Momo'}
                </span>
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF6B35] inline-block mb-1 shrink-0" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#555555] tracking-wider uppercase -mt-1 truncate">
                {settings?.brandTagline || 'Amazon Cat Boutique'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-bold uppercase tracking-wider text-[#232121]">
            <Link
              href="/"
              className="hover:text-[#FF6B35] transition-colors relative py-1 text-[#232121] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#232121] after:rounded-full"
            >
              Home
            </Link>

            {storeMode !== 'retail_only' ? (
              <Link
                href="/#products-section"
                className="hover:text-[#FF6B35] transition-colors py-1 flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5 fill-[#FF6B35] text-[#FF6B35]" />
                <span>{isBD ? 'Daraz Picks' : 'Amazon Picks'}</span>
              </Link>
            ) : (
              <Link
                href="/#products-section"
                className="hover:text-[#FF6B35] transition-colors py-1 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2FA5FB]" />
                <span>Momo Originals</span>
              </Link>
            )}

            <Link
              href="/#curated-collections"
              className="hover:text-[#FF6B35] transition-colors py-1"
            >
              Collections
            </Link>

            <Link
              href="/#deals-section"
              className="hover:text-[#FF6B35] transition-colors py-1 text-[#FF6B35]"
            >
              Deals & Offers
            </Link>


            <Link
              href="/#instagram-section"
              className="hover:text-[#FF6B35] transition-colors py-1"
            >
              Instagram
            </Link>

            <Link
              href="/#social-section"
              className="hover:text-[#FF6B35] transition-colors py-1"
            >
              Social
            </Link>

            <Link
              href="/#footer-section"
              className="hover:text-[#FF6B35] transition-colors py-1"
            >
              Contact
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/15 hover:border-[#232121] bg-white/70 hover:bg-white text-[#232121] flex items-center justify-center transition-all shadow-2xs"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist (Desktop & Tablet) */}
            <Link
              href="/?view=wishlist"
              className="hidden sm:flex shrink-0 relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/15 hover:border-[#FF6B35] bg-white/70 hover:bg-white text-[#232121] hover:text-[#FF6B35] items-center justify-center transition-all shadow-2xs"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button: Hidden in Affiliate Mode */}
            {storeMode !== 'affiliate_only' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="shrink-0 flex items-center gap-2 bg-white/80 hover:bg-white border border-black/15 hover:border-[#232121] text-[#232121] px-2.5 sm:px-3.5 py-2 rounded-full transition-all group shadow-2xs"
                aria-label="Open Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#232121] group-hover:text-[#FF6B35] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#FF6B35] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                </div>
                <span className="hidden sm:inline text-xs font-bold text-[#232121]">
                  ${subtotal.toFixed(2)}
                </span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-xs ${
                mobileMenuOpen
                  ? 'bg-[#232121] text-white border-2 border-[#232121]'
                  : 'bg-white text-[#232121] border-2 border-black/20 hover:border-[#232121] hover:bg-[#FFF9DE]'
              }`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4 pt-3 border-t border-slate-100 animate-fade-in">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-24 py-3 bg-[#F6F6F4] text-[#232121] text-sm rounded-full border border-slate-200 focus:border-[#FFC312] outline-none font-medium"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#FF6B35] hover:bg-[#FF9933] text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-full transition-all"
              >
                Search
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e2c700] px-5 py-6 space-y-5 shadow-2xl animate-fade-in max-h-[82vh] overflow-y-auto">
          {/* Main Navigation Links */}
          <nav className="space-y-1 text-xs font-bold uppercase tracking-wider text-[#232121]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#232121]"
            >
              <span>Home</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {storeMode !== 'retail_only' ? (
              <Link
                href="/#products-section"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#FF6B35]"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 fill-[#FF6B35]" />
                  <span>{isBD ? 'Daraz Picks' : 'Amazon Picks'}</span>
                </div>
                <span className="text-[10px] bg-[#FFEFEA] px-2 py-0.5 rounded-full font-bold">HOT</span>
              </Link>
            ) : (
              <Link
                href="/#products-section"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#2FA5FB]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2FA5FB]" />
                  <span className="font-bold">Momo Originals</span>
                </div>
                <span className="text-[10px] bg-[#E8F5FE] text-[#0284C7] px-2 py-0.5 rounded-full font-bold">IN-HOUSE</span>
              </Link>
            )}

            <Link
              href="/#curated-collections"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#232121]"
            >
              <span>Curated Collections</span>
              <span className="text-[10px] text-slate-400">Bundles</span>
            </Link>

            <Link
              href="/#deals-section"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#232121]"
            >
              <span>Deals & Offers</span>
              <span className="text-[10px] bg-[#FFC312] text-[#232121] px-2 py-0.5 rounded-full font-bold">20% OFF</span>
            </Link>


            <Link
              href="/#instagram-section"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#232121]"
            >
              <span>Instagram Feed</span>
              <span className="text-[10px] text-[#E1306C] font-bold">@momothecat</span>
            </Link>

            <Link
              href="/#social-section"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#232121]"
            >
              <span>Social Channels</span>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/?view=wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#232121]"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF6B35]" />
                <span>My Wishlist</span>
              </div>
              <span className="w-5 h-5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            <Link
              href="/#footer-section"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FFF9DE] transition-colors text-[#232121]"
            >
              <span>Contact Us</span>
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </nav>

          {/* Categories Quick Filter */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Cat Departments
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-[#FBF9F7] hover:bg-[#FFC312] text-[#232121] text-[11px] font-semibold transition-colors border border-slate-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
