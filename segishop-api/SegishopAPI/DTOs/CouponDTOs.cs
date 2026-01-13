using System.ComponentModel.DataAnnotations;
using SegishopAPI.Models;

namespace SegishopAPI.DTOs
{
    // Coupon DTO for responses
    public class CouponDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public CouponType Type { get; set; }
        public decimal Value { get; set; }
        public decimal? MinimumOrderAmount { get; set; }
        public decimal? MaximumDiscountAmount { get; set; }
        public int? MaxTotalUses { get; set; }
        public int? MaxUsesPerUser { get; set; }
        public int CurrentTotalUses { get; set; }
        public bool IsFirstOrderOnly { get; set; }
        public bool IsUserSpecific { get; set; }
        public string? AllowedUserEmails { get; set; }
        public bool IsActive { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidUntil { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
    }

    // Create Coupon DTO
    public class CreateCouponDto
    {
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public CouponType Type { get; set; }

        [Range(0, 999999.99)]
        public decimal Value { get; set; }

        [Range(0.01, 999999.99)]
        public decimal? MinimumOrderAmount { get; set; }

        [Range(0.01, 999999.99)]
        public decimal? MaximumDiscountAmount { get; set; }

        [Range(1, int.MaxValue)]
        public int? MaxTotalUses { get; set; }

        [Range(1, int.MaxValue)]
        public int? MaxUsesPerUser { get; set; }

        public bool IsFirstOrderOnly { get; set; } = false;

        public bool IsUserSpecific { get; set; } = false;

        [StringLength(2000)]
        public string? AllowedUserEmails { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime? ValidFrom { get; set; }

        public DateTime? ValidUntil { get; set; }
    }

    // Update Coupon DTO
    public class UpdateCouponDto
    {
        [StringLength(255)]
        public string? Description { get; set; }

        public CouponType? Type { get; set; }

        [Range(0.01, 999999.99)]
        public decimal? Value { get; set; }

        [Range(0.01, 999999.99)]
        public decimal? MinimumOrderAmount { get; set; }

        [Range(0.01, 999999.99)]
        public decimal? MaximumDiscountAmount { get; set; }

        [Range(1, int.MaxValue)]
        public int? MaxTotalUses { get; set; }

        [Range(1, int.MaxValue)]
        public int? MaxUsesPerUser { get; set; }

        public bool? IsFirstOrderOnly { get; set; }

        public bool? IsUserSpecific { get; set; }

        [StringLength(2000)]
        public string? AllowedUserEmails { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? ValidFrom { get; set; }

        public DateTime? ValidUntil { get; set; }
    }

    // Coupon validation request
    public class ValidateCouponDto
    {
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 999999.99)]
        public decimal OrderSubtotal { get; set; }
    }

    // Coupon validation response
    public class CouponValidationResponseDto
    {
        public bool Success { get; set; } = true;
        public bool IsValid { get; set; }
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
        public CouponDto? Coupon { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalTotal { get; set; }
    }

    // Apply coupon request
    public class ApplyCouponDto
    {
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 999999.99)]
        public decimal OrderSubtotal { get; set; }

        [Required]
        [Range(0, 999999.99)]
        public decimal ShippingAmount { get; set; }

        [Required]
        [Range(0, 999999.99)]
        public decimal TaxAmount { get; set; }
    }

    // Coupon usage DTO
    public class CouponUsageDto
    {
        public int Id { get; set; }
        public int CouponId { get; set; }
        public string CouponCode { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public decimal DiscountAmount { get; set; }
        public decimal OrderSubtotal { get; set; }
        public DateTime UsedAt { get; set; }
    }

    // Coupon statistics DTO
    public class CouponStatsDto
    {
        public int TotalCoupons { get; set; }
        public int ActiveCoupons { get; set; }
        public int ExpiredCoupons { get; set; }
        public int TotalUsages { get; set; }
        public decimal TotalDiscountGiven { get; set; }
        public List<CouponUsageStatsDto> TopCoupons { get; set; } = new();
    }

    public class CouponUsageStatsDto
    {
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int UsageCount { get; set; }
        public decimal TotalDiscountGiven { get; set; }
    }

    // Coupon list response
    public class CouponsResponseDto
    {
        public bool Success { get; set; } = true;
        public List<CouponDto> Coupons { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string? ErrorMessage { get; set; }
    }

    // Single coupon response
    public class CouponResponseDto
    {
        public bool Success { get; set; } = true;
        public CouponDto? Coupon { get; set; }
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
    }

    // Coupon usage list response
    public class CouponUsagesResponseDto
    {
        public bool Success { get; set; } = true;
        public List<CouponUsageDto> Usages { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string? ErrorMessage { get; set; }
    }

    // Available coupons for display
    public class CouponAvailableDto
    {
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public CouponType Type { get; set; }
        public decimal Value { get; set; }
    }

    // Available coupons response
    public class CouponAvailableResponseDto
    {
        public bool Success { get; set; }
        public List<CouponAvailableDto> Coupons { get; set; } = new List<CouponAvailableDto>();
        public string? ErrorMessage { get; set; }
    }

    // Admin Dashboard DTOs
    public class AdminDashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalProducts { get; set; }
        public decimal RevenueChange { get; set; }
        public decimal OrdersChange { get; set; }
        public decimal CustomersChange { get; set; }
        public decimal ProductsChange { get; set; }
        public List<AdminDashboardOrderDto> RecentOrders { get; set; } = new List<AdminDashboardOrderDto>();
        public List<AdminDashboardProductDto> TopProducts { get; set; } = new List<AdminDashboardProductDto>();
    }

    public class AdminDashboardOrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int ItemCount { get; set; }
    }

    public class AdminDashboardProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Sales { get; set; }
        public decimal Revenue { get; set; }
        public string? ImageUrl { get; set; }
    }
}
