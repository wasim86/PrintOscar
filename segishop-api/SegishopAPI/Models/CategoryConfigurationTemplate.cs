using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class CategoryConfigurationTemplate
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int ConfigurationTypeId { get; set; }

        public bool IsRequired { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public bool InheritToSubcategories { get; set; } = true;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;

        [ForeignKey("ConfigurationTypeId")]
        public virtual ConfigurationType ConfigurationType { get; set; } = null!;
    }
}
