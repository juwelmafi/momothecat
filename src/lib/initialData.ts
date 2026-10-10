import { AffiliateProduct, RealProduct, Order, Lead, StoreSettings } from './types';

export const INITIAL_AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    _id: 'aff_1',
    name: 'Smart Interactive Automatic Laser & Chirping Ball',
    price: 19.99,
    originalPrice: 28.99,
    category: 'Cat Toys',
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://www.amazon.com/dp/B08XJ893Q1?tag=momothecat-20',
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
    affiliateLink: 'https://www.amazon.com/dp/B09ABC4567?tag=momothecat-20',
    rating: 4.9,
    reviewCount: 3120,
    badge: "Amazon's Choice",
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
    affiliateLink: 'https://www.amazon.com/dp/B07UVW1234?tag=momothecat-20',
    rating: 4.8,
    reviewCount: 954,
    badge: 'Trending',
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

export const INITIAL_SETTINGS: StoreSettings = {
  storeMode: 'hybrid',
  affiliateTag: 'momothecat-20',
  freeShippingThreshold: 45,

  // SEO Fields
  metaTitle: 'Momo - The Cat | Amazon Affiliate Cat Store & Boutique',
  metaDescription:
    'Fresh Flavoured Cat Food & Toys. Discover top-rated Amazon Prime essentials and handcrafted Momo Originals.',
  metaKeywords:
    'cat toys, cat food, cat scratchers, cat beds, Pettie pet theme, Amazon affiliate cat products, Momo the cat',
  websiteFavicon:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/cropped-favicon-32x32.png',

  // Branding Fields
  websiteLogo:
    'https://petsdemos.wpenginepowered.com/pettie/wp-content/uploads/sites/4/2023/04/Pty-Amount-Logo-1.png',
  brandName: 'Momo',
  brandTagline: 'Amazon Cat Boutique',

  // Header & Announcement
  announcementText: 'Get 15% Off When You Spend $50+ W. Code: MOMO15',
  announcementCode: 'MOMO15',
  announcementActive: true,
  contactPhone: '(+1) 800-CAT-MOMO',
  contactEmail: 'hello@momothecat.shop',
  contactAddress: 'momothecat.shop · San Francisco, CA',

  // Hero Section
  heroSlide1Heading1: 'Fresh Flavoured',
  heroSlide1Heading2: 'Dog & Cat Food',
  heroSlide1Description:
    'Nutritious organic meals crafted specifically for feline and canine longevity, shiny coats, and vitality.',
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
