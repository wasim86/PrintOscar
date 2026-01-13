using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Models
{
    public class ShopLocalPageSettings
    {
        [Key]
        public int Id { get; set; }

        [StringLength(200)]
        public string Headline { get; set; } = "Shop Local";

        [StringLength(4000)]
        public string? ContentHtml { get; set; } = "";

        [StringLength(500)]
        public string? HeroMapEmbedUrl { get; set; } = "";

        [StringLength(200)]
        public string WeeklyHeading { get; set; } = "DMV Weekly/Monthly Markets";
        [StringLength(200)]
        public string AnnualHeading { get; set; } = "DMV Annual Events";
        [StringLength(200)]
        public string ThankYouHeading { get; set; } = "THANK YOU DMV FOR YOUR SUPPORT SINCE 2021!";
        [StringLength(200)]
        public string GalleryHeading { get; set; } = "HOPE TO SEE YOU AROUND!";
        [StringLength(200)]
        public string InactiveHeading { get; set; } = "Inactive Markets and Events (Current Year)";
        [StringLength(200)]
        public string StoresHeading { get; set; } = "DMV Stores";

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        [StringLength(255)]
        public string? UpdatedBy { get; set; }
    }
}
