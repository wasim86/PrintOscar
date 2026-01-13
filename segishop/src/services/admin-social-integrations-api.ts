import { API_BASE_URL } from './config';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const adminSocialIntegrationsApi = {
  async get(): Promise<any> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/social-integrations`, { headers: authHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async update(payload: { youTubeChannelId?: string; youTubeApiKey?: string; instagramUserId?: string; instagramAccessToken?: string; tikTokUsername?: string; useManualYouTube?: boolean; youTubeManualLinks?: string; useManualInstagram?: boolean; instagramManualLinks?: string; useManualTikTok?: boolean; tikTokManualLinks?: string }): Promise<void> {
    const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
    const res = await fetch(`${base}/admin/social-integrations`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }
};
