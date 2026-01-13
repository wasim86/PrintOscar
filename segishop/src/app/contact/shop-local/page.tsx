'use client';

import React, { useEffect, useState } from 'react';
import { getShopLocalPage } from '@/services/public-shop-local';
import { Header } from '@/components/Header/Header';

export default function ShopLocalPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const extractMapSrc = (val: string | undefined | null): string | null => {
    if (!val) return null;
    const raw = String(val).trim();
    if (!raw) return null;
    if (raw.includes('<iframe')) {
      const m = raw.match(/src=["']([^"']+)["']/);
      return m?.[1] || null;
    }
    return raw;
  };

  const splitTitle = (t: string | undefined | null): { main: string; time: string | null } => {
    const s = (t || '').trim();
    if (!s) return { main: '', time: null };
    const m = s.match(/\(([^)]*)\)\s*$/);
    if (m) {
      const time = m[1].trim();
      const main = s.replace(m[0], '').trim();
      return { main, time };
    }
    return { main: s, time: null };
  };

  useEffect(() => {
    (async () => {
      try {
        const d = await getShopLocalPage();
        setData(d);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Loading...</div>;
  }

  return (
    <div>
      <Header />

      {extractMapSrc(data?.heroMapEmbedUrl) && (
        <div className="relative">
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
            <div className="w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden">
              <iframe src={extractMapSrc(data.heroMapEmbedUrl)!} title="Hero Map" className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">{data?.headline || 'Shop Local'}</h1>

        {data?.contentHtml && (
          <div className="prose prose-neutral mb-8" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        )}

        {data?.headings?.thankYouHeading && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-center mb-4">{data.headings.thankYouHeading}</h2>
            {Array.isArray(data?.media?.thankyou) && data.media.thankyou.length > 0 && (
              <ThankYouSlider items={data.media.thankyou} />
            )}
          </div>
        )}

        {data?.headings?.weeklyHeading && (data?.sections?.weekly?.length > 0) && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">{data.headings.weeklyHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.sections.weekly.map((loc: any) => (
                <div key={loc.id} className="space-y-2">
                  {(() => { const p = splitTitle(loc.title); return (
                    <div className="h-16 flex flex-col items-center justify-center text-center px-2">
                      <div className="text-white text-sm font-medium leading-snug">{p.main}</div>
                      {p.time && <div className="text-gray-300 text-xs leading-snug">{p.time}</div>}
                    </div>
                  ); })()}
                  <div className="aspect-video w-full overflow-hidden rounded">
                    {extractMapSrc(loc.mapEmbedUrl) && (
                      <iframe src={extractMapSrc(loc.mapEmbedUrl)!} title={loc.title} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.headings?.annualHeading && (data?.sections?.annual?.length > 0) && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">{data.headings.annualHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.sections.annual.map((loc: any) => (
                <div key={loc.id} className="space-y-2">
                  {(() => { const p = splitTitle(loc.title); return (
                    <div className="h-16 flex flex-col items-center justify-center text-center px-2">
                      <div className="text-white text-sm font-medium leading-snug">{p.main}</div>
                      {p.time && <div className="text-gray-300 text-xs leading-snug">{p.time}</div>}
                    </div>
                  ); })()}
                  <div className="aspect-video w-full overflow-hidden rounded">
                    {extractMapSrc(loc.mapEmbedUrl) && (
                      <iframe src={extractMapSrc(loc.mapEmbedUrl)!} title={loc.title} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.headings?.galleryHeading && (data?.media?.gallery?.length > 0) && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-4">{data.headings.galleryHeading}</h2>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {data.media.gallery.map((m: any) => (
                <img key={m.id} src={m.imageUrl} alt={m.caption || ''} className="mb-3 w-full h-auto rounded border break-inside-avoid" />
              ))}
            </div>
          </section>
        )}

        {data?.headings?.inactiveHeading && (data?.sections?.inactive?.length > 0) && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">{data.headings.inactiveHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.sections.inactive.map((loc: any) => (
                <div key={loc.id} className="space-y-2">
                  {(() => { const p = splitTitle(loc.title); return (
                    <div className="h-16 flex flex-col items-center justify-center text-center px-2">
                      <div className="text-white text-sm font-medium leading-snug">{p.main}</div>
                      {p.time && <div className="text-gray-300 text-xs leading-snug">{p.time}</div>}
                    </div>
                  ); })()}
                  <div className="aspect-video w-full overflow-hidden rounded">
                    {extractMapSrc(loc.mapEmbedUrl) && (
                      <iframe src={extractMapSrc(loc.mapEmbedUrl)!} title={loc.title} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.headings?.storesHeading && (data?.sections?.stores?.length > 0) && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">{data.headings.storesHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.sections.stores.map((loc: any) => (
                <div key={loc.id} className="space-y-2">
                  {(() => { const p = splitTitle(loc.title); return (
                    <div className="h-16 flex flex-col items-center justify-center text-center px-2">
                      <div className="text-white text-sm font-medium leading-snug">{p.main}</div>
                      {p.time && <div className="text-gray-300 text-xs leading-snug">{p.time}</div>}
                    </div>
                  ); })()}
                  <div className="aspect-video w-full overflow-hidden rounded">
                    {extractMapSrc(loc.mapEmbedUrl) && (
                      <iframe src={extractMapSrc(loc.mapEmbedUrl)!} title={loc.title} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data?.locations || []).map((loc) => (
            <div key={loc.id} className="rounded-lg border border-gray-200 p-4 sm:p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">{loc.title}</h3>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Shop Local</span>
              </div>
              {loc.addressLine && <p className="text-sm text-gray-700 mb-3">{loc.addressLine}</p>}
              {extractMapSrc(loc.mapEmbedUrl) && (
                <div className="aspect-video w-full overflow-hidden rounded">
                  <iframe
                    src={extractMapSrc(loc.mapEmbedUrl)!}
                    title={loc.title}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ThankYouSlider: React.FC<{ items: Array<{ id: number; imageUrl: string; caption?: string }> }> = ({ items }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % items.length), 3000);
    return () => clearInterval(timer);
  }, [items.length]);
  const visible = 4;
  const renderItems = () => {
    const loop = [...items, ...items];
    const start = index;
    return loop.slice(start, start + visible).map((m, i) => (
      <img key={`${m.id}-${i}`} src={m.imageUrl} alt={m.caption || ''} className="h-36 sm:h-44 md:h-52 rounded object-cover" />
    ));
  };
  return (
    <div className="flex gap-4 overflow-hidden justify-center">
      {renderItems()}
    </div>
  );
};
