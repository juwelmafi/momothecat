'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const DEFAULT_SLIDES = [
  {
    petImage: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-dog.png',
    heading1: 'Fresh Flavoured',
    heading2: 'Dog & Cat Food',
    description: 'Nutritious organic meals crafted specifically for feline and canine longevity, shiny coats, and vitality.',
    foodPackImage: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-foodpack-2.png',
    plateImage: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Plate-1.png',
    discountBadge: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Off-img.png',
    headingIcon: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-1-Heading-img.png',
    buttonText: 'discover',
  },
  {
    petImage: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Home-1-Slider-3-1.png',
    heading1: 'Nutrition Rich',
    heading2: 'Pure Cat Treats',
    description: 'Pure freeze-dried chicken, salmon fillets and organic catnip treats that your feline will leap across the room for.',
    foodPackImage: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Home-3-Slider-foodpack.png',
    plateImage: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Plate-1.png',
    discountBadge: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Off-img.png',
    headingIcon: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-1-Heading-img.png',
    buttonText: 'discover',
  },
];

export default function HeroBanner() {
  const { settings } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      ...DEFAULT_SLIDES[0],
      heading1: settings.heroSlide1Heading1 || DEFAULT_SLIDES[0].heading1,
      heading2: settings.heroSlide1Heading2 || DEFAULT_SLIDES[0].heading2,
      description: settings.heroSlide1Description || DEFAULT_SLIDES[0].description,
      buttonText: settings.heroSlide1ButtonText || DEFAULT_SLIDES[0].buttonText,
      petImage: settings.heroSlide1PetImage || DEFAULT_SLIDES[0].petImage,
      foodPackImage: settings.heroSlide1FoodPackImage || DEFAULT_SLIDES[0].foodPackImage,
      plateImage: settings.heroSlide1PlateImage || DEFAULT_SLIDES[0].plateImage,
      discountBadge: settings.heroSlide1DiscountBadge || DEFAULT_SLIDES[0].discountBadge,
      headingIcon: settings.heroSlide1HeadingIcon || DEFAULT_SLIDES[0].headingIcon,
    },
    {
      ...DEFAULT_SLIDES[1],
      heading1: settings.heroSlide2Heading1 || DEFAULT_SLIDES[1].heading1,
      heading2: settings.heroSlide2Heading2 || DEFAULT_SLIDES[1].heading2,
      description: settings.heroSlide2Description || DEFAULT_SLIDES[1].description,
      buttonText: settings.heroSlide2ButtonText || DEFAULT_SLIDES[1].buttonText,
      petImage: settings.heroSlide2PetImage || DEFAULT_SLIDES[1].petImage,
      foodPackImage: settings.heroSlide2FoodPackImage || DEFAULT_SLIDES[1].foodPackImage,
      plateImage: settings.heroSlide2PlateImage || DEFAULT_SLIDES[1].plateImage,
      discountBadge: settings.heroSlide2DiscountBadge || DEFAULT_SLIDES[1].discountBadge,
      headingIcon: settings.heroSlide2HeadingIcon || DEFAULT_SLIDES[1].headingIcon,
    },
  ];

  const slide = slides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative bg-[#F2D70A] overflow-hidden pt-6 sm:pt-10 pb-28 sm:pb-36 min-h-[720px] lg:min-h-[820px] flex items-center">
      {/* Decorative Floating Outline Stickers matching Pettie */}
      {/* Bone outline */}
      <svg
        className="absolute top-1/4 left-4 sm:left-12 w-12 sm:w-16 h-12 sm:h-16 text-[#232121]/30 fill-none stroke-current stroke-2 pointer-events-none -rotate-12"
        viewBox="0 0 100 100"
      >
        <path d="M25,35 C15,35 15,50 25,50 C15,50 15,65 25,65 C32,65 38,60 40,55 L60,55 C62,60 68,65 75,65 C85,65 85,50 75,50 C85,50 85,35 75,35 C68,35 62,40 60,45 L40,45 C38,40 32,35 25,35 Z" />
      </svg>

      {/* Ball outline */}
      <svg
        className="absolute bottom-36 left-20 sm:left-32 w-10 sm:w-14 h-10 sm:h-14 text-[#232121]/30 fill-none stroke-current stroke-2 pointer-events-none"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" />
        <path d="M20,30 Q 50,50 80,30" />
        <path d="M20,70 Q 50,50 80,70" />
      </svg>

      {/* Ball top right */}
      <svg
        className="absolute top-16 right-16 w-12 h-12 text-[#232121]/20 fill-none stroke-current stroke-2 pointer-events-none rotate-45"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" />
        <line x1="15" y1="30" x2="85" y2="70" />
        <line x1="30" y1="85" x2="70" y2="15" />
      </svg>

      {/* Small floating stickers from demo */}
      <div className="absolute top-20 right-1/4 w-12 opacity-30 pointer-events-none hidden md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-small-img-3.png"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* MAIN CONTAINER (Pettie 1280px / 1400px Wide) */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* 1. LEFT ELEMENT: Arch with Pet Popping Out (Col 4) */}
          <div className="lg:col-span-4 flex justify-center order-2 lg:order-1">
            <div className="relative w-64 sm:w-80 h-80 sm:h-[460px] flex items-end justify-center">
              {/* Arch Backdrop Outline / Fill */}
              <div className="absolute inset-x-2 bottom-0 top-12 rounded-t-[180px] bg-[#E8C400]/40 border-4 border-[#E8C400]/80 -z-10 shadow-lg" />
              
              {/* Inner Arch Accent */}
              <div className="absolute inset-x-5 bottom-0 top-16 rounded-t-[160px] bg-[#F7DC2A] -z-10" />

              {/* Pet Image popping out of arch */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.petImage}
                alt={slide.heading2}
                className="w-full h-auto max-h-[500px] object-contain drop-shadow-2xl relative z-10 transition-all duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* 2. CENTER ELEMENT: Heading, Pug in Hat, Underline, Description, Discover Button (Col 4) */}
          <div className="lg:col-span-4 text-center space-y-5 order-1 lg:order-2">
            {/* Top dashes sparkle */}
            <div className="flex justify-center text-[#FF6B35] font-black text-xs tracking-widest">
              \ | /
            </div>

            {/* Main Title Block */}
            <div className="relative inline-block">
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#232121] leading-[1.1] tracking-tight">
                {slide.heading1} <br />
                <span className="relative inline-block mt-1">
                  {slide.heading2}
                  {/* Pettie curved smile underline */}
                  <svg
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-4 text-[#232121]"
                    viewBox="0 0 200 20"
                    fill="none"
                  >
                    <path
                      d="M10,5 Q100,20 190,5"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Little Pug in Green Top Hat sticker floating right next to heading */}
              <div className="absolute -top-6 -right-10 sm:-right-14 w-12 sm:w-16 h-auto pointer-events-none hidden sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.headingIcon}
                  alt=""
                  className="w-full h-auto object-contain animate-bounce"
                  style={{ animationDuration: '3s' }}
                />
              </div>
            </div>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-[#232121]/90 font-normal max-w-md mx-auto pt-2 leading-relaxed">
              {slide.description}
            </p>

            {/* Orange DISCOVER button matching Pettie exact padding 12px 42px */}
            <div className="pt-3">
              <a
                href="#products-section"
                className="pettie-btn pettie-btn-primary text-sm shadow-lg shadow-[#FF6B35]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <span>{slide.buttonText || 'discover'}</span>
              </a>
            </div>
          </div>

          {/* 3. RIGHT ELEMENT: Food Pack in Yellow Bowl with Cyan Badge (Col 4) */}
          <div className="lg:col-span-4 flex justify-center order-3 relative">
            <div className="relative w-72 sm:w-96 flex flex-col items-center">
              {/* Cyan Starburst Discount Badge floating on top right */}
              <div className="absolute -top-4 right-0 sm:right-4 z-20 w-24 sm:w-28 h-auto select-none pointer-events-none drop-shadow-xl animate-pulse">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.discountBadge}
                  alt="Discount Up to 20%"
                  className="w-full h-auto"
                />
              </div>

              {/* Food Pack Bag */}
              <div className="relative z-10 w-48 sm:w-64 mb-[-40px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.foodPackImage}
                  alt="Pet Food Pack"
                  className="w-full h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Yellow Plate / Bowl with Kibble */}
              <div className="relative z-1 w-full max-w-[340px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.plateImage}
                  alt="Food Bowl"
                  className="w-full h-auto object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Slider Controls / Dots Bottom Center */}
      <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === i
                ? 'w-8 h-2.5 bg-[#FF6B35] shadow-md'
                : 'w-2.5 h-2.5 bg-[#232121]/30 hover:bg-[#232121]/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 hover:bg-white text-[#232121] flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 focus:outline-none hidden sm:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 hover:bg-white text-[#232121] flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 focus:outline-none hidden sm:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Smooth Organic Wave Divider transitioning into white section */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-20 text-white fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
}
