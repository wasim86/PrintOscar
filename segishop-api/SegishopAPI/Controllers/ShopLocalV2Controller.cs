using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/site/shop-local-v2")]
    public class ShopLocalV2Controller : ControllerBase
    {
        private readonly SegishopDbContext _context;

        public ShopLocalV2Controller(SegishopDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            var settings = await _context.ShopLocalV2Settings.FirstOrDefaultAsync();
            var events = await _context.ShopLocalV2Events.Where(e => e.IsActive).OrderBy(e => e.SortOrder).ToListAsync();
            var media = await _context.ShopLocalV2Media.Where(m => m.IsActive).OrderBy(m => m.SortOrder).ToListAsync();

            var seasonal = events.Where(e => e.Type == "seasonal").ToList();
            var annual = events.Where(e => e.Type == "annual").ToList();
            var weekly = events.Where(e => e.Type == "weekly" || e.Type == "monthly").ToList();
            var stores = events.Where(e => e.Type == "store").ToList();

            return Ok(new { settings, seasonal, annual, weekly, stores, gallery = media });
        }
    }
}
