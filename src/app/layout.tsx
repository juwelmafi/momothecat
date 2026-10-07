import type { Metadata } from 'next';
import { Fredoka, Readex_Pro } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import Toast from '@/components/Toast';

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

export const metadata: Metadata = {
  title: 'Momo - The Cat | Amazon Affiliate Cat Store & Boutique',
  description:
    'Fresh Flavoured Cat Food & Toys. Discover top-rated Amazon Prime essentials and handcrafted Momo Originals.',
  keywords: [
    'cat toys',
    'cat food',
    'cat scratchers',
    'cat beds',
    'Pettie pet theme',
    'Amazon affiliate cat products',
    'Momo the cat',
  ],
  authors: [{ name: 'Momo - The Cat' }],
  openGraph: {
    title: 'Momo - The Cat | Pettie Cat Boutique',
    description: 'Fresh Flavoured Cat Food & Royalty-Grade Feline Comfort.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${readexPro.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-[#000000] antialiased selection:bg-[#FF6B35] selection:text-white">
        <CartProvider>
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
