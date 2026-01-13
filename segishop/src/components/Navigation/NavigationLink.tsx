'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

interface NavigationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  children,
  className,
  onClick,
  replace = false,
  scroll = true,
  prefetch = false,
  ...props
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsNavigating, setNavigationProgress, setNavigationStartTime } = useNavigation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Extract pathname from href for comparison (ignore query params)
    const targetPath = href.split('?')[0];
    const currentPath = pathname?.split('?')[0] || '';

    // Don't show loading for same page navigation (ignoring query params)
    if (targetPath === currentPath && !href.includes('?')) {
      onClick?.();
      return;
    }

    // Don't show loading for external links
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      onClick?.();
      return;
    }

    // Don't show loading for hash links
    if (href.startsWith('#')) {
      onClick?.();
      return;
    }

    // Prevent default navigation
    e.preventDefault();

    // Call custom onClick if provided
    onClick?.();

    // Start loading state
    const startTime = Date.now();
    setNavigationStartTime(startTime);
    setIsNavigating(true);
    let currentProgress = 15;
    setNavigationProgress(currentProgress);

    // Simulate faster progress for better UX
    const progressInterval = setInterval(() => {
      if (currentProgress >= 85) {
        clearInterval(progressInterval);
        return;
      }
      currentProgress += Math.random() * 25;
      setNavigationProgress(Math.min(currentProgress, 85));
    }, 80);

    // Navigate immediately for faster response
    const navigationTimer = setTimeout(() => {
      clearInterval(progressInterval);
      setNavigationProgress(95);

      // Perform navigation
      if (replace) {
        router.replace(href);
      } else {
        router.push(href);
      }
    }, 150);

    // Fallback to reset loading state if navigation takes too long
    const fallbackTimer = setTimeout(() => {
      clearInterval(progressInterval);
      clearTimeout(navigationTimer);
      setIsNavigating(false);
      setNavigationProgress(0);
      setNavigationStartTime(null);

      // Still perform navigation as fallback
      if (replace) {
        router.replace(href);
      } else {
        router.push(href);
      }
    }, 3000);
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      scroll={scroll}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
};
