using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/shop-local")]
    [Authorize(Roles = "Admin")]
    public class AdminShopLocalController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminShopLocalController> _logger;
        private readonly IWebHostEnvironment _env;

        public AdminShopLocalController(SegishopDbContext context, ILogger<AdminShopLocalController> logger, IWebHostEnvironment env)
        {
            _context = context;
            _logger = logger;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            var page = await _context.ShopLocalPageSettings.FirstOrDefaultAsync() ?? new ShopLocalPageSettings();
            var locations = await _context.ShopLocalLocations.OrderBy(l => l.SortOrder).ToListAsync();
            var media = await _context.ShopLocalMedia.OrderBy(m => m.SortOrder).ToListAsync();
            return Ok(new { page, locations, media });
        }

        public class UpdatePageDto
        {
            public string? Headline { get; set; }
            public string? ContentHtml { get; set; }
            public string? HeroMapEmbedUrl { get; set; }
            public string? WeeklyHeading { get; set; }
            public string? AnnualHeading { get; set; }
            public string? ThankYouHeading { get; set; }
            public string? GalleryHeading { get; set; }
            public string? InactiveHeading { get; set; }
            public string? StoresHeading { get; set; }
        }

        [HttpPut("page")]
        public async Task<ActionResult> UpdatePage([FromBody] UpdatePageDto dto)
        {
            var page = await _context.ShopLocalPageSettings.FirstOrDefaultAsync();
            if (page == null)
            {
                page = new ShopLocalPageSettings();
                _context.ShopLocalPageSettings.Add(page);
            }
            if (dto.Headline != null) page.Headline = dto.Headline;
            if (dto.ContentHtml != null) page.ContentHtml = dto.ContentHtml;
            if (dto.HeroMapEmbedUrl != null) page.HeroMapEmbedUrl = dto.HeroMapEmbedUrl;
            if (dto.WeeklyHeading != null) page.WeeklyHeading = dto.WeeklyHeading;
            if (dto.AnnualHeading != null) page.AnnualHeading = dto.AnnualHeading;
            if (dto.ThankYouHeading != null) page.ThankYouHeading = dto.ThankYouHeading;
            if (dto.GalleryHeading != null) page.GalleryHeading = dto.GalleryHeading;
            if (dto.InactiveHeading != null) page.InactiveHeading = dto.InactiveHeading;
            if (dto.StoresHeading != null) page.StoresHeading = dto.StoresHeading;
            page.UpdatedAt = DateTime.UtcNow;
            page.UpdatedBy = User?.Identity?.Name ?? "admin";
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class LocationDto
        {
            public int? Id { get; set; }
            public string? Title { get; set; }
            public string? AddressLine { get; set; }
            public string? MapEmbedUrl { get; set; }
            public bool? IsActive { get; set; }
            public int? SortOrder { get; set; }
            public string? Group { get; set; }
        }

        [HttpPost("location")]
        public async Task<ActionResult> UpsertLocation([FromBody] LocationDto dto)
        {
            ShopLocalLocation entity;
            if (dto.Id.HasValue)
            {
                entity = await _context.ShopLocalLocations.FindAsync(dto.Id.Value) ?? new ShopLocalLocation();
                if (entity.Id == 0) _context.ShopLocalLocations.Add(entity);
            }
            else
            {
                entity = new ShopLocalLocation();
                _context.ShopLocalLocations.Add(entity);
            }

            if (dto.Title != null) entity.Title = dto.Title;
            if (dto.AddressLine != null) entity.AddressLine = dto.AddressLine;
            if (dto.MapEmbedUrl != null) entity.MapEmbedUrl = dto.MapEmbedUrl;
            if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
            if (dto.SortOrder.HasValue) entity.SortOrder = dto.SortOrder.Value;
            if (!string.IsNullOrWhiteSpace(dto.Group)) entity.Group = dto.Group!;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("location/{id:int}")]
        public async Task<ActionResult> DeleteLocation(int id)
        {
            var entity = await _context.ShopLocalLocations.FindAsync(id);
            if (entity == null) return NotFound();
            _context.ShopLocalLocations.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class MediaDto
        {
            public int? Id { get; set; }
            public string? ImageUrl { get; set; }
            public string? Caption { get; set; }
            public string? Group { get; set; }
            public int? SortOrder { get; set; }
            public bool? IsActive { get; set; }
        }

        [HttpPost("media")]
        public async Task<ActionResult> UpsertMedia([FromBody] MediaDto dto)
        {
            ShopLocalMedia media;
            if (dto.Id.HasValue)
            {
                media = await _context.ShopLocalMedia.FindAsync(dto.Id.Value) ?? new ShopLocalMedia();
                if (media.Id == 0) _context.ShopLocalMedia.Add(media);
            }
            else
            {
                media = new ShopLocalMedia();
                _context.ShopLocalMedia.Add(media);
            }

            if (dto.ImageUrl != null) media.ImageUrl = dto.ImageUrl;
            if (dto.Caption != null) media.Caption = dto.Caption;
            if (!string.IsNullOrWhiteSpace(dto.Group)) media.Group = dto.Group!;
            if (dto.SortOrder.HasValue) media.SortOrder = dto.SortOrder.Value;
            if (dto.IsActive.HasValue) media.IsActive = dto.IsActive.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("media/{id:int}")]
        public async Task<ActionResult> DeleteMedia(int id)
        {
            var media = await _context.ShopLocalMedia.FindAsync(id);
            if (media == null) return NotFound();
            _context.ShopLocalMedia.Remove(media);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpOptions("media/upload")]
        public IActionResult UploadMediaOptions()
        {
            return Ok();
        }

        [HttpPost("media/upload")]
        [RequestSizeLimit(10485760)]
        public async Task<ActionResult> UploadMedia([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { error = "No file" });
            var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowed.Contains(file.ContentType)) return BadRequest(new { error = "Invalid type" });
            if (file.Length > 5 * 1024 * 1024) return BadRequest(new { error = "File too large" });

            var uploadsRoot = _env.WebRootPath ?? _env.ContentRootPath;
            var dir = Path.Combine(uploadsRoot, "uploads", "shop-local");
            Directory.CreateDirectory(dir);
            var ext = Path.GetExtension(file.FileName);
            var name = $"{Guid.NewGuid():N}{ext}";
            var path = Path.Combine(dir, name);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var relative = $"/uploads/shop-local/{name}";
            var full = $"{Request.Scheme}://{Request.Host}{relative}";
            return Ok(new { url = relative, fullUrl = full, size = file.Length, contentType = file.ContentType, filename = name });
        }
    }
}
