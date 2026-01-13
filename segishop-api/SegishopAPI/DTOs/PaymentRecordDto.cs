using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class PaymentRecordDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string? TransactionId { get; set; }
        public string? PaymentIntentId { get; set; }
        public string? ChargeId { get; set; }
        public string? RefundId { get; set; }
        public int? RefundedFromPaymentId { get; set; }
        public string? PaymentMethodDetails { get; set; }
        public string? FailureReason { get; set; }
        public string? Notes { get; set; }
        public string? Metadata { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? ProcessedBy { get; set; }
    }

    public class CreatePaymentRecordDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string PaymentType { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [StringLength(3)]
        public string Currency { get; set; } = "USD";

        [StringLength(255)]
        public string? TransactionId { get; set; }

        [StringLength(255)]
        public string? PaymentIntentId { get; set; }

        [StringLength(255)]
        public string? ChargeId { get; set; }

        [StringLength(255)]
        public string? RefundId { get; set; }

        public int? RefundedFromPaymentId { get; set; }

        [StringLength(500)]
        public string? PaymentMethodDetails { get; set; }

        [StringLength(500)]
        public string? FailureReason { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        [StringLength(1000)]
        public string? Metadata { get; set; }

        [StringLength(100)]
        public string? ProcessedBy { get; set; }
    }

    public class RefundRequestDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public int PaymentRecordId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Notes { get; set; }

        public bool NotifyCustomer { get; set; } = true;
    }

    public class RefundResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorCode { get; set; }
        public PaymentRecordDto? RefundRecord { get; set; }
        public decimal RefundedAmount { get; set; }
        public decimal RemainingAmount { get; set; }
    }

    public class PaymentSummaryDto
    {
        public decimal TotalPaid { get; set; }
        public decimal TotalRefunded { get; set; }
        public decimal NetAmount { get; set; }
        public int PaymentCount { get; set; }
        public int RefundCount { get; set; }
        public List<PaymentRecordDto> Payments { get; set; } = new List<PaymentRecordDto>();
        public List<PaymentRecordDto> Refunds { get; set; } = new List<PaymentRecordDto>();
    }
}
