'use client';

import React from 'react';
import { ProductQuantitySet } from '@/services/simple-products-api';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { usePriceUtils } from '@/utils/priceUtils';

interface QuantitySetSelectorProps {
  quantitySets: ProductQuantitySet[];
  selectedQuantitySetId: number | null;
  onQuantitySetChange: (quantitySetId: number) => void;
  basePrice: number;
  className?: string;
}

export const QuantitySetSelector: React.FC<QuantitySetSelectorProps> = ({
  quantitySets,
  selectedQuantitySetId,
  onQuantitySetChange,
  basePrice,
  className = ''
}) => {
  const { convertAndFormatPrice } = usePriceUtils();
  if (!quantitySets || quantitySets.length === 0) {
    return null;
  }

  // Sort quantity sets by sort order
  const sortedQuantitySets = [...quantitySets].sort((a, b) => a.sortOrder - b.sortOrder);

  // Find selected quantity set or default to the first default one
  const selectedQuantitySet = selectedQuantitySetId
    ? sortedQuantitySets.find(qs => qs.id === selectedQuantitySetId)
    : sortedQuantitySets.find(qs => qs.isDefault) || sortedQuantitySets[0];

  const calculatePrice = (quantitySet: ProductQuantitySet) => {
    return basePrice * quantitySet.priceMultiplier;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-base font-medium text-gray-900">Quantity Options</h3>

      <div className="space-y-3">
        {sortedQuantitySets.map((quantitySet) => {
          const isSelected = selectedQuantitySet?.id === quantitySet.id;
          const price = calculatePrice(quantitySet);

          return (
            <div
              key={quantitySet.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => onQuantitySetChange(quantitySet.id)}
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
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {quantitySet.displayName}
                      </span>
                      {quantitySet.isDefault && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          isSelected ? 'bg-orange-400 text-white' : 'bg-orange-100 text-orange-800'
                        }`}>
                          Popular
                        </span>
                      )}
                    </div>
                    <div className={`text-sm ${isSelected ? 'text-orange-100' : 'text-gray-600'}`}>
                      {quantitySet.quantity} {quantitySet.quantity === 1 ? 'unit' : 'units'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {convertAndFormatPrice(price)}
                  </div>
                  {quantitySet.quantity > 1 && (
                    <div className={`text-xs ${isSelected ? 'text-orange-100' : 'text-gray-500'}`}>
                      {convertAndFormatPrice(price / quantitySet.quantity)} each
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedQuantitySet && (
        <div className="mt-4 p-3 bg-gray-50 rounded border">
          <div className="text-sm text-gray-700">
            <strong>Selected:</strong> {selectedQuantitySet.displayName}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <strong>Total:</strong> {convertAndFormatPrice(calculatePrice(selectedQuantitySet))} for {selectedQuantitySet.quantity} {selectedQuantitySet.quantity === 1 ? 'unit' : 'units'}
          </div>
        </div>
      )}
    </div>
  );
};
