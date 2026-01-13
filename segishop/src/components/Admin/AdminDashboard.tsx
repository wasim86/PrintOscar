'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Loader2,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';

import { API_BASE_URL } from '@/services/config';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange?: number;
  ordersChange?: number;
  customersChange?: number;
  productsChange?: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  imageUrl?: string;
}

interface AdminDashboardProps {
  onSectionChange?: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSectionChange }) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('printoscar_admin_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Fetch consolidated dashboard data
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();

      // Set dashboard stats
      const stats: DashboardStats = {
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        totalCustomers: data.totalCustomers || 0,
        totalProducts: data.totalProducts || 0,
        revenueChange: data.revenueChange || 0,
        ordersChange: data.ordersChange || 0,
        customersChange: data.customersChange || 0,
        productsChange: data.productsChange || 0
      };

      setDashboardStats(stats);
      setRecentOrders(data.recentOrders || []);
      setTopProducts(data.topProducts || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Create stats array from fetched data
  const stats = dashboardStats ? [
    {
      title: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: dashboardStats.revenueChange ? `${dashboardStats.revenueChange > 0 ? '+' : ''}${dashboardStats.revenueChange.toFixed(1)}%` : 'N/A',
      changeType: (dashboardStats.revenueChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Orders',
      value: dashboardStats.totalOrders.toLocaleString(),
      change: dashboardStats.ordersChange ? `${dashboardStats.ordersChange > 0 ? '+' : ''}${dashboardStats.ordersChange.toFixed(1)}%` : 'N/A',
      changeType: (dashboardStats.ordersChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Customers',
      value: dashboardStats.totalCustomers.toLocaleString(),
      change: dashboardStats.customersChange ? `${dashboardStats.customersChange > 0 ? '+' : ''}${dashboardStats.customersChange.toFixed(1)}%` : 'N/A',
      changeType: (dashboardStats.customersChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Products',
      value: dashboardStats.totalProducts.toLocaleString(),
      change: dashboardStats.productsChange ? `${dashboardStats.productsChange > 0 ? '+' : ''}${dashboardStats.productsChange.toFixed(1)}%` : 'N/A',
      changeType: (dashboardStats.productsChange || 0) >= 0 ? 'increase' : 'decrease',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, Admin!</h2>
            <p className="text-orange-100 text-sm sm:text-base">
              Here's what's happening with your store today.
            </p>
            <div className="mt-3 sm:mt-4 flex items-center text-orange-100">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">{new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 backdrop-blur-sm text-sm sm:text-base w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const getNavigationSection = (title: string) => {
            switch (title) {
              case 'Total Revenue':
              case 'Orders':
                return 'orders';
              case 'Customers':
                return 'users';
              case 'Products':
                return 'products';
              default:
                return 'dashboard';
            }
          };

          return (
            <div
              key={stat.title}
              onClick={() => onSectionChange && onSectionChange(getNavigationSection(stat.title))}
              className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-orange-600 transition-colors">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button
                onClick={() => onSectionChange && onSectionChange('orders')}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center transition-colors"
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onSectionChange && onSectionChange('orders')}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-100 transition-colors">
                      <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button
                onClick={() => onSectionChange && onSectionChange('products')}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center transition-colors"
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => onSectionChange && onSectionChange('products')}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-all cursor-pointer group border border-transparent"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageUrl || '/api/placeholder/60/60'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.revenue.toFixed(2)}</p>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">#{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => onSectionChange && onSectionChange('products')}
            className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group w-full"
          >
            <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-3 group-hover:scale-110 transition-transform flex-shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Add Product</p>
              <p className="text-xs sm:text-sm text-gray-500">Create new product</p>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('orders')}
            className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group w-full"
          >
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-3 group-hover:scale-110 transition-transform flex-shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Manage Orders</p>
              <p className="text-xs sm:text-sm text-gray-500">View & process orders</p>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('users')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Users className="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View Customers</p>
              <p className="text-sm text-gray-500">Customer management</p>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('analytics')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <BarChart3 className="h-8 w-8 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-sm text-gray-500">Analytics & insights</p>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('coupons')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <DollarSign className="h-8 w-8 text-red-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Coupons</p>
              <p className="text-sm text-gray-500">Discounts & promotions</p>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('shipping')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Package className="h-8 w-8 text-indigo-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Shipping Settings</p>
              <p className="text-sm text-gray-500">Configure shipping</p>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('filters')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Settings className="h-8 w-8 text-gray-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Filters</p>
              <p className="text-sm text-gray-500">Manage Filters</p>
            </div>
          </button>

          <button
            onClick={() => onSectionChange && onSectionChange('configuration')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Settings className="h-8 w-8 text-teal-600 mr-3 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Configuration</p>
              <p className="text-sm text-gray-500">Product Configuration</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
