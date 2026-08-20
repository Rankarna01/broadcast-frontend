'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Inbox, Radio } from 'lucide-react';
import { KitchenOrderCard } from './KitchenOrderCard';
import { OrderRequest } from '@/lib/types';

interface KitchenOrdersListProps {
  orders: OrderRequest[];
  outletName: string;
}

export function KitchenOrdersList({ orders, outletName }: KitchenOrdersListProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending'>('all');

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
            ORDER BARU
          </h2>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold text-xs px-2.5 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative inline-block">
          <button className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer">
            <span>Semua Status</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px] shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 animate-pulse">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Menunggu Order Masuk</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
            Buka halaman customer simulator di tab lain lalu tekan tombol <strong>[ REQUEST ORDER ]</strong>.
          </p>
          <Link
            href="/customer"
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            Buka Customer Simulator
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order, index) => (
            <KitchenOrderCard
              key={`${order.request_number}-${index}`}
              order={order}
              outletName={outletName}
            />
          ))}

          {/* Footer note */}
          <div className="text-center py-4 text-xs font-medium text-slate-400">
            Tidak ada order lainnya
          </div>
        </div>
      )}
    </div>
  );
}
