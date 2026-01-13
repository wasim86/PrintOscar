import { API_BASE_URL } from './config';

export async function getShopLocalV2(): Promise<any> {
  const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
  const res = await fetch(`${base}/site/shop-local-v2`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

