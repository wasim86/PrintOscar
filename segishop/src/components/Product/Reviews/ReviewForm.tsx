'use client';

import React, { useState } from 'react';
import { Star, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { CreateReview } from '@/types/api';

interface ReviewFormProps {
  productId: number;
  onSubmit: (review: CreateReview) => Promise<void>;
  isAuthenticated: boolean;
  userEmail?: string;
  userName?: string;
  loading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSubmit,
  isAuthenticated,
  userEmail = '',
  userName = '',
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateReview>({
    rating: 0,
    title: '',
    reviewText: '',
    reviewerName: userName,
    reviewerEmail: userEmail
  });
  const [errors, setErrors] = useState<Partial<CreateReview>>({});
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateReview> = {};

    if (formData.rating === 0) {
      newErrors.rating = 1; // Use 1 as error indicator for rating
    }

    if (!formData.reviewText.trim()) {
      newErrors.reviewText = 'Review text is required';
    } else if (formData.reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters long';
    } else if (formData.reviewText.trim().length > 1000) {
      newErrors.reviewText = 'Review cannot exceed 1000 characters';
    }

    if (!formData.reviewerName.trim()) {
      newErrors.reviewerName = 'Name is required';
    } else if (formData.reviewerName.trim().length > 100) {
      newErrors.reviewerName = 'Name cannot exceed 100 characters';
    }

    if (!formData.reviewerEmail.trim()) {
      newErrors.reviewerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reviewerEmail)) {
      newErrors.reviewerEmail = 'Please enter a valid email address';
    } else if (formData.reviewerEmail.length > 255) {
      newErrors.reviewerEmail = 'Email cannot exceed 255 characters';
    }

    if (formData.title && formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        reviewText: formData.reviewText.trim(),
        reviewerName: formData.reviewerName.trim(),
        reviewerEmail: formData.reviewerEmail.trim(),
        title: formData.title?.trim() || undefined
      });
      
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        rating: 0,
        title: '',
        reviewText: '',
        reviewerName: userName,
        reviewerEmail: userEmail
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || formData.rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`w-8 h-8 transition-colors ${
            isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
          }`}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setFormData(prev => ({ ...prev, rating: starValue }))}
        >
          <Star className={`w-full h-full ${isActive ? 'fill-current' : ''}`} />
        </button>
      );
    });
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-green-900 mb-2">Review Submitted!</h3>
        <p className="text-green-700">
          Thank you for your review. It will be visible once approved.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-4 text-green-600 hover:text-green-700 font-medium"
        >
          Write Another Review
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-1">
            {renderStars()}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Please select a rating
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Summarize your review in a few words"
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reviewText"
            rows={4}
            value={formData.reviewText}
            onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your experience with this product..."
            maxLength={1000}
          />
          <div className="mt-1 flex justify-between items-center">
            <div>
              {errors.reviewText && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.reviewText}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {formData.reviewText.length}/1000
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reviewerName"
            value={formData.reviewerName}
            onChange={(e) => setFormData(prev => ({ ...prev, reviewerName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your name"
            maxLength={100}
            disabled={isAuthenticated && userName}
          />
          {errors.reviewerName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.reviewerName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reviewerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="reviewerEmail"
            value={formData.reviewerEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, reviewerEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            maxLength={255}
            disabled={isAuthenticated && userEmail}
          />
          {errors.reviewerEmail && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.reviewerEmail}
            </p>
          )}
          {!isAuthenticated && (
            <p className="mt-1 text-sm text-gray-500">
              Your email will not be displayed publicly
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};
