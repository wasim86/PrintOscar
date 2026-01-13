import { authService } from '@/services/authService';
import { adminAuthService } from '@/services/adminAuthService';

/**
 * Get the current authentication token
 * @returns The current auth token or null if not authenticated
 */
export function getAuthToken(): string | null {
  return authService.getToken();
}

/**
 * Get the current admin authentication token
 * @returns The current admin auth token or null if not authenticated
 */
export function getAdminAuthToken(): string | null {
  return adminAuthService.getToken();
}

/**
 * Check if user is currently authenticated
 * @returns True if user has a valid token
 */
export function isAuthenticated(): boolean {
  return authService.isAuthenticated();
}

/**
 * Check if admin is currently authenticated
 * @returns True if admin has a valid token
 */
export function isAdminAuthenticated(): boolean {
  return adminAuthService.isAuthenticated();
}



/**
 * Logout the current user
 */
export function logout(): void {
  authService.logout();
}

/**
 * Logout the current admin user
 */
export function adminLogout(): void {
  adminAuthService.logout();
}
