'use client';

import React from 'react';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { usePriceUtils } from '@/utils/priceUtils';
import { useCurrency } from '@/contexts/CurrencyContext';
import { InvoiceData } from '@/services/invoice-api';

interface InvoiceDisplayProps {
  invoice: InvoiceData;
  className?: string;
}

export const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({
  invoice,
  className = ''
}) => {
  const { currentCurrency } = useCurrency();
  const { convertAndFormatPrice } = usePriceUtils();

  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="company-info">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            {invoice.company.name}
          </h1>
          <div className="text-sm text-gray-600">
            <div>{invoice.company.address}</div>
            <div>{invoice.company.city}, {invoice.company.state} {invoice.company.zipCode}</div>
            <div>{invoice.company.country}</div>
            <div>Phone: {invoice.company.phone}</div>
            <div>Email: {invoice.company.email}</div>
            {invoice.company.website && <div>Website: {invoice.company.website}</div>}
          </div>
        </div>
        
        <div className="invoice-info text-right">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">INVOICE</h2>
          <div className="text-sm space-y-1">
            <div><strong>Invoice #:</strong> {invoice.invoiceNumber}</div>
            <div><strong>Invoice Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</div>
            <div><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
            <div><strong>Order #:</strong> {invoice.orderNumber}</div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-gray-700 mb-3">Bill To:</h3>
          <div className="text-sm">
            <div className="font-medium">{invoice.billingAddress.name}</div>
            <div>{invoice.billingAddress.address}</div>
            <div>{invoice.billingAddress.city}, {invoice.billingAddress.state} {invoice.billingAddress.zipCode}</div>
            <div>{invoice.billingAddress.country}</div>
            {invoice.billingAddress.phone && <div>Phone: {invoice.billingAddress.phone}</div>}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-gray-700 mb-3">Ship To:</h3>
          <div className="text-sm">
            <div className="font-medium">{invoice.shippingAddress.name}</div>
            <div>{invoice.shippingAddress.address}</div>
            <div>{invoice.shippingAddress.city}, {invoice.shippingAddress.state} {invoice.shippingAddress.zipCode}</div>
            <div>{invoice.shippingAddress.country}</div>
            {invoice.shippingAddress.phone && <div>Phone: {invoice.shippingAddress.phone}</div>}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Item</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">SKU</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-700">Qty</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-700">Unit Price</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="border border-gray-300 px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                  )}
                  {item.productAttributes && (
                    <div className="text-sm text-gray-600 mt-1">{item.productAttributes}</div>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">{item.sku || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  <SimplePriceDisplay price={item.unitPrice} size="sm" />
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  <SimplePriceDisplay price={item.totalPrice} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-right font-medium">Subtotal:</td>
                <td className="py-2 text-right pl-4">
                  <SimplePriceDisplay price={invoice.subTotal} size="sm" />
                </td>
              </tr>
              
              {invoice.shippingAmount > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-right font-medium">Shipping:</td>
                  <td className="py-2 text-right pl-4">
                    <SimplePriceDisplay price={invoice.shippingAmount} size="sm" />
                  </td>
                </tr>
              )}
              
              {invoice.taxAmount > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-right font-medium">Tax:</td>
                  <td className="py-2 text-right pl-4">
                    <SimplePriceDisplay price={invoice.taxAmount} size="sm" />
                  </td>
                </tr>
              )}
              
              {invoice.discountAmount > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-right font-medium text-green-600">Discount:</td>
                  <td className="py-2 text-right pl-4 text-green-600">
                    -<SimplePriceDisplay price={invoice.discountAmount} size="sm" className="inline" />
                  </td>
                </tr>
              )}
              
              {invoice.couponDiscountAmount > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-right font-medium text-green-600">Coupon Discount:</td>
                  <td className="py-2 text-right pl-4 text-green-600">
                    -<SimplePriceDisplay price={invoice.couponDiscountAmount} size="sm" className="inline" />
                  </td>
                </tr>
              )}
              
              <tr className="border-t-2 border-gray-400">
                <td className="py-3 text-right font-bold text-lg">Total:</td>
                <td className="py-3 text-right pl-4 font-bold text-lg">
                  <SimplePriceDisplay price={invoice.totalAmount} size="lg" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2"><strong>Payment Status:</strong> {invoice.paymentStatus}</div>
            <div><strong>Payment Method:</strong> {invoice.paymentMethod}</div>
          </div>
          
          <div className="text-sm text-gray-600">
            <div className="mb-2"><strong>Currency:</strong> {currentCurrency.name} ({currentCurrency.code})</div>
            <div className="text-xs">
              * All amounts displayed in {currentCurrency.code} using current exchange rates
            </div>
          </div>
        </div>
        
        {invoice.terms && (
          <div className="mt-6">
            <strong>Terms:</strong> {invoice.terms}
          </div>
        )}
        
        {invoice.notes && (
          <div className="mt-4">
            <strong>Notes:</strong> {invoice.notes}
          </div>
        )}
        
        <div className="text-center mt-8 text-gray-600">
          Thank you for your business!
        </div>
      </div>
    </div>
  );
};

export default InvoiceDisplay;
