using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/shipping")]
    public class AdminShippingController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminShippingController> _logger;

        public AdminShippingController(SegishopDbContext context, ILogger<AdminShippingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get shipping overview statistics
        /// </summary>
        [HttpGet("overview")]
        public async Task<ActionResult<AdminShippingOverviewDto>> GetShippingOverview()
        {
            try
            {
                var overview = new AdminShippingOverviewDto
                {
                    TotalZones = await _context.ShippingZones.CountAsync(),
                    ActiveZones = await _context.ShippingZones.CountAsync(z => z.IsEnabled),
                    TotalMethods = await _context.ShippingMethods.CountAsync(),
                    ActiveMethods = await _context.ShippingMethods.CountAsync(m => m.IsEnabled),
                    TotalClasses = await _context.ShippingClasses.CountAsync(),
                    TotalClassCosts = await _context.ShippingClassCosts.CountAsync(),
                    ProductsWithShippingClass = await _context.Products.CountAsync(p => p.ShippingClassId != null),
                    ProductsWithoutShippingClass = await _context.Products.CountAsync(p => p.ShippingClassId == null)
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping overview");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        #region Shipping Zones

        /// <summary>
        /// Get all shipping zones for admin
        /// </summary>
        [HttpGet("zones")]
        public async Task<ActionResult<AdminShippingZonesResponseDto>> GetShippingZones()
        {
            try
            {
                var zones = await _context.ShippingZones
                    .Include(z => z.Regions)
                    .Include(z => z.Methods)
                        .ThenInclude(m => m.ShippingMethod)
                    .OrderBy(z => z.SortOrder)
                    .ThenBy(z => z.Name)
                    .Select(z => new AdminShippingZoneDto
                    {
                        Id = z.Id,
                        Name = z.Name,
                        Description = z.Description,
                        IsEnabled = z.IsEnabled,
                        SortOrder = z.SortOrder,
                        CreatedAt = z.CreatedAt,
                        UpdatedAt = z.UpdatedAt,
                        RegionCount = z.Regions.Count,
                        MethodCount = z.Methods.Count,
                        Regions = z.Regions.Select(r => new AdminShippingZoneRegionDto
                        {
                            Id = r.Id,
                            RegionType = r.RegionType,
                            RegionCode = r.RegionCode,
                            RegionName = r.RegionName,
                            IsIncluded = r.IsIncluded,
                            Priority = r.Priority
                        }).ToList(),
                        Methods = z.Methods.Select(m => new AdminShippingZoneMethodDto
                        {
                            Id = m.Id,
                            ShippingMethodId = m.ShippingMethodId,
                            ShippingMethodName = m.ShippingMethod.Name,
                            Title = m.Title,
                            IsEnabled = m.IsEnabled,
                            SortOrder = m.SortOrder,
                            BaseCost = m.BaseCost,
                            MinOrderAmount = m.MinOrderAmount,
                            EstimatedDaysMin = m.EstimatedDaysMin,
                            EstimatedDaysMax = m.EstimatedDaysMax
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(new AdminShippingZonesResponseDto
                {
                    Success = true,
                    Zones = zones,
                    TotalCount = zones.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping zones");
                return StatusCode(500, new AdminShippingZonesResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Get shipping zone by ID
        /// </summary>
        [HttpGet("zones/{id}")]
        public async Task<ActionResult<AdminShippingZoneResponseDto>> GetShippingZone(int id)
        {
            try
            {
                var zone = await _context.ShippingZones
                    .Include(z => z.Regions)
                    .Include(z => z.Methods)
                        .ThenInclude(m => m.ShippingMethod)
                    .Include(z => z.Methods)
                        .ThenInclude(m => m.ClassCosts)
                            .ThenInclude(cc => cc.ShippingClass)
                    .Where(z => z.Id == id)
                    .Select(z => new AdminShippingZoneDto
                    {
                        Id = z.Id,
                        Name = z.Name,
                        Description = z.Description,
                        IsEnabled = z.IsEnabled,
                        SortOrder = z.SortOrder,
                        CreatedAt = z.CreatedAt,
                        UpdatedAt = z.UpdatedAt,
                        RegionCount = z.Regions.Count,
                        MethodCount = z.Methods.Count,
                        Regions = z.Regions.Select(r => new AdminShippingZoneRegionDto
                        {
                            Id = r.Id,
                            RegionType = r.RegionType,
                            RegionCode = r.RegionCode,
                            RegionName = r.RegionName,
                            IsIncluded = r.IsIncluded,
                            Priority = r.Priority
                        }).ToList(),
                        Methods = z.Methods.Select(m => new AdminShippingZoneMethodDto
                        {
                            Id = m.Id,
                            ShippingMethodId = m.ShippingMethodId,
                            ShippingMethodName = m.ShippingMethod.Name,
                            Title = m.Title,
                            IsEnabled = m.IsEnabled,
                            SortOrder = m.SortOrder,
                            BaseCost = m.BaseCost,
                            MinOrderAmount = m.MinOrderAmount,
                            EstimatedDaysMin = m.EstimatedDaysMin,
                            EstimatedDaysMax = m.EstimatedDaysMax,
                            ClassCosts = m.ClassCosts.Select(cc => new AdminShippingClassCostDto
                            {
                                Id = cc.Id,
                                ShippingZoneMethodId = cc.ShippingZoneMethodId,
                                ShippingClassId = cc.ShippingClassId,
                                ShippingClassName = cc.ShippingClass.Name,
                                Cost = cc.Cost,
                                CostType = cc.CostType
                            }).ToList()
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (zone == null)
                {
                    return NotFound(new AdminShippingZoneResponseDto
                    {
                        Success = false,
                        Message = "Shipping zone not found"
                    });
                }

                return Ok(new AdminShippingZoneResponseDto
                {
                    Success = true,
                    Zone = zone
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping zone {ZoneId}", id);
                return StatusCode(500, new AdminShippingZoneResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create new shipping zone
        /// </summary>
        [HttpPost("zones")]
        public async Task<ActionResult<AdminShippingZoneResponseDto>> CreateShippingZone([FromBody] CreateAdminShippingZoneDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminShippingZoneResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                // Check if zone name already exists
                var existingZone = await _context.ShippingZones
                    .FirstOrDefaultAsync(z => z.Name.ToLower() == request.Name.ToLower());

                if (existingZone != null)
                {
                    return BadRequest(new AdminShippingZoneResponseDto
                    {
                        Success = false,
                        Message = "A shipping zone with this name already exists"
                    });
                }

                var zone = new ShippingZone
                {
                    Name = request.Name,
                    Description = request.Description,
                    IsEnabled = request.IsEnabled,
                    SortOrder = request.SortOrder,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ShippingZones.Add(zone);
                await _context.SaveChangesAsync();

                var createdZone = new AdminShippingZoneDto
                {
                    Id = zone.Id,
                    Name = zone.Name,
                    Description = zone.Description,
                    IsEnabled = zone.IsEnabled,
                    SortOrder = zone.SortOrder,
                    CreatedAt = zone.CreatedAt,
                    UpdatedAt = zone.UpdatedAt,
                    RegionCount = 0,
                    MethodCount = 0,
                    Regions = new List<AdminShippingZoneRegionDto>(),
                    Methods = new List<AdminShippingZoneMethodDto>()
                };

                _logger.LogInformation("Shipping zone created successfully with ID: {ZoneId}", zone.Id);

                return Ok(new AdminShippingZoneResponseDto
                {
                    Success = true,
                    Zone = createdZone,
                    Message = "Shipping zone created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating shipping zone");
                return StatusCode(500, new AdminShippingZoneResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Update shipping zone
        /// </summary>
        [HttpPut("zones/{id}")]
        public async Task<ActionResult<AdminShippingZoneResponseDto>> UpdateShippingZone(int id, [FromBody] UpdateAdminShippingZoneDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminShippingZoneResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                var zone = await _context.ShippingZones.FindAsync(id);
                if (zone == null)
                {
                    return NotFound(new AdminShippingZoneResponseDto
                    {
                        Success = false,
                        Message = "Shipping zone not found"
                    });
                }

                // Check if zone name already exists (excluding current zone)
                var existingZone = await _context.ShippingZones
                    .FirstOrDefaultAsync(z => z.Name.ToLower() == request.Name.ToLower() && z.Id != id);

                if (existingZone != null)
                {
                    return BadRequest(new AdminShippingZoneResponseDto
                    {
                        Success = false,
                        Message = "A shipping zone with this name already exists"
                    });
                }

                zone.Name = request.Name;
                zone.Description = request.Description;
                zone.IsEnabled = request.IsEnabled;
                zone.SortOrder = request.SortOrder;
                zone.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var updatedZone = new AdminShippingZoneDto
                {
                    Id = zone.Id,
                    Name = zone.Name,
                    Description = zone.Description,
                    IsEnabled = zone.IsEnabled,
                    SortOrder = zone.SortOrder,
                    CreatedAt = zone.CreatedAt,
                    UpdatedAt = zone.UpdatedAt,
                    RegionCount = await _context.ShippingZoneRegions.CountAsync(r => r.ShippingZoneId == zone.Id),
                    MethodCount = await _context.ShippingZoneMethods.CountAsync(m => m.ShippingZoneId == zone.Id)
                };

                _logger.LogInformation("Shipping zone updated successfully with ID: {ZoneId}", zone.Id);

                return Ok(new AdminShippingZoneResponseDto
                {
                    Success = true,
                    Zone = updatedZone,
                    Message = "Shipping zone updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shipping zone {ZoneId}", id);
                return StatusCode(500, new AdminShippingZoneResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Delete shipping zone
        /// </summary>
        [HttpDelete("zones/{id}")]
        public async Task<ActionResult> DeleteShippingZone(int id)
        {
            try
            {
                var zone = await _context.ShippingZones
                    .Include(z => z.Methods)
                    .Include(z => z.Regions)
                    .FirstOrDefaultAsync(z => z.Id == id);

                if (zone == null)
                {
                    return NotFound(new { success = false, message = "Shipping zone not found" });
                }

                // Check if zone has any orders
                var hasOrders = await _context.Orders
                    .AnyAsync(o => zone.Methods.Any(m => m.Id == o.ShippingZoneMethodId));

                if (hasOrders)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = "Cannot delete shipping zone that has been used in orders. Disable it instead." 
                    });
                }

                _context.ShippingZones.Remove(zone);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping zone deleted successfully with ID: {ZoneId}", zone.Id);

                return Ok(new { 
                    success = true, 
                    message = "Shipping zone deleted successfully" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting shipping zone {ZoneId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Add region to shipping zone
        /// </summary>
        [HttpPost("zones/{zoneId}/regions")]
        public async Task<ActionResult> AddZoneRegion(int zoneId, [FromBody] CreateAdminShippingZoneRegionDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid model data" });
                }

                var zone = await _context.ShippingZones.FindAsync(zoneId);
                if (zone == null)
                {
                    return NotFound(new { success = false, message = "Shipping zone not found" });
                }

                var region = new ShippingZoneRegion
                {
                    ShippingZoneId = zoneId,
                    RegionType = request.RegionType,
                    RegionCode = request.RegionCode,
                    RegionName = request.RegionName,
                    IsIncluded = request.IsIncluded,
                    Priority = request.Priority
                };

                _context.ShippingZoneRegions.Add(region);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Region added to shipping zone {ZoneId}", zoneId);

                return Ok(new {
                    success = true,
                    message = "Region added successfully",
                    id = region.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding region to shipping zone {ZoneId}", zoneId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Remove region from shipping zone
        /// </summary>
        [HttpDelete("zones/{zoneId}/regions/{regionId}")]
        public async Task<ActionResult> RemoveZoneRegion(int zoneId, int regionId)
        {
            try
            {
                var region = await _context.ShippingZoneRegions
                    .FirstOrDefaultAsync(r => r.Id == regionId && r.ShippingZoneId == zoneId);

                if (region == null)
                {
                    return NotFound(new { success = false, message = "Region not found" });
                }

                _context.ShippingZoneRegions.Remove(region);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Region removed from shipping zone {ZoneId}", zoneId);

                return Ok(new {
                    success = true,
                    message = "Region removed successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing region from shipping zone {ZoneId}", zoneId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Add shipping method to zone
        /// </summary>
        [HttpPost("zones/{zoneId}/methods")]
        public async Task<ActionResult> AddZoneMethod(int zoneId, [FromBody] CreateAdminShippingZoneMethodDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid model data" });
                }

                var zone = await _context.ShippingZones.FindAsync(zoneId);
                if (zone == null)
                {
                    return NotFound(new { success = false, message = "Shipping zone not found" });
                }

                var method = await _context.ShippingMethods.FindAsync(request.ShippingMethodId);
                if (method == null)
                {
                    return NotFound(new { success = false, message = "Shipping method not found" });
                }

                // Check if this method is already assigned to this zone
                var existingAssignment = await _context.ShippingZoneMethods
                    .FirstOrDefaultAsync(zm => zm.ShippingZoneId == zoneId && zm.ShippingMethodId == request.ShippingMethodId);

                if (existingAssignment != null)
                {
                    return BadRequest(new { success = false, message = "This shipping method is already assigned to this zone" });
                }

                var zoneMethod = new ShippingZoneMethod
                {
                    ShippingZoneId = zoneId,
                    ShippingMethodId = request.ShippingMethodId,
                    Title = request.Title,
                    IsEnabled = request.IsEnabled,
                    SortOrder = request.SortOrder,
                    BaseCost = request.BaseCost,
                    MinOrderAmount = request.MinOrderAmount,
                    EstimatedDaysMin = request.EstimatedDaysMin,
                    EstimatedDaysMax = request.EstimatedDaysMax
                };

                _context.ShippingZoneMethods.Add(zoneMethod);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping method {MethodId} added to zone {ZoneId}", request.ShippingMethodId, zoneId);

                return Ok(new {
                    success = true,
                    message = "Shipping method added to zone successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding shipping method to zone {ZoneId}", zoneId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Remove shipping method from zone
        /// </summary>
        [HttpDelete("zones/{zoneId}/methods/{methodId}")]
        public async Task<ActionResult> RemoveZoneMethod(int zoneId, int methodId)
        {
            try
            {
                var zoneMethod = await _context.ShippingZoneMethods
                    .FirstOrDefaultAsync(zm => zm.ShippingZoneId == zoneId && zm.ShippingMethodId == methodId);

                if (zoneMethod == null)
                {
                    return NotFound(new { success = false, message = "Zone method assignment not found" });
                }

                // Check if this zone method is being used in any orders
                var hasOrders = await _context.Orders
                    .AnyAsync(o => o.ShippingZoneMethodId == zoneMethod.Id);

                if (hasOrders)
                {
                    return BadRequest(new {
                        success = false,
                        message = "Cannot remove shipping method from zone. It has been used in orders."
                    });
                }

                _context.ShippingZoneMethods.Remove(zoneMethod);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping method {MethodId} removed from zone {ZoneId}", methodId, zoneId);

                return Ok(new {
                    success = true,
                    message = "Shipping method removed from zone successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing shipping method from zone {ZoneId}", zoneId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        #endregion

        #region Shipping Methods

        /// <summary>
        /// Get all shipping methods for admin
        /// </summary>
        [HttpGet("methods")]
        public async Task<ActionResult<AdminShippingMethodsResponseDto>> GetShippingMethods()
        {
            try
            {
                var methods = await _context.ShippingMethods
                    .Include(m => m.ZoneMethods)
                    .OrderBy(m => m.Name)
                    .Select(m => new AdminShippingMethodDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        MethodType = m.MethodType,
                        Description = m.Description,
                        IsEnabled = m.IsEnabled,
                        IsTaxable = m.IsTaxable,
                        CreatedAt = m.CreatedAt,
                        UpdatedAt = m.UpdatedAt,
                        ZoneCount = m.ZoneMethods.Count
                    })
                    .ToListAsync();

                return Ok(new AdminShippingMethodsResponseDto
                {
                    Success = true,
                    Methods = methods,
                    TotalCount = methods.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping methods");
                return StatusCode(500, new AdminShippingMethodsResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Get shipping method by ID
        /// </summary>
        [HttpGet("methods/{id}")]
        public async Task<ActionResult<AdminShippingMethodResponseDto>> GetShippingMethod(int id)
        {
            try
            {
                var method = await _context.ShippingMethods
                    .Include(m => m.ZoneMethods)
                    .Where(m => m.Id == id)
                    .Select(m => new AdminShippingMethodDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        MethodType = m.MethodType,
                        Description = m.Description,
                        IsEnabled = m.IsEnabled,
                        IsTaxable = m.IsTaxable,
                        CreatedAt = m.CreatedAt,
                        UpdatedAt = m.UpdatedAt,
                        ZoneCount = m.ZoneMethods.Count
                    })
                    .FirstOrDefaultAsync();

                if (method == null)
                {
                    return NotFound(new AdminShippingMethodResponseDto
                    {
                        Success = false,
                        Message = "Shipping method not found"
                    });
                }

                return Ok(new AdminShippingMethodResponseDto
                {
                    Success = true,
                    Method = method
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping method {MethodId}", id);
                return StatusCode(500, new AdminShippingMethodResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create new shipping method
        /// </summary>
        [HttpPost("methods")]
        public async Task<ActionResult<AdminShippingMethodResponseDto>> CreateShippingMethod([FromBody] CreateAdminShippingMethodDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminShippingMethodResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                // Check if method name already exists
                var existingMethod = await _context.ShippingMethods
                    .FirstOrDefaultAsync(m => m.Name.ToLower() == request.Name.ToLower());

                if (existingMethod != null)
                {
                    return BadRequest(new AdminShippingMethodResponseDto
                    {
                        Success = false,
                        Message = "A shipping method with this name already exists"
                    });
                }

                var method = new ShippingMethod
                {
                    Name = request.Name,
                    MethodType = request.MethodType,
                    Description = request.Description,
                    IsEnabled = request.IsEnabled,
                    IsTaxable = request.IsTaxable,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ShippingMethods.Add(method);
                await _context.SaveChangesAsync();

                var createdMethod = new AdminShippingMethodDto
                {
                    Id = method.Id,
                    Name = method.Name,
                    MethodType = method.MethodType,
                    Description = method.Description,
                    IsEnabled = method.IsEnabled,
                    IsTaxable = method.IsTaxable,
                    CreatedAt = method.CreatedAt,
                    UpdatedAt = method.UpdatedAt,
                    ZoneCount = 0
                };

                _logger.LogInformation("Shipping method created successfully with ID: {MethodId}", method.Id);

                return Ok(new AdminShippingMethodResponseDto
                {
                    Success = true,
                    Method = createdMethod,
                    Message = "Shipping method created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating shipping method");
                return StatusCode(500, new AdminShippingMethodResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }



        /// <summary>
        /// Update shipping method
        /// </summary>
        [HttpPut("methods/{id}")]
        public async Task<ActionResult<AdminShippingMethodResponseDto>> UpdateShippingMethod(int id, [FromBody] UpdateAdminShippingMethodDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminShippingMethodResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                var method = await _context.ShippingMethods.FindAsync(id);
                if (method == null)
                {
                    return NotFound(new AdminShippingMethodResponseDto
                    {
                        Success = false,
                        Message = "Shipping method not found"
                    });
                }

                method.Name = request.Name;
                method.MethodType = request.MethodType;
                method.Description = request.Description;
                method.IsEnabled = request.IsEnabled;
                method.IsTaxable = request.IsTaxable;
                method.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var methodDto = new AdminShippingMethodDto
                {
                    Id = method.Id,
                    Name = method.Name,
                    MethodType = method.MethodType,
                    Description = method.Description,
                    IsEnabled = method.IsEnabled,
                    IsTaxable = method.IsTaxable,
                    CreatedAt = method.CreatedAt,
                    UpdatedAt = method.UpdatedAt,
                    ZoneCount = await _context.ShippingZoneMethods.CountAsync(zm => zm.ShippingMethodId == id)
                };

                _logger.LogInformation("Shipping method updated with ID {MethodId}", id);

                return Ok(new AdminShippingMethodResponseDto
                {
                    Success = true,
                    Message = "Shipping method updated successfully",
                    Method = methodDto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shipping method {MethodId}", id);
                return StatusCode(500, new AdminShippingMethodResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Delete shipping method
        /// </summary>
        [HttpDelete("methods/{id}")]
        public async Task<ActionResult> DeleteShippingMethod(int id)
        {
            try
            {
                var method = await _context.ShippingMethods
                    .Include(m => m.ZoneMethods)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (method == null)
                {
                    return NotFound(new { success = false, message = "Shipping method not found" });
                }

                // Check if method is being used in any zones
                if (method.ZoneMethods.Any())
                {
                    return BadRequest(new {
                        success = false,
                        message = $"Cannot delete shipping method. It is being used in {method.ZoneMethods.Count} zone(s)."
                    });
                }

                _context.ShippingMethods.Remove(method);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping method deleted with ID {MethodId}", id);

                return Ok(new {
                    success = true,
                    message = "Shipping method deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting shipping method {MethodId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        #endregion

        #region Shipping Classes

        /// <summary>
        /// Get all shipping classes for admin
        /// </summary>
        [HttpGet("classes")]
        public async Task<ActionResult<AdminShippingClassesResponseDto>> GetShippingClasses()
        {
            try
            {
                var classes = await _context.ShippingClasses
                    .Include(c => c.Products)
                    .Include(c => c.ClassCosts)
                        .ThenInclude(cc => cc.ShippingZoneMethod)
                            .ThenInclude(zm => zm.ShippingZone)
                    .Include(c => c.ClassCosts)
                        .ThenInclude(cc => cc.ShippingZoneMethod)
                            .ThenInclude(zm => zm.ShippingMethod)
                    .OrderBy(c => c.Name)
                    .Select(c => new AdminShippingClassDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Slug = c.Slug,
                        Description = c.Description,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        ProductCount = c.Products.Count,
                        ClassCosts = c.ClassCosts.Select(cc => new AdminShippingClassCostDto
                        {
                            Id = cc.Id,
                            ShippingZoneMethodId = cc.ShippingZoneMethodId,
                            ShippingClassId = cc.ShippingClassId,
                            ShippingZoneName = cc.ShippingZoneMethod.ShippingZone.Name,
                            ShippingMethodName = cc.ShippingZoneMethod.ShippingMethod.Name,
                            ShippingClassName = c.Name,
                            Cost = cc.Cost,
                            CostType = cc.CostType
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(new AdminShippingClassesResponseDto
                {
                    Success = true,
                    Classes = classes,
                    TotalCount = classes.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping classes");
                return StatusCode(500, new AdminShippingClassesResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Get shipping class by ID
        /// </summary>
        [HttpGet("classes/{id}")]
        public async Task<ActionResult<AdminShippingClassResponseDto>> GetShippingClass(int id)
        {
            try
            {
                var shippingClass = await _context.ShippingClasses
                    .Include(c => c.Products)
                    .Include(c => c.ClassCosts)
                        .ThenInclude(cc => cc.ShippingZoneMethod)
                            .ThenInclude(zm => zm.ShippingZone)
                    .Include(c => c.ClassCosts)
                        .ThenInclude(cc => cc.ShippingZoneMethod)
                            .ThenInclude(zm => zm.ShippingMethod)
                    .Where(c => c.Id == id)
                    .Select(c => new AdminShippingClassDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Slug = c.Slug,
                        Description = c.Description,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        ProductCount = c.Products.Count,
                        ClassCosts = c.ClassCosts.Select(cc => new AdminShippingClassCostDto
                        {
                            Id = cc.Id,
                            ShippingZoneMethodId = cc.ShippingZoneMethodId,
                            ShippingClassId = cc.ShippingClassId,
                            ShippingZoneName = cc.ShippingZoneMethod.ShippingZone.Name,
                            ShippingMethodName = cc.ShippingZoneMethod.ShippingMethod.Name,
                            ShippingClassName = c.Name,
                            Cost = cc.Cost,
                            CostType = cc.CostType
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (shippingClass == null)
                {
                    return NotFound(new AdminShippingClassResponseDto
                    {
                        Success = false,
                        Message = "Shipping class not found"
                    });
                }

                return Ok(new AdminShippingClassResponseDto
                {
                    Success = true,
                    Class = shippingClass
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping class {ClassId}", id);
                return StatusCode(500, new AdminShippingClassResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create new shipping class
        /// </summary>
        [HttpPost("classes")]
        public async Task<ActionResult<AdminShippingClassResponseDto>> CreateShippingClass([FromBody] CreateAdminShippingClassDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminShippingClassResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                // Check if class name or slug already exists
                var existingClass = await _context.ShippingClasses
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == request.Name.ToLower() ||
                                            c.Slug.ToLower() == request.Slug.ToLower());

                if (existingClass != null)
                {
                    return BadRequest(new AdminShippingClassResponseDto
                    {
                        Success = false,
                        Message = "A shipping class with this name or slug already exists"
                    });
                }

                var shippingClass = new ShippingClass
                {
                    Name = request.Name,
                    Slug = request.Slug,
                    Description = request.Description,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ShippingClasses.Add(shippingClass);
                await _context.SaveChangesAsync();

                var createdClass = new AdminShippingClassDto
                {
                    Id = shippingClass.Id,
                    Name = shippingClass.Name,
                    Slug = shippingClass.Slug,
                    Description = shippingClass.Description,
                    CreatedAt = shippingClass.CreatedAt,
                    UpdatedAt = shippingClass.UpdatedAt,
                    ProductCount = 0,
                    ClassCosts = new List<AdminShippingClassCostDto>()
                };

                _logger.LogInformation("Shipping class created successfully with ID: {ClassId}", shippingClass.Id);

                return Ok(new AdminShippingClassResponseDto
                {
                    Success = true,
                    Class = createdClass,
                    Message = "Shipping class created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating shipping class");
                return StatusCode(500, new AdminShippingClassResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Update shipping class
        /// </summary>
        [HttpPut("classes/{id}")]
        public async Task<ActionResult<AdminShippingClassResponseDto>> UpdateShippingClass(int id, [FromBody] UpdateAdminShippingClassDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminShippingClassResponseDto
                    {
                        Success = false,
                        Message = "Invalid model data"
                    });
                }

                var shippingClass = await _context.ShippingClasses.FindAsync(id);
                if (shippingClass == null)
                {
                    return NotFound(new AdminShippingClassResponseDto
                    {
                        Success = false,
                        Message = "Shipping class not found"
                    });
                }

                // Check if name or slug already exists (excluding current class)
                var existingClass = await _context.ShippingClasses
                    .FirstOrDefaultAsync(c => c.Id != id &&
                                            (c.Name.ToLower() == request.Name.ToLower() ||
                                             c.Slug.ToLower() == request.Slug.ToLower()));

                if (existingClass != null)
                {
                    return BadRequest(new AdminShippingClassResponseDto
                    {
                        Success = false,
                        Message = "A shipping class with this name or slug already exists"
                    });
                }

                shippingClass.Name = request.Name;
                shippingClass.Slug = request.Slug;
                shippingClass.Description = request.Description;
                shippingClass.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var updatedClass = new AdminShippingClassDto
                {
                    Id = shippingClass.Id,
                    Name = shippingClass.Name,
                    Slug = shippingClass.Slug,
                    Description = shippingClass.Description,
                    CreatedAt = shippingClass.CreatedAt,
                    UpdatedAt = shippingClass.UpdatedAt,
                    ProductCount = await _context.Products.CountAsync(p => p.ShippingClassId == id),
                    ClassCosts = new List<AdminShippingClassCostDto>()
                };

                _logger.LogInformation("Shipping class updated with ID {ClassId}", id);

                return Ok(new AdminShippingClassResponseDto
                {
                    Success = true,
                    Message = "Shipping class updated successfully",
                    Class = updatedClass
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shipping class {ClassId}", id);
                return StatusCode(500, new AdminShippingClassResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Delete shipping class
        /// </summary>
        [HttpDelete("classes/{id}")]
        public async Task<ActionResult> DeleteShippingClass(int id)
        {
            try
            {
                var shippingClass = await _context.ShippingClasses
                    .Include(c => c.Products)
                    .Include(c => c.ClassCosts)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (shippingClass == null)
                {
                    return NotFound(new { success = false, message = "Shipping class not found" });
                }

                // Check if class is being used by products
                if (shippingClass.Products.Any())
                {
                    return BadRequest(new {
                        success = false,
                        message = $"Cannot delete shipping class. It is assigned to {shippingClass.Products.Count} product(s)."
                    });
                }

                // Check if class has cost configurations
                if (shippingClass.ClassCosts.Any())
                {
                    return BadRequest(new {
                        success = false,
                        message = $"Cannot delete shipping class. It has {shippingClass.ClassCosts.Count} cost configuration(s)."
                    });
                }

                _context.ShippingClasses.Remove(shippingClass);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping class deleted with ID {ClassId}", id);

                return Ok(new {
                    success = true,
                    message = "Shipping class deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting shipping class {ClassId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        #endregion

        #region Shipping Class Costs

        /// <summary>
        /// Get all shipping class costs for admin
        /// </summary>
        [HttpGet("class-costs")]
        public async Task<ActionResult<AdminShippingClassCostsResponseDto>> GetShippingClassCosts(
            [FromQuery] int? shippingClassId = null,
            [FromQuery] int? shippingZoneId = null)
        {
            try
            {
                var query = _context.ShippingClassCosts
                    .Include(cc => cc.ShippingClass)
                    .Include(cc => cc.ShippingZoneMethod)
                        .ThenInclude(zm => zm.ShippingZone)
                    .Include(cc => cc.ShippingZoneMethod)
                        .ThenInclude(zm => zm.ShippingMethod)
                    .AsQueryable();

                if (shippingClassId.HasValue)
                {
                    query = query.Where(cc => cc.ShippingClassId == shippingClassId.Value);
                }

                if (shippingZoneId.HasValue)
                {
                    query = query.Where(cc => cc.ShippingZoneMethod.ShippingZoneId == shippingZoneId.Value);
                }

                var costs = await query
                    .OrderBy(cc => cc.ShippingClass.Name)
                    .ThenBy(cc => cc.ShippingZoneMethod.ShippingZone.SortOrder)
                    .Select(cc => new AdminShippingClassCostDto
                    {
                        Id = cc.Id,
                        ShippingZoneMethodId = cc.ShippingZoneMethodId,
                        ShippingClassId = cc.ShippingClassId,
                        ShippingZoneName = cc.ShippingZoneMethod.ShippingZone.Name,
                        ShippingMethodName = cc.ShippingZoneMethod.ShippingMethod.Name,
                        ShippingClassName = cc.ShippingClass.Name,
                        Cost = cc.Cost,
                        CostType = cc.CostType
                    })
                    .ToListAsync();

                return Ok(new AdminShippingClassCostsResponseDto
                {
                    Success = true,
                    Costs = costs,
                    TotalCount = costs.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipping class costs");
                return StatusCode(500, new AdminShippingClassCostsResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create new shipping class cost
        /// </summary>
        [HttpPost("class-costs")]
        public async Task<ActionResult> CreateShippingClassCost([FromBody] CreateAdminShippingClassCostDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid model data" });
                }

                // Check if zone method and class exist
                var zoneMethodExists = await _context.ShippingZoneMethods
                    .AnyAsync(zm => zm.Id == request.ShippingZoneMethodId);
                var classExists = await _context.ShippingClasses
                    .AnyAsync(c => c.Id == request.ShippingClassId);

                if (!zoneMethodExists)
                {
                    return BadRequest(new { success = false, message = "Shipping zone method not found" });
                }

                if (!classExists)
                {
                    return BadRequest(new { success = false, message = "Shipping class not found" });
                }

                // Check if cost already exists for this combination
                var existingCost = await _context.ShippingClassCosts
                    .FirstOrDefaultAsync(cc => cc.ShippingZoneMethodId == request.ShippingZoneMethodId &&
                                              cc.ShippingClassId == request.ShippingClassId);

                if (existingCost != null)
                {
                    return BadRequest(new {
                        success = false,
                        message = "A cost already exists for this shipping class and zone method combination"
                    });
                }

                var cost = new ShippingClassCost
                {
                    ShippingZoneMethodId = request.ShippingZoneMethodId,
                    ShippingClassId = request.ShippingClassId,
                    Cost = request.Cost,
                    CostType = request.CostType
                };

                _context.ShippingClassCosts.Add(cost);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping class cost created successfully with ID: {CostId}", cost.Id);

                return Ok(new {
                    success = true,
                    message = "Shipping class cost created successfully",
                    id = cost.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating shipping class cost");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Update shipping class cost
        /// </summary>
        [HttpPut("class-costs/{id}")]
        public async Task<ActionResult> UpdateShippingClassCost(int id, [FromBody] UpdateAdminShippingClassCostDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, message = "Invalid model data" });
                }

                var cost = await _context.ShippingClassCosts.FindAsync(id);
                if (cost == null)
                {
                    return NotFound(new { success = false, message = "Shipping class cost not found" });
                }

                cost.Cost = request.Cost;
                cost.CostType = request.CostType;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping class cost updated successfully with ID: {CostId}", cost.Id);

                return Ok(new {
                    success = true,
                    message = "Shipping class cost updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shipping class cost {CostId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete shipping class cost
        /// </summary>
        [HttpDelete("class-costs/{id}")]
        public async Task<ActionResult> DeleteShippingClassCost(int id)
        {
            try
            {
                var cost = await _context.ShippingClassCosts.FindAsync(id);
                if (cost == null)
                {
                    return NotFound(new { success = false, message = "Shipping class cost not found" });
                }

                _context.ShippingClassCosts.Remove(cost);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping class cost deleted successfully with ID: {CostId}", cost.Id);

                return Ok(new {
                    success = true,
                    message = "Shipping class cost deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting shipping class cost {CostId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        #endregion

        #region Product Assignments

        /// <summary>
        /// Get products assigned to a shipping class
        /// </summary>
        [HttpGet("classes/{classId}/products")]
        public async Task<ActionResult> GetClassProducts(int classId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var shippingClass = await _context.ShippingClasses.FindAsync(classId);
                if (shippingClass == null)
                {
                    return NotFound(new { success = false, message = "Shipping class not found" });
                }

                var query = _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.ShippingClassId == classId);

                var totalCount = await query.CountAsync();
                var products = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.SKU,
                        p.Price,
                        p.Stock,
                        p.ImageUrl,
                        CategoryName = p.Category.Name,
                        p.IsActive
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    products,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products for shipping class {ClassId}", classId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get products not assigned to any shipping class
        /// </summary>
        [HttpGet("products/unassigned")]
        public async Task<ActionResult> GetUnassignedProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? search = null)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.ShippingClassId == null);

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(p => p.Name.Contains(search) || (p.SKU != null && p.SKU.Contains(search)));
                }

                var totalCount = await query.CountAsync();
                var products = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.SKU,
                        p.Price,
                        p.Stock,
                        p.ImageUrl,
                        CategoryName = p.Category.Name,
                        p.IsActive
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    products,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unassigned products");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Assign products to a shipping class
        /// </summary>
        [HttpPost("classes/{classId}/products")]
        public async Task<ActionResult> AssignProductsToClass(int classId, [FromBody] AssignProductsToClassDto request)
        {
            try
            {
                var shippingClass = await _context.ShippingClasses.FindAsync(classId);
                if (shippingClass == null)
                {
                    return NotFound(new { success = false, message = "Shipping class not found" });
                }

                var products = await _context.Products
                    .Where(p => request.ProductIds.Contains(p.Id))
                    .ToListAsync();

                foreach (var product in products)
                {
                    product.ShippingClassId = classId;
                    product.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = $"Assigned {products.Count} products to shipping class" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning products to shipping class {ClassId}", classId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Remove products from a shipping class
        /// </summary>
        [HttpDelete("classes/{classId}/products")]
        public async Task<ActionResult> RemoveProductsFromClass(int classId, [FromBody] RemoveProductsFromClassDto request)
        {
            try
            {
                var products = await _context.Products
                    .Where(p => request.ProductIds.Contains(p.Id) && p.ShippingClassId == classId)
                    .ToListAsync();

                foreach (var product in products)
                {
                    product.ShippingClassId = null;
                    product.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = $"Removed {products.Count} products from shipping class" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing products from shipping class {ClassId}", classId);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        #endregion
    }

    // DTOs for product assignments
    public class AssignProductsToClassDto
    {
        public List<int> ProductIds { get; set; } = new();
    }

    public class RemoveProductsFromClassDto
    {
        public List<int> ProductIds { get; set; } = new();
    }
}
