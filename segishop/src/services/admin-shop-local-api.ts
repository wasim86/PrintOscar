import { API_BASE_URL } from './config';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function authFileHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export const adminShopLocalApi = {
  async get(): Promise<any> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local`, { headers: authHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async updatePage(payload: { headline?: string; contentHtml?: string; heroMapEmbedUrl?: string; weeklyHeading?: string; annualHeading?: string; thankYouHeading?: string; galleryHeading?: string; inactiveHeading?: string; storesHeading?: string }): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local/page`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async upsertLocation(payload: { id?: number; title?: string; addressLine?: string; mapEmbedUrl?: string; isActive?: boolean; sortOrder?: number }): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local/location`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async deleteLocation(id: number): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local/location/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async upsertMedia(payload: { id?: number; imageUrl?: string; caption?: string; group?: 'thankyou' | 'gallery'; sortOrder?: number; isActive?: boolean }): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local/media`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async deleteMedia(id: number): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/shop-local/media/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
  async uploadMediaFile(file: File): Promise<{ url: string; fullUrl: string }> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${base}/admin/shop-local/media/upload`, { method: 'POST', headers: authFileHeaders(), body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
};
