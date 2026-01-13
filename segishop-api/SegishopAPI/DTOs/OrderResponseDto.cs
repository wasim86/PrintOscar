namespace SegishopAPI.DTOs
{
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ShippingAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? PaymentTransactionId { get; set; }
        public string? Notes { get; set; }

        // Shipping Information
        public string ShippingName { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingZip { get; set; } = string.Empty;
        public string ShippingCountry { get; set; } = string.Empty;
        public string? ShippingPhone { get; set; }
        public string? ShippingMethodTitle { get; set; }

        // Coupon Information
        public string? CouponCode { get; set; }
        public decimal CouponDiscountAmount { get; set; }

        // Tracking Information
        public string? TrackingNumber { get; set; }
        public string? CourierService { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }

        // Customer Information
        public CustomerInfoDto Customer { get; set; } = null!;

        // Order Items
        public List<OrderItemResponseDto> Items { get; set; } = new List<OrderItemResponseDto>();
    }

    public class OrderItemResponseDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductSKU { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string? ProductAttributes { get; set; }
        public List<OrderItemConfigurationResponseDto>? Configurations { get; set; }
    }

    public class OrderItemConfigurationResponseDto
    {
        public int Id { get; set; }
        public int ConfigurationTypeId { get; set; }
        public string ConfigurationTypeName { get; set; } = string.Empty;
        public int? ConfigurationOptionId { get; set; }
        public string? ConfigurationOptionName { get; set; }
        public string? CustomValue { get; set; }
    }

    public class CustomerInfoDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }

    public class CreateOrderResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public OrderResponseDto? Order { get; set; }
        public string? ErrorCode { get; set; }
        public List<string>? ValidationErrors { get; set; }
    }

    public class OrderListResponseDto
    {
        public List<OrderSummaryDto> Orders { get; set; } = new List<OrderSummaryDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class OrderSummaryDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int ItemCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string? ShippingMethodTitle { get; set; }
    }
}
