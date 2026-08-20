'use client';

import React, { useState } from 'react';
import { User, Store, Clock, Check, CheckCircle2, FileText, Zap, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderRequest } from '@/lib/types';

interface KitchenOrderCardProps {
  order: OrderRequest;
  outletName: string;
}

export function KitchenOrderCard({ order, outletName }: KitchenOrderCardProps) {
  const [status, setStatus] = useState<string>(order.status || 'PENDING');

  const handleAccept = () => {
    setStatus('RECEIVED');
  };

  const handleComplete = () => {
    setStatus('COMPLETED');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs border-l-4 border-l-emerald-500 hover:shadow-md transition-all space-y-4">
      {/* Top Header & Main Info */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Left: Request Number & Customer */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              BARU
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {order.transport === 'WebSocket' ? '⚡ Realtime' : '📡 Fallback'}
            </span>
          </div>

          <h3 className="text-2xl font-black font-mono tracking-tight text-slate-900">
            {order.request_number}
          </h3>

          <div className="space-y-0.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.customer_name || 'Customer Demo'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>{outletName}</span>
            </div>
          </div>
        </div>

        {/* Center: Waktu & Status */}
        <div className="flex items-center gap-6 sm:gap-8 bg-slate-50/70 border border-slate-100 rounded-xl p-3 px-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Waktu
            </span>
            <div className="font-mono font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {order.created_at}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Status
            </span>
            <span
              className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-md uppercase border ${
                status === 'COMPLETED'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : status === 'RECEIVED'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
          <Button
            onClick={handleAccept}
            disabled={status === 'COMPLETED'}
            className="flex-1 sm:flex-initial h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            TERIMA
          </Button>

          <Button
            onClick={handleComplete}
            disabled={status === 'COMPLETED'}
            variant="outline"
            className="flex-1 sm:flex-initial h-10 px-5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            SELESAIKAN
          </Button>
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Request Order (Demo)</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Transport: {order.transport || 'WebSocket'}
        </div>
      </div>
    </div>
  );
}
