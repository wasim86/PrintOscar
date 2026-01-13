'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Settings
} from 'lucide-react';
import {
  AdminShippingApi,
  AdminShippingZone
} from '@/services/admin-shipping-api';

interface ZoneAssignmentsProps {
  methodId: number;
  methodName: string;
  onZoneCountChange?: (count: number) => void;
}

interface ZoneAssignmentsState {
  assignedZones: AdminShippingZone[];
  availableZones: AdminShippingZone[];
  loading: boolean;
  selectedZones: Set<number>;
  error: string | null;
  success: string | null;
  processing: boolean;
}

export const ZoneAssignments: React.FC<ZoneAssignmentsProps> = ({
  methodId,
  methodName,
  onZoneCountChange
}) => {
  const [state, setState] = useState<ZoneAssignmentsState>({
    assignedZones: [],
    availableZones: [],
    loading: false,
    selectedZones: new Set(),
    error: null,
    success: null,
    processing: false
  });

  // Load all zones and categorize them
  const loadZones = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const zonesResponse = await AdminShippingApi.getZones();
      const allZones = zonesResponse.zones;
      
      // Separate zones that have this method assigned vs available
      const assignedZones = allZones.filter(zone => 
        zone.methods.some(method => method.shippingMethodId === methodId)
      );
      const availableZones = allZones.filter(zone => 
        !zone.methods.some(method => method.shippingMethodId === methodId)
      );

      setState(prev => ({
        ...prev,
        assignedZones,
        availableZones,
        loading: false
      }));
      
      if (onZoneCountChange) {
        onZoneCountChange(assignedZones.length);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load zones'
      }));
    }
  };

  // Initial load
  useEffect(() => {
    loadZones();
  }, [methodId]);

  // Zone selection
  const toggleZoneSelection = (zoneId: number) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedZones);
      if (newSelected.has(zoneId)) {
        newSelected.delete(zoneId);
      } else {
        newSelected.add(zoneId);
      }
      return { ...prev, selectedZones: newSelected };
    });
  };

  // Assign method to selected zones
  const assignToZones = async () => {
    if (state.selectedZones.size === 0) return;

    setState(prev => ({ ...prev, processing: true, error: null, success: null }));

    try {
      // Assign method to each selected zone
      const assignmentPromises = Array.from(state.selectedZones).map(zoneId =>
        AdminShippingApi.assignMethodToZone(zoneId, {
          shippingZoneId: zoneId,
          shippingMethodId: methodId,
          title: methodName,
          isEnabled: true,
          sortOrder: 0,
          baseCost: 0
        })
      );

      await Promise.all(assignmentPromises);

      setState(prev => ({
        ...prev,
        processing: false,
        selectedZones: new Set(),
        success: `Successfully assigned ${methodName} to ${state.selectedZones.size} zone(s)`
      }));

      // Reload zones
      loadZones();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        processing: false,
        error: error instanceof Error ? error.message : 'Failed to assign to zones'
      }));
    }
  };

  // Remove method from selected zones
  const removeFromZones = async () => {
    if (state.selectedZones.size === 0) return;

    setState(prev => ({ ...prev, processing: true, error: null, success: null }));

    try {
      // Remove method from each selected zone
      const removalPromises = Array.from(state.selectedZones).map(zoneId =>
        AdminShippingApi.removeMethodFromZone(zoneId, methodId)
      );

      await Promise.all(removalPromises);

      setState(prev => ({
        ...prev,
        processing: false,
        selectedZones: new Set(),
        success: `Successfully removed ${methodName} from ${state.selectedZones.size} zone(s)`
      }));

      // Reload zones
      loadZones();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        processing: false,
        error: error instanceof Error ? error.message : 'Failed to remove from zones'
      }));
    }
  };

  // Zone card component
  const ZoneCard: React.FC<{
    zone: AdminShippingZone;
    isSelected: boolean;
    onToggle: () => void;
    showMethods?: boolean;
  }> = ({ zone, isSelected, onToggle, showMethods = false }) => (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 text-blue-600"
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900 truncate">{zone.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              zone.isEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {zone.isEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {zone.description && (
            <p className="text-sm text-gray-500 mt-1">{zone.description}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xs text-gray-400">
              {zone.regionCount} region(s)
            </span>
            {showMethods && (
              <span className="text-xs text-gray-400">
                {zone.methodCount} method(s)
              </span>
            )}
          </div>
          
          {showMethods && zone.methods.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {zone.methods.slice(0, 3).map((method) => (
                  <span
                    key={method.id}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                  >
                    {method.shippingMethodName}
                  </span>
                ))}
                {zone.methods.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{zone.methods.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{state.error}</span>
          <button
            onClick={() => setState(prev => ({ ...prev, error: null }))}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {state.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-green-700">{state.success}</span>
          <button
            onClick={() => setState(prev => ({ ...prev, success: null }))}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {state.selectedZones.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              {state.selectedZones.size} zone(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={assignToZones}
                disabled={state.processing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {state.processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Add {methodName}</span>
              </button>
              <button
                onClick={removeFromZones}
                disabled={state.processing}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {state.processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
                <span>Remove {methodName}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Zones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Assigned Zones ({state.assignedZones.length})</span>
            </h3>
          </div>

          {state.loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : state.assignedZones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>This shipping method is not assigned to any zones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.assignedZones.map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  isSelected={state.selectedZones.has(zone.id)}
                  onToggle={() => toggleZoneSelection(zone.id)}
                  showMethods={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Available Zones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Available Zones ({state.availableZones.length})</span>
            </h3>
          </div>

          {state.loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : state.availableZones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>This shipping method is assigned to all zones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.availableZones.map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  isSelected={state.selectedZones.has(zone.id)}
                  onToggle={() => toggleZoneSelection(zone.id)}
                  showMethods={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Zone Assignment Information</p>
            <p>
              Shipping methods must be assigned to zones to be available during checkout.
              Each zone can have multiple shipping methods with different costs and settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
