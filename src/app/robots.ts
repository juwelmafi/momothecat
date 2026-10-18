import type { MetadataRoute } from 'next';
import { getStoreSettings } from '@/lib/store';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getStoreSettings();
  const siteUrl =
    settings.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://momothecat.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/checkout', '/order-confirmation/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/checkout', '/order-confirmation/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
