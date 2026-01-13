using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class ShippingMethod
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string MethodType { get; set; } = string.Empty; // 'FlatRate', 'FreeShipping', 'LocalPickup'

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsEnabled { get; set; } = true;

        public bool IsTaxable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<ShippingZoneMethod> ZoneMethods { get; set; } = new List<ShippingZoneMethod>();
    }
}
