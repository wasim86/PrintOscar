'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';
import { OrderManagement } from '@/components/Admin/OrderManagement';
import { ProductManagement } from '@/components/Admin/ProductManagement';
import { UserManagement } from '@/components/Admin/UserManagement';
import { AnalyticsDashboard } from '@/components/Admin/AnalyticsDashboard';
import ConfigurationManagement from '@/components/Admin/ConfigurationManagement';
import { ShippingManagement } from '@/components/Admin/ShippingManagement';
import { AdminHeader } from '@/components/Admin/AdminHeader';
import FilterManagement from '@/components/Admin/FilterManagement';
import CouponManagement from '@/components/Admin/CouponManagement';
import { PaymentGatewaySettings } from '@/components/Admin/PaymentGatewaySettings';
import { SiteBannerSettings } from '@/components/Admin/SiteBannerSettings';
import { ShopLocalSettings } from '@/components/Admin/ShopLocalSettings';
import AdminAuthGuard from '@/components/Admin/AdminAuthGuard';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { ContactSubmissionsManagement } from '@/components/Admin/ContactSubmissionsManagement';
import { HandmadeInquiriesManagement } from '@/components/Admin/HandmadeInquiriesManagement';
import ContentManagement from '@/components/Admin/ContentManagement';
import SocialIntegrations from '@/components/Admin/SocialIntegrations';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { admin } = useAdminAuth();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard onSectionChange={setActiveSection} />;
      case 'orders':
        return <OrderManagement />;
      case 'products':
        return <ProductManagement />;
      case 'filters':
        return <FilterManagement />;
      case 'configuration':
        return <ConfigurationManagement />;
      case 'shipping':
        return <ShippingManagement />;
      case 'coupons':
        return <CouponManagement />;
      case 'users':
        return <UserManagement />;
      case 'payment-settings':
        return <PaymentGatewaySettings />;
      case 'site-banner':
        return <SiteBannerSettings />;
      case 'content-management':
        return <ContentManagement />;
      case 'social-integrations':
        return <SocialIntegrations />;
      case 'shop-local':
        return <ShopLocalSettings />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'contact-submissions':
        return <ContactSubmissionsManagement />;
      case 'handmade-inquiries':
        return <HandmadeInquiriesManagement />;
      default:
        return <AdminDashboard onSectionChange={setActiveSection} />;
    }
  };



  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className={`flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
            {/* Header */}
            <AdminHeader
              activeSection={activeSection}
              onToggleSidebar={() => {
                // On mobile, toggle mobile sidebar; on desktop, toggle collapse
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setIsMobileSidebarOpen(!isMobileSidebarOpen);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
            />

          {/* Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
