'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Play, Maximize2 } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  thumbnail: string;
  aspectRatio?: '16:9' | '9:16';
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  thumbnail,
  aspectRatio = '16:9',
  autoplay = false,
  showControls = true,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlayClick = () => {
    setIsLoading(true);
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const getEmbedUrl = () => {
    const baseUrl = 'https://www.youtube.com/embed/';
    const params = new URLSearchParams({
      autoplay: (autoplay && isPlaying) ? '1' : '0',
      mute: isMuted ? '1' : '0',
      controls: showControls ? '1' : '0',
      modestbranding: '1',
      rel: '0',
      showinfo: '0',
      iv_load_policy: '3',
      fs: '1',
      cc_load_policy: '0',
      playsinline: '1',
    });

    return `${baseUrl}${videoId}?${params.toString()}`;
  };

  const containerClasses = `
    youtube-player relative overflow-hidden rounded-lg bg-black group cursor-pointer
    ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'}
    ${className}
  `;

  if (showPlayer) {
    return (
      <div className={containerClasses}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={getEmbedUrl()}
          title={title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
        />

        {/* Custom Controls Overlay */}
        {showControls && (
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={toggleFullscreen}
              className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-200"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Generate fallback thumbnail URL
  const getFallbackThumbnail = () => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const getAlternateThumbnail = () => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const thumbnailSrc = thumbnail && thumbnail.length > 0 ? thumbnail : getFallbackThumbnail();
  return (
    <div className={containerClasses} onClick={handlePlayClick}>
      {/* Thumbnail */}
      <div className="relative w-full h-full">
        {!imageError ? (
          <Image
            src={thumbnailSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={getFallbackThumbnail()}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={() => {
              // If fallback also fails, use alternate
              const img = document.createElement('img');
              img.src = getAlternateThumbnail();
            }}
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-600 hover:bg-red-700 rounded-full p-3 sm:p-4 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-current ml-0.5 sm:ml-1" />
          </div>
        </div>

        {/* Video info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-2 sm:p-4">
          <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2 mb-1">
            {title}
          </h3>
          <div className="flex items-center space-x-1 sm:space-x-2 text-white/80 text-xs">
            <span className="hidden sm:inline">Oscar Printing</span>
            <span className="hidden sm:inline">•</span>
            <span>Click to play</span>
          </div>
        </div>

        {/* YouTube logo */}
        <div className="absolute top-3 right-3">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            {aspectRatio === '9:16' ? 'Shorts' : 'YouTube'}
          </div>
        </div>

        {/* Duration badge for shorts */}
        {aspectRatio === '9:16' && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            &lt; 1 min
          </div>
        )}
      </div>
    </div>
  );
};

// YouTube Shorts Player (optimized for vertical videos)
export const YouTubeShortsPlayer: React.FC<Omit<YouTubePlayerProps, 'aspectRatio'>> = (props) => {
  return <YouTubePlayer {...props} aspectRatio="9:16" />;
};

// YouTube Video Player (optimized for horizontal videos)
export const YouTubeVideoPlayer: React.FC<Omit<YouTubePlayerProps, 'aspectRatio'>> = (props) => {
  return <YouTubePlayer {...props} aspectRatio="16:9" />;
};
