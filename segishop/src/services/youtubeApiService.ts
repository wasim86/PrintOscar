interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  isShort: boolean;
}

interface YouTubeChannelStats {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

interface YouTubeApiResponse {
  videos: YouTubeVideo[];
  shorts: YouTubeVideo[];
  channelStats: YouTubeChannelStats;
}

class YouTubeApiService {
  private readonly apiKey: string;
  private readonly channelId: string = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || '@TheSegiShop'; // Use handle or channel ID
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  async getChannelVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
    const cacheKey = `channel-videos-${maxResults}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    if (!this.apiKey) {
      console.warn('YouTube API key not found, using mock data');
      return this.getMockVideos();
    }

    try {
      // Get channel uploads playlist
      const channelResponse = await fetch(
        `${this.baseUrl}/channels?part=contentDetails&id=${this.channelId}&key=${this.apiKey}`
      );
      
      if (!channelResponse.ok) {
        throw new Error('Failed to fetch channel data');
      }

      const channelData = await channelResponse.json();
      const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        throw new Error('Uploads playlist not found');
      }

      // Get videos from uploads playlist
      const playlistResponse = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${this.apiKey}`
      );

      if (!playlistResponse.ok) {
        throw new Error('Failed to fetch playlist items');
      }

      const playlistData = await playlistResponse.json();
      const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');

      // Get detailed video information
      const videosResponse = await fetch(
        `${this.baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${this.apiKey}`
      );

      if (!videosResponse.ok) {
        throw new Error('Failed to fetch video details');
      }

      const videosData = await videosResponse.json();
      
      const videos: YouTubeVideo[] = videosData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
        publishedAt: video.snippet.publishedAt,
        viewCount: parseInt(video.statistics.viewCount || '0'),
        likeCount: parseInt(video.statistics.likeCount || '0'),
        commentCount: parseInt(video.statistics.commentCount || '0'),
        duration: video.contentDetails.duration,
        isShort: this.isVideoShort(video.contentDetails.duration)
      }));

      this.setCache(cacheKey, videos);
      return videos;

    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return this.getMockVideos();
    }
  }

  async getChannelStats(): Promise<YouTubeChannelStats> {
    const cacheKey = 'channel-stats';
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    if (!this.apiKey) {
      return this.getMockChannelStats();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/channels?part=statistics&id=${this.channelId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch channel stats');
      }

      const data = await response.json();
      const stats = data.items[0]?.statistics;

      const channelStats: YouTubeChannelStats = {
        subscriberCount: parseInt(stats?.subscriberCount || '0'),
        videoCount: parseInt(stats?.videoCount || '0'),
        viewCount: parseInt(stats?.viewCount || '0')
      };

      this.setCache(cacheKey, channelStats);
      return channelStats;

    } catch (error) {
      console.error('Error fetching channel stats:', error);
      return this.getMockChannelStats();
    }
  }

  async getLatestContent(): Promise<YouTubeApiResponse> {
    const allVideos = await this.getChannelVideos(20);
    const channelStats = await this.getChannelStats();

    const videos = allVideos.filter(video => !video.isShort).slice(0, 6);
    const shorts = allVideos.filter(video => video.isShort).slice(0, 8);

    return {
      videos,
      shorts,
      channelStats
    };
  }

  private isVideoShort(duration: string): boolean {
    // Parse ISO 8601 duration (PT1M30S format)
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return false;
    
    const minutes = parseInt(match[1] || '0');
    const seconds = parseInt(match[2] || '0');
    const totalSeconds = minutes * 60 + seconds;
    
    return totalSeconds <= 60; // YouTube Shorts are 60 seconds or less
  }

  private getMockVideos(): YouTubeVideo[] {
    return [
      {
        id: 'o-vg5t5FaDU',
        title: 'The Segi Shop - Complete Product Showcase & Brand Story',
        description: 'Discover our complete range of handmade products and artisan snacks',
        thumbnail: 'https://img.youtube.com/vi/o-vg5t5FaDU/maxresdefault.jpg',
        publishedAt: '2024-01-15T10:00:00Z',
        viewCount: 5420,
        likeCount: 312,
        commentCount: 45,
        duration: 'PT5M30S',
        isShort: false
      },
      {
        id: 'dVxfYNPW000',
        title: 'Behind the Scenes: How We Create Our Handmade Products',
        description: 'Take a look at our artisan process and meet our talented creators',
        thumbnail: 'https://img.youtube.com/vi/dVxfYNPW000/maxresdefault.jpg',
        publishedAt: '2024-01-10T14:30:00Z',
        viewCount: 3890,
        likeCount: 267,
        commentCount: 38,
        duration: 'PT8M15S',
        isShort: false
      },
      {
        id: 'ImL3UjTSmD4',
        title: 'Customer Reviews & Testimonials - The Segi Shop Experience',
        description: 'Hear what our customers love about The Segi Shop products',
        thumbnail: 'https://img.youtube.com/vi/ImL3UjTSmD4/maxresdefault.jpg',
        publishedAt: '2024-01-05T16:45:00Z',
        viewCount: 2150,
        likeCount: 189,
        commentCount: 29,
        duration: 'PT3M45S',
        isShort: false
      }
    ];
  }

  private getMockChannelStats(): YouTubeChannelStats {
    return {
      subscriberCount: 2500,
      videoCount: 45,
      viewCount: 125000
    };
  }

  // Method to refresh cache manually
  clearCache(): void {
    this.cache.clear();
  }

  // Method to check if API is available
  isApiAvailable(): boolean {
    return !!this.apiKey;
  }
}

export const youtubeApiService = new YouTubeApiService();
export type { YouTubeVideo, YouTubeChannelStats, YouTubeApiResponse };
