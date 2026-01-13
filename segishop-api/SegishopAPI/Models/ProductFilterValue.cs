using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ProductFilterValue
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int FilterOptionId { get; set; }

        public int? FilterOptionValueId { get; set; }

        [StringLength(500)]
        public string? CustomValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? NumericValue { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Product Product { get; set; } = null!;
        public virtual FilterOption FilterOption { get; set; } = null!;
        public virtual FilterOptionValue? FilterOptionValue { get; set; }
    }
}
