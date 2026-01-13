import { API_BASE_URL } from './config';

export interface PublicPaymentConfig {
  paypalClientId: string;
  stripePublishableKey: string;
  paypalEnabled: boolean;
  stripeEnabled: boolean;
}

export async function getPublicPaymentConfig(): Promise<PublicPaymentConfig> {
  const res = await fetch(`${API_BASE_URL}/payment/public-config`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}