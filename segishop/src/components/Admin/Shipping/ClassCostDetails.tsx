'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Edit, Trash2, MapPin, Package, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { AdminShippingClassCost, AdminShippingApi } from '@/services/admin-shipping-api';

interface ClassCostDetailsProps {
  costId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (classCost: AdminShippingClassCost) => void;
  onDelete: (costId: number) => void;
}

interface TabInfo {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function ClassCostDetails({ costId, isOpen, onClose, onEdit, onDelete }: ClassCostDetailsProps) {
  const [classCost, setClassCost] = useState<AdminShippingClassCost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: TabInfo[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Settings
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: DollarSign
    }
  ];

  useEffect(() => {
    if (isOpen && costId) {
      loadClassCost();
    }
  }, [isOpen, costId]);

  const loadClassCost = async () => {
    if (!costId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load all class costs and find the specific one
      const response = await AdminShippingApi.getClassCosts();
      if (response.success) {
        const cost = response.costs.find(c => c.id === costId);
        if (cost) {
          setClassCost(cost);
        } else {
          setError('Class cost not found');
        }
      } else {
        setError(response.message || 'Failed to load class cost');
      }
    } catch (error) {
      console.error('Error loading class cost:', error);
      setError('Failed to load class cost');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classCost) return;
    
    const confirmed = confirm(`Are you sure you want to delete this cost configuration?`);
    if (confirmed) {
      onDelete(classCost.id);
      onClose();
    }
  };

  const formatCostDisplay = (cost: number, costType: string) => {
    if (costType === 'Percentage') {
      return `${cost}%`;
    }
    return `$${cost.toFixed(2)}`;
  };

  const getCostTypeDescription = (costType: string) => {
    switch (costType) {
      case 'Fixed':
        return 'Fixed shipping cost amount';
      case 'Percentage':
        return 'Percentage of order total';
      case 'PerItem':
        return 'Cost per item in this class';
      default:
        return costType;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Class Cost Configuration
              </h2>
              <p className="text-sm text-gray-500">
                {classCost ? `${classCost.shippingClassName} in ${classCost.shippingZoneName}` : 'Loading...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {classCost && (
              <>
                <button
                  onClick={() => onEdit(classCost)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Cost"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Cost"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                <span className="text-gray-600">Loading cost details...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          ) : classCost ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Cost Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatCostDisplay(classCost.cost, classCost.costType)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getCostTypeDescription(classCost.costType)}
                      </div>
                    </div>
                  </div>

                  {/* Configuration Details */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuration Details</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Shipping Zone</dt>
                        <dd className="mt-2 flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-base font-semibold text-gray-900">{classCost.shippingZoneName}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Shipping Method</dt>
                        <dd className="mt-2 text-base text-gray-900">{classCost.shippingMethodName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Shipping Class</dt>
                        <dd className="mt-2 flex items-center">
                          <Package className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-base font-semibold text-gray-900">{classCost.shippingClassName}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Cost Type</dt>
                        <dd className="mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {classCost.costType}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'configuration' && (
                <div className="space-y-6">
                  {/* Cost Configuration */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Configuration</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Cost Amount</div>
                          <div className="text-sm text-gray-600">{getCostTypeDescription(classCost.costType)}</div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCostDisplay(classCost.cost, classCost.costType)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="text-sm font-medium text-gray-600 mb-1">Zone</div>
                          <div className="text-base text-gray-900">{classCost.shippingZoneName}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="text-sm font-medium text-gray-600 mb-1">Method</div>
                          <div className="text-base text-gray-900">{classCost.shippingMethodName}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="text-sm font-medium text-gray-600 mb-1">Class</div>
                          <div className="text-base text-gray-900">{classCost.shippingClassName}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">How This Cost Is Applied</h4>
                    <div className="space-y-3 text-sm text-blue-800">
                      <p>
                        • This cost applies to products in the <strong>{classCost.shippingClassName}</strong> shipping class
                      </p>
                      <p>
                        • When shipped to the <strong>{classCost.shippingZoneName}</strong> zone
                      </p>
                      <p>
                        • Using the <strong>{classCost.shippingMethodName}</strong> shipping method
                      </p>
                      <p>
                        • Cost calculation: <strong>{getCostTypeDescription(classCost.costType)}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
