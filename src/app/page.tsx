'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, ShoppingBag, Radio, Bell, ArrowRight, ShieldCheck, Zap, Server, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="relative z-10 max-w-4xl w-full space-y-8 text-center sm:text-left">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivery Broadcast • Real-Time Kitchen Display Testbench</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Kitchen Broadcast System
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Platform pengujian multi-jalur notifikasi real-time menggabungkan <strong>Laravel Reverb WebSocket</strong>, <strong>Native Web Push API</strong>, <strong>Service Worker</strong>, dan <strong>Web Audio Lonceng</strong>.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Simulator Card */}
          <Card className="bg-white border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-md transition-all shadow-xs rounded-2xl flex flex-col justify-between">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2 text-emerald-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center justify-between">
                Customer Simulator
                <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  /customer
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Antarmuka minimalis untuk customer memilih outlet (Medan / Binjai) dan mengirimkan single-action request order.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Single trigger: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">POST /api/order-requests</code></span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>Multi-tenant outlet selector (ID 1 & ID 2)</span>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Link href="/customer" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                  Buka Customer Simulator <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Merchant Kitchen Display Card */}
          <Card className="bg-white border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-md transition-all shadow-xs rounded-2xl flex flex-col justify-between">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2 text-emerald-600">
                <Utensils className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center justify-between">
                Kitchen Display System
                <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  /merchant/kitchen
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Layar kitchen display real-time dengan status WebSocket Reverb, Web Push Service Worker, notifikasi suara DING-DONG, dan persistent lock.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Subscribed ke <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">private-outlet.&#123;id&#125;</code></span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Background Web Push saat tab diminimalkan / ditutup</span>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Link href="/merchant/kitchen" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                  Buka Kitchen Display <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Technical Highlights Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-around gap-4 text-center shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Multi-Tenant Channel Isolation</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Laravel Reverb WebSocket</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>VAPID Web Push + SW</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>5s Fallback Polling</span>
          </div>
        </div>
      </div>
    </main>
  );
}
