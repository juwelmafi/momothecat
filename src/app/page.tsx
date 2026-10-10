import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import ProductGrid from '@/components/ProductGrid';
import { getMergedProducts, getStoreSettings } from '@/lib/store';

export const revalidate = 0; // Fresh dynamic data on every request

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    filter?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params?.category || 'All Products';
  const search = params?.search || '';
  const filter = params?.filter || 'all';

  const [products, settings] = await Promise.all([
    getMergedProducts(),
    getStoreSettings(),
  ]);

  return (
    <div className="space-y-6">
      {/* Hero Section inspired by Pettie Demo */}
      <HeroBanner />

      {/* Dynamic Products Grid with Filter Toolbar */}
      <ProductGrid
        initialProducts={products}
        activeCategory={category}
        searchQuery={search}
        activeFilter={filter}
        storeMode={settings.storeMode}
      />
    </div>
  );
}
