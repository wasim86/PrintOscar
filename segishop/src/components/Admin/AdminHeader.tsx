'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import ProfileSettingsModal from './ProfileSettingsModal';
import { AdminProfile } from '@/services/admin-profile-api';
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Home,
  ChevronDown
} from 'lucide-react';

interface AdminHeaderProps {
  activeSection: string;
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeSection,
  onToggleSidebar
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { admin, logout, refreshProfile } = useAdminAuth();

  const handleProfileUpdate = async (updatedProfile: AdminProfile) => {
    try {
      // Refresh the admin profile in context to update all components
      await refreshProfile();
      console.log('Profile updated and context refreshed:', updatedProfile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  // If no admin data, show loading or return null
  if (!admin) {
    return (
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </header>
    );
  }

  // Create user object from admin data
  const user = {
    id: admin.id.toString(),
    name: `${admin.firstName} ${admin.lastName}`,
    email: admin.email,
    role: admin.role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.firstName + ' ' + admin.lastName)}&background=f97316&color=fff&size=32`
  };

  const getSectionTitle = (section: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      orders: 'Order Management',
      products: 'Product Management',
      filters: 'Filter Management',
      configuration: 'Configuration Management',
      shipping: 'Shipping Management',
      inventory: 'Inventory Management',
      users: 'Customer Management',
      analytics: 'Analytics & Reports',
      content: 'Content Management',
      settings: 'Settings'
    };
    return titles[section] || 'Admin Panel';
  };



  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{getSectionTitle(activeSection)}</h1>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage your PrintOscar Shop</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Quick Actions */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden sm:flex"
          title="View Site"
        >
          <Home className="h-5 w-5 text-gray-600" />
        </a>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              
              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User className="h-4 w-4 mr-3" />
                Profile Settings
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdate={handleProfileUpdate}
      />
    </header>
  );
};
