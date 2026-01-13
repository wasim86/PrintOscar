'use client';

import React, { useState } from 'react';
import { ShopLocalNewSettings } from '@/components/Admin/ShopLocalNewSettings';

const tabs = [
  { id: 'shop-local', label: 'Shop Local' }
];

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('shop-local');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
      </div>

      <div className="flex items-center gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-3 py-2 rounded-lg text-sm ${activeTab===t.id?'bg-orange-600 text-white':'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>{t.label}</button>
        ))}
      </div>

      <div>
        {activeTab === 'shop-local' && (
          <ShopLocalNewSettings />
        )}
      </div>
    </div>
  );
}
