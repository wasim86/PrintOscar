using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;
using System.Text;
using System.Text.Json;

namespace SegishopAPI.Controllers
{
    [Route("api/admin/fix")]
    [ApiController]
    public class AdminFixController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public AdminFixController(SegishopDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        private string StripHtml(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            // Remove HTML tags
            var noHtml = System.Text.RegularExpressions.Regex.Replace(input, "<.*?>", string.Empty);
            // Decode HTML entities
            return System.Net.WebUtility.HtmlDecode(noHtml).Trim();
        }

        private decimal ParsePrice(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return 0;
            // Remove currency symbols and other non-numeric chars except dot
            var clean = System.Text.RegularExpressions.Regex.Replace(input, @"[^0-9\.]", "");
            if (decimal.TryParse(clean, out decimal val)) return val;
            return 0;
        }

        private string[] ParseCsvLine(string line)
        {
            var result = new List<string>();
            bool inQuotes = false;
            var current = new StringBuilder();

            for (int i = 0; i < line.Length; i++)
            {
                char c = line[i];
                if (c == '\"')
                {
                    if (inQuotes && i + 1 < line.Length && line[i + 1] == '\"')
                    {
                        current.Append('\"');
                        i++;
                    }
                    else
                    {
                        inQuotes = !inQuotes;
                    }
                }
                else if (c == ',' && !inQuotes)
                {
                    result.Add(current.ToString());
                    current.Clear();
                }
                else
                {
                    current.Append(c);
                }
            }
            result.Add(current.ToString());
            return result.ToArray();
        }

        private string GenerateSlug(string name)
        {
            if (string.IsNullOrEmpty(name)) return "";
            var slug = name.ToLowerInvariant().Trim();
            // Remove invalid characters
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            // Replace spaces with hyphens
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", "-");
            // Remove multiple hyphens
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-");
            return slug;
        }

        [HttpPost("fix-image-urls")]
        public async Task<IActionResult> FixImageUrls()
        {
            try
            {
                var products = await _context.Products.ToListAsync();
                var productImages = await _context.ProductImages.ToListAsync();
                int updatedCount = 0;

                // Specific replacements for missing webp files - USING LOCAL IMAGES AS REQUESTED
                var replacements = new Dictionary<string, string>
                {
                    // 1. Sport Ball Stars Spinner (was Generic Sports Ball) -> CRY6532L
                    { "Theballspins_7432c94c-b12e-4418-b780-91ebfaeb619a_1024x.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY6532L-57e75b80.webp" },
                    { "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80", "http://localhost:5001/wp-content/uploads/2024/12/CRY6532L-57e75b80.webp" },
                    { "photo-1614632537423-1e6c2e7e0aab", "http://localhost:5001/wp-content/uploads/2024/12/CRY6532L-57e75b80.webp" },
                    { "/wp-content/uploads/2024/12/CRY6532L-57e75b80.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY6532L-57e75b80.webp" },

                    // 2. Spinning Squeeze Sports Ball Trophy (was Gold Trophy) -> CRY243
                    { "IMG_6932_d9d4fb46-5284-46ce-98f5-b91dac9f30fb.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY243-fdd3a811.webp" },
                    { "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80", "http://localhost:5001/wp-content/uploads/2024/12/CRY243-fdd3a811.webp" },
                    { "photo-1579952363873-27f3bade9f55", "http://localhost:5001/wp-content/uploads/2024/12/CRY243-fdd3a811.webp" },
                    { "/wp-content/uploads/2024/12/CRY243-fdd3a811.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY243-fdd3a811.webp" },

                    // 3. Commemorative Softball Display Award (was Softball) -> CRY034L
                    { "ProductDetailImageGenerator_4b0a4348-0a58-4f6f-9af3-10726fde7bba_1024x.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY034L-c6a389b1.webp" },
                    { "https://images.unsplash.com/photo-1562771242-a02d9090c90c?w=800&q=80", "http://localhost:5001/wp-content/uploads/2024/12/CRY034L-c6a389b1.webp" },
                    { "photo-1560472354-b33ff0c44a43", "http://localhost:5001/wp-content/uploads/2024/12/CRY034L-c6a389b1.webp" },
                    { "/wp-content/uploads/2024/12/CRY034L-c6a389b1.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY034L-c6a389b1.webp" },

                    // 4. Soccer Ball Replica Sport Ball Award (was Soccer Trophy) -> CRY242
                    { "SilverSoccerball_3bde6df8-b4d3-4bfb-ad54-df6dd133d183_1024x.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY242-dd0e4ff5.webp" },
                    { "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80", "http://localhost:5001/wp-content/uploads/2024/12/CRY242-dd0e4ff5.webp" },
                    { "photo-1518091043644-c1d4457512c6", "http://localhost:5001/wp-content/uploads/2024/12/CRY242-dd0e4ff5.webp" },
                    { "/wp-content/uploads/2024/12/CRY242-dd0e4ff5.webp", "http://localhost:5001/wp-content/uploads/2024/12/CRY242-dd0e4ff5.webp" }
                };

                foreach (var product in products)
                {
                    if (!string.IsNullOrEmpty(product.ImageUrl))
                    {
                        foreach (var kvp in replacements)
                        {
                            if (product.ImageUrl == kvp.Key || product.ImageUrl.Contains(kvp.Key))
                            {
                                // Avoid re-replacing if it's already correct (though dictionary handles that if key != value)
                                if (product.ImageUrl != kvp.Value)
                                {
                                    product.ImageUrl = kvp.Value;
                                    updatedCount++;
                                }
                            }
                        }
                    }
                }

                foreach (var img in productImages)
                {
                    if (!string.IsNullOrEmpty(img.ImageUrl))
                    {
                        foreach (var kvp in replacements)
                        {
                            if (img.ImageUrl == kvp.Key || img.ImageUrl.Contains(kvp.Key))
                            {
                                if (img.ImageUrl != kvp.Value)
                                {
                                    img.ImageUrl = kvp.Value;
                                    updatedCount++;
                                }
                            }
                        }
                    }
                }

                if (updatedCount > 0)
                {
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = $"Updated {updatedCount} image URLs (replaced broken webp files and fixed paths)" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("populate-slugs")]
        public async Task<IActionResult> PopulateSlugs()
        {
            var products = await _context.Products.Where(p => string.IsNullOrEmpty(p.Slug)).ToListAsync();
            int count = 0;
            foreach (var p in products)
            {
                p.Slug = GenerateSlug(p.Name);
                // Ensure uniqueness
                string originalSlug = p.Slug;
                int counter = 1;
                while (await _context.Products.AnyAsync(existing => existing.Slug == p.Slug && existing.Id != p.Id))
                {
                    p.Slug = $"{originalSlug}-{counter}";
                    counter++;
                }
                count++;
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Populated slugs for {count} products." });
        }

        [HttpGet("debug-products-list")]
        public async Task<IActionResult> DebugProductsList()
        {
            var products = await _context.Products
                .Select(p => new { p.Id, p.SKU, p.Name })
                .ToListAsync();
            return Ok(products);
        }

        [HttpGet("debug-categories")]
        public async Task<IActionResult> DebugCategories()
        {
            var categories = await _context.Categories
                .Select(c => new 
                { 
                    c.Name, 
                    c.Slug, 
                    ProductCount = c.Products.Count 
                })
                .OrderByDescending(c => c.ProductCount)
                .ToListAsync();
            
            return Ok(categories);
        }

        [HttpGet("debug-products")]
        public async Task<IActionResult> DebugProducts()
        {
            var totalCount = await _context.Products.CountAsync();
            var activeCount = await _context.Products.CountAsync(p => p.IsActive);
            var firstProducts = await _context.Products.Take(20).Select(p => new { p.Id, p.Name, p.ImageUrl }).ToListAsync();
            
            return Ok(new { 
                TotalProducts = totalCount, 
                ActiveProducts = activeCount, 
                Sample = firstProducts 
            });
        }

        [HttpGet("debug-db-stats")]
        public async Task<IActionResult> DebugDbStats()
        {
            var total = await _context.Products.CountAsync();
            var uncategorized = await _context.Products
                .Where(p => p.Category.Name == "Uncategorized")
                .CountAsync();
            
            var topCategories = await _context.Categories
                .Select(c => new { c.Name, Count = c.Products.Count })
                .OrderByDescending(x => x.Count)
                .Take(20)
                .ToListAsync();

            return Ok(new { 
                TotalProducts = total, 
                UncategorizedCount = uncategorized, 
                TopCategories = topCategories 
            });
        }

        [HttpPost("clear-products")]
        public async Task<IActionResult> ClearProducts()
        {
             _context.Database.ExecuteSqlRaw("DELETE FROM ProductFilterValues");
             _context.Database.ExecuteSqlRaw("DELETE FROM ProductImages");
             _context.Database.ExecuteSqlRaw("DELETE FROM ProductAttributes");
             _context.Database.ExecuteSqlRaw("DELETE FROM ProductHighlights");
             _context.Database.ExecuteSqlRaw("DELETE FROM ProductConfigurationOverrides");
             _context.Database.ExecuteSqlRaw("DELETE FROM OrderItems");
             _context.Database.ExecuteSqlRaw("DELETE FROM CartItems");
             _context.Database.ExecuteSqlRaw("DELETE FROM Products");
             
             // Reset ParentId to avoid constraint error
             _context.Database.ExecuteSqlRaw("UPDATE Categories SET ParentId = NULL");
             _context.Database.ExecuteSqlRaw("DELETE FROM Categories");

             return Ok(new { message = "All products, categories, and related data cleared." });
        }

        [HttpPost("import-csv")]
        public async Task<IActionResult> ImportCsv([FromQuery] string filePath = "import_source.csv")
        {
            var sb = new StringBuilder();
            var logPath = Path.Combine(_environment.ContentRootPath, "import_log.txt");
            
            void Log(string msg) 
            { 
                sb.AppendLine(msg); 
                Console.WriteLine(msg);
                try { System.IO.File.AppendAllText(logPath, msg + Environment.NewLine); } catch {}
            }

            try { System.IO.File.WriteAllText(logPath, $"Import started at {DateTime.Now}\n"); } catch {}

            Log($"Starting import from {filePath}...");
            try
            {
                var fullPath = Path.Combine(_environment.ContentRootPath, filePath);

                if (!System.IO.File.Exists(fullPath))
                {
                    Log($"File not found: {fullPath}");
                    return NotFound(new { message = sb.ToString() });
                }

                Log($"File found: {fullPath}");

                // --- PASS 1: CATEGORIES ---
                Log("PASS 1: Processing Categories...");
                var categorySlugMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                {
                    { "Trophies", "trophies" },
                    { "1, 2, 3, 4 Columns Trophy", "columns-trophy" },
                    { "Cups Trophy", "cups-trophy" },
                    { "Completed Metal Cups", "metal-cups" },
                    { "Completed Plastic Cups", "plastic-cups" },
                    { "Resins Trophy", "resins-trophy" },
                    { "Trophy", "trophy" },
                    { "Medals", "medals" },
                    // Support both formats (spaced and compact)
                    { "Baseball / Softball", "baseball-softball" },
                    { "Baseball/Softball", "baseball-softball" },
                    { "Basketball", "basketball" },
                    { "Bowling", "bowling" },
                    { "Cheer / Gymnastics", "cheer-gymnastics" },
                    { "Cheer/Gymnastics", "cheer-gymnastics" },
                    { "Football", "football" },
                    { "Golf", "golf" },
                    { "Hockey", "hockey" },
                    { "Martial Arts & Wrestling", "martial-arts" }, 
                    { "Martial Arts / Wrestling", "martial-arts" },
                    { "Martial Arts/Wrestling", "martial-arts" },
                    { "Pickleball / Tennis", "tennis" }, 
                    { "Pickleball/Tennis", "tennis" },
                    { "Place / Participant", "place-awards" }, 
                    { "Place/Participant", "place-awards" },
                    { "Racing / Motor Sports", "racing" }, 
                    { "Racing/Motor Sports", "racing" },
                    { "Soccer", "soccer" },
                    { "Swimming", "swimming" },
                    { "Track & Field", "track-field" }, 
                    { "Track/Field", "track-field" },
                    { "Volleyball", "volleyball" },
                    { "Sports & American Awards", "awards" },
                    { "Academic / Music / Religion / Theater Awards", "academic-awards" },
                    { "American Eagle Awards", "eagle-awards" },
                    { "Baseball Awards", "baseball-awards" },
                    { "Basketball Awards", "basketball-awards" },
                    { "Football Awards", "football-awards" },
                    { "Soccer Awards", "soccer-awards" },
                    { "Plaques & Executive Awards", "plaques" },
                    { "Acrylic Awards", "acrylics" },
                    { "Crystal Awards", "crystal" },
                    { "Glass Awards", "glass" },
                    { "Clocks", "clocks" },
                    { "Pens & Accessories", "pens" },
                    { "Banners & Signs", "banners" },
                    { "Promotional Products", "promotional" },
                    { "Wedding Invitations", "wedding" },
                    { "Police / Fire / EMS & Military Awards", "service-awards" },
                    { "Police/Fire/EMS & Military Awards", "service-awards" }
                };

                // Load existing categories
                var existingCategories = await _context.Categories.Include(c => c.Parent).ToListAsync();
                var categoryCache = new Dictionary<string, Category>(StringComparer.OrdinalIgnoreCase);
                var usedSlugs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                
                foreach (var c in existingCategories) 
                {
                    categoryCache[c.Name] = c;
                    if (!string.IsNullOrEmpty(c.Slug)) usedSlugs.Add(c.Slug);
                }

                // Ensure Uncategorized exists
                if (!categoryCache.ContainsKey("Uncategorized"))
                {
                    var uncategorized = new Category { Name = "Uncategorized", Slug = "uncategorized" };
                    if (!usedSlugs.Contains("uncategorized"))
                    {
                        _context.Categories.Add(uncategorized);
                        categoryCache["Uncategorized"] = uncategorized;
                        usedSlugs.Add("uncategorized");
                        Log("Created Uncategorized category.");
                    }
                }

                using (var reader = new StreamReader(fullPath))
                {
                    var headerLine = await reader.ReadLineAsync();
                    if (headerLine != null)
                    {
                        var headers = ParseCsvLine(headerLine);
                        int catIndex = Array.IndexOf(headers, "Categories");

                        if (catIndex >= 0)
                        {
                            while (!reader.EndOfStream)
                            {
                                var line = await reader.ReadLineAsync();
                                if (line == null) break;
                                
                                // Handle multiline CSV records
                                while (line.Count(c => c == '"') % 2 != 0 && !reader.EndOfStream)
                                {
                                    var nextLine = await reader.ReadLineAsync();
                                    if (nextLine == null) break;
                                    line += Environment.NewLine + nextLine;
                                }

                                var parts = ParseCsvLine(line);
                                if (parts.Length <= catIndex) continue;

                                var catsStr = parts[catIndex]?.Trim();
                                if (!string.IsNullOrEmpty(catsStr))
                                {
                                    // Handle multiple category paths separated by comma (e.g. "Cat1 > Sub1, Cat2")
                                    // Need to be careful about commas inside category names if they are escaped, but ParseCsvLine handled the main CSV split.
                                    // Here we are splitting the Categories cell content.
                                    // Assuming comma separates distinct category paths.
                                    var tempStr = catsStr.Replace("\\,", "__COMMA__");
                                    var paths = tempStr.Split(','); 

                                    foreach (var pathRaw in paths)
                                    {
                                        var path = pathRaw.Replace("__COMMA__", ",").Trim();
                                        if (string.IsNullOrEmpty(path)) continue;

                                        var hierarchy = path.Split('>').Select(s => s.Trim().Replace("\\", "")).ToArray();
                                        Category? parent = null;

                                        for (int i = 0; i < hierarchy.Length; i++)
                                        {
                                            var catName = hierarchy[i];
                                            if (string.IsNullOrEmpty(catName)) continue;

                                            // Check if category exists (considering parent context if needed, but simplified to Name uniqueness for now as per schema)
                                            // Ideally, we should check Name + Parent, but the current schema relies on Name being unique or we just reuse the name.
                                            // Let's reuse existing category by name to avoid duplicates.
                                            
                                            if (!categoryCache.TryGetValue(catName, out var currentCat))
                                            {
                                                string slug;
                                                if (categorySlugMap.TryGetValue(catName, out var mappedSlug))
                                                {
                                                    slug = mappedSlug;
                                                }
                                                else
                                                {
                                                    slug = GenerateSlug(catName);
                                                }

                                                // Ensure unique slug
                                                string originalSlug = slug;
                                                int counter = 1;
                                                while (usedSlugs.Contains(slug))
                                                {
                                                    slug = $"{originalSlug}-{counter}";
                                                    counter++;
                                                }

                                                currentCat = new Category 
                                                { 
                                                    Name = catName, 
                                                    Slug = slug,
                                                    Parent = parent
                                                };
                                                
                                                if (parent != null && parent.Id > 0)
                                                {
                                                    currentCat.ParentId = parent.Id;
                                                }

                                                _context.Categories.Add(currentCat);
                                                categoryCache[catName] = currentCat; 
                                                usedSlugs.Add(slug);
                                            }
                                            else
                                            {
                                                // Link parent if missing
                                                if (currentCat.ParentId == null && parent != null)
                                                {
                                                    currentCat.Parent = parent;
                                                    if (parent.Id > 0)
                                                    {
                                                        currentCat.ParentId = parent.Id;
                                                    }
                                                }
                                            }
                                            
                                            parent = currentCat;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                await _context.SaveChangesAsync();
                Log($"Categories synced. Total: {categoryCache.Count}");

                // --- PASS 2: PRODUCTS ---
                Log("PASS 2: Processing Products...");
                // Reload cache with IDs from DB to ensure attached
                existingCategories = await _context.Categories.ToListAsync();
                categoryCache.Clear();
                foreach (var c in existingCategories) categoryCache[c.Name] = c;
                Log($"PASS 2: Loaded {existingCategories.Count} categories from DB.");

                var defaultCategory = categoryCache.ContainsKey("Uncategorized") ? categoryCache["Uncategorized"] : existingCategories.FirstOrDefault();
                if (defaultCategory == null) 
                {
                     Log("WARNING: No categories found in DB for Pass 2. Creating Uncategorized fallback.");
                     defaultCategory = new Category { Name = "Uncategorized", Slug = "uncategorized" };
                     _context.Categories.Add(defaultCategory);
                     await _context.SaveChangesAsync();
                     categoryCache["Uncategorized"] = defaultCategory;
                }

                // Ensure Size configuration type exists
                var sizeConfigType = await _context.ConfigurationTypes.FirstOrDefaultAsync(ct => ct.Name == "Size");
                if (sizeConfigType == null)
                {
                    sizeConfigType = new ConfigurationType { Name = "Size", Type = "dropdown", ShowPriceImpact = true, IsActive = true };
                    _context.ConfigurationTypes.Add(sizeConfigType);
                    await _context.SaveChangesAsync();
                }
                int sizeTypeId = sizeConfigType.Id;

                var csvIdToProductMap = new Dictionary<string, Product>();
                var csvSkuToProductMap = new Dictionary<string, Product>(StringComparer.OrdinalIgnoreCase);
                int processed = 0, created = 0, updated = 0, skipped = 0;

                var processedSkus = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                using (var reader = new StreamReader(fullPath))
                {
                    var headerLine = await reader.ReadLineAsync(); // Skip header
                    var headers = ParseCsvLine(headerLine);
                    var headerMap = new Dictionary<string, int>();
                    for (int i = 0; i < headers.Length; i++) headerMap[headers[i]] = i;
                    
                    string GetVal(string[] parts, string colName) => 
                        (headerMap.TryGetValue(colName, out int idx) && idx < parts.Length) ? parts[idx]?.Trim() ?? "" : "";

                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        if (string.IsNullOrWhiteSpace(line)) continue;
                        
                        // Handle multiline CSV records
                        while (line.Count(c => c == '"') % 2 != 0 && !reader.EndOfStream)
                        {
                            var nextLine = await reader.ReadLineAsync();
                            if (nextLine == null) break;
                            line += Environment.NewLine + nextLine;
                        }

                        try 
                        {
                            var parts = ParseCsvLine(line);
                            processed++;
                            if (processed % 100 == 0) Log($"Processed {processed}...");
                            
                            // Save in batches
                            if (processed % 500 == 0) 
                            {
                                try 
                                {
                                    await _context.SaveChangesAsync();
                                    Log($"Saved batch at {processed} items.");
                                }
                                catch (Exception ex)
                                {
                                    Log($"Error saving batch at {processed}: {ex.Message}");
                                }
                            }

                            string id = GetVal(parts, "ID");
                            
                            // Debug logging for specific problematic product
                            if (id == "1787")
                            {
                                Log($"DEBUG: Processing Product 1787. Raw Line Length: {line.Length}");
                                Log($"DEBUG: Regular Price Raw: '{GetVal(parts, "Regular price")}'");
                                Log($"DEBUG: Images Raw: '{GetVal(parts, "Images")}'");
                            }

                            string type = GetVal(parts, "Type");
                            string imagesStr = GetVal(parts, "Images");

                             // Handle variations
                            if (type.Equals("variation", StringComparison.OrdinalIgnoreCase))
                            {
                                string parentRef = GetVal(parts, "Parent");
                                if (!string.IsNullOrEmpty(parentRef))
                                {
                                    string parentId = parentRef;
                                    if (parentRef.StartsWith("id:")) 
                                    {
                                        parentId = parentRef.Substring(3);
                                    }

                                    Product parentProduct = null;
                                    if (csvIdToProductMap.TryGetValue(parentId, out var pById)) 
                                    {
                                        parentProduct = pById;
                                    }
                                    else if (csvSkuToProductMap.TryGetValue(parentId, out var pBySku))
                                    {
                                        parentProduct = pBySku;
                                    }

                                    if (parentProduct != null)
                                    {
                                        // Update Parent Price from Variation if Parent has no price
                                        decimal varPrice = 0;
                                        if (decimal.TryParse(GetVal(parts, "Regular price"), out varPrice))
                                        {
                                            if (parentProduct.Price == 0) parentProduct.Price = varPrice;
                                            // Update Sale Price too if needed
                                            if (decimal.TryParse(GetVal(parts, "Sale price"), out decimal varSalePrice))
                                            {
                                                if (parentProduct.SalePrice == 0) parentProduct.SalePrice = varSalePrice;
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(imagesStr))
                                        {
                                            var imageUrls = imagesStr.Split(',').Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s)).ToList();
                                            if (imageUrls.Any() && string.IsNullOrEmpty(parentProduct.ImageUrl))
                                            {
                                                parentProduct.ImageUrl = imageUrls.First();
                                            }
                                            foreach (var url in imageUrls)
                                            {
                                                if (!parentProduct.Images.Any(i => i.ImageUrl == url))
                                                {
                                                    parentProduct.Images.Add(new ProductImage
                                                    {
                                                        ImageUrl = url,
                                                        SortOrder = parentProduct.Images.Count + 1,
                                                        IsPrimary = url == parentProduct.ImageUrl || parentProduct.Images.Count == 0,
                                                        CreatedAt = DateTime.UtcNow
                                                    });
                                                }
                                            }
                                        }

                                        for (int i = 1; i <= 4; i++)
                                        {
                                            string attrName = GetVal(parts, $"Attribute {i} name");
                                            string attrVal = GetVal(parts, $"Attribute {i} value(s)");

                                            if (!string.IsNullOrEmpty(attrName) && !string.IsNullOrEmpty(attrVal))
                                            {
                                                // 1. Add to generic attributes (legacy support)
                                                var existingAttr = parentProduct.ProductAttributes.FirstOrDefault(a => a.Name.Equals(attrName, StringComparison.OrdinalIgnoreCase));
                                                if (existingAttr != null)
                                                {
                                                    var currentValues = existingAttr.Value.Split(',').Select(v => v.Trim()).ToList();
                                                    if (!currentValues.Contains(attrVal, StringComparer.OrdinalIgnoreCase))
                                                    {
                                                        string newValue = existingAttr.Value + ", " + attrVal;
                                                        if (newValue.Length > 250) newValue = newValue.Substring(0, 250);
                                                        existingAttr.Value = newValue;
                                                    }
                                                }
                                                else
                                                {
                                                    if (attrVal.Length > 250) attrVal = attrVal.Substring(0, 250);
                                                    parentProduct.ProductAttributes.Add(new ProductAttribute { Name = attrName, Value = attrVal });
                                                }

                                                // 2. Add to Dynamic Configuration (Size/Price support)
                                                if (string.Equals(attrName, "Size", StringComparison.OrdinalIgnoreCase))
                                                {
                                                    // Ensure override exists
                                                    var overrideConfig = parentProduct.ConfigurationOverrides
                                                        .FirstOrDefault(o => o.ConfigurationTypeId == sizeTypeId);
                                                    
                                                    List<ConfigurationOptionDto> options = new();
                                                    
                                                    if (overrideConfig == null)
                                                    {
                                                        overrideConfig = new ProductConfigurationOverride
                                                        {
                                                            Product = parentProduct, // Link directly
                                                            ConfigurationTypeId = sizeTypeId,
                                                            OverrideType = "custom",
                                                            IsActive = true
                                                        };
                                                        parentProduct.ConfigurationOverrides.Add(overrideConfig);
                                                    }
                                                    else
                                                    {
                                                        if (!string.IsNullOrEmpty(overrideConfig.CustomOptions))
                                                        {
                                                            try {
                                                                options = JsonSerializer.Deserialize<List<ConfigurationOptionDto>>(overrideConfig.CustomOptions) ?? new();
                                                            } catch {}
                                                        }
                                                        overrideConfig.OverrideType = "custom";
                                                    }

                                                    // Add option if not exists
                                                    var existingOption = options.FirstOrDefault(o => o.Name.Equals(attrVal, StringComparison.OrdinalIgnoreCase));
                                                    if (existingOption == null)
                                                    {
                                                        options.Add(new ConfigurationOptionDto
                                                        {
                                                            Id = -(options.Count + 1), // Temporary ID
                                                            ConfigurationTypeId = sizeTypeId,
                                                            Name = attrVal,
                                                            Value = attrVal,
                                                            PriceModifier = varPrice,
                                                            PriceType = "replace",
                                                            SortOrder = options.Count,
                                                            IsActive = true
                                                        });
                                                    }
                                                    else
                                                    {
                                                        // Update price if found
                                                        existingOption.PriceModifier = varPrice;
                                                        existingOption.PriceType = "replace";
                                                    }
                                                    
                                                    overrideConfig.CustomOptions = JsonSerializer.Serialize(options);
                                                }
                                            }
                                        }
                                    }
                                }
                                skipped++;
                                continue;
                            }

                            // Regular Product
                            string rawName = GetVal(parts, "Name");
                            string name = StripHtml(rawName);
                            if (!string.IsNullOrEmpty(name) && name.Length > 255) name = name.Substring(0, 255);
                            string sku = GetVal(parts, "SKU");
                            if (string.IsNullOrEmpty(name)) continue;

                            string description = StripHtml(GetVal(parts, "Description"));

                            // Duplicate SKU check - Log but don't skip
                            if (!string.IsNullOrEmpty(sku))
                            {
                                if (processedSkus.Contains(sku))
                                {
                                    Log($"WARNING: Duplicate SKU in CSV: {sku}. Allowing creation but SKU might conflict if enforced unique in DB.");
                                    // continue; // DON'T SKIP
                                }
                                processedSkus.Add(sku);
                            }

                            Product product = null;

                            // 1. Check by ID (Priority)
                            if (!string.IsNullOrEmpty(id) && csvIdToProductMap.TryGetValue(id, out var existingById))
                            {
                                product = existingById;
                            }

                            // 2. Check by SKU
                            if (product == null && !string.IsNullOrEmpty(sku))
                            {
                                product = _context.Products.Local.FirstOrDefault(p => p.SKU == sku);
                                if (product == null)
                                {
                                    product = await _context.Products
                                        .Include(p => p.ProductAttributes)
                                        .Include(p => p.Images)
                                        .Include(p => p.ConfigurationOverrides)
                                        .FirstOrDefaultAsync(p => p.SKU == sku);
                                }
                            }

                            // 3. REMOVED Name-based lookup to prevent merging distinct products with same name


                            bool isNew = product == null;
                            if (isNew)
                            {
                                product = new Product
                                {
                                    Name = name,
                                    Description = description,
                                    CreatedAt = DateTime.UtcNow,
                                    ProductAttributes = new List<ProductAttribute>(),
                                    Images = new List<ProductImage>(),
                                    Category = defaultCategory // Fallback, will update below
                                };
                                _context.Products.Add(product);
                                created++;
                            }
                            else
                            {
                                product.Name = name; // Update name in case of HTML cleanup
                                product.Description = description;
                                updated++;
                            }

                            
                            // Ensure Slug exists
                            if (string.IsNullOrWhiteSpace(product.Slug))
                            {
                                product.Slug = GenerateSlug(product.Name);
                            }

                            if (!string.IsNullOrEmpty(id)) csvIdToProductMap[id] = product;

                            if (!string.IsNullOrEmpty(sku)) 
                            {
                                if (sku.Length > 100) sku = sku.Substring(0, 100);
                                
                                // Check for conflict with OTHER products (DB or Local)
                                bool skuTaken = _context.Products.Local.Any(p => p.SKU == sku && p != product);
                                if (!skuTaken)
                                {
                                    // Only query DB if not found locally to save perf, 
                                    // but we need to be careful about async in loop. 
                                    // Ideally we pre-loaded all SKUs, but for now:
                                    skuTaken = await _context.Products.AnyAsync(p => p.SKU == sku && p.Id != product.Id);
                                }

                                if (skuTaken)
                                {
                                    Log($"SKU Conflict: '{sku}' used by another product. Skipping SKU assignment for '{product.Name}'.");
                                }
                                else
                                {
                                    product.SKU = sku;
                                    csvSkuToProductMap[sku] = product;
                                }
                            }
                            string desc = StripHtml(GetVal(parts, "Description"));
                            if (!string.IsNullOrEmpty(desc)) 
                            {
                                product.LongDescription = desc;
                                product.Description = desc;
                            }
                            string shortDesc = StripHtml(GetVal(parts, "Short description"));
                            if (!string.IsNullOrEmpty(shortDesc) && string.IsNullOrEmpty(product.Description)) product.Description = shortDesc;

                            decimal price = ParsePrice(GetVal(parts, "Regular price"));
                            if (id == "1787") Log($"DEBUG: 1787 Parsed Price: {price}");
                            if (price > 0) product.Price = price;
                            
                            decimal salePrice = ParsePrice(GetVal(parts, "Sale price"));
                            if (id == "1787") Log($"DEBUG: 1787 Parsed Sale Price: {salePrice}");
                            if (salePrice > 0) product.SalePrice = salePrice;

                            product.Stock = 100;
                            
                            // Parse Published status
                            string publishedStr = GetVal(parts, "Published");
                            if (int.TryParse(publishedStr, out int published))
                            {
                                // Assuming 1 and -1 are Active, 0 is Inactive
                                product.IsActive = published != 0;
                            }
                            else
                            {
                                product.IsActive = true; // Default to true if missing
                            }

                            // Images
                             if (!string.IsNullOrEmpty(imagesStr))
                            {
                                var imageUrls = imagesStr.Split(',').Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s)).ToList();
                                if (imageUrls.Any())
                                {
                                    // Always update primary image from CSV
                                    product.ImageUrl = imageUrls.First();
                                    
                                    foreach (var url in imageUrls)
                                    {
                                        if (!product.Images.Any(i => i.ImageUrl == url))
                                        {
                                            product.Images.Add(new ProductImage
                                            {
                                                ImageUrl = url,
                                                SortOrder = product.Images.Count + 1,
                                                IsPrimary = url == product.ImageUrl,
                                                CreatedAt = DateTime.UtcNow
                                            });
                                        }
                                    }
                                }
                            }

                            // Category Assignment
                            string catsStr = GetVal(parts, "Categories");
                            if (!string.IsNullOrEmpty(catsStr))
                            {
                                var tempStr = catsStr.Replace("\\,", "__COMMA__");
                                var paths = tempStr.Split(',');
                                string bestCategoryName = null;
                                int maxDepth = -1;

                                foreach (var pathRaw in paths)
                                {
                                    var path = pathRaw.Replace("__COMMA__", ",").Trim();
                                    if (string.IsNullOrEmpty(path)) continue;

                                    var hierarchy = path.Split('>').Select(s => s.Trim().Replace("\\", "")).ToArray();
                                    if (hierarchy.Length > 0)
                                    {
                                        // Prefer deeper hierarchy (more specific)
                                        // Also prefer categories that are NOT "Uncategorized"
                                        int depth = hierarchy.Length;
                                        if (depth > maxDepth)
                                        {
                                            maxDepth = depth;
                                            bestCategoryName = hierarchy.Last();
                                        }
                                    }
                                }

                                if (!string.IsNullOrEmpty(bestCategoryName) && categoryCache.TryGetValue(bestCategoryName, out var category))
                                {
                                    product.Category = category;
                                }
                            }
                            else
                            {
                                // FALLBACK: SMART CATEGORY MAPPING (Only if no CSV category)
                                string nameLower = product.Name.ToLower();
                                string attr1Val = GetVal(parts, "Attribute 1 value(s)").ToLower();
                                string combinedSearch = nameLower + " " + attr1Val;

                                // Map keywords to specific category names (must match keys in categorySlugMap)
                                var keywordMap = new Dictionary<string, string>
                                {
                                    { "baseball", "Baseball/Softball" }, 
                                    { "softball", "Baseball/Softball" },
                                    { "basketball", "Basketball" },
                                    { "bowling", "Bowling" },
                                    { "cheer", "Cheer/Gymnastics" },
                                    { "gymnastic", "Cheer/Gymnastics" },
                                    { "football", "Football" },
                                    { "golf", "Golf" },
                                    { "hockey", "Hockey" },
                                    { "martial art", "Martial Arts/Wrestling" },
                                    { "wrestling", "Martial Arts/Wrestling" },
                                    { "pickleball", "Pickleball/Tennis" },
                                    { "tennis", "Pickleball/Tennis" },
                                    { "racing", "Racing/Motor Sports" },
                                    { "motor", "Racing/Motor Sports" },
                                    { "soccer", "Soccer" },
                                    { "swimming", "Swimming" },
                                    { "track", "Track & Field" },
                                    { "volleyball", "Volleyball" },
                                    { "medal", "Medals" },
                                    { "plaque", "Plaques & Executive Awards" },
                                    { "crystal", "Crystal Awards" },
                                    { "glass", "Glass Awards" },
                                    { "acrylic", "Acrylic Awards" },
                                    { "clock", "Clocks" },
                                    { "pen", "Pens & Accessories" }
                                };

                                foreach (var kvp in keywordMap)
                                {
                                    if (combinedSearch.Contains(kvp.Key))
                                    {
                                        if (categoryCache.TryGetValue(kvp.Value, out var specificCat))
                                        {
                                            product.Category = specificCat;
                                            break; 
                                        }
                                        // Try with spaces around slash if compact failed
                                        var spaced = kvp.Value.Replace("/", " / ");
                                        if (categoryCache.TryGetValue(spaced, out specificCat))
                                        {
                                            product.Category = specificCat;
                                            break;
                                        }
                                        // Try compact if spaced failed (reverse check)
                                        var compact = kvp.Value.Replace(" / ", "/");
                                        if (categoryCache.TryGetValue(compact, out specificCat))
                                        {
                                            product.Category = specificCat;
                                            break;
                                        }
                                    }
                                }
                            }

                             // Attributes (Parent)
                            for (int i = 1; i <= 4; i++)
                            {
                                string attrName = GetVal(parts, $"Attribute {i} name");
                                string attrVal = GetVal(parts, $"Attribute {i} value(s)");

                                if (!string.IsNullOrEmpty(attrName) && !string.IsNullOrEmpty(attrVal))
                                {
                                    // TRUNCATE VALUE TO 250 TO BE SAFE (DB likely 255)
                                    if (attrVal.Length > 250) attrVal = attrVal.Substring(0, 250);

                                    var existingAttr = product.ProductAttributes.FirstOrDefault(a => a.Name == attrName);
                                    if (existingAttr != null) existingAttr.Value = attrVal;
                                    else product.ProductAttributes.Add(new ProductAttribute { Name = attrName, Value = attrVal });
                                }
                            }

                        }
                        catch(Exception ex)
                        {
                             Log($"Error on line {processed}: {ex.Message}");
                             if (ex.InnerException != null) Log($"Inner: {ex.InnerException.Message}");
                        }
                    }
                    await _context.SaveChangesAsync();
                }

                // --- PASS 3: VARIATIONS ---
                Log("PASS 3: Processing Variations for Dynamic Configuration...");
                
                using (var reader = new StreamReader(fullPath))
                {
                    var headerLine = await reader.ReadLineAsync();
                    if (headerLine != null)
                    {
                        var headers = ParseCsvLine(headerLine);
                        var headerMap = new Dictionary<string, int>();
                        for (int i = 0; i < headers.Length; i++) headerMap[headers[i]] = i;
                        
                        string GetVal(string[] parts, string colName) => 
                            (headerMap.TryGetValue(colName, out int idx) && idx < parts.Length) ? parts[idx]?.Trim() ?? "" : "";

                        var variationMap = new Dictionary<string, List<(string Name, string Value, decimal Price)>>();

                        while (!reader.EndOfStream)
                        {
                            var line = await reader.ReadLineAsync();
                            if (string.IsNullOrWhiteSpace(line)) continue;

                            // Handle multiline
                            while (line.Count(c => c == '\"') % 2 != 0 && !reader.EndOfStream)
                            {
                                var nextLine = await reader.ReadLineAsync();
                                if (nextLine == null) break;
                                line += Environment.NewLine + nextLine;
                            }

                            var parts = ParseCsvLine(line);
                            string type = GetVal(parts, "Type");

                            if (type.Equals("variation", StringComparison.OrdinalIgnoreCase))
                            {
                                string parentRef = GetVal(parts, "Parent");
                                if (!string.IsNullOrEmpty(parentRef) && parentRef.StartsWith("id:"))
                                {
                                    string parentId = parentRef.Substring(3);
                                    string attrName = GetVal(parts, "Attribute 1 name");
                                    string attrVal = GetVal(parts, "Attribute 1 value(s)");
                                    
                                    if (!string.IsNullOrEmpty(attrName) && !string.IsNullOrEmpty(attrVal))
                                    {
                                        decimal price = ParsePrice(GetVal(parts, "Regular price"));
                                        
                                        if (!variationMap.ContainsKey(parentId))
                                            variationMap[parentId] = new List<(string, string, decimal)>();
                                        
                                        variationMap[parentId].Add((attrName, attrVal, price));
                                    }
                                }
                            }
                        }

                        // Process collected variations
                        int configCount = 0;
                        
                        // Cache ConfigurationTypes to avoid repeated DB lookups
                        var configTypesCache = await _context.ConfigurationTypes.ToDictionaryAsync(ct => ct.Name, ct => ct);

                        foreach (var kvp in variationMap)
                        {
                            try 
                            {
                                if (csvIdToProductMap.TryGetValue(kvp.Key, out var parentProduct))
                                {
                                    var variations = kvp.Value;
                                    if (variations.Any())
                                    {
                                        string configTypeName = variations.First().Name;
                                        if (string.IsNullOrEmpty(configTypeName)) configTypeName = "Size";

                                        // Ensure ConfigurationType exists
                                        if (!configTypesCache.TryGetValue(configTypeName, out var configType))
                                        {
                                            configType = new ConfigurationType
                                            {
                                                Name = configTypeName,
                                                Type = "dropdown",
                                                IsRequired = true,
                                                ShowPriceImpact = true,
                                                SortOrder = 0,
                                                IsActive = true
                                            };
                                            _context.ConfigurationTypes.Add(configType);
                                            await _context.SaveChangesAsync(); // Save to get ID
                                            configTypesCache[configTypeName] = configType;
                                        }

                                        // Build Options
                                        var options = new List<ConfigurationOptionDto>();
                                        int sortOrder = 0;
                                        foreach (var v in variations)
                                        {
                                            options.Add(new ConfigurationOptionDto
                                            {
                                                Id = sortOrder + 1, // Dummy ID, frontend uses index or value often, but better to be unique in list
                                                ConfigurationTypeId = configType.Id,
                                                Name = v.Value,
                                                Value = v.Value,
                                                PriceModifier = v.Price,
                                                PriceType = "replace", 
                                                IsDefault = sortOrder == 0,
                                                SortOrder = sortOrder++,
                                                IsActive = true
                                            });
                                        }

                                        // Create/Update Override
                                        // Check in-memory collection first (eager loaded)
                                        var overrideItem = parentProduct.ConfigurationOverrides
                                            .FirstOrDefault(o => o.ConfigurationTypeId == configType.Id);

                                        if (overrideItem == null)
                                        {
                                            // Check DB just in case
                                            overrideItem = await _context.ProductConfigurationOverrides
                                                .FirstOrDefaultAsync(o => o.ProductId == parentProduct.Id && o.ConfigurationTypeId == configType.Id);
                                        }
                                        
                                        if (overrideItem == null)
                                        {
                                            overrideItem = new ProductConfigurationOverride
                                            {
                                                ProductId = parentProduct.Id,
                                                ConfigurationTypeId = configType.Id,
                                                OverrideType = "custom",
                                                CustomOptions = JsonSerializer.Serialize(options),
                                                IsActive = true
                                            };
                                            _context.ProductConfigurationOverrides.Add(overrideItem);
                                            
                                            // Keep in sync to avoid adding again if loop hits same product (unlikely with map)
                                            parentProduct.ConfigurationOverrides.Add(overrideItem);
                                        }
                                        else
                                        {
                                            overrideItem.OverrideType = "custom";
                                            overrideItem.CustomOptions = JsonSerializer.Serialize(options);
                                            // _context.Entry(overrideItem).State = EntityState.Modified; // Removed to avoid temporary ID error
                                        }
                                        configCount++;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                Log($"Error processing variations for product ID {kvp.Key}: {ex.Message}");
                            }
                        }
                        await _context.SaveChangesAsync();
                        Log($"PASS 3: Created configurations for {configCount} products.");
                    }
                }

                 return Ok(new { message = $"Import completed. Processed: {processed}, Created: {created}, Updated: {updated}, Skipped: {skipped}", log = sb.ToString() });
            }
            catch (Exception ex)
            {
                var errMsg = $"ERROR: {ex.Message}\nStack: {ex.StackTrace}";
                if (ex.InnerException != null) errMsg += $"\nInner Exception: {ex.InnerException.Message}";
                Log(errMsg);
                return StatusCode(500, new { message = ex.Message, logs = sb.ToString() });
            }
        }
    }
}
