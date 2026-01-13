'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/services/config';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  LogOut,
  Loader2
} from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  role: string;
  createdAt: string;
}

interface AccountSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    id: 'account-details',
    label: 'Account Details',
    icon: User,
    description: 'Personal information'
  },
  {
    id: 'orders',
    label: 'Order History',
    icon: Package,
    description: 'View your orders'
  },
  {
    id: 'addresses',
    label: 'Address Book',
    icon: MapPin,
    description: 'Manage addresses'
  },
  {
    id: 'payment-methods',
    label: 'Payment Methods',
    icon: CreditCard,
    description: 'Saved payment options'
  }
];

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('printoscar_token');
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/customer/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setUserProfile(data.user);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* User Info Header */}
      <div className="p-6 border-b border-gray-200">
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ) : userProfile ? (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{`${userProfile.firstName} ${userProfile.lastName}`}</h3>
              <p className="text-sm text-gray-500">{userProfile.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Guest User</h3>
              <p className="text-sm text-gray-500">Please log in</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Sign Out Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full flex items-center px-3 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            <div>
              <div className="font-medium">Sign Out</div>
              <div className="text-xs text-red-400">End your session</div>
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};
