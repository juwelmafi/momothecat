'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RealProduct, MergedProduct, StoreMode, StoreSettings } from '@/lib/types';
import { INITIAL_SETTINGS } from '@/lib/initialData';

export interface CartItem {
  product: RealProduct;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: RealProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  shippingFee: number;
  discountCode: string;
  discountPercent: number;
  discountAmount: number;
  total: number;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  // Quick View
  quickViewProduct: MergedProduct | null;
  setQuickViewProduct: (product: MergedProduct | null) => void;
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Storefront Architecture Mode & Full Content Settings
  storeMode: StoreMode;
  setStoreMode: (mode: StoreMode) => void;
  settings: StoreSettings;
  setSettings: (s: StoreSettings) => void;
  // Geo-Targeting: Bangladesh (Daraz) vs Global (Amazon)
  userCountry: string;
  isBD: boolean;
  setUserCountry: (country: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  initialStoreMode = 'hybrid',
  initialSettings = INITIAL_SETTINGS,
  initialCountry = 'US',
}: {
  children: React.ReactNode;
  initialStoreMode?: StoreMode;
  initialSettings?: StoreSettings;
  initialCountry?: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<MergedProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [storeMode, setStoreMode] = useState<StoreMode>(initialSettings?.storeMode || initialStoreMode);
  const [userCountry, setUserCountryState] = useState<string>(initialCountry);

  const isBD = userCountry.toUpperCase() === 'BD';

  const setUserCountry = (country: string) => {
    const clean = country.toUpperCase();
    setUserCountryState(clean);
    try {
      localStorage.setItem('momo_country', clean);
      fetch('/api/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: clean }),
      }).catch(() => {});
    } catch {}
    if (clean === 'BD') {
      showToast('Switched to Bangladesh 🇧🇩 — Showing Daraz affiliate picks!');
    } else {
      showToast('Switched to Global 🌐 — Showing Amazon affiliate picks!');
    }
  };

  // Sync settings & mode on mount
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
          if (data.settings.storeMode) {
            setStoreMode(data.settings.storeMode);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Detect and sync country on mount
  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem('momo_country');
      if (savedCountry) {
        setUserCountryState(savedCountry.toUpperCase());
        return;
      }

      // Check timezone for Bangladesh detection in browser / local dev
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timeZone.includes('Dhaka') || timeZone.includes('Bangladesh')) {
        setUserCountryState('BD');
        localStorage.setItem('momo_country', 'BD');
        return;
      }

      // Query geo api for edge Vercel header
      fetch('/api/geo')
        .then((res) => res.json())
        .then((data) => {
          if (data?.country) {
            setUserCountryState(data.country.toUpperCase());
          }
        })
        .catch(() => {});
    } catch {}
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('momo_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('momo_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedDiscount = localStorage.getItem('momo_discount');
      if (savedDiscount) {
        const d = JSON.parse(savedDiscount);
        setDiscountCode(d.code);
        setDiscountPercent(d.percent);
      }
    } catch (e) {
      console.error('Failed to load persisted state:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('momo_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('momo_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const addToCart = (product: RealProduct, quantity = 1) => {
    if (storeMode === 'affiliate_only') {
      showToast('Store is currently in Affiliate Mode. In-house cart is disabled.');
      return;
    }

    if (product.stockQuantity <= 0) {
      showToast(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        const newQty = Math.min(product.stockQuantity, existing.quantity + quantity);
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stockQuantity, quantity) }];
    });

    showToast(`Added "${product.name}" to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          const max = item.product.stockQuantity || 99;
          return { ...item, quantity: Math.min(quantity, max) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('momo_cart');
  };

  const applyDiscount = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MOMO10' || clean === 'PETTIE10' || clean === 'CATLOVE') {
      setDiscountCode(clean);
      setDiscountPercent(10);
      localStorage.setItem('momo_discount', JSON.stringify({ code: clean, percent: 10 }));
      showToast('10% Discount Code Applied!');
      return true;
    }
    showToast('Invalid promo code');
    return false;
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountPercent(0);
    localStorage.removeItem('momo_discount');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to favorites');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 45;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 4.99;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        freeShippingThreshold,
        shippingFee,
        discountCode,
        discountPercent,
        discountAmount,
        total,
        applyDiscount,
        removeDiscount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
        storeMode,
        setStoreMode,
        settings,
        setSettings,
        userCountry,
        isBD,
        setUserCountry,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
