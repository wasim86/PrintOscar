'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ProductVarietyBoxOption, VarietyBoxSnackOption } from '@/services/simple-products-api';

interface VarietyBoxSelectorProps {
  varietyBoxOptions: ProductVarietyBoxOption[];
  selectedSnacks: { [slotName: string]: number }; // slotName -> snackProductId
  onSnackChange: (slotName: string, snackProductId: number) => void;
  className?: string;
}

export const VarietyBoxSelector: React.FC<VarietyBoxSelectorProps> = ({
  varietyBoxOptions,
  selectedSnacks,
  onSnackChange,
  className = ''
}) => {
  if (!varietyBoxOptions || varietyBoxOptions.length === 0) {
    return null;
  }

  // Sort variety box options by sort order
  const sortedOptions = [...varietyBoxOptions].sort((a, b) => a.sortOrder - b.sortOrder);

  const getSelectedSnack = (slot: ProductVarietyBoxOption): VarietyBoxSnackOption | null => {
    const selectedSnackId = selectedSnacks[slot.slotName];
    if (!selectedSnackId) return null;
    
    return slot.snackOptions.find(option => option.snackProductId === selectedSnackId) || null;
  };

  const isSlotComplete = (slot: ProductVarietyBoxOption): boolean => {
    return !!getSelectedSnack(slot);
  };

  const getTotalSelectedItems = (): number => {
    return sortedOptions.reduce((total, slot) => {
      return total + (isSlotComplete(slot) ? slot.slotQuantity : 0);
    }, 0);
  };

  const getTotalPossibleItems = (): number => {
    return sortedOptions.reduce((total, slot) => total + slot.slotQuantity, 0);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-base font-medium text-gray-900">Customize Your Variety Box</h3>
        <p className="text-sm text-gray-600">Choose your favorite snacks for each slot</p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Selection Progress</span>
          <span className="text-sm text-gray-600">{getTotalSelectedItems()} / {getTotalPossibleItems()} items</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(getTotalSelectedItems() / getTotalPossibleItems()) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Variety Box Slots */}
      <div className="space-y-3">
        {sortedOptions.map((slot) => {
          const selectedSnack = getSelectedSnack(slot);
          const isComplete = isSlotComplete(slot);

          // Sort snack options by sort order
          const sortedSnackOptions = [...slot.snackOptions].sort((a, b) => a.sortOrder - b.sortOrder);

          return (
            <div
              key={slot.id}
              className={`border rounded-lg p-3 transition-all duration-200 text-black ${
                isComplete
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {slot.slotName}
                  </h4>
                  <p className="text-xs text-gray-600">
                    Choose {slot.slotQuantity} {slot.slotQuantity === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              {/* Snack Selection Dropdown */}
              <div className="relative">
                <select
                  value={selectedSnacks[slot.slotName] || ''}
                  onChange={(e) => {
                    const snackId = parseInt(e.target.value);
                    if (snackId) {
                      onSnackChange(slot.slotName, snackId);
                    }
                  }}
                  className={`w-full p-2 text-sm border rounded-md appearance-none bg-white ${
                    isComplete
                      ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-200'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                  } focus:outline-none focus:ring-1 transition-colors`}
                >
                  <option value="">
                    Select your snack for {slot.slotName}...
                  </option>
                  {sortedSnackOptions.map((snackOption) => (
                    <option
                      key={snackOption.id}
                      value={snackOption.snackProductId}
                    >
                      {snackOption.displayName}
                      {snackOption.size && ` (${snackOption.size})`}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Selected Snack Preview - Compact */}
              {selectedSnack && (
                <div className="mt-2 p-2 bg-white rounded border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">
                      {selectedSnack.displayName}
                      {selectedSnack.size && ` (${selectedSnack.size})`}
                    </div>
                    <div className="text-xs font-medium text-orange-600">
                      × {slot.slotQuantity}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary - Compact */}
      {getTotalSelectedItems() === getTotalPossibleItems() && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center text-orange-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              Selected: {sortedOptions.map((slot) => {
                const selectedSnack = getSelectedSnack(slot);
                return selectedSnack ? `${slot.slotQuantity}x ${selectedSnack.displayName}` : null;
              }).filter(Boolean).join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
