export type ProductType = 'affiliate' | 'real';

export interface BaseProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface AffiliateProduct extends BaseProduct {
  type: 'affiliate';
  imageUrl: string;
  affiliateLink: string;
  darazLink?: string;
  platform?: 'amazon' | 'daraz' | 'both';
  targetRegion?: 'all' | 'bd_only' | 'global_only';
}

export interface RealProduct extends BaseProduct {
  type: 'real';
  images: string[];
  stockQuantity: number;
  sku: string;
  weightInOunces?: number;
  status: 'active' | 'draft' | 'archived';
}

export type MergedProduct = AffiliateProduct | RealProduct;

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'unfulfilled' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  email: string;
  source: string;
  discountCode: string;
  createdAt: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  readTime: string;
  isFeatured?: boolean;
  status: 'published' | 'draft';
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  affiliateProductId?: string;
  affiliateProductCtaText?: string;
  affiliateProductUrl?: string;
  views?: number;
  publishedAt: string;
  updatedAt?: string;
}

export type StoreMode = 'hybrid' | 'affiliate_only' | 'retail_only';

export interface StoreSettings {
  // Store Architecture Mode
  storeMode: StoreMode;
  affiliateTag: string;
  darazAffiliateTag?: string;
  freeShippingThreshold: number;

  // SEO & Webmaster Fields
  siteUrl?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  websiteFavicon: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  googleAnalyticsId?: string;
  openGraphDefaultImage?: string;
  articlesMetaTitle?: string;
  articlesMetaDescription?: string;
  articlesMetaKeywords?: string;

  // Branding Fields
  websiteLogo: string;
  footerLogo?: string;
  headerLogoWidth?: number;
  footerLogoWidth?: number;
  brandName: string;
  brandTagline: string;

  // Header & Announcement
  announcementText: string;
  announcementCode: string;
  announcementActive: boolean;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;

  // Hero Section
  heroSlide1Heading1: string;
  heroSlide1Heading2: string;
  heroSlide1Description: string;
  heroSlide1Badge: string;
  heroSlide1ButtonText: string;

  heroSlide2Heading1: string;
  heroSlide2Heading2: string;
  heroSlide2Description: string;
  heroSlide2Badge: string;
  heroSlide2ButtonText: string;

  // Products Section
  productsHeading: string;
  productsSubheading: string;

  // Passion Section
  passionHeading: string;
  passionDescription: string;
  passionButtonText: string;

  // Deals Section
  dealsHeading: string;
  dealsDescription: string;
  dealsButtonText: string;

  // Discounts Flash Banner
  discountsHeading: string;
  discountsBadge: string;
  discountsButtonText: string;

  // Testimonials Section
  testimonialsHeading: string;

  // Footer & Newsletter
  newsletterHeading: string;
  newsletterDescription: string;
  footerDescription: string;

  // Custom Website Images (Full Storefront)
  heroSlide1PetImage?: string;
  heroSlide1FoodPackImage?: string;
  heroSlide1PlateImage?: string;
  heroSlide1DiscountBadge?: string;
  heroSlide1HeadingIcon?: string;

  heroSlide2PetImage?: string;
  heroSlide2FoodPackImage?: string;
  heroSlide2PlateImage?: string;
  heroSlide2DiscountBadge?: string;
  heroSlide2HeadingIcon?: string;

  categoryArch1Image?: string;
  categoryArch2Image?: string;
  categoryArch3Image?: string;

  passionBannerImage?: string;
  dealsBannerImage?: string;
  discountsBannerImage?: string;

  promoCard1Image?: string;
  promoCard2Image?: string;

  testimonial1Image?: string;
  testimonial2Image?: string;
  testimonial3Image?: string;

  newsletterPetImage?: string;
  footerPaymentBadgesImage?: string;

  // Homepage Sections Customization (Shopify CMS)
  showHeroBanner?: boolean;
  showCategoryShowcase?: boolean;
  showPassionBanner?: boolean;
  showProductGrid?: boolean;
  showPromoCards?: boolean;
  showDealsBanner?: boolean;
  showSpotlight?: boolean;
  showTestimonials?: boolean;
  showDiscountsBanner?: boolean;
  showCuratedCollections?: boolean;
  showViralFavorites?: boolean;
  showInstagramFeed?: boolean;
  showSocialMedia?: boolean;
  showNewsletter?: boolean;
  homepageSectionsOrder?: string[];

  // Promo Cards Customization
  promoCard1Badge?: string;
  promoCard1Heading?: string;
  promoCard1Subheading?: string;
  promoCard1ButtonText?: string;
  promoCard2Badge?: string;
  promoCard2Heading?: string;
  promoCard2Subheading?: string;
  promoCard2ButtonText?: string;

  // Category Showcase Arches Customization
  categoryArch1Title?: string;
  categoryArch1Subtitle?: string;
  categoryArch2Title?: string;
  categoryArch2Subtitle?: string;
  categoryArch3Title?: string;
  categoryArch3Subtitle?: string;

  // Cloudinary Settings
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  cloudinaryUploadPreset?: string;
}

