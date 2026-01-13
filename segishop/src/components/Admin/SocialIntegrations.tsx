'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { adminSocialIntegrationsApi } from '@/services/admin-social-integrations-api';

export default function SocialIntegrations() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [youTubeChannelId, setYouTubeChannelId] = useState('');
  const [youTubeApiKey, setYouTubeApiKey] = useState('');
  const [instagramUserId, setInstagramUserId] = useState('');
  const [instagramAccessToken, setInstagramAccessToken] = useState('');
  const [tikTokUsername, setTikTokUsername] = useState('printoscar');
  const [useManualYouTube, setUseManualYouTube] = useState(false);
  const [youTubeManualLinks, setYouTubeManualLinks] = useState('');
  const [useManualInstagram, setUseManualInstagram] = useState(false);
  const [instagramManualLinks, setInstagramManualLinks] = useState('');
  const [useManualTikTok, setUseManualTikTok] = useState(false);
  const [tikTokManualLinks, setTikTokManualLinks] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const s = await adminSocialIntegrationsApi.get();
      setYouTubeChannelId(s.youTubeChannelId || '');
      setYouTubeApiKey(s.youTubeApiKey || '');
      setInstagramUserId(s.instagramUserId || '');
      setInstagramAccessToken(s.instagramAccessToken || '');
      setTikTokUsername(s.tikTokUsername || 'printoscar');
      setUseManualYouTube(!!s.useManualYouTube);
      setYouTubeManualLinks(s.youTubeManualLinks || '');
      setUseManualInstagram(!!s.useManualInstagram);
      setInstagramManualLinks(s.instagramManualLinks || '');
      setUseManualTikTok(!!s.useManualTikTok);
      setTikTokManualLinks(s.tikTokManualLinks || '');
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      await adminSocialIntegrationsApi.update({ youTubeChannelId: youTubeChannelId, youTubeApiKey: youTubeApiKey, instagramUserId: instagramUserId, instagramAccessToken: instagramAccessToken, tikTokUsername: tikTokUsername, useManualYouTube, youTubeManualLinks, useManualInstagram, instagramManualLinks, useManualTikTok, tikTokManualLinks });
      setFeedback('Saved');
    } catch (e: any) {
      setFeedback(e?.message || 'Save failed');
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
          <h3 className="text-lg font-semibold text-gray-900">Social Integrations</h3>
          <button onClick={onSave} disabled={saving} className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"><Save className="h-4 w-4 mr-2" /> Save</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">YouTube Channel ID</label>
            <input type="text" value={youTubeChannelId} onChange={e => setYouTubeChannelId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">YouTube API Key</label>
            <input type="text" value={youTubeApiKey} onChange={e => setYouTubeApiKey(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <input id="yt-manual" type="checkbox" checked={useManualYouTube} onChange={e => setUseManualYouTube(e.target.checked)} />
              <label htmlFor="yt-manual" className="text-sm text-gray-700">Use Manual YouTube Links</label>
            </div>
            <textarea placeholder="Paste YouTube video or shorts links, one per line" value={youTubeManualLinks} onChange={e => setYouTubeManualLinks(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 h-24" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Instagram User ID</label>
            <input type="text" value={instagramUserId} onChange={e => setInstagramUserId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Instagram Access Token</label>
            <input type="text" value={instagramAccessToken} onChange={e => setInstagramAccessToken(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <input id="ig-manual" type="checkbox" checked={useManualInstagram} onChange={e => setUseManualInstagram(e.target.checked)} />
              <label htmlFor="ig-manual" className="text-sm text-gray-700">Use Manual Instagram Links</label>
            </div>
            <textarea placeholder="Paste Instagram post links, one per line" value={instagramManualLinks} onChange={e => setInstagramManualLinks(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 h-24" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">TikTok Username</label>
            <input type="text" value={tikTokUsername} onChange={e => setTikTokUsername(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <input id="tt-manual" type="checkbox" checked={useManualTikTok} onChange={e => setUseManualTikTok(e.target.checked)} />
              <label htmlFor="tt-manual" className="text-sm text-gray-700">Use Manual TikTok Links</label>
            </div>
            <textarea placeholder="Paste TikTok video links, one per line" value={tikTokManualLinks} onChange={e => setTikTokManualLinks(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 h-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
