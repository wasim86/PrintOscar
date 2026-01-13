using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class OrderItemConfiguration
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderItemId { get; set; }

        [Required]
        public int ConfigurationTypeId { get; set; }

        public int? ConfigurationOptionId { get; set; } // NULL for custom text/number values

        [StringLength(500)]
        public string? CustomValue { get; set; } // For text/number inputs

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("OrderItemId")]
        public virtual OrderItem OrderItem { get; set; } = null!;

        [ForeignKey("ConfigurationTypeId")]
        public virtual ConfigurationType ConfigurationType { get; set; } = null!;

        [ForeignKey("ConfigurationOptionId")]
        public virtual ConfigurationOption? ConfigurationOption { get; set; }
    }
}
