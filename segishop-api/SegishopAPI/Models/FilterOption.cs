using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class FilterOption
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(255)]
        public string DisplayName { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public int CategoryId { get; set; }

        [Required]
        [StringLength(50)]
        public string FilterType { get; set; } = string.Empty; // range, checkbox, radio, etc.

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxValue { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Category Category { get; set; } = null!;
        public virtual ICollection<FilterOptionValue> FilterOptionValues { get; set; } = new List<FilterOptionValue>();
        public virtual ICollection<ProductFilterValue> ProductFilterValues { get; set; } = new List<ProductFilterValue>();
    }
}
