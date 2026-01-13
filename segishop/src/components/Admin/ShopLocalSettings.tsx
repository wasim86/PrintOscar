'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save, Plus, Trash } from 'lucide-react';
import { adminShopLocalApi } from '@/services/admin-shop-local-api';
import { IMAGE_BASE_URL } from '@/services/config';

export const ShopLocalSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [headline, setHeadline] = useState('Shop Local');
  const [contentHtml, setContentHtml] = useState('');
  const [heroMapEmbedUrl, setHeroMapEmbedUrl] = useState('');
  const [weeklyHeading, setWeeklyHeading] = useState('DMV Weekly/Monthly Markets');
  const [annualHeading, setAnnualHeading] = useState('DMV Annual Events');
  const [thankYouHeading, setThankYouHeading] = useState('THANK YOU DMV FOR YOUR SUPPORT SINCE 2021!');
  const [galleryHeading, setGalleryHeading] = useState('HOPE TO SEE YOU AROUND!');
  const [inactiveHeading, setInactiveHeading] = useState('Inactive Markets and Events (Current Year)');
  const [storesHeading, setStoresHeading] = useState('DMV Stores');
  const [media, setMedia] = useState<Array<any>>([]);
  const [locations, setLocations] = useState<Array<any>>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [currentLocGroup, setCurrentLocGroup] = useState<'weekly' | 'annual' | 'inactive' | 'stores'>('weekly');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminShopLocalApi.get();
      setHeadline(data.page?.headline || 'Shop Local');
      setContentHtml(data.page?.contentHtml || '');
      setHeroMapEmbedUrl(data.page?.heroMapEmbedUrl || '');
      setWeeklyHeading(data.page?.weeklyHeading || 'DMV Weekly/Monthly Markets');
      setAnnualHeading(data.page?.annualHeading || 'DMV Annual Events');
      setThankYouHeading(data.page?.thankYouHeading || 'THANK YOU DMV FOR YOUR SUPPORT SINCE 2021!');
      setGalleryHeading(data.page?.galleryHeading || 'HOPE TO SEE YOU AROUND!');
      setInactiveHeading(data.page?.inactiveHeading || 'Inactive Markets and Events (Current Year)');
      setStoresHeading(data.page?.storesHeading || 'DMV Stores');
      setLocations(data.locations || []);
      setMedia(data.media || []);
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSavePage = async () => {
    setSaving(true);
    try {
      const raw = heroMapEmbedUrl?.trim() || '';
      const extracted = raw.includes('<iframe') ? (raw.match(/src=["']([^"']+)["']/)?.[1] || '') : raw;
      await adminShopLocalApi.updatePage({ headline, contentHtml, heroMapEmbedUrl: extracted, weeklyHeading, annualHeading, thankYouHeading, galleryHeading, inactiveHeading, storesHeading });
      setFeedback('Saved successfully');
    } catch (e: any) {
      setFeedback(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () => setLocations(prev => [...prev, { title: '', addressLine: '', mapEmbedUrl: '', isActive: true, sortOrder: (prev?.length || 0), group: currentLocGroup }]);

  const onSaveLocation = async (loc: any, index: number) => {
    setSaving(true);
    try {
      const raw = (loc.mapEmbedUrl || '').trim();
      const extracted = raw.includes('<iframe') ? (raw.match(/src=["']([^"']+)["']/)?.[1] || '') : raw;
      await adminShopLocalApi.upsertLocation({ id: loc.id, title: loc.title, addressLine: loc.addressLine, mapEmbedUrl: extracted, isActive: !!loc.isActive, sortOrder: Number(loc.sortOrder) || 0, group: loc.group || currentLocGroup });
      await load();
      setFeedback('Location saved');
    } catch (e: any) {
      setFeedback(e?.message || 'Location save failed');
    } finally {
      setSaving(false);
    }
  };

  const addThankYouMedia = () => setMedia(prev => [...prev, { imageUrl: '', caption: '', group: 'thankyou', isActive: true, sortOrder: (prev?.length || 0) }]);
  const addGalleryMedia = () => setMedia(prev => [...prev, { imageUrl: '', caption: '', group: 'gallery', isActive: true, sortOrder: (prev?.length || 0) }]);

  const onSaveMedia = async (m: any, idx: number) => {
    setSaving(true);
    try {
      await adminShopLocalApi.upsertMedia({ id: m.id, imageUrl: m.imageUrl, caption: m.caption, group: m.group, sortOrder: Number(m.sortOrder) || 0, isActive: !!m.isActive });
      await load();
      setFeedback('Media saved');
    } catch (e: any) {
      setFeedback(e?.message || 'Media save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDeleteMedia = async (id: number) => {
    setSaving(true);
    try {
      await adminShopLocalApi.deleteMedia(id);
      await load();
      setFeedback('Media deleted');
    } catch (e: any) {
      setFeedback(e?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const onDeleteLocation = async (id: number) => {
    setSaving(true);
    try {
      await adminShopLocalApi.deleteLocation(id);
      await load();
      setFeedback('Location deleted');
    } catch (e: any) {
      setFeedback(e?.message || 'Delete failed');
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
        <div className={`rounded-md p-3 text-sm ${feedback.includes('success') || feedback.includes('saved') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{feedback}</div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shop Local Page</h3>
          <button onClick={onSavePage} disabled={saving} className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"><Save className="h-4 w-4 mr-2" /> Save Page</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Headline</label>
            <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Content (HTML)</label>
            <textarea value={contentHtml} onChange={e => setContentHtml(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 min-h-32 bg-white text-gray-900 placeholder:text-gray-700" placeholder="Optional HTML content for intro section" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Hero Google Maps Embed URL</label>
            <input type="text" value={heroMapEmbedUrl} onChange={e => setHeroMapEmbedUrl(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" placeholder="Paste iframe src from Google Maps Embed" />
            <p className="text-xs text-gray-500 mt-1">Google Maps → Share → Embed a map → Copy iframe src URL. You can also paste the full &lt;iframe&gt; code; we will extract the src automatically.</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Weekly/Monthly Heading</label>
            <input type="text" value={weeklyHeading} onChange={e => setWeeklyHeading(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Annual Events Heading</label>
            <input type="text" value={annualHeading} onChange={e => setAnnualHeading(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Thank You Heading</label>
            <input type="text" value={thankYouHeading} onChange={e => setThankYouHeading(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Gallery Heading</label>
            <input type="text" value={galleryHeading} onChange={e => setGalleryHeading(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Inactive Heading</label>
            <input type="text" value={inactiveHeading} onChange={e => setInactiveHeading(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Stores Heading</label>
            <input type="text" value={storesHeading} onChange={e => setStoresHeading(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
              {(['weekly','annual','inactive','stores'] as const).map(g => (
                <button key={g} onClick={() => setCurrentLocGroup(g)} className={`px-3 py-2 text-sm ${currentLocGroup===g?'bg-orange-600 text-white':'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>{g.charAt(0).toUpperCase()+g.slice(1)}</button>
              ))}
            </div>
            <button onClick={addLocation} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"><Plus className="h-4 w-4 mr-2" /> Add Location</button>
          </div>
        </div>

        <div className="space-y-4">
          {locations.filter(l => (l.group || 'weekly') === currentLocGroup).map((loc, idx) => (
            <div key={loc.id ?? idx} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input type="text" value={loc.title || ''} onChange={e => setLocations(prev => prev.map((l) => l === loc ? { ...l, title: e.target.value } : l))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input type="text" value={loc.addressLine || ''} onChange={e => setLocations(prev => prev.map((l) => l === loc ? { ...l, addressLine: e.target.value } : l))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Group</label>
                  <select value={loc.group || 'weekly'} onChange={e => setLocations(prev => prev.map((l) => l === loc ? { ...l, group: e.target.value } : l))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900">
                    <option value="weekly">Weekly/Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="inactive">Inactive</option>
                    <option value="stores">Stores</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Google Maps Embed URL</label>
                  <input type="text" value={loc.mapEmbedUrl || ''} onChange={e => setLocations(prev => prev.map((l) => l === loc ? { ...l, mapEmbedUrl: e.target.value } : l))} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder:text-gray-700" placeholder="Paste maps embed link" />
                  <p className="text-xs text-gray-500 mt-1">Use Google Maps → Share → Embed a map → Copy iframe src. You can also paste the full &lt;iframe&gt; code; we will extract the src automatically.</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button onClick={() => onSaveLocation(loc, idx)} disabled={saving} className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"><Save className="h-4 w-4 mr-2" /> Save</button>
                {loc.id && (
                  <button onClick={() => onDeleteLocation(loc.id)} disabled={saving} className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center"><Trash className="h-4 w-4 mr-2" /> Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Thank You Slider</h3>
          <div className="flex items-center gap-2">
            <label className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer inline-flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Bulk Upload
              <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                setSaving(true);
                try {
                  const existing = media.filter((m) => m.group === 'thankyou');
                  const maxOrder = existing.reduce((acc, m) => Math.max(acc, Number(m.sortOrder || 0)), -1);
                  let uploaded = 0;
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const res = await adminShopLocalApi.uploadMediaFile(file);
                    const imageUrl = res.fullUrl || (res.url ? `${IMAGE_BASE_URL}${res.url}` : '');
                    await adminShopLocalApi.upsertMedia({ imageUrl, caption: '', group: 'thankyou', sortOrder: maxOrder + 1 + i, isActive: true });
                    uploaded++;
                  }
                  await load();
                  setFeedback(`${uploaded} photo(s) uploaded`);
                } catch (err) {
                  setFeedback('Bulk upload failed');
                } finally {
                  setSaving(false);
                  if (e.target) e.target.value = '';
                }
              }} />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {media.filter((m) => m.group === 'thankyou').map((m, idx) => (
            <div key={m.id ?? `thankyou-${idx}`} className="relative">
              <img src={m.imageUrl || ''} alt={m.caption || ''} className="w-full h-32 sm:h-36 md:h-40 object-cover rounded border" />
              {m.id && (
                <button onClick={() => onDeleteMedia(m.id)} disabled={saving} className="absolute top-2 right-2 bg-white/90 text-red-600 hover:bg-white rounded-full p-2 shadow">
                  <Trash className="h-4 w-4" />
                </button>
              )}
              <div className="mt-2 flex items-center gap-2">
                <input type="text" value={m.caption || ''} onChange={e => setMedia(prev => prev.map((x, i) => i === prev.indexOf(m) ? { ...x, caption: e.target.value } : x))} className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Caption" />
                <button onClick={() => onSaveMedia(m, idx)} disabled={saving} className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700">
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
          <div className="flex items-center gap-2">
            <label className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer inline-flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Bulk Upload
              <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                setSaving(true);
                try {
                  const existing = media.filter((m) => m.group === 'gallery');
                  const maxOrder = existing.reduce((acc, m) => Math.max(acc, Number(m.sortOrder || 0)), -1);
                  let uploaded = 0;
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const res = await adminShopLocalApi.uploadMediaFile(file);
                    const imageUrl = res.fullUrl || (res.url ? `${IMAGE_BASE_URL}${res.url}` : '');
                    await adminShopLocalApi.upsertMedia({ imageUrl, caption: '', group: 'gallery', sortOrder: maxOrder + 1 + i, isActive: true });
                    uploaded++;
                  }
                  await load();
                  setFeedback(`${uploaded} photo(s) uploaded`);
                } catch (err) {
                  setFeedback('Bulk upload failed');
                } finally {
                  setSaving(false);
                  if (e.target) e.target.value = '';
                }
              }} />
            </label>
            <button onClick={addGalleryMedia} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center"><Plus className="h-4 w-4 mr-2" /> Add Photo</button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {media.filter((m) => m.group === 'gallery').map((m, idx) => (
            <div key={m.id ?? `gallery-${idx}`} className="relative">
              <img src={m.imageUrl || ''} alt={m.caption || ''} className="w-full h-32 sm:h-36 md:h-40 object-cover rounded border" />
              {m.id && (
                <button onClick={() => onDeleteMedia(m.id)} disabled={saving} className="absolute top-2 right-2 bg-white/90 text-red-600 hover:bg-white rounded-full p-2 shadow">
                  <Trash className="h-4 w-4" />
                </button>
              )}
              <div className="mt-2 flex items-center gap-2">
                <input type="text" value={m.caption || ''} onChange={e => setMedia(prev => prev.map((x, i) => i === prev.indexOf(m) ? { ...x, caption: e.target.value } : x))} className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Caption" />
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
