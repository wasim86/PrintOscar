using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Services;
using System.Text.Json;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/maintenance")]
    // [Authorize(Roles = "Admin")] // Uncomment when auth is ready
    public class MaintenanceController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IImageProcessingService _imageService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<MaintenanceController> _logger;

        public MaintenanceController(
            SegishopDbContext context,
            IImageProcessingService imageService,
            IWebHostEnvironment environment,
            ILogger<MaintenanceController> logger)
        {
            _context = context;
            _imageService = imageService;
            _environment = environment;
            _logger = logger;
        }

        [HttpPost("optimize-wp-content")]
        public async Task<IActionResult> OptimizeWpContent()
        {
            try
            {
                var wpContentPath = Path.Combine(_environment.ContentRootPath, "wp-content");
                if (!Directory.Exists(wpContentPath))
                {
                    return NotFound("wp-content directory not found");
                }

                // 1. Scan for images
                var imageExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var files = Directory.GetFiles(wpContentPath, "*.*", SearchOption.AllDirectories)
                    .Where(f => imageExtensions.Contains(Path.GetExtension(f).ToLowerInvariant()))
                    .ToList();

                var processedCount = 0;
                var errors = new List<string>();
                var pathMappings = new Dictionary<string, string>(); // old relative path -> new relative path (webp)

                // 2. Process images
                foreach (var file in files)
                {
                    var extension = Path.GetExtension(file);
                    var webpPath = Path.ChangeExtension(file, ".webp");
                    
                    bool conversionSuccess = true;

                    // Check if WEBP already exists
                    if (System.IO.File.Exists(webpPath))
                    {
                        // Skip conversion, but still add to mapping for DB updates
                        conversionSuccess = true;
                    }
                    else
                    {
                        // Convert if WEBP doesn't exist
                        conversionSuccess = await _imageService.ProcessFileAsync(file, webpPath);
                        if (conversionSuccess)
                        {
                            processedCount++;
                        }
                        else
                        {
                            errors.Add($"Failed to process: {file}");
                        }
                    }

                    if (conversionSuccess)
                    {
                        var relativePathOld = GetRelativePath(file);
                        var relativePathNew = GetRelativePath(webpPath);
                        
                        pathMappings[relativePathOld] = relativePathNew;
                    }
                }

                // 3. Update Database
                var dbUpdates = 0;
                
                // Products.ImageUrl
                var products = await _context.Products.ToListAsync();
                foreach (var p in products)
                {
                    if (UpdateUrl(p.ImageUrl, pathMappings, out var newUrl))
                    {
                        p.ImageUrl = newUrl;
                        dbUpdates++;
                    }
                    
                    if (!string.IsNullOrEmpty(p.ImageGallery))
                    {
                        try 
                        {
                            var gallery = JsonSerializer.Deserialize<List<string>>(p.ImageGallery);
                            if (gallery != null)
                            {
                                var galleryUpdated = false;
                                for (int i = 0; i < gallery.Count; i++)
                                {
                                    if (UpdateUrl(gallery[i], pathMappings, out var newGalleryUrl))
                                    {
                                        gallery[i] = newGalleryUrl;
                                        galleryUpdated = true;
                                    }
                                }
                                if (galleryUpdated)
                                {
                                    p.ImageGallery = JsonSerializer.Serialize(gallery);
                                    dbUpdates++;
                                }
                            }
                        }
                        catch {/* ignore json errors */}
                    }
                }

                // ProductImages
                var productImages = await _context.ProductImages.ToListAsync();
                foreach (var pi in productImages)
                {
                    if (UpdateUrl(pi.ImageUrl, pathMappings, out var newUrl))
                    {
                        pi.ImageUrl = newUrl;
                        dbUpdates++;
                    }
                }

                // Categories
                var categories = await _context.Categories.ToListAsync();
                foreach (var c in categories)
                {
                    if (UpdateUrl(c.ImageUrl, pathMappings, out var newUrl))
                    {
                        c.ImageUrl = newUrl;
                        dbUpdates++;
                    }
                }

                // ShopLocalMedia
                var media = await _context.ShopLocalMedia.ToListAsync();
                foreach (var m in media)
                {
                    if (UpdateUrl(m.ImageUrl, pathMappings, out var newUrl))
                    {
                        m.ImageUrl = newUrl;
                        dbUpdates++;
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Success = true,
                    ProcessedImages = processedCount,
                    DatabaseUpdates = dbUpdates,
                    Errors = errors
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error optimizing wp-content");
                return StatusCode(500, ex.Message);
            }
        }

        private string GetRelativePath(string fullPath)
        {
            // Extract path starting from /wp-content/
            // fullPath: C:\...\wp-content\uploads\...\image.jpg
            var index = fullPath.IndexOf("wp-content", StringComparison.OrdinalIgnoreCase);
            if (index >= 0)
            {
                var rel = fullPath.Substring(index).Replace("\\", "/");
                return "/" + rel; // /wp-content/...
            }
            return fullPath;
        }

        private bool UpdateUrl(string? currentUrl, Dictionary<string, string> mappings, out string newUrl)
        {
            newUrl = currentUrl ?? "";
            if (string.IsNullOrEmpty(currentUrl)) return false;

            // Check if URL contains any of the mapped keys
            // The mapping keys are like "/wp-content/uploads/2021/10/image.jpg"
            // The currentUrl might be "http://localhost:5001/wp-content/uploads/2021/10/image.jpg"
            
            foreach (var kvp in mappings)
            {
                // We search for the old relative path in the current URL
                // Case insensitive check might be safer for Windows
                if (currentUrl.IndexOf(kvp.Key, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    // Replace specifically that part
                    // Use a case-insensitive replace logic or simple Replace if exact casing matches (usually does)
                    
                    // Simple string replace for the matched part
                    // Note: This replaces "/wp-content/.../img.jpg" with "/wp-content/.../img.webp"
                    // preserving the domain prefix if present.
                    
                    // Case insensitive replace helper
                    newUrl = ReplaceCaseInsensitive(currentUrl, kvp.Key, kvp.Value);
                    return true; // Assume one URL matches one file
                }
            }
            return false;
        }

        private string ReplaceCaseInsensitive(string input, string search, string replacement)
        {
            int index = input.IndexOf(search, StringComparison.OrdinalIgnoreCase);
            if (index < 0) return input;
            
            return input.Substring(0, index) + replacement + input.Substring(index + search.Length);
        }
    }
}
