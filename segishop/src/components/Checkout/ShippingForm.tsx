'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShippingAddress } from '@/app/checkout/page';
import { ShippingOption } from '@/services/shipping-api';
import { UserAddressApiService, UserAddress } from '@/services/user-address-api';
import { MapPin, User, Mail, Phone, Truck, Clock, Plus, Home, Building, Check, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { PostalCodeInput } from '../Forms/PostalCodeInput';
import { usePriceUtils } from '@/utils/priceUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useShipping } from '@/contexts/ShippingContext';

interface ShippingFormProps {
  onComplete: (data: ShippingAddress) => void;
  initialData?: ShippingAddress | null;
  shippingOptions?: ShippingOption[];
  selectedShippingOption?: ShippingOption | null;
  onShippingOptionSelect?: (option: ShippingOption) => void;
  onAddressChange?: (address: ShippingAddress) => void;
  isCalculatingShipping?: boolean;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  onComplete,
  initialData,
  shippingOptions = [],
  selectedShippingOption,
  onShippingOptionSelect,
  onAddressChange,
  isCalculatingShipping = false
}) => {
  const { convertAndFormatPrice } = usePriceUtils();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    apartment: initialData?.apartment || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    country: initialData?.country || 'US'
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressValidationMessage, setAddressValidationMessage] = useState<string | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);

  // Saved addresses functionality
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<UserAddress | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Collapsible address state
  const [isAddressCollapsed, setIsAddressCollapsed] = useState(false);
  const [manuallyExpanded, setManuallyExpanded] = useState(false);

  // Helper function to check if manual form address is complete
  const isManualAddressComplete = () => {
    return formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.zipCode.trim().length >= 5; // Require at least 5 digits for ZIP code
  };

  // Helper function to check if we have any complete address (saved or manual)
  const hasCompleteAddress = () => {
    return selectedSavedAddress || isManualAddressComplete();
  };

  // Auto-collapse address when it's complete and shipping options are available
  // Only auto-collapse if user hasn't manually expanded it
  // Add debounce to prevent premature collapse while user is typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasCompleteAddress() && shippingOptions.length > 0 && !isAddressCollapsed && !manuallyExpanded) {
        setIsAddressCollapsed(true);
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData, selectedSavedAddress, shippingOptions.length, isAddressCollapsed, manuallyExpanded]);

  // Load saved addresses on component mount (only for authenticated users)
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedAddresses();
    }
  }, [isAuthenticated]);

  const loadSavedAddresses = async () => {
    // Only load saved addresses for authenticated users
    if (!isAuthenticated) {
      return;
    }

    try {
      setIsLoadingAddresses(true);
      const response = await UserAddressApiService.getUserAddresses();
      if (response.success && response.addresses) {
        setSavedAddresses(response.addresses);
        // If there's a default address and no initial data, use it
        const defaultAddress = response.addresses.find(addr => addr.isDefault);
        if (defaultAddress && !initialData) {
          handleSavedAddressSelect(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Failed to load saved addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleSavedAddressSelect = (address: UserAddress) => {
    setSelectedSavedAddress(address);
    setShowAddressForm(false);

    // Map UserAddress to ShippingAddress format
    const mappedAddress: ShippingAddress = {
      firstName: address.firstName,
      lastName: address.lastName,
      email: formData.email, // Keep existing email
      phone: address.phone || formData.phone,
      address: address.address1,
      apartment: address.address2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    };

    setFormData(mappedAddress);

    // Trigger address change for shipping calculation
    if (onAddressChange) {
      onAddressChange(mappedAddress);
    }
  };

  const handleNewAddressClick = () => {
    setSelectedSavedAddress(null);
    setShowAddressForm(true);
    // Clear form data except email
    setFormData({
      firstName: '',
      lastName: '',
      email: formData.email,
      phone: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    });
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear selected saved address when manually editing
    if (selectedSavedAddress) {
      setSelectedSavedAddress(null);
    }

    // Trigger address change for shipping calculation when any relevant field changes
    if (
      onAddressChange &&
      (
        field === 'firstName' ||
        field === 'lastName' ||
        field === 'address' ||
        field === 'apartment' ||
        field === 'city' ||
        field === 'state' ||
        field === 'zipCode' ||
        field === 'country' ||
        field === 'phone'
      )
    ) {
      onAddressChange(newFormData);
    }
  };

  // Trigger address change when form data changes (for initial load)
  useEffect(() => {
    if (onAddressChange && formData.city && formData.state && formData.zipCode) {
      onAddressChange(formData);
    }
  }, [formData.city, formData.state, formData.zipCode, onAddressChange]);

  const stateMap: Record<string, string> = {
    'alabama':'AL','alaska':'AK','arizona':'AZ','arkansas':'AR','california':'CA','colorado':'CO','connecticut':'CT','delaware':'DE','district of columbia':'DC','florida':'FL','georgia':'GA','hawaii':'HI','idaho':'ID','illinois':'IL','indiana':'IN','iowa':'IA','kansas':'KS','kentucky':'KY','louisiana':'LA','maine':'ME','maryland':'MD','massachusetts':'MA','michigan':'MI','minnesota':'MN','mississippi':'MS','missouri':'MO','montana':'MT','nebraska':'NE','nevada':'NV','new hampshire':'NH','new jersey':'NJ','new mexico':'NM','new york':'NY','north carolina':'NC','north dakota':'ND','ohio':'OH','oklahoma':'OK','oregon':'OR','pennsylvania':'PA','rhode island':'RI','south carolina':'SC','south dakota':'SD','tennessee':'TN','texas':'TX','utah':'UT','vermont':'VT','virginia':'VA','washington':'WA','west virginia':'WV','wisconsin':'WI','wyoming':'WY'
  };

  const normalizeState = (value: string) => {
    const v = value.trim();
    if (v.length === 2) return v.toUpperCase();
    const mapped = stateMap[v.toLowerCase()];
    return mapped ? mapped : v;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    // Required field validations with length checks
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Address validations
    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Street address must be at least 5 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    if (!formData.state.trim()) newErrors.state = 'State is required';

    // ZIP code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { validateShippingAddress } = useShipping();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setAddressValidationMessage(null);

    try {
      const isValidAddress = await validateShippingAddress({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      });

      if (!isValidAddress) {
        setIsSubmitting(false);
        setAddressValidationMessage('Please double-check your shipping address — we were unable to verify it for delivery.');
        return;
      }
    } catch {
      // Non-blocking: proceed if validation service fails
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(formData);
    setIsSubmitting(false);
  };

  // Google Places Autocomplete integration (optional)
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key || !autocompleteInputRef.current || typeof window === 'undefined') return;

    const initAutocomplete = () => {
      if (!autocompleteInputRef.current || !(window as any).google?.maps?.places) return;

      const currentCountry = (formData.country || '').toUpperCase();
      const restrictions = (currentCountry === 'US' || currentCountry === 'UNITED STATES') ? { country: ['us'] } : undefined;

      const autocomplete = new (window as any).google.maps.places.Autocomplete(autocompleteInputRef.current, {
        types: ['address'],
        componentRestrictions: restrictions,
        fields: ['address_components']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const comps: any[] = place?.address_components || [];
        const find = (type: string) => comps.find(c => c.types?.includes(type));
        const streetNumber = find('street_number')?.long_name || '';
        const route = find('route')?.long_name || '';
        const city = find('locality')?.long_name || find('sublocality')?.long_name || find('postal_town')?.long_name || '';
        const state = find('administrative_area_level_1')?.short_name || '';
        const zip = find('postal_code')?.long_name || '';
        const country = find('country')?.long_name || '';

        const addressLine = [streetNumber, route].filter(Boolean).join(' ');
        let next: ShippingAddress | null = null;
        setFormData(prev => {
          next = {
            ...prev,
            address: addressLine || prev.address,
            city: city || prev.city,
            state: state || prev.state,
            zipCode: zip || prev.zipCode,
            country: country || prev.country
          };
          return next;
        });
        if (onAddressChange && next) onAddressChange(next);
        setErrors(prev => ({ ...prev, address: undefined, city: undefined, state: undefined, zipCode: undefined }));
      });
    };

    const existing = document.querySelector('script[data-google-places]') as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).google?.maps?.places) {
        initAutocomplete();
      } else {
        existing.addEventListener('load', initAutocomplete);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=en`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-places', 'true');
    script.addEventListener('load', initAutocomplete);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', initAutocomplete);
    };
    // Re-init when country changes to adjust restrictions
  }, [formData.country]);



  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-4">
            <MapPin className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
            <p className="text-sm text-gray-600">Where should we deliver your order?</p>
          </div>
        </div>

        {addressValidationMessage && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            {addressValidationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">


          {/* Saved Addresses Section - Only for authenticated users */}
          {isAuthenticated && savedAddresses.length > 0 && !isAddressCollapsed && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  Saved Addresses
                </h3>
                {selectedSavedAddress && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddressCollapsed(true);
                      setManuallyExpanded(false);
                    }}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700"
                  >
                    <ChevronUp className="h-4 w-4" />
                    <span>Minimize</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSavedAddress?.id === address.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSavedAddressSelect(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                          {address.type === 'Home' ? (
                            <Home className="h-4 w-4 text-gray-600" />
                          ) : address.type === 'Work' ? (
                            <Building className="h-4 w-4 text-gray-600" />
                          ) : (
                            <MapPin className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {address.firstName} {address.lastName}
                            </span>
                            <span className="text-sm text-gray-500">({address.type})</span>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address1}
                            {address.address2 && `, ${address.address2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                      </div>
                      {selectedSavedAddress?.id === address.id && (
                        <Check className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Add New Address Button */}
                <button
                  type="button"
                  onClick={handleNewAddressClick}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Address</span>
                </button>
              </div>
            </div>
          )}

          {/* Address Summary (Collapsed View) - Unified for both saved and manual addresses */}
          {isAddressCollapsed && hasCompleteAddress() && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Shipping Address Confirmed</h3>
                    <p className="text-sm text-gray-600">
                      {selectedSavedAddress ? (
                        <>
                          {selectedSavedAddress.firstName} {selectedSavedAddress.lastName} • {selectedSavedAddress.address1}
                          {selectedSavedAddress.address2 && `, ${selectedSavedAddress.address2}`}, {selectedSavedAddress.city}, {selectedSavedAddress.state} {selectedSavedAddress.zipCode}
                        </>
                      ) : (
                        <>
                          {formData.firstName} {formData.lastName} • {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressCollapsed(false);
                    setManuallyExpanded(true);
                    // If editing a saved address, clear selection to show form
                    if (selectedSavedAddress) {
                      setSelectedSavedAddress(null);
                      setShowAddressForm(true);
                    }
                  }}
                  className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(!isAuthenticated || showAddressForm || savedAddresses.length === 0) && !isAddressCollapsed && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  Contact Information
                </h3>
                {hasCompleteAddress() && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddressCollapsed(true);
                      setManuallyExpanded(false);
                    }}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700"
                  >
                    <ChevronUp className="h-4 w-4" />
                    <span>Minimize</span>
                  </button>
                )}
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
                    errors.firstName ? 'border-red-300 bg-red-50' : formData.firstName && formData.firstName.trim().length >= 2 ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {/* Validation checkmark */}
                {formData.firstName && formData.firstName.trim().length >= 2 && !errors.firstName && (
                  <div className="absolute right-3 top-9 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.createAccount}
                    onChange={(e) => handleInputChange('createAccount', e.target.checked)}
                    className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Create an account</div>
                    <div className="text-sm text-gray-600">
                      Enjoy faster checkout, order tracking, and member-only deals. We'll send your login details to {formData.email || 'your email'}.
                    </div>
                  </div>
                </label>
              </div>
            )}
            
          </div>
          )}

          {/* Shipping Address */}
          {(!isAuthenticated || showAddressForm || savedAddresses.length === 0) && !isAddressCollapsed && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                Shipping Address
              </h3>
              {hasCompleteAddress() && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressCollapsed(true);
                    setManuallyExpanded(false);
                  }}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700"
                >
                  <ChevronUp className="h-4 w-4" />
                  <span>Minimize</span>
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Autocomplete (optional)</label>
                <input
                  type="text"
                  ref={autocompleteInputRef}
                  placeholder="Start typing your address"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white border-gray-300"
                />
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                  <div className="mt-1 text-xs text-gray-500">Powered by Google</div>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  ref={addressInputRef}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, Suite, etc. (Optional)
                </label>
                <input
                  type="text"
                  id="apartment"
                  value={formData.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white"
                  placeholder="Apt 4B, Suite 100, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', normalizeState(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white ${
                      errors.state ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <PostalCodeInput
                    value={formData.zipCode}
                    onChange={(value) => handleInputChange('zipCode', value)}
                    country={formData.country || 'United States'}
                    state={formData.state}
                    placeholder="ZIP Code *"
                    className="text-sm text-gray-900 placeholder-gray-400"
                    required
                    onValidationChange={(isValid, message) => {
                      if (!isValid && message) {
                        setErrors(prev => ({ ...prev, zipCode: message }));
                      } else if (isValid && errors.zipCode) {
                        setErrors(prev => ({ ...prev, zipCode: undefined }));
                      }
                    }}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Shipping Options */}
          {shippingOptions.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Shipping Options</h3>
              </div>

              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedShippingOption?.id === option.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => onShippingOptionSelect?.(option)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingOption"
                          checked={selectedShippingOption?.id === option.id}
                          onChange={() => onShippingOptionSelect?.(option)}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{option.title}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{option.estimatedDays}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {option.cost === 0 ? 'FREE' : convertAndFormatPrice(option.cost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Calculation Loading */}
          {isCalculatingShipping && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Calculating Shipping...</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                <span className="text-gray-600">Finding the best shipping options for your location</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
