namespace SegishopAPI.Models
{
    public class ShopLocalV2Event
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Schedule { get; set; }
        public string? Time { get; set; }
        public string? Address { get; set; }
        public string? Type { get; set; }
        public string? MapEmbedUrl { get; set; }
        public string? GoogleMapsLink { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
