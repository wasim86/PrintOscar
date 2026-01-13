'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Edit, Trash2, CheckCircle, XCircle, MapPin, Package, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { AdminShippingMethod, AdminShippingApi } from '@/services/admin-shipping-api';
import { ZoneAssignments } from './ZoneAssignments';

interface ShippingMethodDetailsProps {
  methodId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (method: AdminShippingMethod) => void;
  onDelete: (methodId: number) => void;
}

interface TabInfo {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export function ShippingMethodDetails({ methodId, isOpen, onClose, onEdit, onDelete }: ShippingMethodDetailsProps) {
  const [method, setMethod] = useState<AdminShippingMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: TabInfo[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Settings,
      count: undefined
    },
    {
      id: 'zones',
      label: 'Zones',
      icon: MapPin,
      count: method?.zoneCount || 0
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Package,
      count: undefined
    }
  ];

  useEffect(() => {
    if (isOpen && methodId) {
      loadMethod();
    }
  }, [isOpen, methodId]);

  const loadMethod = async () => {
    if (!methodId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await AdminShippingApi.getMethod(methodId);
      if (response.success && response.method) {
        setMethod(response.method);
      } else {
        setError(response.message || 'Failed to load shipping method');
      }
    } catch (error) {
      console.error('Error loading shipping method:', error);
      setError('Failed to load shipping method');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!method) return;
    
    const confirmed = confirm(`Are you sure you want to delete "${method.name}"?`);
    if (confirmed) {
      onDelete(method.id);
      onClose();
    }
  };

  const formatMethodType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'FlatRate': 'Flat Rate',
      'FreeShipping': 'Free Shipping',
      'LocalPickup': 'Local Pickup',
      'Express': 'Express Shipping',
      'Standard': 'Standard Shipping'
    };
    return typeMap[type] || type;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {method?.name || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500">
                {method?.description || 'Shipping method details'}
              </p>
            </div>
            {method && (
              <div className="flex items-center space-x-2">
                {method.isEnabled ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {method && (
              <>
                <button
                  onClick={() => onEdit(method)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Method"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Method"
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
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
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
                <span className="text-gray-600">Loading method details...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          ) : method ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Method Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Method Information</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Method Name</dt>
                        <dd className="mt-2 text-base font-semibold text-gray-900">{method.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Type</dt>
                        <dd className="mt-2 text-base text-gray-900">{formatMethodType(method.methodType)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Status</dt>
                        <dd className="mt-2">
                          {method.isEnabled ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              <XCircle className="h-4 w-4 mr-1" />
                              Inactive
                            </span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Tax Status</dt>
                        <dd className="mt-2 text-base text-gray-900">
                          {method.isTaxable ? 'Taxable' : 'Tax-free'}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-600">Description</dt>
                        <dd className="mt-2 text-base text-gray-900">{method.description || 'No description provided'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Created</dt>
                        <dd className="mt-2 text-base text-gray-900">
                          {new Date(method.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Last Updated</dt>
                        <dd className="mt-2 text-base text-gray-900">
                          {new Date(method.updatedAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'zones' && (
                <ZoneAssignments
                  methodId={method.id}
                  methodName={method.name}
                  onZoneCountChange={(count) => {
                    setMethod(prev => prev ? { ...prev, zoneCount: count } : null);
                  }}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 font-medium mb-2">Advanced settings coming soon</p>
                    <p className="text-sm text-gray-500">Configure method-specific settings</p>
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
