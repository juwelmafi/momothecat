import React from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/store';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const orders = await getOrders();
  const order = orders.find((o) => o._id === id || o.orderNumber === id);

  return (
    <div className="py-8 max-w-3xl mx-auto space-y-8">
      {/* Success Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Verified via Stripe
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            We&apos;re getting your Momo Originals packaged with care. A confirmation email has been dispatched to{' '}
            <strong className="text-slate-800">{order?.customer.email || 'your email'}</strong>.
          </p>
        </div>

        {order && (
          <div className="inline-flex items-center gap-3 p-3 bg-orange-50/80 border border-orange-200/60 rounded-2xl text-xs font-bold text-orange-950">
            <span>Order Number:</span>
            <span className="font-mono text-sm font-extrabold text-orange-600">
              {order.orderNumber}
            </span>
          </div>
        )}
      </div>

      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Order Details</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full capitalize">
              {order.fulfillmentStatus}
            </span>
          </h2>

          {/* Delivery & Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Shipping To:
              </span>
              <p className="font-bold text-slate-900">{order.customer.name}</p>
              <p className="text-slate-600">{order.customer.street}</p>
              <p className="text-slate-600">
                {order.customer.city}, {order.customer.state} {order.customer.zip}
              </p>
              <p className="text-slate-500 pt-1">Phone: {order.customer.phone}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Delivery Tracking:
              </span>
              <p className="font-bold text-slate-900">
                {order.trackingNumber ? (
                  <span className="text-orange-600 font-mono">{order.trackingNumber} ({order.trackingCarrier})</span>
                ) : (
                  'Tracking will be assigned upon courier pickup'
                )}
              </p>
              <p className="text-slate-500 pt-1">
                Estimated Delivery: 2-4 business days via USPS Priority
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700">Items Ordered ({order.items.length}):</span>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-slate-800">
                {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Paid</span>
              <span className="text-orange-600 text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6B35] hover:bg-[#FF9933] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#FF6B35]/25 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Keep Exploring Momo Store</span>
        </Link>
      </div>
    </div>
  );
}
