'use client';

import React from 'react';
import { usePriceUtils } from '@/utils/priceUtils';


interface BulkQuantitySelectorProps {
  minQuantity: number;
  maxQuantity: number;
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
  basePrice: number;
  defaultHighlight?: string;
  className?: string;
}

export const BulkQuantitySelector: React.FC<BulkQuantitySelectorProps> = ({
  minQuantity,
  maxQuantity,
  selectedQuantity,
  onQuantityChange,
  basePrice,
  defaultHighlight,
  className = ''
}) => {
  const { convertAndFormatPrice } = usePriceUtils();
  // Generate discrete quantity options: 24, 36, 48
  const getQuantityOptions = () => {
    const options = [];
    for (let qty = minQuantity; qty <= maxQuantity; qty += 12) {
      options.push(qty);
    }
    return options;
  };

  const quantityOptions = getQuantityOptions();
  
  // Ensure selected quantity is valid
  const validSelectedQuantity = quantityOptions.includes(selectedQuantity) 
    ? selectedQuantity 
    : quantityOptions[0];

  const calculateTotalPrice = (quantity: number) => {
    return basePrice * quantity;
  };

  const calculateUnitPrice = (quantity: number) => {
    // Small bulk might have volume discounts
    const totalPrice = calculateTotalPrice(quantity);
    return totalPrice / quantity;
  };

  const handleQuantitySelect = (quantity: number) => {
    onQuantityChange(quantity);
  };



  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-base font-medium text-gray-900">Bulk Quantity</h3>
        {defaultHighlight && (
          <p className="text-sm text-gray-600 mt-1">{defaultHighlight}</p>
        )}
      </div>

      {/* Quantity Options as Cards */}
      <div className="space-y-3">
        {quantityOptions.map((quantity) => {
          const isSelected = quantity === validSelectedQuantity;
          const totalPrice = calculateTotalPrice(quantity);
          const unitPrice = calculateUnitPrice(quantity);

          return (
            <div
              key={quantity}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => handleQuantitySelect(quantity)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Radio button */}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-white bg-white'
                      : 'border-gray-400 bg-white'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    )}
                  </div>

                  <div>
                    <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {quantity} units
                    </div>
                    <div className={`text-sm ${isSelected ? 'text-orange-100' : 'text-gray-600'}`}>
                      {convertAndFormatPrice(unitPrice)} each
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {convertAndFormatPrice(totalPrice)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded border">
        <div className="text-sm text-gray-700">
          <strong>Selected:</strong> {validSelectedQuantity} units
        </div>
        <div className="text-sm text-gray-600 mt-1">
          <strong>Total:</strong> {convertAndFormatPrice(calculateTotalPrice(validSelectedQuantity))} ({convertAndFormatPrice(calculateUnitPrice(validSelectedQuantity))} each)
        </div>
      </div>
    </div>
  );
};
