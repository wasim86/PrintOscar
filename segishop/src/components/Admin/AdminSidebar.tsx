'use client';

import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Filter,
  Sliders,
  Truck,
  Tag,
  MessageSquare
  , Megaphone
  , MapPin
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const menuItems = [
  {
    id: 'content-management',
    label: 'Content Management',
    icon: LayoutDashboard,
    description: 'CMS for pages'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & metrics'
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    description: 'Manage orders'
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    description: 'Product catalog'
  },
  {
    id: 'filters',
    label: 'Filters',
    icon: Filter,
    description: 'Product filters'
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: Sliders,
    description: 'Product configurations'
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: Truck,
    description: 'Shipping management'
  },
  {
    id: 'coupons',
    label: 'Coupons',
    icon: Tag,
    description: 'Promo codes & discounts'
  },
  {
    id: 'users',
    label: 'Customers',
    icon: Users,
    description: 'User management'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Reports & insights'
  },
  {
    id: 'payment-settings',
    label: 'Payment Settings',
    icon: TrendingUp,
    description: 'Stripe & PayPal'
  },
  {
    id: 'social-integrations',
    label: 'Social Integrations',
    icon: LayoutDashboard,
    description: 'YouTube, Instagram, TikTok'
  },
  {
    id: 'site-banner',
    label: 'Site Banner',
    icon: Megaphone,
    description: 'Announcement bar'
  },
  {
    id: 'contact-submissions',
    label: 'Contact Submissions',
    icon: MessageSquare,
    description: 'Manage contact forms'
  },
  {
    id: 'handmade-inquiries',
    label: 'Handmade Inquiries',
    icon: Package,
    description: 'Custom product requests'
  }
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose
}) => {
  const { admin, logout } = useAdminAuth();

  // If no admin data, return null or loading state
  if (!admin) {
    return null;
  }

  // Create user object from admin data
  const user = {
    id: admin.id.toString(),
    name: `${admin.firstName} ${admin.lastName}`,
    email: admin.email,
    role: admin.role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.firstName + ' ' + admin.lastName)}&background=f97316&color=fff&size=40`
  };
  const handleMenuItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close mobile sidebar when item is clicked
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white border-r border-gray-200 shadow-sm transition-all duration-300 h-screen fixed left-0 top-0 z-50
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen
          ? 'translate-x-0'
          : '-translate-x-full lg:translate-x-0'
        }
        overflow-y-auto
      `}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-gray-900">PrintOscar Admin</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center text-left rounded-lg transition-colors group ${
                    isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} ${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'} ${
                    isCollapsed ? '' : 'mr-3'
                  }`} />
                  {!isCollapsed && (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                      {(item as any).badge && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {(item as any).badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-gray-200`}>
        {/* Back to Site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center text-left rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-2 ${
            isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'
          }`}
        >
          <Home className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} text-gray-400 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && (
            <div>
              <div className="font-medium">Back to Site</div>
              <div className="text-xs text-gray-500">View customer site</div>
            </div>
          )}
        </a>
        
        {/* Sign Out */}
        <button onClick={logout} className={`w-full flex items-center text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
          isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2.5'
        }`}>
          <LogOut className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && (
            <div>
              <div className="font-medium">Sign Out</div>
              <div className="text-xs text-red-400">End admin session</div>
            </div>
          )}
        </button>
      </div>
    </div>
    </>
  );
};
