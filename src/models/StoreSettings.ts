import mongoose, { Schema, Model } from 'mongoose';

export interface IStoreSettings {
  storeMode: 'hybrid' | 'affiliate_only' | 'retail_only';
  affiliateTag: string;
  freeShippingThreshold: number;
  announcementText: string;
  announcementActive: boolean;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeMode: {
      type: String,
      enum: ['hybrid', 'affiliate_only', 'retail_only'],
      default: 'hybrid',
    },
    affiliateTag: { type: String, default: 'momothecat-20' },
    freeShippingThreshold: { type: Number, default: 45 },
    announcementText: {
      type: String,
      default: '🐾 Welcome to Momo - The Cat! Free shipping on Momo Originals over $45. Use code MOMO10 for 10% off!',
    },
    announcementActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);

export default StoreSettings;
