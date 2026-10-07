import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/store';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, subtotal, shippingFee, discount, total, paymentMethod } = body;

    if (!customer || !customer.name || !customer.email || !customer.street) {
      return NextResponse.json(
        { success: false, error: 'Customer name, email, and street address are required' },
        { status: 400 }
      );
    }

    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    const orderNumber = `MMC-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await createOrder({
      orderNumber,
      customer,
      items,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee) || 0,
      discount: Number(discount) || 0,
      total: Number(total),
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'stripe_card',
      fulfillmentStatus: 'unfulfilled',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('API /orders POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
