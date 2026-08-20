'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Utensils, Volume2, VolumeX, Settings, ArrowLeft, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KitchenHeaderProps {
  outletName: string;
  selectedOutletId: number;
  outlets: Array<{ outletId: number; outletName: string; merchantEmail: string }>;
  onSelectOutlet: (outlet: { outletId: number; outletName: string; merchantEmail: string }) => void;
  audioStatus: 'ENABLED' | 'MUTED';
  onToggleSound: () => void;
}

export function KitchenHeader({
  outletName,
  selectedOutletId,
  outlets,
  onSelectOutlet,
  audioStatus,
  onToggleSound,
}: KitchenHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Brand & Outlet Info */}
      <div className="flex items-center gap-3.5">
        <Link
          href="/"
          className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 mr-1"
          title="Kembali ke Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight flex items-center gap-2">
            KITCHEN DISPLAY
          </h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-xs text-slate-500 font-medium flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              {outletName}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Ganti Outlet
                </div>
                {outlets.map((outlet) => (
                  <button
                    key={outlet.outletId}
                    onClick={() => {
                      onSelectOutlet(outlet);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                      outlet.outletId === selectedOutletId
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {outlet.outletName}
                    {outlet.outletId === selectedOutletId && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Telemetry Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Live Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Live Clock */}
        <div className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 text-xs sm:text-sm font-mono font-bold tracking-wider">
          {currentTime || '00:00:00'}
        </div>

        {/* Sound Toggle Icon Button */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            audioStatus === 'ENABLED'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={audioStatus === 'ENABLED' ? 'Suara Notifikasi ON (Klik untuk mematikan)' : 'Klik untuk Mengaktifkan Suara'}
        >
          {audioStatus === 'ENABLED' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Pengaturan Outlet"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
