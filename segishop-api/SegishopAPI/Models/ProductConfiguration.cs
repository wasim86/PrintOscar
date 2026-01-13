using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ProductConfiguration
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [StringLength(50)]
        public string ConfigurationType { get; set; } = string.Empty; // 'Regular', 'VarietyBox', 'SmallBulk'

        public bool HasQuantitySets { get; set; } = false; // For regular snacks (1x, 12 pack, 24 pack)

        public bool HasVarietyBoxOptions { get; set; } = false; // For variety boxes with choices

        public bool HasBulkQuantity { get; set; } = false; // For small bulk items

        public int? MinBulkQuantity { get; set; } // Minimum bulk quantity (e.g., 24)

        public int? MaxBulkQuantity { get; set; } // Maximum bulk quantity (e.g., 48)

        [StringLength(255)]
        public string? DefaultHighlight { get; set; } // Default highlight like "1.5oz / 40g each"

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
