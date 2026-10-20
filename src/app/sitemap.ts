import type { MetadataRoute } from 'next';
import { getMergedProducts, getArticles, getStoreSettings } from '@/lib/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, products, articles] = await Promise.all([
    getStoreSettings(),
    getMergedProducts(),
    getArticles({ status: 'published' }),
  ]);

  const siteUrl =
    settings.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://momothecat.vercel.app';

  // Only retail products have dedicated storefront pages
  const productEntries: MetadataRoute.Sitemap = products
    .filter((product) => product.type === 'real')
    .map((product) => ({
      url: `${siteUrl}/product/${product._id}`,
      lastModified: product.createdAt ? new Date(product.createdAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt
      ? new Date(article.updatedAt)
      : new Date(article.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleEntries,
    ...productEntries,
  ];
}
