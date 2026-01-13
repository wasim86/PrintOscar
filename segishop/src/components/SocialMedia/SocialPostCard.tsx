'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Eye,
  ExternalLink,
  Instagram,
  Youtube,
  Music
} from 'lucide-react';
import { SocialMediaPost } from '@/services/socialMediaService';
import { YouTubePlayer } from './YouTubePlayer';

interface SocialPostCardProps {
  post: SocialMediaPost;
  layout?: 'grid' | 'masonry' | 'carousel';
  showEngagement?: boolean;
  showAuthor?: boolean;
}

export const SocialPostCard: React.FC<SocialPostCardProps> = ({
  post,
  layout = 'grid',
  showEngagement = true,
  showAuthor = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getPlatformIcon = () => {
    switch (post.platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'tiktok':
        return <Music className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPlatformColor = () => {
    switch (post.platform) {
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'youtube':
        return 'from-red-500 to-red-600';
      case 'tiktok':
        return 'from-black to-gray-800';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't open external link if clicking on YouTube player
    if (post.platform === 'youtube' && post.type === 'video') {
      return;
    }
    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  const cardClasses = `
    social-post-card
    ${layout === 'carousel' ? 'flex-shrink-0 w-80' : ''}
    ${layout === 'masonry' ? 'break-inside-avoid mb-4' : ''}
    bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
    hover:shadow-lg transition-all duration-300 cursor-pointer
    ${isHovered ? 'transform scale-[1.02]' : ''}
  `;

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePostClick}
    >
      {/* Media Container */}
      <div className="relative overflow-hidden">
        {/* Platform Badge */}
        <div className={`absolute top-3 left-3 z-10 bg-gradient-to-r ${getPlatformColor()} text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium`}>
          {getPlatformIcon()}
          <span className="capitalize">{post.platform}</span>
        </div>

        {/* YouTube Video Player */}
        {post.platform === 'youtube' && post.type === 'video' ? (
          <YouTubePlayer
            videoId={post.id}
            title={post.caption}
            thumbnail={post.thumbnail}
            aspectRatio={post.aspectRatio === '9:16' ? '9:16' : '16:9'}
            showControls={true}
            className="w-full"
          />
        ) : (
          <>
            {/* Play Button for Non-YouTube Videos */}
            {post.type === 'video' && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all duration-200">
                  <Play className="h-8 w-8 text-white fill-current" />
                </div>
              </div>
            )}

            {/* Media Image/Thumbnail */}
            <div className={`relative ${post.platform === 'tiktok' ? 'aspect-[9/16]' : post.platform === 'youtube' ? 'aspect-video' : 'aspect-square'}`}>
              <Image
                src={post.thumbnail}
                alt={post.caption}
                fill
                className={`object-cover transition-all duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Loading Skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </div>
          </>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-end p-3">
            <ExternalLink className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Author Info */}
        {showAuthor && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="relative">
              <Image
                src={post.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt={post.author.displayName}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {post.author.displayName}
              </p>
              <p className="text-xs text-gray-500">
                @{post.author.username}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(post.createdAt)}
            </span>
          </div>
        )}

        {/* Caption */}
        <p className="text-sm text-gray-800 mb-3 line-clamp-3 leading-relaxed">
          {post.caption}
        </p>

        {/* Engagement Stats */}
        {showEngagement && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{formatNumber(post.engagement.likes)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{formatNumber(post.engagement.comments)}</span>
              </div>

              {post.engagement.shares && (
                <div className="flex items-center space-x-1">
                  <Share2 className="h-4 w-4" />
                  <span>{formatNumber(post.engagement.shares)}</span>
                </div>
              )}

              {post.engagement.views && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(post.engagement.views)}</span>
                </div>
              )}
            </div>

            {/* Platform-specific indicators */}
            <div className="flex items-center space-x-2">
              {post.type === 'video' && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  Video
                </span>
              )}
              {post.type === 'carousel' && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  Carousel
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
