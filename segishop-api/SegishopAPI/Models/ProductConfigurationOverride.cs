using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ProductConfigurationOverride
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int ConfigurationTypeId { get; set; }

        [Required]
        [StringLength(20)]
        public string OverrideType { get; set; } = "inherit"; // inherit, custom, disabled

        public string? CustomOptions { get; set; } // JSON for custom options

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        [ForeignKey("ConfigurationTypeId")]
        public virtual ConfigurationType ConfigurationType { get; set; } = null!;
    }
}
