using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class SiteBannerSettings
    {
        [Key]
        public int Id { get; set; }

        [StringLength(300)]
        public string Message { get; set; } = "Free shipping on orders over $120!";

        [StringLength(20)]
        public string BackgroundColor { get; set; } = "#f4c363";

        [StringLength(20)]
        public string TextColor { get; set; } = "#1f2937";

        public bool Enabled { get; set; } = true;
        public bool Centered { get; set; } = true;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        [StringLength(255)]
        public string? UpdatedBy { get; set; }
    }
}