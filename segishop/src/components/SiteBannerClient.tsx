'use client';

import React, { useEffect, useState } from 'react';
import { TopFreeShippingBanner } from '@/components/FreeShippingBanner';
import { getSiteBannerConfig } from '@/services/public-site-config';

type Banner = {
  message: string;
  backgroundColor: string;
  textColor: string;
  enabled: boolean;
  centered: boolean;
};

const SiteBannerClient: React.FC = () => {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cfg = await getSiteBannerConfig();
        if (!mounted) return;
        setBanner({
          message: cfg.message,
          backgroundColor: cfg.backgroundColor,
          textColor: cfg.textColor,
          enabled: cfg.enabled,
          centered: cfg.centered,
        });
      } catch {
        setBanner({
          message: 'Free shipping on orders over $120!',
          backgroundColor: '#f4c363',
          textColor: '#1f2937',
          enabled: true,
          centered: true,
        });
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!banner || !banner.enabled) return null;

  return (
    <TopFreeShippingBanner
      dismissible={true}
      showProgress={false}
      persistent={false}
      customMessage={banner.message}
      centered={banner.centered}
      backgroundColor={banner.backgroundColor}
      textColor={banner.textColor}
    />
  );
};

export default SiteBannerClient;