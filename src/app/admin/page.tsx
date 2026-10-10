'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Users,
  Sliders,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  Truck,
  Flame,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Search,
  Check,
  Tag,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Key,
  Pencil,
} from 'lucide-react';
import {
  MergedProduct,
  AffiliateProduct,
  RealProduct,
  Order,
  Lead,
  StoreSettings,
} from '@/lib/types';
import { CATEGORIES } from '@/lib/initialData';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'leads' | 'phase2'>('inventory');
  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter in Admin
  const [productSearch, setProductSearch] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<'all' | 'affiliate' | 'real'>('all');

  // Add/Edit Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProductType, setNewProductType] = useState<'affiliate' | 'real'>('affiliate');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form Fields
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Cat Toys',
    description: '',
    badge: "Amazon's Choice",
    isFeatured: false,
    // Affiliate specific
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
    // Real specific
    images: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    stockQuantity: '25',
    sku: 'MMC-CAT-001',
    weightInOunces: '16',
  });

  // Tracking edit states for orders
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [trackingCarrierInput, setTrackingCarrierInput] = useState('USPS Priority');

  // Phase 2 Flip confirmation
  const [flipConfirmOpen, setFlipConfirmOpen] = useState(false);
  const [flipMessage, setFlipMessage] = useState('');
  const [modeUpdating, setModeUpdating] = useState(false);

  // Admin Login & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch all initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, leadRes, setRes] = await Promise.all([
        fetch('/api/products?type=all&ignoreStoreMode=true'),
        fetch('/api/orders'),
        fetch('/api/leads'),
        fetch('/api/settings'),
      ]);

      if (ordRes.status === 401 || leadRes.status === 401 || prodRes.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const [prodData, ordData, leadData, setData] = await Promise.all([
        prodRes.json(),
        ordRes.json(),
        leadRes.json(),
        setRes.json(),
      ]);

      if (prodData.success) setProducts(prodData.products);
      if (ordData.success) setOrders(ordData.orders);
      if (leadData.success) setLeads(leadData.leads);
      if (setData.success) setSettings(setData.settings);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchData();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthPassword('');
        fetchData();
      } else {
        setAuthError(data.message || 'Invalid username/email or password');
      }
    } catch {
      setAuthError('An error occurred during login. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } finally {
      setIsAuthenticated(false);
    }
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setNewProductType('affiliate');
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      category: 'Cat Toys',
      description: '',
      badge: "Amazon's Choice",
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
      affiliateLink: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
      images: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      stockQuantity: '25',
      sku: `MMC-${Math.floor(100 + Math.random() * 900)}`,
      weightInOunces: '16',
    });
    setFormError('');
    setFormSuccess('');
    setIsAddModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (p: MergedProduct) => {
    setEditingProductId(p._id);
    setNewProductType(p.type);
    const isAff = p.type === 'affiliate';
    const aff = isAff ? (p as AffiliateProduct) : null;
    const real = !isAff ? (p as RealProduct) : null;

    setProductForm({
      name: p.name,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      category: p.category,
      description: p.description || '',
      badge: p.badge || (isAff ? "Amazon's Choice" : 'Momo Original'),
      isFeatured: Boolean(p.isFeatured),
      imageUrl: aff?.imageUrl || '',
      affiliateLink: aff?.affiliateLink || '',
      images: real?.images ? real.images.join(', ') : '',
      stockQuantity: real?.stockQuantity !== undefined ? real.stockQuantity.toString() : '0',
      sku: real?.sku || '',
      weightInOunces: real?.weightInOunces !== undefined ? real.weightInOunces.toString() : '16',
    });
    setFormError('');
    setFormSuccess('');
    setIsAddModalOpen(true);
  };

  // Handle Save Product (Add or Edit) Submit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormSubmitting(true);

    try {
      let payload: any;
      if (newProductType === 'affiliate') {
        payload = {
          type: 'affiliate',
          name: productForm.name,
          price: parseFloat(productForm.price),
          originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
          category: productForm.category,
          imageUrl: productForm.imageUrl,
          affiliateLink: productForm.affiliateLink,
          badge: productForm.badge,
          description: productForm.description,
          isFeatured: productForm.isFeatured,
        };
      } else {
        const imageList = productForm.images
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        payload = {
          type: 'real',
          name: productForm.name,
          price: parseFloat(productForm.price),
          originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
          category: productForm.category,
          images: imageList.length ? imageList : [productForm.imageUrl],
          stockQuantity: parseInt(productForm.stockQuantity) || 0,
          sku: productForm.sku,
          weightInOunces: parseFloat(productForm.weightInOunces) || 16,
          badge: productForm.badge || 'Momo Original',
          description: productForm.description,
          isFeatured: productForm.isFeatured,
        };
      }

      if (editingProductId) {
        // Edit existing product
        const res = await fetch(`/api/products/${editingProductId}?type=${newProductType}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.status === 401) {
          setIsAuthenticated(false);
          setFormError('Session expired. Please log in again.');
          return;
        }

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to update product');
        }

        setFormSuccess(`Successfully updated ${productForm.name}`);
        setProducts((prev) =>
          prev.map((item) => (item._id === editingProductId ? data.product : item))
        );
        setTimeout(() => {
          setIsAddModalOpen(false);
          setEditingProductId(null);
          setFormSuccess('');
          fetchData();
        }, 800);
      } else {
        // Create new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.status === 401) {
          setIsAuthenticated(false);
          setFormError('Session expired. Please log in again.');
          return;
        }

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to create product');
        }

        setFormSuccess(`Successfully created ${newProductType} product: ${productForm.name}`);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setFormSuccess('');
          fetchData();
        }, 800);
      }
    } catch (err: any) {
      setFormError(err.message || 'Error saving product');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, type: 'affiliate' | 'real', name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}?type=${type}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Handle Update Order Fulfillment
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: Order['fulfillmentStatus'],
    tracking?: string,
    carrier?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fulfillmentStatus: status,
          trackingNumber: tracking,
          trackingCarrier: carrier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
        setEditingOrderId(null);
      }
    } catch (err) {
      alert('Failed to update order');
    }
  };

  // Handle Mode Change
  const handleModeChange = async (mode: StoreSettings['storeMode']) => {
    setModeUpdating(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeMode: mode }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        const modeLabel =
          mode === 'affiliate_only'
            ? 'Affiliate Mode'
            : mode === 'retail_only'
            ? 'Real Product Mode'
            : 'Dual Mode';
        setFlipMessage(`Storefront architecture successfully switched to: ${modeLabel}`);
        setTimeout(() => setFlipMessage(''), 6000);
        fetchData();
      } else {
        alert(data.error || 'Failed to update store mode');
      }
    } catch (err) {
      alert('Failed to update store mode');
    } finally {
      setModeUpdating(false);
    }
  };

  // Execute Phase 2 Flip Master Script
  const handleExecutePhase2Flip = async () => {
    try {
      const res = await fetch('/api/admin/phase2-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'drop' }),
      });
      const data = await res.json();
      if (data.success) {
        setFlipMessage(data.message);
        setFlipConfirmOpen(false);
        fetchData();
      }
    } catch (err) {
      alert('Failed to execute flip script');
    }
  };

  const affiliateCount = products.filter((p) => p.type === 'affiliate').length;
  const realCount = products.filter((p) => p.type === 'real').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const filteredProducts = products.filter((p) => {
    if (productTypeFilter === 'affiliate' && p.type !== 'affiliate') return false;
    if (productTypeFilter === 'real' && p.type !== 'real') return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  // 1. Checking Session State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFC312] flex items-center justify-center text-3xl shadow-md animate-bounce">
          🐱
        </div>
        <h2 className="mt-4 font-display font-bold text-xl text-[#232121]">
          Verifying Admin Credentials...
        </h2>
        <p className="text-xs text-slate-400 mt-1">Please wait a moment</p>
      </div>
    );
  }

  // 2. Admin Login Form Screen
  if (isAuthenticated === false) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-[32px] p-7 sm:p-10 shadow-2xl border border-slate-200/80 relative overflow-hidden">
          {/* Decorative Corner Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FFC312]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#FF6B35]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2 mb-8 relative z-10">
            <div className="inline-flex w-16 h-16 rounded-full bg-[#FFC312] items-center justify-center text-3xl shadow-sm mb-1">
              🐱
            </div>
            <div className="text-[#FF6B35] font-black text-xs tracking-widest uppercase">
              \ | /
            </div>
            <h1 className="font-display font-bold text-3xl text-[#232121]">
              Momo Admin Hub
            </h1>
            <p className="text-xs text-slate-500">
              Sign in with your email & password to manage products, orders & leads
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-600 font-bold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            {/* Email / Username Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Admin Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin or admin@momothecat.shop"
                  className="w-full pl-11 pr-4 py-3 bg-[#FBF9F7] border border-slate-200 rounded-2xl text-xs font-semibold text-[#232121] outline-none focus:border-[#FF6B35] focus:bg-white transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">
                You can enter <strong className="text-slate-600">admin</strong> or your full admin email.
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-[#FBF9F7] border border-slate-200 rounded-2xl text-xs font-semibold text-[#232121] outline-none focus:border-[#FF6B35] focus:bg-white transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="pettie-btn pettie-btn-primary w-full py-3.5 text-xs shadow-lg shadow-[#FF6B35]/25 flex items-center justify-center gap-2 mt-5 hover:scale-102 active:scale-98 transition-all disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In to Admin Hub</span>
                </>
              )}
            </button>
          </form>

          {/* Hint & Storefront Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3 relative z-10">
            <div className="bg-slate-50 text-slate-500 text-[11px] font-medium p-3 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Restricted Area: Authorized administrative personnel only</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF6B35] transition-colors pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all"
            title="Return to Storefront"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🐱</span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Momo Command Center
              </h1>
              <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                settings?.storeMode === 'affiliate_only'
                  ? 'bg-amber-100 text-amber-800'
                  : settings?.storeMode === 'retail_only'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {settings?.storeMode === 'affiliate_only'
                  ? 'Affiliate Mode'
                  : settings?.storeMode === 'retail_only'
                  ? 'Real Product Mode'
                  : 'Dual Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Dual-Schema Catalog, Stripe Orders, Leads & Multi-Mode Storefront Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-orange-600 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-200/60 shadow-xs"
            title="Log Out of Admin Hub"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* STOREFRONT ARCHITECTURE MODE CONTROLLER */}
      <div className="bg-gradient-to-r from-slate-900 via-[#181528] to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎛️</span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Storefront Architecture Mode Controller
              </h2>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs ${
                settings?.storeMode === 'affiliate_only'
                  ? 'bg-amber-400 text-black'
                  : settings?.storeMode === 'retail_only'
                  ? 'bg-teal-400 text-black'
                  : 'bg-orange-500 text-white'
              }`}>
                {modeUpdating
                  ? 'Updating...'
                  : settings?.storeMode === 'affiliate_only'
                  ? '● Live: Affiliate Mode'
                  : settings?.storeMode === 'retail_only'
                  ? '● Live: Real Product Mode'
                  : '● Live: Dual Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Select an architecture mode to instantly switch the public storefront&apos;s product catalog, navigation, and purchasing actions.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/15"
          >
            <span>Preview Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Interactive Toggle Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* 1. Affiliate Mode */}
          <button
            onClick={() => handleModeChange('affiliate_only')}
            disabled={modeUpdating}
            className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
              settings?.storeMode === 'affiliate_only'
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  settings?.storeMode === 'affiliate_only'
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-white/10 text-amber-300'
                }`}>
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <span className="font-extrabold text-sm text-white">Affiliate Mode</span>
              </div>
              {settings?.storeMode === 'affiliate_only' ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Active
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white">Click to Select</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All real product actions and functionalities are <strong className="text-amber-300">HIDDEN</strong> from storefront. Customers only see Amazon affiliate items with outbound links. In-house cart is hidden.
            </p>
          </button>

          {/* 2. Real Product Mode */}
          <button
            onClick={() => handleModeChange('retail_only')}
            disabled={modeUpdating}
            className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
              settings?.storeMode === 'retail_only'
                ? 'bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-400 shadow-lg shadow-teal-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  settings?.storeMode === 'retail_only'
                    ? 'bg-teal-400 text-black font-bold'
                    : 'bg-white/10 text-teal-300'
                }`}>
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm text-white">Real Product Mode</span>
              </div>
              {settings?.storeMode === 'retail_only' ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-teal-300 bg-teal-400/20 px-2.5 py-0.5 rounded-full border border-teal-400/40">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Active
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white">Click to Select</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All Amazon affiliate links, Prime spotlights, and badges are <strong className="text-teal-300">HIDDEN</strong>. Storefront serves 100% in-house Momo items with full Add to Cart and Stripe checkout.
            </p>
          </button>

          {/* 3. Dual Mode */}
          <button
            onClick={() => handleModeChange('hybrid')}
            disabled={modeUpdating}
            className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
              settings?.storeMode === 'hybrid'
                ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-400 shadow-lg shadow-orange-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  settings?.storeMode === 'hybrid'
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-white/10 text-orange-300'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm text-white">Dual Mode</span>
              </div>
              {settings?.storeMode === 'hybrid' ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-orange-300 bg-orange-400/20 px-2.5 py-0.5 rounded-full border border-orange-400/40">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Active
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white">Click to Select</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Showcases <strong className="text-orange-300">BOTH</strong> functionalities side-by-side. Customers can buy Momo Originals via cart/checkout AND click outbound to Amazon for affiliate items.
            </p>
          </button>
        </div>

        {/* Dynamic Status Feedback Banner */}
        {flipMessage ? (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{flipMessage}</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              {settings?.storeMode === 'affiliate_only'
                ? 'Storefront currently enforcing Affiliate Mode: In-house shopping cart and real product checkout are completely hidden.'
                : settings?.storeMode === 'retail_only'
                ? 'Storefront currently enforcing Real Product Mode: Outbound Amazon links and Prime banners are completely hidden.'
                : 'Storefront currently enforcing Dual Mode: Customers have full access to both Amazon affiliate picks and in-house retail purchases.'}
            </span>
          </div>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{products.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            <strong className="text-amber-600">{affiliateCount}</strong> Affiliate ·{' '}
            <strong className="text-teal-600">{realCount}</strong> Momo Real
          </p>
        </div>

        {/* Customer Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Orders Count</span>
            <ShoppingBag className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{orders.length}</p>
          <p className="text-[11px] text-emerald-600 font-bold">
            {orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length} pending dispatch
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Stripe Revenue</span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              USD
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500 font-medium">Processed via Stripe gateway</p>
        </div>

        {/* Captured Leads */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Captured Leads</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{leads.length}</p>
          <a
            href="/api/leads/export"
            download
            className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 underline"
          >
            <Download className="w-3 h-3" />
            <span>Export Mailchimp CSV</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory Hub ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Fulfillment ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'leads'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Leads & Subscribers ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('phase2')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'phase2'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>Phase 2 Transition Hub</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY HUB */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500 font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setProductTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  productTypeFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setProductTypeFilter('affiliate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  productTypeFilter === 'affiliate'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Flame className="w-3 h-3 fill-current" />
                <span>Affiliate ({affiliateCount})</span>
              </button>
              <button
                onClick={() => setProductTypeFilter('real')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  productTypeFilter === 'real'
                    ? 'bg-teal-600 text-white'
                    : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Momo Real ({realCount})</span>
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock / Amazon Link</th>
                    <th className="py-3.5 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.map((p) => {
                    const isAff = p.type === 'affiliate';
                    const aff = isAff ? (p as AffiliateProduct) : null;
                    const real = !isAff ? (p as RealProduct) : null;
                    const img = isAff ? aff!.imageUrl : real!.images[0];

                    return (
                      <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt={p.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1 max-w-xs">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {isAff ? `Badge: ${p.badge}` : `SKU: ${real?.sku}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {isAff ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                              <Flame className="w-3 h-3 fill-current" />
                              Affiliate (Amazon)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                              <Sparkles className="w-3 h-3" />
                              Momo Real Product
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{p.category}</td>

                        <td className="py-3.5 px-4 font-black text-slate-900">
                          ${p.price.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          {isAff ? (
                            <a
                              href={aff?.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-700 underline flex items-center gap-1 font-semibold max-w-xs truncate"
                            >
                              <span>Outbound Link</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span
                              className={`font-bold ${
                                (real?.stockQuantity ?? 0) <= 0
                                  ? 'text-rose-500'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {real?.stockQuantity} units available
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {/* Edit Product Button */}
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                              title="Edit Product"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {isAff ? (
                              <a
                                href={aff?.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100"
                                title="Test Outbound Amazon Link"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <Link
                                href={`/product/${p._id}`}
                                target="_blank"
                                className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100"
                                title="Preview Store Product Page"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </Link>
                            )}

                            <button
                              onClick={() => handleDeleteProduct(p._id, p.type, p.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Stripe Status</th>
                    <th className="py-3.5 px-4">Fulfillment Status</th>
                    <th className="py-3.5 px-4">Tracking Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                          {ord.orderNumber}
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{ord.customer.name}</p>
                          <p className="text-[10px] text-slate-400">{ord.customer.email}</p>
                          <p className="text-[10px] text-slate-400">
                            {ord.customer.city}, {ord.customer.state}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900">
                          ${ord.total.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                            <CheckCircle2 className="w-3 h-3" />
                            {ord.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={ord.fulfillmentStatus}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                ord._id,
                                e.target.value as any,
                                ord.trackingNumber,
                                ord.trackingCarrier
                              )
                            }
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:border-orange-500 capitalize"
                          >
                            <option value="unfulfilled">Unfulfilled</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          {editingOrderId === ord._id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={trackingNumberInput}
                                onChange={(e) => setTrackingNumberInput(e.target.value)}
                                placeholder="Tracking #"
                                className="px-2 py-1 text-xs border border-orange-400 rounded-md w-36 outline-none"
                              />
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(
                                    ord._id,
                                    ord.fulfillmentStatus,
                                    trackingNumberInput,
                                    trackingCarrierInput
                                  )
                                }
                                className="p-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-slate-600">
                                {ord.trackingNumber || 'No tracking'}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingOrderId(ord._id);
                                  setTrackingNumberInput(ord.trackingNumber || '');
                                  setTrackingCarrierInput(ord.trackingCarrier || 'USPS Priority');
                                }}
                                className="text-[10px] text-orange-600 font-bold hover:underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEAD DATABASE */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Newsletter Subscribers & 10% Discount Claimants
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Collected from storefront lead capture blocks prior to Phase 2 launch.
              </p>
            </div>
            <a
              href="/api/leads/export"
              download
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Export CSV (Mailchimp Ready)</span>
            </a>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {leads.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{l.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-orange-600 font-extrabold bg-orange-50 px-2 py-0.5 rounded">
                        {l.discountCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{l.source}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PHASE 2 TRANSITION HUB */}
      {activeTab === 'phase2' && (
        <div className="space-y-6 max-w-3xl">
          {flipMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{flipMessage}</span>
            </div>
          )}

          {/* Store Mode Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Storefront Architecture Mode
            </h3>
            <p className="text-xs text-slate-500">
              Control whether the public storefront serves hybrid products, affiliate-only products, or has flipped to 100% in-house retail.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleModeChange('affiliate_only')}
                disabled={modeUpdating}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  settings?.storeMode === 'affiliate_only'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Affiliate Mode</span>
                  {settings?.storeMode === 'affiliate_only' && (
                    <Check className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Hides cart. All clicks outbound to Amazon. Real product actions are hidden.
                </p>
              </button>

              <button
                onClick={() => handleModeChange('retail_only')}
                disabled={modeUpdating}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  settings?.storeMode === 'retail_only'
                    ? 'border-teal-500 bg-teal-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Real Product Mode</span>
                  {settings?.storeMode === 'retail_only' && (
                    <Check className="w-4 h-4 text-teal-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  100% In-House Momo products with active Stripe cart. Affiliate actions hidden.
                </p>
              </button>

              <button
                onClick={() => handleModeChange('hybrid')}
                disabled={modeUpdating}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition-all cursor-pointer ${
                  settings?.storeMode === 'hybrid'
                    ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Dual Mode</span>
                  {settings?.storeMode === 'hybrid' && (
                    <Check className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Affiliate Amazon picks + Momo Originals showcased side-by-side.
                </p>
              </button>
            </div>
          </div>

          {/* Master Script: Drop Affiliate Collection */}
          <div className="bg-rose-50/60 p-6 rounded-3xl border border-rose-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-extrabold">
                Master Script: Phase 2 In-House Retail Flip
              </h3>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              As specified in Section 5 of the PRD: When you are ready to pivot completely from Amazon Affiliate marketing to 100% In-House Retail, this master script drops the Affiliate collection from the database and flips the store mode automatically.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setFlipConfirmOpen(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 transition-all"
              >
                Execute Phase 2 Flip (Drop Affiliate Collection)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT WITH SMART DUAL-SCHEMA FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingProductId(null);
            }}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProductId ? 'Edit Product Details' : 'Add New Product'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingProductId
                    ? `Updating ${newProductType === 'affiliate' ? 'Amazon Affiliate' : 'In-House Momo Real'} product record.`
                    : 'Select product type to toggle between Affiliate or In-House Real inventory.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProductId(null);
                }}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                Cancel
              </button>
            </div>

            {/* Product Type Toggle (Dual-Schema Selector) */}
            <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-2">
              <button
                type="button"
                disabled={Boolean(editingProductId)}
                onClick={() => {
                  if (editingProductId) return;
                  setNewProductType('affiliate');
                  setProductForm((prev) => ({
                    ...prev,
                    badge: "Amazon's Choice",
                  }));
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  newProductType === 'affiliate'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                } ${editingProductId ? 'cursor-default opacity-85' : ''}`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Affiliate Product (Phase 1)</span>
              </button>

              <button
                type="button"
                disabled={Boolean(editingProductId)}
                onClick={() => {
                  if (editingProductId) return;
                  setNewProductType('real');
                  setProductForm((prev) => ({
                    ...prev,
                    badge: 'Momo Original',
                  }));
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  newProductType === 'real'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                } ${editingProductId ? 'cursor-default opacity-85' : ''}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real Product (Phase 2 & Hybrid)</span>
              </button>
            </div>

            {/* Dynamic Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Laser Automatic Cat Ball"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Products').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="24.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="34.99"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* SPECIFIC FIELDS FOR AFFILIATE */}
              {newProductType === 'affiliate' ? (
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3">
                  <div className="space-y-1">
                    <label className="text-amber-900 font-bold">
                      Amazon Outbound Affiliate Link
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.amazon.com/dp/.../?tag=momothecat-20"
                      value={productForm.affiliateLink}
                      onChange={(e) =>
                        setProductForm({ ...productForm, affiliateLink: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-500 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-amber-900 font-bold">Image URL (High-Res)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.imageUrl}
                      onChange={(e) =>
                        setProductForm({ ...productForm, imageUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>
              ) : (
                /* SPECIFIC FIELDS FOR REAL PRODUCT */
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-teal-900 font-bold">Stock Quantity</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="25"
                        value={productForm.stockQuantity}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stockQuantity: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-teal-200 rounded-xl outline-none focus:border-teal-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-teal-900 font-bold">SKU (Warehouse ID)</label>
                      <input
                        type="text"
                        required
                        placeholder="MMC-CAT-001"
                        value={productForm.sku}
                        onChange={(e) =>
                          setProductForm({ ...productForm, sku: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-teal-200 rounded-xl outline-none focus:border-teal-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-teal-900 font-bold">Weight (oz)</label>
                      <input
                        type="number"
                        placeholder="16"
                        value={productForm.weightInOunces}
                        onChange={(e) =>
                          setProductForm({ ...productForm, weightInOunces: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-teal-200 rounded-xl outline-none focus:border-teal-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-teal-900 font-bold">
                      Gallery Images (Comma-separated URLs)
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="https://image1.jpg, https://image2.jpg"
                      value={productForm.images}
                      onChange={(e) =>
                        setProductForm({ ...productForm, images: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl outline-none focus:border-teal-500 font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-700">Badge Text</label>
                <input
                  type="text"
                  placeholder={newProductType === 'affiliate' ? "Amazon's Choice" : 'Momo Original'}
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">Product Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of features, materials, and benefits for cats..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={productForm.isFeatured}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor="featured-toggle" className="text-slate-700 cursor-pointer">
                  Feature this product on homepage Best Sellers showcase
                </label>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {formSubmitting
                    ? editingProductId
                      ? 'Saving Changes...'
                      : 'Creating Product...'
                    : editingProductId
                    ? 'Save Product Changes'
                    : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: PHASE 2 FLIP */}
      {flipConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setFlipConfirmOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 z-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Execute Phase 2 Retail Flip?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This master script will drop all Affiliate products and switch the store mode to <strong>Phase 2: Retail Only</strong>. Your storefront will exclusively sell Momo in-house inventory through the cart.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setFlipConfirmOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePhase2Flip}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20"
              >
                Yes, Flip to Retail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
