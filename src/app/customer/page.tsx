'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Outlet } from '@/lib/types';
import {
  Store,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Utensils,
  User,
  ShoppingBag,
  Check,
  MapPin,
  ReceiptText,
} from 'lucide-react';

export default function CustomerPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([
    { id: 1, tenant_id: 1, name: 'Outlet Medan' },
    { id: 2, tenant_id: 1, name: 'Outlet Binjai' },
  ]);
  const [selectedOutletId, setSelectedOutletId] = useState<number>(1);
  const [customerName] = useState<string>('Customer Demo');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<{
    request_number: string;
    outlet_name: string;
    created_at: string;
  } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${apiUrl}/api/outlets`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setOutlets(res.data);
          setSelectedOutletId(res.data[0].id);
        }
      })
      .catch(() => {});
  }, [apiUrl]);

  const handleRequestOrder = async () => {
    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`${apiUrl}/api/order-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          outlet_id: selectedOutletId,
          customer_name: customerName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const order = data.data;
        const selectedOutlet = outlets.find((o) => o.id === selectedOutletId);
        setLastOrder({
          request_number: order.request_number,
          outlet_name: selectedOutlet ? selectedOutlet.name : `Outlet #${selectedOutletId}`,
          created_at: new Date().toLocaleTimeString('id-ID'),
        });
        setFeedbackMessage({
          type: 'success',
          text: `Pesanan #${order.request_number} berhasil dikirim ke ${selectedOutlet?.name || 'Outlet'}!`,
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: data.message || 'Gagal mengirim pesanan. Pastikan server backend sedang aktif.',
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: `Error koneksi: ${err.message || 'Gagal terhubung ke backend server.'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentOutlet = outlets.find((o) => o.id === selectedOutletId);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Top Header Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-200/60"
        >
          <ArrowLeft className="w-4 h-4" /> Home Dashboard
        </Link>
        <Link
          href="/merchant/kitchen"
          className="text-xs font-bold bg-white hover:bg-slate-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5"
        >
          <Utensils className="w-3.5 h-3.5 text-emerald-600" />
          Kitchen Display
        </Link>
      </div>

      {/* Main Order Card Container (Clean Mobile-First Web Card) */}
      <Card className="w-full max-w-md bg-white border border-slate-200/90 shadow-sm rounded-2xl overflow-hidden">
        {/* Card Header */}
        <CardHeader className="text-center pb-4 border-b border-slate-100 bg-white">
          <div className="mx-auto w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-2.5 text-emerald-600 shadow-2xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
            Customer Order Simulator
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-1">
            Tekan satu tombol untuk memicu event broadcast real-time & Web Push ke Kitchen Display.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          {/* Target Outlet Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                Pilih Target Outlet
              </label>
              <span className="text-[11px] text-slate-400">Cabang Resto</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {outlets.map((outlet) => {
                const isSelected = outlet.id === selectedOutletId;
                return (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => setSelectedOutletId(outlet.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-xs">{outlet.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">ID: #{outlet.id}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Profile Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Identitas Pemesan</div>
                <div className="text-xs font-bold text-slate-800">{customerName}</div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-slate-200 bg-white text-slate-500 font-mono">
              Demo User
            </Badge>
          </div>

          {/* Simulated Order Items */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ReceiptText className="w-3.5 h-3.5 text-emerald-600" />
                Menu Pesanan
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                1 Menu
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-0.5">
              <div>
                <div className="font-bold text-slate-800">Paket Ayam Crispy + Es Teh</div>
                <div className="text-[10px] text-slate-400">1x Porsi Lengkap</div>
              </div>
              <div className="font-mono font-bold text-slate-800">Rp 25.000</div>
            </div>
          </div>

          {/* Trigger Button (Pure Lucide Icons, No Emojis) */}
          <Button
            onClick={handleRequestOrder}
            disabled={isLoading}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Memproses Pesanan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Pesanan ({currentOutlet?.name})</span>
              </>
            )}
          </Button>

          {/* Feedback Banner */}
          {feedbackMessage && (
            <Alert
              className={`${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              } rounded-xl p-3`}
            >
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <AlertTitle className="font-bold text-xs uppercase flex items-center justify-between">
                <span>{feedbackMessage.type === 'success' ? 'Pesanan Terkirim' : 'Perhatian'}</span>
                {lastOrder && <span className="text-[10px] font-mono">{lastOrder.created_at}</span>}
              </AlertTitle>
              <AlertDescription className="text-xs mt-0.5">
                {feedbackMessage.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="pt-2 pb-4 border-t border-slate-100 bg-slate-50/50 flex justify-center text-center">
          <p className="text-[11px] text-slate-400">
            Event disiarkan ke channel <span className="text-emerald-700 font-mono font-bold">private-outlet.{selectedOutletId}</span>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
