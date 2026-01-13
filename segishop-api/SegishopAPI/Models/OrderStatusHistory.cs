using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class OrderStatusHistory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string FromStatus { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ToStatus { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? ChangedBy { get; set; } // Admin user who made the change

        [StringLength(50)]
        public string? ChangeReason { get; set; } // "AdminUpdate", "SystemUpdate", "PaymentUpdate", etc.

        public bool CustomerNotified { get; set; } = false;

        [StringLength(255)]
        public string? NotificationMethod { get; set; } // "Email", "SMS", etc.

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(1000)]
        public string? Metadata { get; set; } // JSON string for additional data
    }
}
