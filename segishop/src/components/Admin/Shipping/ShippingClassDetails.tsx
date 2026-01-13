'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Edit, Trash2, MapPin, DollarSign, Settings, AlertCircle, Loader2, ShoppingBag } from 'lucide-react';
import { AdminShippingClass, AdminShippingApi } from '@/services/admin-shipping-api';
import { ProductAssignments } from './ProductAssignments';

interface ShippingClassDetailsProps {
  classId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (shippingClass: AdminShippingClass) => void;
  onDelete: (classId: number) => void;
}

interface TabInfo {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export function ShippingClassDetails({ classId, isOpen, onClose, onEdit, onDelete }: ShippingClassDetailsProps) {
  const [shippingClass, setShippingClass] = useState<AdminShippingClass | null>(null);
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
      id: 'products',
      label: 'Products',
      icon: ShoppingBag,
      count: shippingClass?.productCount || 0
    },
    {
      id: 'costs',
      label: 'Shipping Costs',
      icon: DollarSign,
      count: shippingClass?.classCosts.length || 0
    }
  ];

  useEffect(() => {
    if (isOpen && classId) {
      loadClass();
    }
  }, [isOpen, classId]);

  const loadClass = async () => {
    if (!classId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await AdminShippingApi.getClass(classId);
      if (response.success && response.class) {
        setShippingClass(response.class);
      } else {
        setError(response.message || 'Failed to load shipping class');
      }
    } catch (error) {
      console.error('Error loading shipping class:', error);
      setError('Failed to load shipping class');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!shippingClass) return;
    
    const confirmed = confirm(`Are you sure you want to delete "${shippingClass.name}"?`);
    if (confirmed) {
      onDelete(shippingClass.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {shippingClass?.name || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500">
                {shippingClass?.description || 'Shipping class details'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {shippingClass && (
              <>
                <button
                  onClick={() => onEdit(shippingClass)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Class"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Class"
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
                <span className="text-gray-600">Loading class details...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          ) : shippingClass ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Class Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Class Information</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Class Name</dt>
                        <dd className="mt-2 text-base font-semibold text-gray-900">{shippingClass.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Slug</dt>
                        <dd className="mt-2 text-base text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                          {shippingClass.slug}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Products Assigned</dt>
                        <dd className="mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            {shippingClass.productCount} products
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Cost Configurations</dt>
                        <dd className="mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {shippingClass.classCosts.length} configurations
                          </span>
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-600">Description</dt>
                        <dd className="mt-2 text-base text-gray-900">
                          {shippingClass.description || 'No description provided'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Created</dt>
                        <dd className="mt-2 text-base text-gray-900">
                          {new Date(shippingClass.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Last Updated</dt>
                        <dd className="mt-2 text-base text-gray-900">
                          {new Date(shippingClass.updatedAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <ProductAssignments
                  classId={shippingClass.id}
                  className={shippingClass.name}
                  onProductCountChange={(count) => {
                    setShippingClass(prev => prev ? { ...prev, productCount: count } : null);
                  }}
                />
              )}

              {activeTab === 'costs' && (
                <div className="space-y-6">
                  {shippingClass.classCosts.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Shipping Cost Configurations</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Zone
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Method
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cost
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {shippingClass.classCosts.map((cost) => (
                              <tr key={cost.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {cost.shippingZoneName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {cost.shippingMethodName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  ${cost.cost.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {cost.costType}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 font-medium mb-2">No cost configurations</p>
                      <p className="text-sm text-gray-500">
                        Set up shipping costs for this class in different zones
                      </p>
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
}
