// Social Media Service for WordPress Plugin Integration
// Handles API calls to Instagram Feed, TikTok, and YouTube plugins

import { API_BASE_URL } from './config';

/* ===================== TYPES ===================== */

export interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  type: 'image' | 'video' | 'carousel';
  url: string;
  thumbnail: string;
  caption: string;
  author: {
    username: string;
    avatar: string;
    displayName: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares?: number;
    views?: number;
  };
  createdAt: string;
  mediaUrl: string;
  aspectRatio?: string;
}

export interface SocialMediaFeedOptions {
  limit?: number;
  feedId?: string;
  username?: string;
  hashtag?: string;
  layout?: 'grid' | 'masonry' | 'carousel';
}

export interface InstagramFeedOptions extends SocialMediaFeedOptions {
  cols?: number;
  showHeader?: boolean;
  showFollow?: boolean;
  showCaption?: boolean;
}

export interface YouTubeFeedOptions extends SocialMediaFeedOptions {
  channelId?: string;
  playlistId?: string;
  showTitle?: boolean;
  showDescription?: boolean;
}

export interface TikTokFeedOptions extends SocialMediaFeedOptions {
  showProfile?: boolean;
  showStats?: boolean;
}

/* ===================== SERVICE ===================== */

class SocialMediaService {
  private proxyBase = '/api/social';
  private baseUrl = API_BASE_URL;

  /* ===================== INSTAGRAM ===================== */
  async getInstagramFeed(options: InstagramFeedOptions = {}): Promise<SocialMediaPost[]> {
    try {
      const params = new URLSearchParams({
        num: String(options.limit ?? 12),
        cols: String(options.cols ?? 3),
        showheader: String(options.showHeader ?? false),
        showfollow: String(options.showFollow ?? false),
        showcaption: String(options.showCaption ?? true),
        ...(options.feedId && { feed: options.feedId }),
        ...(options.username && { user: options.username }),
        ...(options.hashtag && { hashtag: options.hashtag }),
      });

      const base = this.baseUrl.endsWith('/api')
        ? this.baseUrl
        : `${this.baseUrl.replace(/\/+$/, '')}/api`;

      let response = await fetch(`${base}/site/social/instagram-graph`, { cache: 'no-store' });

      if (!response.ok) {
        response = await fetch(`${this.proxyBase}/instagram-graph`, { cache: 'no-store' });
      }

      if (!response.ok) {
        response = await fetch(`${this.proxyBase}/instagram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shortcode: `[instagram-feed ${params.toString().replace(/&/g, ' ')}]`,
          }),
        });
      }

      if (!response.ok) throw new Error(`Instagram error ${response.status}`);

      const data = await response.json();
      return this.transformInstagramData(data);
    } catch (err) {
      console.warn('Instagram feed error (using mock data):', err);
      return this.getMockInstagramData(options.limit ?? 12);
    }
  }

  /* ===================== YOUTUBE ===================== */
  async getYouTubeFeed(options: YouTubeFeedOptions = {}): Promise<SocialMediaPost[]> {
    try {
      const channelId = options.channelId || 'UCYourChannelIdHere';

      let response = await fetch(
        `${this.baseUrl}/jetpack/v4/youtube/videos?channelId=${channelId}&maxResults=${options.limit ?? 12}`
      );

      if (!response.ok) {
        response = await fetch(
          `${this.baseUrl}/wp/v2/youtube-feed?channel=${channelId}&limit=${options.limit ?? 12}`
        );
      }

      if (!response.ok) return this.getOscarPrintingMockData(options.limit ?? 12);

      const data = await response.json();
      return this.transformYouTubeData(data);
    } catch (err) {
      console.warn('YouTube feed error (using mock data):', err);
      return this.getOscarPrintingMockData(options.limit ?? 12);
    }
  }

  /* ===================== TIKTOK ===================== */
  async getTikTokFeed(options: TikTokFeedOptions = {}): Promise<SocialMediaPost[]> {
    try {
      let response = await fetch(`${this.baseUrl}/site/social/tiktok-user`, { cache: 'no-store' });

      if (!response.ok) {
        response = await fetch(`${this.proxyBase}/tiktok/user`, { cache: 'no-store' });
      }

      if (!response.ok) return this.getMockTikTokData(options.limit ?? 10);

      const data = await response.json();
      return this.transformTikTokData(data);
    } catch (err) {
      console.warn('TikTok feed error (using mock data):', err);
      return this.getMockTikTokData(options.limit ?? 10);
    }
  }

  /* ===================== TRANSFORMS ===================== */
  private transformInstagramData(data: any): SocialMediaPost[] {
    if (!data?.data) return [];
    return data.data.map((post: any) => ({
      id: post.id,
      platform: 'instagram',
      type: post.media_type === 'VIDEO' ? 'video' : 'image',
      url: post.permalink,
      thumbnail: post.media_url,
      caption: post.caption || '',
      author: {
        username: 'oscar.printingbanners',
        avatar: '',
        displayName: 'Oscar Printing',
      },
      engagement: { likes: 0, comments: 0 },
      createdAt: post.timestamp,
      mediaUrl: post.media_url,
      aspectRatio: '1:1',
    }));
  }

  private transformYouTubeData(data: any): SocialMediaPost[] {
    if (!Array.isArray(data?.items)) return [];
    return data.items.map((v: any) => ({
      id: v.id,
      platform: 'youtube' as const,
      type: 'video' as const,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      thumbnail: v.thumbnail || '',
      caption: v.title || '',
      author: {
        username: 'OscarPrinting',
        avatar: 'https://yt3.ggpht.com/a/default-user=s100-c-k-c0x00ffffff-no-rj',
        displayName: 'Oscar Printing',
      },
      engagement: {
        likes: v.likeCount ? parseInt(v.likeCount) : 0,
        comments: v.commentCount ? parseInt(v.commentCount) : 0,
        views: v.viewCount ? parseInt(v.viewCount) : 0,
      },
      createdAt: v.publishedAt || new Date().toISOString(),
      mediaUrl: `https://www.youtube.com/embed/${v.id}`,
      aspectRatio: '16:9',
    }));
  }

  private transformTikTokData(data: any): SocialMediaPost[] {
    if (!Array.isArray(data)) return [];
    return data.map((v: any) => ({
      id: v.id,
      platform: 'tiktok' as const,
      type: 'video' as const,
      url: v.webVideoUrl || '',
      thumbnail: v.covers?.default || '',
      caption: v.text || '',
      author: {
        username: v.authorMeta?.name || 'oscarprinting',
        avatar: v.authorMeta?.avatar || '',
        displayName: v.authorMeta?.nickName || 'Oscar Printing',
      },
      engagement: {
        likes: v.diggCount || 0,
        comments: v.commentCount || 0,
        shares: v.shareCount || 0,
        views: v.playCount || 0,
      },
      createdAt: new Date(v.createTime * 1000).toISOString(),
      mediaUrl: v.videoUrl || '',
      aspectRatio: '9:16',
    }));
  }

  /* ===================== MOCK DATA ===================== */
  private getMockInstagramData(limit: number): SocialMediaPost[] {
    return Array.from({ length: limit }).map((_, i) => ({
      id: `mock-ig-${i}`,
      platform: 'instagram' as const,
      type: 'image' as const,
      url: 'https://instagram.com',
      thumbnail: `https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80`,
      caption: 'Printing excellence #OscarPrinting',
      author: {
        username: 'oscar.printingbanners',
        avatar: '',
        displayName: 'Oscar Printing',
      },
      engagement: { likes: 100 + i * 10, comments: 5 + i },
      createdAt: new Date().toISOString(),
      mediaUrl: '',
      aspectRatio: '1:1',
    }));
  }

  private getOscarPrintingMockData(limit: number): SocialMediaPost[] {
    const videos = [
      {
        id: 'mock-yt-1',
        title: 'Premium Banner & Signage Solutions',
        thumbnail: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80',
        views: '1.2K',
      },
      {
        id: 'mock-yt-2',
        title: 'Business Card Production Process',
        thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
        views: '850',
      },
      {
        id: 'mock-yt-3',
        title: 'Custom Sticker Printing',
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80',
        views: '2.5K',
      },
    ];

    return Array.from({ length: limit }).map((_, i) => {
      const video = videos[i % videos.length];
      return {
        id: video.id,
        platform: 'youtube' as const,
        type: 'video' as const,
        url: 'https://youtube.com',
        thumbnail: video.thumbnail,
        caption: video.title,
        author: {
          username: 'OscarPrinting',
          avatar: '',
          displayName: 'Oscar Printing',
        },
        engagement: { likes: 100, comments: 10, views: parseInt(video.views) },
        createdAt: new Date().toISOString(),
        mediaUrl: '',
        aspectRatio: '16:9',
      };
    });
  }

  private getMockTikTokData(limit: number): SocialMediaPost[] {
    return Array.from({ length: limit }).map((_, i) => ({
      id: `mock-tt-${i}`,
      platform: 'tiktok' as const,
      type: 'video' as const,
      url: 'https://tiktok.com',
      thumbnail: `https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=700&fit=crop`,
      caption: 'Printing magic happening ✨ #OscarPrinting',
      author: {
        username: 'oscarprinting',
        avatar: '',
        displayName: 'Oscar Printing',
      },
      engagement: { likes: 500, comments: 20, shares: 50, views: 1000 },
      createdAt: new Date().toISOString(),
      mediaUrl: '',
      aspectRatio: '9:16',
    }));
  }

  async getYouTubeShorts(options: YouTubeFeedOptions = {}): Promise<SocialMediaPost[]> {
    // Return mock data for shorts for now
    const shorts = [
       {
        id: 'short-1',
        title: 'Quick Banner Install #Shorts',
        thumbnail: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=700&fit=crop',
        views: '1.5K'
       },
       {
        id: 'short-2',
        title: 'High Speed Printing #Shorts',
        thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=700&fit=crop',
        views: '2K'
       }
    ];
    
    return shorts.map(s => ({
        id: s.id,
        platform: 'youtube' as const,
        type: 'video' as const,
        url: `https://youtube.com/shorts/${s.id}`,
        thumbnail: s.thumbnail,
        caption: s.title,
        author: {
            username: 'OscarPrinting',
            avatar: '',
            displayName: 'Oscar Printing'
        },
        engagement: { likes: 100, comments: 5, views: parseInt(s.views) },
        createdAt: new Date().toISOString(),
        mediaUrl: '',
        aspectRatio: '9:16'
    }));
  }

  async getOscarPrintingContent(options: { videosLimit?: number, shortsLimit?: number } = {}): Promise<{ videos: SocialMediaPost[], shorts: SocialMediaPost[] }> {
    const videos = await this.getYouTubeFeed({ limit: options.videosLimit || 3 });
    const shorts = await this.getYouTubeShorts({ limit: options.shortsLimit || 8 });
    return { videos, shorts };
  }
}

export const socialMediaService = new SocialMediaService();
