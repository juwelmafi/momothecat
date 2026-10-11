'use client';

import React, { useState } from 'react';
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

interface ViralItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviews: string;
  image: string;
  quote: string;
  highlight: string;
  link: string;
  badge: string;
}

const TABS = [
  { id: 'tech', label: 'Smart Tech & Gadgets', icon: Zap },
  { id: 'toys', label: 'High-Energy Toys', icon: Sparkles },
  { id: 'cozy', label: 'Cozy Sanctuary', icon: Home },
  { id: 'wellness', label: 'Gourmet & Wellness', icon: Heart },
];

const VIRAL_PRODUCTS: Record<string, ViralItem[]> = {
  tech: [
    {
      id: 'tech-1',
      name: 'Interactive Motion Laser Robot & Chaser',
      category: 'Smart Gadget',
      price: 24.99,
      originalPrice: 34.99,
      discount: '29% OFF',
      rating: 4.8,
      reviews: '3,840',
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
      quote: '"Runs quietly on random intervals. My cat exercises daily even when I\'m at work!"',
      highlight: 'Auto-shutoff after 15 mins',
      link: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
      badge: 'TikTok Viral',
    },
    {
      id: 'tech-2',
      name: 'Stainless Steel LED Flow Fountain (2.5L)',
      category: 'Smart Hydration',
      price: 29.95,
      originalPrice: 39.99,
      discount: '25% OFF',
      rating: 4.9,
      reviews: '5,120',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
      quote: '"Double filtration keeps water crisp. Solved our cat\'s dehydration issues completely."',
      highlight: 'Ultra-silent <20dB pump',
      link: 'https://www.amazon.com/dp/B09ABC4567?tag=momothecat-20',
      badge: 'Amazon Pick',
    },
    {
      id: 'tech-3',
      name: 'Smart USB Heating Pad with Temperature Control',
      category: 'Thermal Comfort',
      price: 22.40,
      originalPrice: 28.00,
      discount: '20% OFF',
      rating: 4.7,
      reviews: '1,960',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
      quote: '"Constant 102°F gentle warmth matches mama cat heat. Perfect for senior cats."',
      highlight: 'Chew-proof cord & washable fleece',
      link: 'https://www.amazon.com/dp/B08N567891?tag=momothecat-20',
      badge: 'Vet Endorsed',
    },
    {
      id: 'tech-4',
      name: 'Electric Flopping Wagging Fish Toy',
      category: 'Interactive Tech',
      price: 13.99,
      originalPrice: 18.99,
      discount: '26% OFF',
      rating: 4.6,
      reviews: '4,430',
      image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
      quote: '"Flopping tail activates whenever pounced upon. Refillable catnip pouch included."',
      highlight: 'USB rechargeable & durable canvas',
      link: 'https://www.amazon.com/dp/B08KLM6789?tag=momothecat-20',
      badge: 'Best Seller',
    },
  ],
  toys: [
    {
      id: 'toys-1',
      name: 'Catnip Filled Avocado & Rattle Balls (Pack of 3)',
      category: 'Organic Toys',
      price: 11.99,
      originalPrice: 15.99,
      discount: '25% OFF',
      rating: 4.9,
      reviews: '2,680',
      image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80',
      quote: '"Potent North American catnip inside. My kittens won\'t let this out of sight!"',
      highlight: '100% Organic Catnip',
      link: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
      badge: 'Top Rated',
    },
    {
      id: 'toys-2',
      name: 'Collapsible 3-Way S-Tunnel Tube Maze',
      category: 'Agility & Hiding',
      price: 17.50,
      originalPrice: 24.00,
      discount: '27% OFF',
      rating: 4.8,
      reviews: '3,210',
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
      quote: '"Peep hole and hanging bell ball make sprint sessions insanely fun."',
      highlight: 'Crinkle sound lining',
      link: 'https://www.amazon.com/dp/B07XYZ9871?tag=momothecat-20',
      badge: 'Prime Deal',
    },
    {
      id: 'toys-3',
      name: 'Telescopic Wand with Real Guinea Feathers',
      category: 'Teaser Wands',
      price: 14.20,
      originalPrice: 18.99,
      discount: '25% OFF',
      rating: 4.9,
      reviews: '6,150',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      quote: '"The carbon-fiber wand is bendable and doesn\'t snap. Aerodynamic feather flight!"',
      highlight: 'Includes 5 replacement lures',
      link: 'https://www.amazon.com/dp/B08KLM6789?tag=momothecat-20',
      badge: "Amazon's Choice",
    },
    {
      id: 'toys-4',
      name: 'Hexagon Wooden Whack-A-Mole Puzzle Box',
      category: 'Brain Enrichment',
      price: 21.80,
      originalPrice: 28.50,
      discount: '23% OFF',
      rating: 4.7,
      reviews: '1,340',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      quote: '"Stimulates their hunting intellect. You press pedals and cute mice pop up!"',
      highlight: 'Solid pine wood construction',
      link: 'https://www.amazon.com/dp/B08N567891?tag=momothecat-20',
      badge: 'Viral Favorite',
    },
  ],
  cozy: [
    {
      id: 'cozy-1',
      name: 'Donut Anti-Anxiety Shag Faux Fur Bed',
      category: 'Deep Slumber',
      price: 36.99,
      originalPrice: 48.00,
      discount: '23% OFF',
      rating: 4.9,
      reviews: '8,420',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      quote: '"Our skittish rescue cat fell sound asleep within 10 minutes of unpacking this bed."',
      highlight: 'Machine wash & dryer safe',
      link: 'https://www.amazon.com/dp/B08N567891?tag=momothecat-20',
      badge: 'Best Seller',
    },
    {
      id: 'cozy-2',
      name: 'Suction Window Hammock Perch (Holds 40 lbs)',
      category: 'Sunbathing Perch',
      price: 24.50,
      originalPrice: 32.00,
      discount: '23% OFF',
      rating: 4.8,
      reviews: '4,190',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      quote: '"Giant industrial suction cups hold firm. Cats love bird-watching in warm sunlight!"',
      highlight: 'Steel wire & breathable mesh',
      link: 'https://www.amazon.com/dp/B07XYZ9871?tag=momothecat-20',
      badge: 'Trending Pick',
    },
    {
      id: 'cozy-3',
      name: 'Cave Felt Wool Handcrafted Hideaway Pod',
      category: 'Cave Hideouts',
      price: 39.99,
      originalPrice: 52.00,
      discount: '23% OFF',
      rating: 4.9,
      reviews: '1,880',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      quote: '"Natural Merino wool stays warm in winter and cool in summer. Odor-resistant."',
      highlight: '100% Organic Merino Wool',
      link: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
      badge: 'Handcrafted',
    },
    {
      id: 'cozy-4',
      name: 'Natural Sisal Claw Tower with Top Cradle',
      category: 'Tree & Perch',
      price: 45.00,
      originalPrice: 58.00,
      discount: '22% OFF',
      rating: 4.8,
      reviews: '2,940',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
      quote: '"Extremely stable weighted base. Saved our luxury sofa from claw destruction!"',
      highlight: 'Thick 8mm natural sisal',
      link: 'https://www.amazon.com/dp/B07XYZ9871?tag=momothecat-20',
      badge: 'Vet Recommended',
    },
  ],
  wellness: [
    {
      id: 'well-1',
      name: 'Freeze-Dried Wild Salmon & Chicken Bites',
      category: 'Gourmet Treats',
      price: 15.99,
      originalPrice: 20.00,
      discount: '20% OFF',
      rating: 4.9,
      reviews: '3,510',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
      quote: '"Single ingredient, zero preservatives. Cats go completely wild for the scent!"',
      highlight: 'Single ingredient raw protein',
      link: 'https://www.amazon.com/dp/B09ABC4567?tag=momothecat-20',
      badge: 'Best Seller',
    },
    {
      id: 'well-2',
      name: 'Organic Wheatgrass Growing Kit with Wooden Tray',
      category: 'Digestion & Hairball',
      price: 18.50,
      originalPrice: 24.00,
      discount: '23% OFF',
      rating: 4.8,
      reviews: '1,490',
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
      quote: '"Sprouts in just 5 days. Drastically reduced hairball vomiting for both my cats."',
      highlight: 'Sprouts in 5-7 days',
      link: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
      badge: 'Organic',
    },
    {
      id: 'well-3',
      name: 'Tilted Whisker-Friendly Ceramic Food Bowls',
      category: 'Ergonomic Feeding',
      price: 23.99,
      originalPrice: 30.00,
      discount: '20% OFF',
      rating: 4.9,
      reviews: '2,830',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      quote: '"15-degree tilt prevents neck strain and stops whisker fatigue completely."',
      highlight: 'Lead-free glazed ceramic',
      link: 'https://www.amazon.com/dp/B09ABC4567?tag=momothecat-20',
      badge: 'Vet Approved',
    },
    {
      id: 'well-4',
      name: 'Self-Cleaning Undercoat Deshedding Brush',
      category: 'Grooming Care',
      price: 14.99,
      originalPrice: 19.99,
      discount: '25% OFF',
      rating: 4.9,
      reviews: '4,220',
      image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
      quote: '"One click pops out the whole hair disc. Gentle rubberized round needles."',
      highlight: 'Self-cleaning push button',
      link: 'https://www.amazon.com/dp/B07UVW1234?tag=momothecat-20',
      badge: "Amazon's Choice",
    },
  ],
};

export default function ViralCatFavorites() {
  const [activeTab, setActiveTab] = useState('tech');
  const items = VIRAL_PRODUCTS[activeTab] || [];

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="pettie-container">
        
        {/* Header Block matching Pettie Theme */}
        <div className="text-center mb-10 space-y-2">
          <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase">
            \\ | /
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
            Viral Feline Amazon Favorites
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">
            Internet sensation cat gear, vetted for quality, durability, and endless feline joy
          </p>
        </div>

        {/* Fancy Rounded Category Tabs */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-12">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-display font-bold tracking-tight transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/25 scale-105'
                    : 'bg-[#FBF9F7] text-[#232121] hover:bg-[#FFF9DE] border border-slate-200/80'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF6B35]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4 Cards Grid with Rich Product Details & Amazon Affiliate Direct Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-[#FBF9F7] hover:bg-white rounded-[24px] p-5 border border-slate-200/80 hover:border-[#FF6B35]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container with 20px radius */}
                <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-white mb-4 border border-slate-100 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  <span className="absolute top-3 left-3 bg-[#FF6B35] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    {item.discount}
                  </span>

                  {/* Badge */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#232121] text-[10px] font-bold px-2 py-0.5 rounded-full border border-black/5 shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                {/* Rating & Category */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-[11px] text-[#232121]">
                    <Star className="w-3.5 h-3.5 fill-[#FFC312] text-[#FFC312]" />
                    <span>{item.rating}</span>
                    <span className="text-slate-400 font-normal">({item.reviews})</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-display font-bold text-base text-[#232121] group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                  {item.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-400 line-through">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                  <span className="font-display font-bold text-lg text-[#232121]">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-[#2FA5FB] bg-[#D2EDF8] px-2 py-0.5 rounded-full ml-auto">
                    Prime
                  </span>
                </div>

                {/* Feature highlight */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#232121] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                  <span>{item.highlight}</span>
                </div>

                {/* Real Verified Buyer Quote */}
                <p className="mt-2 text-[11px] text-[#666666] italic bg-white group-hover:bg-[#FFF9DE]/60 p-2.5 rounded-xl border border-slate-100 transition-colors line-clamp-2">
                  {item.quote}
                </p>
              </div>

              {/* Action Button: Amazon Outbound Affiliate */}
              <div className="pt-4">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pettie-btn pettie-btn-primary w-full py-2.5 text-xs shadow-xs flex items-center justify-center gap-1.5 hover:scale-102 transition-transform"
                >
                  <span>Buy on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Amazon Affiliate Promise */}
        <div className="mt-12 rounded-[24px] bg-[#FFF9DE] border-2 border-dashed border-[#FFC312] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FFC312] flex items-center justify-center shrink-0 shadow-xs text-[#232121]">
              <Truck className="w-7 h-7 text-[#232121]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-[#232121]">
                Enjoy Amazon Prime Fast 1-Day Dispatch & Easy Returns
              </h4>
              <p className="text-xs text-[#666666] mt-0.5 max-w-xl">
                As an Amazon Associate, Momo - The Cat links you directly to the safest, authentic pet sellers. All transactions, shipping, and guarantees are handled securely by Amazon.
              </p>
            </div>
          </div>

          <a
            href="https://www.amazon.com?tag=momothecat-20"
            target="_blank"
            rel="noopener noreferrer"
            className="pettie-btn pettie-btn-dark text-xs shrink-0 flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-[#FFC312] fill-current" />
            <span>Visit Amazon Cat Store</span>
          </a>
        </div>

      </div>
    </section>
  );
}
