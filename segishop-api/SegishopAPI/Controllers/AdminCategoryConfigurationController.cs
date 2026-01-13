using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class CategoryConfigurationController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<CategoryConfigurationController> _logger;

        public CategoryConfigurationController(SegishopDbContext context, ILogger<CategoryConfigurationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // =====================================================
        // Category Configuration Templates
        // =====================================================

        [HttpGet("templates")]
        public async Task<ActionResult<IEnumerable<CategoryConfigurationTemplateDto>>> GetAllCategoryConfigurationTemplates()
        {
            try
            {
                var templates = await _context.CategoryConfigurationTemplates
                    .Include(cct => cct.Category)
                    .Include(cct => cct.ConfigurationType)
                    .Where(cct => cct.IsActive)
                    .OrderBy(cct => cct.Category.Name)
                    .ThenBy(cct => cct.SortOrder)
                    .ToListAsync();

                var result = templates.Select(cct => new CategoryConfigurationTemplateDto
                {
                    Id = cct.Id,
                    CategoryId = cct.CategoryId,
                    CategoryName = cct.Category.Name,
                    ConfigurationTypeId = cct.ConfigurationTypeId,
                    ConfigurationTypeName = cct.ConfigurationType.Name,
                    ConfigurationType = cct.ConfigurationType.Type,
                    IsRequired = cct.IsRequired,
                    SortOrder = cct.SortOrder,
                    InheritToSubcategories = cct.InheritToSubcategories,
                    IsActive = cct.IsActive,
                    CreatedAt = cct.CreatedAt,
                    UpdatedAt = cct.UpdatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category configuration templates");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryTemplateDto>>> GetCategoryTemplates()
        {
            try
            {
                var categories = await _context.Categories
                    .Include(c => c.ConfigurationTemplates)
                        .ThenInclude(cct => cct.ConfigurationType)
                            .ThenInclude(ct => ct.Options)
                    .Where(c => c.IsActive)
                    .OrderBy(c => c.Name)
                    .ToListAsync();

                var result = categories.Select(c => new CategoryTemplateDto
                {
                    CategoryId = c.Id,
                    CategoryName = c.Name,
                    IsActive = c.IsActive,
                    InheritToSubcategories = c.ConfigurationTemplates.Any(cct => cct.InheritToSubcategories),
                    ProductsCount = c.Products.Count(p => p.IsActive),
                    Configurations = c.ConfigurationTemplates
                        .Where(cct => cct.IsActive)
                        .OrderBy(cct => cct.SortOrder)
                        .Select(cct => new TemplateConfigurationDto
                        {
                            ConfigurationTypeId = cct.ConfigurationTypeId,
                            Name = cct.ConfigurationType.Name,
                            Type = cct.ConfigurationType.Type,
                            IsRequired = cct.IsRequired,
                            ShowPriceImpact = cct.ConfigurationType.ShowPriceImpact,
                            SortOrder = cct.SortOrder,
                            IsActive = cct.IsActive,
                            Options = cct.ConfigurationType.Options
                                .Where(o => o.IsActive)
                                .OrderBy(o => o.SortOrder)
                                .Select(o => new ConfigurationOptionDto
                                {
                                    Id = o.Id,
                                    ConfigurationTypeId = o.ConfigurationTypeId,
                                    Name = o.Name,
                                    Value = o.Value,
                                    PriceModifier = o.PriceModifier,
                                    PriceType = o.PriceType,
                                    IsDefault = o.IsDefault,
                                    SortOrder = o.SortOrder,
                                    IsActive = o.IsActive,
                                    CreatedAt = o.CreatedAt,
                                    UpdatedAt = o.UpdatedAt
                                }).ToList()
                        }).ToList()
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category templates");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("categories/{categoryId}")]
        public async Task<ActionResult<CategoryTemplateDto>> GetCategoryTemplate(int categoryId)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.ConfigurationTemplates)
                        .ThenInclude(cct => cct.ConfigurationType)
                            .ThenInclude(ct => ct.Options)
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == categoryId);

                if (category == null)
                {
                    return NotFound();
                }

                var result = new CategoryTemplateDto
                {
                    CategoryId = category.Id,
                    CategoryName = category.Name,
                    IsActive = category.IsActive,
                    InheritToSubcategories = category.ConfigurationTemplates.Any(cct => cct.InheritToSubcategories),
                    ProductsCount = category.Products.Count(p => p.IsActive),
                    Configurations = category.ConfigurationTemplates
                        .Where(cct => cct.IsActive)
                        .OrderBy(cct => cct.SortOrder)
                        .Select(cct => new TemplateConfigurationDto
                        {
                            ConfigurationTypeId = cct.ConfigurationTypeId,
                            Name = cct.ConfigurationType.Name,
                            Type = cct.ConfigurationType.Type,
                            IsRequired = cct.IsRequired,
                            ShowPriceImpact = cct.ConfigurationType.ShowPriceImpact,
                            SortOrder = cct.SortOrder,
                            IsActive = cct.IsActive,
                            Options = cct.ConfigurationType.Options
                                .Where(o => o.IsActive)
                                .OrderBy(o => o.SortOrder)
                                .Select(o => new ConfigurationOptionDto
                                {
                                    Id = o.Id,
                                    ConfigurationTypeId = o.ConfigurationTypeId,
                                    Name = o.Name,
                                    Value = o.Value,
                                    PriceModifier = o.PriceModifier,
                                    PriceType = o.PriceType,
                                    IsDefault = o.IsDefault,
                                    SortOrder = o.SortOrder,
                                    IsActive = o.IsActive,
                                    CreatedAt = o.CreatedAt,
                                    UpdatedAt = o.UpdatedAt
                                }).ToList()
                        }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category template for category {CategoryId}", categoryId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("templates")]
        public async Task<ActionResult<CategoryConfigurationTemplateDto>> CreateCategoryConfigurationTemplate(CreateCategoryConfigurationTemplateDto dto)
        {
            try
            {
                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);
                if (!categoryExists)
                {
                    return BadRequest("Category not found");
                }

                // Check if configuration type exists
                var configurationTypeExists = await _context.ConfigurationTypes.AnyAsync(ct => ct.Id == dto.ConfigurationTypeId && ct.IsActive);
                if (!configurationTypeExists)
                {
                    return BadRequest("Configuration type not found");
                }

                // Check if active template already exists
                var existingTemplate = await _context.CategoryConfigurationTemplates
                    .Include(cct => cct.Category)
                    .Include(cct => cct.ConfigurationType)
                    .FirstOrDefaultAsync(cct => cct.CategoryId == dto.CategoryId && cct.ConfigurationTypeId == dto.ConfigurationTypeId && cct.IsActive);

                if (existingTemplate != null)
                {
                    return BadRequest($"Configuration template already exists: '{existingTemplate.ConfigurationType.Name}' is already assigned to category '{existingTemplate.Category.Name}'");
                }

                var template = new CategoryConfigurationTemplate
                {
                    CategoryId = dto.CategoryId,
                    ConfigurationTypeId = dto.ConfigurationTypeId,
                    IsRequired = dto.IsRequired,
                    SortOrder = dto.SortOrder,
                    InheritToSubcategories = dto.InheritToSubcategories,
                    IsActive = dto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.CategoryConfigurationTemplates.Add(template);
                await _context.SaveChangesAsync();

                // Load the created template with related data
                var createdTemplate = await _context.CategoryConfigurationTemplates
                    .Include(cct => cct.Category)
                    .Include(cct => cct.ConfigurationType)
                    .FirstOrDefaultAsync(cct => cct.Id == template.Id);

                var result = new CategoryConfigurationTemplateDto
                {
                    Id = createdTemplate!.Id,
                    CategoryId = createdTemplate.CategoryId,
                    CategoryName = createdTemplate.Category.Name,
                    ConfigurationTypeId = createdTemplate.ConfigurationTypeId,
                    ConfigurationTypeName = createdTemplate.ConfigurationType.Name,
                    IsRequired = createdTemplate.IsRequired,
                    SortOrder = createdTemplate.SortOrder,
                    InheritToSubcategories = createdTemplate.InheritToSubcategories,
                    IsActive = createdTemplate.IsActive,
                    CreatedAt = createdTemplate.CreatedAt,
                    UpdatedAt = createdTemplate.UpdatedAt
                };

                return CreatedAtAction(nameof(GetCategoryTemplate), new { categoryId = template.CategoryId }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category configuration template");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("templates/{id}")]
        public async Task<IActionResult> UpdateCategoryConfigurationTemplate(int id, UpdateCategoryConfigurationTemplateDto dto)
        {
            try
            {
                var template = await _context.CategoryConfigurationTemplates.FindAsync(id);
                if (template == null)
                {
                    return NotFound();
                }

                template.IsRequired = dto.IsRequired;
                template.SortOrder = dto.SortOrder;
                template.InheritToSubcategories = dto.InheritToSubcategories;
                template.IsActive = dto.IsActive;
                template.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category configuration template {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("templates/{id}")]
        public async Task<IActionResult> DeleteCategoryConfigurationTemplate(int id)
        {
            try
            {
                var template = await _context.CategoryConfigurationTemplates.FindAsync(id);
                if (template == null)
                {
                    return NotFound();
                }

                _context.CategoryConfigurationTemplates.Remove(template);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category configuration template {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("available-types/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ConfigurationTypeDto>>> GetAvailableConfigurationTypes(int categoryId)
        {
            try
            {
                // Get configuration types that are not already assigned to this category
                var assignedTypeIds = await _context.CategoryConfigurationTemplates
                    .Where(cct => cct.CategoryId == categoryId && cct.IsActive)
                    .Select(cct => cct.ConfigurationTypeId)
                    .ToListAsync();

                var availableTypes = await _context.ConfigurationTypes
                    .Include(ct => ct.Options)
                    .Where(ct => ct.IsActive && !assignedTypeIds.Contains(ct.Id))
                    .OrderBy(ct => ct.Name)
                    .ToListAsync();

                var result = availableTypes.Select(ct => new ConfigurationTypeDto
                {
                    Id = ct.Id,
                    Name = ct.Name,
                    Type = ct.Type,
                    Description = ct.Description,
                    IsRequired = ct.IsRequired,
                    ShowPriceImpact = ct.ShowPriceImpact,
                    SortOrder = ct.SortOrder,
                    IsActive = ct.IsActive,
                    CreatedAt = ct.CreatedAt,
                    UpdatedAt = ct.UpdatedAt,
                    Options = ct.Options.Where(o => o.IsActive).OrderBy(o => o.SortOrder).Select(o => new ConfigurationOptionDto
                    {
                        Id = o.Id,
                        ConfigurationTypeId = o.ConfigurationTypeId,
                        Name = o.Name,
                        Value = o.Value,
                        PriceModifier = o.PriceModifier,
                        PriceType = o.PriceType,
                        IsDefault = o.IsDefault,
                        SortOrder = o.SortOrder,
                        IsActive = o.IsActive,
                        CreatedAt = o.CreatedAt,
                        UpdatedAt = o.UpdatedAt
                    }).ToList(),
                    UsedInCategories = new List<string>()
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving available configuration types for category {CategoryId}", categoryId);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
