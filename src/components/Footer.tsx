'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  Send,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/initialData';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const { showToast, settings } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'pettie_footer_15' }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        showToast('Welcome! 15% discount coupon: MOMO15');
      }
    } catch {
      showToast('Error subscribing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="footer-section" className="relative bg-[#232121] text-slate-300 pt-16 pb-12 overflow-hidden">
      {/* Top Wave Transition from Yellow Partners to Dark Footer */}
      <div className="absolute top-0 inset-x-0 overflow-hidden leading-none pointer-events-none -translate-y-[99%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-14 text-[#232121] fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="pettie-container space-y-16 relative z-10">
        {/* 1. NEWSLETTER SUBSCRIPTION BANNER WITH CUTE PET GRAPHIC */}
        <div className="relative rounded-[32px] bg-[#2A2727] p-8 sm:p-12 border border-white/10 shadow-2xl overflow-hidden">
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Illustration */}
            <div className="shrink-0 w-32 sm:w-44 h-auto hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  settings.newsletterPetImage ||
                  'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Group-132587@2x.png'
                }
                alt="Pets illustration"
                className="w-full h-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Center/Right: Heading and Input */}
            <div className="flex-1 text-center lg:text-left space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFC312]">
                Stay Connected & Save
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-4xl text-white">
                {settings.newsletterHeading || 'Join our list and get 15% off your first purchase!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                {settings.newsletterDescription || 'Plus weekly alerts for Amazon Prime cat deals, flash sales & exclusive handcrafted drops.'}
              </p>

              {subscribed ? (
                <div className="bg-[#FFC312] text-[#232121] p-3.5 rounded-2xl flex items-center justify-center lg:justify-start gap-3 shadow-md max-w-md">
                  <CheckCircle2 className="w-5 h-5 text-[#232121] shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    You&apos;re In! Use coupon code: <strong className="text-sm font-black">{settings.announcementCode || 'MOMO15'}</strong>
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-2 max-w-md pt-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/15 text-white text-xs placeholder:text-slate-400 outline-none focus:border-[#FFC312]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="pettie-btn pettie-btn-primary text-xs shadow-md disabled:opacity-50"
                  >
                    <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* 2. MAIN 4-COLUMN FOOTER LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pt-4 border-b border-white/10 pb-14">
          {/* Col 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {settings.websiteLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.websiteLogo}
                  alt={settings.brandName || 'Logo'}
                  className="h-10 w-auto object-contain max-w-[120px]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#FFC312] flex items-center justify-center text-[#232121]">
                  <Sparkles className="w-5 h-5 text-[#232121]" />
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-2xl text-white">{settings.brandName || 'Momo'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] inline-block mb-1" />
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.footerDescription || 'Premium Amazon affiliate cat products and hybrid boutique. Curating top-rated Amazon Prime essentials and feline favorites.'}
            </p>

            <div className="space-y-2 text-xs text-slate-300 font-medium pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC312]" />
                <span>{settings.contactAddress || 'momothecat.shop · San Francisco, CA'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-base text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <Link href="/" className="hover:text-[#FFC312] transition-colors">
                  Home Storefront
                </Link>
              </li>
              <li>
                <Link href="/?category=All" className="hover:text-[#FFC312] transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/#curated-collections" className="hover:text-[#FFC312] transition-colors">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link href="/#instagram-section" className="hover:text-[#FFC312] transition-colors">
                  Instagram Feed
                </Link>
              </li>
              <li>
                <Link href="/#social-section" className="hover:text-[#FFC312] transition-colors">
                  Social Channels
                </Link>
              </li>
              <li>
                <Link href="/#testimonials-section" className="hover:text-[#FFC312] transition-colors">
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Cat Departments (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-base text-white">Categories</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              {CATEGORIES.slice(1, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/?category=${encodeURIComponent(cat)}`}
                    className="hover:text-[#FFC312] transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Affiliate Disclosure (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-base text-white">Amazon Associate</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              As an Amazon Associate and affiliate partner, momothecat.shop earns from qualifying purchases. Outbound links to Amazon generate a commission at zero additional cost to you.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#FFC312] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Secure Checkout Guarantee</span>
            </div>
          </div>
        </div>

        {/* 3. COPYRIGHT BAR & OFFICIAL PAYMENT LOGOS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Momo - The Cat (momothecat.shop). All rights reserved.</p>

          {/* Official Pettie Payment Badges Image */}
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                settings.footerPaymentBadgesImage ||
                'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Amount-Logo-1.png'
              }
              alt="Supported Payment Methods"
              className="h-7 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

