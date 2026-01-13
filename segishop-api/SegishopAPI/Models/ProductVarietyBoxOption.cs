using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ProductVarietyBoxOption
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; } // The variety box product

        [Required]
        [StringLength(100)]
        public string SlotName { get; set; } = string.Empty; // 'Snack 1', 'Snack 2', 'Snack 3'

        [Required]
        public int SlotQuantity { get; set; } // 4, 3, 1

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        public virtual ICollection<VarietyBoxSnackOption> SnackOptions { get; set; } = new List<VarietyBoxSnackOption>();
    }
}
