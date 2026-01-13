namespace SegishopAPI.Models
{
    public class SocialIntegrationSettings
    {
        public int Id { get; set; }
        public string? YouTubeChannelId { get; set; }
        public string? YouTubeApiKey { get; set; }
        public string? InstagramUserId { get; set; }
        public string? InstagramAccessToken { get; set; }
        public string? TikTokUsername { get; set; }
        public bool UseManualYouTube { get; set; }
        public string? YouTubeManualLinks { get; set; }
        public bool UseManualInstagram { get; set; }
        public string? InstagramManualLinks { get; set; }
        public bool UseManualTikTok { get; set; }
        public string? TikTokManualLinks { get; set; }
    }
}
