using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;
using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/categories")]
    public class AdminCategoriesController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminCategoriesController> _logger;

        public AdminCategoriesController(SegishopDbContext context, ILogger<AdminCategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all categories for admin (including inactive ones)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<AdminCategoriesResponseDto>> GetCategories(
            [FromQuery] string? searchTerm = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] int? parentId = null,
            [FromQuery] string? sortBy = "name",
            [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                // Build the query with conditional includes based on isActive parameter
                IQueryable<Category> query;

                if (isActive.HasValue)
                {
                    // When filtering by isActive, include only children matching the filter
                    query = _context.Categories
                        .Include(c => c.Parent)
                        .Include(c => c.Children.Where(child => child.IsActive == isActive.Value))
                        .Include(c => c.Products)
                        .AsQueryable();
                }
                else
                {
                    // When not filtering by isActive, include ALL children (both active and inactive)
                    query = _context.Categories
                        .Include(c => c.Parent)
                        .Include(c => c.Children)
                        .Include(c => c.Products)
                        .AsQueryable();
                }

                // Apply filters
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(c => c.Name.Contains(searchTerm) ||
                                           c.Description.Contains(searchTerm));
                }

                if (isActive.HasValue)
                {
                    query = query.Where(c => c.IsActive == isActive.Value);
                }

                if (parentId.HasValue)
                {
                    query = query.Where(c => c.ParentId == parentId.Value);
                }
                else
                {
                    // If no specific parentId is requested, only return parent categories (not subcategories)
                    // This prevents the flat list issue where both parents and children appear at the same level
                    query = query.Where(c => c.ParentId == null);
                }

                // Apply sorting
                query = sortBy?.ToLower() switch
                {
                    "name" => sortOrder == "desc" ? query.OrderByDescending(c => c.Name) : query.OrderBy(c => c.Name),
                    "createdat" => sortOrder == "desc" ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
                    "sortorder" => sortOrder == "desc" ? query.OrderByDescending(c => c.SortOrder) : query.OrderBy(c => c.SortOrder),
                    _ => query.OrderBy(c => c.SortOrder).ThenBy(c => c.Name)
                };

                var categories = await query
                    .Select(c => new AdminCategoryDto
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
                        MetaTitle = c.MetaTitle,
                        MetaDescription = c.MetaDescription,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        ProductCount = c.Products.Count(p => p.IsActive),
                        ChildrenCount = c.Children.Count(),
                        Children = c.Children
                            .OrderBy(child => child.SortOrder)
                            .Select(child => new AdminCategoryDto
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
                                MetaTitle = child.MetaTitle,
                                MetaDescription = child.MetaDescription,
                                CreatedAt = child.CreatedAt,
                                UpdatedAt = child.UpdatedAt,
                                ProductCount = child.Products.Count(p => p.IsActive),
                                ChildrenCount = 0,
                                Children = new List<AdminCategoryDto>()
                            }).ToList()
                    })
                    .ToListAsync();

                return Ok(new AdminCategoriesResponseDto
                {
                    Success = true,
                    Categories = categories,
                    TotalCount = categories.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin categories");
                return StatusCode(500, new AdminCategoriesResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Get category by ID for admin
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminCategoryResponseDto>> GetCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Parent)
                    .Include(c => c.Children)
                    .Include(c => c.Products)
                    .Where(c => c.Id == id)
                    .Select(c => new AdminCategoryDto
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
                        MetaTitle = c.MetaTitle,
                        MetaDescription = c.MetaDescription,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        ProductCount = c.Products.Count(p => p.IsActive),
                        ChildrenCount = c.Children.Count(),
                        Children = c.Children
                            .OrderBy(child => child.SortOrder)
                            .Select(child => new AdminCategoryDto
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
                                MetaTitle = child.MetaTitle,
                                MetaDescription = child.MetaDescription,
                                CreatedAt = child.CreatedAt,
                                UpdatedAt = child.UpdatedAt,
                                ProductCount = child.Products.Count(p => p.IsActive),
                                ChildrenCount = 0,
                                Children = new List<AdminCategoryDto>()
                            }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return NotFound(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                return Ok(new AdminCategoryResponseDto
                {
                    Success = true,
                    Category = category
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin category with ID: {CategoryId}", id);
                return StatusCode(500, new AdminCategoryResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create new category
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AdminCategoryResponseDto>> CreateCategory([FromBody] CreateAdminCategoryDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = "Invalid category data"
                    });
                }

                // Validate parent category if specified
                if (request.ParentId.HasValue)
                {
                    var parentExists = await _context.Categories
                        .AnyAsync(c => c.Id == request.ParentId.Value && c.IsActive);

                    if (!parentExists)
                    {
                        return BadRequest(new AdminCategoryResponseDto
                        {
                            Success = false,
                            Message = "Parent category not found"
                        });
                    }
                }

                // Generate slug if not provided
                var slug = !string.IsNullOrEmpty(request.Slug)
                    ? request.Slug.ToLowerInvariant()
                    : GenerateSlug(request.Name);

                // Check if slug already exists (check all categories, not just active ones)
                var slugExists = await _context.Categories
                    .AnyAsync(c => c.Slug == slug);

                if (slugExists)
                {
                    // Generate unique slug
                    var counter = 1;
                    var originalSlug = slug;
                    while (await _context.Categories.AnyAsync(c => c.Slug == slug))
                    {
                        slug = $"{originalSlug}-{counter}";
                        counter++;
                    }
                }

                var category = new Category
                {
                    Name = request.Name,
                    Description = request.Description ?? string.Empty,
                    ImageUrl = request.ImageUrl,
                    ParentId = request.ParentId,
                    IsActive = request.IsActive,
                    SortOrder = request.SortOrder,
                    Slug = slug,
                    ConfigurationType = request.ConfigurationType,
                    MetaTitle = request.MetaTitle,
                    MetaDescription = request.MetaDescription,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                // Return the created category
                var getResult = await GetCategory(category.Id);
                if (getResult.Result is OkObjectResult okResult &&
                    okResult.Value is AdminCategoryResponseDto response)
                {
                    return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, response);
                }

                return Ok(new AdminCategoryResponseDto
                {
                    Success = true,
                    Message = "Category created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(500, new AdminCategoryResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Update existing category
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<AdminCategoryResponseDto>> UpdateCategory(int id, [FromBody] UpdateAdminCategoryDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = "Invalid category data"
                    });
                }

                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                // Validate parent category if specified and different from current
                if (request.ParentId.HasValue && request.ParentId != category.ParentId)
                {
                    // Check if parent exists
                    var parentExists = await _context.Categories
                        .AnyAsync(c => c.Id == request.ParentId.Value && c.IsActive);

                    if (!parentExists)
                    {
                        return BadRequest(new AdminCategoryResponseDto
                        {
                            Success = false,
                            Message = "Parent category not found"
                        });
                    }

                    // Check for circular reference
                    if (await WouldCreateCircularReference(id, request.ParentId.Value))
                    {
                        return BadRequest(new AdminCategoryResponseDto
                        {
                            Success = false,
                            Message = "Cannot set parent category - would create circular reference"
                        });
                    }
                }

                // Handle slug update
                var slug = category.Slug;
                if (!string.IsNullOrEmpty(request.Slug) && request.Slug != category.Slug)
                {
                    slug = request.Slug.ToLowerInvariant();

                    // Check if new slug already exists
                    var slugExists = await _context.Categories
                        .AnyAsync(c => c.Slug == slug && c.IsActive && c.Id != id);

                    if (slugExists)
                    {
                        return BadRequest(new AdminCategoryResponseDto
                        {
                            Success = false,
                            Message = "Category slug already exists"
                        });
                    }
                }
                else if (request.Name != category.Name)
                {
                    // Generate new slug from name if name changed but slug not provided
                    slug = GenerateSlug(request.Name);

                    // Ensure uniqueness (check all categories, not just active ones)
                    var counter = 1;
                    var originalSlug = slug;
                    while (await _context.Categories.AnyAsync(c => c.Slug == slug && c.Id != id))
                    {
                        slug = $"{originalSlug}-{counter}";
                        counter++;
                    }
                }

                // Update category properties
                category.Name = request.Name;
                category.Description = request.Description ?? string.Empty;
                category.ImageUrl = request.ImageUrl;
                category.ParentId = request.ParentId;
                category.IsActive = request.IsActive;
                category.SortOrder = request.SortOrder;
                category.Slug = slug;
                category.ConfigurationType = request.ConfigurationType;
                category.MetaTitle = request.MetaTitle;
                category.MetaDescription = request.MetaDescription;
                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Return updated category
                var getResult = await GetCategory(id);
                if (getResult.Result is OkObjectResult okResult &&
                    okResult.Value is AdminCategoryResponseDto response)
                {
                    return Ok(response);
                }

                return Ok(new AdminCategoryResponseDto
                {
                    Success = true,
                    Message = "Category updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category with ID: {CategoryId}", id);
                return StatusCode(500, new AdminCategoryResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Delete category (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<AdminCategoryResponseDto>> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Children)
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                // Check if category has active products
                var activeProductsCount = category.Products.Count(p => p.IsActive);
                if (activeProductsCount > 0)
                {
                    return BadRequest(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = $"Cannot delete category that contains {activeProductsCount} active products. Please move or deactivate products first."
                    });
                }

                // Check if category has active children
                var activeChildrenCount = category.Children.Count(c => c.IsActive);
                if (activeChildrenCount > 0)
                {
                    return BadRequest(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = $"Cannot delete category that has {activeChildrenCount} active subcategories. Please move or delete subcategories first."
                    });
                }

                // Soft delete - set IsActive to false
                category.IsActive = false;
                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Category soft deleted: {CategoryId}", id);
                return Ok(new AdminCategoryResponseDto
                {
                    Success = true,
                    Message = "Category deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category with ID: {CategoryId}", id);
                return StatusCode(500, new AdminCategoryResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Reactivate category (undo soft delete)
        /// </summary>
        [HttpPut("{id}/reactivate")]
        public async Task<ActionResult<AdminCategoryResponseDto>> ReactivateCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                if (category.IsActive)
                {
                    return BadRequest(new AdminCategoryResponseDto
                    {
                        Success = false,
                        Message = "Category is already active"
                    });
                }

                // Reactivate - set IsActive to true
                category.IsActive = true;
                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Category reactivated: {CategoryId}", id);
                return Ok(new AdminCategoryResponseDto
                {
                    Success = true,
                    Message = "Category reactivated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reactivating category with ID: {CategoryId}", id);
                return StatusCode(500, new AdminCategoryResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Check if setting a parent would create a circular reference
        /// </summary>
        private async Task<bool> WouldCreateCircularReference(int categoryId, int parentId)
        {
            int? currentParentId = parentId;

            while (currentParentId.HasValue)
            {
                if (currentParentId == categoryId)
                {
                    return true; // Circular reference detected
                }

                var parent = await _context.Categories
                    .Where(c => c.Id == currentParentId.Value)
                    .Select(c => new { c.ParentId })
                    .FirstOrDefaultAsync();

                currentParentId = parent?.ParentId;
            }

            return false;
        }

        private string GenerateSlug(string name)
        {
            return name.ToLowerInvariant()
                      .Replace(" ", "-")
                      .Replace("&", "and")
                      .Replace("'", "")
                      .Replace("\"", "")
                      .Replace(".", "")
                      .Replace(",", "")
                      .Replace("!", "")
                      .Replace("?", "")
                      .Replace("(", "")
                      .Replace(")", "");
        }
    }
}
