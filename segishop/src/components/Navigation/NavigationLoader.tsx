'use client';

import React from 'react';
import Image from 'next/image';
import { useNavigation } from '@/contexts/NavigationContext';

export const NavigationLoader: React.FC = () => {
  const { isNavigating, navigationProgress } = useNavigation();

  if (!isNavigating) return null;

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out"
          style={{ width: `${navigationProgress}%` }}
        />
      </div>

      {/* Full Screen Overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          
          {/* LOGO */}
          <div className="relative mb-6">
            <Image
              src="/logo.png"
              alt="Oscar Printing Shop"
              width={120}
              height={60}
              priority
              className="mx-auto opacity-90 animate-pulse"
            />

            {/* Loader Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold text-white">Loading...</h3>
          <p className="text-sm text-gray-300">
            Please wait while we prepare your page
          </p>

          {/* Progress */}
          <div className="mt-6 w-64 mx-auto">
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                style={{ width: `${navigationProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-300 mt-2">
              {Math.round(navigationProgress)}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
