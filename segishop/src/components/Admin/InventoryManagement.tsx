'use client';

import React from 'react';
import { Warehouse, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <p className="text-gray-600 mt-1">Track stock levels, manage suppliers, and automate reordering</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Warehouse className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory Management System</h3>
        <p className="text-gray-500 mb-6">
          Advanced inventory tracking with real-time stock levels, automated alerts, and supplier management.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Package className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Stock Tracking</h4>
            <p className="text-sm text-gray-500">Real-time inventory levels with automatic updates on sales.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Low Stock Alerts</h4>
            <p className="text-sm text-gray-500">Automated notifications when products reach minimum thresholds.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Demand Forecasting</h4>
            <p className="text-sm text-gray-500">Predict future inventory needs based on sales trends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
