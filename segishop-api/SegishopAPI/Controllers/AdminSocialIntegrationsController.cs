using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/social-integrations")]
    [Authorize(Roles = "Admin")]
    public class AdminSocialIntegrationsController : ControllerBase
    {
        private readonly SegishopDbContext _context;

        public AdminSocialIntegrationsController(SegishopDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<SocialIntegrationSettings>> Get()
        {
            await EnsureTable();
            var s = await _context.SocialIntegrationSettings.FirstOrDefaultAsync() ?? new SocialIntegrationSettings();
            return Ok(s);
        }

        public class SocialIntegrationSettingsDto
        {
            public string? YouTubeChannelId { get; set; }
            public string? YouTubeApiKey { get; set; }
            public string? InstagramUserId { get; set; }
            public string? InstagramAccessToken { get; set; }
            public string? TikTokUsername { get; set; }
            public bool? UseManualYouTube { get; set; }
            public string? YouTubeManualLinks { get; set; }
            public bool? UseManualInstagram { get; set; }
            public string? InstagramManualLinks { get; set; }
            public bool? UseManualTikTok { get; set; }
            public string? TikTokManualLinks { get; set; }
        }

        [HttpPut]
        public async Task<ActionResult> Update([FromBody] SocialIntegrationSettingsDto dto)
        {
            try
            {
                await EnsureTable();
                var s = await _context.SocialIntegrationSettings.FirstOrDefaultAsync();
                if (s == null)
                {
                    s = new SocialIntegrationSettings();
                    _context.SocialIntegrationSettings.Add(s);
                }

                s.YouTubeChannelId = dto.YouTubeChannelId?.Trim();
                s.YouTubeApiKey = dto.YouTubeApiKey?.Trim();
                s.InstagramUserId = dto.InstagramUserId?.Trim();
                s.InstagramAccessToken = dto.InstagramAccessToken?.Trim();
                s.TikTokUsername = dto.TikTokUsername?.Trim();
                s.UseManualYouTube = dto.UseManualYouTube ?? s.UseManualYouTube;
                s.YouTubeManualLinks = dto.YouTubeManualLinks;
                s.UseManualInstagram = dto.UseManualInstagram ?? s.UseManualInstagram;
                s.InstagramManualLinks = dto.InstagramManualLinks;
                s.UseManualTikTok = dto.UseManualTikTok ?? s.UseManualTikTok;
                s.TikTokManualLinks = dto.TikTokManualLinks;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private async Task EnsureTable()
        {
            var sql = @"IF OBJECT_ID(N'dbo.SocialIntegrationSettings', N'U') IS NULL BEGIN
CREATE TABLE dbo.SocialIntegrationSettings (
  Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  YouTubeChannelId NVARCHAR(MAX) NULL,
  YouTubeApiKey NVARCHAR(MAX) NULL,
  InstagramUserId NVARCHAR(MAX) NULL,
  InstagramAccessToken NVARCHAR(MAX) NULL,
  TikTokUsername NVARCHAR(MAX) NULL
);
END;";
            await _context.Database.ExecuteSqlRawAsync(sql);

            var alters = new[] {
                "IF COL_LENGTH('dbo.SocialIntegrationSettings','UseManualYouTube') IS NULL ALTER TABLE dbo.SocialIntegrationSettings ADD UseManualYouTube BIT NOT NULL DEFAULT(0);",
                "IF COL_LENGTH('dbo.SocialIntegrationSettings','YouTubeManualLinks') IS NULL ALTER TABLE dbo.SocialIntegrationSettings ADD YouTubeManualLinks NVARCHAR(MAX) NULL;",
                "IF COL_LENGTH('dbo.SocialIntegrationSettings','UseManualInstagram') IS NULL ALTER TABLE dbo.SocialIntegrationSettings ADD UseManualInstagram BIT NOT NULL DEFAULT(0);",
                "IF COL_LENGTH('dbo.SocialIntegrationSettings','InstagramManualLinks') IS NULL ALTER TABLE dbo.SocialIntegrationSettings ADD InstagramManualLinks NVARCHAR(MAX) NULL;",
                "IF COL_LENGTH('dbo.SocialIntegrationSettings','UseManualTikTok') IS NULL ALTER TABLE dbo.SocialIntegrationSettings ADD UseManualTikTok BIT NOT NULL DEFAULT(0);",
                "IF COL_LENGTH('dbo.SocialIntegrationSettings','TikTokManualLinks') IS NULL ALTER TABLE dbo.SocialIntegrationSettings ADD TikTokManualLinks NVARCHAR(MAX) NULL;"
            };
            foreach (var stmt in alters)
            {
                try { await _context.Database.ExecuteSqlRawAsync(stmt); } catch { }
            }
        }
    }
}
