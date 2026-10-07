'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-slate-800">
        <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-orange-400" />
        </div>
        <p className="text-sm font-medium leading-tight text-slate-100">{toastMessage}</p>
      </div>
    </div>
  );
}
