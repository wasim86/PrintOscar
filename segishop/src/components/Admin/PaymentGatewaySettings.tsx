'use client';

import React, { useEffect, useState } from 'react';
import { adminPaymentSettingsApi, PaymentSettingsResponse, UpdatePaymentSettingsDto } from '@/services/admin-payment-settings-api';
import { Loader2, Save, EyeOff, Eye } from 'lucide-react';

export const PaymentGatewaySettings: React.FC = () => {
  const [data, setData] = useState<PaymentSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);

  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');

  const [payPalEnabled, setPayPalEnabled] = useState(false);
  const [payPalClientId, setPayPalClientId] = useState('');
  const [payPalClientSecret, setPayPalClientSecret] = useState('');
  const [payPalBaseUrl, setPayPalBaseUrl] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminPaymentSettingsApi.get();
      setData(res);
      setStripeEnabled(res.stripe.enabled);
      setPayPalEnabled(res.paypal.enabled);
      setPayPalBaseUrl(res.paypal.baseUrl);
      setMessage(null);
      setMessageType(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const dto: UpdatePaymentSettingsDto = {
        stripeEnabled,
        stripeSecretKey: stripeSecretKey || undefined,
        stripePublishableKey: stripePublishableKey || undefined,
        payPalEnabled,
        payPalClientId: payPalClientId || undefined,
        payPalClientSecret: payPalClientSecret || undefined,
        payPalBaseUrl: payPalBaseUrl || undefined,
      };
      await adminPaymentSettingsApi.update(dto);
      await load();
      setMessage('Saved successfully');
      setMessageType('success');
      setStripeSecretKey('');
      setStripePublishableKey('');
      setPayPalClientId('');
      setPayPalClientSecret('');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-md p-3 text-sm ${messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message}</div>
      )}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Stripe</h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={stripeEnabled} onChange={e => setStripeEnabled(e.target.checked)} />
              <span>Enabled</span>
            </label>
            <button className="px-2 py-1 rounded bg-gray-100" onClick={() => setShowSecrets(!showSecrets)}>
              {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Secret Key</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              placeholder={data?.stripe.secretKeyMasked || ''}
              value={stripeSecretKey}
              onChange={e => setStripeSecretKey(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Publishable Key</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              placeholder={data?.stripe.publishableKeyMasked || ''}
              value={stripePublishableKey}
              onChange={e => setStripePublishableKey(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing</p>
          </div>
        </div>
        {data?.updatedAt && (
          <p className="text-xs text-gray-500 mt-2">Last updated: {new Date(data.updatedAt).toLocaleString()} {data.updatedBy ? `by ${data.updatedBy}` : ''}</p>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">PayPal</h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={payPalEnabled} onChange={e => setPayPalEnabled(e.target.checked)} />
              <span>Enabled</span>
            </label>
            <button className="px-2 py-1 rounded bg-gray-100" onClick={() => setShowSecrets(!showSecrets)}>
              {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Client ID</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              placeholder={data?.paypal.clientIdMasked || ''}
              value={payPalClientId}
              onChange={e => setPayPalClientId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Client Secret</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              placeholder={data?.paypal.clientSecretMasked || ''}
              value={payPalClientSecret}
              onChange={e => setPayPalClientSecret(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Base URL</label>
            <input
              type={'text'}
              placeholder={data?.paypal.baseUrl || ''}
              value={payPalBaseUrl}
              onChange={e => setPayPalBaseUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        {data?.updatedAt && (
          <p className="text-xs text-gray-500 mt-2">Last updated: {new Date(data.updatedAt).toLocaleString()} {data.updatedBy ? `by ${data.updatedBy}` : ''}</p>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </button>
      </div>
    </div>
  );
};
