using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class ContactSubmission
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
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Message { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string HearAbout { get; set; } = string.Empty;

        public bool IsResponded { get; set; } = false;

        public DateTime? RespondedAt { get; set; }

        public string? RespondedBy { get; set; }

        public string? AdminNotes { get; set; }

        public string Status { get; set; } = "New"; // New, InProgress, Resolved, Closed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
