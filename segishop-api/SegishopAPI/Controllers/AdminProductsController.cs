using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;
using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminProductsController> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly SegishopAPI.Services.IImageProcessingService _imageProcessingService;
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private readonly string[] _allowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };

        public AdminProductsController(SegishopDbContext context, ILogger<AdminProductsController> logger, IWebHostEnvironment environment, IConfiguration configuration, SegishopAPI.Services.IImageProcessingService imageProcessingService)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
            _configuration = configuration;
            _imageProcessingService = imageProcessingService;
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

            if (url.StartsWith("/")) return origin + url;
            if (url.StartsWith("uploads/")) return origin + "/" + url;
            if (url.StartsWith("wp-content/")) return origin + "/" + url;
            return url;
        }

        /// <summary>
        /// Get product statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<AdminProductStatsDto>> GetProductStats()
        {
            try
            {
                var totalProducts = await _context.Products.CountAsync();
                var activeProducts = await _context.Products.CountAsync(p => p.IsActive);
                var inactiveProducts = totalProducts - activeProducts;
                var lowStockProducts = await _context.Products.CountAsync(p => p.Stock > 0 && p.Stock < 10);
                var outOfStockProducts = await _context.Products.CountAsync(p => p.Stock == 0);
                var inStockProducts = await _context.Products.CountAsync(p => p.Stock >= 10);
                var featuredProducts = await _context.Products.CountAsync(p => p.IsFeatured);

                var totalInventoryValue = await _context.Products
                    .Where(p => p.IsActive)
                    .SumAsync(p => p.Price * p.Stock);

                var stats = new AdminProductStatsDto
                {
                    TotalProducts = totalProducts,
                    ActiveProducts = activeProducts,
                    InactiveProducts = inactiveProducts,
                    LowStockProducts = lowStockProducts,
                    OutOfStockProducts = outOfStockProducts,
                    InStockProducts = inStockProducts,
                    TotalInventoryValue = totalInventoryValue,
                    FeaturedProducts = featuredProducts
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product statistics");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get all products for admin with pagination and filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<AdminProductsResponseDto>> GetProducts(
            [FromQuery] string? searchTerm = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? status = null,
            [FromQuery] bool? isFeatured = null,
            [FromQuery] string? sortBy = "name",
            [FromQuery] string? sortOrder = "asc",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.ShippingClass)
                    .Include(p => p.Images)
                    .Include(p => p.ProductAttributes)
                    .Include(p => p.ProductFilterValues)
                        .ThenInclude(pf => pf.FilterOption)
                    .Include(p => p.ProductFilterValues)
                        .ThenInclude(pf => pf.FilterOptionValue)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(p => p.Name.Contains(searchTerm) ||
                                           p.Description.Contains(searchTerm) ||
                                           (p.SKU != null && p.SKU.Contains(searchTerm)));
                }

                if (categoryId.HasValue)
                {
                    query = query.Where(p => p.CategoryId == categoryId.Value);
                }

                if (!string.IsNullOrEmpty(status))
                {
                    if (status.ToLower() == "active")
                        query = query.Where(p => p.IsActive);
                    else if (status.ToLower() == "inactive")
                        query = query.Where(p => !p.IsActive);
                }

                if (isFeatured.HasValue)
                {
                    query = query.Where(p => p.IsFeatured == isFeatured.Value);
                }

                // Apply sorting
                query = sortBy?.ToLower() switch
                {
                    "name" => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                    "price" => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
                    "stock" => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock),
                    "created" => sortOrder?.ToLower() == "desc" ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
                    _ => query.OrderBy(p => p.Name)
                };

                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var products = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new AdminProductDto
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
                        IsActive = p.IsActive,
                        IsFeatured = p.IsFeatured,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        MetaTitle = p.MetaTitle,
                        MetaDescription = p.MetaDescription,
                        Slug = p.Slug,
                        ShippingClassId = p.ShippingClassId,
                        ShippingClassName = p.ShippingClass != null ? p.ShippingClass.Name : null,
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
                        }).ToList(),
                        FilterValues = p.ProductFilterValues.Select(pf => new ProductFilterValueDto
                        {
                            Id = pf.Id,
                            FilterOptionId = pf.FilterOptionId,
                            FilterName = pf.FilterOption.Name,
                            FilterDisplayName = pf.FilterOption.DisplayName,
                            FilterType = pf.FilterOption.FilterType,
                            FilterOptionValueId = pf.FilterOptionValueId,
                            Value = pf.FilterOptionValue != null ? pf.FilterOptionValue.Value : null,
                            DisplayValue = pf.FilterOptionValue != null ? pf.FilterOptionValue.DisplayValue : null,
                            CustomValue = pf.CustomValue,
                            NumericValue = pf.NumericValue
                        }).ToList()
                    })
                    .ToListAsync();

                products.ForEach(p =>
                {
                    p.ImageUrl = NormalizeImageUrl(p.ImageUrl);
                    if (p.Images != null)
                    {
                        foreach (var img in p.Images)
                        {
                            img.ImageUrl = NormalizeImageUrl(img.ImageUrl);
                        }
                    }
                });

                return Ok(new AdminProductsResponseDto
                {
                    Success = true,
                    Products = products,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = totalPages,
                    HasNextPage = page < totalPages,
                    HasPreviousPage = page > 1
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin products");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get product by ID for admin
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminProductResponseDto>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.ShippingClass)
                    .Include(p => p.Images)
                    .Include(p => p.ProductAttributes)
                    .Include(p => p.ProductFilterValues)
                        .ThenInclude(pf => pf.FilterOption)
                    .Include(p => p.ProductFilterValues)
                        .ThenInclude(pf => pf.FilterOptionValue)
                    .Where(p => p.Id == id)
                    .Select(p => new AdminProductDto
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
                        IsActive = p.IsActive,
                        IsFeatured = p.IsFeatured,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        MetaTitle = p.MetaTitle,
                        MetaDescription = p.MetaDescription,
                        Slug = p.Slug,
                        ShippingClassId = p.ShippingClassId,
                        ShippingClassName = p.ShippingClass != null ? p.ShippingClass.Name : null,
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
                        }).ToList(),
                        FilterValues = p.ProductFilterValues.Select(pf => new ProductFilterValueDto
                        {
                            Id = pf.Id,
                            FilterOptionId = pf.FilterOptionId,
                            FilterName = pf.FilterOption.Name,
                            FilterDisplayName = pf.FilterOption.DisplayName,
                            FilterType = pf.FilterOption.FilterType,
                            FilterOptionValueId = pf.FilterOptionValueId,
                            Value = pf.FilterOptionValue != null ? pf.FilterOptionValue.Value : null,
                            DisplayValue = pf.FilterOptionValue != null ? pf.FilterOptionValue.DisplayValue : null,
                            CustomValue = pf.CustomValue,
                            NumericValue = pf.NumericValue
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Product not found"
                    });
                }

                return Ok(new AdminProductResponseDto
                {
                    Success = true,
                    Product = product
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product {ProductId}", id);
                return StatusCode(500, new AdminProductResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create new product
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AdminProductResponseDto>> CreateProduct([FromBody] CreateAdminProductDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Invalid product data"
                    });
                }

                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId && c.IsActive);
                if (!categoryExists)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Invalid category"
                    });
                }

                // Generate slug if not provided
                var slug = !string.IsNullOrEmpty(request.Slug) ? request.Slug : GenerateSlug(request.Name);

                // Ensure slug uniqueness
                var originalSlug = slug;
                var counter = 1;
                while (await _context.Products.AnyAsync(p => p.Slug == slug))
                {
                    slug = $"{originalSlug}-{counter}";
                    counter++;
                }

                // Always generate unique SKU automatically
                var productSku = await GenerateUniqueSKU(request.Name);

                var product = new Product
                {
                    Name = request.Name,
                    Description = request.Description,
                    LongDescription = request.LongDescription,
                    Price = request.Price,
                    SalePrice = request.SalePrice,
                    SKU = productSku,
                    Stock = request.Stock,
                    ImageUrl = request.ImageUrl,
                    CategoryId = request.CategoryId,
                    IsActive = request.IsActive,
                    IsFeatured = request.IsFeatured,
                    MetaTitle = request.MetaTitle,
                    MetaDescription = request.MetaDescription,
                    Slug = slug,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Add images if provided
                if (request.ImageGallery != null && request.ImageGallery.Count > 0)
                {
                    var images = request.ImageGallery.Select((url, index) => new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = url,
                        SortOrder = index + 1,
                        IsPrimary = index == 0
                    }).ToList();

                    _context.ProductImages.AddRange(images);
                }

                // Add attributes if provided
                if (request.Attributes != null && request.Attributes.Count > 0)
                {
                    var attributes = request.Attributes.Select(attr => new ProductAttribute
                    {
                        ProductId = product.Id,
                        Name = attr.Name,
                        Value = attr.Value,
                        SortOrder = attr.SortOrder
                    }).ToList();

                    _context.ProductAttributes.AddRange(attributes);
                }

                // Add filter values if provided
                if (request.FilterValues != null && request.FilterValues.Count > 0)
                {
                    var filterValues = request.FilterValues.Select(fv => new ProductFilterValue
                    {
                        ProductId = product.Id,
                        FilterOptionId = fv.FilterOptionId,
                        FilterOptionValueId = fv.FilterOptionValueId,
                        CustomValue = fv.CustomValue,
                        NumericValue = fv.NumericValue
                    }).ToList();

                    _context.ProductFilterValues.AddRange(filterValues);
                }

                await _context.SaveChangesAsync();

                // Return the created product
                var getProductResult = await GetProduct(product.Id);
                if (getProductResult.Result is OkObjectResult okResult &&
                    okResult.Value is AdminProductResponseDto response)
                {
                    return Ok(response);
                }

                return Ok(new AdminProductResponseDto { Success = true, Product = null });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new AdminProductResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Update existing product
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<AdminProductResponseDto>> UpdateProduct(int id, [FromBody] UpdateAdminProductDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Invalid product data"
                    });
                }

                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Product not found"
                    });
                }

                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId && c.IsActive);
                if (!categoryExists)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Invalid category"
                    });
                }

                // Generate new SKU if product name has changed
                var newSku = product.SKU;
                if (product.Name != request.Name)
                {
                    newSku = await GenerateUniqueSKU(request.Name);
                }

                // Update product properties
                product.Name = request.Name;
                product.Description = request.Description;
                product.LongDescription = request.LongDescription;
                product.Price = request.Price;
                product.SalePrice = request.SalePrice;
                product.SKU = newSku;
                product.Stock = request.Stock;
                product.ImageUrl = request.ImageUrl;
                product.CategoryId = request.CategoryId;
                product.IsActive = request.IsActive;
                product.IsFeatured = request.IsFeatured;
                product.MetaTitle = request.MetaTitle;
                product.MetaDescription = request.MetaDescription;
                product.ShippingClassId = request.ShippingClassId;
                product.UpdatedAt = DateTime.UtcNow;

                // Update slug if name changed
                if (!string.IsNullOrEmpty(request.Slug) && request.Slug != product.Slug)
                {
                    var slug = request.Slug;
                    var originalSlug = slug;
                    var counter = 1;
                    while (await _context.Products.AnyAsync(p => p.Slug == slug && p.Id != id))
                    {
                        slug = $"{originalSlug}-{counter}";
                        counter++;
                    }
                    product.Slug = slug;
                }

                // Update images
                if (request.ImageGallery != null)
                {
                    // Remove existing images
                    var existingImages = await _context.ProductImages.Where(i => i.ProductId == id).ToListAsync();
                    _context.ProductImages.RemoveRange(existingImages);

                    // Add new images
                    if (request.ImageGallery.Count > 0)
                    {
                        var images = request.ImageGallery.Select((url, index) => new ProductImage
                        {
                            ProductId = id,
                            ImageUrl = url,
                            SortOrder = index + 1,
                            IsPrimary = index == 0
                        }).ToList();

                        _context.ProductImages.AddRange(images);
                    }
                }

                // Update attributes
                if (request.Attributes != null)
                {
                    // Remove existing attributes
                    var existingAttributes = await _context.ProductAttributes.Where(a => a.ProductId == id).ToListAsync();
                    _context.ProductAttributes.RemoveRange(existingAttributes);

                    // Add new attributes
                    if (request.Attributes.Count > 0)
                    {
                        var attributes = request.Attributes.Select(attr => new ProductAttribute
                        {
                            ProductId = id,
                            Name = attr.Name,
                            Value = attr.Value,
                            SortOrder = attr.SortOrder
                        }).ToList();

                        _context.ProductAttributes.AddRange(attributes);
                    }
                }

                // Update filter values
                if (request.FilterValues != null)
                {
                    // Remove existing filter values
                    var existingFilterValues = await _context.ProductFilterValues.Where(fv => fv.ProductId == id).ToListAsync();
                    _context.ProductFilterValues.RemoveRange(existingFilterValues);

                    // Add new filter values
                    if (request.FilterValues.Count > 0)
                    {
                        var filterValues = request.FilterValues.Select(fv => new ProductFilterValue
                        {
                            ProductId = id,
                            FilterOptionId = fv.FilterOptionId,
                            FilterOptionValueId = fv.FilterOptionValueId,
                            CustomValue = fv.CustomValue,
                            NumericValue = fv.NumericValue
                        }).ToList();

                        _context.ProductFilterValues.AddRange(filterValues);
                    }
                }

                await _context.SaveChangesAsync();

                // Return the updated product
                var getProductResult = await GetProduct(id);
                if (getProductResult.Result is OkObjectResult okResult &&
                    okResult.Value is AdminProductResponseDto response)
                {
                    return Ok(response);
                }

                return Ok(new AdminProductResponseDto { Success = true, Product = null });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {ProductId}", id);
                return StatusCode(500, new AdminProductResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Delete product
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<AdminProductResponseDto>> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Product not found"
                    });
                }

                // Check if product has orders (prevent deletion if it has orders)
                var hasOrders = await _context.OrderItems.AnyAsync(oi => oi.ProductId == id);
                if (hasOrders)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Cannot delete product with existing orders. Consider deactivating instead."
                    });
                }

                // Remove related data
                var images = await _context.ProductImages.Where(i => i.ProductId == id).ToListAsync();
                var attributes = await _context.ProductAttributes.Where(a => a.ProductId == id).ToListAsync();
                var filterValues = await _context.ProductFilterValues.Where(fv => fv.ProductId == id).ToListAsync();
                var cartItems = await _context.CartItems.Where(ci => ci.ProductId == id).ToListAsync();

                // Delete image files from storage
                foreach (var image in images)
                {
                    if (!string.IsNullOrEmpty(image.ImageUrl) && image.ImageUrl.Contains("/uploads/images/"))
                    {
                        DeleteImageFile(image.ImageUrl);
                    }
                }

                // Delete main product image if it exists
                if (!string.IsNullOrEmpty(product.ImageUrl) && product.ImageUrl.Contains("/uploads/images/"))
                {
                    DeleteImageFile(product.ImageUrl);
                }

                _context.ProductImages.RemoveRange(images);
                _context.ProductAttributes.RemoveRange(attributes);
                _context.ProductFilterValues.RemoveRange(filterValues);
                _context.CartItems.RemoveRange(cartItems);
                _context.Products.Remove(product);

                await _context.SaveChangesAsync();

                return Ok(new AdminProductResponseDto
                {
                    Success = true,
                    Message = "Product deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {ProductId}", id);
                return StatusCode(500, new AdminProductResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Bulk update product status
        /// </summary>
        [HttpPatch("bulk-status")]
        public async Task<ActionResult> BulkUpdateStatus([FromBody] BulkUpdateStatusDto request)
        {
            try
            {
                if (request.ProductIds == null || request.ProductIds.Count == 0)
                {
                    return BadRequest(new { success = false, message = "No products specified" });
                }

                var products = await _context.Products
                    .Where(p => request.ProductIds.Contains(p.Id))
                    .ToListAsync();

                if (products.Count == 0)
                {
                    return NotFound(new { success = false, message = "No products found" });
                }

                foreach (var product in products)
                {
                    product.IsActive = request.IsActive;
                    product.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new {
                    success = true,
                    message = $"Updated {products.Count} products",
                    updatedCount = products.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk updating product status");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Bulk delete products
        /// </summary>
        [HttpDelete("bulk")]
        public async Task<ActionResult> BulkDeleteProducts([FromBody] BulkDeleteDto request)
        {
            try
            {
                if (request.ProductIds == null || request.ProductIds.Count == 0)
                {
                    return BadRequest(new { success = false, message = "No products specified" });
                }

                // Check if any products have orders
                var productsWithOrders = await _context.OrderItems
                    .Where(oi => request.ProductIds.Contains(oi.ProductId))
                    .Select(oi => oi.ProductId)
                    .Distinct()
                    .ToListAsync();

                if (productsWithOrders.Count > 0)
                {
                    return BadRequest(new {
                        success = false,
                        message = "Some products have existing orders and cannot be deleted",
                        productsWithOrders = productsWithOrders
                    });
                }

                var products = await _context.Products
                    .Where(p => request.ProductIds.Contains(p.Id))
                    .ToListAsync();

                if (products.Count == 0)
                {
                    return NotFound(new { success = false, message = "No products found" });
                }

                // Remove related data
                var images = await _context.ProductImages.Where(i => request.ProductIds.Contains(i.ProductId)).ToListAsync();
                var attributes = await _context.ProductAttributes.Where(a => request.ProductIds.Contains(a.ProductId)).ToListAsync();
                var filterValues = await _context.ProductFilterValues.Where(fv => request.ProductIds.Contains(fv.ProductId)).ToListAsync();
                var cartItems = await _context.CartItems.Where(ci => request.ProductIds.Contains(ci.ProductId)).ToListAsync();

                // Delete image files from storage
                foreach (var image in images)
                {
                    if (!string.IsNullOrEmpty(image.ImageUrl) && image.ImageUrl.Contains("/uploads/images/"))
                    {
                        DeleteImageFile(image.ImageUrl);
                    }
                }

                // Delete main product images if they exist
                foreach (var product in products)
                {
                    if (!string.IsNullOrEmpty(product.ImageUrl) && product.ImageUrl.Contains("/uploads/images/"))
                    {
                        DeleteImageFile(product.ImageUrl);
                    }
                }

                _context.ProductImages.RemoveRange(images);
                _context.ProductAttributes.RemoveRange(attributes);
                _context.ProductFilterValues.RemoveRange(filterValues);
                _context.CartItems.RemoveRange(cartItems);
                _context.Products.RemoveRange(products);

                await _context.SaveChangesAsync();

                return Ok(new {
                    success = true,
                    message = $"Deleted {products.Count} products",
                    deletedCount = products.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk deleting products");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Generate a unique SKU based on product name
        /// </summary>
        private async Task<string> GenerateUniqueSKU(string productName)
        {
            // Create base SKU from product name
            var baseSku = productName
                .ToUpperInvariant()
                .Replace(" ", "")
                .Replace("-", "")
                .Substring(0, Math.Min(productName.Length, 8)); // Take first 8 characters

            // Add timestamp to make it unique
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var sku = $"{baseSku}-{timestamp}";

            // Ensure it's unique in database
            var counter = 1;
            var originalSku = sku;
            while (await _context.Products.AnyAsync(p => p.SKU == sku))
            {
                sku = $"{originalSku}-{counter}";
                counter++;
            }

            return sku;
        }

        private static string GenerateSlug(string name)
        {
            return name.ToLower()
                      .Replace(" ", "-")
                      .Replace("&", "and")
                      .Replace("'", "")
                      .Replace("\"", "")
                      .Replace(",", "")
                      .Replace(".", "")
                      .Replace("!", "")
                      .Replace("?", "");
        }

        #region Product Operations with File Upload

        /// <summary>
        /// Create product with file uploads
        /// </summary>
        [HttpPost("with-files")]
        public async Task<ActionResult<AdminProductResponseDto>> CreateProductWithFiles([FromForm] CreateAdminProductWithFilesDto request)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
                if (!categoryExists)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                // Generate SKU and slug
                var sku = await GenerateUniqueSKU(request.Name);
                var slug = GenerateSlug(request.Slug ?? request.Name);

                // Handle main image upload
                string? mainImageUrl = request.ImageUrl;
                if (request.MainImage != null)
                {
                    var uploadResult = await UploadImageFile(request.MainImage);
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new AdminProductResponseDto
                        {
                            Success = false,
                            Message = $"Main image upload failed: {uploadResult.Message}"
                        });
                    }
                    mainImageUrl = uploadResult.ImageUrl;
                }

                // Create product
                var product = new Product
                {
                    Name = request.Name,
                    Description = request.Description,
                    LongDescription = request.LongDescription,
                    Price = request.Price,
                    SalePrice = request.SalePrice,
                    SKU = sku,
                    Stock = request.Stock,
                    ImageUrl = mainImageUrl,
                    CategoryId = request.CategoryId,
                    IsActive = request.IsActive,
                    IsFeatured = request.IsFeatured,
                    MetaTitle = request.MetaTitle,
                    MetaDescription = request.MetaDescription,
                    Slug = slug,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Handle image gallery uploads
                var allImageUrls = new List<string>();

                // Add main image if exists
                if (!string.IsNullOrEmpty(mainImageUrl))
                {
                    allImageUrls.Add(mainImageUrl);
                }

                // Upload gallery files
                if (request.ImageGallery != null && request.ImageGallery.Count > 0)
                {
                    var uploadResults = await UploadMultipleImageFiles(request.ImageGallery);
                    var successfulUploads = uploadResults.Where(r => r.Success && !string.IsNullOrEmpty(r.ImageUrl)).ToList();
                    allImageUrls.AddRange(successfulUploads.Select(r => r.ImageUrl!));
                }

                // Add URL-based images if provided
                if (request.ImageUrls != null && request.ImageUrls.Count > 0)
                {
                    allImageUrls.AddRange(request.ImageUrls);
                }

                // Create product images
                if (allImageUrls.Count > 0)
                {
                    var images = allImageUrls.Select((url, index) => new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = url,
                        SortOrder = index + 1,
                        IsPrimary = index == 0
                    }).ToList();

                    _context.ProductImages.AddRange(images);
                }

                // Add attributes if provided
                if (request.Attributes != null && request.Attributes.Count > 0)
                {
                    var attributes = request.Attributes.Select(attr => new ProductAttribute
                    {
                        ProductId = product.Id,
                        Name = attr.Name,
                        Value = attr.Value,
                        SortOrder = attr.SortOrder
                    }).ToList();

                    _context.ProductAttributes.AddRange(attributes);
                }

                // Add filter values if provided
                if (request.FilterValues != null && request.FilterValues.Count > 0)
                {
                    var filterValues = request.FilterValues.Select(fv => new ProductFilterValue
                    {
                        ProductId = product.Id,
                        FilterOptionId = fv.FilterOptionId,
                        FilterOptionValueId = fv.FilterOptionValueId,
                        CustomValue = fv.CustomValue,
                        NumericValue = fv.NumericValue
                    }).ToList();

                    _context.ProductFilterValues.AddRange(filterValues);
                }

                await _context.SaveChangesAsync();

                // Return the created product
                var getProductResult = await GetProduct(product.Id);
                if (getProductResult.Result is OkObjectResult okResult &&
                    okResult.Value is AdminProductResponseDto response)
                {
                    return Ok(response);
                }

                return Ok(new AdminProductResponseDto { Success = true, Product = null });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product with files");
                return StatusCode(500, new AdminProductResponseDto
                {
                    Success = false,
                    Message = "Internal server error occurred while creating product"
                });
            }
        }

        /// <summary>
        /// Update product with file uploads
        /// </summary>
        [HttpPut("{id}/with-files")]
        public async Task<ActionResult<AdminProductResponseDto>> UpdateProductWithFiles(int id, [FromForm] UpdateAdminProductWithFilesDto request)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Product not found"
                    });
                }

                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
                if (!categoryExists)
                {
                    return BadRequest(new AdminProductResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                // Generate new SKU if product name has changed
                var newSku = product.SKU;
                if (product.Name != request.Name)
                {
                    newSku = await GenerateUniqueSKU(request.Name);
                }

                // Handle main image upload
                string? mainImageUrl = request.ImageUrl ?? product.ImageUrl;
                if (request.MainImage != null)
                {
                    // Delete old main image if it exists and is a local file
                    if (!string.IsNullOrEmpty(product.ImageUrl) && product.ImageUrl.Contains("/uploads/images/"))
                    {
                        DeleteImageFile(product.ImageUrl);
                    }

                    var uploadResult = await UploadImageFile(request.MainImage);
                    if (!uploadResult.Success)
                    {
                        return BadRequest(new AdminProductResponseDto
                        {
                            Success = false,
                            Message = $"Main image upload failed: {uploadResult.Message}"
                        });
                    }
                    mainImageUrl = uploadResult.ImageUrl;
                }

                // Update product properties
                product.Name = request.Name;
                product.Description = request.Description;
                product.LongDescription = request.LongDescription;
                product.Price = request.Price;
                product.SalePrice = request.SalePrice;
                product.SKU = newSku;
                product.Stock = request.Stock;
                product.ImageUrl = mainImageUrl;
                product.CategoryId = request.CategoryId;
                product.IsActive = request.IsActive;
                product.IsFeatured = request.IsFeatured;
                product.MetaTitle = request.MetaTitle;
                product.MetaDescription = request.MetaDescription;
                product.UpdatedAt = DateTime.UtcNow;

                // Handle image deletions
                if (request.ImagesToDelete != null && request.ImagesToDelete.Count > 0)
                {
                    foreach (var imageToDelete in request.ImagesToDelete)
                    {
                        DeleteImageFile(imageToDelete);
                    }
                }

                // Handle image gallery updates
                var allImageUrls = new List<string>();

                // Add main image if exists
                if (!string.IsNullOrEmpty(mainImageUrl))
                {
                    allImageUrls.Add(mainImageUrl);
                }

                // Upload new gallery files
                if (request.ImageGallery != null && request.ImageGallery.Count > 0)
                {
                    var uploadResults = await UploadMultipleImageFiles(request.ImageGallery);
                    var successfulUploads = uploadResults.Where(r => r.Success && !string.IsNullOrEmpty(r.ImageUrl)).ToList();
                    allImageUrls.AddRange(successfulUploads.Select(r => r.ImageUrl!));
                }

                // Add URL-based images if provided
                if (request.ImageUrls != null && request.ImageUrls.Count > 0)
                {
                    allImageUrls.AddRange(request.ImageUrls);
                }

                // Update product images
                if (allImageUrls.Count > 0)
                {
                    // Remove existing images
                    var existingImages = await _context.ProductImages.Where(i => i.ProductId == id).ToListAsync();
                    _context.ProductImages.RemoveRange(existingImages);

                    // Add new images
                    var images = allImageUrls.Select((url, index) => new ProductImage
                    {
                        ProductId = id,
                        ImageUrl = url,
                        SortOrder = index + 1,
                        IsPrimary = index == 0
                    }).ToList();

                    _context.ProductImages.AddRange(images);
                }

                // Update attributes
                if (request.Attributes != null)
                {
                    // Remove existing attributes
                    var existingAttributes = await _context.ProductAttributes.Where(a => a.ProductId == id).ToListAsync();
                    _context.ProductAttributes.RemoveRange(existingAttributes);

                    // Add new attributes
                    if (request.Attributes.Count > 0)
                    {
                        var attributes = request.Attributes.Select(attr => new ProductAttribute
                        {
                            ProductId = id,
                            Name = attr.Name,
                            Value = attr.Value,
                            SortOrder = attr.SortOrder
                        }).ToList();

                        _context.ProductAttributes.AddRange(attributes);
                    }
                }

                // Update filter values
                if (request.FilterValues != null)
                {
                    // Remove existing filter values
                    var existingFilterValues = await _context.ProductFilterValues.Where(fv => fv.ProductId == id).ToListAsync();
                    _context.ProductFilterValues.RemoveRange(existingFilterValues);

                    // Add new filter values
                    if (request.FilterValues.Count > 0)
                    {
                        var filterValues = request.FilterValues.Select(fv => new ProductFilterValue
                        {
                            ProductId = id,
                            FilterOptionId = fv.FilterOptionId,
                            FilterOptionValueId = fv.FilterOptionValueId,
                            CustomValue = fv.CustomValue,
                            NumericValue = fv.NumericValue
                        }).ToList();

                        _context.ProductFilterValues.AddRange(filterValues);
                    }
                }

                await _context.SaveChangesAsync();

                // Return the updated product
                var getProductResult = await GetProduct(id);
                if (getProductResult.Result is OkObjectResult okResult &&
                    okResult.Value is AdminProductResponseDto response)
                {
                    return Ok(response);
                }

                return Ok(new AdminProductResponseDto { Success = true, Product = null });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with files: {ProductId}", id);
                return StatusCode(500, new AdminProductResponseDto
                {
                    Success = false,
                    Message = "Internal server error occurred while updating product"
                });
            }
        }

        #endregion

        #region Image Upload Helper Methods

        /// <summary>
        /// Upload a single image file
        /// </summary>
        private async Task<ImageUploadResponseDto> UploadImageFile(IFormFile file)
        {
            try
            {
                // Validate file
                var validation = ValidateImageFile(file);
                if (!validation.IsValid)
                {
                    return new ImageUploadResponseDto
                    {
                        Success = false,
                        Message = validation.ErrorMessage
                    };
                }

                var result = await _imageProcessingService.ProcessAndSaveAsync(file, Request);
                _logger.LogInformation("Image uploaded successfully: {FileName} -> {ImageUrl}", file.FileName, result.ImageUrl);

                return new ImageUploadResponseDto
                {
                    Success = true,
                    ImageUrl = result.ImageUrl,
                    FileName = result.FileName,
                    OriginalFileName = file.FileName,
                    FileSize = result.FileSize,
                    Message = "Image uploaded successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image: {FileName}", file?.FileName);
                return new ImageUploadResponseDto
                {
                    Success = false,
                    Message = "Internal server error occurred while uploading image"
                };
            }
        }

        /// <summary>
        /// Upload multiple image files
        /// </summary>
        private async Task<List<ImageUploadResult>> UploadMultipleImageFiles(List<IFormFile> files)
        {
            var results = new List<ImageUploadResult>();
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
            Directory.CreateDirectory(uploadsPath);

            foreach (var file in files)
            {
                try
                {
                    var validation = ValidateImageFile(file);
                    if (!validation.IsValid)
                    {
                        results.Add(new ImageUploadResult
                        {
                            OriginalFileName = file.FileName,
                            Success = false,
                            Error = validation.ErrorMessage
                        });
                        continue;
                    }

                    var processed = await _imageProcessingService.ProcessAndSaveAsync(file, Request);

                    results.Add(new ImageUploadResult
                    {
                        OriginalFileName = file.FileName,
                        FileName = processed.FileName,
                        ImageUrl = processed.ImageUrl,
                        FileSize = processed.FileSize,
                        Success = true
                    });

                    _logger.LogInformation("Image uploaded successfully: {FileName} -> {ImageUrl}", file.FileName, processed.ImageUrl);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error uploading image: {FileName}", file.FileName);
                    results.Add(new ImageUploadResult
                    {
                        OriginalFileName = file.FileName,
                        Success = false,
                        Error = "Upload failed"
                    });
                }
            }

            return results;
        }

        /// <summary>
        /// Delete image file
        /// </summary>
        private bool DeleteImageFile(string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                    return false;

                // Extract filename from URL if needed
                if (fileName.Contains("/"))
                {
                    fileName = Path.GetFileName(fileName);
                }

                // Validate filename to prevent directory traversal
                if (fileName.Contains("..") || fileName.Contains("/") || fileName.Contains("\\"))
                {
                    _logger.LogWarning("Invalid file name for deletion: {FileName}", fileName);
                    return false;
                }

                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
                var filePath = Path.Combine(uploadsPath, fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    _logger.LogInformation("Image deleted successfully: {FileName}", fileName);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image: {FileName}", fileName);
                return false;
            }
        }

        /// <summary>
        /// Validate image file
        /// </summary>
        private (bool IsValid, string ErrorMessage) ValidateImageFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return (false, "No file provided");

            if (file.Length > _maxFileSize)
                return (false, $"File size exceeds maximum allowed size of {_maxFileSize / (1024 * 1024)}MB");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
                return (false, $"File type not allowed. Allowed types: {string.Join(", ", _allowedExtensions)}");

            if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
                return (false, $"MIME type not allowed. Allowed types: {string.Join(", ", _allowedMimeTypes)}");

            return (true, string.Empty);
        }

        #endregion
    }

    // Bulk operation DTOs
    public class BulkUpdateStatusDto
    {
        public List<int> ProductIds { get; set; } = new();
        public bool IsActive { get; set; }
    }

    public class BulkDeleteDto
    {
        public List<int> ProductIds { get; set; } = new();
    }
}
