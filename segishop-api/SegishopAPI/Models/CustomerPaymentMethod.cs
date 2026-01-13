using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class CustomerPaymentMethod
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public virtual User Customer { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // "card", "paypal"

        [Required]
        [StringLength(100)]
        public string DisplayName { get; set; } = string.Empty; // e.g., "Visa ending in 4242"

        [StringLength(4)]
        public string? Last4Digits { get; set; } // Last 4 digits for cards

        [StringLength(50)]
        public string? CardBrand { get; set; } // "Visa", "Mastercard", "Amex", etc.

        [StringLength(2)]
        public string? ExpiryMonth { get; set; }

        [StringLength(4)]
        public string? ExpiryYear { get; set; }

        [StringLength(100)]
        public string? CardholderName { get; set; }

        [StringLength(10)]
        public string? ZipCode { get; set; }



        [StringLength(255)]
        public string? StripePaymentMethodId { get; set; } // Stripe payment method ID

        [StringLength(255)]
        public string? PayPalPaymentMethodId { get; set; } // PayPal payment method ID

        public bool IsDefault { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
