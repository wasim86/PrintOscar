'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  className?: string;
  magnifierSize?: number;
  zoomLevel?: number;
  onZoomLevelChange?: (level: number) => void;
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  className = '',
  magnifierSize = 150,
  zoomLevel = 2,
  onZoomLevelChange,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(zoomLevel);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minZoom = 1.5;
  const maxZoom = 4;
  const zoomStep = 0.5;

  useEffect(() => {
    setCurrentZoomLevel(zoomLevel);
  }, [zoomLevel]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const increaseZoom = useCallback(() => {
    const newZoom = Math.min(maxZoom, currentZoomLevel + zoomStep);
    setCurrentZoomLevel(newZoom);
    onZoomLevelChange?.(newZoom);
  }, [currentZoomLevel, onZoomLevelChange]);

  const decreaseZoom = useCallback(() => {
    const newZoom = Math.max(minZoom, currentZoomLevel - zoomStep);
    setCurrentZoomLevel(newZoom);
    onZoomLevelChange?.(newZoom);
  }, [currentZoomLevel, onZoomLevelChange]);

  const getMagnifierStyle = useCallback(() => {
    if (!isHovering || !imageLoaded || !imageRef.current || !containerRef.current) {
      return { display: 'none' };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    
    // Calculate the position relative to the image
    const relativeX = mousePosition.x;
    const relativeY = mousePosition.y;
    
    // Calculate the background position for the magnified image
    const backgroundX = -(relativeX * currentZoomLevel - magnifierSize / 2);
    const backgroundY = -(relativeY * currentZoomLevel - magnifierSize / 2);
    
    // Position the magnifier
    let magnifierX = relativeX - magnifierSize / 2;
    let magnifierY = relativeY - magnifierSize / 2;
    
    // Keep magnifier within container bounds
    magnifierX = Math.max(0, Math.min(magnifierX, containerRect.width - magnifierSize));
    magnifierY = Math.max(0, Math.min(magnifierY, containerRect.height - magnifierSize));

    return {
      display: 'block',
      position: 'absolute' as const,
      left: `${magnifierX}px`,
      top: `${magnifierY}px`,
      width: `${magnifierSize}px`,
      height: `${magnifierSize}px`,
      backgroundImage: `url(${src})`,
      backgroundSize: `${imageRect.width * currentZoomLevel}px ${imageRect.height * currentZoomLevel}px`,
      backgroundPosition: `${backgroundX}px ${backgroundY}px`,
      backgroundRepeat: 'no-repeat',
      border: '3px solid #fff',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      cursor: 'none',
      pointerEvents: 'none' as const,
      zIndex: 1000,
    };
  }, [isHovering, imageLoaded, mousePosition, currentZoomLevel, magnifierSize, src]);

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          loading="lazy"
        />
        
        {/* Magnifier lens */}
        <div style={getMagnifierStyle()} />
        
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={increaseZoom}
            disabled={currentZoomLevel >= maxZoom}
            className="p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom In"
            type="button"
          >
            <ZoomIn className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={decreaseZoom}
            disabled={currentZoomLevel <= minZoom}
            className="p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom Out"
            type="button"
          >
            <ZoomOut className="h-4 w-4 text-gray-700" />
          </button>
        </div>
        
        {/* Zoom level indicator */}
        {isHovering && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {currentZoomLevel.toFixed(1)}x
          </div>
        )}
        
        {/* Hover instruction */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
            Hover to magnify
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMagnifier;
