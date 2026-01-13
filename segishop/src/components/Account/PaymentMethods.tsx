'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  customerPaymentMethodService,
  CustomerPaymentMethod,
  CreateCustomerPaymentMethod,
  UpdateCustomerPaymentMethod
} from '@/services/customerPaymentMethodService';
import { PaymentMethodForm } from './PaymentMethodForm';
import { Notification, useNotification } from '@/components/ui/Notification';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/ConfirmDialog';

export const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<CustomerPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<CustomerPaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const notification = useNotification();
  const confirmDialog = useConfirmDialog();

  // Load payment methods on component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const methods = await customerPaymentMethodService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment methods');
      console.error('Error loading payment methods:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardIcon = (cardBrand?: string) => {
    // In a real app, you'd have actual card brand icons
    return <CreditCard className="h-6 w-6 text-gray-600" />;
  };

  const handleDelete = (id: number) => {
    const method = paymentMethods.find(m => m.id === id);
    const methodName = method?.displayName || 'this payment method';

    confirmDialog.showConfirm(
      'Delete Payment Method',
      `Are you sure you want to delete "${methodName}"? This action cannot be undone.`,
      async () => {
        try {
          const success = await customerPaymentMethodService.deletePaymentMethod(id);
          if (success) {
            setPaymentMethods(paymentMethods.filter(method => method.id !== id));
            notification.showSuccess('Payment method deleted successfully');
          } else {
            notification.showError('Failed to delete payment method');
          }
        } catch (err) {
          notification.showError('Failed to delete payment method', err instanceof Error ? err.message : undefined);
          throw err; // Re-throw to prevent dialog from closing
        }
      },
      {
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    );
  };

  const handleSetDefault = async (id: number) => {
    try {
      setIsProcessing(true);
      const success = await customerPaymentMethodService.setDefaultPaymentMethod(id);
      if (success) {
        setPaymentMethods(paymentMethods.map(method => ({
          ...method,
          isDefault: method.id === id
        })));
        notification.showSuccess('Default payment method updated successfully');
      } else {
        notification.showError('Failed to set default payment method');
      }
    } catch (err) {
      notification.showError('Failed to set default payment method', err instanceof Error ? err.message : undefined);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaymentMethod = async (data: CreateCustomerPaymentMethod) => {
    try {
      const newMethod = await customerPaymentMethodService.createPaymentMethod(data);
      setPaymentMethods(prev => [...prev, newMethod]);
      notification.showSuccess('Payment method added successfully');
      setIsFormOpen(false);
    } catch (err) {
      notification.showError('Failed to add payment method', err instanceof Error ? err.message : undefined);
      throw err; // Re-throw to let form handle it
    }
  };

  const handleUpdatePaymentMethod = async (data: UpdateCustomerPaymentMethod) => {
    if (!editingMethod) return;

    try {
      const updatedMethod = await customerPaymentMethodService.updatePaymentMethod(editingMethod.id, data);
      if (updatedMethod) {
        setPaymentMethods(prev => prev.map(method =>
          method.id === editingMethod.id ? updatedMethod : method
        ));
        notification.showSuccess('Payment method updated successfully');
        setIsFormOpen(false);
        setEditingMethod(null);
      } else {
        notification.showError('Failed to update payment method');
      }
    } catch (err) {
      notification.showError('Failed to update payment method', err instanceof Error ? err.message : undefined);
      throw err; // Re-throw to let form handle it
    }
  };

  const handleFormSubmit = async (data: CreateCustomerPaymentMethod | UpdateCustomerPaymentMethod) => {
    if (editingMethod) {
      await handleUpdatePaymentMethod(data as UpdateCustomerPaymentMethod);
    } else {
      await handleCreatePaymentMethod(data as CreateCustomerPaymentMethod);
    }
  };

  const openAddForm = () => {
    setEditingMethod(null);
    setIsFormOpen(true);
  };

  const openEditForm = (method: CustomerPaymentMethod) => {
    setEditingMethod(method);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMethod(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <button
          onClick={openAddForm}
          disabled={isProcessing}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-blue-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Secure Payment Processing</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and securely stored. We never store your full card details.
            </p>
          </div>
        </div>
      </div>



      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-3 text-gray-600">Loading payment methods...</span>
        </div>
      )}

      {/* Payment Methods List */}
      {!isLoading && (
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
              <p className="text-gray-500 mb-4">Add a payment method to make checkout faster and easier.</p>
              <button
                onClick={openAddForm}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Payment Method
              </button>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {getCardIcon(method.cardBrand)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{method.displayName}</h3>
                        {method.isDefault && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-orange-600 bg-orange-50 border border-orange-200">
                            Default
                          </span>
                        )}
                      </div>
                      {method.last4Digits && (
                        <p className="text-gray-600">**** **** **** {method.last4Digits}</p>
                      )}
                      {method.cardBrand && (
                        <p className="text-sm text-gray-500">{method.cardBrand}</p>
                      )}
                      {method.expiryMonth && method.expiryYear && (
                        <p className="text-sm text-gray-500">Expires {method.expiryMonth}/{method.expiryYear}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditForm(method)}
                      disabled={isProcessing}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit payment method"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete payment method"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    disabled={isProcessing}
                    className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Setting...' : 'Set as default'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Payment Method Form */}
      <PaymentMethodForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        editingMethod={editingMethod}
        isLoading={isProcessing}
      />

      {/* Notification */}
      <Notification
        type={notification.notification.type}
        title={notification.notification.title}
        message={notification.notification.message}
        isVisible={notification.notification.isVisible}
        onClose={notification.hideNotification}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.dialog.isOpen}
        onClose={confirmDialog.hideConfirm}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.dialog.title}
        message={confirmDialog.dialog.message}
        confirmText={confirmDialog.dialog.confirmText}
        cancelText={confirmDialog.dialog.cancelText}
        type={confirmDialog.dialog.type}
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
};
