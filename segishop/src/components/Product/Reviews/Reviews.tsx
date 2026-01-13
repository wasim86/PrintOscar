'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewStats } from './ReviewStats';
import { ReviewsList } from './ReviewsList';
import { ReviewForm } from './ReviewForm';
import { ProductReviewsResponse, CreateReview } from '@/types/api';
import api from '@/services/api';

interface ReviewsProps {
  productId: number;
  isAuthenticated: boolean;
  userEmail?: string;
  userName?: string;
}

export const Reviews: React.FC<ReviewsProps> = ({
  productId,
  isAuthenticated,
  userEmail,
  userName
}) => {
  const [reviewsData, setReviewsData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submittingReview, setSubmittingReview] = useState(false);

  const pageSize = 5;

  const fetchReviews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProductReviews(productId, page, pageSize);
      
      if (response.success) {
        setReviewsData(response.data);
      } else {
        setError('Failed to load reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [productId, currentPage]);

  const handleSubmitReview = async (review: CreateReview) => {
    try {
      setSubmittingReview(true);
      const response = await api.createProductReview(productId, review);
      
      if (response.success) {
        // Refresh reviews to show the new review
        await fetchReviews(1);
        setCurrentPage(1);
      } else {
        throw new Error(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      throw err; // Re-throw to let the form handle the error
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!reviewsData || reviewsData.totalPages <= 1) return null;

    const { page, totalPages, hasNextPage, hasPreviousPage } = reviewsData;

    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-700">
          Showing page {page} of {totalPages}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPreviousPage}
            className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (page <= 3) {
                pageNumber = index + 1;
              } else if (page >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = page - 2 + index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    pageNumber === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNextPage}
            className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => fetchReviews(currentPage)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Statistics */}
      {reviewsData && (
        <ReviewStats stats={reviewsData.stats} />
      )}

      {/* Write Review Form */}
      <ReviewForm
        productId={productId}
        onSubmit={handleSubmitReview}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        userName={userName}
        loading={submittingReview}
      />

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Customer Reviews
          {reviewsData && ` (${reviewsData.stats.totalReviews})`}
        </h3>
        
        <ReviewsList
          reviews={reviewsData?.reviews || []}
          loading={loading}
        />

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};
