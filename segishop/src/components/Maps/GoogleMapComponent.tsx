'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'seasonal_event' | 'annual_event' | 'regular_market' | 'dmv_store' | 'printoscar_location';
  status: 'upcoming' | 'annual' | 'active' | 'inactive';
  phone?: string;
  hours?: string;
  description?: string;
  nextEvent?: string;
  schedule?: string;
}

interface GoogleMapComponentProps {
  locations: MapLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  locations,
  center = { lat: 38.9072, lng: -77.0369 }, // Washington DC center
  zoom = 11,
  height = '400px'
}) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('all');

  const getMarkerColor = (type: string, status: string) => {
    if (status === 'inactive') return '#6B7280';

    switch (type) {
      case 'seasonal_event':
        return '#F97316'; // Orange for seasonal events
      case 'annual_event':
        return '#8B5CF6'; // Purple for annual events
      case 'regular_market':
        return '#10B981'; // Green for regular markets
      case 'dmv_store':
        return '#3B82F6'; // Blue for DMV stores
      case 'printoscar_location':
        return '#EF4444'; // Red for main PrintOscar locations
      default:
        return '#6B7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'seasonal_event':
        return 'Seasonal Event';
      case 'annual_event':
        return 'Annual Event';
      case 'regular_market':
        return 'Regular Market';
      case 'dmv_store':
        return 'DMV Store';
      case 'segi_location':
        return 'Segi Location';
      default:
        return 'Location';
    }
  };

  const filteredLocations = locations.filter(location => {
    if (mapFilter === 'all') return true;
    return location.type === mapFilter;
  });

  // No need for marker management with embedded iframe approach

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-900 mb-3">Map Filters</h3>
        
        <div className="space-y-2 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="mapFilter"
              value="all"
              checked={mapFilter === 'all'}
              onChange={(e) => setMapFilter(e.target.value)}
              className="mr-2 text-orange-600"
            />
            <span className="text-sm text-gray-700">All Locations</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="mapFilter"
              value="seasonal_event"
              checked={mapFilter === 'seasonal_event'}
              onChange={(e) => setMapFilter(e.target.value)}
              className="mr-2 text-orange-600"
            />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Seasonal Events</span>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="mapFilter"
              value="annual_event"
              checked={mapFilter === 'annual_event'}
              onChange={(e) => setMapFilter(e.target.value)}
              className="mr-2 text-orange-600"
            />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Annual Events</span>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="mapFilter"
              value="regular_market"
              checked={mapFilter === 'regular_market'}
              onChange={(e) => setMapFilter(e.target.value)}
              className="mr-2 text-orange-600"
            />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Weekly/Monthly Markets</span>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="mapFilter"
              value="dmv_store"
              checked={mapFilter === 'dmv_store'}
              onChange={(e) => setMapFilter(e.target.value)}
              className="mr-2 text-orange-600"
            />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">DMV Stores</span>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="mapFilter"
              value="segi_location"
              checked={mapFilter === 'segi_location'}
              onChange={(e) => setMapFilter(e.target.value)}
              className="mr-2 text-orange-600"
            />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Segi Locations</span>
            </div>
          </label>
        </div>
        
        <div className="text-xs text-gray-500">
          Showing {filteredLocations.length} of {locations.length} locations
        </div>
      </div>

      {/* Map Container */}
      <div
        className="w-full bg-gray-200 rounded-lg relative overflow-hidden"
        style={{ height }}
      >
        {/* Embedded Google Maps with Multiple Locations */}
        <div className="w-full h-full">
          {mapFilter === 'all' && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198059.49240348598!2d-77.20389069726562!3d38.89767406269531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c6de5af6e45b%3A0xc2524522d4885d2a!2sWashington%2C%20DC%2C%20USA!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          )}

          {mapFilter === 'seasonal_event' && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49515.12310087149!2d-77.30640697265625!3d38.84620000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64e0b0b0b0b0b%3A0x0!2sFairfax%2C%20VA!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          )}

          {mapFilter === 'annual_event' && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49515.12310087149!2d-77.17160000000001!3d38.8859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64e0b0b0b0b0b%3A0x0!2sFalls%20Church%2C%20VA!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          )}

          {mapFilter === 'regular_market' && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49515.12310087149!2d-77.02610000000001!3d38.9897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64e0b0b0b0b0b%3A0x0!2sMetropolitan%20Park%2C%20MD!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          )}

          {mapFilter === 'dmv_store' && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49515.12310087149!2d-77.19630000000001!3d38.8904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64e0b0b0b0b0b%3A0x0!2sLeesburg%20Pike%2C%20VA!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          )}

          {mapFilter === 'segi_location' && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49515.12310087149!2d-77.03690000000001!3d38.9072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c6de5af6e45b%3A0xc2524522d4885d2a!2sWashington%2C%20DC!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          )}

          {/* Overlay with location info */}
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
            <div className="text-sm text-gray-700">
              <div className="font-semibold mb-2">
                {mapFilter === 'all' ? 'All DMV Locations' : getTypeLabel(mapFilter)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span>Seasonal Events (3)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Annual Events (3)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Markets (3)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>DMV Stores (5)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Segi Locations (1)</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Total: {filteredLocations.length} locations
              </div>
            </div>
          </div>
        </div>

        {/* Location Info Popup */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-sm">{selectedLocation.name}</h4>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedLocation.status === 'active' || selectedLocation.status === 'upcoming' || selectedLocation.status === 'annual'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getTypeLabel(selectedLocation.type)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600">{selectedLocation.address}</span>
              </div>

              {selectedLocation.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{selectedLocation.phone}</span>
                </div>
              )}

              {selectedLocation.hours && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{selectedLocation.hours}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address)}`, '_blank')}
                className="flex-1 bg-orange-600 text-white py-1 px-3 rounded text-xs hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <Navigation className="h-3 w-3 mr-1" />
                Directions
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-1 px-3 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                Details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Location List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          All Locations ({filteredLocations.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((location) => (
            <div
              key={`${location.type}-${location.id}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedLocation(location);
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{location.name}</h4>
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: getMarkerColor(location.type, location.status) }}
                ></div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{location.address}</span>
                </div>

                {location.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{location.phone}</span>
                  </div>
                )}

                {location.hours && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{location.hours}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    location.status === 'active' || location.status === 'upcoming' || location.status === 'annual'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getTypeLabel(location.type)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
