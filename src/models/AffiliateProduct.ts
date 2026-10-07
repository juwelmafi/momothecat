import mongoose, { Schema, Model } from 'mongoose';

export interface IAffiliateProduct {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  affiliateLink: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  description?: string;
  isFeatured?: boolean;
  createdAt?: Date;
}

const AffiliateProductSchema = new Schema<IAffiliateProduct>(
  {
    name: { type: String, required: [true, 'Product title is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    imageUrl: { type: String, required: [true, 'Image URL is required'] },
    affiliateLink: { type: String, required: [true, 'Affiliate link is required'] },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 85 },
    badge: { type: String, default: "Amazon's Choice" },
    description: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AffiliateProduct: Model<IAffiliateProduct> =
  mongoose.models.AffiliateProduct ||
  mongoose.model<IAffiliateProduct>('AffiliateProduct', AffiliateProductSchema);

export default AffiliateProduct;
