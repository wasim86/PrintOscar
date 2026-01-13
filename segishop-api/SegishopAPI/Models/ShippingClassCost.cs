using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ShippingClassCost
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ShippingZoneMethodId { get; set; }

        [Required]
        public int ShippingClassId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Cost { get; set; } = 0;

        [Required]
        [StringLength(20)]
        public string CostType { get; set; } = "Fixed"; // 'Fixed', 'Percentage', 'PerItem'

        // Navigation properties
        [ForeignKey("ShippingZoneMethodId")]
        public virtual ShippingZoneMethod ShippingZoneMethod { get; set; } = null!;

        [ForeignKey("ShippingClassId")]
        public virtual ShippingClass ShippingClass { get; set; } = null!;
    }
}
