using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public int? ParentId { get; set; }

        public bool IsActive { get; set; } = true;

        public int SortOrder { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // SEO fields
        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }

        // Product configuration type for this category
        [StringLength(50)]
        public string ConfigurationType { get; set; } = "Regular"; // 'Regular', 'VarietyBox', 'SmallBulk'

        // Navigation properties
        public virtual Category? Parent { get; set; }
        public virtual ICollection<Category> Children { get; set; } = new List<Category>();
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
        public virtual ICollection<FilterOption> FilterOptions { get; set; } = new List<FilterOption>();
        public virtual ICollection<CategoryConfigurationTemplate> ConfigurationTemplates { get; set; } = new List<CategoryConfigurationTemplate>();
    }
}
