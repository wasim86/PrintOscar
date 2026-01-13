'use client';

import React from 'react';
import { Star, CheckCircle, User } from 'lucide-react';
import { ProductReview } from '@/types/api';

interface ReviewsListProps {
  reviews: ProductReview[];
  loading?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, loading }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>

            {/* Review Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium text-gray-900">{review.reviewerName}</h4>
                {review.isVerifiedPurchase && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Purchase</span>
                  </div>
                )}
              </div>

              {/* Rating and Date */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              {/* Review Title */}
              {review.title && (
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              )}

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {review.reviewText}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
