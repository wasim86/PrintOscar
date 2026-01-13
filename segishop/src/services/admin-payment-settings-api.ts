import { API_BASE_URL } from './config';

export interface PaymentSettingsResponse {
  stripe: { enabled: boolean; secretKeyMasked: string; publishableKeyMasked: string };
  paypal: { enabled: boolean; clientIdMasked: string; clientSecretMasked: string; baseUrl: string };
  updatedAt?: string;
  updatedBy?: string;
}

export interface UpdatePaymentSettingsDto {
  stripeEnabled: boolean;
  stripeSecretKey?: string;
  stripePublishableKey?: string;
  payPalEnabled: boolean;
  payPalClientId?: string;
  payPalClientSecret?: string;
  payPalBaseUrl?: string;
}

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export const adminPaymentSettingsApi = {
  async get(): Promise<PaymentSettingsResponse> {
    const res = await fetch(`${API_BASE_URL}/admin/payment-settings`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async update(dto: UpdatePaymentSettingsDto): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/payment-settings`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  },
};
