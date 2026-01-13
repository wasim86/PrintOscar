'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  X,
  Star,
  StarOff,
  Loader2,
  AlertCircle,
  Check,
  Move
} from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
  uploading: boolean;
  error?: string;
}

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 10,
  maxFileSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() => 
    images.map((url, index) => ({
      id: `existing-${index}`,
      url,
      isPrimary: index === 0,
      uploading: false
    }))
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update parent when images change
  useEffect(() => {
    const urls = uploadedImages.map(img => img.url);
    onChange(urls);
  }, [uploadedImages, onChange]);

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use ${acceptedTypes.join(', ')}.`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB.`;
    }
    
    return null;
  };

  // Real file upload using the API
  const uploadFile = async (file: File): Promise<string> => {
    const { ImageUploadApi } = await import('../../services/image-upload-api');

    // Validate file before upload
    const validation = ImageUploadApi.validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Upload to server
    const response = await ImageUploadApi.uploadImage(file);

    if (!response.success || !response.imageUrl) {
      throw new Error(response.message || 'Upload failed');
    }

    return response.imageUrl;
  };

  // Handle file selection
  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (uploadedImages.length + fileArray.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    // Process each file
    for (const file of fileArray) {
      const validationError = validateFile(file);
      
      const newImage: UploadedImage = {
        id: `upload-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file), // Temporary preview URL
        file,
        isPrimary: uploadedImages.length === 0, // First image is primary
        uploading: true,
        error: validationError || undefined
      };

      setUploadedImages(prev => [...prev, newImage]);

      // If validation passed, start upload
      if (!validationError) {
        try {
          const uploadedUrl = await uploadFile(file);
          
          setUploadedImages(prev => {
            return prev.map(img =>
              img.id === newImage.id
                ? { ...img, url: uploadedUrl, uploading: false }
                : img
            );
          });
        } catch (error) {
          setUploadedImages(prev => {
            return prev.map(img =>
              img.id === newImage.id
                ? { ...img, uploading: false, error: 'Upload failed' }
                : img
            );
          });
        }
      } else {
        // Mark as not uploading if validation failed
        setUploadedImages(prev => {
          return prev.map(img =>
            img.id === newImage.id
              ? { ...img, uploading: false }
              : img
          );
        });
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  // Remove image
  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // If we removed the primary image, make the first remaining image primary
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  // Set primary image (also reorder so primary is first)
  const setPrimaryImage = (id: string) => {
    setUploadedImages(prev => {
      const index = prev.findIndex(img => img.id === id);
      if (index < 0) return prev;

      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      // Insert at the beginning
      updated.unshift({ ...selected, isPrimary: true });
      // Mark all others as non-primary
      for (let i = 1; i < updated.length; i++) {
        if (updated[i].isPrimary) updated[i] = { ...updated[i], isPrimary: false };
      }
      return updated;
    });
  };

  // Move image
  const moveImage = (fromIndex: number, toIndex: number) => {
    setUploadedImages(prev => {
      const updated = [...prev];
      const [movedImage] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedImage);
      return updated;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragOver 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploadedImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploadedImages.length >= maxImages}
        />
        
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {uploadedImages.length >= maxImages ? 'Maximum images reached' : 'Upload Images'}
        </h3>
        <p className="text-gray-500 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-sm text-gray-400">
          Supports: {acceptedTypes.join(', ')} • Max {maxFileSize}MB each • Up to {maxImages} images
        </p>
      </div>

      {/* Image Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group bg-white rounded-lg overflow-hidden aspect-square flex items-center justify-center"
            >
              {/* Image */}
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  {/* Primary toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrimaryImage(image.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      image.isPrimary 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-yellow-100'
                    }`}
                    title={image.isPrimary ? 'Primary image' : 'Set as primary'}
                  >
                    {image.isPrimary ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status indicators */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Uploading...</p>
                  </div>
                </div>
              )}

              {image.error && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center">
                  <div className="text-white text-center p-2">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-xs">{image.error}</p>
                  </div>
                </div>
              )}

              {!image.uploading && !image.error && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              )}

              {/* Primary badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2">
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                </div>
              )}

              {/* Move handles */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white rounded p-1 cursor-move" title="Drag to reorder">
                  <Move className="h-3 w-3 text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {uploadedImages.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {uploadedImages.length} of {maxImages} images uploaded
          {uploadedImages.some(img => img.isPrimary) && (
            <span className="ml-2">• Primary image selected</span>
          )}
        </div>
      )}
    </div>
  );
};
