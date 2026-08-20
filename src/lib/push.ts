function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Worker is not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

export async function checkExistingPushSubscription(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }

  try {
    const registration = await registerServiceWorker();
    if (!registration) return false;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.warn('Check push subscription error:', error);
    return false;
  }
}

export async function subscribeToWebPush(
  outletId: number
): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Browser environment is required.' };
  }

  // Detect iOS Safari without PWA Add-to-Home-Screen
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

  if (!('PushManager' in window)) {
    if (isIos && !isStandalone) {
      return {
        success: false,
        message: 'Khusus iPhone (iOS): Tekan tombol Bagikan (Share ⬆️) di bawah Safari ➔ "Tambahkan ke Layar Utama" (Add to Home Screen). Lalu buka dari ikon Layar Utama untuk mengaktifkan notifikasi.',
      };
    }
    return { success: false, message: 'Push notifications are not supported in this browser tab.' };
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    return { success: false, message: 'NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, message: 'Izin notifikasi browser ditolak atau diabaikan.' };
    }

    const registration = await registerServiceWorker();
    if (!registration) {
      return { success: false, message: 'Tidak dapat mengaktifkan Service Worker.' };
    }

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as BufferSource,
      });
    }

    const rawKey = subscription.getKey ? subscription.getKey('p256dh') : null;
    const rawAuth = subscription.getKey ? subscription.getKey('auth') : null;

    if (!rawKey || !rawAuth) {
      return { success: false, message: 'Gagal mengekstrak push encryption keys.' };
    }

    const p256dh = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(rawKey))));
    const auth = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(rawAuth))));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/push-subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        outlet_id: outletId,
        keys: {
          p256dh,
          auth,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, message: err.message || 'Gagal menyimpan subscription ke server.' };
    }

    // Save persistent flag in localStorage
    try {
      localStorage.setItem(`kitchen_push_enabled_${outletId}`, 'true');
      localStorage.setItem('kitchen_push_global', 'true');
    } catch {}

    return { success: true, message: 'Web Push Notification berhasil diaktifkan & terkunci!' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Error subscribing to Web Push.' };
  }
}

export async function unsubscribeFromWebPush(
  outletId: number
): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return { success: false, message: 'Service worker not supported.' };
  }

  try {
    const registration = await registerServiceWorker();
    if (!registration) return { success: false, message: 'Service worker not found.' };

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/push-subscriptions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      });
    }

    try {
      localStorage.removeItem(`kitchen_push_enabled_${outletId}`);
      localStorage.removeItem('kitchen_push_global');
    } catch {}

    return { success: true, message: 'Web Push Notification berhasil dimatikan secara manual.' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Gagal mematikan Web Push.' };
  }
}
