'use client';

import React, { Suspense } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { TrackOrder } from '@/components/Order/TrackOrder';
import { useSearchParams } from 'next/navigation';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('orderNumber') || null;

  return <TrackOrder initialOrderNumber={orderNumber} />;
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-8">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading track order page...</p>
            </div>
          </div>
        }>
          <TrackOrderContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
