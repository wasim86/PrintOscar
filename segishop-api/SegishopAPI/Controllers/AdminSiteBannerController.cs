using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/site/banner")]
    [Authorize(Roles = "Admin")]
    public class AdminSiteBannerController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminSiteBannerController> _logger;

        public AdminSiteBannerController(SegishopDbContext context, ILogger<AdminSiteBannerController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public class UpdateBannerDto
        {
            public string? Message { get; set; }
            public string? BackgroundColor { get; set; }
            public string? TextColor { get; set; }
            public bool? Enabled { get; set; }
            public bool? Centered { get; set; }
        }

        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            var s = await _context.SiteBannerSettings.FirstOrDefaultAsync();
            if (s == null)
            {
                s = new SiteBannerSettings();
                _context.SiteBannerSettings.Add(s);
                await _context.SaveChangesAsync();
            }
            return Ok(s);
        }

        [HttpPut]
        public async Task<ActionResult> Update([FromBody] UpdateBannerDto dto)
        {
            try
            {
                var s = await _context.SiteBannerSettings.FirstOrDefaultAsync();
                if (s == null)
                {
                    s = new SiteBannerSettings();
                    _context.SiteBannerSettings.Add(s);
                }

                if (dto.Message != null) s.Message = dto.Message;
                if (dto.BackgroundColor != null) s.BackgroundColor = dto.BackgroundColor;
                if (dto.TextColor != null) s.TextColor = dto.TextColor;
                if (dto.Enabled.HasValue) s.Enabled = dto.Enabled.Value;
                if (dto.Centered.HasValue) s.Centered = dto.Centered.Value;

                s.UpdatedAt = DateTime.UtcNow;
                s.UpdatedBy = User?.Identity?.Name ?? "admin";

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating site banner settings");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }
}