import { API_BASE_URL } from './config';

// Admin Shipping Types
export interface AdminShippingZone {
  id: number;
  name: string;
  description?: string;
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  regionCount: number;
  methodCount: number;
  regions: AdminShippingZoneRegion[];
  methods: AdminShippingZoneMethod[];
}

export interface AdminShippingZoneRegion {
  id: number;
  regionType: string;
  regionCode: string;
  regionName: string;
  isIncluded: boolean;
  priority: number;
}

export interface AdminShippingZoneMethod {
  id: number;
  shippingMethodId: number;
  shippingMethodName: string;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
  baseCost: number;
  minOrderAmount?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  classCosts: AdminShippingClassCost[];
}

export interface AdminShippingMethod {
  id: number;
  name: string;
  methodType: string;
  description?: string;
  isEnabled: boolean;
  isTaxable: boolean;
  createdAt: string;
  updatedAt: string;
  zoneCount: number;
}

export interface AdminShippingClass {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  classCosts: AdminShippingClassCost[];
}

export interface AdminShippingClassCost {
  id: number;
  shippingZoneMethodId: number;
  shippingClassId: number;
  shippingZoneName: string;
  shippingMethodName: string;
  shippingClassName: string;
  cost: number;
  costType: string;
}

export interface AdminShippingOverview {
  totalZones: number;
  activeZones: number;
  totalMethods: number;
  activeMethods: number;
  totalClasses: number;
  totalClassCosts: number;
  productsWithShippingClass: number;
  productsWithoutShippingClass: number;
}

// Product Assignment Types
export interface ShippingClassProduct {
  id: number;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryName: string;
  isActive: boolean;
}

export interface ShippingClassProductsResponse {
  success: boolean;
  products: ShippingClassProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  message?: string;
}

export interface AssignProductsToClassRequest {
  productIds: number[];
}

export interface RemoveProductsFromClassRequest {
  productIds: number[];
}

export interface CreateZoneMethodAssignment {
  shippingZoneId: number;
  shippingMethodId: number;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
  baseCost: number;
  minOrderAmount?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
}

// Create/Update Types
export interface CreateShippingZone {
  name: string;
  description?: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface UpdateShippingZone {
  name: string;
  description?: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface CreateShippingMethod {
  name: string;
  methodType: string;
  description?: string;
  isEnabled: boolean;
  isTaxable: boolean;
}

export interface UpdateShippingMethod {
  name: string;
  methodType: string;
  description?: string;
  isEnabled: boolean;
  isTaxable: boolean;
}

export interface CreateShippingClass {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateShippingClass {
  name: string;
  slug: string;
  description?: string;
}

export interface CreateShippingClassCost {
  shippingZoneMethodId: number;
  shippingClassId: number;
  cost: number;
  costType: string;
}

export interface UpdateShippingClassCost {
  cost: number;
  costType: string;
}

// Response Types
export interface AdminShippingZonesResponse {
  success: boolean;
  message: string;
  zones: AdminShippingZone[];
  totalCount: number;
}

export interface AdminShippingZoneResponse {
  success: boolean;
  message: string;
  zone?: AdminShippingZone;
}

export interface AdminShippingMethodsResponse {
  success: boolean;
  message: string;
  methods: AdminShippingMethod[];
  totalCount: number;
}

export interface AdminShippingMethodResponse {
  success: boolean;
  message: string;
  method?: AdminShippingMethod;
}

export interface AdminShippingClassesResponse {
  success: boolean;
  message: string;
  classes: AdminShippingClass[];
  totalCount: number;
}

export interface AdminShippingClassResponse {
  success: boolean;
  message: string;
  class?: AdminShippingClass;
}

export interface AdminShippingClassCostsResponse {
  success: boolean;
  message: string;
  costs: AdminShippingClassCost[];
  totalCount: number;
}

// API Helper Function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Admin Shipping API Service
export class AdminShippingApi {
  // Overview
  static async getOverview(): Promise<AdminShippingOverview> {
    return apiRequest<AdminShippingOverview>('/admin/shipping/overview');
  }

  // Shipping Zones
  static async getZones(): Promise<AdminShippingZonesResponse> {
    return apiRequest<AdminShippingZonesResponse>('/admin/shipping/zones');
  }

  static async getZone(id: number): Promise<AdminShippingZoneResponse> {
    return apiRequest<AdminShippingZoneResponse>(`/admin/shipping/zones/${id}`);
  }

  static async createZone(data: CreateShippingZone): Promise<AdminShippingZoneResponse> {
    return apiRequest<AdminShippingZoneResponse>('/admin/shipping/zones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateZone(id: number, data: UpdateShippingZone): Promise<AdminShippingZoneResponse> {
    return apiRequest<AdminShippingZoneResponse>(`/admin/shipping/zones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteZone(id: number): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/zones/${id}`, {
      method: 'DELETE',
    });
  }

  // Shipping Methods
  static async getMethods(): Promise<AdminShippingMethodsResponse> {
    return apiRequest<AdminShippingMethodsResponse>('/admin/shipping/methods');
  }

  static async getMethod(id: number): Promise<AdminShippingMethodResponse> {
    return apiRequest<AdminShippingMethodResponse>(`/admin/shipping/methods/${id}`);
  }

  static async createMethod(data: CreateShippingMethod): Promise<AdminShippingMethodResponse> {
    return apiRequest<AdminShippingMethodResponse>('/admin/shipping/methods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateMethod(id: number, data: UpdateShippingMethod): Promise<AdminShippingMethodResponse> {
    return apiRequest<AdminShippingMethodResponse>(`/admin/shipping/methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteMethod(id: number): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/methods/${id}`, {
      method: 'DELETE',
    });
  }

  // Shipping Classes
  static async getClasses(): Promise<AdminShippingClassesResponse> {
    return apiRequest<AdminShippingClassesResponse>('/admin/shipping/classes');
  }

  static async getClass(id: number): Promise<AdminShippingClassResponse> {
    return apiRequest<AdminShippingClassResponse>(`/admin/shipping/classes/${id}`);
  }

  static async createClass(data: CreateShippingClass): Promise<AdminShippingClassResponse> {
    return apiRequest<AdminShippingClassResponse>('/admin/shipping/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateClass(id: number, data: UpdateShippingClass): Promise<AdminShippingClassResponse> {
    return apiRequest<AdminShippingClassResponse>(`/admin/shipping/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteClass(id: number): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // Shipping Class Costs
  static async getClassCosts(shippingClassId?: number, shippingZoneId?: number): Promise<AdminShippingClassCostsResponse> {
    const params = new URLSearchParams();
    if (shippingClassId) params.append('shippingClassId', shippingClassId.toString());
    if (shippingZoneId) params.append('shippingZoneId', shippingZoneId.toString());
    
    const queryString = params.toString();
    const endpoint = `/admin/shipping/class-costs${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<AdminShippingClassCostsResponse>(endpoint);
  }

  static async createClassCost(data: CreateShippingClassCost): Promise<{ success: boolean; message: string; id: number }> {
    return apiRequest<{ success: boolean; message: string; id: number }>('/admin/shipping/class-costs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateClassCost(id: number, data: UpdateShippingClassCost): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/class-costs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteClassCost(id: number): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/class-costs/${id}`, {
      method: 'DELETE',
    });
  }

  // Product Assignments
  static async getClassProducts(classId: number, page: number = 1, pageSize: number = 50): Promise<ShippingClassProductsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    return apiRequest<ShippingClassProductsResponse>(`/admin/shipping/classes/${classId}/products?${params.toString()}`);
  }

  static async getUnassignedProducts(page: number = 1, pageSize: number = 50, search?: string): Promise<ShippingClassProductsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (search) params.append('search', search);

    return apiRequest<ShippingClassProductsResponse>(`/admin/shipping/products/unassigned?${params.toString()}`);
  }

  static async assignProductsToClass(classId: number, data: AssignProductsToClassRequest): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/classes/${classId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async removeProductsFromClass(classId: number, data: RemoveProductsFromClassRequest): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/classes/${classId}/products`, {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  // Zone Method Assignments
  static async assignMethodToZone(zoneId: number, data: CreateZoneMethodAssignment): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/zones/${zoneId}/methods`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async removeMethodFromZone(zoneId: number, methodId: number): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/shipping/zones/${zoneId}/methods/${methodId}`, {
      method: 'DELETE',
    });
  }
}
