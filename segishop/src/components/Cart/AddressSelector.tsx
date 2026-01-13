'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Home,
  Building,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { UserAddressApiService, UserAddress, CreateUserAddressRequest } from '../../services/user-address-api';
import { PostalCodeInput } from '../Forms/PostalCodeInput';

interface AddressSelectorProps {
  selectedAddress: UserAddress | null;
  onAddressSelect: (address: UserAddress | null) => void;
  onNewAddress?: (address: UserAddress) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddress,
  onAddressSelect,
  onNewAddress
}) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
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

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName?.trim()) errors.push('First name is required');
    if (!formData.lastName?.trim()) errors.push('Last name is required');
    if (!formData.address1?.trim()) errors.push('Street address is required');
    if (!formData.city?.trim()) errors.push('City is required');
    if (!formData.state?.trim()) errors.push('State is required');
    if (!formData.zipCode?.trim()) errors.push('ZIP code is required');

    // Additional validation
    if (formData.firstName && formData.firstName.length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    if (formData.lastName && formData.lastName.length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    if (formData.address1 && formData.address1.length < 5) {
      errors.push('Street address must be at least 5 characters');
    }
    if (formData.city && formData.city.length < 2) {
      errors.push('City must be at least 2 characters');
    }
    if (formData.state && formData.state.length < 2) {
      errors.push('State must be at least 2 characters');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]); // Show first error
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure country is always set to United States
      const addressData = { ...formData, country: 'United States' } as CreateUserAddressRequest;
      const response = await UserAddressApiService.createAddress(addressData);
      if (response.success && response.address) {
        await loadAddresses(); // Reload addresses
        onAddressSelect(response.address); // Auto-select new address
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
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

      {/* Address Selection */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedAddress?.id === address.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <div className="flex items-start justify-between">
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
                  <div className="flex-1">
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
                    <div className="text-sm text-gray-900">
                      <p className="font-medium">{address.firstName} {address.lastName}</p>
                      {address.company && <p>{address.company}</p>}
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Button */}
      {!isAddingNew && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </button>
      )}

      {/* Add New Address Form */}
      {isAddingNew && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Address</h4>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="First Name *"
                  value={formData.firstName || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, firstName: value });
                    // Clear error if field becomes valid
                    if (value.trim().length >= 2 && error?.includes('First name')) {
                      setError(null);
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500 ${
                    formData.firstName && formData.firstName.trim().length < 2
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={formData.lastName || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, lastName: value });
                    // Clear error if field becomes valid
                    if (value.trim().length >= 2 && error?.includes('Last name')) {
                      setError(null);
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500 ${
                    formData.lastName && formData.lastName.trim().length < 2
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  required
                />
              </div>
            </div>
            
            <input
              type="text"
              placeholder="Street Address *"
              value={formData.address1 || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, address1: value });
                // Clear error if field becomes valid
                if (value.trim().length >= 5 && error?.includes('Street address')) {
                  setError(null);
                }
              }}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500 ${
                formData.address1 && formData.address1.trim().length < 5
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              required
            />

            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              value={formData.address2 || ''}
              onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Company (optional)"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
            />

            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City *"
                value={formData.city || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, city: value });
                  // Clear error if field becomes valid
                  if (value.trim().length >= 2 && error?.includes('City')) {
                    setError(null);
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500 ${
                  formData.city && formData.city.trim().length < 2
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                required
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.state || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, state: value });
                  // Clear error if field becomes valid
                  if (value.trim().length >= 2 && error?.includes('State')) {
                    setError(null);
                  }
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500 ${
                  formData.state && formData.state.trim().length < 2
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <PostalCodeInput
                value={formData.zipCode || ''}
                onChange={(value) => setFormData({ ...formData, zipCode: value })}
                country={formData.country || 'United States'}
                state={formData.state}
                placeholder="ZIP Code *"
                className="text-sm text-black placeholder-gray-500"
                required
                onValidationChange={(isValid, message) => {
                  if (!isValid && message) {
                    setError(message);
                  } else if (isValid && error?.includes('postal') || error?.includes('ZIP')) {
                    setError(null);
                  }
                }}
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Home' | 'Work' | 'Other' })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && addresses.length === 0 && !isAddingNew && (
        <div className="text-center py-6">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">No addresses saved</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};
