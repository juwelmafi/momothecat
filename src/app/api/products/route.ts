import { NextRequest, NextResponse } from 'next/server';
import { getMergedProducts, createAffiliateProduct, createRealProduct } from '@/lib/store';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const type = (searchParams.get('type') as 'all' | 'affiliate' | 'real') || 'all';
    const featuredOnly = searchParams.get('featured') === 'true';
    const ignoreStoreMode = searchParams.get('ignoreStoreMode') === 'true';
    const country = searchParams.get('country') || undefined;

    const products = await getMergedProducts({
      category,
      search,
      type,
      featuredOnly,
      ignoreStoreMode,
      country,
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('API /products GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: Create product (Protected Admin Endpoint)
export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type } = body;

    if (!type || (type !== 'affiliate' && type !== 'real')) {
      return NextResponse.json(
        { success: false, error: "Product type must be either 'affiliate' or 'real'" },
        { status: 400 }
      );
    }

    if (type === 'affiliate') {
      const {
        name,
        price,
        originalPrice,
        category,
        imageUrl,
        affiliateLink,
        darazLink,
        platform,
        targetRegion,
        badge,
        description,
      } = body;

      if (!name || price === undefined || !category || !imageUrl || (!affiliateLink && !darazLink)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Affiliate products require: name, price, category, imageUrl, and an affiliate link (Amazon or Daraz)',
          },
          { status: 400 }
        );
      }

      const product = await createAffiliateProduct({
        name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        imageUrl,
        affiliateLink: affiliateLink || '',
        darazLink: darazLink || '',
        platform: platform || (darazLink && !affiliateLink ? 'daraz' : darazLink && affiliateLink ? 'both' : 'amazon'),
        targetRegion: targetRegion || (darazLink && !affiliateLink ? 'bd_only' : 'all'),
        badge: badge || (darazLink && !affiliateLink ? 'Daraz Pick' : "Amazon's Choice"),
        description: description || '',
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 200) + 20,
        isFeatured: Boolean(body.isFeatured),
      });

      return NextResponse.json({ success: true, product }, { status: 201 });
    } else {
      const {
        name,
        price,
        originalPrice,
        category,
        images,
        stockQuantity,
        sku,
        weightInOunces,
        description,
        badge,
      } = body;

      if (!name || price === undefined || !category || !images || !images.length || !sku || !description) {
        return NextResponse.json(
          {
            success: false,
            error: 'Real products require: name, price, category, images (array), stockQuantity, sku, and description',
          },
          { status: 400 }
        );
      }

      const product = await createRealProduct({
        name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        images: Array.isArray(images) ? images : [images],
        stockQuantity: Number(stockQuantity) || 0,
        sku: String(sku).trim().toUpperCase(),
        weightInOunces: weightInOunces ? Number(weightInOunces) : 16,
        description,
        badge: badge || 'Momo Original',
        rating: 5.0,
        reviewCount: 0,
        isFeatured: Boolean(body.isFeatured),
        status: body.status || 'active',
      });

      return NextResponse.json({ success: true, product }, { status: 201 });
    }
  } catch (error: any) {
    console.error('API /products POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
