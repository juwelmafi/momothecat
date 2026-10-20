import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getArticleBySlug,
  getArticles,
  getStoreSettings,
  getProductById,
} from '@/lib/store';
import {
  ChevronRight,
  Clock,
  Calendar,
  Eye,
  ExternalLink,
  ShieldCheck,
  Star,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Momo - The Cat',
      description: 'The requested cat guide or article could not be found.',
    };
  }

  const settings = await getStoreSettings();
  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://momothecat.vercel.app';
  const pageUrl = `${siteUrl}/articles/${article.slug}`;

  const title = article.metaTitle || `${article.title} | Momo The Cat`;
  const description =
    article.metaDescription ||
    (article.excerpt && article.excerpt.length > 155
      ? `${article.excerpt.slice(0, 152)}...`
      : article.excerpt);

  const keywords = article.metaKeywords
    ? article.metaKeywords.split(',').map((k) => k.trim())
    : article.tags;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: article.canonicalUrl || pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author],
      images: [{ url: article.coverImage, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.coverImage],
    },
  };
}

// Markdown Inline Formatter for Article Content (bold, italic, links)
function renderInline(text: string): React.ReactNode {
  if (!text) return null;
  // Match **bold**, *italic*, or [label](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={`i-${match.index}`} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const closeBracket = token.indexOf('](');
      const label = token.slice(1, closeBracket);
      const url = token.slice(closeBracket + 2, -1);
      parts.push(
        <a
          key={`a-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF6B35] underline underline-offset-2 hover:text-[#e04c00] font-semibold"
        >
          {label}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Markdown Block Formatter with Standard, Highly Readable Typography
function renderFormattedContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: number) => {
    if (inTable) {
      elements.push(
        <div key={`table-${key}`} className="my-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead className="bg-[#FFF4EE] border-b border-orange-200/80 text-slate-900 font-bold font-standard">
              <tr>
                {tableHeader.map((h, hi) => (
                  <th key={hi} className="px-5 py-3.5 font-bold text-slate-900 tracking-tight">
                    {renderInline(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tableRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-orange-50/30 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-5 py-3.5 text-slate-700 leading-normal">
                      {renderInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Table rows: | Col 1 | Col 2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Divider row: |:---|:---|
      if (cells.every((c) => c.replace(/[:-]/g, '') === '')) {
        return;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable(index);
    }

    // Headings
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={index}
          className="font-standard font-bold text-2xl sm:text-3xl text-slate-900 mt-10 mb-4 pt-3 tracking-tight border-b border-slate-100 pb-2 leading-snug"
        >
          {renderInline(trimmed.replace('## ', ''))}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={index}
          className="font-standard font-bold text-xl sm:text-2xl text-slate-900 mt-8 mb-3 tracking-tight leading-snug"
        >
          {renderInline(trimmed.replace('### ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4
          key={index}
          className="font-standard font-semibold text-lg sm:text-xl text-slate-900 mt-6 mb-2 tracking-tight"
        >
          {renderInline(trimmed.replace('#### ', ''))}
        </h4>
      );
    } else if (trimmed.startsWith('> ')) {
      // Blockquote / Vet Tip
      elements.push(
        <blockquote
          key={index}
          className="my-6 p-5 sm:p-6 rounded-2xl bg-amber-50/80 border-l-4 border-[#FF6B35] text-base sm:text-lg text-slate-800 leading-relaxed font-medium shadow-xs"
        >
          {renderInline(trimmed.replace('> ', ''))}
        </blockquote>
      );
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      // List item
      elements.push(
        <li key={index} className="text-base sm:text-lg text-slate-700 leading-relaxed sm:leading-8 my-2.5 ml-6 list-disc marker:text-[#FF6B35] pl-1">
          {renderInline(trimmed.replace(/^(\*|-)\s+/, ''))}
        </li>
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      // Ordered list item
      elements.push(
        <li key={index} className="text-base sm:text-lg text-slate-700 leading-relaxed sm:leading-8 my-2.5 ml-6 list-decimal marker:text-[#FF6B35] marker:font-bold pl-1">
          {renderInline(trimmed.replace(/^\d+\.\s+/, ''))}
        </li>
      );
    } else if (trimmed === '---') {
      elements.push(<hr key={index} className="my-10 border-slate-200" />);
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={index} className="text-base sm:text-lg text-slate-700 leading-relaxed sm:leading-[1.8] my-4 font-normal">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  if (inTable) {
    flushTable(lines.length);
  }

  return elements;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [settings, relatedArticles, affiliateProduct] = await Promise.all([
    getStoreSettings(),
    getArticles({ category: article.category, limit: 3 }),
    article.affiliateProductId ? getProductById(article.affiliateProductId) : null,
  ]);

  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://momothecat.vercel.app';
  const pageUrl = `${siteUrl}/articles/${article.slug}`;

  // Direct affiliate destination link
  const affLink =
    article.affiliateProductUrl ||
    (affiliateProduct && affiliateProduct.type === 'affiliate'
      ? (affiliateProduct as any).affiliateLink
      : '#');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Momo - The Cat',
      logo: {
        '@type': 'ImageObject',
        url: settings.websiteLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${siteUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: `${siteUrl}/articles?category=${encodeURIComponent(article.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="w-full bg-[#FCFBF9] min-h-screen py-6 sm:py-10 article-reader font-standard">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-[#FF6B35] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <Link href="/articles" className="hover:text-[#FF6B35] transition-colors">
            Articles
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <Link
            href={`/articles?category=${encodeURIComponent(article.category)}`}
            className="hover:text-[#FF6B35] transition-colors text-slate-700"
          >
            {article.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4EE] text-[#FF6B35] border border-orange-200/80 text-[11px] sm:text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
              {article.category}
            </span>
            {article.isFeatured && (
              <span className="bg-amber-100 text-amber-800 text-[11px] sm:text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Featured Guide
              </span>
            )}
          </div>

          <h1 className="font-standard font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.2]">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          <div className="pt-2 pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800">By {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                {article.readTime}
              </span>
            </div>

            {article.views !== undefined && article.views > 0 && (
              <div className="flex items-center gap-1 text-slate-400 font-medium">
                <Eye className="w-3.5 h-3.5" />
                <span>{article.views} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top FTC Affiliate Disclosure Notice */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 sm:p-5 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Affiliate Disclosure:</strong> When you purchase through links in this review,
            Momo The Cat may earn an Amazon Associate commission at zero additional cost to you.
            Our reviews are independently tested based on durability, feline health, and safety standards.
          </p>
        </div>

        {/* Main Content Body */}
        <article className="article-reader article-prose font-standard bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/80 shadow-xs">
          {renderFormattedContent(article.content)}
        </article>

        {/* High-Converting Affiliate Product Callout Box */}
        {(affiliateProduct || article.affiliateProductUrl) && (
          <div className="rounded-3xl bg-gradient-to-br from-[#FFF8F3] to-[#FFF1E8] border-2 border-orange-200 p-6 sm:p-8 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Recommended Product
              </span>
              <span className="text-xs font-bold text-slate-500">
                Prime Delivery Eligible
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {affiliateProduct && (
                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden bg-white border border-orange-100 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      affiliateProduct.type === 'real'
                        ? (affiliateProduct as any).images?.[0]
                        : (affiliateProduct as any).imageUrl
                    }
                    alt={affiliateProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <h3 className="font-standard font-bold text-lg sm:text-xl text-slate-900">
                  {affiliateProduct ? affiliateProduct.name : article.title}
                </h3>
                {affiliateProduct && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {affiliateProduct.rating} / 5.0
                    </span>
                    <span className="text-xs text-slate-400">
                      ({affiliateProduct.reviewCount} customer reviews)
                    </span>
                  </div>
                )}
                {affiliateProduct && (
                  <div className="text-xl font-black text-slate-900 pt-1">
                    ${affiliateProduct.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={affLink}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#FF6B35] hover:bg-[#e04c00] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01]"
              >
                <span>{article.affiliateProductCtaText || 'Check Latest Price on Amazon'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {affiliateProduct && affiliateProduct.type === 'real' && (
                <Link
                  href={`/product/${affiliateProduct._id}`}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:text-[#FF6B35] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Full Product Specs</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs sm:text-sm font-bold text-slate-400">Tags:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.filter((a) => a._id !== article._id).length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <h3 className="font-standard font-bold text-xl sm:text-2xl text-slate-900">
              More Guides in {article.category}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedArticles
                .filter((a) => a._id !== article._id)
                .slice(0, 2)
                .map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/articles/${rel.slug}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold text-[#FF6B35] uppercase">
                        {rel.readTime}
                      </span>
                      <h4 className="font-standard font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#FF6B35] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Return Button */}
        <div className="pt-4 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#FF6B35] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Guides & Reviews</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
