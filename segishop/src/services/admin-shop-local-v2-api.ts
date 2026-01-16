import { API_BASE_URL } from './config';
import { ShopLocalV2Response } from './public-shop-local-v2';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function authFileHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export const adminShopLocalV2Api = {
  async get(): Promise<ShopLocalV2Response> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local-v2`, { headers: authHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as ShopLocalV2Response;
    return data;
  },
  async updateSettings(payload: { heroTitle?: string; heroSubtitle?: string }): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local-v2/settings`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async upsertEvent(payload: { id?: number; title?: string; schedule?: string; time?: string; address?: string; type?: string; mapEmbedUrl?: string; googleMapsLink?: string; sortOrder?: number; isActive?: boolean }): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local-v2/event`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async deleteEvent(id: number): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local-v2/event/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async upsertMedia(payload: { id?: number; imageUrl?: string; caption?: string; category?: string; sortOrder?: number; isActive?: boolean }): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local-v2/media`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async deleteMedia(id: number): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local-v2/media/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async uploadMediaFile(file: File): Promise<{ url: string; fullUrl: string }> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${base}/admin/shop-local-v2/media/upload`, { method: 'POST', headers: authFileHeaders(), body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
};
