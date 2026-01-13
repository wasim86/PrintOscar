'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Mail,
  User,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Phone
} from 'lucide-react';
import { API_BASE_URL } from '@/services/config';

interface HandmadeInquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredContact: string;
  itemType: string;
  needByDate?: string;
  shippingAddress?: string;
  dressLength?: string;
  dressColors?: string;
  totalDresses?: string;
  bagStyle?: string;
  bagSize?: string;
  bagQuantity?: string;
  funKitFill: boolean;
  customLabels: boolean;
  detailedPreferences: string;
  productLink?: string;
  referralSource?: string;
  status: string;
  quotedPrice?: number;
  estimatedCompletionDate?: string;
  isResponded: boolean;
  respondedAt?: string;
  respondedBy?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface HandmadeInquiriesResponse {
  inquiries: HandmadeInquiry[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface HandmadeInquiryStatistics {
  totalInquiries: number;
  respondedInquiries: number;
  pendingInquiries: number;
  inquiriesThisMonth: number;
  statusBreakdown: Record<string, number>;
  popularItemTypes: Record<string, number>;
  totalQuotedValue: number;
}

export const HandmadeInquiriesManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<HandmadeInquiry[]>([]);
  const [statistics, setStatistics] = useState<HandmadeInquiryStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('');
  const [respondedFilter, setRespondedFilter] = useState<string>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [selectedInquiry, setSelectedInquiry] = useState<HandmadeInquiry | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: '',
    isResponded: false,
    quotedPrice: '',
    estimatedCompletionDate: '',
    adminNotes: '',
    respondedBy: ''
  });

  const statusOptions = ['New', 'InProgress', 'Quoted', 'Accepted', 'InProduction', 'Completed', 'Cancelled'];
  const itemTypes = ['Dress', 'Bag', 'Accessory', 'Custom Design', 'Other'];

  useEffect(() => {
    fetchInquiries();
    fetchStatistics();
  }, [search, statusFilter, itemTypeFilter, respondedFilter, fromDate, toDate, currentPage]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (itemTypeFilter) params.append('itemType', itemTypeFilter);
      if (respondedFilter) params.append('isResponded', respondedFilter);
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const response = await fetch(`${API_BASE_URL}/admin/admininquiry?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('printoscar_admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch handmade inquiries');
      }

      const data: HandmadeInquiriesResponse = await response.json();
      setInquiries(data.inquiries);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/admininquiry/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('printoscar_admin_token')}`,
        },
      });

      if (response.ok) {
        const data: HandmadeInquiryStatistics = await response.json();
        setStatistics(data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (itemTypeFilter) params.append('itemType', itemTypeFilter);
      if (respondedFilter) params.append('isResponded', respondedFilter);
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const response = await fetch(`${API_BASE_URL}/admin/admininquiry/export?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('printoscar_admin_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `handmade-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const handleView = (inquiry: HandmadeInquiry) => {
    setSelectedInquiry(inquiry);
    setShowViewModal(true);
  };

  const handleEdit = (inquiry: HandmadeInquiry) => {
    setSelectedInquiry(inquiry);
    setEditForm({
      status: inquiry.status,
      isResponded: inquiry.isResponded,
      quotedPrice: inquiry.quotedPrice?.toString() || '',
      estimatedCompletionDate: inquiry.estimatedCompletionDate ? 
        new Date(inquiry.estimatedCompletionDate).toISOString().split('T')[0] : '',
      adminNotes: inquiry.adminNotes || '',
      respondedBy: inquiry.respondedBy || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedInquiry) return;

    try {
      const updateData: any = {
        status: editForm.status,
        isResponded: editForm.isResponded,
        adminNotes: editForm.adminNotes,
        respondedBy: editForm.respondedBy
      };

      if (editForm.quotedPrice) {
        updateData.quotedPrice = parseFloat(editForm.quotedPrice);
      }

      if (editForm.estimatedCompletionDate) {
        updateData.estimatedCompletionDate = editForm.estimatedCompletionDate;
      }

      const response = await fetch(`${API_BASE_URL}/admin/admininquiry/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('segishop_admin_token')}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update inquiry');
      }

      setShowEditModal(false);
      fetchInquiries();
      fetchStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/admininquiry/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('printoscar_admin_token')}`,
        },
        body: null,
      });

      if (!response.ok) {
        throw new Error('Failed to delete inquiry');
      }

      fetchInquiries();
      fetchStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'InProgress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Quoted': return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'Accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'InProduction': return <Package className="h-4 w-4 text-orange-500" />;
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Cancelled': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'InProgress': return 'bg-yellow-100 text-yellow-800';
      case 'Quoted': return 'bg-purple-100 text-purple-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'InProduction': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Handmade Inquiries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage custom product inquiries and quotes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Inquiries</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.totalInquiries}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Responded</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.respondedInquiries}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{statistics.pendingInquiries}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Quoted</dt>
                    <dd className="text-lg font-medium text-gray-900">${statistics.totalQuotedValue.toFixed(2)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inquiries..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
            <select
              value={itemTypeFilter}
              onChange={(e) => setItemTypeFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
            >
              <option value="">All Types</option>
              {itemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Response Status</label>
            <select
              value={respondedFilter}
              onChange={(e) => setRespondedFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
            >
              <option value="">All</option>
              <option value="true">Responded</option>
              <option value="false">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Inquiries ({totalCount})
            </h3>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No handmade inquiries match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                            <div className="text-sm text-gray-500">{inquiry.email}</div>
                            <div className="text-xs text-gray-400">
                              {inquiry.countryCode} {inquiry.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inquiry.itemType}</div>
                        {inquiry.needByDate && (
                          <div className="text-xs text-gray-500">
                            Need by: {new Date(inquiry.needByDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(inquiry.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                        {inquiry.isResponded && (
                          <div className="text-xs text-green-600 mt-1">✓ Responded</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inquiry.quotedPrice ? `$${inquiry.quotedPrice.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(inquiry)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(inquiry)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(inquiry.id)}
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
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalCount)}
                </span>{' '}
                of <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Handmade Inquiry Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.countryCode} {selectedInquiry.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Contact</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.preferredContact}</p>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Product Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Item Type</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.itemType}</p>
                    </div>
                    {selectedInquiry.needByDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Need By Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedInquiry.needByDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.dressLength && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dress Length</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedInquiry.dressLength}</p>
                      </div>
                    )}
                    {selectedInquiry.dressColors && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dress Colors</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedInquiry.dressColors}</p>
                      </div>
                    )}
                    {selectedInquiry.totalDresses && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Dresses</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedInquiry.totalDresses}</p>
                      </div>
                    )}
                    {selectedInquiry.bagStyle && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bag Style</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedInquiry.bagStyle}</p>
                      </div>
                    )}
                    {selectedInquiry.bagSize && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bag Size</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedInquiry.bagSize}</p>
                      </div>
                    )}
                    {selectedInquiry.bagQuantity && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bag Quantity</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedInquiry.bagQuantity}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fun Kit Fill</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.funKitFill ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Labels</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.customLabels ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Detailed Preferences</label>
                  <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInquiry.detailedPreferences}</p>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedInquiry.productLink && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Link</label>
                      <p className="mt-1 text-sm text-blue-600">
                        <a href={selectedInquiry.productLink} target="_blank" rel="noopener noreferrer">
                          {selectedInquiry.productLink}
                        </a>
                      </p>
                    </div>
                  )}
                  {selectedInquiry.referralSource && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Referral Source</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.referralSource}</p>
                    </div>
                  )}
                  {selectedInquiry.shippingAddress && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInquiry.shippingAddress}</p>
                    </div>
                  )}
                </div>

                {/* Status and Business Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Status & Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1 flex items-center">
                        {getStatusIcon(selectedInquiry.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                          {selectedInquiry.status}
                        </span>
                      </div>
                    </div>
                    {selectedInquiry.quotedPrice && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quoted Price</label>
                        <p className="mt-1 text-sm text-gray-900">${selectedInquiry.quotedPrice.toFixed(2)}</p>
                      </div>
                    )}
                    {selectedInquiry.estimatedCompletionDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estimated Completion</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedInquiry.estimatedCompletionDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedInquiry.isResponded && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Response Info</label>
                    <div className="mt-1 p-3 border border-green-300 rounded-md bg-green-50">
                      <p className="text-sm text-green-900">
                        Responded by {selectedInquiry.respondedBy} on{' '}
                        {selectedInquiry.respondedAt && new Date(selectedInquiry.respondedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {selectedInquiry.adminNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                    <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInquiry.adminNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedInquiry);
                  }}
                  className="px-4 py-2 bg-orange-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-orange-700"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Handmade Inquiry</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quoted Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.quotedPrice}
                      onChange={(e) => setEditForm({ ...editForm, quotedPrice: e.target.value })}
                      placeholder="0.00"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Completion Date</label>
                    <input
                      type="date"
                      value={editForm.estimatedCompletionDate}
                      onChange={(e) => setEditForm({ ...editForm, estimatedCompletionDate: e.target.value })}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Response Status</label>
                    <div className="mt-1">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.isResponded}
                          onChange={(e) => setEditForm({ ...editForm, isResponded: e.target.checked })}
                          className="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">Mark as responded</span>
                      </label>
                    </div>
                  </div>
                </div>

                {editForm.isResponded && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Responded By</label>
                    <input
                      type="text"
                      value={editForm.respondedBy}
                      onChange={(e) => setEditForm({ ...editForm, respondedBy: e.target.value })}
                      placeholder="Enter your name"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                  <textarea
                    value={editForm.adminNotes}
                    onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                    rows={4}
                    placeholder="Add internal notes about this inquiry..."
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-orange-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-orange-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
