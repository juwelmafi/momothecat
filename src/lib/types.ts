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

export type StoreMode = 'hybrid' | 'affiliate_only' | 'retail_only';

export interface StoreSettings {
  storeMode: StoreMode;
  affiliateTag: string;
  freeShippingThreshold: number;
  announcementText: string;
  announcementActive: boolean;
}
