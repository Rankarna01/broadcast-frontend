// Service Worker for Delivery Broadcast Web Push
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {
    request_number: 'REQ-0000',
    customer_name: 'Customer Demo',
    outlet_name: 'Outlet',
    created_at: new Date().toLocaleTimeString(),
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.request_number = event.data.text();
    }
  }

  const title = '🔔 New Order Request';
  const options = {
    body: `${data.request_number} • ${data.customer_name}\nOutlet: ${data.outlet_name || 'Outlet Medan'}\nReceived: ${data.created_at || 'Just now'}\n\nTap to open Kitchen Display`,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `order-${data.request_number || Date.now()}`,
    renotify: true,
    requireInteraction: true,
    data: {
      url: '/merchant/kitchen',
      request_number: data.request_number,
      outlet_id: data.outlet_id,
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/merchant/kitchen';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
