import type { Metadata } from 'next';
import { Fredoka, Readex_Pro } from 'next/font/google';
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
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
    title,
    description,
    keywords,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    authors: [{ name: settings.brandName || 'Momo - The Cat' }],
    openGraph: {
      title,
      description,
      type: 'website',
      images: settings.websiteLogo ? [settings.websiteLogo] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, headerList, cookieStore] = await Promise.all([
    getStoreSettings(),
    headers(),
    cookies(),
  ]);

  const vercelCountry = headerList.get('x-vercel-ip-country');
  const cookieCountry = cookieStore.get('user_country')?.value;
  const initialCountry = (cookieCountry || vercelCountry || 'US').toUpperCase();

  return (
    <html lang="en" className={`${fredoka.variable} ${readexPro.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-[#000000] antialiased selection:bg-[#FF6B35] selection:text-white">
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
