'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Sparkles,
  Eye,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Globe,
  Tag,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { Article, MergedProduct } from '@/lib/types';
import { ARTICLE_CATEGORIES } from '@/lib/initialData';
import CloudinaryImageUploader from './CloudinaryImageUploader';

interface Props {
  products: MergedProduct[];
  siteUrl: string;
}

export default function ArticleManager({ products, siteUrl }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [form, setForm] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    coverImage: string;
    author: string;
    readTime: string;
    isFeatured: boolean;
    status: 'published' | 'draft';
    tags: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    canonicalUrl: string;
    affiliateProductId: string;
    affiliateProductCtaText: string;
    affiliateProductUrl: string;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Product Reviews',
    coverImage: '',
    author: 'Momo Editorial Team',
    readTime: '5 min read',
    isFeatured: false,
    status: 'published',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    affiliateProductId: '',
    affiliateProductCtaText: 'Check Latest Price on Amazon',
    affiliateProductUrl: '',
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (e) {
      console.error('Error fetching articles:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) {
          setArticles(data.articles);
        }
      })
      .catch((e) => console.error('Error fetching articles:', e))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Product Reviews',
      coverImage: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=1200&q=80',
      author: 'Momo Editorial Team',
      readTime: '5 min read',
      isFeatured: false,
      status: 'published',
      tags: 'cat care, cat toys, amazon reviews',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      canonicalUrl: '',
      affiliateProductId: products[0]?._id || '',
      affiliateProductCtaText: 'Check Latest Price on Amazon',
      affiliateProductUrl: '',
    });
    setModalOpen(true);
    setMessage(null);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      coverImage: article.coverImage,
      author: article.author,
      readTime: article.readTime,
      isFeatured: Boolean(article.isFeatured),
      status: article.status,
      tags: article.tags?.join(', ') || '',
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || '',
      metaKeywords: article.metaKeywords || '',
      canonicalUrl: article.canonicalUrl || '',
      affiliateProductId: article.affiliateProductId || '',
      affiliateProductCtaText: article.affiliateProductCtaText || 'Check Latest Price on Amazon',
      affiliateProductUrl: article.affiliateProductUrl || '',
    });
    setModalOpen(true);
    setMessage(null);
  };

  const handleTitleChange = (newTitle: string) => {
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setForm((prev) => ({
      ...prev,
      title: newTitle,
      slug: editingArticle ? prev.slug : autoSlug,
      metaTitle: prev.metaTitle ? prev.metaTitle : newTitle ? `${newTitle} | Momo The Cat` : '',
    }));
  };

  const handleExcerptChange = (newExcerpt: string) => {
    setForm((prev) => ({
      ...prev,
      excerpt: newExcerpt,
      metaDescription: prev.metaDescription ? prev.metaDescription : newExcerpt,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      setMessage({ type: 'error', text: 'Please fill in Title, Excerpt, and Content.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = editingArticle ? `/api/articles/${editingArticle._id}` : '/api/articles';
      const method = editingArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: editingArticle ? 'Article updated successfully!' : 'Article published successfully!',
        });
        fetchArticles();
        setTimeout(() => {
          setModalOpen(false);
        }, 800);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save article.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error saving article.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (articleId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a._id !== articleId));
      } else {
        alert(data.error || 'Failed to delete article.');
      }
    } catch {
      alert('Error deleting article.');
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'All' || categoryFilter === 'All Guides'
        ? true
        : a.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus = statusFilter === 'all' ? true : a.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-[#FF6B35]">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900">
              Articles, Guides & SEO Product Reviews
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Publish high-ranking buying guides, cat health tips, and in-depth Amazon product
            breakdowns to dominate Google search and earn daily affiliate commissions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, excerpt, or keyword tag..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              All ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'published'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Published ({articles.filter((a) => a.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Drafts ({articles.filter((a) => a.status === 'draft').length})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <span className="text-slate-400 font-semibold shrink-0">Category:</span>
          {['All', ...ARTICLE_CATEGORIES.filter((c) => c !== 'All Guides')].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#FF6B35] text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#FF6B35] animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No articles match your filter</p>
            <p className="text-xs text-slate-400">Click &ldquo;Write New Article&rdquo; to publish your first SEO guide.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF9F7] border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Read Time / Views</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Affiliate Target</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((article) => {
                  const targetProd = products.find((p) => p._id === article.affiliateProductId);
                  return (
                    <tr key={article._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3 max-w-md">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {article.isFeatured && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Featured
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-slate-400 truncate">
                                /articles/{article.slug}
                              </span>
                            </div>
                            <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {article.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 font-extrabold text-[11px]">
                          {article.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                            <Clock className="w-3 h-3 text-[#FF6B35]" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Eye className="w-3 h-3" />
                            <span>{article.views || 0} pageviews</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            article.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                        {targetProd ? (
                          <div className="flex items-center gap-1.5 max-w-[160px] truncate text-[11px] font-semibold">
                            <ShoppingBag className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                            <span className="truncate">{targetProd.name}</span>
                          </div>
                        ) : article.affiliateProductUrl ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                            Direct Custom Link
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">None linked</span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-[#FF6B35] hover:bg-orange-50 rounded-lg transition-colors"
                            title="View on Live Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => openEditModal(article)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Article"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(article._id, article.title)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Article"
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
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-[#FBF9F7]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-slate-900">
                    {editingArticle ? 'Edit Article & SEO' : 'Create New Guide / Product Review'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Write high-converting content with direct affiliate links and custom SEO metadata.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {message && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. 7 Best Cat Scratching Posts of 2026 for Large Cats"
                    className="w-full px-4 py-3 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#FF6B35]"
                  >
                    {ARTICLE_CATEGORIES.filter((c) => c !== 'All Guides').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* URL Slug & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">URL Slug (Path)</label>
                    <span className="text-[10px] text-slate-400">
                      https://momothecat.vercel.app/articles/{form.slug || 'slug'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="best-cat-scratching-posts-large-cats"
                    className="w-full px-4 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Estimated Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Summary / Excerpt *</label>
                  <span className="text-[10px] text-slate-400">
                    Shown in article cards and Google search previews
                  </span>
                </div>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  placeholder="2-3 engaging sentences summarizing what the reader will learn or the products reviewed..."
                  className="w-full px-4 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-[#FF6B35]"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <CloudinaryImageUploader
                  label="Article Cover Image"
                  description="Primary landscape photo (1200x800 recommended for Google Discover and social cards)."
                  value={form.coverImage}
                  onChange={(url) => setForm({ ...form, coverImage: url })}
                />
              </div>

              {/* Full Content (Markdown Supported) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Full Content (Markdown Format) *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Supports ## Headings, Tables, Lists, &gt; Quotes
                  </span>
                </div>
                <textarea
                  rows={10}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder={`## Subheading Title\n\nParagraph text explaining the cat tips...\n\n### Comparison Table\n| Product | Rating | Price |\n| :--- | :--- | :--- |\n| Sisal Scratcher | 4.9/5 | $34.50 |\n\n> **Vet Tip:** Place near cat's favorite nap spot.`}
                  className="w-full px-4 py-3 bg-[#FBF9F7] border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 outline-none focus:border-[#FF6B35] leading-relaxed"
                />
              </div>

              {/* Target Affiliate Product Box */}
              <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FF6B35]" />
                  <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">
                    Affiliate Product Integration (High-Converting CTA Box)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Link Existing Store Product
                    </label>
                    <select
                      value={form.affiliateProductId}
                      onChange={(e) => setForm({ ...form, affiliateProductId: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
                    >
                      <option value="">-- No store product linked --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (${p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Button CTA Text</label>
                    <input
                      type="text"
                      value={form.affiliateProductCtaText}
                      onChange={(e) => setForm({ ...form, affiliateProductCtaText: e.target.value })}
                      placeholder="Check Latest Price on Amazon"
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Custom External Affiliate Link (Optional Override)
                  </label>
                  <input
                    type="url"
                    value={form.affiliateProductUrl}
                    onChange={(e) => setForm({ ...form, affiliateProductUrl: e.target.value })}
                    placeholder="https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                  <p className="text-[10px] text-slate-400">
                    If specified, clicking the button will automatically route with <code>rel=&quot;sponsored nofollow&quot;</code> to this link.
                  </p>
                </div>
              </div>

              {/* Publishing & Author Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Author Name</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Momo Editorial Team"
                    className="w-full px-3 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Publishing Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-3 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#FF6B35]"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Private)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Featured Spotlight</label>
                  <label className="flex items-center gap-2 p-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-[#FF6B35] rounded"
                    />
                    <span className="text-xs font-bold text-slate-800">Pin as Featured Guide</span>
                  </label>
                </div>
              </div>

              {/* Tags & Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tags / Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="cat scratchers, indoor cats, amazon reviews, save couch"
                  className="w-full px-3 py-2.5 bg-[#FBF9F7] border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-[#FF6B35]"
                />
              </div>

              {/* ADVANCED SEO FIELDS FOR GOOGLE RANKING */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#FF6B35]" />
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">
                      Search Engine Optimization (SEO) Fields for Google
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Rich Snippets Ready
                  </span>
                </div>

                {/* Live SERP Preview */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Google SERP Preview</p>
                  <p className="text-xs text-[#202124] font-medium truncate">
                    {siteUrl}/articles/{form.slug || 'slug'}
                  </p>
                  <h5 className="text-sm font-semibold text-[#1a0dab] hover:underline line-clamp-1">
                    {form.metaTitle || form.title || 'Article Title'}
                  </h5>
                  <p className="text-xs text-[#4d5156] line-clamp-2">
                    {form.metaDescription || form.excerpt || 'Article summary preview shown in Google results...'}
                  </p>
                </div>

                {/* Meta Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">SEO Meta Title</label>
                    <span className="text-[10px] text-slate-400">
                      {form.metaTitle.length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    placeholder="Title shown in browser tab and Google results"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">SEO Meta Description</label>
                    <span className="text-[10px] text-slate-400">
                      {form.metaDescription.length} / 160 characters
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    placeholder="Concise description enticing Google users to click your review"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Meta Keywords & Canonical */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Meta Keywords</label>
                    <input
                      type="text"
                      value={form.metaKeywords}
                      onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                      placeholder="cat scratcher reviews, sisal post"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Canonical URL Override</label>
                    <input
                      type="url"
                      value={form.canonicalUrl}
                      onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                      placeholder="Optional self-canonical override"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e04c00] text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{editingArticle ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
