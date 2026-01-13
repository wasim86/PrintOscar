using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class PaymentRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // "Stripe", "PayPal", "CreditCard", etc.

        [Required]
        [StringLength(50)]
        public string PaymentType { get; set; } = string.Empty; // "Payment", "Refund", "PartialRefund"

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty; // "Pending", "Completed", "Failed", "Cancelled"

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = "USD";

        [StringLength(255)]
        public string? TransactionId { get; set; } // External payment provider transaction ID

        [StringLength(255)]
        public string? PaymentIntentId { get; set; } // Stripe Payment Intent ID

        [StringLength(255)]
        public string? ChargeId { get; set; } // Stripe Charge ID

        [StringLength(255)]
        public string? RefundId { get; set; } // Refund transaction ID

        public int? RefundedFromPaymentId { get; set; } // Reference to original payment for refunds

        [ForeignKey("RefundedFromPaymentId")]
        public virtual PaymentRecord? RefundedFromPayment { get; set; }

        [StringLength(500)]
        public string? PaymentMethodDetails { get; set; } // JSON string with payment method details

        [StringLength(500)]
        public string? FailureReason { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        [StringLength(1000)]
        public string? Metadata { get; set; } // JSON string for additional data

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? ProcessedBy { get; set; } // Admin user who processed refund

        // Navigation properties
        public virtual ICollection<PaymentRecord> Refunds { get; set; } = new List<PaymentRecord>();
    }
}
