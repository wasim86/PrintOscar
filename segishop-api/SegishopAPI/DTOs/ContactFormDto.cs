using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class ContactFormDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Message { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string HearAbout { get; set; } = string.Empty;

        // reCAPTCHA token for spam protection
        public string? RecaptchaToken { get; set; }
    }

    public class ContactFormResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorCode { get; set; }
    }

    public class HandmadeInquiryDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [StringLength(5)]
        public string CountryCode { get; set; } = "+1";

        [Required]
        [StringLength(50)]
        public string PreferredContact { get; set; } = "email";

        [Required]
        [StringLength(100)]
        public string ItemType { get; set; } = string.Empty;

        public string? NeedByDate { get; set; }

        [StringLength(500)]
        public string? ShippingAddress { get; set; }

        [StringLength(50)]
        public string? DressLength { get; set; }

        [StringLength(100)]
        public string? DressColors { get; set; }

        [StringLength(20)]
        public string? TotalDresses { get; set; }

        [StringLength(50)]
        public string? BagStyle { get; set; }

        [StringLength(50)]
        public string? BagSize { get; set; }

        [StringLength(20)]
        public string? BagQuantity { get; set; }

        public bool FunKitFill { get; set; } = false;

        public bool CustomLabels { get; set; } = false;

        [Required]
        [StringLength(2000)]
        public string DetailedPreferences { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ProductLink { get; set; }

        [StringLength(100)]
        public string? ReferralSource { get; set; }
    }

    public class HandmadeInquiryResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorCode { get; set; }
    }

    public class NewsletterSubscriptionDto
    {
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        // reCAPTCHA token for spam protection
        public string? RecaptchaToken { get; set; }
    }

    public class NewsletterSubscriptionResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorCode { get; set; }
    }
}
