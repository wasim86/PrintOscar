import React, { useState, useEffect } from 'react';
import { PaymentSummaryDto, PaymentRecordDto, RefundRequestDto, adminOrdersApi } from '../../services/admin-orders-api';

interface PaymentRecordsSectionProps {
  orderId: number;
  onRefundProcessed?: () => void;
}

const PaymentRecordsSection: React.FC<PaymentRecordsSectionProps> = ({ orderId, onRefundProcessed }) => {
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecordDto | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundNotes, setRefundNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  // Removed refundType state - only gateway refunds are supported

  useEffect(() => {
    loadPaymentSummary();
  }, [orderId]);

  const loadPaymentSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await adminOrdersApi.getOrderPaymentSummary(orderId);
      setPaymentSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment records');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundClick = (payment: PaymentRecordDto) => {
    setSelectedPayment(payment);
    setRefundAmount('');
    setRefundReason('');
    setRefundNotes('');
    setShowRefundModal(true);
  };

  const processRefund = async () => {
    if (!selectedPayment || !refundAmount || !refundReason) return;

    try {
      setProcessing(true);

      // Validate inputs before sending
      const amount = parseFloat(refundAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid refund amount');
        return;
      }

      if (amount > selectedPayment.amount) {
        alert(`Refund amount cannot exceed the original payment amount of $${selectedPayment.amount}`);
        return;
      }

      const refundRequest: RefundRequestDto = {
        orderId,
        paymentRecordId: selectedPayment.id,
        amount: amount,
        reason: refundReason.trim(),
        notes: refundNotes.trim() || undefined,
        notifyCustomer: true
      };

      console.log('Processing gateway refund with request:', refundRequest);
      console.log('Selected payment details:', selectedPayment);

      const response = await adminOrdersApi.processRefund(refundRequest);

      if (response.success) {
        setShowRefundModal(false);
        await loadPaymentSummary();
        onRefundProcessed?.();
        alert(`Gateway refund processed successfully! Refunded amount: $${response.refundedAmount}`);
      } else {
        alert(`Refund failed: ${response.message}`);
      }
    } catch (err) {
      console.error('Error processing refund:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error processing refund: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'payment': return 'text-blue-600 bg-blue-100';
      case 'refund': return 'text-red-600 bg-red-100';
      case 'partialrefund': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Records</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Records</h3>
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          <p>{error}</p>
          <button 
            onClick={loadPaymentSummary}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!paymentSummary) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Records</h3>
        <p className="text-gray-500">No payment records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Records</h3>
      
      {/* Payment Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-lg font-semibold text-green-600">{formatCurrency(paymentSummary.totalPaid)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Refunded</p>
          <p className="text-lg font-semibold text-red-600">{formatCurrency(paymentSummary.totalRefunded)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Net Amount</p>
          <p className="text-lg font-semibold text-blue-600">{formatCurrency(paymentSummary.netAmount)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Transactions</p>
          <p className="text-lg font-semibold text-gray-900">
            {paymentSummary.paymentCount + paymentSummary.refundCount}
          </p>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {[...paymentSummary.payments, ...paymentSummary.refunds]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeColor(record.paymentType)}`}>
                      {record.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(record.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {record.paymentType === 'Payment' && record.status === 'Completed' && (
                      <button
                        onClick={() => handleRefundClick(record)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Process Refund</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Original Payment: {formatCurrency(selectedPayment.amount)}</p>
                <p className="text-sm text-gray-600">Payment Method: {selectedPayment.paymentMethod}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedPayment.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="0.00"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                >
                  <option value="">Select reason</option>
                  <option value="Customer Request">Customer Request</option>
                  <option value="Order Cancelled">Order Cancelled</option>
                  <option value="Product Defective">Product Defective</option>
                  <option value="Wrong Item Shipped">Wrong Item Shipped</option>
                  <option value="Administrative Error">Administrative Error</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    ✅ This will process a real refund through {selectedPayment?.paymentMethod || 'the payment gateway'}.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={refundNotes}
                  onChange={(e) => setRefundNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={processRefund}
                  disabled={processing || !refundAmount || !refundReason}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Process Refund'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRecordsSection;
