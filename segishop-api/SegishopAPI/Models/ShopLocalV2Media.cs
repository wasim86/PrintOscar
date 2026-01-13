namespace SegishopAPI.Models
{
    public class ShopLocalV2Media
    {
        public int Id { get; set; }
        public string? ImageUrl { get; set; }
        public string? Caption { get; set; }
        public string? Category { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
