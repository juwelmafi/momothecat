import mongoose, { Schema, Model } from 'mongoose';

export interface IRealProduct {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  images: string[];
  stockQuantity: number;
  sku: string;
  weightInOunces?: number;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  isFeatured?: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt?: Date;
}

const RealProductSchema = new Schema<IRealProduct>(
  {
    name: { type: String, required: [true, 'Product title is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice: { type: Number, min: 0 },
    description: { type: String, required: [true, 'Description is required'] },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    images: { type: [String], required: [true, 'At least one product image is required'] },
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    weightInOunces: { type: Number, default: 16 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    badge: { type: String, default: 'Momo Original' },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const RealProduct: Model<IRealProduct> =
  mongoose.models.RealProduct ||
  mongoose.model<IRealProduct>('RealProduct', RealProductSchema);

export default RealProduct;
