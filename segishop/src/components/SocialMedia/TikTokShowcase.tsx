'use client';

import React, { useEffect, useState } from 'react';
import { socialMediaService, SocialMediaPost } from '@/services/socialMediaService';
import { DEFAULT_PRODUCT_IMAGE } from '@/services/config';
import { Music2, RefreshCw, ExternalLink, Eye, Heart, MessageCircle } from 'lucide-react';

export const TikTokShowcase: React.FC = () => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (force = false) => {
    if (force) setRefreshing(true);
    try {
      const feed = await socialMediaService.getTikTokFeed({ username: 'oscarprinting', limit: 8 });
      setPosts(feed.slice(0, 8));
    } catch (e) {
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(false); }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[9/16] bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-black rounded-full p-3">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">@oscarprinting on TikTok</h2>
            <p className="text-sm text-gray-600">Latest short videos from our print shop</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => load(true)} disabled={refreshing} className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <a href="https://www.tiktok.com/@oscarprinting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900">
            Follow <ExternalLink className="h-3 w-3 ml-2" />
          </a>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-sm text-gray-600">No TikTok videos found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((p) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden">
              <div className="aspect-[9/16] w-full bg-gray-100">
                <img
                  src={p.thumbnail || 'https://placehold.co/360x640?text=TikTok'}
                  alt={p.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/360x640?text=TikTok'; }}
                />
              </div>
              <div className="p-3 text-xs text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {p.engagement.views || 0}</span>
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" /> {p.engagement.likes || 0}</span>
                </div>
                <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {p.engagement.comments || 0}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
