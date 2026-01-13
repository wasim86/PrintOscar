import { API_BASE_URL } from './config';

export interface ShopLocalLocation {
  id: number;
  title: string;
  addressLine: string;
  mapEmbedUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ShopLocalPageData {
  headline: string;
  contentHtml: string;
  locations: ShopLocalLocation[];
}

export async function getShopLocalPage(): Promise<ShopLocalPageData> {
  const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
  const res = await fetch(`${base}/site/shop-local`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
