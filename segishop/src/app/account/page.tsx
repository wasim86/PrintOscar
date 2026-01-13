'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { AccountSidebar } from '@/components/Account/AccountSidebar';
import { OrderHistory } from '@/components/Account/OrderHistory';
import { AddressBook } from '@/components/Account/AddressBook';
import { AddressBookManager } from '@/components/Account/AddressBookManager';
import { PaymentMethods } from '@/components/Account/PaymentMethods';
import { AccountDetails } from '@/components/Account/AccountDetails';
import { EditProfile } from '@/components/Account/EditProfile';
import { PasswordChange } from '@/components/Account/PasswordChange';



export default function AccountPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('account-details');
  const [currentView, setCurrentView] = useState<'main' | 'edit-profile' | 'change-password'>('main');

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  const handleEditProfile = () => {
    setCurrentView('edit-profile');
  };

  const handleChangePassword = () => {
    setCurrentView('change-password');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleProfileUpdated = () => {
    // Refresh the account details view
    setCurrentView('main');
  };

  const renderCurrentView = () => {
    if (currentView === 'edit-profile') {
      return <EditProfile onBack={handleBackToMain} onProfileUpdated={handleProfileUpdated} />;
    }

    if (currentView === 'change-password') {
      return <PasswordChange onBack={handleBackToMain} />;
    }

    // Main view - render active section
    switch (activeSection) {
      case 'account-details':
        return <AccountDetails onEditProfile={handleEditProfile} onChangePassword={handleChangePassword} />;
      case 'orders':
        return <OrderHistory />;
      case 'addresses':
        return <AddressBookManager />;
      case 'payment-methods':
        return <PaymentMethods />;
      default:
        return <AccountDetails onEditProfile={handleEditProfile} onChangePassword={handleChangePassword} />;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account settings and view your order history</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <AccountSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {renderCurrentView()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
