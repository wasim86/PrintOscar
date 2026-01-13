using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ShippingZoneMethod
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ShippingZoneId { get; set; }

        [Required]
        public int ShippingMethodId { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty; // Display name for customers

        public bool IsEnabled { get; set; } = true;

        public int SortOrder { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal BaseCost { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinOrderAmount { get; set; } // For free shipping threshold

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxOrderAmount { get; set; }

        public int? EstimatedDaysMin { get; set; }

        public int? EstimatedDaysMax { get; set; }

        public bool RequiresCoupon { get; set; } = false; // For free shipping with coupon

        // Navigation properties
        [ForeignKey("ShippingZoneId")]
        public virtual ShippingZone ShippingZone { get; set; } = null!;

        [ForeignKey("ShippingMethodId")]
        public virtual ShippingMethod ShippingMethod { get; set; } = null!;

        public virtual ICollection<ShippingClassCost> ClassCosts { get; set; } = new List<ShippingClassCost>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
