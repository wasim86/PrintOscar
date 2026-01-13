using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/product-configuration-overrides")]
    [Authorize(Roles = "Admin")]
    public class AdminProductConfigurationOverridesController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminProductConfigurationOverridesController> _logger;

        public AdminProductConfigurationOverridesController(SegishopDbContext context, ILogger<AdminProductConfigurationOverridesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // =====================================================
        // Product Configuration Overrides CRUD
        // =====================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductConfigurationOverrideDto>>> GetProductConfigurationOverrides()
        {
            try
            {
                var overrides = await _context.ProductConfigurationOverrides
                    .Include(pco => pco.Product)
                    .Include(pco => pco.ConfigurationType)
                    .Where(pco => pco.IsActive)
                    .OrderBy(pco => pco.Product.Name)
                    .ThenBy(pco => pco.ConfigurationType.SortOrder)
                    .ToListAsync();

                var result = overrides.Select(pco => new ProductConfigurationOverrideDto
                {
                    Id = pco.Id,
                    ProductId = pco.ProductId,
                    ProductName = pco.Product.Name,
                    ProductSku = pco.Product.SKU ?? "",
                    ConfigurationTypeId = pco.ConfigurationTypeId,
                    ConfigurationTypeName = pco.ConfigurationType.Name,
                    ConfigurationType = pco.ConfigurationType.Type,
                    OverrideType = pco.OverrideType,
                    CustomOptions = pco.CustomOptions,
                    IsActive = pco.IsActive,
                    CreatedAt = pco.CreatedAt,
                    UpdatedAt = pco.UpdatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product configuration overrides");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductConfigurationOverrideDto>>> GetProductOverrides(int productId)
        {
            try
            {
                var overrides = await _context.ProductConfigurationOverrides
                    .Include(pco => pco.Product)
                    .Include(pco => pco.ConfigurationType)
                    .Where(pco => pco.ProductId == productId && pco.IsActive)
                    .OrderBy(pco => pco.ConfigurationType.SortOrder)
                    .ToListAsync();

                var result = overrides.Select(pco => new ProductConfigurationOverrideDto
                {
                    Id = pco.Id,
                    ProductId = pco.ProductId,
                    ProductName = pco.Product.Name,
                    ProductSku = pco.Product.SKU ?? "",
                    ConfigurationTypeId = pco.ConfigurationTypeId,
                    ConfigurationTypeName = pco.ConfigurationType.Name,
                    ConfigurationType = pco.ConfigurationType.Type,
                    OverrideType = pco.OverrideType,
                    CustomOptions = pco.CustomOptions,
                    IsActive = pco.IsActive,
                    CreatedAt = pco.CreatedAt,
                    UpdatedAt = pco.UpdatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product overrides for product {ProductId}", productId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductConfigurationOverrideDto>> GetProductConfigurationOverride(int id)
        {
            try
            {
                var override_ = await _context.ProductConfigurationOverrides
                    .Include(pco => pco.Product)
                    .Include(pco => pco.ConfigurationType)
                    .FirstOrDefaultAsync(pco => pco.Id == id);

                if (override_ == null)
                {
                    return NotFound();
                }

                var result = new ProductConfigurationOverrideDto
                {
                    Id = override_.Id,
                    ProductId = override_.ProductId,
                    ProductName = override_.Product.Name,
                    ProductSku = override_.Product.SKU ?? "",
                    ConfigurationTypeId = override_.ConfigurationTypeId,
                    ConfigurationTypeName = override_.ConfigurationType.Name,
                    ConfigurationType = override_.ConfigurationType.Type,
                    OverrideType = override_.OverrideType,
                    CustomOptions = override_.CustomOptions,
                    IsActive = override_.IsActive,
                    CreatedAt = override_.CreatedAt,
                    UpdatedAt = override_.UpdatedAt
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product configuration override {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductConfigurationOverrideDto>> CreateProductConfigurationOverride(CreateProductConfigurationOverrideDto dto)
        {
            try
            {
                // Verify the product exists
                var productExists = await _context.Products
                    .AnyAsync(p => p.Id == dto.ProductId && p.IsActive);

                if (!productExists)
                {
                    return BadRequest("Product not found");
                }

                // Verify the configuration type exists
                var configurationTypeExists = await _context.ConfigurationTypes
                    .AnyAsync(ct => ct.Id == dto.ConfigurationTypeId && ct.IsActive);

                if (!configurationTypeExists)
                {
                    return BadRequest("Configuration type not found");
                }

                // Check if override already exists for this product and configuration type
                var existingOverride = await _context.ProductConfigurationOverrides
                    .FirstOrDefaultAsync(pco => pco.ProductId == dto.ProductId && pco.ConfigurationTypeId == dto.ConfigurationTypeId);

                if (existingOverride != null)
                {
                    return BadRequest("Override already exists for this product and configuration type");
                }

                var override_ = new ProductConfigurationOverride
                {
                    ProductId = dto.ProductId,
                    ConfigurationTypeId = dto.ConfigurationTypeId,
                    OverrideType = dto.OverrideType,
                    CustomOptions = dto.CustomOptions,
                    IsActive = dto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ProductConfigurationOverrides.Add(override_);
                await _context.SaveChangesAsync();

                // Reload with navigation properties
                var createdOverride = await _context.ProductConfigurationOverrides
                    .Include(pco => pco.Product)
                    .Include(pco => pco.ConfigurationType)
                    .FirstOrDefaultAsync(pco => pco.Id == override_.Id);

                var result = new ProductConfigurationOverrideDto
                {
                    Id = createdOverride!.Id,
                    ProductId = createdOverride.ProductId,
                    ProductName = createdOverride.Product.Name,
                    ProductSku = createdOverride.Product.SKU ?? "",
                    ConfigurationTypeId = createdOverride.ConfigurationTypeId,
                    ConfigurationTypeName = createdOverride.ConfigurationType.Name,
                    ConfigurationType = createdOverride.ConfigurationType.Type,
                    OverrideType = createdOverride.OverrideType,
                    CustomOptions = createdOverride.CustomOptions,
                    IsActive = createdOverride.IsActive,
                    CreatedAt = createdOverride.CreatedAt,
                    UpdatedAt = createdOverride.UpdatedAt
                };

                return CreatedAtAction(nameof(GetProductConfigurationOverride), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product configuration override");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductConfigurationOverride(int id, UpdateProductConfigurationOverrideDto dto)
        {
            try
            {
                var override_ = await _context.ProductConfigurationOverrides.FindAsync(id);
                if (override_ == null)
                {
                    return NotFound();
                }

                override_.OverrideType = dto.OverrideType;
                override_.CustomOptions = dto.CustomOptions;
                override_.IsActive = dto.IsActive;
                override_.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product configuration override {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductConfigurationOverride(int id)
        {
            try
            {
                var override_ = await _context.ProductConfigurationOverrides.FindAsync(id);
                if (override_ == null)
                {
                    return NotFound();
                }

                _context.ProductConfigurationOverrides.Remove(override_);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product configuration override {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // =====================================================
        // Product Override Summary and Merged Configurations
        // =====================================================

        [HttpGet("products-with-overrides")]
        public async Task<ActionResult<IEnumerable<ProductOverrideSummaryDto>>> GetProductsWithOverrides()
        {
            try
            {
                var productsWithOverrides = await _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.ConfigurationOverrides)
                        .ThenInclude(pco => pco.ConfigurationType)
                    .Where(p => p.IsActive && p.ConfigurationOverrides.Any(pco => pco.IsActive))
                    .OrderBy(p => p.Name)
                    .ToListAsync();

                var result = new List<ProductOverrideSummaryDto>();

                foreach (var product in productsWithOverrides)
                {
                    // Get category configurations
                    var categoryConfigurations = await _context.CategoryConfigurationTemplates
                        .Include(cct => cct.ConfigurationType)
                            .ThenInclude(ct => ct.Options)
                        .Where(cct => cct.CategoryId == product.CategoryId && cct.IsActive)
                        .Select(cct => cct.ConfigurationType)
                        .ToListAsync();

                    var categoryConfigDtos = categoryConfigurations.Select(ct => new ConfigurationTypeDto
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
                        Options = ct.Options.Select(o => new ConfigurationOptionDto
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
                    }).ToList();

                    var overrideDtos = product.ConfigurationOverrides
                        .Where(pco => pco.IsActive)
                        .Select(pco => new ProductConfigurationOverrideDto
                        {
                            Id = pco.Id,
                            ProductId = pco.ProductId,
                            ProductName = product.Name,
                            ProductSku = product.SKU ?? "",
                            ConfigurationTypeId = pco.ConfigurationTypeId,
                            ConfigurationTypeName = pco.ConfigurationType.Name,
                            ConfigurationType = pco.ConfigurationType.Type,
                            OverrideType = pco.OverrideType,
                            CustomOptions = pco.CustomOptions,
                            IsActive = pco.IsActive,
                            CreatedAt = pco.CreatedAt,
                            UpdatedAt = pco.UpdatedAt
                        }).ToList();

                    result.Add(new ProductOverrideSummaryDto
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        ProductSku = product.SKU ?? "",
                        CategoryName = product.Category.Name,
                        CategoryConfigurationsCount = categoryConfigDtos.Count,
                        ProductOverridesCount = overrideDtos.Count,
                        Overrides = overrideDtos,
                        CategoryConfigurations = categoryConfigDtos
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products with overrides");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("merged-configuration/{productId}")]
        public async Task<ActionResult<MergedProductConfigurationDto>> GetMergedProductConfiguration(int productId)
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
                    return NotFound("Product not found");
                }

                // Get category configurations
                var categoryConfigurations = await _context.CategoryConfigurationTemplates
                    .Include(cct => cct.ConfigurationType)
                        .ThenInclude(ct => ct.Options)
                    .Where(cct => cct.CategoryId == product.CategoryId && cct.IsActive)
                    .OrderBy(cct => cct.SortOrder)
                    .ToListAsync();

                var mergedConfigurations = new List<ProductConfigurationItemDto>();

                // Process category configurations
                foreach (var categoryConfig in categoryConfigurations)
                {
                    var ct = categoryConfig.ConfigurationType;

                    // Check if there's a product override for this configuration type
                    var productOverride = product.ConfigurationOverrides
                        .FirstOrDefault(pco => pco.ConfigurationTypeId == ct.Id && pco.IsActive);

                    if (productOverride != null)
                    {
                        // Use product override
                        if (productOverride.OverrideType != "disabled")
                        {
                            mergedConfigurations.Add(new ProductConfigurationItemDto
                            {
                                ConfigurationTypeId = ct.Id,
                                Name = ct.Name,
                                Type = ct.Type,
                                Source = "override",
                                OverrideType = productOverride.OverrideType,
                                IsRequired = categoryConfig.IsRequired,
                                ShowPriceImpact = ct.ShowPriceImpact,
                                SortOrder = categoryConfig.SortOrder,
                                IsActive = ct.IsActive,
                                Options = productOverride.OverrideType == "custom" && !string.IsNullOrEmpty(productOverride.CustomOptions)
                                    ? new List<ConfigurationOptionDto>() // Custom options would be parsed from JSON
                                    : ct.Options.Select(o => new ConfigurationOptionDto
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
                                CustomOptions = productOverride.CustomOptions
                            });
                        }
                        // If override type is "disabled", skip this configuration
                    }
                    else
                    {
                        // Use category configuration (inherit)
                        mergedConfigurations.Add(new ProductConfigurationItemDto
                        {
                            ConfigurationTypeId = ct.Id,
                            Name = ct.Name,
                            Type = ct.Type,
                            Source = "category",
                            OverrideType = "inherit",
                            IsRequired = categoryConfig.IsRequired,
                            ShowPriceImpact = ct.ShowPriceImpact,
                            SortOrder = categoryConfig.SortOrder,
                            IsActive = ct.IsActive,
                            Options = ct.Options.Select(o => new ConfigurationOptionDto
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
                        });
                    }
                }

                // Add product-only overrides (configurations not in category)
                var productOnlyOverrides = product.ConfigurationOverrides
                    .Where(pco => pco.IsActive &&
                                  pco.OverrideType != "disabled" &&
                                  !categoryConfigurations.Any(cc => cc.ConfigurationTypeId == pco.ConfigurationTypeId))
                    .ToList();

                foreach (var productOverride in productOnlyOverrides)
                {
                    var ct = productOverride.ConfigurationType;
                    mergedConfigurations.Add(new ProductConfigurationItemDto
                    {
                        ConfigurationTypeId = ct.Id,
                        Name = ct.Name,
                        Type = ct.Type,
                        Source = "override",
                        OverrideType = productOverride.OverrideType,
                        IsRequired = false, // Product-only overrides are typically optional
                        ShowPriceImpact = ct.ShowPriceImpact,
                        SortOrder = ct.SortOrder,
                        IsActive = ct.IsActive,
                        Options = productOverride.OverrideType == "custom" && !string.IsNullOrEmpty(productOverride.CustomOptions)
                            ? new List<ConfigurationOptionDto>() // Custom options would be parsed from JSON
                            : ct.Options.Select(o => new ConfigurationOptionDto
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
                        CustomOptions = productOverride.CustomOptions
                    });
                }

                var result = new MergedProductConfigurationDto
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Configurations = mergedConfigurations.OrderBy(c => c.SortOrder).ThenBy(c => c.Name).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving merged product configuration for product {ProductId}", productId);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
