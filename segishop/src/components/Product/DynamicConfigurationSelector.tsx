import React, { useEffect } from 'react';
import { DynamicConfiguration } from '@/services/simple-products-api';

interface DynamicConfigurationSelectorProps {
  configurations: DynamicConfiguration[];
  onConfigurationChange: (configurationId: number, selectedOptionId: number | null) => void;
  selectedConfigurations: { [configurationId: number]: number | null };
}

export const DynamicConfigurationSelector: React.FC<DynamicConfigurationSelectorProps> = ({
  configurations,
  onConfigurationChange,
  selectedConfigurations
}) => {
  // Initialize default selections
  useEffect(() => {
    configurations.forEach(config => {
      if (!(config.configurationTypeId in selectedConfigurations)) {
        const defaultOption = config.options.find(option => option.isDefault);
        if (defaultOption) {
          onConfigurationChange(config.configurationTypeId, defaultOption.id);
        }
      }
    });
  }, [configurations, selectedConfigurations, onConfigurationChange]);

  const renderConfiguration = (config: DynamicConfiguration) => {
    const selectedOptionId = selectedConfigurations[config.configurationTypeId];
    const selectedOption = config.options.find(option => option.id === selectedOptionId);

    if (config.type === 'dropdown') {
      return (
        <div key={config.configurationTypeId} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">
              {config.name}
              {config.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {config.source === 'category' && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                From Category
              </span>
            )}
            {config.source === 'override' && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                Product Specific
              </span>
            )}
          </div>
          
          <select
            value={selectedOptionId || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const optionId = e.target.value ? parseInt(e.target.value) : null;
              onConfigurationChange(config.configurationTypeId, optionId);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black bg-white"
            required={config.isRequired}
          >
            {!config.isRequired && (
              <option value="" className="text-black">Select {config.name}</option>
            )}
            {config.options
              .filter(option => option.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map(option => (
                <option key={option.id} value={option.id} className="text-black">
                  {option.name}
                  {config.showPriceImpact && option.priceModifier !== 0 && (
                    ` (${option.priceModifier > 0 ? '+' : ''}$${option.priceModifier.toFixed(2)})`
                  )}
                </option>
              ))}
          </select>

          {selectedOption && config.showPriceImpact && selectedOption.priceModifier !== 0 && (
            <p className="text-sm text-gray-600">
              Price adjustment: {selectedOption.priceModifier > 0 ? '+' : ''}${selectedOption.priceModifier.toFixed(2)}
            </p>
          )}
        </div>
      );
    }

    if (config.type === 'radio') {
      return (
        <div key={config.configurationTypeId} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">
              {config.name}
              {config.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {config.source === 'category' && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                From Category
              </span>
            )}
            {config.source === 'override' && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                Product Specific
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {config.options
              .filter(option => option.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map(option => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`config-${config.configurationTypeId}`}
                    value={option.id}
                    checked={selectedOptionId === option.id}
                    onChange={() => onConfigurationChange(config.configurationTypeId, option.id)}
                    className="text-orange-600 focus:ring-orange-500"
                    required={config.isRequired}
                  />
                  <span className="text-sm text-gray-900">
                    {option.name}
                    {config.showPriceImpact && option.priceModifier !== 0 && (
                      <span className="text-gray-600 ml-1">
                        ({option.priceModifier > 0 ? '+' : ''}${option.priceModifier.toFixed(2)})
                      </span>
                    )}
                  </span>
                </label>
              ))}
          </div>
        </div>
      );
    }

    // Default fallback for unknown types
    return (
      <div key={config.configurationTypeId} className="space-y-3">
        <label className="text-sm font-medium text-gray-900">
          {config.name} (Type: {config.type})
          {config.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <p className="text-sm text-gray-500">
          Configuration type "{config.type}" is not yet supported.
        </p>
      </div>
    );
  };

  if (!configurations || configurations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Product Options</h3>
      {configurations
        .filter(config => config.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(renderConfiguration)}
    </div>
  );
};

export default DynamicConfigurationSelector;
