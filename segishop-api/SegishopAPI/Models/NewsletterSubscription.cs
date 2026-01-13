using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class NewsletterSubscription
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UnsubscribedAt { get; set; }

        public string? Source { get; set; } // e.g., "homepage", "footer", "checkout"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
