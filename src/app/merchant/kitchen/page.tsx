'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OrderRequest, SystemStatus } from '@/lib/types';
import { initEcho } from '@/lib/echo';
import { playNotificationSound, unlockAudio } from '@/lib/sound';
import {
  registerServiceWorker,
  subscribeToWebPush,
  unsubscribeFromWebPush,
  checkExistingPushSubscription,
} from '@/lib/push';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { KitchenHeader } from '@/components/kitchen/KitchenHeader';
import { KitchenStatusWidgets } from '@/components/kitchen/KitchenStatusWidgets';
import { KitchenOrdersList } from '@/components/kitchen/KitchenOrdersList';
import { KitchenConnectionInfo } from '@/components/kitchen/KitchenConnectionInfo';
import { KitchenStatsWidget } from '@/components/kitchen/KitchenStatsWidget';

const DEMO_OUTLETS = [
  { outletId: 1, outletName: 'Outlet Medan', merchantEmail: 'merchant.medan@example.com' },
  { outletId: 2, outletName: 'Outlet Binjai', merchantEmail: 'merchant.binjai@example.com' },
];

export default function KitchenDisplayPage() {
  const [selectedOutlet, setSelectedOutlet] = useState(DEMO_OUTLETS[0]);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [soundPreset, setSoundPreset] = useState<'bell' | 'triple'>('bell');
  const seenOrderIds = useRef<Set<string>>(new Set());

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    wsStatus: 'CONNECTING',
    channelName: `private-outlet.${selectedOutlet.outletId}`,
    swStatus: 'INACTIVE',
    pushPermission: 'default',
    pushSubscription: 'NOT_REGISTERED',
    audioStatus: 'MUTED',
    lastEventName: null,
    lastEventTime: null,
    transportMode: 'WebSocket',
  });

  const [notificationBanner, setNotificationBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const echoRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Handle new incoming order (with deduplication & audio trigger)
  const handleIncomingOrder = useCallback((order: OrderRequest, transport: 'WebSocket' | 'Polling') => {
    if (!order || !order.request_number) return;

    if (seenOrderIds.current.has(order.request_number)) {
      return; // Deduplicate
    }

    seenOrderIds.current.add(order.request_number);

    setOrders((prev) => [
      {
        ...order,
        transport,
        created_at: order.created_at || new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setSystemStatus((prev) => ({
      ...prev,
      lastEventName: `OrderRequestCreated (${order.request_number})`,
      lastEventTime: new Date().toLocaleTimeString(),
    }));

    // Trigger audio chime
    playNotificationSound(soundPreset, 0.65);
  }, [soundPreset]);

  // Fetch pending orders (for initial load and fallback polling)
  const fetchPendingOrders = useCallback(async (outletId: number) => {
    try {
      const res = await fetch(`${apiUrl}/api/order-requests/pending?outlet_id=${outletId}`, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        data.data.forEach((item: OrderRequest) => {
          handleIncomingOrder(item, 'Polling');
        });
      }
    } catch (err) {
      console.warn('Pending orders fetch note:', err);
    }
  }, [apiUrl, handleIncomingOrder]);

  // Polling management
  const startPolling = useCallback((outletId: number) => {
    if (pollingIntervalRef.current) return;
    setSystemStatus((prev) => ({ ...prev, transportMode: 'Polling (5s)' }));
    pollingIntervalRef.current = setInterval(() => {
      fetchPendingOrders(outletId);
    }, 5000);
  }, [fetchPendingOrders]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setSystemStatus((prev) => ({ ...prev, transportMode: 'WebSocket' }));
  }, []);

  // Restore persistent settings on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedSound = localStorage.getItem('kitchen_sound_enabled');
      if (savedSound === 'true') {
        setSystemStatus((prev) => ({ ...prev, audioStatus: 'ENABLED' }));
        const unlock = () => {
          unlockAudio();
          window.removeEventListener('click', unlock);
        };
        window.addEventListener('click', unlock, { once: true });
      }
    } catch {}

    if ('serviceWorker' in navigator) {
      registerServiceWorker().then(async (reg) => {
        if (!reg) return;
        const hasPush = await checkExistingPushSubscription();
        const permission = typeof Notification !== 'undefined' ? Notification.permission : 'default';
        const isSaved = localStorage.getItem(`kitchen_push_enabled_${selectedOutlet.outletId}`) === 'true';
        const isSubscribed = (hasPush || isSaved) && permission === 'granted';

        setSystemStatus((prev) => ({
          ...prev,
          swStatus: 'ACTIVE',
          pushPermission: permission,
          pushSubscription: isSubscribed ? 'ACTIVE' : 'NOT_REGISTERED',
        }));

        if (isSubscribed) {
          subscribeToWebPush(selectedOutlet.outletId).catch(() => {});
        }
      });
    }
  }, [selectedOutlet.outletId]);

  // Main lifecycle: WebSocket subscription & connection monitoring
  useEffect(() => {
    let isMounted = true;
    setOrders([]);
    seenOrderIds.current.clear();

    fetchPendingOrders(selectedOutlet.outletId);

    const echo = initEcho();
    echoRef.current = echo;

    const channelName = `outlet.${selectedOutlet.outletId}`;
    setSystemStatus((prev) => ({
      ...prev,
      channelName: `private-${channelName}`,
      wsStatus: 'CONNECTING',
    }));

    const channel = echo.private(channelName);

    channel
      .listen('.OrderRequestCreated', (e: any) => {
        if (!isMounted) return;
        handleIncomingOrder(e, 'WebSocket');
      })
      .listen('OrderRequestCreated', (e: any) => {
        if (!isMounted) return;
        handleIncomingOrder(e, 'WebSocket');
      })
      .listen('.App\\Events\\OrderRequestCreated', (e: any) => {
        if (!isMounted) return;
        handleIncomingOrder(e, 'WebSocket');
      })
      .error((error: any) => {
        console.warn('Channel error:', error);
      });

    if (echo.connector?.pusher?.connection) {
      const connection = echo.connector.pusher.connection;

      const updateStatus = (state: string) => {
        if (!isMounted) return;
        if (state === 'connected') {
          setSystemStatus((prev) => ({ ...prev, wsStatus: 'CONNECTED' }));
          stopPolling();
        } else if (state === 'connecting') {
          setSystemStatus((prev) => ({ ...prev, wsStatus: 'CONNECTING' }));
        } else {
          setSystemStatus((prev) => ({ ...prev, wsStatus: 'DISCONNECTED' }));
          startPolling(selectedOutlet.outletId);
        }
      };

      connection.bind('state_change', (states: { previous: string; current: string }) => {
        updateStatus(states.current);
      });

      if (connection.state) {
        updateStatus(connection.state);
      }
    }

    return () => {
      isMounted = false;
      stopPolling();
      if (echo) {
        echo.leave(`outlet.${selectedOutlet.outletId}`);
        echo.disconnect();
      }
    };
  }, [selectedOutlet, fetchPendingOrders, handleIncomingOrder, startPolling, stopPolling]);

  // Actions
  const handleToggleSound = async () => {
    if (systemStatus.audioStatus === 'ENABLED') {
      setSystemStatus((prev) => ({ ...prev, audioStatus: 'MUTED' }));
      localStorage.setItem('kitchen_sound_enabled', 'false');
      setNotificationBanner({ type: 'info', message: 'Suara notifikasi dimatikan.' });
    } else {
      const unlocked = await unlockAudio();
      if (unlocked) {
        setSystemStatus((prev) => ({ ...prev, audioStatus: 'ENABLED' }));
        localStorage.setItem('kitchen_sound_enabled', 'true');
        playNotificationSound(soundPreset, 0.5);
        setNotificationBanner({ type: 'success', message: 'Suara notifikasi berhasil diaktifkan & terkunci!' });
      }
    }
  };

  const handleTogglePush = async () => {
    if (systemStatus.pushSubscription === 'ACTIVE') {
      const res = await unsubscribeFromWebPush(selectedOutlet.outletId);
      setSystemStatus((prev) => ({ ...prev, pushSubscription: 'NOT_REGISTERED' }));
      setNotificationBanner({ type: 'info', message: res.message });
    } else {
      const res = await subscribeToWebPush(selectedOutlet.outletId);
      if (res.success) {
        setSystemStatus((prev) => ({ ...prev, pushPermission: 'granted', pushSubscription: 'ACTIVE' }));
        setNotificationBanner({ type: 'success', message: 'Web Push Notification aktif & terkunci!' });
      } else {
        setNotificationBanner({ type: 'error', message: res.message });
      }
    }
  };

  const handleTestSound = () => {
    unlockAudio();
    playNotificationSound(soundPreset, 0.7);
    setNotificationBanner({ type: 'info', message: 'Menguji suara notifikasi lonceng pesanan...' });
  };

  const handleClearOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/order-requests/clear`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setOrders([]);
        seenOrderIds.current.clear();
        setNotificationBanner({ type: 'success', message: 'Semua antrean pesanan berhasil dibersihkan!' });
      }
    } catch (err) {
      console.warn('Clear orders error:', err);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <KitchenHeader
        outletName={selectedOutlet.outletName}
        selectedOutletId={selectedOutlet.outletId}
        outlets={DEMO_OUTLETS}
        onSelectOutlet={setSelectedOutlet}
        audioStatus={systemStatus.audioStatus}
        onToggleSound={handleToggleSound}
      />

      {/* Page Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Status & Action Bar Widgets */}
        <KitchenStatusWidgets
          systemStatus={systemStatus}
          onTogglePush={handleTogglePush}
          onToggleSound={handleToggleSound}
          onTestSound={handleTestSound}
          onClearOrders={handleClearOrders}
        />

        {/* Feedback Banner */}
        {notificationBanner && (
          <Alert
            className={`${
              notificationBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : notificationBanner.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            } rounded-2xl`}
          >
            {notificationBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <AlertTitle className="text-xs font-bold uppercase tracking-wider">
              {notificationBanner.type === 'success' ? 'Informasi' : 'Pemberitahuan'}
            </AlertTitle>
            <AlertDescription className="text-xs mt-0.5">
              {notificationBanner.message}
            </AlertDescription>
          </Alert>
        )}

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Main Stream: Orders List (Cols: 8) */}
          <section className="lg:col-span-8 space-y-4">
            <KitchenOrdersList
              orders={orders}
              outletName={selectedOutlet.outletName}
            />
          </section>

          {/* Right Sidebar Widgets (Cols: 4) */}
          <aside className="lg:col-span-4 space-y-6">
            <KitchenConnectionInfo systemStatus={systemStatus} />
            <KitchenStatsWidget totalOrders={orders.length} />
          </aside>
        </div>
      </div>
    </main>
  );
}
