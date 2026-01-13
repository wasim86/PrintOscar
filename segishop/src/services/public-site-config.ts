import { API_BASE_URL } from './config';

export interface SiteBannerConfig {
  message: string;
  backgroundColor: string;
  textColor: string;
  enabled: boolean;
  centered: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export async function getSiteBannerConfig(): Promise<SiteBannerConfig> {
  const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL.replace(/\/+$/, '')}/api`;
  const res = await fetch(`${base}/site/banner`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
