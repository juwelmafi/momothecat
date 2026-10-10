import mongoose, { Schema, Model } from 'mongoose';
import { StoreSettings } from '@/lib/types';

export type IStoreSettings = StoreSettings;

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeMode: {
      type: String,
      enum: ['hybrid', 'affiliate_only', 'retail_only'],
      default: 'hybrid',
    },
    affiliateTag: { type: String, default: 'momothecat-20' },
    freeShippingThreshold: { type: Number, default: 45 },

    // SEO Fields
    metaTitle: {
      type: String,
      default: 'Momo - The Cat | Amazon Affiliate Cat Store & Boutique',
    },
    metaDescription: {
      type: String,
      default:
        'Fresh Flavoured Cat Food & Toys. Discover top-rated Amazon Prime essentials and handcrafted Momo Originals.',
    },
    metaKeywords: {
      type: String,
      default:
        'cat toys, cat food, cat scratchers, cat beds, Pettie pet theme, Amazon affiliate cat products, Momo the cat',
    },
    websiteFavicon: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/cropped-favicon-32x32.png',
    },

    // Branding Fields
    websiteLogo: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Amount-Logo-1.png',
    },
    brandName: { type: String, default: 'Momo' },
    brandTagline: { type: String, default: 'Amazon Cat Boutique' },

    // Header & Announcement
    announcementText: {
      type: String,
      default: 'Get 15% Off When You Spend $50+ W. Code: MOMO15',
    },
    announcementCode: { type: String, default: 'MOMO15' },
    announcementActive: { type: Boolean, default: true },
    contactPhone: { type: String, default: '(+1) 800-CAT-MOMO' },
    contactEmail: { type: String, default: 'hello@momothecat.shop' },
    contactAddress: {
      type: String,
      default: 'momothecat.shop · San Francisco, CA',
    },

    // Hero Section
    heroSlide1Heading1: { type: String, default: 'Fresh Flavoured' },
    heroSlide1Heading2: { type: String, default: 'Dog & Cat Food' },
    heroSlide1Description: {
      type: String,
      default:
        'Nutritious organic meals crafted specifically for feline and canine longevity, shiny coats, and vitality.',
    },
    heroSlide1Badge: { type: String, default: 'GET 20% OFF' },
    heroSlide1ButtonText: { type: String, default: 'ORDER NOW' },

    heroSlide2Heading1: { type: String, default: 'Nutrition Rich' },
    heroSlide2Heading2: { type: String, default: 'Pure Cat Treats' },
    heroSlide2Description: {
      type: String,
      default:
        'Pure freeze-dried chicken, salmon fillets and organic catnip treats that your feline will leap across the room for.',
    },
    heroSlide2Badge: { type: String, default: 'GET 20% OFF' },
    heroSlide2ButtonText: { type: String, default: 'SHOP NOW' },

    // Products Section
    productsHeading: {
      type: String,
      default: 'Organic & Top-Rated Products',
    },
    productsSubheading: {
      type: String,
      default:
        'Select category to discover prime essentials and handcrafted comfort',
    },

    // Passion Section
    passionHeading: {
      type: String,
      default: 'Our Passion Is Providing Premium Cat Products',
    },
    passionDescription: {
      type: String,
      default:
        'Every toy, food recipe, and scratching post on Momo - The Cat is hand-curated from top-tier Amazon Prime sellers and tested for durability, safety, and feline delight. We connect you directly with the best Amazon cat deals with zero hassle.',
    },
    passionButtonText: { type: String, default: 'EXPLORE AMAZON PICKS' },

    // Deals Section
    dealsHeading: { type: String, default: 'Deals Ended Soon' },
    dealsDescription: {
      type: String,
      default:
        "Don't miss out on today's flash discounts! Save up to 40% on top-rated Amazon Prime cat toys, orthopedic beds, and organic treats before timers expire.",
    },
    dealsButtonText: { type: String, default: 'CLAIM AMAZON DEALS' },

    // Discounts Flash Banner
    discountsHeading: { type: String, default: 'Get Enticing Discounts' },
    discountsBadge: { type: String, default: '20% Offer' },
    discountsButtonText: { type: String, default: 'SHOP NOW' },

    // Testimonials Section
    testimonialsHeading: {
      type: String,
      default: 'Views Of Our Happy Customers',
    },

    // Footer & Newsletter
    newsletterHeading: {
      type: String,
      default: 'Get 15% Off Your Next Amazon Cat Haul',
    },
    newsletterDescription: {
      type: String,
      default:
        'Sign up for secret Amazon lightning deals, cat care guides, and exclusive discount codes.',
    },
    footerDescription: {
      type: String,
      default:
        'Premium Amazon affiliate cat products and hybrid boutique. Curating top-rated Amazon Prime essentials and feline favorites.',
    },
  },
  { timestamps: true }
);

const StoreSettingsModel: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);

export default StoreSettingsModel;
