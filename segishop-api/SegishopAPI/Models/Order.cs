using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        // For authenticated users - null for guest orders
        public int? UserId { get; set; }

        // Guest customer information (used when UserId is null)
        [StringLength(255)]
        public string? GuestEmail { get; set; }

        [StringLength(100)]
        public string? GuestFirstName { get; set; }

        [StringLength(100)]
        public string? GuestLastName { get; set; }

        [StringLength(20)]
        public string? GuestPhone { get; set; }



        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        // Coupon information
        public int? CouponId { get; set; }

        [StringLength(50)]
        public string? CouponCode { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CouponDiscountAmount { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // Shipping Address
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

        // Billing Address (can be same as shipping)
        [StringLength(255)]
        public string? BillingName { get; set; }

        [StringLength(255)]
        public string? BillingAddress { get; set; }

        [StringLength(100)]
        public string? BillingCity { get; set; }

        [StringLength(100)]
        public string? BillingState { get; set; }

        [StringLength(20)]
        public string? BillingZip { get; set; }

        [StringLength(100)]
        public string? BillingCountry { get; set; }

        [StringLength(20)]
        public string? BillingPhone { get; set; }

        // Payment Info
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed, Refunded

        [StringLength(255)]
        public string? PaymentTransactionId { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Shipping tracking
        public int? ShippingZoneMethodId { get; set; }

        [StringLength(100)]
        public string? ShippingMethodTitle { get; set; }

        // Dynamic tracking information
        [StringLength(100)]
        public string? TrackingNumber { get; set; }

        [StringLength(50)]
        public string? CourierService { get; set; }

        public DateTime? EstimatedDeliveryDate { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("ShippingZoneMethodId")]
        public virtual ShippingZoneMethod? ShippingZoneMethod { get; set; }

        [ForeignKey("CouponId")]
        public virtual Coupon? Coupon { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<PaymentRecord> PaymentRecords { get; set; } = new List<PaymentRecord>();
        public virtual ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
        public virtual ICollection<CouponUsage> CouponUsages { get; set; } = new List<CouponUsage>();
    }
}
