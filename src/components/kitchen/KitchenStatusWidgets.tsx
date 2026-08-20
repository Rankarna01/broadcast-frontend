'use client';

import React from 'react';
import { Radio, Bell, Volume2, BellRing, Activity, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemStatus } from '@/lib/types';

interface KitchenStatusWidgetsProps {
  systemStatus: SystemStatus;
  onTogglePush: () => void;
  onToggleSound: () => void;
  onTestSound: () => void;
  onClearOrders: () => void;
}

export function KitchenStatusWidgets({
  systemStatus,
  onTogglePush,
  onToggleSound,
  onTestSound,
  onClearOrders,
}: KitchenStatusWidgetsProps) {
  const isWsConnected = systemStatus.wsStatus === 'CONNECTED';
  const isPollingActive = systemStatus.transportMode.includes('Polling');
  const isOnline = isWsConnected || isPollingActive;
  const isPushActive = systemStatus.pushSubscription === 'ACTIVE';
  const isSoundActive = systemStatus.audioStatus === 'ENABLED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      {/* 3 Status Info Cards (Cols: 8 or 9) */}
      <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x divide-slate-100">
        {/* Status 1: Broadcast WebSocket / Polling */}
        <div className="flex items-center gap-3.5 sm:pr-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isWsConnected
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : isPollingActive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}
          >
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              {isWsConnected ? 'BROADCAST (WEBSOCKET)' : 'SYNC MODE (POLLING)'}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-600">
              {isWsConnected ? 'AKTIF (REALTIME)' : 'AKTIF (POLLING 5S)'}
            </div>
            <div className="text-[11px] text-slate-400">
              {isWsConnected ? 'Terhubung ke Reverb WS' : 'Tunnel Ngrok Terhubung (200 OK)'}
            </div>
          </div>
        </div>

        {/* Status 2: Push Notification */}
        <div
          onClick={onTogglePush}
          className="flex items-center gap-3.5 sm:px-4 cursor-pointer group"
          title="Klik untuk Toggle Push Notification"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 ${
              isPushActive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            {isPushActive ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              PUSH NOTIFICATION
            </div>
            <div className={`text-sm sm:text-base font-extrabold ${isPushActive ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isPushActive ? 'AKTIF' : 'TIDAK AKTIF'}
            </div>
            <div className="text-[11px] text-slate-400 group-hover:text-emerald-600 transition-colors">
              {isPushActive ? 'Service Worker aktif' : 'Klik untuk mengaktifkan'}
            </div>
          </div>
        </div>

        {/* Status 3: Sound Notification */}
        <div
          onClick={onToggleSound}
          className="flex items-center gap-3.5 sm:pl-4 cursor-pointer group"
          title="Klik untuk Toggle Sound"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 ${
              isSoundActive
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              SOUND NOTIFICATION
            </div>
            <div className={`text-sm sm:text-base font-extrabold ${isSoundActive ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isSoundActive ? 'AKTIF' : 'MUTED'}
            </div>
            <div className="text-[11px] text-slate-400 group-hover:text-emerald-600 transition-colors">
              {isSoundActive ? 'Suara notifikasi ON' : 'Klik untuk mengaktifkan'}
            </div>
          </div>
        </div>
      </div>

      {/* Right Action Buttons (Cols: 4 or 3) */}
      <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
        {/* Test Notification / Test Sound Button */}
        <Button
          onClick={onTestSound}
          variant="outline"
          className="w-full h-10 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4 text-emerald-600" />
          TEST NOTIFICATION
        </Button>

        {/* Clear All Orders Button */}
        <Button
          onClick={onClearOrders}
          variant="outline"
          className="w-full h-10 border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          BERSIHKAN ORDER
        </Button>
      </div>
    </div>
  );
}
