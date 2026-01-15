// API Configuration
const RAW_API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').trim();
let NORMALIZED_API = RAW_API;
if (/^:\d+/.test(NORMALIZED_API)) {
  NORMALIZED_API = `http://localhost${NORMALIZED_API}`;
}
if (!/^https?:\/\//.test(NORMALIZED_API)) {
  NORMALIZED_API = `http://${NORMALIZED_API}`;
}
if (!/\/api$/.test(NORMALIZED_API)) {
  NORMALIZED_API = `${NORMALIZED_API.replace(/\/+$/, '')}/api`;
}
export const API_BASE_URL = NORMALIZED_API.replace(/\/+$/, '');

// Image Base URL Configuration
const IS_PROD = process.env.NODE_ENV === 'production';
const RAW_IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const DEFAULT_IMAGE_BASE = IS_PROD ? '' : 'http://localhost:5001';
export const IMAGE_BASE_URL = (RAW_IMAGE_BASE || DEFAULT_IMAGE_BASE).trim();

// Other configuration constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Image configuration
export const DEFAULT_PRODUCT_IMAGE = '/api/placeholder/300/200';
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Admin configuration
export const ADMIN_ROUTES = {
  PRODUCTS: '/admin/products',
  ORDERS: '/admin/orders',
  USERS: '/admin/users',
  ANALYTICS: '/admin/analytics',
  SETTINGS: '/admin/settings'
};

// Product configuration
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft'
} as const;

export const SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  CREATED_ASC: 'created_asc',
  CREATED_DESC: 'created_desc',
  STOCK_ASC: 'stock_asc',
  STOCK_DESC: 'stock_desc'
} as const;
