using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ShippingZoneRegion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ShippingZoneId { get; set; }

        [Required]
        [StringLength(20)]
        public string RegionType { get; set; } = string.Empty; // 'Country', 'State', 'PostalCode', 'PostalRange'

        [Required]
        [StringLength(10)]
        public string RegionCode { get; set; } = string.Empty; // 'US', 'MD', '20001', '20001-20099'

        [Required]
        [StringLength(100)]
        public string RegionName { get; set; } = string.Empty;

        public bool IsIncluded { get; set; } = true; // TRUE = Include, FALSE = Exclude

        public int Priority { get; set; } = 0; // Higher priority overrides lower

        // Navigation properties
        [ForeignKey("ShippingZoneId")]
        public virtual ShippingZone ShippingZone { get; set; } = null!;
    }
}
