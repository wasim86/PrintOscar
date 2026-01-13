using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class HandmadeInquiry
    {
        [Key]
        public int Id { get; set; }

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

        public bool IsResponded { get; set; } = false;

        public DateTime? RespondedAt { get; set; }

        public string? RespondedBy { get; set; }

        public string? AdminNotes { get; set; }

        public string Status { get; set; } = "New"; // New, InProgress, Quoted, Accepted, InProduction, Completed, Cancelled

        public decimal? QuotedPrice { get; set; }

        public DateTime? EstimatedCompletionDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
