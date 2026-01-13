'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save, Plus, Trash } from 'lucide-react';
import { adminShopLocalV2Api } from '@/services/admin-shop-local-v2-api';
import { IMAGE_BASE_URL } from '@/services/config';

export const ShopLocalNewSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState('Shop Local');
  const [heroSubtitle, setHeroSubtitle] = useState('DMV Area');
  const [events, setEvents] = useState<Array<any>>([]);
  const [gallery, setGallery] = useState<Array<any>>([]);
  const [activeGroup, setActiveGroup] = useState<'seasonal'|'annual'|'weekly'|'monthly'|'store'>('weekly');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminShopLocalV2Api.get();
      setHeroTitle(data.settings?.heroTitle || 'Shop Local');
      setHeroSubtitle(data.settings?.heroSubtitle || 'DMV Area');
      setEvents(data.events || []);
      setGallery(data.media || []);
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSaveHero = async () => {
    setSaving(true);
    try {
      await adminShopLocalV2Api.updateSettings({ heroTitle, heroSubtitle });
      setFeedback('Saved');
    } catch (e: any) {
      setFeedback(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addEvent = () => setEvents(prev => [...prev, { title: '', schedule: '', time: '', address: '', type: activeGroup, mapEmbedUrl: '', googleMapsLink: '', isActive: true, sortOrder: (prev?.length || 0) }]);

  const extractSrc = (raw: string) => {
    const s = (raw || '').trim();
    if (!s) return '';
    if (s.includes('<iframe')) {
      const m = s.match(/src=["']([^"']+)["']/);
      return m?.[1] || '';
    }
    return s;
  };

  const onSaveEvent = async (ev: any, idx: number) => {
    setSaving(true);
    try {
      await adminShopLocalV2Api.upsertEvent({ id: ev.id, title: ev.title, schedule: ev.schedule, time: ev.time, address: ev.address, type: ev.type, mapEmbedUrl: extractSrc(ev.mapEmbedUrl || ''), googleMapsLink: ev.googleMapsLink, sortOrder: Number(ev.sortOrder) || 0, isActive: !!ev.isActive });
      await load();
      setFeedback('Event saved');
    } catch (e: any) {
      setFeedback(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDeleteEvent = async (id: number) => {
    setSaving(true);
    try {
      await adminShopLocalV2Api.deleteEvent(id);
      await load();
      setFeedback('Event deleted');
    } catch (e: any) {
      setFeedback(e?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const bulkUploadGallery = async (files: FileList | null, category: string = 'market') => {
    if (!files || files.length === 0) return;
    setSaving(true);
    try {
      const existing = gallery;
      const maxOrder = existing.reduce((acc, m) => Math.max(acc, Number(m.sortOrder || 0)), -1);
      let uploaded = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await adminShopLocalV2Api.uploadMediaFile(file);
        const imageUrl = res.fullUrl || (res.url ? `${IMAGE_BASE_URL}${res.url}` : '');
        await adminShopLocalV2Api.upsertMedia({ imageUrl, category, sortOrder: maxOrder + 1 + i, isActive: true });
        uploaded++;
      }
      await load();
      setFeedback(`${uploaded} photo(s) uploaded`);
    } catch (err) {
      setFeedback('Bulk upload failed');
    } finally {
      setSaving(false);
    }
  };

  const onSaveMedia = async (m: any, idx: number) => {
    setSaving(true);
    try {
      await adminShopLocalV2Api.upsertMedia({ id: m.id, imageUrl: m.imageUrl, category: m.category, sortOrder: Number(m.sortOrder) || 0, isActive: !!m.isActive });
      await load();
      setFeedback('Saved');
    } catch (e: any) {
      setFeedback('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDeleteMedia = async (id: number) => {
    setSaving(true);
    try {
      await adminShopLocalV2Api.deleteMedia(id);
      await load();
      setFeedback('Deleted');
    } catch (e: any) {
      setFeedback('Delete failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {feedback && <div className="p-2 rounded bg-orange-50 text-orange-700">{feedback}</div>}

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shop Local New Page</h3>
          <button onClick={onSaveHero} disabled={saving} className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"><Save className="h-4 w-4 mr-2" /> Save Page</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hero Title</label>
            <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hero Subtitle</label>
            <input type="text" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Events & Markets</h3>
          <div className="flex items-center gap-2">
            {(['weekly','monthly','seasonal','annual','store'] as const).map(g => (
              <button key={g} onClick={() => setActiveGroup(g)} className={`px-3 py-2 rounded-lg text-sm ${activeGroup===g?'bg-orange-600 text-white':'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>{g}</button>
            ))}
            <button onClick={addEvent} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"><Plus className="h-4 w-4 mr-2" /> Add</button>
          </div>
        </div>
        <div className="space-y-4">
          {events.filter(e => (e.type || 'weekly') === activeGroup).map((ev, idx) => (
            <div key={ev.id ? `event-${ev.id}-${idx}` : `event-${activeGroup}-${idx}`} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input type="text" value={ev.title || ''} onChange={e => setEvents(prev => prev.map(x => x===ev ? { ...x, title: e.target.value } : x))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Schedule</label>
                  <input type="text" value={ev.schedule || ''} onChange={e => setEvents(prev => prev.map(x => x===ev ? { ...x, schedule: e.target.value } : x))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Time</label>
                  <input type="text" value={ev.time || ''} onChange={e => setEvents(prev => prev.map(x => x===ev ? { ...x, time: e.target.value } : x))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input type="text" value={ev.address || ''} onChange={e => setEvents(prev => prev.map(x => x===ev ? { ...x, address: e.target.value } : x))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Google Maps Embed URL</label>
                  <input type="text" value={ev.mapEmbedUrl || ''} onChange={e => setEvents(prev => prev.map(x => x===ev ? { ...x, mapEmbedUrl: e.target.value } : x))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" placeholder="Paste iframe src or full iframe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Google Maps Link</label>
                  <input type="text" value={ev.googleMapsLink || ''} onChange={e => setEvents(prev => prev.map(x => x===ev ? { ...x, googleMapsLink: e.target.value } : x))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button onClick={() => onSaveEvent(ev, idx)} disabled={saving} className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"><Save className="h-4 w-4 mr-2" /> Save</button>
                {ev.id && (
                  <button onClick={() => onDeleteEvent(ev.id)} disabled={saving} className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center"><Trash className="h-4 w-4 mr-2" /> Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
          <div className="flex items-center gap-2">
            <select id="bulkCategory" className="border border-gray-300 rounded px-2 py-2 text-sm bg-white text-gray-900">
              <option value="market">Market</option>
              <option value="event">Event</option>
              <option value="team">Team</option>
              <option value="products">Products</option>
              <option value="community">Community</option>
            </select>
            <label className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer inline-flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Bulk Upload
              <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => { const select = document.getElementById('bulkCategory') as HTMLSelectElement | null; const cat = select?.value || 'market'; await bulkUploadGallery(e.target.files, cat); if (e.target) e.target.value=''; }} />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {gallery.map((m, idx) => (
            <div key={m.id ? `gallery-${m.id}-${idx}` : `gallery-${idx}`} className="relative">
              <img src={m.imageUrl || ''} alt={m.caption || ''} className="w-full h-32 sm:h-36 md:h-40 object-cover rounded border" />
              {m.id && (
                <button onClick={() => onDeleteMedia(m.id)} disabled={saving} className="absolute top-2 right-2 bg-white/90 text-red-600 hover:bg-white rounded-full p-2 shadow">
                  <Trash className="h-4 w-4" />
                </button>
              )}
              <div className="mt-2 flex items-center gap-2">
                <select value={m.category || 'market'} onChange={e => setGallery(prev => prev.map(x => x===m ? { ...x, category: e.target.value } : x))} className="border rounded px-2 py-1 text-sm">
                  <option value="market">Market</option>
                  <option value="event">Event</option>
                  <option value="team">Team</option>
                  <option value="products">Products</option>
                  <option value="community">Community</option>
                </select>
                <button onClick={() => onSaveMedia(m, idx)} disabled={saving} className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700">
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
