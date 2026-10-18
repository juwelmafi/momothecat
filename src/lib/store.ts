import mongoose from 'mongoose';
import { connectToDatabase } from './mongodb';
import AffiliateProductModel from '@/models/AffiliateProduct';
import RealProductModel from '@/models/RealProduct';
import OrderModel from '@/models/Order';
import LeadModel from '@/models/Lead';
import StoreSettingsModel from '@/models/StoreSettings';
import ArticleModel from '@/models/Article';
import {
  AffiliateProduct,
  RealProduct,
  MergedProduct,
  Order,
  Lead,
  StoreSettings,
  Article,
} from './types';
import {
  INITIAL_AFFILIATE_PRODUCTS,
  INITIAL_REAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_LEADS,
  INITIAL_SETTINGS,
  INITIAL_ARTICLES,
} from './initialData';

// Fallback in-memory state
interface MemoryStore {
  affiliateProducts: AffiliateProduct[];
  realProducts: RealProduct[];
  orders: Order[];
  leads: Lead[];
  articles: Article[];
  settings: StoreSettings;
  initialized: boolean;
}

declare global {
  var memoryStore: MemoryStore | undefined;
}

if (!global.memoryStore) {
  global.memoryStore = {
    affiliateProducts: [...INITIAL_AFFILIATE_PRODUCTS],
    realProducts: [...INITIAL_REAL_PRODUCTS],
    orders: [...INITIAL_ORDERS],
    leads: [...INITIAL_LEADS],
    articles: [...INITIAL_ARTICLES],
    settings: { ...INITIAL_SETTINGS },
    initialized: true,
  };
}

const mem = global.memoryStore;

export async function getStoreSettings(): Promise<StoreSettings> {
  const db = await connectToDatabase();
  if (db) {
    try {
      let settings = await StoreSettingsModel.findOne().lean();
      if (!settings) {
        const created = await StoreSettingsModel.create(INITIAL_SETTINGS);
        settings = created.toObject();
      }
      return JSON.parse(
        JSON.stringify({
          ...INITIAL_SETTINGS,
          ...(settings as any),
        })
      );
    } catch (e) {
      console.error('Error fetching settings from DB:', e);
    }
  }
  return JSON.parse(JSON.stringify({ ...INITIAL_SETTINGS, ...mem.settings }));
}

export async function updateStoreSettings(newSettings: Partial<StoreSettings>): Promise<StoreSettings> {
  // Normalize storeMode aliases if provided
  if (newSettings.storeMode) {
    const rawMode = newSettings.storeMode as string;
    if (rawMode === 'affiliate') newSettings.storeMode = 'affiliate_only';
    else if (rawMode === 'real') newSettings.storeMode = 'retail_only';
    else if (rawMode === 'dual') newSettings.storeMode = 'hybrid';
  }

  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await StoreSettingsModel.findOneAndUpdate(
        {},
        { $set: newSettings },
        { new: true, upsert: true }
      ).lean();
      return JSON.parse(
        JSON.stringify({
          ...INITIAL_SETTINGS,
          ...(updated as any),
        })
      );
    } catch (e) {
      console.error('Error updating settings in DB:', e);
    }
  }
  mem.settings = { ...INITIAL_SETTINGS, ...mem.settings, ...newSettings };
  return JSON.parse(JSON.stringify(mem.settings));
}

export async function getMergedProducts(options?: {
  category?: string;
  search?: string;
  type?: 'all' | 'affiliate' | 'real';
  featuredOnly?: boolean;
  ignoreStoreMode?: boolean;
  country?: string;
}): Promise<MergedProduct[]> {
  const db = await connectToDatabase();
  let affiliateList: AffiliateProduct[] = [];
  let realList: RealProduct[] = [];

  if (db) {
    try {
      // Auto seed if empty
      const affCount = await AffiliateProductModel.countDocuments();
      if (affCount === 0) {
        const affToInsert = INITIAL_AFFILIATE_PRODUCTS.map(({ _id: _unusedId, type: _unusedType, ...rest }) => rest);
        await AffiliateProductModel.insertMany(affToInsert);
      }
      const realCount = await RealProductModel.countDocuments();
      if (realCount === 0) {
        const realToInsert = INITIAL_REAL_PRODUCTS.map(({ _id: _unusedId, type: _unusedType, ...rest }) => rest);
        await RealProductModel.insertMany(realToInsert);
      }

      const affDocs = await AffiliateProductModel.find().lean();
      affiliateList = affDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        price: doc.price,
        originalPrice: doc.originalPrice,
        category: doc.category,
        imageUrl: doc.imageUrl,
        affiliateLink: doc.affiliateLink,
        darazLink: doc.darazLink || '',
        platform: doc.platform || 'amazon',
        targetRegion: doc.targetRegion || 'all',
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        badge: doc.badge,
        description: doc.description,
        isFeatured: doc.isFeatured,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
        type: 'affiliate' as const,
      }));

      const realDocs = await RealProductModel.find({ status: { $ne: 'archived' } }).lean();
      realList = realDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        price: doc.price,
        originalPrice: doc.originalPrice,
        category: doc.category,
        images: doc.images || [],
        stockQuantity: doc.stockQuantity,
        sku: doc.sku,
        weightInOunces: doc.weightInOunces,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        badge: doc.badge,
        description: doc.description,
        isFeatured: doc.isFeatured,
        status: doc.status,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
        type: 'real' as const,
      }));
    } catch (e) {
      console.error('Error fetching products from MongoDB, falling back:', e);
      affiliateList = mem.affiliateProducts;
      realList = mem.realProducts;
    }
  } else {
    affiliateList = mem.affiliateProducts;
    realList = mem.realProducts;
  }

  const settings = await getStoreSettings();

  // Respect storeMode unless explicitly ignored (e.g. for admin catalog management)
  let merged: MergedProduct[] = [];
  if (options?.ignoreStoreMode) {
    merged = [...realList, ...affiliateList];
  } else if (settings.storeMode === 'affiliate_only') {
    merged = [...affiliateList];
  } else if (settings.storeMode === 'retail_only') {
    merged = [...realList];
  } else {
    merged = [...realList, ...affiliateList];
  }

  // Filter by requested product type
  if (options?.type === 'affiliate') {
    merged = merged.filter((p) => p.type === 'affiliate');
  } else if (options?.type === 'real') {
    merged = merged.filter((p) => p.type === 'real');
  }

  // Filter by category
  if (options?.category && options.category !== 'All' && options.category !== 'All Products') {
    merged = merged.filter(
      (p) => p.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  // Filter by search keyword
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    merged = merged.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  // Filter by featured
  if (options?.featuredOnly) {
    merged = merged.filter((p) => p.isFeatured);
  }

  // Filter by country / targetRegion
  if (options?.country) {
    const isBD = options.country.toUpperCase() === 'BD';
    merged = merged.filter((p) => {
      if (p.type !== 'affiliate') return true;
      const aff = p as AffiliateProduct;
      const region = aff.targetRegion || 'all';
      if (isBD) {
        return region !== 'global_only';
      } else {
        return region !== 'bd_only';
      }
    });
  }

  return merged;
}

export async function getProductById(id: string): Promise<MergedProduct | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const real = await RealProductModel.findById(id).lean();
        if (real) {
          return {
            _id: (real as any)._id.toString(),
            name: real.name,
            price: real.price,
            originalPrice: real.originalPrice,
            category: real.category,
            images: real.images,
            stockQuantity: real.stockQuantity,
            sku: real.sku,
            weightInOunces: real.weightInOunces,
            rating: real.rating || 5,
            reviewCount: real.reviewCount || 0,
            badge: real.badge,
            description: real.description,
            isFeatured: real.isFeatured,
            status: real.status,
            createdAt: real.createdAt?.toISOString() || new Date().toISOString(),
            type: 'real',
          };
        }

        const aff = await AffiliateProductModel.findById(id).lean();
        if (aff) {
          return {
            _id: (aff as any)._id.toString(),
            name: aff.name,
            price: aff.price,
            originalPrice: aff.originalPrice,
            category: aff.category,
            imageUrl: aff.imageUrl,
            affiliateLink: aff.affiliateLink,
            darazLink: aff.darazLink || '',
            platform: aff.platform || 'amazon',
            targetRegion: aff.targetRegion || 'all',
            rating: aff.rating || 4.8,
            reviewCount: aff.reviewCount || 100,
            badge: aff.badge,
            description: aff.description || '',
            isFeatured: aff.isFeatured,
            createdAt: aff.createdAt?.toISOString() || new Date().toISOString(),
            type: 'affiliate',
          };
        }
      }
    } catch {
      // Fall through to memory
    }
  }

  const realMem = mem.realProducts.find((p) => p._id === id);
  if (realMem) return realMem;
  const affMem = mem.affiliateProducts.find((p) => p._id === id);
  if (affMem) return affMem;

  return null;
}

export async function createAffiliateProduct(
  data: Omit<AffiliateProduct, '_id' | 'createdAt' | 'type'>
): Promise<AffiliateProduct> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc = await AffiliateProductModel.create(data);
      return {
        _id: doc._id.toString(),
        name: doc.name,
        price: doc.price,
        originalPrice: doc.originalPrice,
        category: doc.category,
        imageUrl: doc.imageUrl,
        affiliateLink: doc.affiliateLink,
        darazLink: doc.darazLink || '',
        platform: doc.platform || 'amazon',
        targetRegion: doc.targetRegion || 'all',
        rating: doc.rating || 4.8,
        reviewCount: doc.reviewCount || 0,
        badge: doc.badge,
        description: doc.description || '',
        isFeatured: doc.isFeatured,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
        type: 'affiliate',
      };
    } catch (e) {
      console.error('Error creating AffiliateProduct in DB:', e);
    }
  }

  const newProduct: AffiliateProduct = {
    ...data,
    _id: 'aff_' + Date.now(),
    createdAt: new Date().toISOString(),
    type: 'affiliate',
  };
  mem.affiliateProducts.unshift(newProduct);
  return newProduct;
}

export async function createRealProduct(
  data: Omit<RealProduct, '_id' | 'createdAt' | 'type'>
): Promise<RealProduct> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc = await RealProductModel.create(data);
      return {
        _id: doc._id.toString(),
        name: doc.name,
        price: doc.price,
        originalPrice: doc.originalPrice,
        description: doc.description,
        category: doc.category,
        images: doc.images,
        stockQuantity: doc.stockQuantity,
        sku: doc.sku,
        weightInOunces: doc.weightInOunces,
        rating: doc.rating || 5.0,
        reviewCount: doc.reviewCount || 0,
        badge: doc.badge,
        isFeatured: doc.isFeatured,
        status: doc.status || 'active',
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
        type: 'real',
      };
    } catch (e) {
      console.error('Error creating RealProduct in DB:', e);
    }
  }

  const newProduct: RealProduct = {
    ...data,
    _id: 'real_' + Date.now(),
    createdAt: new Date().toISOString(),
    type: 'real',
  };
  mem.realProducts.unshift(newProduct);
  return newProduct;
}

export interface UpdateProductData {
  name?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  badge?: string;
  description?: string;
  isFeatured?: boolean;
  imageUrl?: string;
  affiliateLink?: string;
  darazLink?: string;
  platform?: 'amazon' | 'daraz' | 'both';
  targetRegion?: 'all' | 'bd_only' | 'global_only';
  images?: string[] | string;
  stockQuantity?: number;
  sku?: string;
  weightInOunces?: number;
  status?: 'active' | 'draft' | 'archived';
}

export async function updateProduct(
  id: string,
  type: 'affiliate' | 'real',
  data: UpdateProductData
): Promise<MergedProduct | null> {
  const db = await connectToDatabase();
  if (db && mongoose.Types.ObjectId.isValid(id)) {
    try {
      if (type === 'affiliate') {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name.trim();
        if (data.price !== undefined) updateData.price = Number(data.price);
        if (data.originalPrice !== undefined)
          updateData.originalPrice = data.originalPrice ? Number(data.originalPrice) : undefined;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.affiliateLink !== undefined) updateData.affiliateLink = data.affiliateLink;
        if (data.darazLink !== undefined) updateData.darazLink = data.darazLink;
        if (data.platform !== undefined) updateData.platform = data.platform;
        if (data.targetRegion !== undefined) updateData.targetRegion = data.targetRegion;
        if (data.badge !== undefined) updateData.badge = data.badge;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);

        const updated = await AffiliateProductModel.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        ).lean();

        if (updated) {
          const formatted: AffiliateProduct = {
            _id: (updated as any)._id.toString(),
            name: updated.name,
            price: updated.price,
            originalPrice: updated.originalPrice,
            category: updated.category,
            imageUrl: updated.imageUrl,
            affiliateLink: updated.affiliateLink,
            darazLink: updated.darazLink || '',
            platform: updated.platform || 'amazon',
            targetRegion: updated.targetRegion || 'all',
            rating: updated.rating || 4.8,
            reviewCount: updated.reviewCount || 0,
            badge: updated.badge,
            description: updated.description || '',
            isFeatured: updated.isFeatured,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            type: 'affiliate',
          };
          const idx = mem.affiliateProducts.findIndex((p) => p._id === id);
          if (idx !== -1) mem.affiliateProducts[idx] = formatted;
          return formatted;
        }
      } else {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name.trim();
        if (data.price !== undefined) updateData.price = Number(data.price);
        if (data.originalPrice !== undefined)
          updateData.originalPrice = data.originalPrice ? Number(data.originalPrice) : undefined;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.images !== undefined) {
          updateData.images = Array.isArray(data.images) ? data.images : [data.images];
        }
        if (data.stockQuantity !== undefined) updateData.stockQuantity = Number(data.stockQuantity);
        if (data.sku !== undefined) updateData.sku = String(data.sku).trim().toUpperCase();
        if (data.weightInOunces !== undefined) updateData.weightInOunces = Number(data.weightInOunces);
        if (data.badge !== undefined) updateData.badge = data.badge;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
        if (data.status !== undefined) updateData.status = data.status;

        const updated = await RealProductModel.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        ).lean();

        if (updated) {
          const formatted: RealProduct = {
            _id: (updated as any)._id.toString(),
            name: updated.name,
            price: updated.price,
            originalPrice: updated.originalPrice,
            category: updated.category,
            images: updated.images,
            stockQuantity: updated.stockQuantity,
            sku: updated.sku,
            weightInOunces: updated.weightInOunces,
            rating: updated.rating || 5,
            reviewCount: updated.reviewCount || 0,
            badge: updated.badge,
            description: updated.description,
            isFeatured: updated.isFeatured,
            status: updated.status,
            createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
            type: 'real',
          };
          const idx = mem.realProducts.findIndex((p) => p._id === id);
          if (idx !== -1) mem.realProducts[idx] = formatted;
          return formatted;
        }
      }
    } catch (e) {
      console.error('DB updateProduct error:', e);
    }
  }

  // Memory fallback
  if (type === 'affiliate') {
    const idx = mem.affiliateProducts.findIndex((p) => p._id === id);
    if (idx !== -1) {
      const existing = mem.affiliateProducts[idx];
      const updated: AffiliateProduct = {
        ...existing,
        name: data.name !== undefined ? data.name : existing.name,
        price: data.price !== undefined ? Number(data.price) : existing.price,
        originalPrice:
          data.originalPrice !== undefined
            ? data.originalPrice
              ? Number(data.originalPrice)
              : undefined
            : existing.originalPrice,
        category: data.category !== undefined ? data.category : existing.category,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
        affiliateLink: data.affiliateLink !== undefined ? data.affiliateLink : existing.affiliateLink,
        darazLink: data.darazLink !== undefined ? data.darazLink : existing.darazLink,
        platform: data.platform !== undefined ? data.platform : existing.platform,
        targetRegion: data.targetRegion !== undefined ? data.targetRegion : existing.targetRegion,
        badge: data.badge !== undefined ? data.badge : existing.badge,
        description: data.description !== undefined ? data.description : existing.description,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : existing.isFeatured,
      };
      mem.affiliateProducts[idx] = updated;
      return updated;
    }
  } else {
    const idx = mem.realProducts.findIndex((p) => p._id === id);
    if (idx !== -1) {
      const existing = mem.realProducts[idx];
      const updated: RealProduct = {
        ...existing,
        name: data.name !== undefined ? data.name : existing.name,
        price: data.price !== undefined ? Number(data.price) : existing.price,
        originalPrice:
          data.originalPrice !== undefined
            ? data.originalPrice
              ? Number(data.originalPrice)
              : undefined
            : existing.originalPrice,
        category: data.category !== undefined ? data.category : existing.category,
        images:
          data.images !== undefined
            ? Array.isArray(data.images)
              ? data.images
              : [data.images]
            : existing.images,
        stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : existing.stockQuantity,
        sku: data.sku !== undefined ? String(data.sku).trim().toUpperCase() : existing.sku,
        weightInOunces:
          data.weightInOunces !== undefined ? Number(data.weightInOunces) : existing.weightInOunces,
        badge: data.badge !== undefined ? data.badge : existing.badge,
        description: data.description !== undefined ? data.description : existing.description,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : existing.isFeatured,
        status: data.status !== undefined ? data.status : existing.status,
      };
      mem.realProducts[idx] = updated;
      return updated;
    }
  }

  return null;
}

export async function deleteProduct(id: string, type: 'affiliate' | 'real'): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      if (type === 'affiliate') {
        await AffiliateProductModel.findByIdAndDelete(id);
      } else {
        await RealProductModel.findByIdAndDelete(id);
      }
      return true;
    } catch (e) {
      console.error('DB delete failed:', e);
    }
  }

  if (type === 'affiliate') {
    mem.affiliateProducts = mem.affiliateProducts.filter((p) => p._id !== id);
  } else {
    mem.realProducts = mem.realProducts.filter((p) => p._id !== id);
  }
  return true;
}

// Phase 2 Flip Master Script: Drops or archives all Affiliate Products
export async function executePhase2Flip(action: 'drop' | 'archive'): Promise<{
  success: boolean;
  message: string;
  affectedCount: number;
}> {
  const db = await connectToDatabase();
  let count = 0;

  if (db) {
    try {
      count = await AffiliateProductModel.countDocuments();
      if (action === 'drop') {
        await AffiliateProductModel.deleteMany({});
      }
      await StoreSettingsModel.findOneAndUpdate(
        {},
        { $set: { storeMode: 'retail_only' } },
        { upsert: true }
      );
    } catch (e) {
      console.error('Phase 2 flip DB error:', e);
    }
  }

  count = mem.affiliateProducts.length;
  if (action === 'drop') {
    mem.affiliateProducts = [];
  }
  mem.settings.storeMode = 'retail_only';

  return {
    success: true,
    message:
      action === 'drop'
        ? `Successfully dropped ${count} affiliate products and transitioned storefront to 100% In-House Retail.`
        : `Successfully set storefront to 100% In-House Retail mode.`,
    affectedCount: count,
  };
}

// Order Management
export async function getOrders(): Promise<Order[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const orderDocs = await OrderModel.find().sort({ createdAt: -1 }).lean();
      return orderDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        orderNumber: doc.orderNumber,
        customer: doc.customer,
        items: doc.items,
        subtotal: doc.subtotal,
        shippingFee: doc.shippingFee,
        discount: doc.discount,
        total: doc.total,
        paymentStatus: doc.paymentStatus,
        paymentMethod: doc.paymentMethod,
        fulfillmentStatus: doc.fulfillmentStatus,
        trackingNumber: doc.trackingNumber,
        trackingCarrier: doc.trackingCarrier,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Error fetching orders from DB:', e);
    }
  }
  return mem.orders;
}

export async function createOrder(orderData: Omit<Order, '_id' | 'createdAt'>): Promise<Order> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc = await OrderModel.create(orderData);
      // Deduct stock from real products
      for (const item of orderData.items) {
        await RealProductModel.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity },
        });
      }
      return {
        _id: doc._id.toString(),
        ...orderData,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      };
    } catch (e) {
      console.error('Error creating order in DB:', e);
    }
  }

  const newOrder: Order = {
    ...orderData,
    _id: 'ord_' + Date.now(),
    createdAt: new Date().toISOString(),
  };

  // Deduct memory stock
  for (const item of orderData.items) {
    const prod = mem.realProducts.find((p) => p._id === item.productId);
    if (prod) {
      prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
    }
  }

  mem.orders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderFulfillment(
  orderId: string,
  update: {
    fulfillmentStatus: Order['fulfillmentStatus'];
    trackingNumber?: string;
    trackingCarrier?: string;
  }
): Promise<Order | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await OrderModel.findByIdAndUpdate(
        orderId,
        { $set: update },
        { new: true }
      ).lean();
      if (updated) {
        return {
          _id: (updated as any)._id.toString(),
          orderNumber: updated.orderNumber,
          customer: updated.customer,
          items: updated.items,
          subtotal: updated.subtotal,
          shippingFee: updated.shippingFee,
          discount: updated.discount,
          total: updated.total,
          paymentStatus: updated.paymentStatus,
          paymentMethod: updated.paymentMethod,
          fulfillmentStatus: updated.fulfillmentStatus,
          trackingNumber: updated.trackingNumber,
          trackingCarrier: updated.trackingCarrier,
          createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.error('Error updating order:', e);
    }
  }

  const ord = mem.orders.find((o) => o._id === orderId);
  if (ord) {
    ord.fulfillmentStatus = update.fulfillmentStatus;
    if (update.trackingNumber !== undefined) ord.trackingNumber = update.trackingNumber;
    if (update.trackingCarrier !== undefined) ord.trackingCarrier = update.trackingCarrier;
    return ord;
  }
  return null;
}

// Lead Management
export async function getLeads(): Promise<Lead[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const docs = await LeadModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d: any) => ({
        _id: d._id.toString(),
        email: d.email,
        source: d.source,
        discountCode: d.discountCode,
        createdAt: d.createdAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Error fetching leads:', e);
    }
  }
  return mem.leads;
}

export async function createLead(email: string, source = 'footer_discount_10'): Promise<{ success: boolean; code: string; isNew: boolean }> {
  const cleanEmail = email.toLowerCase().trim();
  const db = await connectToDatabase();
  if (db) {
    try {
      const existing = await LeadModel.findOne({ email: cleanEmail });
      if (existing) {
        return { success: true, code: existing.discountCode || 'MOMO10', isNew: false };
      }
      await LeadModel.create({
        email: cleanEmail,
        source,
        discountCode: 'MOMO10',
      });
      return { success: true, code: 'MOMO10', isNew: true };
    } catch (e) {
      console.error('Error creating lead:', e);
    }
  }

  const found = mem.leads.find((l) => l.email === cleanEmail);
  if (found) {
    return { success: true, code: found.discountCode, isNew: false };
  }

  const newLead: Lead = {
    _id: 'lead_' + Date.now(),
    email: cleanEmail,
    source,
    discountCode: 'MOMO10',
    createdAt: new Date().toISOString(),
  };
  mem.leads.unshift(newLead);
  return { success: true, code: 'MOMO10', isNew: true };
}

// ========================================================
// ARTICLE / BLOG SYSTEM FUNCTIONS
// ========================================================

export async function getArticles(options?: {
  category?: string;
  status?: string;
  limit?: number;
  search?: string;
}): Promise<Article[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const query: any = {};
      if (options?.status && options.status !== 'all') {
        query.status = options.status;
      }
      if (options?.category && options.category !== 'All' && options.category !== 'All Guides') {
        query.category = options.category;
      }
      if (options?.search) {
        const regex = new RegExp(options.search, 'i');
        query.$or = [{ title: regex }, { excerpt: regex }, { tags: regex }];
      }

      let q = ArticleModel.find(query).sort({ publishedAt: -1, createdAt: -1 });
      if (options?.limit) {
        q = q.limit(options.limit);
      }
      const docs = await q.lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          _id: d._id.toString(),
        })) as Article[];
      }
    } catch (e) {
      console.error('Error fetching articles from DB:', e);
    }
  }

  let list = [...mem.articles];
  if (options?.status && options.status !== 'all') {
    list = list.filter((a) => a.status === options.status);
  }
  if (options?.category && options.category !== 'All' && options.category !== 'All Guides') {
    list = list.filter((a) => a.category.toLowerCase() === options.category!.toLowerCase());
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        a.excerpt.toLowerCase().includes(s) ||
        a.tags.some((t) => t.toLowerCase().includes(s))
    );
  }
  list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  if (options?.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc = await ArticleModel.findOneAndUpdate(
        { slug: cleanSlug },
        { $inc: { views: 1 } },
        { new: true }
      ).lean();
      if (doc) {
        return {
          ...doc,
          _id: (doc as any)._id.toString(),
        } as Article;
      }
    } catch (e) {
      console.error('Error fetching article by slug from DB:', e);
    }
  }

  const found = mem.articles.find((a) => a.slug === cleanSlug);
  if (found) {
    found.views = (found.views || 0) + 1;
    return found;
  }
  return null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await ArticleModel.findById(id).lean();
        if (doc) {
          return {
            ...doc,
            _id: (doc as any)._id.toString(),
          } as Article;
        }
      }
    } catch (e) {
      console.error('Error fetching article by ID from DB:', e);
    }
  }

  return mem.articles.find((a) => a._id === id) || null;
}

export async function createArticle(data: Partial<Article>): Promise<Article> {
  const slug = (data.slug || data.title || 'untitled')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const newArticle: Article = {
    _id: 'art_' + Date.now(),
    title: data.title || 'Untitled Article',
    slug: slug || `article-${Date.now()}`,
    excerpt: data.excerpt || '',
    content: data.content || '',
    category: data.category || 'Product Reviews',
    coverImage:
      data.coverImage ||
      'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=1200&q=80',
    author: data.author || 'Momo Editorial Team',
    readTime: data.readTime || '5 min read',
    isFeatured: Boolean(data.isFeatured),
    status: data.status || 'published',
    tags: Array.isArray(data.tags) ? data.tags : [],
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
    metaKeywords: data.metaKeywords || '',
    canonicalUrl: data.canonicalUrl || '',
    affiliateProductId: data.affiliateProductId || '',
    affiliateProductCtaText: data.affiliateProductCtaText || 'Check Latest Price on Amazon',
    affiliateProductUrl: data.affiliateProductUrl || '',
    views: 0,
    publishedAt: data.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await ArticleModel.create(newArticle);
      return {
        ...created.toObject(),
        _id: created._id.toString(),
      } as Article;
    } catch (e) {
      console.error('Error creating article in DB:', e);
    }
  }

  mem.articles.unshift(newArticle);
  return newArticle;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article | null> {
  const updatePayload: any = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.title && !data.slug) {
    updatePayload.slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const db = await connectToDatabase();
  if (db) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await ArticleModel.findByIdAndUpdate(
          id,
          { $set: updatePayload },
          { new: true }
        ).lean();
        if (updated) {
          return {
            ...updated,
            _id: (updated as any)._id.toString(),
          } as Article;
        }
      }
    } catch (e) {
      console.error('Error updating article in DB:', e);
    }
  }

  const index = mem.articles.findIndex((a) => a._id === id);
  if (index !== -1) {
    mem.articles[index] = {
      ...mem.articles[index],
      ...updatePayload,
    };
    return mem.articles[index];
  }
  return null;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await ArticleModel.findByIdAndDelete(id);
        return true;
      }
    } catch (e) {
      console.error('Error deleting article from DB:', e);
    }
  }

  const index = mem.articles.findIndex((a) => a._id === id);
  if (index !== -1) {
    mem.articles.splice(index, 1);
    return true;
  }
  return false;
}

