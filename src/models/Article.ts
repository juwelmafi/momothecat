import mongoose, { Schema, Model } from 'mongoose';
import { Article } from '@/lib/types';

export type IArticle = Article;

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: [true, 'Article title is required'], trim: true },
    slug: {
      type: String,
      required: [true, 'Article slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: { type: String, required: [true, 'Excerpt is required'], trim: true },
    content: { type: String, required: [true, 'Content is required'] },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Product Reviews',
      trim: true,
      index: true,
    },
    coverImage: { type: String, required: [true, 'Cover image URL is required'] },
    author: { type: String, default: 'Momo Editorial Team' },
    readTime: { type: String, default: '5 min read' },
    isFeatured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
      index: true,
    },
    tags: { type: [String], default: [] },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    affiliateProductId: { type: String, default: '' },
    affiliateProductCtaText: { type: String, default: 'Check Latest Price on Amazon' },
    affiliateProductUrl: { type: String, default: '' },
    views: { type: Number, default: 0 },
    publishedAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

const ArticleModel: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default ArticleModel;
