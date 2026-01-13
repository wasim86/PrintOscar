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
    public class ConfigurationController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<ConfigurationController> _logger;

        public ConfigurationController(SegishopDbContext context, ILogger<ConfigurationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // =====================================================
        // Configuration Types CRUD
        // =====================================================

        [HttpGet("types")]
        public async Task<ActionResult<IEnumerable<ConfigurationTypeDto>>> GetConfigurationTypes()
        {
            try
            {
                var configurationTypes = await _context.ConfigurationTypes
                    .Include(ct => ct.Options)
                    .Include(ct => ct.CategoryTemplates)
                        .ThenInclude(cct => cct.Category)
                    .Where(ct => ct.IsActive)
                    .OrderBy(ct => ct.SortOrder)
                    .ThenBy(ct => ct.Name)
                    .ToListAsync();

                var result = configurationTypes.Select(ct => new ConfigurationTypeDto
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
                    UsedInCategories = ct.CategoryTemplates.Where(cct => cct.IsActive).Select(cct => cct.Category.Name).ToList()
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving configuration types");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("types/{id}")]
        public async Task<ActionResult<ConfigurationTypeDto>> GetConfigurationType(int id)
        {
            try
            {
                var configurationType = await _context.ConfigurationTypes
                    .Include(ct => ct.Options)
                    .Include(ct => ct.CategoryTemplates)
                        .ThenInclude(cct => cct.Category)
                    .FirstOrDefaultAsync(ct => ct.Id == id);

                if (configurationType == null)
                {
                    return NotFound();
                }

                var result = new ConfigurationTypeDto
                {
                    Id = configurationType.Id,
                    Name = configurationType.Name,
                    Type = configurationType.Type,
                    Description = configurationType.Description,
                    IsRequired = configurationType.IsRequired,
                    ShowPriceImpact = configurationType.ShowPriceImpact,
                    SortOrder = configurationType.SortOrder,
                    IsActive = configurationType.IsActive,
                    CreatedAt = configurationType.CreatedAt,
                    UpdatedAt = configurationType.UpdatedAt,
                    Options = configurationType.Options.Where(o => o.IsActive).OrderBy(o => o.SortOrder).Select(o => new ConfigurationOptionDto
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
                    UsedInCategories = configurationType.CategoryTemplates.Where(cct => cct.IsActive).Select(cct => cct.Category.Name).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving configuration type {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("types")]
        public async Task<ActionResult<ConfigurationTypeDto>> CreateConfigurationType(CreateConfigurationTypeDto dto)
        {
            try
            {
                var configurationType = new ConfigurationType
                {
                    Name = dto.Name,
                    Type = dto.Type,
                    Description = dto.Description,
                    IsRequired = dto.IsRequired,
                    ShowPriceImpact = dto.ShowPriceImpact,
                    SortOrder = dto.SortOrder,
                    IsActive = dto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ConfigurationTypes.Add(configurationType);
                await _context.SaveChangesAsync();

                var result = new ConfigurationTypeDto
                {
                    Id = configurationType.Id,
                    Name = configurationType.Name,
                    Type = configurationType.Type,
                    Description = configurationType.Description,
                    IsRequired = configurationType.IsRequired,
                    ShowPriceImpact = configurationType.ShowPriceImpact,
                    SortOrder = configurationType.SortOrder,
                    IsActive = configurationType.IsActive,
                    CreatedAt = configurationType.CreatedAt,
                    UpdatedAt = configurationType.UpdatedAt,
                    Options = new List<ConfigurationOptionDto>(),
                    UsedInCategories = new List<string>()
                };

                return CreatedAtAction(nameof(GetConfigurationType), new { id = configurationType.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating configuration type");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("types/{id}")]
        public async Task<IActionResult> UpdateConfigurationType(int id, UpdateConfigurationTypeDto dto)
        {
            try
            {
                var configurationType = await _context.ConfigurationTypes.FindAsync(id);
                if (configurationType == null)
                {
                    return NotFound();
                }

                configurationType.Name = dto.Name;
                configurationType.Type = dto.Type;
                configurationType.Description = dto.Description;
                configurationType.IsRequired = dto.IsRequired;
                configurationType.ShowPriceImpact = dto.ShowPriceImpact;
                configurationType.SortOrder = dto.SortOrder;
                configurationType.IsActive = dto.IsActive;
                configurationType.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating configuration type {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("types/{id}")]
        public async Task<IActionResult> DeleteConfigurationType(int id)
        {
            try
            {
                var configurationType = await _context.ConfigurationTypes.FindAsync(id);
                if (configurationType == null)
                {
                    return NotFound();
                }

                // Check if it's being used in any category templates
                var isUsed = await _context.CategoryConfigurationTemplates
                    .AnyAsync(cct => cct.ConfigurationTypeId == id && cct.IsActive);

                if (isUsed)
                {
                    return BadRequest("Cannot delete configuration type that is being used in category templates");
                }

                _context.ConfigurationTypes.Remove(configurationType);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting configuration type {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // =====================================================
        // Configuration Options CRUD
        // =====================================================

        [HttpGet("types/{configurationTypeId}/options")]
        public async Task<ActionResult<IEnumerable<ConfigurationOptionDto>>> GetConfigurationOptions(int configurationTypeId)
        {
            try
            {
                var options = await _context.ConfigurationOptions
                    .Where(o => o.ConfigurationTypeId == configurationTypeId && o.IsActive)
                    .OrderBy(o => o.SortOrder)
                    .ThenBy(o => o.Name)
                    .ToListAsync();

                var result = options.Select(o => new ConfigurationOptionDto
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
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving configuration options for type {ConfigurationTypeId}", configurationTypeId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("options")]
        public async Task<ActionResult<ConfigurationOptionDto>> CreateConfigurationOption(CreateConfigurationOptionDto dto)
        {
            try
            {
                // Verify the configuration type exists
                var configurationTypeExists = await _context.ConfigurationTypes
                    .AnyAsync(ct => ct.Id == dto.ConfigurationTypeId && ct.IsActive);

                if (!configurationTypeExists)
                {
                    return BadRequest("Configuration type not found");
                }

                var option = new ConfigurationOption
                {
                    ConfigurationTypeId = dto.ConfigurationTypeId,
                    Name = dto.Name,
                    Value = dto.Value,
                    PriceModifier = dto.PriceModifier,
                    PriceType = dto.PriceType,
                    IsDefault = dto.IsDefault,
                    SortOrder = dto.SortOrder,
                    IsActive = dto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ConfigurationOptions.Add(option);
                await _context.SaveChangesAsync();

                var result = new ConfigurationOptionDto
                {
                    Id = option.Id,
                    ConfigurationTypeId = option.ConfigurationTypeId,
                    Name = option.Name,
                    Value = option.Value,
                    PriceModifier = option.PriceModifier,
                    PriceType = option.PriceType,
                    IsDefault = option.IsDefault,
                    SortOrder = option.SortOrder,
                    IsActive = option.IsActive,
                    CreatedAt = option.CreatedAt,
                    UpdatedAt = option.UpdatedAt
                };

                return CreatedAtAction(nameof(GetConfigurationOptions), new { configurationTypeId = option.ConfigurationTypeId }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating configuration option");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("options/{id}")]
        public async Task<IActionResult> UpdateConfigurationOption(int id, UpdateConfigurationOptionDto dto)
        {
            try
            {
                var option = await _context.ConfigurationOptions.FindAsync(id);
                if (option == null)
                {
                    return NotFound();
                }

                option.Name = dto.Name;
                option.Value = dto.Value;
                option.PriceModifier = dto.PriceModifier;
                option.PriceType = dto.PriceType;
                option.IsDefault = dto.IsDefault;
                option.SortOrder = dto.SortOrder;
                option.IsActive = dto.IsActive;
                option.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating configuration option {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("options/{id}")]
        public async Task<IActionResult> DeleteConfigurationOption(int id)
        {
            try
            {
                var option = await _context.ConfigurationOptions.FindAsync(id);
                if (option == null)
                {
                    return NotFound();
                }

                _context.ConfigurationOptions.Remove(option);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting configuration option {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
