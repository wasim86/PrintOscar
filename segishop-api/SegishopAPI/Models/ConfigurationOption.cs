using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ConfigurationOption
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ConfigurationTypeId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Value { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal PriceModifier { get; set; } = 0;

        [Required]
        [StringLength(20)]
        public string PriceType { get; set; } = "fixed"; // fixed, percentage, multiplier, replace

        public bool IsDefault { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ConfigurationTypeId")]
        public virtual ConfigurationType ConfigurationType { get; set; } = null!;
    }
}
