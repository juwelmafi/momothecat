'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const TESTIMONIALS = [
  {
    image: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-1.jpg',
    quote: 'We ordered the interactive chirping laser ball and the orthopedic donut bed through Momo’s Amazon recommendations. Arrived next day with Prime and our indoor cats are obsessed! Truly top-rated products.',
    name: 'Jaden - Cat Lover',
    role: 'Verified Amazon Buyer',
  },
  {
    image: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-2.jpg',
    quote: 'Momo The Cat has the highest quality organic treats and interactive toys! Fast Amazon Prime delivery and outstanding support.',
    name: 'Sarah - Pet Parent',
    role: 'Verified Buyer',
  },
  {
    image: 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-3.jpg',
    quote: 'The stainless steel water fountain and cactus scratching tree saved our furniture. Our cats drink twice as much water now. Highly recommended!',
    name: 'Michael - Cat Enthusiast',
    role: 'Verified Buyer',
  },
];

export default function TestimonialsSection() {
  const { settings } = useCart();
  const [current, setCurrent] = useState(0);
  const t = TESTIMONIALS[current];

  return (
    <section id="testimonials-section" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="pettie-container">
        
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase mb-1">
            \ | /
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
            {settings.testimonialsHeading || 'Views Of Our Happy Customers'}
          </h2>
        </div>

        {/* Testimonial Content: 2-Column */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
          
          {/* Left Column: Customer Portrait with line art pet outline */}
          <div className="md:col-span-5 flex justify-center relative">
            <div className="relative w-60 h-60 sm:w-72 sm:h-72">
              {/* Outer arch/circle */}
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative line art pet outline beside portrait */}
              <div className="absolute -bottom-4 -left-4 w-16 h-16 pointer-events-none select-none hidden sm:block">
                <svg
                  className="w-full h-full text-[#232121] stroke-current fill-none stroke-2"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="30" />
                  <path d="M30,30 Q 50,15 70,30" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Stars, Quote, Name, Role, Dots */}
          <div className="md:col-span-7 space-y-5 text-center md:text-left relative">
            {/* Watermark Quote Icon */}
            <span className="absolute -top-6 right-4 text-7xl font-serif text-[#ECECEC] select-none pointer-events-none -z-10">
              “
            </span>

            {/* 5 Stars */}
            <div className="flex items-center justify-center md:justify-start gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FFC312] text-[#FFC312]" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="text-sm sm:text-base text-[#444444] leading-relaxed font-normal">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div>
              <h4 className="font-display font-bold text-lg text-[#232121]">
                {t.name}
              </h4>
              <p className="text-xs text-[#777777] font-medium mt-0.5">
                {t.role}
              </p>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center justify-center md:justify-start gap-2.5 pt-3">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    current === i ? 'bg-[#232121] scale-125' : 'bg-[#FF6B35]'
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
