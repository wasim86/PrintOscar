using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class AdminOrderListRequestDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Status { get; set; }
        public string? PaymentStatus { get; set; }
        public string? PaymentMethod { get; set; }
        public string? CustomerEmail { get; set; }
        public string? OrderNumber { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
        public string? SortBy { get; set; } = "CreatedAt"; // CreatedAt, TotalAmount, OrderNumber
        public string? SortOrder { get; set; } = "desc"; // asc, desc
    }

    public class AdminOrderListResponseDto
    {
        public List<AdminOrderSummaryDto> Orders { get; set; } = new List<AdminOrderSummaryDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public AdminOrderStatsDto Stats { get; set; } = new AdminOrderStatsDto();
    }

    public class AdminOrderSummaryDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int ItemCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Customer Information
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        
        // Shipping Information
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingCountry { get; set; } = string.Empty;
        public string? ShippingMethodTitle { get; set; }

        // Tracking Information
        public string? TrackingNumber { get; set; }
        public string? CourierService { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }

        // Payment Information
        public string? PaymentTransactionId { get; set; }

        // Coupon Information
        public string? CouponCode { get; set; }
        public decimal CouponDiscountAmount { get; set; }
    }

    public class AdminOrderStatsDto
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int ConfirmedOrders { get; set; }
        public int FailedOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageOrderValue { get; set; }
    }

    public class AdminOrderDetailDto : OrderResponseDto
    {
        // Additional admin-specific fields
        public List<AdminOrderActionDto> AvailableActions { get; set; } = new List<AdminOrderActionDto>();
        public List<AdminOrderHistoryDto> StatusHistory { get; set; } = new List<AdminOrderHistoryDto>();
        
        // Billing Information (admin can see billing details)
        public string? BillingName { get; set; }
        public string? BillingAddress { get; set; }
        public string? BillingCity { get; set; }
        public string? BillingState { get; set; }
        public string? BillingZip { get; set; }
        public string? BillingCountry { get; set; }
        public string? BillingPhone { get; set; }
    }

    public class AdminOrderActionDto
    {
        public string Action { get; set; } = string.Empty; // "confirm", "cancel", "refund", "ship"
        public string Label { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public string? Reason { get; set; }
    }

    public class AdminOrderHistoryDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; } // Admin user who made the change
    }

    public class UpdateOrderStatusDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool NotifyCustomer { get; set; } = true;

        // Tracking information
        [StringLength(100)]
        public string? TrackingNumber { get; set; }

        [StringLength(50)]
        public string? CourierService { get; set; }

        public DateTime? EstimatedDeliveryDate { get; set; }
    }

    public class UpdateOrderDto
    {
        [StringLength(500)]
        public string? Notes { get; set; }
        
        [StringLength(255)]
        public string? ShippingMethodTitle { get; set; }
        
        // Allow updating shipping address
        public UpdateShippingAddressDto? ShippingAddress { get; set; }
    }

    public class UpdateShippingAddressDto
    {
        [Required]
        [StringLength(255)]
        public string ShippingName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        public string ShippingAddress { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ShippingCity { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ShippingState { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string ShippingZip { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ShippingCountry { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? ShippingPhone { get; set; }
    }

    public class AdminOrderActionResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorCode { get; set; }
        public AdminOrderDetailDto? Order { get; set; }
    }


}
