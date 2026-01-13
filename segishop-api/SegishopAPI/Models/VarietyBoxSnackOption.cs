using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class VarietyBoxSnackOption
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int VarietyBoxOptionId { get; set; }

        [Required]
        public int SnackProductId { get; set; } // Points to actual snack products

        [Required]
        [StringLength(255)]
        public string DisplayName { get; set; } = string.Empty; // 'Sweet Coconut Balls - 80g'

        [StringLength(50)]
        public string? Size { get; set; } // '80g', '40g'

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("VarietyBoxOptionId")]
        public virtual ProductVarietyBoxOption VarietyBoxOption { get; set; } = null!;

        [ForeignKey("SnackProductId")]
        public virtual Product SnackProduct { get; set; } = null!;
    }
}
