using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class TrackOrderRequestDto
    {
        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string BillingEmail { get; set; } = string.Empty;
    }

    public class OrderTrackingResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorCode { get; set; }
        public OrderTrackingDataDto? Data { get; set; }
    }

    public class OrderTrackingDataDto
    {
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public DateTime? EstimatedDelivery { get; set; }
        public string? TrackingNumber { get; set; }
        public string? Carrier { get; set; }
        public decimal Total { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        
        public OrderTrackingCustomerDto CustomerInfo { get; set; } = new();
        public OrderTrackingAddressDto ShippingAddress { get; set; } = new();
        public List<OrderTrackingItemDto> Items { get; set; } = new();
        public List<OrderTrackingTimelineDto> Timeline { get; set; } = new();
    }

    public class OrderTrackingCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }

    public class OrderTrackingAddressDto
    {
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class OrderTrackingItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
    }

    public class OrderTrackingTimelineDto
    {
        public string Status { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Location { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
