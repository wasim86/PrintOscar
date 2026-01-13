'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Calendar, Percent, DollarSign, Users, TrendingUp, Truck } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.printoscar.com/api';

interface Coupon {
  id: number;
  code: string;
  description: string;
  type: 'Percentage' | 'FixedAmount' | 'FreeShipping';
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  maxTotalUses?: number;
  maxUsesPerUser?: number;
  currentTotalUses: number;
  isFirstOrderOnly: boolean;
  isUserSpecific: boolean;
  allowedUserEmails?: string;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUsages: number;
  totalDiscountGiven: number;
  topCoupons: Array<{
    code: string;
    description: string;
    usageCount: number;
    totalDiscountGiven: number;
  }>;
}

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const pageSize = 10;

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'Percentage' as 'Percentage' | 'FixedAmount' | 'FreeShipping',
    value: '',
    minimumOrderAmount: '',
    maximumDiscountAmount: '',
    maxTotalUses: '',
    maxUsesPerUser: '',
    isFirstOrderOnly: false,
    isUserSpecific: false,
    allowedUserEmails: '',
    isActive: true,
    validFrom: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, [currentPage, searchTerm, filterActive, filterType]);

  // Helper function to convert enum values to string types
  const convertCouponType = (enumValue: number): 'Percentage' | 'FixedAmount' | 'FreeShipping' => {
    switch (enumValue) {
      case 1: return 'Percentage';
      case 2: return 'FixedAmount';
      case 3: return 'FreeShipping';
      default: return 'Percentage';
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('printoscar_admin_token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterActive !== null && { isActive: filterActive.toString() }),
        ...(filterType && { type: filterType })
      });

      const response = await fetch(`${API_BASE_URL}/admin/coupons?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();

        // Debug: Log raw API response to see what we're getting
        console.log('Raw API response:', data);
        console.log('First coupon raw data:', data.coupons?.[0]);

        // Convert enum types to string types and ensure boolean fields are properly handled
        const convertedCoupons = (data.coupons || []).map((coupon: any) => {
          console.log(`Processing coupon ${coupon.code}:`, {
            isUserSpecific: coupon.isUserSpecific,
            allowedUserEmails: coupon.allowedUserEmails,
            type: coupon.type
          });

          return {
            ...coupon,
            type: convertCouponType(coupon.type),
            // Ensure boolean fields are properly converted
            isUserSpecific: Boolean(coupon.isUserSpecific),
            isFirstOrderOnly: Boolean(coupon.isFirstOrderOnly),
            isActive: Boolean(coupon.isActive),
            // Ensure allowedUserEmails is a string
            allowedUserEmails: coupon.allowedUserEmails || ''
          };
        });

        console.log('Converted coupons:', convertedCoupons);
        setCoupons(convertedCoupons);
        setTotalCount(data.totalCount || 0);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('printoscar_admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/coupons/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const validateForm = (): string | null => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (!formData.code.trim()) {
      return 'Coupon code is required';
    }

    if (!formData.description.trim()) {
      return 'Description is required';
    }

    // Value validation - only for non-free shipping coupons
    if (formData.type !== 'FreeShipping') {
      if (!formData.value || parseFloat(formData.value) <= 0) {
        return 'Value must be greater than 0';
      }

      // Type-specific validation
      if (formData.type === 'Percentage' && parseFloat(formData.value) > 100) {
        return 'Percentage discount cannot exceed 100%';
      }
    }

    // User-specific validation
    if (formData.isUserSpecific && !formData.allowedUserEmails.trim()) {
      return 'User-specific coupons must have at least one email address';
    }

    // Date validation
    if (formData.validFrom && formData.validUntil) {
      const fromDate = new Date(formData.validFrom);
      const untilDate = new Date(formData.validUntil);
      if (fromDate >= untilDate) {
        return 'Valid From date must be before Valid Until date';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('segishop_admin_token');
      const url = editingCoupon
        ? `${API_BASE_URL}/admin/coupons/${editingCoupon.id}`
        : `${API_BASE_URL}/admin/coupons`;

      const method = editingCoupon ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        type: formData.type === 'Percentage' ? 1 : formData.type === 'FixedAmount' ? 2 : 3, // Convert string to enum value
        value: formData.type === 'FreeShipping' ? 0 : parseFloat(formData.value),
        minimumOrderAmount: formData.minimumOrderAmount ? parseFloat(formData.minimumOrderAmount) : null,
        maximumDiscountAmount: formData.type === 'FreeShipping' ? null : (formData.maximumDiscountAmount ? parseFloat(formData.maximumDiscountAmount) : null),
        maxTotalUses: formData.maxTotalUses ? parseInt(formData.maxTotalUses) : null,
        maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : null,
        isUserSpecific: formData.isUserSpecific,
        allowedUserEmails: formData.isUserSpecific && formData.allowedUserEmails.trim() ? formData.allowedUserEmails.trim() : null,
        validFrom: formData.validFrom || null,
        validUntil: formData.validUntil || null
      };

      console.log('Coupon payload:', payload);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');

        // Refresh data
        await fetchCoupons();
        await fetchStats();

        // Close form after a brief delay to show success message
        setTimeout(() => {
          resetForm();
          setShowCreateForm(false);
          setEditingCoupon(null);
          setSuccessMessage('');
        }, 1500);
      } else {
        const error = await response.json();
        setErrorMessage(error.errorMessage || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      setErrorMessage('Failed to save coupon. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const token = localStorage.getItem('printoscar_admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchCoupons();
        await fetchStats();
      } else {
        const error = await response.json();
        alert(error.errorMessage || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      type: 'Percentage',
      value: '',
      minimumOrderAmount: '',
      maximumDiscountAmount: '',
      maxTotalUses: '',
      maxUsesPerUser: '',
      isFirstOrderOnly: false,
      isUserSpecific: false,
      allowedUserEmails: '',
      isActive: true,
      validFrom: '',
      validUntil: ''
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const startEdit = (coupon: Coupon) => {
    // Clear any previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Debug: Log the coupon data being passed to edit
    console.log('=== EDITING COUPON ===');
    console.log('Coupon object:', coupon);
    console.log('isUserSpecific:', coupon.isUserSpecific, typeof coupon.isUserSpecific);
    console.log('allowedUserEmails:', coupon.allowedUserEmails, typeof coupon.allowedUserEmails);
    console.log('======================');

    const formDataToSet = {
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.type === 'FreeShipping' ? '' : coupon.value.toString(),
      minimumOrderAmount: coupon.minimumOrderAmount?.toString() || '',
      maximumDiscountAmount: coupon.type === 'FreeShipping' ? '' : (coupon.maximumDiscountAmount?.toString() || ''),
      maxTotalUses: coupon.maxTotalUses?.toString() || '',
      maxUsesPerUser: coupon.maxUsesPerUser?.toString() || '',
      isFirstOrderOnly: coupon.isFirstOrderOnly,
      isUserSpecific: coupon.isUserSpecific,
      allowedUserEmails: coupon.allowedUserEmails || '',
      isActive: coupon.isActive,
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
      validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : ''
    };

    console.log('Form data being set:', formDataToSet);
    setFormData(formDataToSet);
    setEditingCoupon(coupon);
    setShowCreateForm(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">Manage discount coupons and promotional codes</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCoupon(null);
            setShowCreateForm(true);
          }}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalCoupons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Coupons</p>
                <p className="text-lg font-semibold text-gray-900">{stats.activeCoupons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-lg font-semibold text-gray-900">{stats.expiredCoupons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Uses</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalUsages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Discount</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalDiscountGiven)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
              />
            </div>
          </div>

          <select
            value={filterActive === null ? '' : filterActive.toString()}
            onChange={(e) => setFilterActive(e.target.value === '' ? null : e.target.value === 'true')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
          >
            <option value="">All Types</option>
            <option value="Percentage">Percentage</option>
            <option value="FixedAmount">Fixed Amount</option>
            <option value="FreeShipping">Free Shipping</option>
          </select>
        </div>
      </div>

      {/* Coupon List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No coupons found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-mono font-medium text-gray-900">{coupon.code}</span>
                        {coupon.isFirstOrderOnly && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            First Order
                          </span>
                        )}
                        {coupon.isUserSpecific && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Users className="h-3 w-3 mr-1" />
                            User Specific
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{coupon.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {coupon.type === 'Percentage' ? (
                          <Percent className="h-4 w-4 text-green-600 mr-1" />
                        ) : coupon.type === 'FixedAmount' ? (
                          <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                        ) : (
                          <Truck className="h-4 w-4 text-purple-600 mr-1" />
                        )}
                        <span className="text-sm text-gray-900">{coupon.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {coupon.type === 'Percentage' ? `${coupon.value}%` :
                         coupon.type === 'FixedAmount' ? formatCurrency(coupon.value) :
                         'Free Shipping'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.currentTotalUses}
                        {coupon.maxTotalUses && ` / ${coupon.maxTotalUses}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        coupon.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.validUntil ? formatDate(coupon.validUntil) : 'No expiry'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(coupon)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateForm(false)}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., SAVE20"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-mono text-black"
                    />
                    {editingCoupon && (
                      <p className="text-xs text-gray-500 mt-1">
                        Note: Changing the coupon code will create a new unique identifier
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => {
                        const newType = e.target.value as 'Percentage' | 'FixedAmount' | 'FreeShipping';
                        setFormData({
                          ...formData,
                          type: newType,
                          value: newType === 'FreeShipping' ? '' : formData.value,
                          maximumDiscountAmount: newType === 'FreeShipping' ? '' : formData.maximumDiscountAmount
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="FixedAmount">Fixed Amount</option>
                      <option value="FreeShipping">Free Shipping</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 20% off your order"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.type !== 'FreeShipping' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value * {formData.type === 'Percentage' ? '(%)' : '($)'}
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        placeholder={formData.type === 'Percentage' ? '20' : '10.00'}
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Order Amount ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="25.00"
                      value={formData.minimumOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                    />
                  </div>

                  {formData.type !== 'FreeShipping' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Discount ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="50.00"
                        value={formData.maximumDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maximumDiscountAmount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Total Uses
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="100"
                      value={formData.maxTotalUses}
                      onChange={(e) => setFormData({ ...formData, maxTotalUses: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Uses Per User
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.maxUsesPerUser}
                      onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From
                    </label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
                    />
                  </div>
                </div>

                {/* User Targeting Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-6 mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isUserSpecific}
                        onChange={(e) => setFormData({
                          ...formData,
                          isUserSpecific: e.target.checked,
                          allowedUserEmails: e.target.checked ? formData.allowedUserEmails : ''
                        })}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 font-medium">Target Specific Users</span>
                    </label>
                  </div>

                  {formData.isUserSpecific && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Allowed User Emails
                      </label>
                      <textarea
                        placeholder="Enter email addresses (one per line or comma-separated)&#10;example@email.com&#10;user@domain.com"
                        value={formData.allowedUserEmails}
                        onChange={(e) => setFormData({ ...formData, allowedUserEmails: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black resize-vertical"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter email addresses separated by commas or new lines. Only these users will be able to use this coupon.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFirstOrderOnly}
                      onChange={(e) => setFormData({ ...formData, isFirstOrderOnly: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">First order only</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingCoupon(null);
                      resetForm();
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {saving
                      ? (editingCoupon ? 'Updating...' : 'Creating...')
                      : (editingCoupon ? 'Update Coupon' : 'Create Coupon')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
