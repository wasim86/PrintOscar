using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/shop-local-v2")]
    [Authorize(Roles = "Admin")]
    public class AdminShopLocalV2Controller : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminShopLocalV2Controller(SegishopDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public class ImportDto
        {
            public ShopLocalV2Settings? Settings { get; set; }
            public List<ShopLocalV2Event>? Seasonal { get; set; }
            public List<ShopLocalV2Event>? Annual { get; set; }
            public List<ShopLocalV2Event>? Weekly { get; set; }
            public List<ShopLocalV2Event>? Stores { get; set; }
            public List<ShopLocalV2Media>? Gallery { get; set; }
        }

        [HttpPost("import")]
        [AllowAnonymous]
        public async Task<ActionResult> Import([FromBody] ImportDto dto)
        {
            // Ensure tables exist in older dev databases
            var sql = @"
IF OBJECT_ID(N'dbo.ShopLocalV2Settings', N'U') IS NULL BEGIN
  CREATE TABLE dbo.ShopLocalV2Settings (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    HeroTitle NVARCHAR(MAX) NULL,
    HeroSubtitle NVARCHAR(MAX) NULL
  );
END;
IF OBJECT_ID(N'dbo.ShopLocalV2Events', N'U') IS NULL BEGIN
  CREATE TABLE dbo.ShopLocalV2Events (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Title NVARCHAR(MAX) NULL,
    Schedule NVARCHAR(MAX) NULL,
    Time NVARCHAR(MAX) NULL,
    Address NVARCHAR(MAX) NULL,
    Type NVARCHAR(50) NULL,
    MapEmbedUrl NVARCHAR(MAX) NULL,
    GoogleMapsLink NVARCHAR(MAX) NULL,
    SortOrder INT NOT NULL DEFAULT(0),
    IsActive BIT NOT NULL DEFAULT(1)
  );
END;
IF OBJECT_ID(N'dbo.ShopLocalV2Media', N'U') IS NULL BEGIN
  CREATE TABLE dbo.ShopLocalV2Media (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ImageUrl NVARCHAR(MAX) NULL,
    Caption NVARCHAR(MAX) NULL,
    Category NVARCHAR(50) NULL,
    SortOrder INT NOT NULL DEFAULT(0),
    IsActive BIT NOT NULL DEFAULT(1)
  );
END;";
            await _context.Database.ExecuteSqlRawAsync(sql);

            // clear existing
            _context.ShopLocalV2Events.RemoveRange(_context.ShopLocalV2Events);
            _context.ShopLocalV2Media.RemoveRange(_context.ShopLocalV2Media);
            var settings = await _context.ShopLocalV2Settings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new ShopLocalV2Settings();
                _context.ShopLocalV2Settings.Add(settings);
            }
            if (dto.Settings != null)
            {
                settings.HeroTitle = dto.Settings.HeroTitle;
                settings.HeroSubtitle = dto.Settings.HeroSubtitle;
            }

            void addEvents(IEnumerable<ShopLocalV2Event>? list, string type)
            {
                if (list == null) return;
                int i = 0;
                foreach (var e in list)
                {
                    var ev = new ShopLocalV2Event
                    {
                        Title = e.Title,
                        Schedule = e.Schedule,
                        Time = e.Time,
                        Address = e.Address,
                        Type = type,
                        MapEmbedUrl = e.MapEmbedUrl,
                        GoogleMapsLink = e.GoogleMapsLink,
                        SortOrder = e.SortOrder == 0 ? i : e.SortOrder,
                        IsActive = e.IsActive
                    };
                    _context.ShopLocalV2Events.Add(ev);
                    i++;
                }
            }

            addEvents(dto.Seasonal, "seasonal");
            addEvents(dto.Annual, "annual");
            addEvents(dto.Weekly, "weekly");
            addEvents(dto.Stores, "store");

            if (dto.Gallery != null)
            {
                int i = 0;
                foreach (var m in dto.Gallery)
                {
                    var media = new ShopLocalV2Media
                    {
                        ImageUrl = m.ImageUrl,
                        Caption = m.Caption,
                        Category = string.IsNullOrWhiteSpace(m.Category) ? "market" : m.Category,
                        SortOrder = m.SortOrder == 0 ? i : m.SortOrder,
                        IsActive = m.IsActive
                    };
                    _context.ShopLocalV2Media.Add(media);
                    i++;
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            var settings = await _context.ShopLocalV2Settings.FirstOrDefaultAsync() ?? new ShopLocalV2Settings();
            var events = await _context.ShopLocalV2Events.OrderBy(e => e.SortOrder).ToListAsync();
            var media = await _context.ShopLocalV2Media.OrderBy(m => m.SortOrder).ToListAsync();
            return Ok(new { settings, events, media });
        }

        [HttpPut("settings")]
        public async Task<ActionResult> UpdateSettings([FromBody] ShopLocalV2Settings dto)
        {
            var existing = await _context.ShopLocalV2Settings.FirstOrDefaultAsync();
            if (existing == null)
            {
                _context.ShopLocalV2Settings.Add(dto);
            }
            else
            {
                existing.HeroTitle = dto.HeroTitle;
                existing.HeroSubtitle = dto.HeroSubtitle;
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class EventDto
        {
            public int? Id { get; set; }
            public string? Title { get; set; }
            public string? Schedule { get; set; }
            public string? Time { get; set; }
            public string? Address { get; set; }
            public string? Type { get; set; }
            public string? MapEmbedUrl { get; set; }
            public string? GoogleMapsLink { get; set; }
            public int? SortOrder { get; set; }
            public bool? IsActive { get; set; }
        }

        [HttpPost("event")]
        public async Task<ActionResult> UpsertEvent([FromBody] EventDto dto)
        {
            ShopLocalV2Event e;
            if (dto.Id.HasValue)
            {
                e = await _context.ShopLocalV2Events.FindAsync(dto.Id.Value) ?? new ShopLocalV2Event();
                if (e.Id == 0) _context.ShopLocalV2Events.Add(e);
            }
            else
            {
                e = new ShopLocalV2Event();
                _context.ShopLocalV2Events.Add(e);
            }

            if (dto.Title != null) e.Title = dto.Title;
            if (dto.Schedule != null) e.Schedule = dto.Schedule;
            if (dto.Time != null) e.Time = dto.Time;
            if (dto.Address != null) e.Address = dto.Address;
            if (!string.IsNullOrWhiteSpace(dto.Type)) e.Type = dto.Type!;
            if (dto.MapEmbedUrl != null) e.MapEmbedUrl = dto.MapEmbedUrl;
            if (dto.GoogleMapsLink != null) e.GoogleMapsLink = dto.GoogleMapsLink;
            if (dto.SortOrder.HasValue) e.SortOrder = dto.SortOrder.Value;
            if (dto.IsActive.HasValue) e.IsActive = dto.IsActive.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("event/{id:int}")]
        public async Task<ActionResult> DeleteEvent(int id)
        {
            var e = await _context.ShopLocalV2Events.FindAsync(id);
            if (e == null) return NotFound();
            _context.ShopLocalV2Events.Remove(e);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class MediaDto
        {
            public int? Id { get; set; }
            public string? ImageUrl { get; set; }
            public string? Caption { get; set; }
            public string? Category { get; set; }
            public int? SortOrder { get; set; }
            public bool? IsActive { get; set; }
        }

        [HttpPost("media")]
        public async Task<ActionResult> UpsertMedia([FromBody] MediaDto dto)
        {
            ShopLocalV2Media m;
            if (dto.Id.HasValue)
            {
                m = await _context.ShopLocalV2Media.FindAsync(dto.Id.Value) ?? new ShopLocalV2Media();
                if (m.Id == 0) _context.ShopLocalV2Media.Add(m);
            }
            else
            {
                m = new ShopLocalV2Media();
                _context.ShopLocalV2Media.Add(m);
            }

            if (dto.ImageUrl != null) m.ImageUrl = dto.ImageUrl;
            if (dto.Caption != null) m.Caption = dto.Caption;
            if (!string.IsNullOrWhiteSpace(dto.Category)) m.Category = dto.Category!;
            if (dto.SortOrder.HasValue) m.SortOrder = dto.SortOrder.Value;
            if (dto.IsActive.HasValue) m.IsActive = dto.IsActive.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("media/{id:int}")]
        public async Task<ActionResult> DeleteMedia(int id)
        {
            var m = await _context.ShopLocalV2Media.FindAsync(id);
            if (m == null) return NotFound();
            _context.ShopLocalV2Media.Remove(m);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpOptions("media/upload")]
        public IActionResult UploadMediaOptions() => Ok();

        [HttpPost("media/upload")]
        [RequestSizeLimit(10485760)]
        public async Task<ActionResult> UploadMedia([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { error = "No file" });
            var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowed.Contains(file.ContentType)) return BadRequest(new { error = "Invalid type" });
            if (file.Length > 5 * 1024 * 1024) return BadRequest(new { error = "File too large" });

            var uploadsRoot = _env.WebRootPath ?? _env.ContentRootPath;
            var dir = Path.Combine(uploadsRoot, "uploads", "shop-local-v2");
            Directory.CreateDirectory(dir);
            var ext = Path.GetExtension(file.FileName);
            var name = $"{Guid.NewGuid():N}{ext}";
            var path = Path.Combine(dir, name);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var relative = $"/uploads/shop-local-v2/{name}";
            var full = $"{Request.Scheme}://{Request.Host}{relative}";
            return Ok(new { url = relative, fullUrl = full });
        }
    }
}
