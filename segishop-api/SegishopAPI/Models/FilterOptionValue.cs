using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class FilterOptionValue
    {
        [Key]
        public int Id { get; set; }

        public int FilterOptionId { get; set; }

        [Required]
        [StringLength(255)]
        public string Value { get; set; } = string.Empty;

        [StringLength(255)]
        public string DisplayValue { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [StringLength(50)]
        public string? ColorCode { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual FilterOption FilterOption { get; set; } = null!;
        public virtual ICollection<ProductFilterValue> ProductFilterValues { get; set; } = new List<ProductFilterValue>();
    }
}
