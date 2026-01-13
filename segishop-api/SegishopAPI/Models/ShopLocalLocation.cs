using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class ShopLocalLocation
    {
        [Key]
        public int Id { get; set; }

        [StringLength(120)]
        public string Title { get; set; } = "Our HQ";

        [StringLength(240)]
        public string AddressLine { get; set; } = "";

        [StringLength(500)]
        public string MapEmbedUrl { get; set; } = "";

        public bool IsActive { get; set; } = true;

        public int SortOrder { get; set; } = 0;

        [StringLength(50)]
        public string Group { get; set; } = "weekly"; // weekly | annual | inactive | stores
    }
}
