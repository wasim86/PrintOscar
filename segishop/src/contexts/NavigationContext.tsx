'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  setIsNavigating: (loading: boolean) => void;
  navigationProgress: number;
  setNavigationProgress: (progress: number) => void;
  setNavigationStartTime: (time: number | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

// Component to handle search params with Suspense
function SearchParamsWatcher({ onRouteChange }: { onRouteChange: (pathname: string, searchParams: string) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onRouteChange(pathname, searchParams?.toString() || '');
  }, [pathname, searchParams, onRouteChange]);

  return null;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationProgress, setNavigationProgress] = useState(0);
  const [navigationStartTime, setNavigationStartTime] = useState<number | null>(null);
  const [currentRoute, setCurrentRoute] = useState<{ pathname: string; searchParams: string }>({ pathname: '', searchParams: '' });

  // Handle route changes from SearchParamsWatcher
  const handleRouteChange = useCallback((pathname: string, searchParams: string) => {
    setCurrentRoute({ pathname, searchParams });
  }, []);

  // Reset navigation state when route changes AND page is fully loaded
  useEffect(() => {
    if (isNavigating && navigationStartTime) {
      // Set progress to 90% when route changes (but don't complete yet)
      setNavigationProgress(90);

      // Wait for page to be fully loaded
      const handlePageLoad = () => {
        // Complete the progress when page is loaded
        setNavigationProgress(100);

        // Calculate minimum duration (at least 800ms)
        const elapsedTime = Date.now() - navigationStartTime;
        const minDuration = 800;
        const remainingTime = Math.max(0, minDuration - elapsedTime);

        // Reset after ensuring minimum duration
        const timer = setTimeout(() => {
          setIsNavigating(false);
          setNavigationProgress(0);
          setNavigationStartTime(null);
        }, remainingTime + 300); // Extra 300ms to show completion

        return () => clearTimeout(timer);
      };

      // Check if page is already loaded
      if (document.readyState === 'complete') {
        handlePageLoad();
      } else {
        // Wait for page to load
        window.addEventListener('load', handlePageLoad);

        // Also listen for DOMContentLoaded as backup
        document.addEventListener('DOMContentLoaded', handlePageLoad);

        // Cleanup listeners
        return () => {
          window.removeEventListener('load', handlePageLoad);
          document.removeEventListener('DOMContentLoaded', handlePageLoad);
        };
      }
    }
  }, [currentRoute.pathname, currentRoute.searchParams, isNavigating, navigationStartTime]);

  // Progress simulation for better UX
  useEffect(() => {
    if (isNavigating) {
      let currentProgress = 10;
      setNavigationProgress(currentProgress);

      const progressTimer = setInterval(() => {
        if (currentProgress >= 90) {
          clearInterval(progressTimer);
          return;
        }
        currentProgress += Math.random() * 30;
        setNavigationProgress(Math.min(currentProgress, 90));
      }, 200);

      // Fallback timeout to prevent stuck loading (max 8 seconds for page load)
      const fallbackTimer = setTimeout(() => {
        clearInterval(progressTimer);
        setIsNavigating(false);
        setNavigationProgress(0);
        setNavigationStartTime(null);
      }, 8000);

      return () => {
        clearInterval(progressTimer);
        clearTimeout(fallbackTimer);
      };
    }
  }, [isNavigating]);

  const value = {
    isNavigating,
    setIsNavigating,
    navigationProgress,
    setNavigationProgress,
    setNavigationStartTime,
  };

  return (
    <NavigationContext.Provider value={value}>
      <Suspense fallback={null}>
        <SearchParamsWatcher onRouteChange={handleRouteChange} />
      </Suspense>
      {children}
    </NavigationContext.Provider>
  );
};
