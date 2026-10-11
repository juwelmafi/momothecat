'use client';

import { ExternalLink, Heart, MessageCircle, Sparkles, CheckCircle2, Camera } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

interface InstagramPost {
  id: string;
  image: string;
  likes: string;
  comments: string;
  caption: string;
  tag: string;
  link: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    likes: '3,420',
    comments: '142',
    caption: 'Momo testing the automated laser chaser robot! High-speed zoomies in full effect. Link in bio!',
    tag: '#AmazonFinds #CatToys',
    link: 'https://www.instagram.com',
  },
  {
    id: 'post-2',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    likes: '4,890',
    comments: '215',
    caption: '10/10 nap score in the orthopedic donut cloud bed. Sound asleep for 4 hours straight.',
    tag: '#CozyCat #DeepSleep',
    link: 'https://www.instagram.com',
  },
  {
    id: 'post-3',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    likes: '2,780',
    comments: '98',
    caption: 'King of the castle atop the 60-inch natural sisal scratching tower! Curtains are officially safe.',
    tag: '#SisalCatTree #FelineKing',
    link: 'https://www.instagram.com',
  },
  {
    id: 'post-4',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    likes: '5,120',
    comments: '340',
    caption: 'Hydration check! Fresh triple-filtered flowing water hits different. Never seen him drink so much.',
    tag: '#CatFountain #HealthyCats',
    link: 'https://www.instagram.com',
  },
  {
    id: 'post-5',
    image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80',
    likes: '3,910',
    comments: '164',
    caption: 'Caught mid-pounce with the organic catnip avocado ball! The intensity in those eyes.',
    tag: '#CatnipMadness #Playtime',
    link: 'https://www.instagram.com',
  },
  {
    id: 'post-6',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
    likes: '4,230',
    comments: '188',
    caption: 'Cozy Sunday morning basking in the suction window hammock watching backyard birds.',
    tag: '#WindowPerch #SundayMood',
    link: 'https://www.instagram.com',
  },
];

export default function InstagramFeed() {
  return (
    <section id="instagram-section" className="py-16 sm:py-24 bg-white relative">
      <div className="pettie-container">
        
        {/* Section Heading matching Pettie Theme */}
        <div className="text-center mb-10 sm:mb-12 space-y-2">
          <div className="text-[#FF6B35] font-black text-sm tracking-widest uppercase">
            \\ | /
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#232121]">
            Follow Momo on Instagram
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">
            Daily kitten antics, product unboxings, real customer pet spotlights, and secret Amazon deal drops
          </p>
        </div>

        {/* Profile Card Header */}
        <div className="max-w-2xl mx-auto mb-10 bg-[#FBF9F7] rounded-[24px] p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Avatar with Instagram gradient border */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#FFC312] via-[#FF6B35] to-[#D62976] shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner text-[#FF6B35]">
                <Camera className="w-6 h-6 text-[#FF6B35]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#232121]">
                  @momothecat_official
                </h3>
                <span className="bg-[#2FA5FB] text-white rounded-full p-0.5" title="Verified">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Momo The Cat • Daily Feline Joy & Amazon Finds
              </p>
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold text-[#232121] mt-1">
                <span><strong className="text-[#FF6B35]">430</strong> Posts</span>
                <span>•</span>
                <span><strong className="text-[#FF6B35]">28.4K</strong> Followers</span>
                <span>•</span>
                <span><strong className="text-[#FF6B35]">100%</strong> Cuteness</span>
              </div>
            </div>
          </div>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pettie-btn pettie-btn-primary text-[10px] sm:text-xs shadow-md shadow-[#FF6B35]/25 flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-all shrink-0 py-1.5 sm:py-2.5 px-3 sm:px-6"
          >
            <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        {/* 6 Instagram Post Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-[20px] overflow-hidden bg-slate-100 shadow-2xs border border-slate-200/80 block cursor-pointer"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt="Instagram post by Momo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Tag pill on top-left */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full group-hover:opacity-0 transition-opacity">
                {post.tag.split(' ')[0]}
              </div>

              {/* Instagram Icon top-right */}
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#232121] group-hover:opacity-0 transition-opacity">
                <InstagramIcon className="w-3.5 h-3.5 fill-[#FF6B35]" />
              </div>

              {/* Hover Dark Overlay with Stats & Caption */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#FF6B35] text-[#FF6B35]" />
                    <span className="text-[11px]">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                    <span className="text-[11px]">{post.comments}</span>
                  </div>
                </div>

                <p className="text-[10px] text-white/90 leading-tight line-clamp-3 my-auto">
                  {post.caption}
                </p>

                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#FFC312] uppercase tracking-wider">
                  <span>View Post</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Community Tag Callout */}
        <div className="mt-10 text-center">
          <p className="text-xs sm:text-sm text-[#555555]">
            Tag <strong className="text-[#FF6B35] font-bold">#MomoTheCat</strong> on your posts to be featured on our storefront!
          </p>
        </div>

      </div>
    </section>
  );
}
