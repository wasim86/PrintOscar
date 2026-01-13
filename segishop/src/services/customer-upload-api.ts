import { API_BASE_URL } from './config';

export interface CustomerUploadResponse {
  success: boolean;
  url: string;
  fileName: string;
  storedFileName: string;
  message?: string;
}

export const customerUploadApi = {
  uploadFile: async (file: File): Promise<CustomerUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/CustomerUpload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data: CustomerUploadResponse = await response.json();
    return data;
  },
};
