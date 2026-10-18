import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import { getProductById, getMergedProducts, getStoreSettings } from '@/lib/store';
import { RealProduct, AffiliateProduct } from '@/lib/types';
import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested cat product could not be found.',
    };
  }

  const settings = await getStoreSettings();
  const siteUrl =
    settings.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://momothecat.vercel.app';
  const pageUrl = `${siteUrl}/product/${product._id}`;
  const image =
    product.type === 'real'
      ? (product as RealProduct).images?.[0]
      : (product as AffiliateProduct).imageUrl;

  const title = `${product.name} | Cat Essentials & Reviews`;
  const description =
    product.description && product.description.length > 155
      ? `${product.description.slice(0, 152)}...`
      : product.description || 'Discover top-rated cat essentials and Amazon Prime picks on Momo The Cat.';

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Affiliate products do not have local product detail pages; redirect to the real merchant product page
  if (product.type !== 'real') {
    const aff = product as AffiliateProduct;
    const [headerList, cookieStore] = await Promise.all([headers(), cookies()]);
    const vercelCountry = headerList.get('x-vercel-ip-country');
    const cookieCountry = cookieStore.get('user_country')?.value;
    const country = (cookieCountry || vercelCountry || 'US').toUpperCase();
    const isBD = country === 'BD';

    const isDaraz = aff.platform === 'daraz' || (aff.platform === 'both' && isBD);
    const targetUrl = isDaraz
      ? (aff.darazLink || aff.affiliateLink || '/')
      : (aff.affiliateLink || aff.darazLink || '/');

    redirect(targetUrl);
  }

  const settings = await getStoreSettings();
  const siteUrl =
    settings.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://momothecat.vercel.app';
  const pageUrl = `${siteUrl}/product/${product._id}`;
  const realProd = product as RealProduct;
  const image = realProd.images?.[0];

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: image ? [image] : undefined,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Momo - The Cat',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Momo - The Cat',
      },
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
        name: product.category,
        item: `${siteUrl}/?category=${encodeURIComponent(product.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: pageUrl,
      },
    ],
  };

  // Related products from same category (only retail products for internal linking)
  const allProducts = await getMergedProducts();
  const relatedProducts = allProducts
    .filter((p) => p._id !== id && p.type === 'real' && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="w-full bg-[#FCFBF9] min-h-screen py-8 sm:py-12">
      <div className="pettie-container space-y-10 sm:space-y-12">
        {/* Schema.org JSON-LD for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:text-orange-600 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Client Interactive Section */}
        <ProductDetailClient product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-orange-100/70 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                You Might Also Love
              </h2>
              <Link
                href={`/?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
              >
                Explore more in {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
