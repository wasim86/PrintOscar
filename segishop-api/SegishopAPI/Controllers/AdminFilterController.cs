using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/filters")]
    [Authorize(Roles = "Admin")]
    public class AdminFilterController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminFilterController> _logger;

        public AdminFilterController(SegishopDbContext context, ILogger<AdminFilterController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all filter options with pagination and category filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<AdminFilterOptionsResponseDto>> GetFilterOptions(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? categoryId = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.FilterOptions
                    .Include(f => f.Category)
                    .Include(f => f.FilterOptionValues.Where(v => v.IsActive))
                    .Include(f => f.ProductFilterValues)
                    .AsQueryable();

                // Apply filters
                if (categoryId.HasValue)
                {
                    query = query.Where(f => f.CategoryId == categoryId.Value);
                }

                if (isActive.HasValue)
                {
                    query = query.Where(f => f.IsActive == isActive.Value);
                }

                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var filterOptions = await query
                    .OrderBy(f => f.Category.Name)
                    .ThenBy(f => f.SortOrder)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(f => new AdminFilterOptionDto
                    {
                        Id = f.Id,
                        Name = f.Name,
                        DisplayName = f.DisplayName,
                        Description = f.Description,
                        CategoryId = f.CategoryId,
                        CategoryName = f.Category.Name,
                        FilterType = f.FilterType,
                        MinValue = f.MinValue,
                        MaxValue = f.MaxValue,
                        SortOrder = f.SortOrder,
                        IsActive = f.IsActive,
                        CreatedAt = f.CreatedAt,
                        ProductCount = f.ProductFilterValues.Select(pfv => pfv.ProductId).Distinct().Count(),
                        CanDelete = !f.ProductFilterValues.Any(),
                        FilterOptionValues = f.FilterOptionValues
                            .Where(v => v.IsActive)
                            .OrderBy(v => v.SortOrder)
                            .Select(v => new AdminFilterOptionValueDto
                            {
                                Id = v.Id,
                                FilterOptionId = v.FilterOptionId,
                                Value = v.Value,
                                DisplayValue = v.DisplayValue,
                                Description = v.Description,
                                ColorCode = v.ColorCode,
                                SortOrder = v.SortOrder,
                                IsActive = v.IsActive,
                                CreatedAt = v.CreatedAt
                            }).ToList()
                    })
                    .ToListAsync();

                return Ok(new AdminFilterOptionsResponseDto
                {
                    Success = true,
                    FilterOptions = filterOptions,
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
                _logger.LogError(ex, "Error getting filter options");
                return StatusCode(500, new AdminFilterOptionsResponseDto
                {
                    Success = false,
                    Message = "An error occurred while retrieving filter options"
                });
            }
        }

        /// <summary>
        /// Get filter options by category
        /// </summary>
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<AdminFilterOptionsResponseDto>> GetFilterOptionsByCategory(int categoryId)
        {
            try
            {
                var category = await _context.Categories.FindAsync(categoryId);
                if (category == null)
                {
                    return NotFound(new AdminFilterOptionsResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                var filterOptions = await _context.FilterOptions
                    .Include(f => f.FilterOptionValues.Where(v => v.IsActive))
                    .Where(f => f.CategoryId == categoryId && f.IsActive)
                    .OrderBy(f => f.SortOrder)
                    .Select(f => new AdminFilterOptionDto
                    {
                        Id = f.Id,
                        Name = f.Name,
                        DisplayName = f.DisplayName,
                        Description = f.Description,
                        CategoryId = f.CategoryId,
                        CategoryName = category.Name,
                        FilterType = f.FilterType,
                        MinValue = f.MinValue,
                        MaxValue = f.MaxValue,
                        SortOrder = f.SortOrder,
                        IsActive = f.IsActive,
                        CreatedAt = f.CreatedAt,
                        FilterOptionValues = f.FilterOptionValues
                            .Where(v => v.IsActive)
                            .OrderBy(v => v.SortOrder)
                            .Select(v => new AdminFilterOptionValueDto
                            {
                                Id = v.Id,
                                FilterOptionId = v.FilterOptionId,
                                Value = v.Value,
                                DisplayValue = v.DisplayValue,
                                Description = v.Description,
                                ColorCode = v.ColorCode,
                                SortOrder = v.SortOrder,
                                IsActive = v.IsActive,
                                CreatedAt = v.CreatedAt
                            }).ToList()
                    })
                    .ToListAsync();

                return Ok(new AdminFilterOptionsResponseDto
                {
                    Success = true,
                    FilterOptions = filterOptions,
                    TotalCount = filterOptions.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filter options for category {CategoryId}", categoryId);
                return StatusCode(500, new AdminFilterOptionsResponseDto
                {
                    Success = false,
                    Message = "An error occurred while retrieving filter options"
                });
            }
        }

        /// <summary>
        /// Get filter option by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminFilterOptionResponseDto>> GetFilterOption(int id)
        {
            try
            {
                var filterOption = await _context.FilterOptions
                    .Include(f => f.Category)
                    .Include(f => f.FilterOptionValues)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (filterOption == null)
                {
                    return NotFound(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Filter option not found"
                    });
                }

                var result = new AdminFilterOptionDto
                {
                    Id = filterOption.Id,
                    Name = filterOption.Name,
                    DisplayName = filterOption.DisplayName,
                    Description = filterOption.Description,
                    CategoryId = filterOption.CategoryId,
                    CategoryName = filterOption.Category.Name,
                    FilterType = filterOption.FilterType,
                    MinValue = filterOption.MinValue,
                    MaxValue = filterOption.MaxValue,
                    SortOrder = filterOption.SortOrder,
                    IsActive = filterOption.IsActive,
                    CreatedAt = filterOption.CreatedAt,
                    FilterOptionValues = filterOption.FilterOptionValues
                        .OrderBy(v => v.SortOrder)
                        .Select(v => new AdminFilterOptionValueDto
                        {
                            Id = v.Id,
                            FilterOptionId = v.FilterOptionId,
                            Value = v.Value,
                            DisplayValue = v.DisplayValue,
                            Description = v.Description,
                            ColorCode = v.ColorCode,
                            SortOrder = v.SortOrder,
                            IsActive = v.IsActive,
                            CreatedAt = v.CreatedAt
                        }).ToList()
                };

                return Ok(new AdminFilterOptionResponseDto
                {
                    Success = true,
                    FilterOption = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filter option {Id}", id);
                return StatusCode(500, new AdminFilterOptionResponseDto
                {
                    Success = false,
                    Message = "An error occurred while retrieving the filter option"
                });
            }
        }

        /// <summary>
        /// Create a new filter option
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AdminFilterOptionResponseDto>> CreateFilterOption([FromBody] CreateAdminFilterOptionDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                }

                // Verify category exists
                var category = await _context.Categories.FindAsync(request.CategoryId);
                if (category == null)
                {
                    return BadRequest(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                // Check if filter with same name exists in category
                var existingFilter = await _context.FilterOptions
                    .FirstOrDefaultAsync(f => f.CategoryId == request.CategoryId && f.Name == request.Name);
                if (existingFilter != null)
                {
                    return BadRequest(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "A filter with this name already exists in this category"
                    });
                }

                var filterOption = new FilterOption
                {
                    Name = request.Name,
                    DisplayName = string.IsNullOrEmpty(request.DisplayName) ? request.Name : request.DisplayName,
                    Description = request.Description,
                    CategoryId = request.CategoryId,
                    FilterType = request.FilterType,
                    MinValue = request.MinValue,
                    MaxValue = request.MaxValue,
                    SortOrder = request.SortOrder,
                    IsActive = request.IsActive,
                    CreatedAt = DateTime.UtcNow
                };

                _context.FilterOptions.Add(filterOption);
                await _context.SaveChangesAsync();

                // Add filter option values if provided
                if (request.FilterOptionValues != null && request.FilterOptionValues.Any())
                {
                    var filterOptionValues = request.FilterOptionValues.Select(v => new FilterOptionValue
                    {
                        FilterOptionId = filterOption.Id,
                        Value = v.Value,
                        DisplayValue = string.IsNullOrEmpty(v.DisplayValue) ? v.Value : v.DisplayValue,
                        Description = v.Description,
                        ColorCode = v.ColorCode,
                        SortOrder = v.SortOrder,
                        IsActive = v.IsActive,
                        CreatedAt = DateTime.UtcNow
                    }).ToList();

                    _context.FilterOptionValues.AddRange(filterOptionValues);
                    await _context.SaveChangesAsync();
                }

                // Reload with includes
                var createdFilter = await _context.FilterOptions
                    .Include(f => f.Category)
                    .Include(f => f.FilterOptionValues)
                    .FirstOrDefaultAsync(f => f.Id == filterOption.Id);

                var result = new AdminFilterOptionDto
                {
                    Id = createdFilter!.Id,
                    Name = createdFilter.Name,
                    DisplayName = createdFilter.DisplayName,
                    Description = createdFilter.Description,
                    CategoryId = createdFilter.CategoryId,
                    CategoryName = createdFilter.Category.Name,
                    FilterType = createdFilter.FilterType,
                    MinValue = createdFilter.MinValue,
                    MaxValue = createdFilter.MaxValue,
                    SortOrder = createdFilter.SortOrder,
                    IsActive = createdFilter.IsActive,
                    CreatedAt = createdFilter.CreatedAt,
                    FilterOptionValues = createdFilter.FilterOptionValues
                        .OrderBy(v => v.SortOrder)
                        .Select(v => new AdminFilterOptionValueDto
                        {
                            Id = v.Id,
                            FilterOptionId = v.FilterOptionId,
                            Value = v.Value,
                            DisplayValue = v.DisplayValue,
                            Description = v.Description,
                            ColorCode = v.ColorCode,
                            SortOrder = v.SortOrder,
                            IsActive = v.IsActive,
                            CreatedAt = v.CreatedAt
                        }).ToList()
                };

                _logger.LogInformation("Filter option created successfully: {FilterName} for category {CategoryId}", request.Name, request.CategoryId);

                return CreatedAtAction(nameof(GetFilterOption), new { id = filterOption.Id }, new AdminFilterOptionResponseDto
                {
                    Success = true,
                    FilterOption = result,
                    Message = "Filter option created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating filter option");
                return StatusCode(500, new AdminFilterOptionResponseDto
                {
                    Success = false,
                    Message = "An error occurred while creating the filter option"
                });
            }
        }

        /// <summary>
        /// Update an existing filter option
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<AdminFilterOptionResponseDto>> UpdateFilterOption(int id, [FromBody] UpdateAdminFilterOptionDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                }

                var filterOption = await _context.FilterOptions
                    .Include(f => f.FilterOptionValues)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (filterOption == null)
                {
                    return NotFound(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Filter option not found"
                    });
                }

                // Verify category exists
                var category = await _context.Categories.FindAsync(request.CategoryId);
                if (category == null)
                {
                    return BadRequest(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Category not found"
                    });
                }

                // Check if filter with same name exists in category (excluding current)
                var existingFilter = await _context.FilterOptions
                    .FirstOrDefaultAsync(f => f.CategoryId == request.CategoryId && f.Name == request.Name && f.Id != id);
                if (existingFilter != null)
                {
                    return BadRequest(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "A filter with this name already exists in this category"
                    });
                }

                // Update filter option
                filterOption.Name = request.Name;
                filterOption.DisplayName = string.IsNullOrEmpty(request.DisplayName) ? request.Name : request.DisplayName;
                filterOption.Description = request.Description;
                filterOption.CategoryId = request.CategoryId;
                filterOption.FilterType = request.FilterType;
                filterOption.MinValue = request.MinValue;
                filterOption.MaxValue = request.MaxValue;
                filterOption.SortOrder = request.SortOrder;
                filterOption.IsActive = request.IsActive;

                // Update filter option values if provided
                if (request.FilterOptionValues != null)
                {
                    // Remove existing values
                    _context.FilterOptionValues.RemoveRange(filterOption.FilterOptionValues);

                    // Add new values
                    var newValues = request.FilterOptionValues.Select(v => new FilterOptionValue
                    {
                        FilterOptionId = filterOption.Id,
                        Value = v.Value,
                        DisplayValue = string.IsNullOrEmpty(v.DisplayValue) ? v.Value : v.DisplayValue,
                        Description = v.Description,
                        ColorCode = v.ColorCode,
                        SortOrder = v.SortOrder,
                        IsActive = v.IsActive,
                        CreatedAt = DateTime.UtcNow
                    }).ToList();

                    _context.FilterOptionValues.AddRange(newValues);
                }

                await _context.SaveChangesAsync();

                // Reload with includes
                var updatedFilter = await _context.FilterOptions
                    .Include(f => f.Category)
                    .Include(f => f.FilterOptionValues)
                    .FirstOrDefaultAsync(f => f.Id == id);

                var result = new AdminFilterOptionDto
                {
                    Id = updatedFilter!.Id,
                    Name = updatedFilter.Name,
                    DisplayName = updatedFilter.DisplayName,
                    Description = updatedFilter.Description,
                    CategoryId = updatedFilter.CategoryId,
                    CategoryName = updatedFilter.Category.Name,
                    FilterType = updatedFilter.FilterType,
                    MinValue = updatedFilter.MinValue,
                    MaxValue = updatedFilter.MaxValue,
                    SortOrder = updatedFilter.SortOrder,
                    IsActive = updatedFilter.IsActive,
                    CreatedAt = updatedFilter.CreatedAt,
                    FilterOptionValues = updatedFilter.FilterOptionValues
                        .OrderBy(v => v.SortOrder)
                        .Select(v => new AdminFilterOptionValueDto
                        {
                            Id = v.Id,
                            FilterOptionId = v.FilterOptionId,
                            Value = v.Value,
                            DisplayValue = v.DisplayValue,
                            Description = v.Description,
                            ColorCode = v.ColorCode,
                            SortOrder = v.SortOrder,
                            IsActive = v.IsActive,
                            CreatedAt = v.CreatedAt
                        }).ToList()
                };

                _logger.LogInformation("Filter option updated successfully: {FilterId}", id);

                return Ok(new AdminFilterOptionResponseDto
                {
                    Success = true,
                    FilterOption = result,
                    Message = "Filter option updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating filter option {Id}", id);
                return StatusCode(500, new AdminFilterOptionResponseDto
                {
                    Success = false,
                    Message = "An error occurred while updating the filter option"
                });
            }
        }

        /// <summary>
        /// Delete a filter option
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<AdminFilterOptionResponseDto>> DeleteFilterOption(int id)
        {
            try
            {
                var filterOption = await _context.FilterOptions
                    .Include(f => f.FilterOptionValues)
                    .Include(f => f.ProductFilterValues)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (filterOption == null)
                {
                    return NotFound(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Filter option not found"
                    });
                }

                // Check if filter is being used by products
                if (filterOption.ProductFilterValues.Any())
                {
                    return BadRequest(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Cannot delete filter option as it is being used by products. Please remove it from products first."
                    });
                }

                // Remove filter option values first
                _context.FilterOptionValues.RemoveRange(filterOption.FilterOptionValues);

                // Remove filter option
                _context.FilterOptions.Remove(filterOption);

                await _context.SaveChangesAsync();

                _logger.LogInformation("Filter option deleted successfully: {FilterId}", id);

                return Ok(new AdminFilterOptionResponseDto
                {
                    Success = true,
                    Message = "Filter option deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting filter option {Id}", id);
                return StatusCode(500, new AdminFilterOptionResponseDto
                {
                    Success = false,
                    Message = "An error occurred while deleting the filter option"
                });
            }
        }

        /// <summary>
        /// Toggle filter option active status
        /// </summary>
        [HttpPatch("{id}/toggle-status")]
        public async Task<ActionResult<AdminFilterOptionResponseDto>> ToggleFilterOptionStatus(int id)
        {
            try
            {
                var filterOption = await _context.FilterOptions.FindAsync(id);
                if (filterOption == null)
                {
                    return NotFound(new AdminFilterOptionResponseDto
                    {
                        Success = false,
                        Message = "Filter option not found"
                    });
                }

                filterOption.IsActive = !filterOption.IsActive;
                await _context.SaveChangesAsync();

                _logger.LogInformation("Filter option status toggled: {FilterId} - Active: {IsActive}", id, filterOption.IsActive);

                return Ok(new AdminFilterOptionResponseDto
                {
                    Success = true,
                    Message = $"Filter option {(filterOption.IsActive ? "activated" : "deactivated")} successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling filter option status {Id}", id);
                return StatusCode(500, new AdminFilterOptionResponseDto
                {
                    Success = false,
                    Message = "An error occurred while updating the filter option status"
                });
            }
        }
    }
}
