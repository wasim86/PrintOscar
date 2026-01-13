'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AdminUsersApi, AdminUser, AdminUsersSearchParams } from '@/services/admin-users-api';
import { UserForm } from './UserForm';

interface UserManagementState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchParams: AdminUsersSearchParams;
}

export const UserManagement: React.FC = () => {
  const [state, setState] = useState<UserManagementState>({
    users: [],
    loading: true,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    searchParams: {
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  });

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [state.searchParams]);

  const loadUsers = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await AdminUsersApi.getUsers(state.searchParams);

      if (response.success) {
        setState(prev => ({
          ...prev,
          users: response.users,
          totalCount: response.totalCount,
          currentPage: response.page,
          totalPages: response.totalPages,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to load users',
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setState(prev => ({
        ...prev,
        error: 'An error occurred while loading users',
        loading: false
      }));
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setState(prev => ({
      ...prev,
      searchParams: {
        ...prev.searchParams,
        searchTerm: term || undefined,
        page: 1
      }
    }));
  };

  const handleFilterChange = (filters: Partial<AdminUsersSearchParams>) => {
    setState(prev => ({
      ...prev,
      searchParams: {
        ...prev.searchParams,
        ...filters,
        page: 1
      }
    }));
  };

  const handlePageChange = (page: number) => {
    setState(prev => ({
      ...prev,
      searchParams: {
        ...prev.searchParams,
        page
      }
    }));
  };

  const handleSort = (sortBy: string) => {
    const sortOrder = state.searchParams.sortBy === sortBy && state.searchParams.sortOrder === 'asc' ? 'desc' : 'asc';
    setState(prev => ({
      ...prev,
      searchParams: {
        ...prev.searchParams,
        sortBy,
        sortOrder
      }
    }));
  };

  const handleCreateUser = () => {
    setEditingUser(undefined);
    setShowUserForm(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await AdminUsersApi.deleteUser(userId);
      if (response.success) {
        loadUsers();
      } else {
        alert(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
  };

  const handleUserSaved = (user: AdminUser, message?: string) => {
    loadUsers();
    if (message && message.includes('Generated password:')) {
      // Extract the password from the message
      const passwordMatch = message.match(/Generated password: (.+)/);
      if (passwordMatch) {
        const password = passwordMatch[1];
        // Create a better notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md';
        notification.innerHTML = `
          <div class="font-semibold">User Created Successfully!</div>
          <div class="mt-2">
            <strong>Generated Password:</strong>
            <span class="font-mono bg-green-600 px-2 py-1 rounded">${password}</span>
          </div>
          <div class="text-sm mt-2 opacity-90">Please save this password - it won't be shown again.</div>
          <button onclick="this.parentElement.remove()" class="absolute top-2 right-2 text-white hover:text-gray-200">×</button>
        `;
        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 10000);
      }
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === state.users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(state.users.map(user => user.id));
    }
  };

  const getStatusBadge = (user: AdminUser) => {
    if (user.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </span>
      );
    }
  };

  const getRoleBadge = (role: string) => {
    const colorClass = AdminUsersApi.getRoleColor(role);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage customer accounts and relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadUsers()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                showFilters
                  ? 'border-orange-300 text-orange-700 bg-orange-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedUsers.length} selected
                </span>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={state.searchParams.role || ''}
                  onChange={(e) => handleFilterChange({ role: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                >
                  <option value="">All Roles</option>
                  <option value="Customer">Customer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={state.searchParams.isActive === undefined ? '' : state.searchParams.isActive.toString()}
                  onChange={(e) => handleFilterChange({
                    isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={state.searchParams.gender || ''}
                  onChange={(e) => handleFilterChange({ gender: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                <input
                  type="date"
                  value={state.searchParams.createdFrom || ''}
                  onChange={(e) => handleFilterChange({ createdFrom: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setState(prev => ({
                    ...prev,
                    searchParams: {
                      page: 1,
                      pageSize: 20,
                      sortBy: 'createdAt',
                      sortOrder: 'desc'
                    }
                  }));
                  setSearchTerm('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {state.loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            <span className="ml-2 text-gray-600">Loading customers...</span>
          </div>
        ) : state.error ? (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-red-600">{state.error}</span>
          </div>
        ) : state.users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || Object.keys(state.searchParams).some(key =>
                key !== 'page' && key !== 'pageSize' && key !== 'sortBy' && key !== 'sortOrder' &&
                state.searchParams[key as keyof AdminUsersSearchParams]
              )
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first customer'
              }
            </p>
            <button
              onClick={handleCreateUser}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === state.users.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('firstName')}
                    >
                      Customer
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      Email
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role')}
                    >
                      Role
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('isActive')}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalOrders')}
                    >
                      Orders
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalSpent')}
                    >
                      Total Spent
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      Joined
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('lastLoginAt')}
                    >
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-orange-600">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                          {user.totalOrders}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          {AdminUsersApi.formatCurrency(user.totalSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {AdminUsersApi.formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {user.lastLoginAt ? (
                            <span title={AdminUsersApi.formatDateTime(user.lastLoginAt)}>
                              {AdminUsersApi.formatDate(user.lastLoginAt)}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Never</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600" title="More actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {state.totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(state.currentPage - 1)}
                      disabled={state.currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(state.currentPage + 1)}
                      disabled={state.currentPage === state.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {(state.currentPage - 1) * (state.searchParams.pageSize || 20) + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(state.currentPage * (state.searchParams.pageSize || 20), state.totalCount)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{state.totalCount}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(state.currentPage - 1)}
                          disabled={state.currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, state.totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(state.totalPages - 4, state.currentPage - 2)) + i;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === state.currentPage
                                  ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => handlePageChange(state.currentPage + 1)}
                          disabled={state.currentPage === state.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          isOpen={showUserForm}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(undefined);
          }}
          onSave={handleUserSaved}
          mode={editingUser ? 'edit' : 'create'}
        />
      )}
    </div>
  );
};
