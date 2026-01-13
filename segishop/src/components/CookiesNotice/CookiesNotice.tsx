'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiesNoticeProps {
  onAccept?: () => void;
  onReadMore?: () => void;
}

export const CookiesNotice: React.FC<CookiesNoticeProps> = ({ 
  onAccept, 
  onReadMore 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
    onAccept?.();
  };

  const handleReadMore = () => {
    onReadMore?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 z-10">
          {/* Header */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
            Cookies Notice
          </h2>
          
          {/* Content */}
          <p className="text-gray-700 text-center mb-6 leading-relaxed">
            We use cookies to ensure that we give you the best experience on our website. If you continue to use this site we will assume that you are happy with it.
          </p>
          
          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full bg-black text-white py-3 px-4 rounded font-medium hover:bg-gray-800 transition-colors"
            >
              GOT IT!
            </button>
            
            <Link href="/cookie-policy">
              <button
                onClick={handleReadMore}
                className="w-full bg-black text-white py-3 px-4 rounded font-medium hover:bg-gray-800 transition-colors"
              >
                READ MORE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
