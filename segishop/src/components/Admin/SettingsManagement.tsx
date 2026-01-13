'use client';

import React from 'react';
import { Settings, CreditCard, Truck, Mail, Shield } from 'lucide-react';

export const SettingsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Configure site settings, payments, shipping, and integrations</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
        <p className="text-gray-500 mb-6">
          Configure all aspects of your e-commerce store including payments, shipping, and security.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 border border-gray-200 rounded-lg">
            <CreditCard className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Payment Settings</h4>
            <p className="text-sm text-gray-500">Configure Stripe, PayPal, and other payment methods.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Truck className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Shipping Options</h4>
            <p className="text-sm text-gray-500">Set up shipping zones, rates, and delivery options.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Mail className="h-8 w-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Email Templates</h4>
            <p className="text-sm text-gray-500">Customize order confirmations and notification emails.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Shield className="h-8 w-8 text-red-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Security Settings</h4>
            <p className="text-sm text-gray-500">Manage SSL, authentication, and security policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
