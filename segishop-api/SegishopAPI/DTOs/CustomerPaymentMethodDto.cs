using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class CustomerPaymentMethodDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? Last4Digits { get; set; }
        public string? CardBrand { get; set; }
        public string? ExpiryMonth { get; set; }
        public string? ExpiryYear { get; set; }
        public string? CardholderName { get; set; }
        public string? ZipCode { get; set; }

        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateCustomerPaymentMethodDto
    {
        [Required(ErrorMessage = "Payment method type is required")]
        [StringLength(20, ErrorMessage = "Type must be 20 characters or less")]
        [RegularExpression("^(card|paypal)$", ErrorMessage = "Type must be 'card' or 'paypal'")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Display name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Display name must be between 2 and 100 characters")]
        public string DisplayName { get; set; } = string.Empty;

        [StringLength(4, MinimumLength = 4, ErrorMessage = "Last 4 digits must be exactly 4 characters")]
        [RegularExpression("^[0-9]{4}$", ErrorMessage = "Last 4 digits must contain only numbers")]
        public string? Last4Digits { get; set; }

        [StringLength(50, ErrorMessage = "Card brand must be 50 characters or less")]
        [RegularExpression("^(Visa|Mastercard|American Express|Discover|JCB|Diners Club|UnionPay)$",
            ErrorMessage = "Card brand must be a valid card type")]
        public string? CardBrand { get; set; }

        [StringLength(2, MinimumLength = 2, ErrorMessage = "Expiry month must be exactly 2 characters")]
        [RegularExpression("^(0[1-9]|1[0-2])$", ErrorMessage = "Expiry month must be between 01 and 12")]
        public string? ExpiryMonth { get; set; }

        [StringLength(4, MinimumLength = 4, ErrorMessage = "Expiry year must be exactly 4 characters")]
        [RegularExpression("^[0-9]{4}$", ErrorMessage = "Expiry year must be a valid 4-digit year")]
        public string? ExpiryYear { get; set; }

        [StringLength(100, MinimumLength = 2, ErrorMessage = "Cardholder name must be between 2 and 100 characters")]
        public string? CardholderName { get; set; }

        [StringLength(10, ErrorMessage = "ZIP code must be 10 characters or less")]
        [RegularExpression(@"^[0-9]{5}(-[0-9]{4})?$", ErrorMessage = "Invalid ZIP code format")]
        public string? ZipCode { get; set; }

        [StringLength(255)]
        public string? StripePaymentMethodId { get; set; }

        [StringLength(255)]
        public string? PayPalPaymentMethodId { get; set; }

        public bool IsDefault { get; set; } = false;


    }

    public class UpdateCustomerPaymentMethodDto
    {
        [StringLength(100)]
        public string? DisplayName { get; set; }



        public bool? IsDefault { get; set; }

        public bool? IsActive { get; set; }


    }



    public class SetDefaultPaymentMethodDto
    {
        [Required]
        public int PaymentMethodId { get; set; }
    }
}
