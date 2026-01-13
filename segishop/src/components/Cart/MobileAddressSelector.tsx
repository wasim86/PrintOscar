'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Home, 
  Building, 
  Check,
  Loader2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserAddressApiService, UserAddress, CreateUserAddressRequest } from '../../services/user-address-api';
import { PostalCodeInput } from '../Forms/PostalCodeInput';

interface MobileAddressSelectorProps {
  selectedAddress: UserAddress | null;
  onAddressSelect: (address: UserAddress | null) => void;
  onNewAddress?: (address: UserAddress) => void;
}

export const MobileAddressSelector: React.FC<MobileAddressSelectorProps> = ({
  selectedAddress,
  onAddressSelect,
  onNewAddress
}) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateUserAddressRequest>>({
    type: 'Home',
    isDefault: false,
    country: 'United States'
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await UserAddressApiService.getUserAddresses();
      
      if (response.success) {
        setAddresses(response.addresses);
        
        // Auto-select default address if none selected
        if (!selectedAddress && response.addresses.length > 0) {
          const defaultAddress = response.addresses.find(addr => addr.isDefault) || response.addresses[0];
          onAddressSelect(defaultAddress);
        }
      } else {
        setError(response.errorMessage || 'Failed to load addresses');
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="h-4 w-4 text-blue-600" />;
      case 'work':
        return <Building className="h-4 w-4 text-green-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'work':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.address1 || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await UserAddressApiService.createAddress(formData as CreateUserAddressRequest);
      if (response.success && response.address) {
        await loadAddresses();
        onAddressSelect(response.address);
        setIsAddingNew(false);
        setFormData({ type: 'Home', isDefault: false, country: 'United States' });
        
        if (onNewAddress) {
          onNewAddress(response.address);
        }
      } else {
        setError(response.errorMessage || 'Failed to create address');
      }
    } catch (error) {
      console.error('Error creating address:', error);
      setError('Failed to create address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setFormData({ type: 'Home', isDefault: false, country: 'United States' });
    setError(null);
  };

  const formatAddressPreview = (address: UserAddress) => {
    return `${address.address1}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Loading addresses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Selected Address Display (Mobile Optimized) */}
      {selectedAddress && !isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {getAddressIcon(selectedAddress.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getAddressTypeColor(selectedAddress.type)}`}>
                    {selectedAddress.type}
                  </span>
                  {selectedAddress.isDefault && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-orange-600 bg-orange-50 border border-orange-200">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {formatAddressPreview(selectedAddress)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddressList(!showAddressList)}
              className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showAddressList ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Address List (Collapsible on Mobile) */}
      {(showAddressList || !selectedAddress) && addresses.length > 0 && !isAddingNew && (
        <div className="space-y-2">
          {addresses.map((address) => (
            <button
              key={address.id}
              className={`w-full text-left border rounded-lg p-4 transition-colors ${
                selectedAddress?.id === address.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
              }`}
              onClick={() => {
                onAddressSelect(address);
                setShowAddressList(false);
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {selectedAddress?.id === address.id ? (
                    <div className="w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getAddressIcon(address.type)}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getAddressTypeColor(address.type)}`}>
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-orange-600 bg-orange-50 border border-orange-200">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.company && <p className="text-xs text-gray-600">{address.company}</p>}
                  <p className="text-xs text-gray-600">{address.address1}</p>
                  {address.address2 && <p className="text-xs text-gray-600">{address.address2}</p>}
                  <p className="text-xs text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add New Address Button */}
      {!isAddingNew && (
        <button
          onClick={() => {
            setIsAddingNew(true);
            setShowAddressList(false);
          }}
          className="w-full flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors active:bg-gray-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="font-medium">Add New Address</span>
        </button>
      )}

      {/* Mobile-Optimized Add New Address Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Add New Address</h4>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name *"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>
            
            {/* Address Type */}
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Home' | 'Work' | 'Other' })}
              className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="Home">🏠 Home</option>
              <option value="Work">🏢 Work</option>
              <option value="Other">📍 Other</option>
            </select>
            
            {/* Street Address */}
            <input
              type="text"
              placeholder="Street Address *"
              value={formData.address1 || ''}
              onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
              className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              required
            />
            
            <input
              type="text"
              placeholder="Apartment, Suite, etc. (Optional)"
              value={formData.address2 || ''}
              onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
              className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            
            {/* City and State */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City *"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>
            
            {/* ZIP Code with Enhanced Validation */}
            <PostalCodeInput
              value={formData.zipCode || ''}
              onChange={(value) => setFormData({ ...formData, zipCode: value })}
              country={formData.country || 'United States'}
              state={formData.state}
              placeholder="ZIP Code *"
              className="text-base py-3"
              required
              onValidationChange={(isValid, message) => {
                if (!isValid && message) {
                  setError(message);
                } else if (isValid && error?.includes('postal') || error?.includes('ZIP')) {
                  setError(null);
                }
              }}
            />
            
            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone (Optional)"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />

            {/* Default Address Toggle */}
            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={formData.isDefault || false}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-4 py-3 text-base bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Save Address
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-3 text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && addresses.length === 0 && !isAddingNew && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">Add your first address to continue</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};
