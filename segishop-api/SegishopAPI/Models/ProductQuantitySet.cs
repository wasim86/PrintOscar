using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ProductQuantitySet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty; // '1x_singles', '12_pack', '24_pack'

        [Required]
        [StringLength(100)]
        public string DisplayName { get; set; } = string.Empty; // '1x singles', '12 pack', '24 pack'

        [Required]
        public int Quantity { get; set; } // 1, 12, 24

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal PriceMultiplier { get; set; } // 1.0, 12.0, 24.0

        public bool IsDefault { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
