'use client';

import React, { useState, useEffect } from 'react';
import { 
  socialMediaService, 
  SocialMediaPost, 
  InstagramFeedOptions,
  YouTubeFeedOptions,
  TikTokFeedOptions
} from '@/services/socialMediaService';
import { SocialPostCard } from './SocialPostCard';
import { 
  Loader2, 
  RefreshCw, 
  Grid3X3, 
  List, 
  Shuffle,
  Instagram,
  Youtube,
  Music,
  AlertCircle
} from 'lucide-react';

interface SocialMediaFeedProps {
  platform: 'instagram' | 'youtube' | 'tiktok' | 'all';
  limit?: number;
  layout?: 'grid' | 'masonry' | 'carousel';
  showEngagement?: boolean;
  showAuthor?: boolean;
  feedOptions?: InstagramFeedOptions | YouTubeFeedOptions | TikTokFeedOptions;
  className?: string;
}

export const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({
  platform,
  limit = 12,
  layout = 'grid',
  showEngagement = true,
  showAuthor = true,
  feedOptions = {},
  className = '',
}) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let fetchedPosts: SocialMediaPost[] = [];

      switch (platform) {
        case 'instagram':
          fetchedPosts = await socialMediaService.getInstagramFeed({
            limit,
            ...feedOptions,
          } as InstagramFeedOptions);
          break;
        
        case 'youtube':
          fetchedPosts = await socialMediaService.getYouTubeFeed({
            limit,
            ...feedOptions,
          } as YouTubeFeedOptions);
          break;
        
        case 'tiktok':
          fetchedPosts = await socialMediaService.getTikTokFeed({
            limit,
            ...feedOptions,
          } as TikTokFeedOptions);
          break;
        
        case 'all':
          fetchedPosts = await socialMediaService.getCombinedFeed({
            instagram: { limit: Math.ceil(limit / 3), ...feedOptions },
            youtube: { limit: Math.ceil(limit / 3), ...feedOptions },
            tiktok: { limit: Math.ceil(limit / 3), ...feedOptions },
          });
          fetchedPosts = fetchedPosts.slice(0, limit);
          break;
      }

      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load social media posts');
      console.error('Social media feed error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [platform, limit, JSON.stringify(feedOptions)]);

  const handleRefresh = () => {
    fetchPosts(true);
  };

  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'tiktok':
        return <Music className="h-5 w-5" />;
      default:
        return <Shuffle className="h-5 w-5" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'YouTube';
      case 'tiktok':
        return 'TikTok';
      case 'all':
        return 'All Platforms';
      default:
        return 'Social Media';
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6';
      case 'carousel':
        return 'flex overflow-x-auto scrollbar-hide gap-6 pb-4';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={getLayoutClasses()}>
      {Array.from({ length: limit }).map((_, i) => (
        <div key={i} className={`${layout === 'carousel' ? 'flex-shrink-0 w-80' : ''}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className={`bg-gray-200 ${platform === 'tiktok' ? 'aspect-[9/16]' : platform === 'youtube' ? 'aspect-video' : 'aspect-square'}`} />
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                  <div className="h-2 bg-gray-200 rounded w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <div className="h-2 bg-gray-200 rounded w-12" />
                <div className="h-2 bg-gray-200 rounded w-12" />
                <div className="h-2 bg-gray-200 rounded w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error && !loading) {
    return (
      <div className={`social-media-feed ${className}`}>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to load {getPlatformName()} feed
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`social-media-feed ${className}`}>
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-gray-700">
            {getPlatformIcon(platform)}
            <h3 className="text-lg font-semibold">
              {getPlatformName()} Feed
            </h3>
          </div>
          {posts.length > 0 && (
            <span className="text-sm text-gray-500">
              {posts.length} posts
            </span>
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <div className={getLayoutClasses()}>
          {posts.map((post) => (
            <SocialPostCard
              key={`${post.platform}_${post.id}`}
              post={post}
              layout={layout}
              showEngagement={showEngagement}
              showAuthor={showAuthor}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
            {getPlatformIcon(platform)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No posts found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            There are no {getPlatformName().toLowerCase()} posts to display at the moment.
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Feed
          </button>
        </div>
      )}

      {/* Carousel scroll indicators */}
      {layout === 'carousel' && posts.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Scroll to see more →
          </div>
        </div>
      )}
    </div>
  );
};
