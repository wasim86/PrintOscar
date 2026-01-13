using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class PaymentGatewaySettings
    {
        [Key]
        public int Id { get; set; }

        public bool StripeEnabled { get; set; } = false;
        [StringLength(256)]
        public string? StripeSecretKey { get; set; }
        [StringLength(256)]
        public string? StripePublishableKey { get; set; }

        public bool PayPalEnabled { get; set; } = false;
        [StringLength(256)]
        public string? PayPalClientId { get; set; }
        [StringLength(256)]
        public string? PayPalClientSecret { get; set; }
        [StringLength(256)]
        public string? PayPalBaseUrl { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        [StringLength(255)]
        public string? UpdatedBy { get; set; }
    }
}