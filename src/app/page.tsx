import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { getMergedProducts, getStoreSettings } from '@/lib/store';
import { headers, cookies } from 'next/headers';

export const revalidate = 0; // Fresh dynamic data on every request

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    filter?: string;
    view?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const [params, headerList, cookieStore] = await Promise.all([
    searchParams,
    headers(),
    cookies(),
  ]);

  const category = params?.category || 'All Products';
  const search = params?.search || '';
  const filter = params?.filter || 'all';
  const view = params?.view || '';

  const vercelCountry = headerList.get('x-vercel-ip-country');
  const cookieCountry = cookieStore.get('user_country')?.value;
  const serverCountry = (cookieCountry || vercelCountry || 'US').toUpperCase();

  const [products, rawSettings] = await Promise.all([
    getMergedProducts(),
    getStoreSettings(),
  ]);

  const settings = JSON.parse(JSON.stringify(rawSettings));

  return (
    <div className="w-full">
      {/* Homepage Sections Manager (Dynamic Show/Hide and Order via Shopify CMS) */}
      <ProductGrid
        initialProducts={products}
        activeCategory={category}
        searchQuery={search}
        activeFilter={filter}
        initialView={view}
        storeMode={settings.storeMode}
        serverSettings={settings}
        serverCountry={serverCountry}
      />
    </div>
  );
}
