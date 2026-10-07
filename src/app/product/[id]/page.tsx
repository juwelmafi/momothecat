import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getMergedProducts } from '@/lib/store';
import { RealProduct, AffiliateProduct } from '@/lib/types';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Related products from same category
  const allProducts = await getMergedProducts();
  const relatedProducts = allProducts
    .filter((p) => p._id !== id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="space-y-12 py-4">
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
  );
}
