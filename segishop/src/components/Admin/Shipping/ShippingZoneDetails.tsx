'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Truck,
  DollarSign,
  Clock,
  Globe,
  Settings,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  AdminShippingApi,
  AdminShippingZone,
  AdminShippingZoneRegion,
  AdminShippingZoneMethod
} from '@/services/admin-shipping-api';

interface ShippingZoneDetailsProps {
  zoneId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (zone: AdminShippingZone) => void;
  onDelete: (zoneId: number) => void;
}

export const ShippingZoneDetails: React.FC<ShippingZoneDetailsProps> = ({
  zoneId,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [zone, setZone] = useState<AdminShippingZone | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && zoneId) {
      loadZoneDetails();
    }
  }, [isOpen, zoneId]);

  const loadZoneDetails = async () => {
    if (!zoneId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await AdminShippingApi.getZone(zoneId);
      if (response.success && response.zone) {
        setZone(response.zone);
      } else {
        setError(response.message || 'Failed to load zone details');
      }
    } catch (error) {
      console.error('Error loading zone details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load zone details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!zone) return;
    
    if (confirm(`Are you sure you want to delete the shipping zone "${zone.name}"? This action cannot be undone.`)) {
      onDelete(zone.id);
      onClose();
    }
  };

  const formatEstimatedDays = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `${min}-${max} days`;
    if (min) return `${min}+ days`;
    if (max) return `Up to ${max} days`;
    return 'Not specified';
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Settings,
      count: null
    },
    {
      id: 'regions',
      label: 'Coverage Areas',
      icon: Globe,
      count: zone?.regions.length || 0
    },
    {
      id: 'methods',
      label: 'Shipping Methods',
      icon: Truck,
      count: zone?.methods.length || 0
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {zone?.name || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500">
                {zone?.description || 'Shipping zone details'}
              </p>
            </div>
            {zone && (
              <div className="flex items-center space-x-2">
                {zone.isEnabled ? (
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
            {zone && (
              <>
                <button
                  onClick={() => onEdit(zone)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Zone"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Zone"
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
                  <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      isActive ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading zone details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          ) : zone ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Zone Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Globe className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Coverage Areas</p>
                          <p className="text-2xl font-bold text-blue-600">{zone.regionCount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Truck className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Shipping Methods</p>
                          <p className="text-2xl font-bold text-green-600">{zone.methodCount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Settings className="h-8 w-8 text-purple-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">Sort Order</p>
                          <p className="text-2xl font-bold text-purple-600">{zone.sortOrder}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zone Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Zone Information</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Zone Name</dt>
                        <dd className="mt-2 text-base font-semibold text-gray-900">{zone.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Status</dt>
                        <dd className="mt-2">
                          {zone.isEnabled ? (
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
                        <dt className="text-sm font-medium text-gray-600">Description</dt>
                        <dd className="mt-2 text-base text-gray-900">{zone.description || 'No description provided'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Created</dt>
                        <dd className="mt-2 text-base text-gray-900">
                          {new Date(zone.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'regions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Coverage Areas</h3>
                    <span className="text-sm text-gray-500">{zone.regions.length} regions</span>
                  </div>
                  
                  {zone.regions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 font-medium mb-2">No coverage areas defined</p>
                      <p className="text-sm text-gray-500">Edit this zone to add coverage areas</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {zone.regions.map((region, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {region.regionType}
                            </span>
                            {region.isIncluded ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{region.regionCode}</p>
                            <p className="text-sm text-gray-600 mt-1">{region.regionName}</p>
                            <p className="text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded">
                              Priority: {region.priority}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'methods' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Shipping Methods</h3>
                    <span className="text-sm text-gray-500">{zone.methods.length} methods</span>
                  </div>
                  
                  {zone.methods.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 font-medium mb-2">No shipping methods configured</p>
                      <p className="text-sm text-gray-500">Add shipping methods to this zone to enable shipping</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {zone.methods.map((method, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-green-100 rounded-lg">
                                <Truck className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{method.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{method.shippingMethodName}</p>
                              </div>
                            </div>
                            <div className="text-right">
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
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 font-medium">Base Cost:</span>
                              <span className="ml-2 font-semibold text-gray-900">${method.baseCost.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600 font-medium">Delivery Time:</span>
                              <span className="ml-2 font-semibold text-gray-900">
                                {formatEstimatedDays(method.estimatedDaysMin, method.estimatedDaysMax)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 font-medium">Min Order:</span>
                              <span className="ml-2 font-semibold text-gray-900">
                                {method.minOrderAmount ? `$${method.minOrderAmount.toFixed(2)}` : 'None'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
