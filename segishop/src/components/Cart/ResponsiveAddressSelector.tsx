'use client';

import React, { useState, useEffect } from 'react';
import { UserAddress } from '../../services/user-address-api';
import { AddressSelector } from './AddressSelector';
import { MobileAddressSelector } from './MobileAddressSelector';

interface ResponsiveAddressSelectorProps {
  selectedAddress: UserAddress | null;
  onAddressSelect: (address: UserAddress | null) => void;
  onNewAddress?: (address: UserAddress) => void;
}

export const ResponsiveAddressSelector: React.FC<ResponsiveAddressSelectorProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Use mobile version for screens smaller than md (768px)
  if (isMobile) {
    return <MobileAddressSelector {...props} />;
  }

  // Use desktop version for larger screens
  return <AddressSelector {...props} />;
};
