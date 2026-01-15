using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;
using System.Text.Json;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<ProductsController> _logger;
        private readonly Services.ICsvSkuService _csvSkuService;

        public ProductsController(SegishopDbContext context, ILogger<ProductsController> logger, Services.ICsvSkuService csvSkuService)
        {
            _context = context;
            _logger = logger;
            _csvSkuService = csvSkuService;
        }

        /// <summary>
        /// Get all categories with their subcategories
        /// </summary>
        [HttpGet("categories")]
        public async Task<ActionResult<List<CategoryDto>>> GetCategories()
            {
                try
                {
                var bannedNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Electronics", "Clothing", "Books" };
                var parentCategories = await _context.Categories
                    .Where(c => c.IsActive && c.ParentId == null)
                    .Include(c => c.Children.Where(child => child.IsActive))
                    .OrderBy(c => c.SortOrder)
                    .ToListAsync();

                var categories = new List<CategoryDto>();
                foreach (var c in parentCategories)
                {
                    if (bannedNames.Contains(c.Name))
                    {
                        continue;
                    }
                    var childrenDtos = new List<CategoryDto>();
                    foreach (var child in c.Children.OrderBy(child => child.SortOrder))
                    {
                        if (bannedNames.Contains(child.Name))
                        {
                            continue;
                        }
                        var childCount = await _context.Products
                            .Where(p => p.CategoryId == child.Id)
                            .CountAsync();

                        childrenDtos.Add(new CategoryDto
                        {
                            Id = child.Id,
                            Name = child.Name,
                            Description = child.Description,
                            ImageUrl = child.ImageUrl,
                            ParentId = child.ParentId,
                            ParentName = c.Name,
                            IsActive = child.IsActive,
                            SortOrder = child.SortOrder,
                            Slug = child.Slug,
                            ConfigurationType = child.ConfigurationType,
                            Children = new List<CategoryDto>(),
                            ProductCount = childCount
                        });
                    }

                    childrenDtos = childrenDtos.Where(cd => cd.ProductCount > 0).ToList();

                    var parentCount = await _context.Products
                        .Include(p => p.Category)
                        .Where(p => p.IsActive && (p.CategoryId == c.Id || p.Category.ParentId == c.Id))
                        .CountAsync();

                    if (parentCount == 0 && childrenDtos.Count == 0)
                    {
                        continue;
                    }

                    categories.Add(new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        ImageUrl = c.ImageUrl,
                        ParentId = c.ParentId,
                        IsActive = c.IsActive,
                        SortOrder = c.SortOrder,
                        Slug = c.Slug,
                        ConfigurationType = c.ConfigurationType,
                        Children = childrenDtos,
                        ProductCount = parentCount
                    });
                }

                return Ok(new { success = true, categories = categories });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get category by ID with its subcategories
        /// </summary>
        [HttpGet("categories/{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Where(c => c.Id == id && c.IsActive && !new[] { "Electronics", "Clothing", "Books" }.Contains(c.Name))
                    .Include(c => c.Children.Where(child => child.IsActive))
                    .Include(c => c.Parent)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        ImageUrl = c.ImageUrl,
                        ParentId = c.ParentId,
                        ParentName = c.Parent != null ? c.Parent.Name : null,
                        IsActive = c.IsActive,
                        SortOrder = c.SortOrder,
                        Slug = c.Slug,
                        ConfigurationType = c.ConfigurationType,
                        Children = c.Children
                            .Where(child => child.IsActive)
                            .OrderBy(child => child.SortOrder)
                            .Select(child => new CategoryDto
                            {
                                Id = child.Id,
                                Name = child.Name,
                                Description = child.Description,
                                ImageUrl = child.ImageUrl,
                                ParentId = child.ParentId,
                                ParentName = c.Name,
                                IsActive = child.IsActive,
                                SortOrder = child.SortOrder,
                                Slug = child.Slug,
                                ConfigurationType = child.ConfigurationType,
                                Children = new List<CategoryDto>()
                            }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return NotFound(new { success = false, message = "Category not found" });
                }

                return Ok(new { success = true, category = category });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category with ID: {CategoryId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Search and filter products with advanced filtering
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<ProductSearchResponseDto>> SearchProducts([FromQuery] ProductSearchRequestDto request)
        {
            try
            {
                // Parse filters from query string manually
                var filters = new Dictionary<string, List<string>>();
                foreach (var key in Request.Query.Keys)
                {
                    if (key.StartsWith("filters[") && key.EndsWith("]"))
                    {
                        var filterName = key.Substring(8, key.Length - 9); // Remove "filters[" and "]"
                        var filterValues = Request.Query[key].Where(v => !string.IsNullOrEmpty(v)).Select(v => v!).ToList();

                        if (!filters.ContainsKey(filterName))
                        {
                            filters[filterName] = new List<string>();
                        }
                        filters[filterName].AddRange(filterValues);
                    }
                }

                // Merge with existing filters
                foreach (var filter in filters)
                {
                    request.Filters[filter.Key] = filter.Value;
                }
                var query = _context.Products
                    .Include(p => p.Category)
                        .ThenInclude(c => c.Parent)
                    .Include(p => p.Images)
                    .Where(p => p.IsActive && !new[] { "Electronics", "Clothing", "Books" }.Contains(p.Category.Name));

                // Apply basic filters
                if (!string.IsNullOrEmpty(request.SearchTerm))
                {
                    query = query.Where(p => p.Name.Contains(request.SearchTerm) ||
                                           p.Description.Contains(request.SearchTerm));
                }

                if (request.CategoryId.HasValue)
                {
                    query = query.Where(p => p.CategoryId == request.CategoryId.Value ||
                                           p.Category.ParentId == request.CategoryId.Value);
                }

                // Apply price range filter
                if (request.MinPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= request.MinPrice.Value);
                }

                if (request.MaxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= request.MaxPrice.Value);
                }

                // Handle price range from filters (e.g., "20-50")
                if (request.Filters.ContainsKey("Price") && request.Filters["Price"].Any())
                {
                    var priceRanges = request.Filters["Price"];
                    var priceQueries = new List<IQueryable<Product>>();

                    foreach (var range in priceRanges)
                    {
                        if (range.Contains("-"))
                        {
                            var parts = range.Split('-');
                            if (parts.Length == 2 &&
                                decimal.TryParse(parts[0], out var minPrice) &&
                                decimal.TryParse(parts[1], out var maxPrice))
                            {
                                priceQueries.Add(query.Where(p => p.Price >= minPrice && p.Price <= maxPrice));
                            }
                        }
                    }

                    if (priceQueries.Any())
                    {
                        // Union all price range queries
                        var combinedQuery = priceQueries.First();
                        foreach (var priceQuery in priceQueries.Skip(1))
                        {
                            combinedQuery = combinedQuery.Union(priceQuery);
                        }
                        query = combinedQuery;
                    }
                }

                if (request.IsFeatured.HasValue)
                {
                    query = query.Where(p => p.IsFeatured == request.IsFeatured.Value);
                }

                if (request.InStock.HasValue)
                {
                    if (request.InStock.Value)
                    {
                        query = query.Where(p => p.Stock > 0);
                    }
                    else
                    {
                        query = query.Where(p => p.Stock <= 0);
                    }
                }

                // Apply custom filters based on ProductFilterValues table
                foreach (var filter in request.Filters.Where(f => f.Key != "Price" && f.Key != "StockStatus"))
                {
                    var filterName = filter.Key;
                    var filterValues = filter.Value;

                    if (filterValues.Any())
                    {
                        // Get product IDs that have matching filter values
                        var productIds = await _context.ProductFilterValues
                            .Include(pfv => pfv.FilterOption)
                            .Include(pfv => pfv.FilterOptionValue)
                            .Where(pfv => pfv.FilterOption.Name == filterName &&
                                         (pfv.FilterOptionValue != null && filterValues.Contains(pfv.FilterOptionValue.Value) ||
                                          pfv.CustomValue != null && filterValues.Contains(pfv.CustomValue)))
                            .Select(pfv => pfv.ProductId)
                            .Distinct()
                            .ToListAsync();

                        // Always apply the filter - if no products match, return empty result
                        query = query.Where(p => productIds.Contains(p.Id));
                    }
                }

                // Handle StockStatus filter separately (based on actual stock, not ProductAttributes)
                if (request.Filters.ContainsKey("StockStatus") && request.Filters["StockStatus"].Any())
                {
                    var stockStatusValues = request.Filters["StockStatus"];

                    if (stockStatusValues.Contains("InStock") && stockStatusValues.Contains("OutOfStock"))
                    {
                        // Both selected - show all products (no filter needed)
                    }
                    else if (stockStatusValues.Contains("InStock"))
                    {
                        query = query.Where(p => p.Stock > 0);
                    }
                    else if (stockStatusValues.Contains("OutOfStock"))
                    {
                        query = query.Where(p => p.Stock <= 0);
                    }
                }

                // Apply sorting
                query = request.SortBy?.ToLower() switch
                {
                    "price" => request.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.Price)
                        : query.OrderBy(p => p.Price),
                    "created" => request.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.CreatedAt)
                        : query.OrderBy(p => p.CreatedAt),
                    "popularity" => query
                        .GroupJoin(_context.OrderItems, p => p.Id, oi => oi.ProductId, (p, orderItems) => new { Product = p, OrderCount = orderItems.Count() })
                        .OrderByDescending(x => x.OrderCount)
                        .ThenByDescending(x => x.Product.CreatedAt)
                        .Select(x => x.Product),
                    "rating" => query
                        .OrderByDescending(p => p.IsFeatured) // Placeholder: Use featured as proxy for rating until review system is implemented
                        .ThenByDescending(p => p.CreatedAt),
                    "name" => request.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.Name)
                        : query.OrderBy(p => p.Name),
                    "featured" => query.OrderByDescending(p => p.IsFeatured).ThenBy(p => p.Name),
                    _ => request.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.CreatedAt) // Default to latest
                        : query.OrderBy(p => p.CreatedAt)
                };

                // Get total count
                var totalCount = await query.CountAsync();

                // Compute price range across the entire filtered (pre-paginated) set
                decimal? minAll = null;
                decimal? maxAll = null;
                try
                {
                    List<decimal> allPrices;
                    if (request.CategoryId.HasValue)
                    {
                        var allCategories = await _context.Categories
                            .Select(c => new { c.Id, c.ParentId })
                            .ToListAsync();

                        var target = request.CategoryId.Value;
                        var idSet = new HashSet<int> { target };

                        // Gather all descendant categories
                        bool added;
                        do
                        {
                            added = false;
                            foreach (var c in allCategories)
                            {
                                if (c.ParentId.HasValue && idSet.Contains(c.ParentId.Value) && !idSet.Contains(c.Id))
                                {
                                    idSet.Add(c.Id);
                                    added = true;
                                }
                            }
                        } while (added);

                        var priceQuery = _context.Products
                            .Where(p => p.IsActive && idSet.Contains(p.CategoryId));

                        // In-stock filter
                        priceQuery = priceQuery.Where(p => p.Stock > 0);

                        allPrices = await priceQuery
                            .Select(p => p.Price)
                            .Where(price => price > 0m)
                            .ToListAsync();
                    }
                    else
                    {
                        allPrices = await query
                            .Select(p => p.Price)
                            .Where(price => price > 0m)
                            .ToListAsync();
                    }

                    if (allPrices.Count > 0)
                    {
                        minAll = allPrices.Min();
                        maxAll = allPrices.Max();
                        if (maxAll <= minAll)
                        {
                            maxAll = minAll + 1;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to compute price range for filtered products");
                }

        // Apply pagination
        var products = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new ProductListDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                SalePrice = p.SalePrice,
                ImageUrl = string.IsNullOrEmpty(p.ImageUrl) 
                    ? p.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).FirstOrDefault() 
                    : p.ImageUrl,
                CategoryName = p.Category.Name,
                CategoryConfigurationType = p.Category.ConfigurationType,
                HasActiveConfigurations =
                    // Check if category has active configuration templates (regardless of ConfigurationType)
                    _context.CategoryConfigurationTemplates.Any(cct => cct.CategoryId == p.CategoryId && cct.IsActive) ||
                    // OR if product has active configuration overrides
                    _context.ProductConfigurationOverrides.Any(pco => pco.ProductId == p.Id && pco.IsActive),
                IsActive = p.IsActive,
                IsFeatured = p.IsFeatured,
                Stock = p.Stock,
                Slug = p.Slug
            })
            .ToListAsync();

        products.ForEach(p => p.ImageUrl = NormalizeImageUrl(p.ImageUrl));

                var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

                var response = new ProductSearchResponseDto
                {
                    Products = products,
                    TotalCount = totalCount,
                    Page = request.Page,
                    PageSize = request.PageSize,
                    TotalPages = totalPages,
                    HasNextPage = request.Page < totalPages,
                    HasPreviousPage = request.Page > 1,

                };



                return Ok(new { success = true, data = response, priceRange = new { min = minAll, max = maxAll } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching products with filters");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get all products with basic information
        /// </summary>
       [HttpGet]
public async Task<IActionResult> GetProducts(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    [FromQuery] int? categoryId = null,
    [FromQuery] bool? featured = null)
{
    try
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive && !new[] { "Electronics", "Clothing", "Books" }.Contains(p.Category.Name));

        if (featured.HasValue)
            query = query.Where(p => p.IsFeatured == featured.Value);

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Take(pageSize)
            .Select(p => new ProductListDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                SalePrice = p.SalePrice,
                ImageUrl = p.ImageUrl,
                CategoryName = p.Category.Name,
                IsActive = p.IsActive,
                IsFeatured = p.IsFeatured,
                Stock = p.Stock,
                Slug = p.Slug
            })
            .ToListAsync();

        // Normalize image URLs after fetching from DB
        products.ForEach(p => p.ImageUrl = NormalizeImageUrl(p.ImageUrl));

        return Ok(new
        {
            success = true,
            products = products
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting products");
        return StatusCode(500, new { success = false, message = "Internal server error" });
    }
}

        /// <summary>
        /// Get product by slug with full details
        /// </summary>
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<ProductDetailDto>> GetProductBySlug(string slug)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .ThenInclude(c => c.Parent)
                    .Include(p => p.Images.OrderBy(i => i.SortOrder))
                    .Include(p => p.ProductAttributes.OrderBy(a => a.SortOrder))
                    .Include(p => p.Highlights.Where(h => h.IsActive).OrderBy(h => h.SortOrder))
                    .Where(p => p.Slug == slug && p.IsActive)
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Product not found" });
                }

                // Get dynamic configurations (category + product overrides)
                var dynamicConfigurations = await GetProductDynamicConfigurations(product.Id);

                var sku = product.SKU;
                if (string.IsNullOrWhiteSpace(sku))
                {
                    sku = _csvSkuService.GetProductSku(product.Id);
                }

                var productDetailDto = new ProductDetailDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    LongDescription = product.LongDescription,
                    Price = product.Price,
                    SalePrice = product.SalePrice,
                    SKU = sku,
                    Stock = product.Stock,
                    ImageUrl = NormalizeImageUrl(product.ImageUrl),
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    ParentCategoryName = product.Category.Parent?.Name,
                    IsActive = product.IsActive,
                    IsFeatured = product.IsFeatured,
                    CreatedAt = product.CreatedAt,
                    Slug = product.Slug,
                    Images = product.Images.Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        ImageUrl = NormalizeImageUrl(i.ImageUrl),
                        AltText = i.AltText,
                        SortOrder = i.SortOrder,
                        IsPrimary = i.IsPrimary
                    }).ToList(),
                    Attributes = product.ProductAttributes.Select(a => new ProductAttributeDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Value = a.Value,
                        SortOrder = a.SortOrder
                    }).ToList(),
                    DynamicConfigurations = dynamicConfigurations,
                    Highlights = product.Highlights.Select(h => new ProductHighlightDto
                    {
                        Id = h.Id,
                        Highlight = h.Highlight,
                        SortOrder = h.SortOrder
                    }).ToList()
                };

                return Ok(new { success = true, product = productDetailDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product by slug: {Slug}", slug);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get product by ID with full details
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .ThenInclude(c => c.Parent)
                    .Include(p => p.Images.OrderBy(i => i.SortOrder))
                    .Include(p => p.ProductAttributes.OrderBy(a => a.SortOrder))
                    .Where(p => p.Id == id && p.IsActive)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        LongDescription = p.LongDescription,
                        Price = p.Price,
                        SalePrice = p.SalePrice,
                        SKU = p.SKU,
                        Stock = p.Stock,
                        ImageUrl = p.ImageUrl,
                        CategoryId = p.CategoryId,
                        CategoryName = p.Category.Name,
                        ParentCategoryName = p.Category.Parent != null ? p.Category.Parent.Name : null,
                        IsActive = p.IsActive,
                        IsFeatured = p.IsFeatured,
                        CreatedAt = p.CreatedAt,
                        Slug = p.Slug,
                        Images = p.Images.Select(i => new ProductImageDto
                        {
                            Id = i.Id,
                            ImageUrl = i.ImageUrl,
                            AltText = i.AltText,
                            SortOrder = i.SortOrder,
                            IsPrimary = i.IsPrimary
                        }).ToList(),
                        Attributes = p.ProductAttributes.Select(a => new ProductAttributeDto
                        {
                            Id = a.Id,
                            Name = a.Name,
                            Value = a.Value,
                            SortOrder = a.SortOrder
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Product not found" });
                }

                product.ImageUrl = NormalizeImageUrl(product.ImageUrl);
                if (product.Images != null)
                {
                    foreach (var img in product.Images)
                    {
                        img.ImageUrl = NormalizeImageUrl(img.ImageUrl);
                    }
                }

                return Ok(new { success = true, product = product });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product with ID: {ProductId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get product by ID with full details including quantity sets, variety box options, and highlights
        /// </summary>
        [HttpGet("{id:int}/details")]
        public async Task<ActionResult<ProductDetailDto>> GetProductDetails(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .ThenInclude(c => c.Parent)
                    .Include(p => p.Images.OrderBy(i => i.SortOrder))
                    .Include(p => p.ProductAttributes.OrderBy(a => a.SortOrder))
                    .Include(p => p.Highlights.Where(h => h.IsActive).OrderBy(h => h.SortOrder))
                    .Where(p => p.Id == id && p.IsActive)
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Product not found" });
                }

                // Get dynamic configurations (category + product overrides)
                var dynamicConfigurations = await GetProductDynamicConfigurations(product.Id);

                var productDetailDto = new ProductDetailDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    LongDescription = product.LongDescription,
                    Price = product.Price,
                    SalePrice = product.SalePrice,
                    SKU = product.SKU,
                    Stock = product.Stock,
                    ImageUrl = NormalizeImageUrl(product.ImageUrl),
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    ParentCategoryName = product.Category.Parent?.Name,
                    IsActive = product.IsActive,
                    IsFeatured = product.IsFeatured,
                    CreatedAt = product.CreatedAt,
                    Slug = product.Slug,
                    Images = product.Images.Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        ImageUrl = NormalizeImageUrl(i.ImageUrl),
                        AltText = i.AltText,
                        SortOrder = i.SortOrder,
                        IsPrimary = i.IsPrimary
                    }).ToList(),
                    Attributes = product.ProductAttributes.Select(a => new ProductAttributeDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Value = a.Value,
                        SortOrder = a.SortOrder
                    }).ToList(),
                    DynamicConfigurations = dynamicConfigurations,
                    Highlights = product.Highlights.Select(h => new ProductHighlightDto
                    {
                        Id = h.Id,
                        Highlight = h.Highlight,
                        SortOrder = h.SortOrder
                    }).ToList()
                };

                return Ok(new { success = true, product = productDetailDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product details with ID: {ProductId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get product by slug with full details including quantity sets, variety box options, and highlights
        /// </summary>
        [HttpGet("slug/{slug}/details")]
        public async Task<ActionResult<ProductDetailDto>> GetProductDetailsBySlug(string slug)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .ThenInclude(c => c.Parent)
                    .Include(p => p.Images.OrderBy(i => i.SortOrder))
                    .Include(p => p.ProductAttributes.OrderBy(a => a.SortOrder))
                    .Include(p => p.Highlights.Where(h => h.IsActive).OrderBy(h => h.SortOrder))
                    .Where(p => p.Slug == slug && p.IsActive)
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new { success = false, message = "Product not found" });
                }

                // Get dynamic configurations (category + product overrides)
                var dynamicConfigurations = await GetProductDynamicConfigurations(product.Id);

                var productDetailDto = new ProductDetailDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    LongDescription = product.LongDescription,
                    Price = product.Price,
                    SalePrice = product.SalePrice,
                    SKU = product.SKU,
                    Stock = product.Stock,
                    ImageUrl = NormalizeImageUrl(product.ImageUrl),
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    ParentCategoryName = product.Category.Parent?.Name,
                    IsActive = product.IsActive,
                    IsFeatured = product.IsFeatured,
                    CreatedAt = product.CreatedAt,
                    Slug = product.Slug,
                    Images = product.Images.Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        ImageUrl = NormalizeImageUrl(i.ImageUrl),
                        AltText = i.AltText,
                        SortOrder = i.SortOrder,
                        IsPrimary = i.IsPrimary
                    }).ToList(),
                    Attributes = product.ProductAttributes.Select(a => new ProductAttributeDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Value = a.Value,
                        SortOrder = a.SortOrder
                    }).ToList(),
                    DynamicConfigurations = dynamicConfigurations,
                    Highlights = product.Highlights.Select(h => new ProductHighlightDto
                    {
                        Id = h.Id,
                        Highlight = h.Highlight,
                        SortOrder = h.SortOrder
                    }).ToList()
                };

                return Ok(new { success = true, product = productDetailDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product details with slug: {Slug}", slug);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        private string? NormalizeImageUrl(string? url)
        {
            if (string.IsNullOrWhiteSpace(url)) return url;
            var origin = $"{Request.Scheme}://{Request.Host.Value}";

            var domainsToReplace = new[]
            {
                "http://localhost", "https://localhost",
                "http://0.0.0.0", "https://0.0.0.0",
                "http://printoscar.xendekweb.com", "https://printoscar.xendekweb.com"
            };

            // Check if URL starts with any of the domains to replace
            foreach (var domain in domainsToReplace)
            {
                if (url.StartsWith(domain, StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        var u = new Uri(url);
                        var pathAndQuery = u.PathAndQuery;
                        return origin + pathAndQuery;
                    }
                    catch { return origin; }
                }
            }

            // If relative path (e.g., /uploads/...), prefix origin
            if (url.StartsWith("/")) return origin + url;
            // If bare uploads path without leading slash
            if (url.StartsWith("uploads/")) return origin + "/" + url;
            // If bare wp-content path without leading slash
            if (url.StartsWith("wp-content/")) return origin + "/" + url;
            return url;
        }

        /// <summary>
        /// Get featured products
        /// </summary>
        [HttpGet("featured")]
        public async Task<ActionResult<List<ProductListDto>>> GetFeaturedProducts([FromQuery] int limit = 10)
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.IsActive && p.IsFeatured && !new[] { "Electronics", "Clothing", "Books" }.Contains(p.Category.Name))
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(limit)
                    .Select(p => new ProductListDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        SalePrice = p.SalePrice,
                        ImageUrl = p.ImageUrl,
                        CategoryName = p.Category.Name,
                        CategoryConfigurationType = p.Category.ConfigurationType,
                        HasActiveConfigurations =
                            // Check if category has active configuration templates (regardless of ConfigurationType)
                            _context.CategoryConfigurationTemplates.Any(cct => cct.CategoryId == p.CategoryId && cct.IsActive) ||
                            // OR if product has active configuration overrides
                            _context.ProductConfigurationOverrides.Any(pco => pco.ProductId == p.Id && pco.IsActive),
                        IsActive = p.IsActive,
                        IsFeatured = p.IsFeatured,
                        Stock = p.Stock,
                        Slug = p.Slug
                    })
                    .ToListAsync();

                products.ForEach(p => p.ImageUrl = NormalizeImageUrl(p.ImageUrl));

                return Ok(new { success = true, products = products });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting featured products");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Generate slugs for products that don't have them
        /// </summary>
        [HttpPost("generate-slugs")]
        public async Task<ActionResult> GenerateSlugs()
        {
            try
            {
                var productsWithoutSlugs = await _context.Products
                    .Where(p => p.Slug == null || p.Slug == "")
                    .ToListAsync();

                foreach (var product in productsWithoutSlugs)
                {
                    product.Slug = GenerateSlugFromName(product.Name);
                    product.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new {
                    success = true,
                    message = $"Generated slugs for {productsWithoutSlugs.Count} products",
                    updatedProducts = productsWithoutSlugs.Select(p => new { p.Id, p.Name, p.Slug }).ToList()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating slugs");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Clean up all product slugs (remove whitespace and regenerate)
        /// </summary>
        [HttpPost("cleanup-slugs")]
        public async Task<ActionResult> CleanupSlugs()
        {
            try
            {
                var allProducts = await _context.Products.ToListAsync();
                var updatedCount = 0;

                foreach (var product in allProducts)
                {
                    var cleanSlug = GenerateSlugFromName(product.Name);
                    if (product.Slug != cleanSlug)
                    {
                        product.Slug = cleanSlug;
                        product.UpdatedAt = DateTime.UtcNow;
                        updatedCount++;
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new {
                    success = true,
                    message = $"Cleaned up slugs for {updatedCount} products",
                    updatedProducts = allProducts.Where(p => p.Slug != null).Select(p => new { p.Id, p.Name, p.Slug }).ToList()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up slugs");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        private string GenerateSlugFromName(string name)
        {
            if (string.IsNullOrEmpty(name))
                return "";

            // Convert to lowercase and replace spaces and special characters with hyphens
            var slug = name.ToLowerInvariant()
                          .Replace(" ", "-")
                          .Replace("–", "-")
                          .Replace("—", "-")
                          .Replace("/", "-")
                          .Replace("&", "and")
                          .Replace("'", "")
                          .Replace("\"", "")
                          .Replace("(", "")
                          .Replace(")", "")
                          .Replace(",", "")
                          .Replace(".", "")
                          .Replace("!", "")
                          .Replace("?", "");

            // Remove multiple consecutive hyphens
            while (slug.Contains("--"))
            {
                slug = slug.Replace("--", "-");
            }

            // Remove leading and trailing hyphens
            slug = slug.Trim('-');

            return slug;
        }

        /// <summary>
        /// Get products by category
        /// </summary>
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<ProductSearchResponseDto>> GetProductsByCategory(
            int categoryId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var searchRequest = new ProductSearchRequestDto
                {
                    CategoryId = categoryId,
                    Page = page,
                    PageSize = pageSize
                };

                return await SearchProducts(searchRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products for category: {CategoryId}", categoryId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete a category by ID (soft delete)
        /// </summary>
        [HttpDelete("categories/{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Children)
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound(new { success = false, message = "Category not found" });
                }

                // Check if category has products
                if (category.Products.Any(p => p.IsActive))
                {
                    return BadRequest(new {
                        success = false,
                        message = "Cannot delete category that contains active products. Please move or delete products first."
                    });
                }

                // Check if category has active children
                if (category.Children.Any(c => c.IsActive))
                {
                    return BadRequest(new {
                        success = false,
                        message = "Cannot delete category that contains active subcategories. Please delete subcategories first."
                    });
                }

                // Soft delete - set IsActive to false
                category.IsActive = false;
                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Category deleted successfully: {CategoryId}", id);
                return Ok(new { success = true, message = "Category deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category with ID: {CategoryId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Create a new category
        /// </summary>
        [HttpPost("categories")]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto createCategoryDto)
        {
            try
            {
                // Validate parent category if specified
                if (createCategoryDto.ParentId.HasValue)
                {
                    var parentExists = await _context.Categories
                        .AnyAsync(c => c.Id == createCategoryDto.ParentId.Value && c.IsActive);

                    if (!parentExists)
                    {
                        return BadRequest(new { success = false, message = "Parent category not found" });
                    }
                }

                // Generate slug if not provided
                var slug = !string.IsNullOrEmpty(createCategoryDto.Slug)
                    ? createCategoryDto.Slug
                    : createCategoryDto.Name.ToLowerInvariant().Replace(" ", "-").Replace("&", "and");

                // Check if slug already exists
                var slugExists = await _context.Categories
                    .AnyAsync(c => c.Slug == slug && c.IsActive);

                if (slugExists)
                {
                    return BadRequest(new { success = false, message = "Category slug already exists" });
                }

                var category = new Category
                {
                    Name = createCategoryDto.Name,
                    Description = createCategoryDto.Description ?? string.Empty,
                    ImageUrl = createCategoryDto.ImageUrl,
                    ParentId = createCategoryDto.ParentId,
                    IsActive = true,
                    SortOrder = createCategoryDto.SortOrder,
                    Slug = slug,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                // Return the created category
                var createdCategory = await _context.Categories
                    .Where(c => c.Id == category.Id)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        ImageUrl = c.ImageUrl,
                        ParentId = c.ParentId,
                        IsActive = c.IsActive,
                        SortOrder = c.SortOrder,
                        Slug = c.Slug,
                        Children = new List<CategoryDto>()
                    })
                    .FirstOrDefaultAsync();

                _logger.LogInformation("Category created successfully: {CategoryId}", category.Id);
                return CreatedAtAction(nameof(GetCategory), new { id = category.Id },
                    new { success = true, category = createdCategory });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Fix all filtering issues - Add missing ProductAttributes and sample data
        /// </summary>
        [HttpPost("fix-all-filtering")]
        public async Task<ActionResult> FixAllFiltering()
        {
            try
            {
                var result = new
                {
                    success = true,
                    message = "All filtering issues fixed",
                    details = new List<string>()
                };

                // Fix Snacks category - Add Flavor and Diet attributes
                await FixSnacksFiltering();

                // Fix Decor category - Add Size and Fabric attributes
                await FixDecorFiltering();

                // Fix Fashion category - Add Size and Fabric attributes
                await FixFashionFiltering();

                // Add sample products if needed
                await AddSampleProductsIfNeeded();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fixing all filtering issues");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Fix specific products with missing price or images (Admin helper)
        /// </summary>
        [HttpPost("fix-broken-products")]
        public async Task<ActionResult> FixBrokenProducts()
        {
            try
            {
                var fixedProducts = new List<string>();

                // 1. Peak Series Acrylic Award with Blue Accents
                var p1 = await _context.Products.FirstOrDefaultAsync(p => p.Name == "Peak Series Acrylic Award with Blue Accents");
                if (p1 != null)
                {
                    p1.Price = 64.95m;
                    p1.ImageUrl = "http://printoscar.com/wp-content/uploads/2024/12/Peak-Series-Acrylic-Award-with-Blue-Accents.png";
                    fixedProducts.Add(p1.Name);
                }

                // 2. VICTORY RESIN FOOTBALL
                var p2 = await _context.Products.FirstOrDefaultAsync(p => p.Name == "VICTORY RESIN FOOTBALL");
                if (p2 != null)
                {
                    p2.Price = 32.00m;
                    p2.ImageUrl = "http://printoscar.com/wp-content/uploads/2025/11/47.jpg";
                    fixedProducts.Add(p2.Name);
                }

                // 3. Black Piano Finish Perpetual Plaque with Header and 24 Perpetual Plates
                var p3 = await _context.Products.FirstOrDefaultAsync(p => p.Name == "Black Piano Finish Perpetual Plaque with Header and 24 Perpetual Plates");
                if (p3 != null)
                {
                    p3.Price = 249.00m;
                    p3.ImageUrl = "http://printoscar.com/wp-content/uploads/2025/11/80.webp";
                    fixedProducts.Add(p3.Name);
                }

                // 4. BILLBOARD SERIES LG TRAC
                var p4 = await _context.Products.FirstOrDefaultAsync(p => p.Name == "BILLBOARD SERIES LG TRAC");
                if (p4 != null)
                {
                    p4.Price = 31.00m;
                    p4.ImageUrl = "http://printoscar.com/wp-content/uploads/2025/11/4-1.jpg";
                    fixedProducts.Add(p4.Name);
                }

                // 5. Feature Specific Products (Requested by user)
                var featuredNames = new[]
                {
                    "Bevel Edge Circle Glass Award",
                    "Black Edge Crystal on Black Base",
                    "Blue Crystal Floating Diamond with Blue Columns on Clear Base",
                    "Blue Crystal Globe on Clear Crystal Base",
                    "Blue Stripe Wave Crystal",
                    "Fanfare Spectra Color Crystal",
                    "Blue Crystal Star on Clear Pedestal Base",
                    "Optic Crystal With Blue Fused Accent"
                };

                // Unfeature all products first to ensure exactly 8
                var allFeatured = await _context.Products.Where(p => p.IsFeatured).ToListAsync();
                allFeatured.ForEach(p => p.IsFeatured = false);
                fixedProducts.Add($"Unfeatured {allFeatured.Count} products");

                foreach (var name in featuredNames)
                {
                    var p = await _context.Products.FirstOrDefaultAsync(pr => pr.Name == name);
                    if (p != null)
                    {
                        p.IsFeatured = true;
                        fixedProducts.Add($"Featured: {p.Name}");
                    }
                    else
                    {
                         // Try fuzzy match
                         var fuzzy = await _context.Products.FirstOrDefaultAsync(pr => pr.Name.Contains(name));
                         if (fuzzy != null)
                         {
                             fuzzy.IsFeatured = true;
                             fixedProducts.Add($"Featured (Fuzzy): {fuzzy.Name}");
                         }
                         else
                         {
                             fixedProducts.Add($"Not Found: {name}");
                         }
                    }
                }

                await _context.SaveChangesAsync();
                
                return Ok(new { success = true, message = $"Fixed {fixedProducts.Count} products", products = fixedProducts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fixing product");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Seed filters and products for all categories (Development helper)
        /// </summary>
        [HttpPost("seed-all-categories")]
        public async Task<ActionResult> SeedAllCategories()
        {
            try
            {
                var result = new
                {
                    success = true,
                    message = "All categories setup completed",
                    categories = new List<object>()
                };

                // Setup Snacks category (ID: 5)
                await SetupSnacksCategory();

                // Setup Bags category
                await SetupBagsCategory();

                // Setup Decor category
                await SetupDecorCategory();

                // Setup Fashion category
                await SetupFashionCategory();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting up all categories");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Seed sample products for Snacks category with filter attributes (Development helper)
        /// </summary>
        [HttpPost("seed-snacks-products")]
        public async Task<ActionResult> SeedSnacksProducts()
        {
            try
            {
                // Check if products already exist
                var existingProducts = await _context.Products
                    .Where(p => p.CategoryId == 5)
                    .CountAsync();

                if (existingProducts > 0)
                {
                    return Ok(new { success = true, message = $"Snacks category already has {existingProducts} products" });
                }

                // Sample products for Snacks category
                var sampleProducts = new[]
                {
                    new { Name = "Sweet Coconut Candy", Price = 25m, ProductType = "Candy", Taste = "Sweet", Texture = "Soft" },
                    new { Name = "Roasted Corn Snacks", Price = 35m, ProductType = "Corn", Taste = "Salty", Texture = "Crunchy" },
                    new { Name = "Mixed Nuts Delight", Price = 45m, ProductType = "Nuts", Taste = "Salty", Texture = "Crunchy" },
                    new { Name = "Coconut Chips", Price = 30m, ProductType = "Coconut", Taste = "Sweet", Texture = "Crunchy" },
                    new { Name = "Plantain Chips", Price = 28m, ProductType = "Plantain", Taste = "Salty", Texture = "Crunchy" },
                    new { Name = "Sugar Cane Sticks", Price = 20m, ProductType = "Sugar Cane", Taste = "Sweet", Texture = "Chewy" },
                    new { Name = "Spicy Corn Puffs", Price = 32m, ProductType = "Corn", Taste = "Spicy", Texture = "Crunchy" },
                    new { Name = "Honey Nuts", Price = 50m, ProductType = "Nuts", Taste = "Sweet", Texture = "Crunchy" },
                    new { Name = "Soft Dough Balls", Price = 22m, ProductType = "Dough", Taste = "Sweet", Texture = "Soft" },
                    new { Name = "Spicy Plantain Strips", Price = 33m, ProductType = "Plantain", Taste = "Spicy", Texture = "Crunchy" }
                };

                var createdProducts = new List<int>();

                foreach (var sample in sampleProducts)
                {
                    // Create product
                    var product = new Product
                    {
                        Name = sample.Name,
                        Description = $"Delicious {sample.ProductType.ToLower()} snack with {sample.Taste.ToLower()} taste",
                        Price = sample.Price,
                        CategoryId = 5, // Snacks category
                        Stock = 100,
                        IsActive = true,
                        IsFeatured = false,
                        Slug = sample.Name.ToLower().Replace(" ", "-"),
                        ImageUrl = $"/images/snacks/{sample.Name.ToLower().Replace(" ", "-")}.jpg"
                    };

                    _context.Products.Add(product);
                    await _context.SaveChangesAsync();

                    // Add product attributes for filtering
                    var attributes = new[]
                    {
                        new ProductAttribute { ProductId = product.Id, Name = "Product", Value = sample.ProductType, SortOrder = 1 },
                        new ProductAttribute { ProductId = product.Id, Name = "Taste", Value = sample.Taste, SortOrder = 2 },
                        new ProductAttribute { ProductId = product.Id, Name = "Texture", Value = sample.Texture, SortOrder = 3 }
                    };

                    _context.ProductAttributes.AddRange(attributes);
                    createdProducts.Add(product.Id);
                }

                await _context.SaveChangesAsync();

                return Ok(new {
                    success = true,
                    message = "Sample snacks products created successfully",
                    productsCreated = createdProducts.Count,
                    productIds = createdProducts
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sample snacks products");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get filter options for a specific category (includes parent category filters for subcategories)
        /// </summary>
        [HttpGet("categories/{categoryId}/filters")]
        public async Task<ActionResult<List<FilterOptionDto>>> GetFiltersByCategory(int categoryId)
        {
            try
            {
                // Get the category to check if it has a parent
                var category = await _context.Categories
                    .Where(c => c.Id == categoryId && c.IsActive)
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return NotFound(new { success = false, message = "Category not found" });
                }

                // Get category IDs to search for filters (current category + parent if exists)
                var categoryIds = new List<int> { categoryId };
                if (category.ParentId.HasValue)
                {
                    categoryIds.Add(category.ParentId.Value);
                }

                var filters = await _context.FilterOptions
                    .Where(f => categoryIds.Contains(f.CategoryId) && f.IsActive)
                    .Include(f => f.FilterOptionValues.Where(v => v.IsActive))
                    .OrderBy(f => f.SortOrder)
                    .Select(f => new FilterOptionDto
                    {
                        Id = f.Id,
                        Name = f.Name,
                        DisplayName = f.DisplayName,
                        Description = f.Description,
                        CategoryId = f.CategoryId,
                        FilterType = f.FilterType,
                        MinValue = f.MinValue,
                        MaxValue = f.MaxValue,
                        SortOrder = f.SortOrder,
                        IsActive = f.IsActive,
                        FilterOptionValues = f.FilterOptionValues
                            .Where(v => v.IsActive)
                            .OrderBy(v => v.SortOrder)
                            .Select(v => new FilterOptionValueDto
                            {
                                Id = v.Id,
                                FilterOptionId = v.FilterOptionId,
                                Value = v.Value,
                                DisplayValue = v.DisplayValue,
                                Description = v.Description,
                                ColorCode = v.ColorCode,
                                SortOrder = v.SortOrder,
                                IsActive = v.IsActive
                            }).ToList()
                    })
                    .ToListAsync();

                return Ok(new { success = true, filters = filters });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filters for category: {CategoryId}", categoryId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get all filter options
        /// </summary>
        [HttpGet("filters")]
        public async Task<ActionResult<List<FilterOptionDto>>> GetAllFilters()
        {
            try
            {
                var filters = await _context.FilterOptions
                    .Where(f => f.IsActive)
                    .Include(f => f.FilterOptionValues.Where(v => v.IsActive))
                    .Include(f => f.Category)
                    .OrderBy(f => f.Category.Name)
                    .ThenBy(f => f.SortOrder)
                    .Select(f => new FilterOptionDto
                    {
                        Id = f.Id,
                        Name = f.Name,
                        DisplayName = f.DisplayName,
                        Description = f.Description,
                        CategoryId = f.CategoryId,
                        FilterType = f.FilterType,
                        MinValue = f.MinValue,
                        MaxValue = f.MaxValue,
                        SortOrder = f.SortOrder,
                        IsActive = f.IsActive,
                        FilterOptionValues = f.FilterOptionValues
                            .Where(v => v.IsActive)
                            .OrderBy(v => v.SortOrder)
                            .Select(v => new FilterOptionValueDto
                            {
                                Id = v.Id,
                                FilterOptionId = v.FilterOptionId,
                                Value = v.Value,
                                DisplayValue = v.DisplayValue,
                                Description = v.Description,
                                ColorCode = v.ColorCode,
                                SortOrder = v.SortOrder,
                                IsActive = v.IsActive
                            }).ToList()
                    })
                    .ToListAsync();

                return Ok(new { success = true, filters = filters });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all filters");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get filter counts for a specific category with applied filters
        /// </summary>
        [HttpGet("filter-counts")]
        public async Task<ActionResult> GetFilterCounts(
            [FromQuery] int categoryId)
        {
            try
            {
                // Parse applied filters from query string
                var appliedFilters = new Dictionary<string, string[]>();
                foreach (var key in Request.Query.Keys.Where(k => k.StartsWith("filters[")))
                {
                    var filterName = key.Substring(8, key.Length - 9); // Remove "filters[" and "]"
                    var values = Request.Query[key].Where(v => !string.IsNullOrEmpty(v)).Select(v => v!).ToArray();
                    if (values.Length > 0)
                    {
                        appliedFilters[filterName] = values;
                    }
                }

                // Get all products for the category
                var baseQuery = _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.ProductFilterValues)
                        .ThenInclude(pfv => pfv.FilterOption)
                    .Include(p => p.ProductFilterValues)
                        .ThenInclude(pfv => pfv.FilterOptionValue)
                    .Where(p => p.IsActive && (p.CategoryId == categoryId || p.Category.ParentId == categoryId));

                // Get all filter options for the category
                var categoryIds = new List<int> { categoryId };
                var category = await _context.Categories.FindAsync(categoryId);
                if (category?.ParentId.HasValue == true)
                {
                    categoryIds.Add(category.ParentId.Value);
                }

                var filterOptions = await _context.FilterOptions
                    .Where(f => categoryIds.Contains(f.CategoryId) && f.IsActive)
                    .Include(f => f.FilterOptionValues.Where(v => v.IsActive))
                    .ToListAsync();

                var filterCounts = new Dictionary<string, Dictionary<string, int>>();

                foreach (var filterOption in filterOptions)
                {
                    filterCounts[filterOption.Name] = new Dictionary<string, int>();

                    foreach (var filterValue in filterOption.FilterOptionValues)
                    {
                        // Apply all other filters except the current one
                        var testQuery = baseQuery;

                        if (appliedFilters.Any())
                        {
                            foreach (var appliedFilter in appliedFilters.Where(f => f.Key != filterOption.Name))
                            {
                                var filterName = appliedFilter.Key;
                                var filterValues = appliedFilter.Value;

                                if (filterValues?.Any() == true)
                                {
                                    var productIds = await _context.ProductFilterValues
                                        .Include(pfv => pfv.FilterOption)
                                        .Include(pfv => pfv.FilterOptionValue)
                                        .Where(pfv => pfv.FilterOption.Name == filterName &&
                                                     (pfv.FilterOptionValue != null && filterValues.Contains(pfv.FilterOptionValue.Value) ||
                                                      pfv.CustomValue != null && filterValues.Contains(pfv.CustomValue)))
                                        .Select(pfv => pfv.ProductId)
                                        .Distinct()
                                        .ToListAsync();

                                    testQuery = testQuery.Where(p => productIds.Contains(p.Id));
                                }
                            }
                        }

                        // Count products that match this specific filter value
                        var matchingProductIds = await _context.ProductFilterValues
                            .Include(pfv => pfv.FilterOption)
                            .Include(pfv => pfv.FilterOptionValue)
                            .Where(pfv => pfv.FilterOption.Name == filterOption.Name &&
                                         (pfv.FilterOptionValue != null && pfv.FilterOptionValue.Value == filterValue.Value ||
                                          pfv.CustomValue != null && pfv.CustomValue == filterValue.Value))
                            .Select(pfv => pfv.ProductId)
                            .Distinct()
                            .ToListAsync();

                        var count = await testQuery.Where(p => matchingProductIds.Contains(p.Id)).CountAsync();
                        filterCounts[filterOption.Name][filterValue.Value] = count;
                    }
                }

                // Add stock status counts
                filterCounts["StockStatus"] = new Dictionary<string, int>();
                var allProducts = await baseQuery.ToListAsync();

                // Apply current filters to get filtered products
                var filteredProducts = allProducts;
                if (appliedFilters.Any())
                {
                    foreach (var appliedFilter in appliedFilters.Where(f => f.Key != "StockStatus"))
                    {
                        var filterName = appliedFilter.Key;
                        var filterValues = appliedFilter.Value;

                        if (filterValues?.Any() == true)
                        {
                            var matchingProductIds = await _context.ProductFilterValues
                                .Include(pfv => pfv.FilterOption)
                                .Include(pfv => pfv.FilterOptionValue)
                                .Where(pfv => pfv.FilterOption.Name == filterName &&
                                             (pfv.FilterOptionValue != null && filterValues.Contains(pfv.FilterOptionValue.Value) ||
                                              pfv.CustomValue != null && filterValues.Contains(pfv.CustomValue)))
                                .Select(pfv => pfv.ProductId)
                                .Distinct()
                                .ToListAsync();

                            filteredProducts = filteredProducts.Where(p => matchingProductIds.Contains(p.Id)).ToList();
                        }
                    }
                }

                filterCounts["StockStatus"]["in-stock"] = filteredProducts.Count(p => p.Stock > 0);
                filterCounts["StockStatus"]["out-of-stock"] = filteredProducts.Count(p => p.Stock <= 0);

                return Ok(new { success = true, filterCounts = filterCounts });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filter counts for category {CategoryId}", categoryId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        #region Category Setup Helper Methods

        private async Task SetupSnacksCategory()
        {
            // Snacks category already has products, just ensure filters exist
            await EnsureFilterExists(5, "Product", "Product Type", "checkbox", new[]
            {
                "Candy", "Coconut", "Corn", "Dough", "Nuts", "Plantain", "Sugar Cane"
            });

            await EnsureFilterExists(5, "Taste", "Taste", "checkbox", new[]
            {
                "Sweet", "Salty", "Spicy", "Sour"
            });

            await EnsureFilterExists(5, "Texture", "Texture", "checkbox", new[]
            {
                "Soft", "Crunchy", "Chewy", "Smooth"
            });
        }

        private async Task SetupBagsCategory()
        {
            // Find or create Bags category
            var bagsCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Bags");
            if (bagsCategory == null)
            {
                bagsCategory = new Category
                {
                    Name = "Bags",
                    Description = "Stylish bags for every occasion",
                    Slug = "bags",
                    SortOrder = 2,
                    IsActive = true
                };
                _context.Categories.Add(bagsCategory);
                await _context.SaveChangesAsync();
            }

            // Setup filters for Bags
            await EnsureFilterExists(bagsCategory.Id, "Size", "Size", "checkbox", new[]
            {
                "Small", "Medium", "Large", "Extra Large"
            });

            await EnsureFilterExists(bagsCategory.Id, "Color", "Color", "checkbox", new[]
            {
                "Black", "Brown", "Red", "Blue", "Green", "Pink", "White"
            });

            await EnsureFilterExists(bagsCategory.Id, "Style", "Style", "checkbox", new[]
            {
                "Handbag", "Backpack", "Tote", "Crossbody", "Clutch", "Shoulder Bag"
            });

            // Create sample products for Bags
            await CreateBagsProducts(bagsCategory.Id);
        }

        private async Task SetupDecorCategory()
        {
            // Find or create Decor category
            var decorCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Decor");
            if (decorCategory == null)
            {
                decorCategory = new Category
                {
                    Name = "Decor",
                    Description = "Beautiful home decor items",
                    Slug = "decor",
                    SortOrder = 3,
                    IsActive = true
                };
                _context.Categories.Add(decorCategory);
                await _context.SaveChangesAsync();
            }

            // Setup filters for Decor
            await EnsureFilterExists(decorCategory.Id, "Fabric", "Fabric", "checkbox", new[]
            {
                "Cotton", "Silk", "Linen", "Polyester", "Wool", "Bamboo"
            });

            await EnsureFilterExists(decorCategory.Id, "Highlights", "Highlights", "checkbox", new[]
            {
                "Handmade", "Eco-friendly", "Vintage", "Modern", "Traditional", "Artistic"
            });

            await EnsureFilterExists(decorCategory.Id, "Color", "Color", "checkbox", new[]
            {
                "White", "Black", "Red", "Blue", "Green", "Yellow", "Purple", "Orange"
            });

            // Create sample products for Decor
            await CreateDecorProducts(decorCategory.Id);
        }

        private async Task SetupFashionCategory()
        {
            // Find or create Fashion category
            var fashionCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Fashion");
            if (fashionCategory == null)
            {
                fashionCategory = new Category
                {
                    Name = "Fashion",
                    Description = "Trendy fashion items and accessories",
                    Slug = "fashion",
                    SortOrder = 4,
                    IsActive = true
                };
                _context.Categories.Add(fashionCategory);
                await _context.SaveChangesAsync();
            }

            // Setup filters for Fashion
            await EnsureFilterExists(fashionCategory.Id, "Fabric", "Fabric", "checkbox", new[]
            {
                "Cotton", "Denim", "Silk", "Polyester", "Wool", "Leather", "Lace"
            });

            await EnsureFilterExists(fashionCategory.Id, "Highlights", "Highlights", "checkbox", new[]
            {
                "Casual", "Formal", "Vintage", "Trendy", "Comfortable", "Designer"
            });

            await EnsureFilterExists(fashionCategory.Id, "Size", "Size", "checkbox", new[]
            {
                "XS", "S", "M", "L", "XL", "XXL"
            });

            // Create sample products for Fashion
            await CreateFashionProducts(fashionCategory.Id);
        }

        private async Task EnsureFilterExists(int categoryId, string name, string displayName, string filterType, string[] values)
        {
            // Check if filter already exists
            var existingFilter = await _context.FilterOptions
                .FirstOrDefaultAsync(f => f.CategoryId == categoryId && f.Name == name);

            int filterId;
            if (existingFilter == null)
            {
                // Create the filter
                var filter = new FilterOption
                {
                    Name = name,
                    DisplayName = displayName,
                    Description = $"Filter by {displayName.ToLower()}",
                    CategoryId = categoryId,
                    FilterType = filterType,
                    SortOrder = 1,
                    IsActive = true
                };
                _context.FilterOptions.Add(filter);
                await _context.SaveChangesAsync();
                filterId = filter.Id;
            }
            else
            {
                filterId = existingFilter.Id;
                // Clear existing values
                var existingValues = await _context.FilterOptionValues
                    .Where(v => v.FilterOptionId == filterId)
                    .ToListAsync();
                _context.FilterOptionValues.RemoveRange(existingValues);
            }

            // Add filter values
            for (int i = 0; i < values.Length; i++)
            {
                var filterValue = new FilterOptionValue
                {
                    FilterOptionId = filterId,
                    Value = values[i],
                    DisplayValue = values[i],
                    Description = $"{values[i]} items",
                    SortOrder = i + 1,
                    IsActive = true
                };
                _context.FilterOptionValues.Add(filterValue);
            }

            await _context.SaveChangesAsync();
        }

        private async Task CreateBagsProducts(int categoryId)
        {
            // Check if products already exist
            var existingCount = await _context.Products.CountAsync(p => p.CategoryId == categoryId);
            if (existingCount > 0) return;

            var bagProducts = new[]
            {
                new { Name = "Classic Black Handbag", Price = 89m, Size = "Medium", Color = "Black", Style = "Handbag" },
                new { Name = "Brown Leather Backpack", Price = 120m, Size = "Large", Color = "Brown", Style = "Backpack" },
                new { Name = "Red Canvas Tote", Price = 45m, Size = "Large", Color = "Red", Style = "Tote" },
                new { Name = "Blue Crossbody Bag", Price = 65m, Size = "Small", Color = "Blue", Style = "Crossbody" },
                new { Name = "Pink Evening Clutch", Price = 35m, Size = "Small", Color = "Pink", Style = "Clutch" },
                new { Name = "Green Shoulder Bag", Price = 75m, Size = "Medium", Color = "Green", Style = "Shoulder Bag" },
                new { Name = "White Designer Handbag", Price = 150m, Size = "Medium", Color = "White", Style = "Handbag" },
                new { Name = "Large Travel Backpack", Price = 95m, Size = "Extra Large", Color = "Black", Style = "Backpack" }
            };

            await CreateProductsWithAttributes(categoryId, bagProducts, "Bags");
        }

        private async Task CreateDecorProducts(int categoryId)
        {
            // Check if products already exist
            var existingCount = await _context.Products.CountAsync(p => p.CategoryId == categoryId);
            if (existingCount > 0) return;

            var decorProducts = new[]
            {
                new { Name = "Handmade Cotton Cushion", Price = 25m, Fabric = "Cotton", Highlights = "Handmade", Color = "White" },
                new { Name = "Silk Vintage Curtains", Price = 85m, Fabric = "Silk", Highlights = "Vintage", Color = "Red" },
                new { Name = "Eco-friendly Bamboo Mat", Price = 40m, Fabric = "Bamboo", Highlights = "Eco-friendly", Color = "Green" },
                new { Name = "Modern Polyester Rug", Price = 120m, Fabric = "Polyester", Highlights = "Modern", Color = "Blue" },
                new { Name = "Traditional Wool Blanket", Price = 95m, Fabric = "Wool", Highlights = "Traditional", Color = "Yellow" },
                new { Name = "Artistic Linen Wall Hanging", Price = 65m, Fabric = "Linen", Highlights = "Artistic", Color = "Purple" },
                new { Name = "Cotton Table Runner", Price = 30m, Fabric = "Cotton", Highlights = "Modern", Color = "Black" },
                new { Name = "Handmade Silk Pillow", Price = 55m, Fabric = "Silk", Highlights = "Handmade", Color = "Orange" }
            };

            await CreateProductsWithAttributes(categoryId, decorProducts, "Decor");
        }

        private async Task CreateFashionProducts(int categoryId)
        {
            // Check if products already exist
            var existingCount = await _context.Products.CountAsync(p => p.CategoryId == categoryId);
            if (existingCount > 0) return;

            var fashionProducts = new[]
            {
                new { Name = "Casual Cotton T-Shirt", Price = 25m, Fabric = "Cotton", Highlights = "Casual", Size = "M" },
                new { Name = "Formal Silk Blouse", Price = 85m, Fabric = "Silk", Highlights = "Formal", Size = "S" },
                new { Name = "Vintage Denim Jacket", Price = 95m, Fabric = "Denim", Highlights = "Vintage", Size = "L" },
                new { Name = "Trendy Polyester Dress", Price = 65m, Fabric = "Polyester", Highlights = "Trendy", Size = "M" },
                new { Name = "Comfortable Wool Sweater", Price = 75m, Fabric = "Wool", Highlights = "Comfortable", Size = "XL" },
                new { Name = "Designer Leather Jacket", Price = 200m, Fabric = "Leather", Highlights = "Designer", Size = "L" },
                new { Name = "Elegant Lace Top", Price = 45m, Fabric = "Lace", Highlights = "Formal", Size = "S" },
                new { Name = "Casual Cotton Jeans", Price = 55m, Fabric = "Cotton", Highlights = "Casual", Size = "M" }
            };

            await CreateProductsWithAttributes(categoryId, fashionProducts, "Fashion");
        }

        private async Task CreateProductsWithAttributes<T>(int categoryId, T[] products, string categoryName)
        {
            foreach (var product in products)
            {
                // Use reflection to get product properties
                var productType = typeof(T);
                var nameProperty = productType.GetProperty("Name");
                var priceProperty = productType.GetProperty("Price");

                if (nameProperty == null || priceProperty == null) continue;

                var name = nameProperty.GetValue(product)?.ToString() ?? "";
                var price = (decimal)(priceProperty.GetValue(product) ?? 0m);

                // Create product
                var newProduct = new Product
                {
                    Name = name,
                    Description = $"High-quality {name.ToLower()} from our {categoryName.ToLower()} collection",
                    Price = price,
                    CategoryId = categoryId,
                    Stock = 50,
                    IsActive = true,
                    IsFeatured = false,
                    Slug = name.ToLower().Replace(" ", "-"),
                    ImageUrl = $"/images/{categoryName.ToLower()}/{name.ToLower().Replace(" ", "-")}.jpg"
                };

                _context.Products.Add(newProduct);
                await _context.SaveChangesAsync();

                // Add attributes for filtering
                var attributes = new List<ProductAttribute>();
                var sortOrder = 1;

                foreach (var property in productType.GetProperties())
                {
                    if (property.Name != "Name" && property.Name != "Price")
                    {
                        var value = property.GetValue(product)?.ToString();
                        if (!string.IsNullOrEmpty(value))
                        {
                            attributes.Add(new ProductAttribute
                            {
                                ProductId = newProduct.Id,
                                Name = property.Name,
                                Value = value,
                                SortOrder = sortOrder++
                            });
                        }
                    }
                }

                if (attributes.Any())
                {
                    _context.ProductAttributes.AddRange(attributes);
                    await _context.SaveChangesAsync();
                }
            }
        }

        private async Task FixSnacksFiltering()
        {
            // Clear existing Flavor and Diet attributes for Snacks products
            var snacksProducts = await _context.Products.Where(p => p.CategoryId == 5).ToListAsync();
            var existingAttributes = await _context.ProductAttributes
                .Where(pa => snacksProducts.Select(p => p.Id).Contains(pa.ProductId) &&
                            (pa.Name == "Flavor" || pa.Name == "Diet"))
                .ToListAsync();

            _context.ProductAttributes.RemoveRange(existingAttributes);
            await _context.SaveChangesAsync();

            // Add Flavor and Diet attributes
            var newAttributes = new List<ProductAttribute>();
            foreach (var product in snacksProducts)
            {
                // Add Flavor attribute
                var flavorValue = product.Id % 3 == 0 ? "Peppered" :
                                 product.Id % 3 == 1 ? "Plain" : "Sugar";
                newAttributes.Add(new ProductAttribute
                {
                    ProductId = product.Id,
                    Name = "Flavor",
                    Value = flavorValue,
                    SortOrder = 5,
                    CreatedAt = DateTime.UtcNow
                });

                // Add Diet attribute
                var dietValue = product.Id % 3 == 0 ? "Organic" :
                               product.Id % 3 == 1 ? "Vegan" : "Vegetarian";
                newAttributes.Add(new ProductAttribute
                {
                    ProductId = product.Id,
                    Name = "Diet",
                    Value = dietValue,
                    SortOrder = 6,
                    CreatedAt = DateTime.UtcNow
                });
            }

            _context.ProductAttributes.AddRange(newAttributes);
            await _context.SaveChangesAsync();
        }

        private async Task FixDecorFiltering()
        {
            // Clear existing Size and Fabric attributes for Decor products
            var decorProducts = await _context.Products.Where(p => p.CategoryId == 7).ToListAsync();
            var existingAttributes = await _context.ProductAttributes
                .Where(pa => decorProducts.Select(p => p.Id).Contains(pa.ProductId) &&
                            (pa.Name == "Size" || pa.Name == "Fabric"))
                .ToListAsync();

            _context.ProductAttributes.RemoveRange(existingAttributes);
            await _context.SaveChangesAsync();

            // Size options for Decor
            var sizeOptions = new[] { "11x7.5x4.5", "12.5x9x4.5", "13x9x4", "14x10x4", "18x18",
                                     "20x20", "22x22", "9.5x8.5x5", "Full", "Large", "Mini",
                                     "One-Size Fits Most", "Queen", "Small", "King" };

            var newAttributes = new List<ProductAttribute>();
            foreach (var product in decorProducts)
            {
                // Add Size attribute
                var sizeValue = sizeOptions[product.Id % sizeOptions.Length];
                newAttributes.Add(new ProductAttribute
                {
                    ProductId = product.Id,
                    Name = "Size",
                    Value = sizeValue,
                    SortOrder = 2,
                    CreatedAt = DateTime.UtcNow
                });

                // Add Fabric attribute
                var fabricValue = product.Id % 2 == 0 ? "Adire" : "Ankara";
                newAttributes.Add(new ProductAttribute
                {
                    ProductId = product.Id,
                    Name = "Fabric",
                    Value = fabricValue,
                    SortOrder = 4,
                    CreatedAt = DateTime.UtcNow
                });
            }

            _context.ProductAttributes.AddRange(newAttributes);
            await _context.SaveChangesAsync();
        }

        private async Task FixFashionFiltering()
        {
            // Clear existing Size and Fabric attributes for Fashion products
            var fashionProducts = await _context.Products.Where(p => p.CategoryId == 8).ToListAsync();
            var existingAttributes = await _context.ProductAttributes
                .Where(pa => fashionProducts.Select(p => p.Id).Contains(pa.ProductId) &&
                            (pa.Name == "Size" || pa.Name == "Fabric"))
                .ToListAsync();

            _context.ProductAttributes.RemoveRange(existingAttributes);
            await _context.SaveChangesAsync();

            // Size and Fabric options for Fashion
            var sizeOptions = new[] { "L", "M", "One-Size Fits Most", "S", "XL" };
            var fabricOptions = new[] { "Adire", "Ankara", "Batik Adire", "Cotton" };

            var newAttributes = new List<ProductAttribute>();
            foreach (var product in fashionProducts)
            {
                // Add Size attribute
                var sizeValue = sizeOptions[product.Id % sizeOptions.Length];
                newAttributes.Add(new ProductAttribute
                {
                    ProductId = product.Id,
                    Name = "Size",
                    Value = sizeValue,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                });

                // Add Fabric attribute
                var fabricValue = fabricOptions[product.Id % fabricOptions.Length];
                newAttributes.Add(new ProductAttribute
                {
                    ProductId = product.Id,
                    Name = "Fabric",
                    Value = fabricValue,
                    SortOrder = 3,
                    CreatedAt = DateTime.UtcNow
                });
            }

            _context.ProductAttributes.AddRange(newAttributes);
            await _context.SaveChangesAsync();
        }

        private async Task AddSampleProductsIfNeeded()
        {
            // Add sample Decor products if there's only 1
            var decorCount = await _context.Products.CountAsync(p => p.CategoryId == 7);
            if (decorCount < 3)
            {
                var decorProducts = new[]
                {
                    new Product
                    {
                        Name = "Handmade Adire Pillow Cover",
                        Description = "Beautiful handmade Adire pillow cover",
                        Price = 25.00m,
                        CategoryId = 7,
                        Stock = 50,
                        IsActive = true,
                        IsFeatured = false,
                        Slug = "handmade-adire-pillow-cover",
                        ImageUrl = "/images/decor/handmade-adire-pillow-cover.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Product
                    {
                        Name = "Ankara Table Runner",
                        Description = "Colorful Ankara table runner for dining",
                        Price = 35.00m,
                        CategoryId = 7,
                        Stock = 30,
                        IsActive = true,
                        IsFeatured = true,
                        Slug = "ankara-table-runner",
                        ImageUrl = "/images/decor/ankara-table-runner.jpg",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                _context.Products.AddRange(decorProducts);
                await _context.SaveChangesAsync();
            }

            // Add sample Fashion products if there's only 1
            var fashionCount = await _context.Products.CountAsync(p => p.CategoryId == 8);
            if (fashionCount < 3)
            {
                var fashionProducts = new[]
                {
                    new Product
                    {
                        Name = "Cotton T-Shirt Medium",
                        Description = "Comfortable cotton t-shirt in medium size",
                        Price = 30.00m,
                        CategoryId = 8,
                        Stock = 60,
                        IsActive = true,
                        IsFeatured = false,
                        Slug = "cotton-t-shirt-medium",
                        ImageUrl = "/images/fashion/cotton-t-shirt-medium.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Product
                    {
                        Name = "Ankara Dress Large",
                        Description = "Beautiful Ankara dress in large size",
                        Price = 65.00m,
                        CategoryId = 8,
                        Stock = 25,
                        IsActive = true,
                        IsFeatured = true,
                        Slug = "ankara-dress-large",
                        ImageUrl = "/images/fashion/ankara-dress-large.jpg",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                _context.Products.AddRange(fashionProducts);
                await _context.SaveChangesAsync();
            }
        }

        #endregion

        /// <summary>
        /// Get dynamic configurations for a product (merges category configurations with product overrides)
        /// </summary>
        private async Task<List<ProductConfigurationItemDto>> GetProductDynamicConfigurations(int productId)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.ConfigurationOverrides)
                        .ThenInclude(pco => pco.ConfigurationType)
                            .ThenInclude(ct => ct.Options)
                    .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);

                if (product == null)
                {
                    return new List<ProductConfigurationItemDto>();
                }

                var configurations = new List<ProductConfigurationItemDto>();

                // Get category configurations
                var categoryConfigurations = await _context.CategoryConfigurationTemplates
                    .Include(cct => cct.ConfigurationType)
                        .ThenInclude(ct => ct.Options)
                    .Where(cct => cct.CategoryId == product.CategoryId && cct.IsActive)
                    .OrderBy(cct => cct.SortOrder)
                    .ToListAsync();

                // Get product overrides
                var productOverrides = product.ConfigurationOverrides
                    .Where(pco => pco.IsActive)
                    .ToList();

                // Create a set of configuration type IDs that have product overrides
                var overriddenConfigTypes = productOverrides.Select(po => po.ConfigurationTypeId).ToHashSet();

                // Add category configurations (only if not overridden by product)
                foreach (var categoryConfig in categoryConfigurations)
                {
                    if (!overriddenConfigTypes.Contains(categoryConfig.ConfigurationTypeId))
                    {
                        configurations.Add(new ProductConfigurationItemDto
                        {
                            ConfigurationTypeId = categoryConfig.ConfigurationTypeId,
                            Name = categoryConfig.ConfigurationType.Name,
                            Type = categoryConfig.ConfigurationType.Type,
                            Source = "category",
                            OverrideType = "inherit",
                            IsRequired = categoryConfig.IsRequired,
                            ShowPriceImpact = categoryConfig.ConfigurationType.ShowPriceImpact,
                            SortOrder = categoryConfig.SortOrder,
                            IsActive = true,
                            Options = categoryConfig.ConfigurationType.Options.Select(o => new ConfigurationOptionDto
                            {
                                Id = o.Id,
                                ConfigurationTypeId = o.ConfigurationTypeId,
                                Name = o.Name,
                                Value = o.Value,
                                Sku = _csvSkuService.GetSku(product.Id, categoryConfig.ConfigurationType.Name, o.Name),
                                PriceModifier = o.PriceModifier,
                                PriceType = o.PriceType,
                                IsDefault = o.IsDefault,
                                SortOrder = o.SortOrder,
                                IsActive = o.IsActive,
                                CreatedAt = o.CreatedAt,
                                UpdatedAt = o.UpdatedAt
                            }).ToList()
                        });
                    }
                }

                // Add product overrides
                foreach (var productOverride in productOverrides)
                {
                    configurations.Add(new ProductConfigurationItemDto
                    {
                        ConfigurationTypeId = productOverride.ConfigurationTypeId,
                        Name = productOverride.ConfigurationType.Name,
                        Type = productOverride.ConfigurationType.Type,
                        Source = "override",
                        OverrideType = productOverride.OverrideType,
                        IsRequired = false, // Product overrides are typically optional
                        ShowPriceImpact = productOverride.ConfigurationType.ShowPriceImpact,
                        SortOrder = productOverride.ConfigurationType.SortOrder,
                        IsActive = true,
                        Options = (productOverride.OverrideType == "custom" && !string.IsNullOrEmpty(productOverride.CustomOptions))
                            ? JsonSerializer.Deserialize<List<ConfigurationOptionDto>>(productOverride.CustomOptions, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<ConfigurationOptionDto>()
                            : productOverride.ConfigurationType.Options.Select(o => new ConfigurationOptionDto
                        {
                            Id = o.Id,
                            ConfigurationTypeId = o.ConfigurationTypeId,
                            Name = o.Name,
                            Value = o.Value,
                            Sku = _csvSkuService.GetSku(product.Id, productOverride.ConfigurationType.Name, o.Name),
                            PriceModifier = o.PriceModifier,
                            PriceType = o.PriceType,
                            IsDefault = o.IsDefault,
                            SortOrder = o.SortOrder,
                            IsActive = o.IsActive,
                            CreatedAt = o.CreatedAt,
                            UpdatedAt = o.UpdatedAt
                        }).ToList(),
                        CustomOptions = productOverride.CustomOptions
                    });
                }

                return configurations.OrderBy(c => c.SortOrder).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dynamic configurations for product {ProductId}", productId);
                return new List<ProductConfigurationItemDto>();
            }
        }

        /// <summary>
        /// Get reviews for a specific product
        /// </summary>
        [HttpGet("{productId:int}/reviews")]
        public async Task<ActionResult<ProductReviewsResponseDto>> GetProductReviews(
            int productId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                // Check if product exists
                var productExists = await _context.Products
                    .AnyAsync(p => p.Id == productId && p.IsActive);

                if (!productExists)
                {
                    return NotFound(new { success = false, message = "Product not found" });
                }

                // Get approved reviews with pagination
                var query = _context.ProductReviews
                    .Where(r => r.ProductId == productId && r.IsApproved)
                    .OrderByDescending(r => r.CreatedAt);

                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var reviews = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new ProductReviewDto
                    {
                        Id = r.Id,
                        ProductId = r.ProductId,
                        UserId = r.UserId,
                        ReviewerName = r.ReviewerName,
                        ReviewerEmail = r.ReviewerEmail,
                        Rating = r.Rating,
                        Title = r.Title,
                        ReviewText = r.ReviewText,
                        CreatedAt = r.CreatedAt,
                        IsApproved = r.IsApproved,
                        IsVerifiedPurchase = r.IsVerifiedPurchase
                    })
                    .ToListAsync();

                // Calculate review statistics
                var allReviews = await _context.ProductReviews
                    .Where(r => r.ProductId == productId && r.IsApproved)
                    .ToListAsync();

                var stats = new ReviewStatsDto
                {
                    TotalReviews = allReviews.Count,
                    AverageRating = allReviews.Count > 0 ? allReviews.Average(r => r.Rating) : 0,
                    RatingDistribution = allReviews
                        .GroupBy(r => r.Rating)
                        .ToDictionary(g => g.Key, g => g.Count())
                };

                // Ensure all rating levels (1-5) are represented
                for (int i = 1; i <= 5; i++)
                {
                    if (!stats.RatingDistribution.ContainsKey(i))
                    {
                        stats.RatingDistribution[i] = 0;
                    }
                }

                var response = new ProductReviewsResponseDto
                {
                    Reviews = reviews,
                    Stats = stats,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                    TotalCount = totalCount,
                    HasNextPage = page < totalPages,
                    HasPreviousPage = page > 1
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reviews for product {ProductId}", productId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Submit a new review for a product
        /// </summary>
        [HttpPost("{productId:int}/reviews")]
        public async Task<ActionResult<ProductReviewDto>> CreateProductReview(
            int productId,
            [FromBody] CreateReviewDto createReviewDto)
        {
            try
            {
                // Check if product exists
                var productExists = await _context.Products
                    .AnyAsync(p => p.Id == productId && p.IsActive);

                if (!productExists)
                {
                    return NotFound(new { success = false, message = "Product not found" });
                }

                // Get current user ID if authenticated
                int? userId = null;
                if (User.Identity?.IsAuthenticated == true)
                {
                    var userIdClaim = User.FindFirst("UserId")?.Value;
                    if (int.TryParse(userIdClaim, out var parsedUserId))
                    {
                        userId = parsedUserId;
                    }
                }

                // Check for duplicate reviews from the same user/email
                var existingReview = await _context.ProductReviews
                    .Where(r => r.ProductId == productId)
                    .Where(r => (userId.HasValue && r.UserId == userId) ||
                               (!userId.HasValue && r.ReviewerEmail == createReviewDto.ReviewerEmail))
                    .FirstOrDefaultAsync();

                if (existingReview != null)
                {
                    return BadRequest(new { success = false, message = "You have already reviewed this product" });
                }

                // Check if user has purchased this product (for verified purchase flag)
                bool isVerifiedPurchase = false;
                if (userId.HasValue)
                {
                    isVerifiedPurchase = await _context.OrderItems
                        .Include(oi => oi.Order)
                        .AnyAsync(oi => oi.ProductId == productId &&
                                       oi.Order.UserId == userId &&
                                       oi.Order.Status == "Completed");
                }

                // Create new review
                var review = new ProductReview
                {
                    ProductId = productId,
                    UserId = userId,
                    ReviewerName = createReviewDto.ReviewerName,
                    ReviewerEmail = createReviewDto.ReviewerEmail,
                    Rating = createReviewDto.Rating,
                    Title = createReviewDto.Title,
                    ReviewText = createReviewDto.ReviewText,
                    IsApproved = true, // Auto-approve for now, can be changed to false for moderation
                    IsVerifiedPurchase = isVerifiedPurchase,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ProductReviews.Add(review);
                await _context.SaveChangesAsync();

                var reviewDto = new ProductReviewDto
                {
                    Id = review.Id,
                    ProductId = review.ProductId,
                    UserId = review.UserId,
                    ReviewerName = review.ReviewerName,
                    ReviewerEmail = review.ReviewerEmail,
                    Rating = review.Rating,
                    Title = review.Title,
                    ReviewText = review.ReviewText,
                    CreatedAt = review.CreatedAt,
                    IsApproved = review.IsApproved,
                    IsVerifiedPurchase = review.IsVerifiedPurchase
                };

                return CreatedAtAction(nameof(GetProductReviews),
                    new { productId = productId },
                    reviewDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review for product {ProductId}", productId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

    }
}
