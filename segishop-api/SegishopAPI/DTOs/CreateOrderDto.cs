using System.ComponentModel.DataAnnotations;
using SegishopAPI.Attributes;

namespace SegishopAPI.DTOs
{
    [ValidateGuestOrUser]
    public class CreateOrderDto
    {
        // For authenticated users - null for guest orders
        public int? UserId { get; set; }

        // Guest customer information (required when UserId is null)
        [StringLength(255)]
        public string? GuestEmail { get; set; }

        [StringLength(100)]
        public string? GuestFirstName { get; set; }

        [StringLength(100)]
        public string? GuestLastName { get; set; }

        [StringLength(20)]
        public string? GuestPhone { get; set; }



        [Required]
        public ShippingAddressDto ShippingAddress { get; set; } = null!;

        [Required]
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();

        [Required]
        public PaymentInfoDto PaymentInfo { get; set; } = null!;

        [Required]
        public CreateOrderTotalsDto Totals { get; set; } = null!;

        public int? CouponId { get; set; }
        public string? CouponCode { get; set; }
        public decimal CouponDiscountAmount { get; set; } = 0;

        public int? ShippingZoneMethodId { get; set; }
        public string? ShippingMethodTitle { get; set; }

        public string? Notes { get; set; }
    }

    public class OrderItemDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [StringLength(255)]
        public string ProductName { get; set; } = string.Empty;

        public string? ProductSKU { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal UnitPrice { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }

        public string? ProductAttributes { get; set; }

        public List<OrderItemConfigurationDto>? Configurations { get; set; }
    }

    public class OrderItemConfigurationDto
    {
        [Required]
        public int ConfigurationTypeId { get; set; }

        public int? ConfigurationOptionId { get; set; }

        public string? CustomValue { get; set; }
    }

    public class PaymentInfoDto
    {
        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // "stripe", "paypal"

        [Required]
        [StringLength(50)]
        public string PaymentStatus { get; set; } = string.Empty; // "success", "pending", "failed"

        public string? PaymentTransactionId { get; set; }

        public string? PaymentIntentId { get; set; }

        public decimal Amount { get; set; }

        public string? Currency { get; set; } = "USD";

        public string? PaymentMethodDetails { get; set; } // JSON string for card details, etc.
    }

    public class CreateOrderTotalsDto
    {
        [Required]
        public decimal SubTotal { get; set; }

        public decimal TaxAmount { get; set; } = 0;

        public decimal ShippingAmount { get; set; } = 0;

        public decimal DiscountAmount { get; set; } = 0;

        [Required]
        public decimal TotalAmount { get; set; }
    }
}
