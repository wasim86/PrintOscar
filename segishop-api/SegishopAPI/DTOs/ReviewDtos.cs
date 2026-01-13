using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class ProductReviewDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int? UserId { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public string ReviewerEmail { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Title { get; set; }
        public string ReviewText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsApproved { get; set; }
        public bool IsVerifiedPurchase { get; set; }
    }

    public class CreateReviewDto
    {
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
        public string? Title { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Review text must be between 10 and 1000 characters")]
        public string ReviewText { get; set; } = string.Empty;

        [Required]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string ReviewerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Please provide a valid email address")]
        [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
        public string ReviewerEmail { get; set; } = string.Empty;
    }

    public class ReviewStatsDto
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public Dictionary<int, int> RatingDistribution { get; set; } = new();
    }

    public class ProductReviewsResponseDto
    {
        public List<ProductReviewDto> Reviews { get; set; } = new();
        public ReviewStatsDto Stats { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}
