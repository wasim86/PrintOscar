import { API_BASE_URL } from './config';

// Types
export interface ImageUploadResponse {
  success: boolean;
  imageUrl?: string;
  fileName?: string;
  originalFileName?: string;
  fileSize?: number;
  message: string;
}

export interface MultipleImageUploadResponse {
  success: boolean;
  results: ImageUploadResult[];
  successCount: number;
  failureCount: number;
  message: string;
}

export interface ImageUploadResult {
  originalFileName: string;
  fileName?: string;
  imageUrl?: string;
  fileSize?: number;
  success: boolean;
  error?: string;
}

export interface ImageDeleteResponse {
  success: boolean;
  message: string;
}

// Image Upload API Service
export class ImageUploadApi {
  
  /**
   * Upload a single image file
   */
  static async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
      
      const response = await fetch(`${API_BASE_URL}/admin/image/upload`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple image files
   */
  static async uploadMultipleImages(files: File[]): Promise<MultipleImageUploadResponse> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
      
      const response = await fetch(`${API_BASE_URL}/admin/image/upload-multiple`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  /**
   * Delete an image by filename
   */
  static async deleteImage(fileName: string): Promise<ImageDeleteResponse> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('printoscar_admin_token') : null;
      
      const response = await fetch(`${API_BASE_URL}/admin/image/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Convert blob URL to File object (for uploading existing blob URLs)
   */
  static async blobUrlToFile(blobUrl: string, fileName: string = 'image.jpg'): Promise<File> {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error('Error converting blob URL to file:', error);
      throw new Error('Failed to convert blob URL to file');
    }
  }

  /**
   * Upload blob URL (convert to file first, then upload)
   */
  static async uploadBlobUrl(blobUrl: string, fileName?: string): Promise<ImageUploadResponse> {
    try {
      const file = await this.blobUrlToFile(blobUrl, fileName);
      return await this.uploadImage(file);
    } catch (error) {
      console.error('Error uploading blob URL:', error);
      throw error;
    }
  }

  /**
   * Upload multiple blob URLs
   */
  static async uploadMultipleBlobUrls(blobUrls: string[]): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];
    
    for (let i = 0; i < blobUrls.length; i++) {
      const blobUrl = blobUrls[i];
      try {
        const response = await this.uploadBlobUrl(blobUrl, `image-${i + 1}.jpg`);
        results.push({
          originalFileName: `image-${i + 1}.jpg`,
          fileName: response.fileName,
          imageUrl: response.imageUrl,
          fileSize: response.fileSize,
          success: response.success,
        });
      } catch (error) {
        results.push({
          originalFileName: `image-${i + 1}.jpg`,
          success: false,
          error: error instanceof Error ? error.message : 'Upload failed',
        });
      }
    }
    
    return results;
  }

  /**
   * Validate image file before upload
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported. Please use JPEG, PNG, or WebP.`
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      };
    }

    return { valid: true };
  }

  /**
   * Extract filename from image URL
   */
  static extractFileNameFromUrl(imageUrl: string): string | null {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return null;
    }
  }

  /**
   * Check if URL is a blob URL
   */
  static isBlobUrl(url: string): boolean {
    return url.startsWith('blob:');
  }

  /**
   * Check if URL is a server URL
   */
  static isServerUrl(url: string): boolean {
    return url.startsWith('http') && !this.isBlobUrl(url);
  }
}

export default ImageUploadApi;
