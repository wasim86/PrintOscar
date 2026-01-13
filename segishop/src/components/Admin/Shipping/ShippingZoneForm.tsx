'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Loader2,
  AlertCircle,
  MapPin,
  Globe,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import {
  AdminShippingApi,
  AdminShippingZone,
  CreateShippingZone,
  UpdateShippingZone,
  AdminShippingZoneRegion
} from '@/services/admin-shipping-api';

interface ShippingZoneFormProps {
  zone?: AdminShippingZone;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  name: string;
  description: string;
  isEnabled: boolean;
  sortOrder: number;
}

interface RegionFormData {
  regionType: string;
  regionCode: string;
  regionName: string;
  isIncluded: boolean;
  priority: number;
}

export const ShippingZoneForm: React.FC<ShippingZoneFormProps> = ({
  zone,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isEnabled: true,
    sortOrder: 0
  });

  const [regions, setRegions] = useState<AdminShippingZoneRegion[]>([]);
  const [newRegion, setNewRegion] = useState<RegionFormData>({
    regionType: 'Country',
    regionCode: '',
    regionName: '',
    isIncluded: true,
    priority: 1
  });

  const [loading, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const isEditing = !!zone;

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        description: zone.description || '',
        isEnabled: zone.isEnabled,
        sortOrder: zone.sortOrder
      });
      setRegions(zone.regions || []);
    } else {
      setFormData({
        name: '',
        description: '',
        isEnabled: true,
        sortOrder: 0
      });
      setRegions([]);
    }
    setError(null);
  }, [zone, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditing && zone) {
        const updateData: UpdateShippingZone = {
          name: formData.name,
          description: formData.description,
          isEnabled: formData.isEnabled,
          sortOrder: formData.sortOrder
        };
        
        const response = await AdminShippingApi.updateZone(zone.id, updateData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to update shipping zone');
        }
      } else {
        const createData: CreateShippingZone = {
          name: formData.name,
          description: formData.description,
          isEnabled: formData.isEnabled,
          sortOrder: formData.sortOrder
        };
        
        const response = await AdminShippingApi.createZone(createData);
        if (response.success) {
          onSave();
          onClose();
        } else {
          setError(response.message || 'Failed to create shipping zone');
        }
      }
    } catch (error) {
      console.error('Error saving shipping zone:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRegion = () => {
    if (!newRegion.regionCode || !newRegion.regionName) {
      setError('Region code and name are required');
      return;
    }

    const region: AdminShippingZoneRegion = {
      id: Date.now(), // Temporary ID for new regions
      regionType: newRegion.regionType,
      regionCode: newRegion.regionCode.toUpperCase(),
      regionName: newRegion.regionName,
      isIncluded: newRegion.isIncluded,
      priority: newRegion.priority
    };

    setRegions([...regions, region]);
    setNewRegion({
      regionType: 'Country',
      regionCode: '',
      regionName: '',
      isIncluded: true,
      priority: 1
    });
    setError(null);
  };

  const handleRemoveRegion = (index: number) => {
    setRegions(regions.filter((_, i) => i !== index));
  };

  const regionTypes = [
    { value: 'Country', label: 'Country' },
    { value: 'State', label: 'State/Province' },
    { value: 'ZipCode', label: 'Zip Code' },
    { value: 'City', label: 'City' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Shipping Zone' : 'Create Shipping Zone'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing ? 'Update shipping zone details and coverage' : 'Add a new shipping zone with coverage areas'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('regions')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'regions'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe className="h-4 w-4 inline mr-2" />
              Coverage Areas ({regions.length})
            </button>
          </nav>
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

          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Zone Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    placeholder="e.g., Zone 1 - East Coast"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black resize-none"
                    placeholder="Describe the coverage area and purpose of this zone"
                  />
                </div>

                {/* Sort Order and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in zone selection</p>
                  </div>

                  {/* Enabled Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isEnabled"
                      checked={formData.isEnabled}
                      onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-700">
                      Enable this shipping zone
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'regions' && (
              <div className="space-y-6">
                {/* Add New Region */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Add Coverage Area</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={newRegion.regionType}
                        onChange={(e) => setNewRegion({ ...newRegion, regionType: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                      >
                        {regionTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Code</label>
                      <input
                        type="text"
                        value={newRegion.regionCode}
                        onChange={(e) => setNewRegion({ ...newRegion, regionCode: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                        placeholder="US, CA, NY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newRegion.regionName}
                        onChange={(e) => setNewRegion({ ...newRegion, regionName: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                        placeholder="United States, New York"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddRegion}
                        className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Regions List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Coverage Areas ({regions.length})</h4>
                  {regions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No coverage areas defined</p>
                      <p className="text-xs">Add regions, states, or zip codes above</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {regions.map((region, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {region.regionType}
                            </span>
                            <span className="font-medium text-gray-900">{region.regionCode}</span>
                            <span className="text-gray-600">{region.regionName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveRegion(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Zone' : 'Create Zone'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
