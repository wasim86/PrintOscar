import { API_BASE_URL } from './config';

export interface ShopLocalV2Response {
  settings?: unknown;
  seasonal?: unknown[];
  annual?: unknown[];
  weekly?: unknown[];
  stores?: unknown[];
  gallery?: unknown[];
  [key: string]: unknown;
}

export async function getShopLocalV2(): Promise<ShopLocalV2Response> {
  const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
  const res = await fetch(`${base}/site/shop-local-v2`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as ShopLocalV2Response;
  return data;
}
