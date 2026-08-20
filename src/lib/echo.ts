import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any> | undefined;
  }
}

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

export function initEcho(token?: string): Echo<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const appKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'yxhfrg84qajl8qjgj0l4';
  const wsHost = process.env.NEXT_PUBLIC_REVERB_HOST || (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1');
  const wsPort = Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080;
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http';

  const echo = new Echo({
    broadcaster: 'reverb',
    key: appKey,
    wsHost: wsHost,
    wsPort: wsPort,
    wssPort: wsPort,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${apiUrl}/api/broadcasting/auth`,
    auth: {
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });

  if (typeof window !== 'undefined') {
    window.Echo = echo;
  }

  return echo;
}
