'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { API_BASE_URL } from '@/services/config';

type BannerDto = { message?: string; backgroundColor?: string; textColor?: string; enabled?: boolean; centered?: boolean };

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export const SiteBannerSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [bg, setBg] = useState('#f4c363');
  const [text, setText] = useState('#1f2937');
  const [enabled, setEnabled] = useState(true);
  const [centered, setCentered] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/site/banner`, { headers: authHeaders() });
      const data = await res.json();
      setMessage(data.message || '');
      setBg(data.backgroundColor || '#f4c363');
      setText(data.textColor || '#1f2937');
      setEnabled(!!data.enabled);
      setCentered(!!data.centered);
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const dto: BannerDto = { message, backgroundColor: bg, textColor: text, enabled, centered };
      const res = await fetch(`${API_BASE_URL}/admin/site/banner`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(dto) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
      setFeedback('Saved successfully');
    } catch (e: any) {
      setFeedback(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-48"><Loader2 className="h-6 w-6 animate-spin text-orange-600" /></div>;
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className={`rounded-md p-3 text-sm ${feedback.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{feedback}</div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Site Banner</h3>
          <label className="flex items-center space-x-2 text-sm"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /><span>Enabled</span></label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g. Holiday Sale: 20% off!" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Centered</label>
            <label className="inline-flex items-center space-x-2"><input type="checkbox" checked={centered} onChange={e => setCentered(e.target.checked)} /><span>Center text</span></label>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bg.startsWith('#') ? bg : `#${bg}`}
                onChange={e => setBg(e.target.value)}
                className="h-10 w-12 p-0 border rounded"
                aria-label="Pick background color"
              />
              <input
                type="text"
                value={bg}
                onChange={e => setBg(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="#f4c363"
                aria-label="Background color hex"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={text.startsWith('#') ? text : `#${text}`}
                onChange={e => setText(e.target.value)}
                className="h-10 w-12 p-0 border rounded"
                aria-label="Pick text color"
              />
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="#1f2937"
                aria-label="Text color hex"
              />
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">Preview</div>
          <div className="rounded border border-gray-200" style={{ backgroundColor: bg, color: text }}>
            <div className={`py-3 px-4 ${centered ? 'text-center' : ''}`}>{message || 'Your banner message here'}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </button>
      </div>
    </div>
  );
};
