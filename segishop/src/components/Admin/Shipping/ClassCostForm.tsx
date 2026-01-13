'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { AdminShippingClassCost, CreateShippingClassCost, UpdateShippingClassCost, AdminShippingZone, AdminShippingClass, AdminShippingZoneMethod } from '@/services/admin-shipping-api';

interface ClassCostFormProps {
  classCost?: AdminShippingClassCost;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  shippingZoneMethodId: number;
  shippingClassId: number;
  cost: number;
  costType: string;
}

const costTypes = [
  { value: 'Fixed', label: 'Fixed Amount', description: 'Fixed shipping cost' },
  { value: 'Percentage', label: 'Percentage', description: 'Percentage of order total' },
  { value: 'PerItem', label: 'Per Item', description: 'Cost per item in class' }
];

export function ClassCostForm({ classCost, isOpen, onClose, onSave }: ClassCostFormProps) {
  const [formData, setFormData] = useState<FormData>({
    shippingZoneMethodId: 0,
    shippingClassId: 0,
    cost: 0,
    costType: 'Fixed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zones, setZones] = useState<AdminShippingZone[]>([]);
  const [classes, setClasses] = useState<AdminShippingClass[]>([]);
  const [zoneMethods, setZoneMethods] = useState<AdminShippingZoneMethod[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (classCost) {
      setFormData({
        shippingZoneMethodId: classCost.shippingZoneMethodId,
        shippingClassId: classCost.shippingClassId,
        cost: classCost.cost,
        costType: classCost.costType
      });
    } else {
      setFormData({
        shippingZoneMethodId: 0,
        shippingClassId: 0,
        cost: 0,
        costType: 'Fixed'
      });
    }
    setError(null);
  }, [classCost, isOpen]);

  const loadData = async () => {
    try {
      const { AdminShippingApi } = await import('@/services/admin-shipping-api');
      
      const [zonesResponse, classesResponse] = await Promise.all([
        AdminShippingApi.getZones(),
        AdminShippingApi.getClasses()
      ]);

      if (zonesResponse.success) {
        setZones(zonesResponse.zones);
      }
      if (classesResponse.success) {
        setClasses(classesResponse.classes);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load zones and classes');
    }
  };

  const loadZoneMethods = async (zoneId: number) => {
    if (!zoneId) {
      setZoneMethods([]);
      return;
    }

    try {
      const { AdminShippingApi } = await import('@/services/admin-shipping-api');
      const response = await AdminShippingApi.getZone(zoneId);
      
      if (response.success && response.zone) {
        setZoneMethods(response.zone.methods);
      }
    } catch (error) {
      console.error('Error loading zone methods:', error);
      setZoneMethods([]);
    }
  };

  const handleZoneChange = (zoneId: number) => {
    setSelectedZoneId(zoneId);
    setFormData(prev => ({ ...prev, shippingZoneMethodId: 0 }));
    loadZoneMethods(zoneId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { AdminShippingApi } = await import('@/services/admin-shipping-api');
      
      if (classCost) {
        // Update existing cost
        const updateData: UpdateShippingClassCost = {
          cost: formData.cost,
          costType: formData.costType
        };
        
        const response = await AdminShippingApi.updateClassCost(classCost.id, updateData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to update class cost');
        }
      } else {
        // Create new cost
        const createData: CreateShippingClassCost = {
          shippingZoneMethodId: formData.shippingZoneMethodId,
          shippingClassId: formData.shippingClassId,
          cost: formData.cost,
          costType: formData.costType
        };
        
        const response = await AdminShippingApi.createClassCost(createData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to create class cost');
        }
      }
    } catch (error) {
      console.error('Error saving class cost:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {classCost ? 'Edit Class Cost' : 'Add Class Cost'}
              </h2>
              <p className="text-sm text-gray-500">
                {classCost ? 'Update shipping cost configuration' : 'Create a new shipping cost for a class'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!classCost && (
              <>
                {/* Shipping Zone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Zone *
                  </label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => handleZoneChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    required
                  >
                    <option value={0}>Select a zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Zone Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Method *
                  </label>
                  <select
                    value={formData.shippingZoneMethodId}
                    onChange={(e) => setFormData({ ...formData, shippingZoneMethodId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    required
                    disabled={!selectedZoneId}
                  >
                    <option value={0}>Select a method</option>
                    {zoneMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.title} ({method.shippingMethodName})
                      </option>
                    ))}
                  </select>
                  {!selectedZoneId && (
                    <p className="text-xs text-gray-500 mt-1">Select a zone first</p>
                  )}
                </div>

                {/* Shipping Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Class *
                  </label>
                  <select
                    value={formData.shippingClassId}
                    onChange={(e) => setFormData({ ...formData, shippingClassId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    required
                  >
                    <option value={0}>Select a class</option>
                    {classes.map((shippingClass) => (
                      <option key={shippingClass.id} value={shippingClass.id}>
                        {shippingClass.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Cost Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Type *
              </label>
              <select
                value={formData.costType}
                onChange={(e) => setFormData({ ...formData, costType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                required
              >
                {costTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {formData.costType === 'Percentage' ? '%' : '$'}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.costType === 'Fixed' && 'Fixed shipping cost amount'}
                {formData.costType === 'Percentage' && 'Percentage of order total'}
                {formData.costType === 'PerItem' && 'Cost per item in this class'}
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Settings className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">About Class Costs</h4>
                  <p className="text-sm text-blue-700">
                    Class costs allow you to set different shipping rates for different product types 
                    within the same zone and method combination.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!classCost && (formData.shippingZoneMethodId === 0 || formData.shippingClassId === 0))}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {classCost ? 'Update Cost' : 'Create Cost'}
          </button>
        </div>
      </div>
    </div>
  );
}
