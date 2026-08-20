'use client';

import React from 'react';
import { ClipboardList, Clock, CheckCircle2, RotateCw } from 'lucide-react';

interface KitchenStatsWidgetProps {
  totalOrders: number;
}

export function KitchenStatsWidget({ totalOrders }: KitchenStatsWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
        STATISTIK HARI INI
      </h3>

      <div className="grid grid-cols-3 gap-2.5">
        {/* Total Request */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-center flex flex-col items-center justify-center">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="text-base font-black text-slate-900">{totalOrders}</div>
          <div className="text-[10px] font-semibold text-slate-500">Total Request</div>
        </div>

        {/* Pending */}
        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center flex flex-col items-center justify-center">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-base font-black text-slate-900">{totalOrders}</div>
          <div className="text-[10px] font-semibold text-slate-500">Pending</div>
        </div>

        {/* Selesai */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-center flex flex-col items-center justify-center">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-base font-black text-slate-900">0</div>
          <div className="text-[10px] font-semibold text-slate-500">Selesai</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 pt-1">
        <RotateCw className="w-3 h-3 text-slate-400" />
        <span>Update otomatis setiap 5 detik</span>
      </div>
    </div>
  );
}
