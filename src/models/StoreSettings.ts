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
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
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

    // Custom Website Images (Full Storefront)
    heroSlide1PetImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-dog.png',
    },
    heroSlide1FoodPackImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-foodpack-2.png',
    },
    heroSlide1PlateImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Plate-1.png',
    },
    heroSlide1DiscountBadge: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Off-img.png',
    },
    heroSlide1HeadingIcon: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-1-Heading-img.png',
    },

    heroSlide2PetImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Home-1-Slider-3-1.png',
    },
    heroSlide2FoodPackImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Home-3-Slider-foodpack.png',
    },
    heroSlide2PlateImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Plate-1.png',
    },
    heroSlide2DiscountBadge: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Off-img.png',
    },
    heroSlide2HeadingIcon: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-1-Heading-img.png',
    },

    categoryArch1Image: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-Dog-Image-1.png',
    },
    categoryArch2Image: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-bird-Image-1.png',
    },
    categoryArch3Image: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-cat-Image-1-1.png',
    },

    passionBannerImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Grid-Sec-Img-a-1.png',
    },
    dealsBannerImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Dog-Food.png',
    },
    discountsBannerImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-dog.png',
    },

    promoCard1Image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    },
    promoCard2Image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
    },

    testimonial1Image: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-1.jpg',
    },
    testimonial2Image: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-2.jpg',
    },
    testimonial3Image: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-3.jpg',
    },

    newsletterPetImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Group-132587@2x.png',
    },
    footerPaymentBadgesImage: {
      type: String,
      default:
        'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Amount-Logo-1.png',
    },

    // Cloudinary Settings
    cloudinaryCloudName: { type: String, default: '' },
    cloudinaryApiKey: { type: String, default: '' },
    cloudinaryApiSecret: { type: String, default: '' },
    cloudinaryUploadPreset: { type: String, default: '' },
  },
  { timestamps: true }
);

const StoreSettingsModel: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);

export default StoreSettingsModel;
