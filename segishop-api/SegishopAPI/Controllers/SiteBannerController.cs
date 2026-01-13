using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/site/banner")]
    [AllowAnonymous]
    public class SiteBannerController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<SiteBannerController> _logger;

        public SiteBannerController(SegishopDbContext context, ILogger<SiteBannerController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            try
            {
                if (!await _context.Database.CanConnectAsync())
                {
                    _logger.LogWarning("Database not reachable for SiteBannerSettings");
                    return StatusCode(503, new { error = "database_unavailable" });
                }

                var s = await _context.SiteBannerSettings.FirstOrDefaultAsync();
                if (s == null)
                {
                    s = new SiteBannerSettings();
                    _context.SiteBannerSettings.Add(s);
                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    message = s.Message,
                    backgroundColor = s.BackgroundColor,
                    textColor = s.TextColor,
                    enabled = s.Enabled,
                    centered = s.Centered,
                    updatedAt = s.UpdatedAt,
                    updatedBy = s.UpdatedBy
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading site banner settings");
                return StatusCode(500, new { error = "internal_error" });
            }
        }
    }
}
