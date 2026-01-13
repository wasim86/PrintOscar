'use client';

import React, { useState, useEffect } from 'react';
import { Youtube, Play, Eye, Heart, MessageCircle, ExternalLink, RefreshCw, Calendar, TrendingUp, Video, Zap } from 'lucide-react';
import { YouTubePlayer, YouTubeShortsPlayer } from './YouTubePlayer';
import { socialMediaService, SocialMediaPost } from '@/services/socialMediaService';
import { youtubeApiService } from '@/services/youtubeApiService';
import { API_BASE_URL } from '@/services/config';

interface YouTubeShowcaseProps {
  className?: string;
}

export const YouTubeShowcase: React.FC<YouTubeShowcaseProps> = ({ className = '' }) => {
  const [videos, setVideos] = useState<SocialMediaPost[]>([]);
  const [shorts, setShorts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [useApiData, setUseApiData] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts'>('videos');

  const fetchYouTubeContent = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);

      const serverUrl = `${API_BASE_URL}/site/social/youtube`;
      try {
        const res = await fetch(serverUrl, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const longItems = (Array.isArray(data?.videos) ? data.videos : (data.videosResponse?.items || []));
          const shortItems = (Array.isArray(data?.shorts) ? data.shorts : []);
          let videosMapped: SocialMediaPost[] = [];
          let shortsMapped: SocialMediaPost[] = [];
          const mapItem = (video: any): SocialMediaPost => ({
            id: video.id,
            platform: 'youtube',
            type: 'video',
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url,
            caption: video.snippet?.title || '',
            author: { username: 'YouTube', avatar: '', displayName: 'YouTube' },
            engagement: {
              views: parseInt(video.statistics?.viewCount || '0'),
              likes: parseInt(video.statistics?.likeCount || '0'),
              comments: parseInt(video.statistics?.commentCount || '0'),
            },
            createdAt: video.snippet?.publishedAt || '',
            mediaUrl: `https://www.youtube.com/embed/${video.id}`,
            aspectRatio: '16:9',
          });

          longItems.forEach((video: any) => {
            const post: SocialMediaPost = {
              id: video.id,
              platform: 'youtube',
              type: 'video',
              url: `https://www.youtube.com/watch?v=${video.id}`,
              thumbnail: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url,
              caption: video.snippet?.title || '',
              author: { username: 'YouTube', avatar: '', displayName: 'YouTube' },
              engagement: {
                views: parseInt(video.statistics?.viewCount || '0'),
                likes: parseInt(video.statistics?.likeCount || '0'),
                comments: parseInt(video.statistics?.commentCount || '0'),
              },
              createdAt: video.snippet?.publishedAt || '',
              mediaUrl: `https://www.youtube.com/embed/${video.id}`,
              aspectRatio: '16:9',
            };
            const isShort = videoDurationIsShort(video) || videoTitleSuggestsShort(video);
            if (isShort) shortsMapped.push(post); else videosMapped.push(post);
          });

          shortItems.forEach((video: any) => {
            // Ensure we include shorts explicitly provided by server
            const post = mapItem(video);
            if (!shortsMapped.find(s => s.id === post.id)) shortsMapped.push(post);
            videosMapped = videosMapped.filter(v => v.id !== post.id);
          });
          // If shorts appear in titles but weren't flagged by duration, promote them
          // Use server-provided classification strictly to avoid mixing long videos into shorts

          setVideos(videosMapped.slice(0, 3));
          setShorts(shortsMapped.slice(0, 8));
          setUseApiData(true);
          setLastUpdated(new Date());
          return;
        }
      } catch {}

      if (youtubeApiService.isApiAvailable()) {
        try {
          const apiData = await youtubeApiService.getLatestContent();

          // Convert API data to SocialMediaPost format
          const apiVideos: SocialMediaPost[] = apiData.videos.map(video => ({
            id: video.id,
            platform: 'youtube' as const,
            type: 'video' as const,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: video.thumbnail,
            caption: video.title,
            author: {
              username: 'OscarPrinting',
              avatar: 'https://yt3.ggpht.com/a/default-user=s100-c-k-c0x00ffffff-no-rj',
              displayName: 'Oscar Printing',
            },
            engagement: {
              views: video.viewCount,
              likes: video.likeCount,
              comments: video.commentCount,
            },
            createdAt: video.publishedAt,
            mediaUrl: `https://www.youtube.com/embed/${video.id}`,
            aspectRatio: '16:9',
          }));

          const apiShorts: SocialMediaPost[] = apiData.shorts.map(short => ({
            id: short.id,
            platform: 'youtube' as const,
            type: 'video' as const,
            url: `https://www.youtube.com/shorts/${short.id}`,
            thumbnail: short.thumbnail,
            caption: short.title,
            author: {
              username: 'OscarPrinting',
              avatar: 'https://yt3.ggpht.com/a/default-user=s100-c-k-c0x00ffffff-no-rj',
              displayName: 'Oscar Printing',
            },
            engagement: {
              views: short.viewCount,
              likes: short.likeCount,
              comments: short.commentCount,
            },
            createdAt: short.publishedAt,
            mediaUrl: `https://www.youtube.com/embed/${short.id}`,
            aspectRatio: '9:16',
          }));

          setVideos(apiVideos.slice(0, 3));
          setShorts(apiShorts.slice(0, 8));
          setUseApiData(true);
          setLastUpdated(new Date());
        } catch (apiError) {
          console.warn('YouTube API failed, falling back to mock data:', apiError);
          await fetchMockData();
        }
      } else {
        await fetchMockData();
      }
    } catch (error) {
      console.error('Error fetching YouTube content:', error);
      await fetchMockData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const videoDurationIsShort = (video: any): boolean => {
    const dur = video?.contentDetails?.duration || '';
    const m = dur.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return false;
    const minutes = parseInt(m[1] || '0');
    const seconds = parseInt(m[2] || '0');
    return minutes * 60 + seconds <= 60;
  };

  const videoTitleSuggestsShort = (video: any): boolean => {
    const title = video?.snippet?.title || '';
    return /(^|[^a-z])shorts([^a-z]|$)|#shorts/i.test(title);
  };

  const fetchMockData = async () => {
    const content = await socialMediaService.getOscarPrintingContent({
      videosLimit: 3,
      shortsLimit: 8,
    });
    setVideos(content.videos);
    setShorts(content.shorts);
    setUseApiData(false);
  };

  useEffect(() => {
    fetchYouTubeContent();

    // Set up auto-refresh every 10 minutes
    const interval = setInterval(() => {
      fetchYouTubeContent();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number | undefined): string => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`youtube-showcase ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[9/16] bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`youtube-showcase ${className}`}>
      {/* Header */}
      <div className="header flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-3 shadow-lg">
              <Youtube className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">@OscarPrinting on YouTube</h2>
              <p className="text-sm sm:text-base text-gray-600">Latest videos and shorts from our channel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchYouTubeContent(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href="https://www.youtube.com/@OscarPrinting"
              target="_blank"
              rel="noopener noreferrer"
              className="subscribe-button inline-flex items-center justify-center px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Youtube className="h-4 w-4 mr-2" />
              Subscribe
            </a>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'videos'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Video className="h-4 w-4 mr-2" />
            Videos
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              {videos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === 'shorts'
                ? 'bg-white text-red-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Shorts
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
              {shorts.length}
            </span>
          </button>
        </div>

        <a
          href={`https://www.youtube.com/@OscarPrinting/${activeTab}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'videos'
              ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
              : 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100'
          }`}
        >
          View All {activeTab === 'videos' ? 'Videos' : 'Shorts'}
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Latest Videos</h3>
              <p className="text-gray-600">Discover our complete product showcases, behind-the-scenes content, and customer stories</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                    <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <div key={video.id} className="group">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <YouTubePlayer
                        videoId={video.id}
                        title={video.caption}
                        thumbnail={video.thumbnail}
                        aspectRatio="16:9"
                        showControls={true}
                        className="w-full"
                      />
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
                          {video.caption}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">{formatNumber(video.engagement.views)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="font-medium">{formatNumber(video.engagement.likes)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{formatNumber(video.engagement.comments)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shorts' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">YouTube Shorts</h3>
              <p className="text-gray-600">Quick, engaging content perfect for mobile viewing. Bite-sized looks at our products and behind-the-scenes moments</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-3 animate-pulse">
                    <div className="bg-gray-300 rounded-lg aspect-[9/16] mb-3"></div>
                    <div className="bg-gray-300 h-3 rounded mb-2"></div>
                    <div className="bg-gray-300 h-2 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {shorts.map((short, index) => (
                  <div key={short.id} className="group">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 p-3">
                      <YouTubeShortsPlayer
                        videoId={short.id}
                        title={short.caption}
                        thumbnail={short.thumbnail}
                        showControls={true}
                        className="mb-3 rounded-lg overflow-hidden"
                      />
                      <h5 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-200 mb-2">
                        {short.caption}
                      </h5>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span className="font-medium">{formatNumber(short.engagement.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="font-medium">{formatNumber(short.engagement.likes)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>



      {/* Channel Stats */}
      <div className="mt-12 bg-gradient-to-br from-gray-50 via-blue-50 to-red-50 rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">Channel Overview</h4>
          <p className="text-gray-600">Real-time statistics from @TheSegiShop YouTube channel</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">{videos.length + shorts.length}</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Content</div>
            <div className="text-xs text-gray-500 mt-1">{videos.length} Videos • {shorts.length} Shorts</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatNumber(videos.reduce((sum, v) => sum + (v.engagement.views || 0), 0) +
                          shorts.reduce((sum, s) => sum + (s.engagement.views || 0), 0))}
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Views</div>
            <div className="text-xs text-gray-500 mt-1">Across all content</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatNumber(videos.reduce((sum, v) => sum + (v.engagement.likes || 0), 0) +
                          shorts.reduce((sum, s) => sum + (s.engagement.likes || 0), 0))}
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Likes</div>
            <div className="text-xs text-gray-500 mt-1">Community engagement</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-2xl font-bold text-purple-600 mb-2">@TheSegiShop</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Channel Handle</div>
            <div className="text-xs text-gray-500 mt-1">Subscribe for updates</div>
          </div>
        </div>
      </div>
    </div>
  );
};
