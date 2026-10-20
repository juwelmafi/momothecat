import type { Metadata } from 'next';
import { Fredoka, Readex_Pro, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import Toast from '@/components/Toast';
import { headers, cookies } from 'next/headers';
import { getStoreSettings } from '@/lib/store';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
});

const readexPro = Readex_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-readex',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

import Script from 'next/script';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const siteUrl =
    settings.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://momothecat.vercel.app';
  const title = settings.metaTitle || 'Momo - The Cat | Amazon Affiliate Cat Store & Boutique';
  const description =
    settings.metaDescription ||
    'Fresh Flavoured Cat Food & Toys. Discover top-rated Amazon Prime essentials and handcrafted Momo Originals.';
  const keywords = settings.metaKeywords
    ? settings.metaKeywords.split(',').map((k) => k.trim())
    : ['cat toys', 'cat food', 'cat scratchers', 'cat beds', 'Momo the cat'];
  const favicon =
    settings.websiteFavicon ||
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/cropped-favicon-32x32.png';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: '%s | Momo - The Cat',
    },
    description,
    keywords,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    authors: [{ name: settings.brandName || 'Momo - The Cat' }],
    alternates: {
      canonical: '/',
    },
    verification: {
      google: settings.googleSiteVerification || undefined,
      other: settings.bingSiteVerification
        ? { 'msvalidate.01': settings.bingSiteVerification }
        : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.brandName || 'Momo - The Cat',
      type: 'website',
      images: settings.openGraphDefaultImage
        ? [{ url: settings.openGraphDefaultImage }]
        : settings.websiteLogo
        ? [{ url: settings.websiteLogo }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: settings.openGraphDefaultImage
        ? [settings.openGraphDefaultImage]
        : settings.websiteLogo
        ? [settings.websiteLogo]
        : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rawSettings, headerList, cookieStore] = await Promise.all([
    getStoreSettings(),
    headers(),
    cookies(),
  ]);

  const settings = JSON.parse(JSON.stringify(rawSettings));

  const vercelCountry = headerList.get('x-vercel-ip-country');
  const cookieCountry = cookieStore.get('user_country')?.value;
  const initialCountry = (cookieCountry || vercelCountry || 'US').toUpperCase();

  return (
    <html lang="en" className={`${fredoka.variable} ${readexPro.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-[#000000] antialiased selection:bg-[#FF6B35] selection:text-white">
        {settings.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <CartProvider
          initialStoreMode={settings.storeMode}
          initialSettings={settings}
          initialCountry={initialCountry}
        >
          <Header />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <QuickViewModal />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
