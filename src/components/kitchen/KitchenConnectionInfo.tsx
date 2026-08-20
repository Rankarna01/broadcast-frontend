'use client';

import React from 'react';
import { Radio, Users, Wifi, ShieldCheck, Clock } from 'lucide-react';
import { SystemStatus } from '@/lib/types';

interface KitchenConnectionInfoProps {
  systemStatus: SystemStatus;
}

export function KitchenConnectionInfo({ systemStatus }: KitchenConnectionInfoProps) {
  const isConnected = systemStatus.wsStatus === 'CONNECTED';

  const rows = [
    {
      icon: <Radio className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      label: 'WebSocket (Reverb)',
      value: isConnected ? 'Terhubung' : 'Terputus',
      badge: isConnected ? 'AKTIF' : 'OFFLINE',
      isOk: isConnected,
    },
    {
      icon: <Users className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      label: 'Channel',
      value: systemStatus.channelName,
      badge: 'AKTIF',
      isOk: true,
    },
    {
      icon: <Wifi className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      label: 'Connection',
      value: isConnected ? 'Connected' : systemStatus.wsStatus,
      badge: isConnected ? 'AKTIF' : 'OFFLINE',
      isOk: isConnected,
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      label: 'Auth Status',
      value: 'Authorized (200)',
      badge: 'AKTIF',
      isOk: true,
    },
    {
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      label: 'Reconnect Attempts',
      value: isConnected ? '0' : 'Auto (5s)',
      badge: 'AKTIF',
      isOk: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
        INFORMASI KONEKSI
      </h3>

      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${row.bg}`}>
                {row.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">{row.label}</div>
                <div className="text-[11px] text-slate-400 font-medium truncate max-w-[140px] sm:max-w-[170px]">
                  {row.value}
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                row.isOk
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {row.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
