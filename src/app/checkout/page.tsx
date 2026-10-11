'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Tag,
  AlertCircle,
  Package,
  ShoppingCart,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    storeMode,
    cart,
    subtotal,
    shippingFee,
    discountAmount,
    discountCode,
    total,
    clearCart,
    applyDiscount,
    removeDiscount,
    freeShippingThreshold,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [promoInput, setPromoInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (storeMode === 'affiliate_only') {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
          <Package className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Affiliate Mode Active</h1>
        <p className="text-sm text-slate-500">
          In-house checkout is disabled in Affiliate Mode. All items are fulfilled directly via Amazon Prime.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-orange-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-orange-100 flex items-center justify-center mx-auto text-orange-600">
          <ShoppingCart className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Your Cart is Empty</h1>
        <p className="text-sm text-slate-500">
          There are no in-house Momo items to checkout. Explore our catalog to add products!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md shadow-orange-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    );
  }

  const selectedShippingFee =
    shippingMethod === 'express'
      ? 9.99
      : subtotal >= freeShippingThreshold
      ? 0
      : 4.99;

  const finalTotal = Math.max(0, subtotal - discountAmount + selectedShippingFee);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const orderPayload = {
        customer: formData,
        items: cart.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          sku: item.product.sku,
        })),
        subtotal,
        shippingFee: selectedShippingFee,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod: 'stripe_mock',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to process order');
      }

      clearCart();
      router.push(`/order-confirmation/${data.order._id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-orange-100">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure 256-bit Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-extrabold text-slate-900">
                  Customer & Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-600">Full Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600">Email Address (Order Confirmation)</label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600">Phone Number (Delivery SMS)</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-600">Street Address</label>
                  <input
                    type="text"
                    required
                    name="street"
                    placeholder="123 Blossom Lane, Apt 4"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600">City</label>
                  <input
                    type="text"
                    required
                    name="city"
                    placeholder="Portland"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-600">State / Region</label>
                    <input
                      type="text"
                      required
                      name="state"
                      placeholder="OR"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-600">ZIP / Postal</label>
                    <input
                      type="text"
                      required
                      name="zip"
                      placeholder="97201"
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Options */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-extrabold text-slate-900">Delivery Method</h2>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-orange-500 bg-orange-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Standard Courier Delivery (3-5 business days)
                      </p>
                      <p className="text-[11px] text-slate-500">Tracked with USPS / FedEx</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-600 font-extrabold">FREE</span>
                    ) : (
                      '$4.99'
                    )}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-orange-500 bg-orange-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Express Priority Delivery (1-2 business days)
                      </p>
                      <p className="text-[11px] text-slate-500">Priority packaging & expedited dispatch</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">$9.99</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Gateway (Stripe elements mock per PRD Section 2) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900">Payment Details</h2>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Stripe Powered</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    <span>Credit / Debit Card (Stripe Mode Active)</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      VISA
                    </span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      MC
                    </span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      AMEX
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold">
                  <div>
                    <label className="text-slate-500">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4242 (Stripe Test Card)"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500">Expiration</label>
                      <input
                        type="text"
                        readOnly
                        value="12 / 28"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500">CVC</label>
                      <input
                        type="text"
                        readOnly
                        value="888"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 sticky top-24">
            <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-slate-500 font-semibold">{cart.length} items</span>
            </h3>

            {/* Items */}
            <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product._id} className="flex gap-3 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            {discountCode ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  Coupon &apos;{discountCode}&apos; Applied (-10%)
                </span>
                <button
                  type="button"
                  onClick={removeDiscount}
                  className="text-emerald-700 underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Coupon code (e.g. MOMO10)"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 uppercase font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (promoInput.trim()) {
                      applyDiscount(promoInput.trim());
                      setPromoInput('');
                    }
                  }}
                  className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>VIP Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span className="font-bold text-slate-800">
                  {selectedShippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${selectedShippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-orange-600 text-lg">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              form="checkout-form"
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              <Package className="w-5 h-5" />
              <span>{submitting ? 'Placing Order...' : `Complete Order ($${finalTotal.toFixed(2)})`}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Full 30-Day Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
