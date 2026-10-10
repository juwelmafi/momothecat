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
  Menu,
  X,
  Globe,
  FileText,
  LayoutDashboard,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Settings as SettingsIcon,
  ChevronRight,
  Phone,
  MapPin,
  HelpCircle,
  Layers,
} from 'lucide-react';
import {
  MergedProduct,
  AffiliateProduct,
  RealProduct,
  Order,
  Lead,
  StoreSettings,
} from '@/lib/types';
import { CATEGORIES, INITIAL_SETTINGS } from '@/lib/initialData';

type AdminTab =
  | 'overview'
  | 'content'
  | 'seo'
  | 'inventory'
  | 'orders'
  | 'leads'
  | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // CMS & SEO Live Settings Form State
  const [cmsForm, setCmsForm] = useState<StoreSettings>({ ...INITIAL_SETTINGS });
  const [savingCms, setSavingCms] = useState(false);
  const [cmsSuccessMessage, setCmsSuccessMessage] = useState('');
  const [cmsErrorMessage, setCmsErrorMessage] = useState('');

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

  // Product Form Fields
  const [productForm, setProductForm] = useState({
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
      if (setData.success) {
        setSettings(setData.settings);
        setCmsForm(setData.settings);
      }
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
      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      setAuthPassword('');
      setAuthEmail('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handle Save CMS & SEO Settings
  const handleSaveCmsSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingCms(true);
    setCmsSuccessMessage('');
    setCmsErrorMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsForm),
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setCmsErrorMessage('Session expired. Please log in again.');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setCmsForm(data.settings);
        setCmsSuccessMessage('🎉 Website content & SEO settings saved successfully to live store!');
        setTimeout(() => setCmsSuccessMessage(''), 7000);
      } else {
        setCmsErrorMessage(data.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      setCmsErrorMessage(err?.message || 'Error saving settings.');
    } finally {
      setSavingCms(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all website text and SEO fields to original live store defaults?')) {
      setCmsForm({
        ...INITIAL_SETTINGS,
        storeMode: settings?.storeMode || INITIAL_SETTINGS.storeMode,
        affiliateTag: settings?.affiliateTag || INITIAL_SETTINGS.affiliateTag,
      });
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
      sku: `MMC-CAT-${Math.floor(100 + Math.random() * 900)}`,
      weightInOunces: '16',
    });
    setFormError('');
    setFormSuccess('');
    setIsAddModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (p: MergedProduct) => {
    setEditingProductId(p._id);
    const isAff = p.type === 'affiliate';
    setNewProductType(isAff ? 'affiliate' : 'real');

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
        if (data.success) {
          setFormSuccess('Product updated successfully!');
          setTimeout(() => {
            setIsAddModalOpen(false);
            fetchData();
          }, 800);
        } else {
          setFormError(data.error || 'Failed to update product');
        }
      } else {
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
        if (data.success) {
          setFormSuccess('New product created and live in store!');
          setTimeout(() => {
            setIsAddModalOpen(false);
            fetchData();
          }, 800);
        } else {
          setFormError(data.error || 'Failed to create product');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Error submitting form');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, type: 'affiliate' | 'real') => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}?type=${type}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.error || 'Failed to delete product');
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

  // Handle Store Architecture Mode Change
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
        setCmsForm((prev) => ({ ...prev, storeMode: mode }));
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
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FFC312]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#FF6B35]/20 rounded-full blur-2xl pointer-events-none" />

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
              Sign in with your email & password to manage products, CMS, SEO & orders
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-600 font-bold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
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

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] hover:from-[#e55a28] hover:to-[#e67a00] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

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

  // NAVIGATION TAB CONFIGURATION
  const tabsList = [
    {
      id: 'overview' as AdminTab,
      label: 'Command Center',
      description: 'KPIs & Quick Modes',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'content' as AdminTab,
      label: 'Website Content',
      description: 'Headings, Hero & Body Text',
      icon: FileText,
      badge: 'CMS',
    },
    {
      id: 'seo' as AdminTab,
      label: 'SEO & Branding',
      description: 'Meta Tags, Favicon, Logo',
      icon: Globe,
      badge: 'SEO',
    },
    {
      id: 'inventory' as AdminTab,
      label: 'Product Catalog',
      description: `${products.length} Products`,
      icon: Package,
      badge: products.length.toString(),
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders & Dispatch',
      description: `${orders.length} Stripe Orders`,
      icon: ShoppingBag,
      badge: orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length > 0
        ? `${orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length} new`
        : null,
    },
    {
      id: 'leads' as AdminTab,
      label: 'Email Subscribers',
      description: `${leads.length} Leads captured`,
      icon: Users,
      badge: leads.length.toString(),
    },
    {
      id: 'settings' as AdminTab,
      label: 'Store Architecture',
      description: 'Affiliate, Dual & Shipping',
      icon: SettingsIcon,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col -mx-4 sm:-mx-6 -my-6">
      {/* 1. TOP MOBILE HEADER BAR & DESKTOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Hamburger Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFC312] flex items-center justify-center text-xl shadow-xs">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg text-[#232121]">Momo Admin</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF6B35] text-white">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Storefront CMS, Catalog & Architecture Control
              </p>
            </div>
          </Link>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Storefront Architecture Badge */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
              settings?.storeMode === 'affiliate_only'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : settings?.storeMode === 'retail_only'
                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                : 'bg-orange-100 text-orange-800 border border-orange-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {settings?.storeMode === 'affiliate_only'
              ? 'Affiliate Mode'
              : settings?.storeMode === 'retail_only'
              ? 'Real Product Mode'
              : 'Dual Mode'}
          </span>

          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:text-orange-600 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Open Live Store in new tab"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 bg-[#FF6B35] hover:bg-[#e65a25] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 sm:py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-transparent hover:border-rose-200"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: LEFT DRAWER / SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* MOBILE DRAWER OVERLAY BACKDROP */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* LEFT DRAWER / SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1A1825] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Top Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFC312] text-[#232121] flex items-center justify-center text-xl shadow-md font-bold">
                🐱
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white">Momo The Cat</h2>
                <p className="text-[11px] text-slate-400">Admin Control Panel</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Tabs List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Navigation Tabs
            </div>

            {tabsList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] text-white font-bold shadow-lg shadow-orange-500/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs block leading-tight">{tab.label}</span>
                      <span
                        className={`text-[10px] block leading-tight mt-0.5 ${
                          isActive ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        {tab.description}
                      </span>
                    </div>
                  </div>

                  {tab.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-[#FF6B35]' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Drawer Footer User Info & Mode pill */}
          <div className="p-4 border-t border-white/10 space-y-3 bg-[#14121E]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-semibold">Store Online</span>
              </div>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                {settings?.storeMode === 'affiliate_only'
                  ? 'Affiliate'
                  : settings?.storeMode === 'retail_only'
                  ? 'Retail'
                  : 'Dual Mode'}
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Visit Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* 3. MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
          {/* Top Feedback Messages */}
          {cmsSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{cmsSuccessMessage}</span>
              </div>
              <button
                onClick={() => setCmsSuccessMessage('')}
                className="text-emerald-700 hover:text-emerald-900 p-1"
              >
                ✕
              </button>
            </div>
          )}

          {cmsErrorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{cmsErrorMessage}</span>
              </div>
              <button
                onClick={() => setCmsErrorMessage('')}
                className="text-rose-700 hover:text-rose-900 p-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW & COMMAND CENTER */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Architecture Mode Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-[#1C182E] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <h2 className="font-display font-extrabold text-xl text-white">
                        Architecture Store Mode Controller
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Instantly switch your storefront&apos;s behavior. Select below to customize how products and shopping flows operate live.
                    </p>
                  </div>

                  <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/20 self-start sm:self-auto">
                    Active: {settings?.storeMode === 'affiliate_only'
                      ? 'Affiliate Mode'
                      : settings?.storeMode === 'retail_only'
                      ? 'Real Product Mode'
                      : 'Dual Mode'}
                  </span>
                </div>

                {/* 3 Interactive Mode Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Affiliate Mode */}
                  <button
                    onClick={() => handleModeChange('affiliate_only')}
                    disabled={modeUpdating}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      settings?.storeMode === 'affiliate_only'
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-bold text-sm text-white">Affiliate Mode</span>
                      {settings?.storeMode === 'affiliate_only' && (
                        <Check className="w-4 h-4 text-amber-300 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Hides all shopping cart and real product checkout. Amazon outbound buttons only.
                    </p>
                  </button>

                  {/* Real Product Mode */}
                  <button
                    onClick={() => handleModeChange('retail_only')}
                    disabled={modeUpdating}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      settings?.storeMode === 'retail_only'
                        ? 'bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-400 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-bold text-sm text-white">Real Product Mode</span>
                      {settings?.storeMode === 'retail_only' && (
                        <Check className="w-4 h-4 text-teal-300 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Hides all Amazon links. Storefront functions 100% as in-house retail brand.
                    </p>
                  </button>

                  {/* Dual Mode */}
                  <button
                    onClick={() => handleModeChange('hybrid')}
                    disabled={modeUpdating}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      settings?.storeMode === 'hybrid'
                        ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-400 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-bold text-sm text-white">Dual Mode</span>
                      {settings?.storeMode === 'hybrid' && (
                        <Check className="w-4 h-4 text-orange-300 stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Showcases BOTH affiliate items & Momo retail products seamlessly side-by-side.
                    </p>
                  </button>
                </div>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
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

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Customer Orders</span>
                    <ShoppingBag className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{orders.length}</p>
                  <p className="text-[11px] text-emerald-600 font-bold">
                    {orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length} pending dispatch
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Stripe Revenue</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      USD
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Processed via Stripe gateway</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
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
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setActiveTab('content')}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
                    Edit Website Content (CMS)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize website headings, body text, hero slides, promo banners, and newsletter copy with instant live store preview.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('seo')}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
                    SEO Meta Tags & Branding
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update Google Search meta title, description, keywords, favicon icon, brand logo, and tagline.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: WEBSITE CONTENT (CMS) */}
          {/* ======================================================== */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Header with Save Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900">
                    Website Content Manager (CMS)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    All fields display live store data by default. Edit any text and click &ldquo;Save Website Content&rdquo; to publish live.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveCmsSettings()}
                    disabled={savingCms}
                    className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e65a25] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingCms ? 'Saving...' : 'Save Website Content'}</span>
                  </button>
                </div>
              </div>

              {/* 1. HERO BANNER SLIDES */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>🐱</span> 1. Hero Banner Slides
                  </h3>
                  <p className="text-xs text-slate-400">
                    The large yellow banner slider at the top of the storefront homepage.
                  </p>
                </div>

                {/* Slide 1 */}
                <div className="bg-[#FBF9F7] p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Slide 1 (Dog & Cat Food)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Heading 1</label>
                      <input
                        type="text"
                        value={cmsForm.heroSlide1Heading1 ?? ''}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroSlide1Heading1: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Heading 2</label>
                      <input
                        type="text"
                        value={cmsForm.heroSlide1Heading2 ?? ''}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroSlide1Heading2: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Description Text</label>
                    <textarea
                      rows={2}
                      value={cmsForm.heroSlide1Description ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSlide1Description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={cmsForm.heroSlide1ButtonText ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSlide1ButtonText: e.target.value })}
                      className="w-full max-w-xs px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="bg-[#FBF9F7] p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Slide 2 (Pure Cat Treats)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Heading 1</label>
                      <input
                        type="text"
                        value={cmsForm.heroSlide2Heading1 ?? ''}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroSlide2Heading1: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Heading 2</label>
                      <input
                        type="text"
                        value={cmsForm.heroSlide2Heading2 ?? ''}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroSlide2Heading2: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Description Text</label>
                    <textarea
                      rows={2}
                      value={cmsForm.heroSlide2Description ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSlide2Description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={cmsForm.heroSlide2ButtonText ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroSlide2ButtonText: e.target.value })}
                      className="w-full max-w-xs px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PRODUCT CATALOG SECTION */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>🐾</span> 2. Products Catalog Section
                  </h3>
                  <p className="text-xs text-slate-400">
                    The title and subtitle appearing above the circular category buttons and product cards grid.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Section Title</label>
                    <input
                      type="text"
                      value={cmsForm.productsHeading ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, productsHeading: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Section Subtitle</label>
                    <input
                      type="text"
                      value={cmsForm.productsSubheading ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, productsSubheading: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. PASSION FEATURE SECTION */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>❤️</span> 3. Passion Section
                  </h3>
                  <p className="text-xs text-slate-400">
                    &ldquo;Our Passion Is Providing Premium Cat Products&rdquo; feature section.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Heading</label>
                    <input
                      type="text"
                      value={cmsForm.passionHeading ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, passionHeading: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={cmsForm.passionButtonText ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, passionButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Body Description</label>
                  <textarea
                    rows={3}
                    value={cmsForm.passionDescription ?? ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, passionDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              {/* 4. FLASH DEALS SECTION */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>⚡</span> 4. Flash Deals Section
                  </h3>
                  <p className="text-xs text-slate-400">
                    &ldquo;Deals Ended Soon&rdquo; limited-time offers banner.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Heading</label>
                    <input
                      type="text"
                      value={cmsForm.dealsHeading ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, dealsHeading: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={cmsForm.dealsButtonText ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, dealsButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={cmsForm.dealsDescription ?? ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, dealsDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              {/* 5. DISCOUNTS FLASH BANNER */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>🏷️</span> 5. Discounts Flash Banner
                  </h3>
                  <p className="text-xs text-slate-400">
                    The vibrant yellow banner with the round offer badge and &ldquo;Get Enticing Discounts&rdquo;.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Badge Text</label>
                    <input
                      type="text"
                      value={cmsForm.discountsBadge ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, discountsBadge: e.target.value })}
                      placeholder="20% Offer"
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Heading</label>
                    <input
                      type="text"
                      value={cmsForm.discountsHeading ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, discountsHeading: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={cmsForm.discountsButtonText ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, discountsButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>

              {/* 6. TESTIMONIALS SECTION */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>⭐</span> 6. Testimonials Section
                  </h3>
                  <p className="text-xs text-slate-400">
                    Heading for customer reviews and feedback slider.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Section Title</label>
                  <input
                    type="text"
                    value={cmsForm.testimonialsHeading ?? ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, testimonialsHeading: e.target.value })}
                    className="w-full max-w-lg px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              {/* 7. ANNOUNCEMENT BAR & NEWSLETTER */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>📢</span> 7. Top Announcement & Footer Newsletter
                  </h3>
                  <p className="text-xs text-slate-400">
                    Top notification bar and newsletter lead capture box.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Announcement Bar Text</label>
                    <input
                      type="text"
                      value={cmsForm.announcementText ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, announcementText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Coupon Code</label>
                    <input
                      type="text"
                      value={cmsForm.announcementCode ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, announcementCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Newsletter Heading</label>
                    <input
                      type="text"
                      value={cmsForm.newsletterHeading ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, newsletterHeading: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Newsletter Description</label>
                    <input
                      type="text"
                      value={cmsForm.newsletterDescription ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, newsletterDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>

              {/* 8. FOOTER & CONTACT DETAILS */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>📍</span> 8. Footer Description & Contact Details
                  </h3>
                  <p className="text-xs text-slate-400">
                    Brand summary and contact information shown across storefront footer and headers.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Footer Brand Description</label>
                  <textarea
                    rows={2}
                    value={cmsForm.footerDescription ?? ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, footerDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#FF6B35]" /> Phone Hotline
                    </label>
                    <input
                      type="text"
                      value={cmsForm.contactPhone ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#FF6B35]" /> Contact Email
                    </label>
                    <input
                      type="text"
                      value={cmsForm.contactEmail ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" /> Physical Location
                    </label>
                    <input
                      type="text"
                      value={cmsForm.contactAddress ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Save Bar */}
              <div className="sticky bottom-4 bg-[#1A1825] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-300">
                    Ready to publish your website edits to the live store?
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveCmsSettings()}
                  disabled={savingCms}
                  className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#e65a25] text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingCms ? 'Saving...' : 'Save Website Content'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SEO & BRANDING */}
          {/* ======================================================== */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Header with Save Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900">
                    SEO Meta Tags & Branding Manager
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure Google search snippets, browser favicons, logo asset URLs, and brand taglines.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveCmsSettings()}
                  disabled={savingCms}
                  className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e65a25] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingCms ? 'Saving...' : 'Save SEO & Branding'}</span>
                </button>
              </div>

              {/* LIVE GOOGLE SEARCH RESULT PREVIEW CARD */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" /> Live Google Search Result Preview
                    </h3>
                    <p className="text-xs text-slate-400">
                      This is how your store will appear to customers in Google search results.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    SERP Preview
                  </span>
                </div>

                {/* Google Snippet Card */}
                <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-200 space-y-1.5 max-w-2xl font-sans">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cmsForm.websiteFavicon || 'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/cropped-favicon-32x32.png'}
                      alt="favicon"
                      className="w-4 h-4 rounded-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-semibold text-slate-800">
                      https://momothecat.vercel.app
                    </span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-500">{cmsForm.brandName || 'Momo'}</span>
                  </div>

                  <h4 className="text-lg font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight pt-1 line-clamp-1">
                    {cmsForm.metaTitle || 'Momo - The Cat | Amazon Affiliate Cat Store & Boutique'}
                  </h4>

                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2 pt-0.5">
                    {cmsForm.metaDescription ||
                      'Fresh Flavoured Cat Food & Toys. Discover top-rated Amazon Prime essentials and handcrafted Momo Originals.'}
                  </p>
                </div>
              </div>

              {/* SEO INPUT FIELDS */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Search Engine Optimization (SEO) Fields
                  </h3>
                  <p className="text-xs text-slate-400">
                    Shown in browser tabs, social link previews, and HTML headers.
                  </p>
                </div>

                {/* Meta Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Page Meta Title</label>
                    <span className="text-[11px] text-slate-400">
                      {cmsForm.metaTitle?.length || 0} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={cmsForm.metaTitle ?? ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, metaTitle: e.target.value })}
                    placeholder="Momo - The Cat | Amazon Affiliate Cat Store & Boutique"
                    className="w-full px-4 py-3 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                  <p className="text-[11px] text-slate-400">
                    Recommended length: 50-60 characters for best Google SERP rendering.
                  </p>
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Page Meta Description</label>
                    <span className="text-[11px] text-slate-400">
                      {cmsForm.metaDescription?.length || 0} / 160 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={cmsForm.metaDescription ?? ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, metaDescription: e.target.value })}
                    placeholder="Brief description summarizing your cat store for search engines..."
                    className="w-full px-4 py-3 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                  <p className="text-[11px] text-slate-400">
                    Recommended length: 140-160 characters for rich snippets.
                  </p>
                </div>

                {/* Meta Keywords */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Meta Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={cmsForm.metaKeywords ?? ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, metaKeywords: e.target.value })}
                    placeholder="cat toys, cat food, Amazon affiliate, pet boutique"
                    className="w-full px-4 py-3 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              {/* BRANDING ASSETS: FAVICON & LOGO */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Branding Assets & Logo
                  </h3>
                  <p className="text-xs text-slate-400">
                    Custom website favicon icon, logo image link, and brand name.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Website Favicon */}
                  <div className="space-y-3 p-5 rounded-2xl bg-[#FBF9F7] border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-orange-500" /> Website Favicon URL
                      </label>
                      {cmsForm.websiteFavicon && (
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmsForm.websiteFavicon}
                            alt="Favicon preview"
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-[10px] text-slate-500 font-bold">Preview</span>
                        </div>
                      )}
                    </div>

                    <input
                      type="url"
                      value={cmsForm.websiteFavicon ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, websiteFavicon: e.target.value })}
                      placeholder="https://.../favicon.png"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                    <p className="text-[10px] text-slate-400">
                      Standard size: 32x32px or 64x64px .png or .ico format.
                    </p>
                  </div>

                  {/* Website Logo */}
                  <div className="space-y-3 p-5 rounded-2xl bg-[#FBF9F7] border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-teal-600" /> Website Logo URL
                      </label>
                      {cmsForm.websiteLogo && (
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmsForm.websiteLogo}
                            alt="Logo preview"
                            className="h-5 w-auto object-contain max-w-[80px]"
                          />
                          <span className="text-[10px] text-slate-500 font-bold">Preview</span>
                        </div>
                      )}
                    </div>

                    <input
                      type="url"
                      value={cmsForm.websiteLogo ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, websiteLogo: e.target.value })}
                      placeholder="https://.../logo.png"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                    <p className="text-[10px] text-slate-400">
                      Transparent PNG or SVG image recommended.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Brand Name</label>
                    <input
                      type="text"
                      value={cmsForm.brandName ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, brandName: e.target.value })}
                      placeholder="Momo"
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Brand Tagline</label>
                    <input
                      type="text"
                      value={cmsForm.brandTagline ?? ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, brandTagline: e.target.value })}
                      placeholder="Amazon Cat Boutique"
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Save Bar */}
              <div className="sticky bottom-4 bg-[#1A1825] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
                <span className="text-xs font-medium text-slate-300">
                  Update Google meta headers and site assets
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveCmsSettings()}
                  disabled={savingCms}
                  className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#e65a25] text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingCms ? 'Saving...' : 'Save SEO & Branding'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: PRODUCT CATALOG (INVENTORY) */}
          {/* ======================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Top Controls: Search, Type Filters & Add Product */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product name or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      productTypeFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setProductTypeFilter('affiliate')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      productTypeFilter === 'affiliate'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Affiliate ({affiliateCount})
                  </button>
                  <button
                    onClick={() => setProductTypeFilter('real')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      productTypeFilter === 'real'
                        ? 'bg-teal-600 text-white'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                  >
                    Momo Real ({realCount})
                  </button>

                  <button
                    onClick={handleOpenAddModal}
                    className="ml-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#e65a25] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FBF9F7] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock / Link</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredProducts.map((p) => {
                        const isAff = p.type === 'affiliate';
                        const aff = isAff ? (p as AffiliateProduct) : null;
                        const real = !isAff ? (p as RealProduct) : null;

                        return (
                          <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Product Info */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    isAff
                                      ? aff?.imageUrl
                                      : real?.images?.[0] || 'https://via.placeholder.com/60'
                                  }
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                                <div className="max-w-xs">
                                  <p className="font-bold text-slate-900 leading-snug">{p.name}</p>
                                  <span className="text-[10px] text-slate-400">
                                    ID: {p._id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Type Badge */}
                            <td className="p-4">
                              <span
                                className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                                  isAff
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-teal-100 text-teal-800'
                                }`}
                              >
                                {isAff ? 'Amazon Affiliate' : 'Momo Retail'}
                              </span>
                            </td>

                            {/* Category */}
                            <td className="p-4 text-slate-600 font-semibold">{p.category}</td>

                            {/* Price */}
                            <td className="p-4 font-bold text-slate-900">
                              ${p.price.toFixed(2)}
                              {p.originalPrice && (
                                <span className="ml-1 text-[10px] text-slate-400 line-through">
                                  ${p.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </td>

                            {/* Stock or Link */}
                            <td className="p-4">
                              {isAff ? (
                                <a
                                  href={aff?.affiliateLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                                >
                                  <span>Amazon Link</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span
                                  className={`font-bold ${
                                    (real?.stockQuantity || 0) > 0
                                      ? 'text-emerald-600'
                                      : 'text-rose-600'
                                  }`}
                                >
                                  {real?.stockQuantity} in stock
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-2 text-slate-600 hover:text-[#FF6B35] hover:bg-orange-50 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id, p.type)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

          {/* ======================================================== */}
          {/* TAB 5: ORDERS & FULFILLMENT */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="font-display font-black text-xl text-slate-900">
                    Customer Orders & Shipping Tracking
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live customer checkout orders processed via Stripe.
                  </p>
                </div>
                <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                  {orders.length} Total Orders
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    🛍️
                  </div>
                  <h3 className="font-bold text-slate-800">No Orders Placed Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When customers buy real products using Stripe or Apple Pay, their orders will appear here for fulfillment and tracking.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FBF9F7] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                        <tr>
                          <th className="p-4">Order #</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Items</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Fulfillment & Tracking</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-slate-50/80">
                            <td className="p-4 font-mono font-bold text-slate-900">
                              {order.orderNumber}
                              <p className="text-[10px] text-slate-400 font-sans">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </td>

                            <td className="p-4">
                              <p className="font-bold text-slate-900">{order.customer.name}</p>
                              <p className="text-[10px] text-slate-500">{order.customer.email}</p>
                              <p className="text-[10px] text-slate-400">
                                {order.customer.city}, {order.customer.state}
                              </p>
                            </td>

                            <td className="p-4">
                              <div className="space-y-1">
                                {order.items.map((it, idx) => (
                                  <div key={idx} className="text-[11px] text-slate-700">
                                    <span className="font-bold">{it.quantity}x</span> {it.name}
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="p-4 font-bold text-slate-900">
                              ${order.total.toFixed(2)}
                            </td>

                            <td className="p-4">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                {order.paymentStatus}
                              </span>
                            </td>

                            <td className="p-4">
                              {editingOrderId === order._id ? (
                                <div className="space-y-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                                  <input
                                    type="text"
                                    placeholder="Enter Tracking Number"
                                    value={trackingNumberInput}
                                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Carrier (e.g. USPS Priority)"
                                    value={trackingCarrierInput}
                                    onChange={(e) => setTrackingCarrierInput(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                                  />
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() =>
                                        handleUpdateOrderStatus(
                                          order._id,
                                          'shipped',
                                          trackingNumberInput,
                                          trackingCarrierInput
                                        )
                                      }
                                      className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                                    >
                                      Mark Shipped
                                    </button>
                                    <button
                                      onClick={() => setEditingOrderId(null)}
                                      className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-[10px] font-bold"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div>
                                    <span
                                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                        order.fulfillmentStatus === 'delivered'
                                          ? 'bg-blue-100 text-blue-800'
                                          : order.fulfillmentStatus === 'shipped'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {order.fulfillmentStatus}
                                    </span>
                                    {order.trackingNumber && (
                                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        {order.trackingCarrier}: {order.trackingNumber}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setEditingOrderId(order._id);
                                      setTrackingNumberInput(order.trackingNumber || '');
                                      setTrackingCarrierInput(order.trackingCarrier || 'USPS Priority');
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-700"
                                    title="Edit tracking"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: EMAIL LEADS */}
          {/* ======================================================== */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="font-display font-black text-xl text-slate-900">
                    Captured Email Subscribers & Leads
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customers who opted into discount promotions and newsletter blasts.
                  </p>
                </div>

                <a
                  href="/api/leads/export"
                  download
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Mailchimp CSV</span>
                </a>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FBF9F7] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Email</th>
                      <th className="p-4">Capture Source</th>
                      <th className="p-4">Discount Code</th>
                      <th className="p-4">Date Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {leads.map((l) => (
                      <tr key={l._id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-900">{l.email}</td>
                        <td className="p-4 text-slate-600">{l.source}</td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            {l.discountCode || 'MOMO15'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(l.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: STORE ARCHITECTURE & CONFIGURATION */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <h2 className="font-display font-black text-2xl text-slate-900">
                  Store Architecture & Affiliate Parameters
                </h2>
                <p className="text-xs text-slate-500">
                  Control multi-mode behavior, Amazon tag injection, and shipping thresholds.
                </p>
              </div>

              {/* Mode Switch Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Storefront Operation Mode
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleModeChange('affiliate_only')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      settings?.storeMode === 'affiliate_only'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900 mb-1">Affiliate Mode</p>
                    <p className="text-xs text-slate-500">Pure Amazon Associates storefront.</p>
                  </button>

                  <button
                    onClick={() => handleModeChange('retail_only')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      settings?.storeMode === 'retail_only'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900 mb-1">Real Product Mode</p>
                    <p className="text-xs text-slate-500">100% in-house Momo items and Stripe checkout.</p>
                  </button>

                  <button
                    onClick={() => handleModeChange('hybrid')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      settings?.storeMode === 'hybrid'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900 mb-1">Dual Mode</p>
                    <p className="text-xs text-slate-500">Showcases both affiliate & in-house items.</p>
                  </button>
                </div>
              </div>

              {/* Amazon Affiliate Tag */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Amazon Associate Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Amazon Associate Tag</label>
                    <input
                      type="text"
                      value={cmsForm.affiliateTag ?? 'momothecat-20'}
                      onChange={(e) => setCmsForm({ ...cmsForm, affiliateTag: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Free Shipping Minimum ($)</label>
                    <input
                      type="number"
                      value={cmsForm.freeShippingThreshold ?? 45}
                      onChange={(e) =>
                        setCmsForm({
                          ...cmsForm,
                          freeShippingThreshold: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveCmsSettings()}
                  disabled={savingCms}
                  className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e65a25] text-white rounded-xl text-xs font-black shadow-md transition-all disabled:opacity-50"
                >
                  Save Store Settings
                </button>
              </div>

              {/* Phase 2 Retail Flip Trigger */}
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 space-y-3">
                <h3 className="font-display font-bold text-base text-rose-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  Phase 2 Retail Flip Master Trigger
                </h3>
                <p className="text-xs text-rose-700 leading-relaxed max-w-xl">
                  Executing this script drops all temporary affiliate products and commits your storefront 100% to in-house manufacturing and retail fulfillment.
                </p>
                <button
                  type="button"
                  onClick={() => setFlipConfirmOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Open Phase 2 Flip Trigger...
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-slate-500">
                  Dual-Schema support: Amazon affiliate or Momo in-house retail
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold">
              {/* Type Switcher */}
              {!editingProductId && (
                <div className="flex rounded-2xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setNewProductType('affiliate')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      newProductType === 'affiliate'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Amazon Affiliate Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProductType('real')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      newProductType === 'real'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Momo Real Product
                  </button>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-slate-700">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Elevated Ceramic Bowl Duo"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="29.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700">Original / Strikethrough Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="39.99"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                  >
                    {CATEGORIES.slice(1).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700">Badge Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon's Choice / Momo Original"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* Conditional: Affiliate Link & Image */}
              {newProductType === 'affiliate' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-slate-700">Amazon Affiliate Outbound URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20"
                      value={productForm.affiliateLink}
                      onChange={(e) =>
                        setProductForm({ ...productForm, affiliateLink: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700">Product Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.imageUrl}
                      onChange={(e) =>
                        setProductForm({ ...productForm, imageUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-slate-700">Image URLs (comma-separated)</label>
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/1, https://images.unsplash.com/2"
                      value={productForm.images}
                      onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700">Stock Qty</label>
                      <input
                        type="number"
                        required
                        value={productForm.stockQuantity}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stockQuantity: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700">SKU Code</label>
                      <input
                        type="text"
                        required
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700">Weight (oz)</label>
                      <input
                        type="number"
                        required
                        value={productForm.weightInOunces}
                        onChange={(e) =>
                          setProductForm({ ...productForm, weightInOunces: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

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

      {/* ======================================================== */}
      {/* CONFIRMATION MODAL: PHASE 2 FLIP */}
      {/* ======================================================== */}
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
