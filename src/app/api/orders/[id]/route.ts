import { NextRequest, NextResponse } from 'next/server';
import { updateOrderFulfillment } from '@/lib/store';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fulfillmentStatus, trackingNumber, trackingCarrier } = body;

    const updated = await updateOrderFulfillment(id, {
      fulfillmentStatus,
      trackingNumber,
      trackingCarrier,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
