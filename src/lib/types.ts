export interface Tenant {
  id: number;
  name: string;
}

export interface Outlet {
  id: number;
  tenant_id: number;
  name: string;
  tenant?: Tenant;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'merchant';
  tenant_id: number | null;
  outlet_id: number | null;
  tenant?: Tenant | null;
  outlet?: Outlet | null;
}

export interface OrderRequest {
  id: number;
  request_number: string;
  customer_name: string;
  outlet_id: number;
  outlet_name?: string;
  status: 'pending' | 'received' | 'completed';
  created_at: string;
  transport?: 'WebSocket' | 'Polling';
}

export interface SystemStatus {
  wsStatus: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  channelName: string;
  swStatus: 'ACTIVE' | 'INACTIVE' | 'UNSUPPORTED';
  pushPermission: NotificationPermission | 'unsupported';
  pushSubscription: 'ACTIVE' | 'NOT_REGISTERED';
  audioStatus: 'ENABLED' | 'MUTED';
  lastEventName: string | null;
  lastEventTime: string | null;
  transportMode: 'WebSocket' | 'Polling (5s)';
}
