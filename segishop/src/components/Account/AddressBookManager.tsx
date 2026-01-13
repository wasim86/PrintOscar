'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building, 
  Check,
  X,
  Loader2,
  AlertCircle,
  MoreVertical,
  Star,
  Clock,
  Filter,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { UserAddressApiService, UserAddress, CreateUserAddressRequest } from '../../services/user-address-api';
import { PostalCodeInput } from '../Forms/PostalCodeInput';

export const AddressBookManager: React.FC = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedAddresses, setSelectedAddresses] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Home' | 'Work' | 'Other'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'type' | 'usage'>('recent');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateUserAddressRequest>>({
    type: 'Home',
    isDefault: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    filterAndSortAddresses();
  }, [addresses, searchTerm, filterType, sortBy]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await UserAddressApiService.getUserAddresses();
      
      if (response.success) {
        setAddresses(response.addresses);
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

  const filterAndSortAddresses = () => {
    let filtered = addresses.filter(address => {
      const matchesSearch = searchTerm === '' || 
        `${address.firstName} ${address.lastName} ${address.address1} ${address.city} ${address.state}`
          .toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || address.type === filterType;
      
      return matchesSearch && matchesFilter;
    });

    // Sort addresses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'usage':
          // Mock usage data - in real app, this would come from analytics
          return (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0);
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    setFilteredAddresses(filtered);
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

  const handleSelectAddress = (addressId: number) => {
    const newSelected = new Set(selectedAddresses);
    if (newSelected.has(addressId)) {
      newSelected.delete(addressId);
    } else {
      newSelected.add(addressId);
    }
    setSelectedAddresses(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedAddresses.size === filteredAddresses.length) {
      setSelectedAddresses(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedAddresses(new Set(filteredAddresses.map(addr => addr.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedAddresses.size} addresses?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedAddresses).map(id => 
        UserAddressApiService.deleteAddress(id)
      );
      
      await Promise.all(deletePromises);
      await loadAddresses();
      setSelectedAddresses(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error deleting addresses:', error);
      setError('Failed to delete some addresses. Please try again.');
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
      if (editingId) {
        // Update existing address - ensure country is set
        const addressData = { ...formData, country: 'United States' };
        const response = await UserAddressApiService.updateAddress(editingId, addressData);
        if (response.success) {
          await loadAddresses();
          setEditingId(null);
          setIsAddingNew(false);
        } else {
          setError(response.errorMessage || 'Failed to update address');
        }
      } else {
        // Create new address - ensure country is set
        const addressData = { ...formData, country: 'United States' } as CreateUserAddressRequest;
        const response = await UserAddressApiService.createAddress(addressData);
        if (response.success) {
          await loadAddresses();
          setIsAddingNew(false);
        } else {
          setError(response.errorMessage || 'Failed to create address');
        }
      }
      
      setFormData({ type: 'Home', isDefault: false });
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address: UserAddress) => {
    setFormData({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setEditingId(address.id);
    setIsAddingNew(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await UserAddressApiService.deleteAddress(id);
      if (response.success) {
        await loadAddresses();
      } else {
        setError(response.errorMessage || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address. Please try again.');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const response = await UserAddressApiService.setAsDefault(id);
      if (response.success) {
        await loadAddresses();
      } else {
        setError(response.errorMessage || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setError('Failed to set default address. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({ type: 'Home', isDefault: false });
    setError(null);
  };

  const exportAddresses = () => {
    const csvContent = [
      ['Type', 'Name', 'Company', 'Address', 'City', 'State', 'ZIP', 'Country', 'Phone', 'Default'].join(','),
      ...filteredAddresses.map(addr => [
        addr.type,
        `${addr.firstName} ${addr.lastName}`,
        addr.company || '',
        `${addr.address1} ${addr.address2 || ''}`.trim(),
        addr.city,
        addr.state,
        addr.zipCode,
        addr.country,
        addr.phone || '',
        addr.isDefault ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'addresses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Address Book</h2>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddingNew(true)}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </button>
        </div>
      </div>
      
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-800">
              {selectedAddresses.size} address{selectedAddresses.size !== 1 ? 'es' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete Selected
              </button>
              <button
                onClick={() => {
                  setSelectedAddresses(new Set());
                  setShowBulkActions(false);
                }}
                className="flex items-center px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-2 text-gray-600">Loading addresses...</span>
        </div>
      )}

      {/* Address List with Selection */}
      {!isLoading && filteredAddresses.length > 0 && (
        <div className="space-y-4">
          {/* Select All Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedAddresses.size === filteredAddresses.length && filteredAddresses.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Select all ({filteredAddresses.length})
            </label>
          </div>

          {/* Address Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAddresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedAddresses.has(address.id)}
                      onChange={() => handleSelectAddress(address.id)}
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center space-x-3">
                      {getAddressIcon(address.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getAddressTypeColor(address.type)}`}>
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-orange-600 bg-orange-50 border border-orange-200">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.company && <p>{address.company}</p>}
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAddresses.length === 0 && addresses.length > 0 && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {!isLoading && addresses.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-4">Add your first address to get started.</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </button>
        </div>
      )}

      {/* Add/Edit Address Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Home' | 'Work' | 'Other' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault || false}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter first name"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter last name"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter company name (optional)"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
              />
            </div>

            {/* Address Lines */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="Enter street address"
                value={formData.address1 || ''}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={formData.address2 || ''}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter city"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter state"
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
                />
              </div>

              {/* ZIP Code with Enhanced Validation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <PostalCodeInput
                  value={formData.zipCode || ''}
                  onChange={(value) => setFormData({ ...formData, zipCode: value })}
                  country={formData.country || 'United States'}
                  state={formData.state}
                  placeholder="Enter ZIP code"
                  required
                  onValidationChange={(isValid, message) => {
                    if (!isValid && message) {
                      setError(message);
                    } else if (isValid && error?.includes('postal') || error?.includes('ZIP')) {
                      setError(null);
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter country"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number (optional)"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Address' : 'Save Address')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
