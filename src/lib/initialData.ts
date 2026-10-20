import { AffiliateProduct, RealProduct, Order, Lead, StoreSettings, Article } from './types';

export const INITIAL_AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    _id: 'aff_1',
    name: 'Smart Interactive Automatic Laser & Chirping Ball',
    price: 19.99,
    originalPrice: 28.99,
    category: 'Cat Toys',
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
    platform: 'amazon',
    targetRegion: 'global_only',
    rating: 4.8,
    reviewCount: 1420,
    badge: "Amazon's Choice",
    description: '360-degree self-rotating ball with LED light and realistic bird chirping sounds. Keeps indoor cats actively exercising.',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    type: 'affiliate',
  },
  {
    _id: 'aff_2',
    name: 'Natural Sisal Cat Scratching Post & Perch',
    price: 34.50,
    originalPrice: 42.00,
    category: 'Scratchers & Trees',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.amazon.com/dp/B07XYZ9871?tag=momothecat-20',
    platform: 'amazon',
    targetRegion: 'global_only',
    rating: 4.9,
    reviewCount: 890,
    badge: 'Best Seller',
    description: 'Ultra-sturdy natural sisal column designed to endure rigorous claws and save your sofa. Includes hanging plush ball.',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    type: 'affiliate',
  },
  {
    _id: 'aff_3',
    name: 'Orthopedic Calming Donut Cuddle Cat Bed',
    price: 38.99,
    originalPrice: 49.99,
    category: 'Beds & Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.amazon.com/dp/B08N567891?tag=momothecat-20',
    platform: 'amazon',
    targetRegion: 'global_only',
    rating: 4.7,
    reviewCount: 2310,
    badge: 'Top Rated',
    description: 'Super-soft faux shag fur donut bed with raised rim providing head and neck support for anti-anxiety feline slumber.',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    type: 'affiliate',
  },
  {
    _id: 'aff_4',
    name: 'Ultra-Quiet Stainless Steel Cat Water Fountain (2.5L)',
    price: 27.99,
    originalPrice: 35.00,
    category: 'Cat Food & Treats',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.daraz.com.bd/catalog/?q=cat+water+fountain+stainless+steel',
    darazLink: 'https://www.daraz.com.bd/catalog/?q=cat+water+fountain+stainless+steel',
    platform: 'daraz',
    targetRegion: 'bd_only',
    rating: 4.9,
    reviewCount: 3120,
    badge: 'Daraz Pick',
    description: 'Hygienic 304 food-grade stainless steel with triple filtration system to encourage regular hydration and prevent kidney issues.',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    type: 'affiliate',
  },
  {
    _id: 'aff_5',
    name: 'Gentle Undercoat Deshedding Slicker Brush',
    price: 14.99,
    originalPrice: 19.99,
    category: 'Grooming & Care',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.daraz.com.bd/catalog/?q=cat+deshedding+brush',
    darazLink: 'https://www.daraz.com.bd/catalog/?q=cat+deshedding+brush',
    platform: 'daraz',
    targetRegion: 'bd_only',
    rating: 4.8,
    reviewCount: 954,
    badge: 'Daraz Pick',
    description: 'One-click self-cleaning button removes loose fur in seconds without scratching sensitive feline skin.',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    type: 'affiliate',
  },
  {
    _id: 'aff_6',
    name: 'Motion-Activated Interactive Feather Tumbler Toy',
    price: 23.50,
    originalPrice: 29.99,
    category: 'Cat Toys',
    imageUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.amazon.com/dp/B08KLM6789?tag=momothecat-20',
    platform: 'amazon',
    targetRegion: 'global_only',
    rating: 4.7,
    reviewCount: 742,
    badge: 'Popular',
    description: 'Irregular wobbly movements and fluttering natural feathers trigger your cat’s primal hunting instincts effortlessly.',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    type: 'affiliate',
  },
];

export const INITIAL_REAL_PRODUCTS: RealProduct[] = [
  {
    _id: 'real_1',
    name: 'Momo Signature Velvet Cloud Lounger Bed',
    price: 59.00,
    originalPrice: 75.00,
    category: 'Beds & Furniture',
    images: [
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    ],
    stockQuantity: 28,
    sku: 'MMC-BED-001',
    weightInOunces: 36,
    rating: 5.0,
    reviewCount: 48,
    badge: 'Momo Original',
    description: 'Handcrafted with bespoke Japanese micro-velvet, memory core foam, and removable machine-washable outer shell. Guaranteed the ultimate sleeping sanctuary.',
    isFeatured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'real',
  },
  {
    _id: 'real_2',
    name: 'Momo Ergonomic Elevated Ceramic Bowl Duo (Anti-Vomiting)',
    price: 34.00,
    originalPrice: 42.00,
    category: 'Cat Food & Treats',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    ],
    stockQuantity: 42,
    sku: 'MMC-BOWL-002',
    weightInOunces: 48,
    rating: 4.9,
    reviewCount: 36,
    badge: 'Momo Original',
    description: '15-degree tilted whisker-friendly heavy ceramic bowl pair set on natural bamboo stand. Reduces spinal strain and helps digestion.',
    isFeatured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'real',
  },
  {
    _id: 'real_3',
    name: 'Momo Organic Hand-Harvested Catnip Teaser Wand',
    price: 16.50,
    originalPrice: 20.00,
    category: 'Cat Toys',
    images: [
      'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    ],
    stockQuantity: 75,
    sku: 'MMC-TOY-003',
    weightInOunces: 8,
    rating: 5.0,
    reviewCount: 62,
    badge: 'Staff Pick',
    description: 'Made from renewable beech wood, strong braided linen string, and farm-grown 100% potent catnip buds sealed inside cotton canvas charms.',
    isFeatured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'real',
  },
  {
    _id: 'real_4',
    name: 'Momo Luxe Pastel Velvet Breakaway Collar w/ Peach Bell',
    price: 18.00,
    category: 'Collars & Accessories',
    images: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    ],
    stockQuantity: 55,
    sku: 'MMC-COL-004',
    weightInOunces: 4,
    rating: 4.9,
    reviewCount: 29,
    badge: 'Momo Original',
    description: 'Safety-certified quick-release buckle covered in buttery soft sage and coral velvet. Includes customized Momo brass charm.',
    isFeatured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'real',
  },
  {
    _id: 'real_5',
    name: 'Momo Modern Boho Cactus Sisal Scratching Tree & Hammock',
    price: 94.00,
    originalPrice: 119.00,
    category: 'Scratchers & Trees',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    ],
    stockQuantity: 12,
    sku: 'MMC-TREE-005',
    weightInOunces: 128,
    rating: 5.0,
    reviewCount: 19,
    badge: 'Limited Stock',
    description: 'Sculptural multi-tier cactus cat tree blending modern interior design with fun feline climbing branches and a deep suspended snooze hammock.',
    isFeatured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'real',
  },
  {
    _id: 'real_6',
    name: 'Momo Herbal Waterless Grooming Foam & Conditioning Mist',
    price: 22.00,
    category: 'Grooming & Care',
    images: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    ],
    stockQuantity: 0,
    sku: 'MMC-GRM-006',
    weightInOunces: 16,
    rating: 4.8,
    reviewCount: 15,
    badge: 'Sold Out',
    description: 'No-rinse stress-free cleansing mousse formulated with organic chamomile, aloe vera, and oat protein for shiny, allergen-reducing coats.',
    isFeatured: false,
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'real',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    _id: 'ord_1',
    orderNumber: 'MMC-8910',
    customer: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 234-5678',
      street: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'US',
    },
    items: [
      {
        productId: 'real_1',
        name: 'Momo Signature Velvet Cloud Lounger Bed',
        price: 59.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        sku: 'MMC-BED-001',
      },
      {
        productId: 'real_3',
        name: 'Momo Organic Hand-Harvested Catnip Teaser Wand',
        price: 16.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
        sku: 'MMC-TOY-003',
      },
    ],
    subtotal: 75.50,
    shippingFee: 0,
    discount: 7.55,
    total: 67.95,
    paymentStatus: 'paid',
    paymentMethod: 'stripe_card',
    fulfillmentStatus: 'processing',
    trackingNumber: 'USPS9400100000000000001234',
    trackingCarrier: 'USPS Priority',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'ord_2',
    orderNumber: 'MMC-8911',
    customer: {
      name: 'Liam Zhang',
      email: 'liam.z@example.com',
      phone: '+1 (555) 987-6543',
      street: '124 Conch Street',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'US',
    },
    items: [
      {
        productId: 'real_2',
        name: 'Momo Ergonomic Elevated Ceramic Bowl Duo (Anti-Vomiting)',
        price: 34.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
        sku: 'MMC-BOWL-002',
      },
    ],
    subtotal: 68.00,
    shippingFee: 0,
    discount: 0,
    total: 68.00,
    paymentStatus: 'paid',
    paymentMethod: 'stripe_apple_pay',
    fulfillmentStatus: 'shipped',
    trackingNumber: '1Z9999999999999999',
    trackingCarrier: 'UPS Ground',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    _id: 'lead_1',
    email: 'chloe.catlover@gmail.com',
    source: 'footer_discount_10',
    discountCode: 'MOMO10',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'lead_2',
    email: 'marcus.feline@outlook.com',
    source: 'newsletter_popup',
    discountCode: 'MOMO10',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: 'lead_3',
    email: 'emily.whisker@yahoo.com',
    source: 'footer_discount_10',
    discountCode: 'MOMO10',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];

export const DEFAULT_HOMEPAGE_SECTIONS_ORDER: string[] = [
  'hero',
  'categories',
  'passion',
  'products',
  'deals',
  'promo_cards',
  'spotlight',
  'testimonials',
  'discounts',
  'collections',
  'viral',
  'instagram',
  'social',
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeMode: 'hybrid',
  affiliateTag: 'momothecat-20',
  darazAffiliateTag: '',
  freeShippingThreshold: 45,

  // SEO & Webmaster Fields
  siteUrl: 'https://momothecat.vercel.app',
  metaTitle: 'Momo - The Cat | Premium Cat Essentials, Toys & Nutrition',
  metaDescription:
    'Explore top-rated cat scratchers, interactive toys, orthopedic beds, and organic cat food curated for healthy, happy indoor felines.',
  metaKeywords:
    'cat toys, cat food, cat scratchers, cat beds, cat water fountain, indoor cat enrichment, cat health guides, Momo the cat',
  websiteFavicon:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/cropped-favicon-32x32.png',
  googleSiteVerification: '',
  bingSiteVerification: '',
  googleAnalyticsId: '',
  openGraphDefaultImage:
    'https://res.cloudinary.com/ccavbngu/image/upload/v1791708449/momothecat/website/momo_logo_paw_v1.png',
  articlesMetaTitle: 'Cat Care Guides, Tips & Product Reviews | Momo The Cat',
  articlesMetaDescription:
    'Explore expert cat product reviews, tested toys, health tips, and buyer guides curated to keep indoor cats healthy and playful.',
  articlesMetaKeywords: 'cat care, cat reviews, best cat toys 2026, cat health, pet guides',

  // Branding Fields
  websiteLogo:
    'https://res.cloudinary.com/ccavbngu/image/upload/v1791708449/momothecat/website/momo_logo_paw_v1.png',
  footerLogo: '',
  headerLogoWidth: 150,
  footerLogoWidth: 150,
  brandName: 'Momo',
  brandTagline: 'Amazon Cat Boutique',

  // Header & Announcement
  announcementText: 'Get 15% Off When You Spend $50+ W. Code: MOMO15',
  announcementCode: 'MOMO15',
  announcementActive: true,
  contactPhone: '',
  contactEmail: '',
  contactAddress: 'momothecat.shop · San Francisco, CA',

  // Hero Section
  heroSlide1Heading1: 'Fresh Flavoured',
  heroSlide1Heading2: 'Organic Cat Food',
  heroSlide1Description:
    'Nutritious organic meals crafted specifically for feline longevity, shiny coats, digestive health, and everyday vitality.',
  heroSlide1Badge: 'GET 20% OFF',
  heroSlide1ButtonText: 'ORDER NOW',

  heroSlide2Heading1: 'Nutrition Rich',
  heroSlide2Heading2: 'Pure Cat Treats',
  heroSlide2Description:
    'Pure freeze-dried chicken, salmon fillets and organic catnip treats that your feline will leap across the room for.',
  heroSlide2Badge: 'GET 20% OFF',
  heroSlide2ButtonText: 'SHOP NOW',

  // Products Section
  productsHeading: 'Organic & Top-Rated Products',
  productsSubheading: 'Select category to discover prime essentials and handcrafted comfort',

  // Passion Section
  passionHeading: 'Our Passion Is Providing Premium Cat Products',
  passionDescription:
    'Every toy, food recipe, and scratching post on Momo - The Cat is hand-curated from top-tier Amazon Prime sellers and tested for durability, safety, and feline delight. We connect you directly with the best Amazon cat deals with zero hassle.',
  passionButtonText: 'EXPLORE AMAZON PICKS',

  // Deals Section
  dealsHeading: 'Deals Ended Soon',
  dealsDescription:
    "Don't miss out on today's flash discounts! Save up to 40% on top-rated Amazon Prime cat toys, orthopedic beds, and organic treats before timers expire.",
  dealsButtonText: 'CLAIM AMAZON DEALS',

  // Discounts Flash Banner
  discountsHeading: 'Get Enticing Discounts',
  discountsBadge: '20% Offer',
  discountsButtonText: 'SHOP NOW',

  // Testimonials Section
  testimonialsHeading: 'Views Of Our Happy Customers',

  // Footer & Newsletter
  newsletterHeading: 'Get 15% Off Your Next Amazon Cat Haul',
  newsletterDescription:
    'Sign up for secret Amazon lightning deals, cat care guides, and exclusive discount codes.',
  footerDescription:
    'Premium Amazon affiliate cat products and hybrid boutique. Curating top-rated Amazon Prime essentials and feline favorites.',

  // Custom Website Images (Full Storefront)
  heroSlide1PetImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-dog.png',
  heroSlide1FoodPackImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-foodpack-2.png',
  heroSlide1PlateImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Plate-1.png',
  heroSlide1DiscountBadge:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Off-img.png',
  heroSlide1HeadingIcon:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-1-Heading-img.png',

  heroSlide2PetImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Home-1-Slider-3-1.png',
  heroSlide2FoodPackImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Home-3-Slider-foodpack.png',
  heroSlide2PlateImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Plate-1.png',
  heroSlide2DiscountBadge:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-Off-img.png',
  heroSlide2HeadingIcon:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-1-Heading-img.png',

  categoryArch1Image:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-Dog-Image-1.png',
  categoryArch2Image:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-bird-Image-1.png',
  categoryArch3Image:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/Pty-cat-Image-1-1.png',

  passionBannerImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Grid-Sec-Img-a-1.png',
  dealsBannerImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Dog-Food.png',
  discountsBannerImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Home-1-Slider-dog.png',

  promoCard1Image:
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
  promoCard2Image:
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',

  testimonial1Image:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-1.jpg',
  testimonial2Image:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-2.jpg',
  testimonial3Image:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/05/home-testimonial-3.jpg',

  newsletterPetImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Group-132587@2x.png',
  footerPaymentBadgesImage:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Amount-Logo-1.png',

  // Homepage Sections Customization (Shopify CMS Mode)
  showHeroBanner: true,
  showCategoryShowcase: true,
  showPassionBanner: true,
  showProductGrid: true,
  showPromoCards: false,
  showDealsBanner: false,
  showSpotlight: false,
  showTestimonials: true,
  showDiscountsBanner: true,
  showCuratedCollections: false,
  showViralFavorites: false,
  showInstagramFeed: true,
  showSocialMedia: true,
  showNewsletter: true,
  homepageSectionsOrder: [
    'hero',
    'categories',
    'passion',
    'products',
    'promo_cards',
    'spotlight',
    'testimonials',
    'discounts',
    'collections',
    'viral',
    'instagram',
    'social',
  ],

  // Promo Cards Customization
  promoCard1Badge: 'Deals Ended Soon',
  promoCard1Heading: 'Save Up To 40% On Momo Loungers & Scratchers',
  promoCard1Subheading: 'Limited stock on our hand-finished velvet beds and sisal climbers.',
  promoCard1ButtonText: 'Buy Now',
  promoCard2Badge: '20% Flash Offer',
  promoCard2Heading: 'Get Enticing Discounts for Your Feline Friend',
  promoCard2Subheading: 'Amazon Prime top-rated interactive toys with guaranteed next-day delivery.',
  promoCard2ButtonText: 'Shop Amazon Picks',

  // Category Showcase Arches Customization
  categoryArch1Title: 'Dog Treats & Food',
  categoryArch1Subtitle: 'Nutritious & Delicious',
  categoryArch2Title: 'Active Toys & Play',
  categoryArch2Subtitle: 'Interactive Teasers',
  categoryArch3Title: 'Royal Cat Comfort',
  categoryArch3Subtitle: 'Beds & Scratchers',

  // Cloudinary Settings
  cloudinaryCloudName: '',
  cloudinaryApiKey: '',
  cloudinaryApiSecret: '',
  cloudinaryUploadPreset: '',
};

export const CATEGORIES = [
  'All Products',
  'Cat Toys',
  'Beds & Furniture',
  'Scratchers & Trees',
  'Cat Food & Treats',
  'Grooming & Care',
  'Collars & Accessories',
];

export const ARTICLE_CATEGORIES = [
  'All Guides',
  'Product Reviews',
  'Buyer\'s Guides',
  'Cat Health & Care',
  'Behavior & Training',
];

export const INITIAL_ARTICLES: Article[] = [
  {
    _id: 'art_1',
    title: '7 Best Cat Scratching Posts of 2026 for Large Cats (Tested & Reviewed)',
    slug: 'best-cat-scratching-posts-large-cats',
    excerpt:
      'Stop your couch from being shredded. We tested 7 top-rated sisal scratching posts and heavy-duty cat trees for stability, claw resistance, and large cat durability.',
    category: 'Product Reviews',
    coverImage:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    author: 'Momo Editorial Team',
    readTime: '6 min read',
    isFeatured: true,
    status: 'published',
    tags: ['cat scratchers', 'sisal posts', 'amazon reviews', 'large cats'],
    metaTitle: '7 Best Cat Scratching Posts for Large Cats (2026 Review)',
    metaDescription:
      'Looking for a durable, non-wobble cat scratching post? We review the top 7 heavy-duty sisal posts on Amazon that save your furniture from aggressive claws.',
    metaKeywords:
      'best cat scratching post, heavy duty cat tree, sisal scratching post, large cat scratcher, save sofa cat scratching',
    affiliateProductId: 'aff_2',
    affiliateProductCtaText: 'Check Price on Amazon',
    affiliateProductUrl: 'https://www.amazon.com/dp/B07XYZ9871?tag=momothecat-20',
    views: 412,
    publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    content: `## Why Standard Scratching Posts Fail With Big Cats

If your cat weighs over 10 pounds (4.5 kg), standard budget scratchers are a hazard. When a heavy cat stretches their full spine to dig in their claws, flimsy cardboard posts tip over, terrifying the cat and sending them straight back to shredding your upholstered sofa or dining chairs.

Feline scratching is not behavioral spite — it is an anatomical necessity:
* **Shedding the outer claw husk:** Scratching removes dead layers to reveal sharp new points.
* **Scent marking:** Scent glands in their paw pads claim vertical territory.
* **Spinal decompression:** Full-body stretching relieves tension across the shoulder blades.

---

### Comparison: Top Sisal Scratchers for Heavy Claws

| Product Name | Best For | Height | Material | Our Rating |
| :--- | :--- | :--- | :--- | :--- |
| **Natural Sisal Post & Perch** | Heavy Breeds / High Durability | 32 inches | Natural Sisal Rope & Wood Base | 4.9 / 5 |
| **Pioneer Pet SmartCat Ultimate** | Tall Vertical Stretch | 35 inches | Woven Sisal Matting | 4.8 / 5 |
| **Catit Style Wide Lounge** | Horizontal Scratchers | Flat Bed | Recycled Cardboard | 4.6 / 5 |

---

### Our #1 Recommendation: Natural Sisal Heavy-Duty Column

After testing for 4 weeks with two adult Maine Coons and a vigorous British Shorthair, the **Natural Sisal Scratching Post & Perch** delivered unbeatable stability.

#### Pros & Highlights:
- **Zero wobble base:** Weighted 16-inch square base with anti-skid rubber feet.
- **Natural, unbleached sisal:** Endures fierce claw shredding without messy fibers scattering across your living room rug.
- **Top watchtower perch:** Allows cats to lounge and survey their domain immediately after scratching.

#### Watch Outs:
- Taller footprint than cheap grocery store cardboard alternatives.

> **Vet Tip:** Place the post within 3 feet of your cat's favorite sleeping spot. Cats almost always stretch and claw the moment they wake up!`,
  },
  {
    _id: 'art_2',
    title: 'Do Cat Water Fountains Really Prevent Kidney Disease? Vet Insights & Top Picks',
    slug: 'do-cat-water-fountains-prevent-kidney-disease',
    excerpt:
      'Felines are notoriously poor drinkers due to desert ancestry. Learn how circulating, triple-filtered stainless steel fountains increase water intake and safeguard kidney longevity.',
    category: 'Cat Health & Care',
    coverImage:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80',
    author: 'Dr. Sarah Lin, DVM & Momo Team',
    readTime: '5 min read',
    isFeatured: true,
    status: 'published',
    tags: ['cat hydration', 'water fountain', 'kidney health', 'cat health'],
    metaTitle: 'Do Cat Water Fountains Prevent Kidney Disease? Vet Guide',
    metaDescription:
      'Discover why cats refuse still water bowls and how circulating stainless steel water fountains prevent feline chronic kidney disease and urinary tract blockages.',
    metaKeywords:
      'cat water fountain, feline kidney disease prevention, stainless steel pet fountain, cat hydration tips',
    affiliateProductId: 'aff_4',
    affiliateProductCtaText: 'Check Price on Amazon',
    affiliateProductUrl: 'https://www.amazon.com/dp/B09ABC4567?tag=momothecat-20',
    views: 680,
    publishedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    content: `## The Feline Hydration Dilemma

Domestic cats evolved from the African wildcat (*Felis lybica*), an arid desert hunter that obtained nearly all its moisture from fresh prey. Because of this evolutionary trait, cats have an exceptionally **low natural thirst drive**. 

When fed dry commercial kibble (which contains only 8-10% water), most cats live in a state of **mild, chronic dehydration**. Over years, this puts tremendous stress on feline kidneys, making **Chronic Kidney Disease (CKD)** and **Feline Lower Urinary Tract Disease (FLUTD)** the leading causes of illness in cats over age 7.

---

### Why Still Water Bowls Disgust Your Cat

Have you ever caught your cat dipping their paw into the water dish or drinking straight from a dripping bathroom faucet? 

In the wild, **stagnant water equals bacterial contamination**. Cats possess an instinctive aversion to standing water in a bowl. Moving, babbling water signals oxygenation and safety.

### Plastic vs. Stainless Steel: The Hidden Danger

* **Plastic Fountains:** Develop microscopic scratches over time where feline acne-causing bacteria thrive.
* **304 Food-Grade Stainless Steel:** Completely non-porous, dishwasher safe, eliminates chin acne, and keeps water noticeably cooler.

---

### Our Top Pick: Ultra-Quiet Stainless Steel Fountain (2.5L)

With an ultra-quiet submerged pump that operates below 20 decibels (quieter than a whisper), this unit maintains a continuous filtered stream that entices even the most reluctant drinkers.

#### Features That Impressed Our Vets:
- **Triple-action filtration:** Activated carbon and ion-exchange resin remove hair, heavy metals, and chlorine taste.
- **Emergency reservoir lid:** Holds 150ml of water on top even during sudden power outages.
- **BPA-free & rust-resistant 304 steel.**`,
  },
  {
    _id: 'art_3',
    title: 'How to Stop Indoor Cats from Boredom & Furniture Scratching: 5 Tested Tricks',
    slug: 'how-to-stop-indoor-cat-boredom-scratching',
    excerpt:
      'Indoor cats need daily mental enrichment to prevent aggressive scratching and midnight zoomies. Discover automatic toys and mental stimulation tricks that work.',
    category: 'Behavior & Training',
    coverImage:
      'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=1200&q=80',
    author: 'Momo Editorial Team',
    readTime: '4 min read',
    isFeatured: false,
    status: 'published',
    tags: ['indoor cats', 'cat toys', 'boredom', 'behavior training'],
    metaTitle: 'Stop Indoor Cat Boredom & Furniture Scratching: 5 Tips',
    metaDescription:
      'Combat feline boredom and midnight zoomies with these 5 vet-backed enrichment tips and interactive toys for active indoor cats.',
    metaKeywords:
      'indoor cat enrichment, stop cat scratching couch, interactive cat toys, cat boredom cures, automatic laser ball',
    affiliateProductId: 'aff_1',
    affiliateProductCtaText: 'Check Price on Amazon',
    affiliateProductUrl: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
    views: 295,
    publishedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    content: `## Is Your Indoor Cat Secretly Bored?

While indoor living keeps cats safe from cars and predators, a routine environment with zero predatory stimulation can lead to chronic boredom. Common warning signs include:

1. **Destructive sofa or carpet clawing**
2. **Excessive fur over-grooming or tail chasing**
3. **Explosive midnight zoomies across your bed**
4. **Begging for food when not actually hungry**

---

### 5 Proven Enrichment Strategies

#### 1. Introduce Unpredictable Movement Toys
Cats do not get excited by stationary stuffed mice. Their predatory instinct is wired for **random, errant darting movements** mimicking a mouse or injured bug. The **Smart Interactive Automatic Laser Ball** rolls autonomously, reverses direction when bumping into obstacles, and emits subtle bird chirping sounds.

#### 2. Rotate Toys on a 7-Day Cycle
Never leave 20 toys lying on the living room floor. Put 15 away in a sealed bin with dried catnip and rotate 3 out every Monday. To your cat, they are brand new prey!

#### 3. Create Vertical Cat Highways
Cats evaluate territory vertically, not horizontally. A sturdy scratching post near a window sill allows them to survey outdoor birds safely.

#### 4. Puzzle Feeders for Kibble
Instead of free-feeding from an open bowl, use an interactive snuffle mat or treat ball. It burns mental energy and mirrors true hunting behavior.`,
  },
];

