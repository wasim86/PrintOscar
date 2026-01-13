using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/site/shop-local")]
    [AllowAnonymous]
    public class ShopLocalController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<ShopLocalController> _logger;

        public ShopLocalController(SegishopDbContext context, ILogger<ShopLocalController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            var page = await _context.ShopLocalPageSettings.FirstOrDefaultAsync() ?? new ShopLocalPageSettings();
            var locations = await _context.ShopLocalLocations
                .Where(l => l.IsActive)
                .OrderBy(l => l.SortOrder)
                .ToListAsync();
            var media = await _context.ShopLocalMedia
                .Where(m => m.IsActive)
                .OrderBy(m => m.SortOrder)
                .ToListAsync();

            var weekly = locations.Where(l => l.Group == "weekly").ToList();
            var annual = locations.Where(l => l.Group == "annual").ToList();
            var inactive = locations.Where(l => l.Group == "inactive").ToList();
            var stores = locations.Where(l => l.Group == "stores").ToList();
            var thankyou = media.Where(m => m.Group == "thankyou").ToList();
            var gallery = media.Where(m => m.Group == "gallery").ToList();

            return Ok(new {
                headline = page.Headline,
                contentHtml = page.ContentHtml,
                heroMapEmbedUrl = page.HeroMapEmbedUrl,
                headings = new {
                    weeklyHeading = page.WeeklyHeading,
                    annualHeading = page.AnnualHeading,
                    thankYouHeading = page.ThankYouHeading,
                    galleryHeading = page.GalleryHeading,
                    inactiveHeading = page.InactiveHeading,
                    storesHeading = page.StoresHeading
                },
                sections = new { weekly, annual, inactive, stores },
                media = new { thankyou, gallery }
            });
        }
    }
}
