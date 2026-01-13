using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ConfigurationType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty; // dropdown, radio, checkbox, number, text

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsRequired { get; set; } = false;

        public bool ShowPriceImpact { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<ConfigurationOption> Options { get; set; } = new List<ConfigurationOption>();
        public virtual ICollection<CategoryConfigurationTemplate> CategoryTemplates { get; set; } = new List<CategoryConfigurationTemplate>();
        public virtual ICollection<ProductConfigurationOverride> ProductOverrides { get; set; } = new List<ProductConfigurationOverride>();
    }
}
