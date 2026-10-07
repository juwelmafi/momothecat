import mongoose, { Schema, Model } from 'mongoose';

export interface ILead {
  email: string;
  source?: string;
  discountCode?: string;
  createdAt?: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: { type: String, default: 'footer_discount_10' },
    discountCode: { type: String, default: 'MOMO10' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
