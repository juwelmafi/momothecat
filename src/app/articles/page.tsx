import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticles, getStoreSettings } from '@/lib/store';
import { ARTICLE_CATEGORIES } from '@/lib/initialData';
import { BookOpen, Sparkles, Clock, Calendar, ArrowRight, Search, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://momothecat.vercel.app';
  const title = settings.articlesMetaTitle || 'Cat Care Guides, Tips & Product Reviews | Momo The Cat';
  const description =
    settings.articlesMetaDescription ||
    'Explore expert cat product reviews, tested toys, health tips, and buyer guides curated to keep indoor cats healthy, active, and playful.';

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/articles`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/articles`,
      type: 'website',
      images: settings.openGraphDefaultImage
        ? [{ url: settings.openGraphDefaultImage, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeCategory = params.category || 'All Guides';
  const searchQuery = params.search || '';

  const [articles, settings] = await Promise.all([
    getArticles({
      category: activeCategory,
      status: 'published',
      search: searchQuery,
    }),
    getStoreSettings(),
  ]);

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const remainingArticles = featuredArticle
    ? articles.filter((a) => a._id !== featuredArticle._id)
    : articles;

  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://momothecat.vercel.app';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Momo The Cat - Guides, Tips & Product Reviews',
    description:
      'Curated buyer guides, tested pet product reviews, and feline health tips to save money and keep indoor cats happy.',
    url: `${siteUrl}/articles`,
    publisher: {
      '@type': 'Organization',
      name: 'Momo - The Cat',
      logo: {
        '@type': 'ImageObject',
        url: settings.websiteLogo,
      },
    },
  };

  return (
    <div className="w-full bg-[#FCFBF9] min-h-screen py-8 sm:py-12 article-reader font-standard">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#232121] via-[#2F2B2B] to-[#1C1A1A] p-8 sm:p-14 text-white overflow-hidden shadow-xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FFC312]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#FFC312] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Expert Feline Knowledge Hub</span>
            </div>

            <h1 className="font-standard font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
              Cat Care Guides, Tips & Product Reviews
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Honest, tested Amazon product reviews, veterinary health guides, and enrichment tips
              specifically crafted to keep your indoor cats playful, calm, and thriving.
            </p>

            {/* Search Input */}
            <form method="GET" action="/articles" className="pt-3 max-w-md">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search articles, guides, or products..."
                  className="w-full pl-11 pr-24 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 rounded-2xl text-xs sm:text-sm font-medium border border-white/20 focus:border-[#FF6B35] outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-3.5 py-1.5 bg-[#FF6B35] hover:bg-[#FF854D] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ARTICLE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={cat === 'All Guides' ? '/articles' : `/articles?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-2xs ${
                  isActive
                    ? 'bg-[#FF6B35] text-white shadow-orange-500/25 scale-[1.02]'
                    : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-[#FF6B35] border border-slate-200/80'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Featured Article Card */}
        {featuredArticle && !searchQuery && activeCategory === 'All Guides' && (
          <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:h-[420px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-500 font-medium">
                  <span className="text-[#FF6B35] font-semibold whitespace-nowrap">{featuredArticle.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-400 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <Link href={`/articles/${featuredArticle.slug}`}>
                  <h2 className="font-standard font-bold text-2xl sm:text-3xl text-slate-900 hover:text-[#FF6B35] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed font-normal">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs sm:text-sm font-medium text-slate-500">
                    By {featuredArticle.author}
                  </span>
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF6B35] hover:text-[#e04c00] group/link"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-standard font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Articles & Reviews'}
            </h2>
            <span className="text-xs sm:text-sm font-medium text-slate-400">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-standard font-bold text-lg text-slate-800">No articles found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn&apos;t find any articles matching your query. Try browsing all guides or searching for another keyword.
              </p>
              <Link
                href="/articles"
                className="inline-block px-5 py-2.5 bg-[#FF6B35] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(searchQuery || activeCategory !== 'All Guides' ? articles : remainingArticles).map(
                (article) => (
                  <article
                    key={article._id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    <Link
                      href={`/articles/${article.slug}`}
                      className="relative aspect-[16/10] overflow-hidden bg-slate-100 block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] sm:text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-xs">
                          {article.category}
                        </span>
                      </div>
                    </Link>

                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400 font-medium">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                            {article.readTime}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <Link href={`/articles/${article.slug}`}>
                          <h3 className="font-standard font-bold text-lg sm:text-xl text-slate-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-slate-400">
                          {article.author}
                        </span>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#FF6B35] hover:text-[#e04c00]"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>

        {/* Affiliate Disclosure Guarantee Box */}
        <div className="rounded-2xl bg-orange-50/70 border border-orange-100 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <ShieldCheck className="w-8 h-8 text-[#FF6B35] shrink-0" />
          <div className="space-y-1">
            <h4 className="font-standard font-bold text-sm sm:text-base text-slate-900">
              Editorial Transparency & Affiliate Disclosure
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Momo The Cat participates in the Amazon Services LLC Associates Program. Every guide,
              review, and comparison is written with editorial independence. Outbound product links
              earn a modest commission that funds our testing at zero additional cost to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
