using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class ShopLocalMedia
    {
        [Key]
        public int Id { get; set; }

        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Caption { get; set; }

        [StringLength(50)]
        public string Group { get; set; } = "thankyou"; // thankyou | gallery

        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }
}
