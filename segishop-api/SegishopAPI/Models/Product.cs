using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string? LongDescription { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SalePrice { get; set; }

        [StringLength(100)]
        public string? SKU { get; set; }

        public int Stock { get; set; } = 0;

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public string? ImageGallery { get; set; } // JSON array of image URLs

        [Required]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsFeatured { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // SEO fields
        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }

        // Product attributes (JSON)
        public string? Attributes { get; set; }

        // Shipping
        public int? ShippingClassId { get; set; }

        // Navigation properties
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;

        [ForeignKey("ShippingClassId")]
        public virtual ShippingClass? ShippingClass { get; set; }

        public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public virtual ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();

        // Product detail enhancement navigation properties
        public virtual ICollection<ProductHighlight> Highlights { get; set; } = new List<ProductHighlight>();

        // Dynamic Configuration System
        public virtual ICollection<ProductConfigurationOverride> ConfigurationOverrides { get; set; } = new List<ProductConfigurationOverride>();

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<ProductFilterValue> ProductFilterValues { get; set; } = new List<ProductFilterValue>();
    }
}
