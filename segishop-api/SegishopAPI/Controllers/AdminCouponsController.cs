using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;
using System.Security.Claims;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class CouponsController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<CouponsController> _logger;

        public CouponsController(SegishopDbContext context, ILogger<CouponsController> logger)
        {
            _context = context;
            _logger = logger;
        }



        /// <summary>
        /// Get all coupons with pagination and filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<CouponsResponseDto>> GetCoupons(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] CouponType? type = null)
        {
            try
            {
                var query = _context.Coupons.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(c => c.Code.Contains(search) || c.Description.Contains(search));
                }

                if (isActive.HasValue)
                {
                    query = query.Where(c => c.IsActive == isActive.Value);
                }

                if (type.HasValue)
                {
                    query = query.Where(c => c.Type == type.Value);
                }

                var totalCount = await query.CountAsync();

                var coupons = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new CouponDto
                    {
                        Id = c.Id,
                        Code = c.Code,
                        Description = c.Description,
                        Type = c.Type,
                        Value = c.Value,
                        MinimumOrderAmount = c.MinimumOrderAmount,
                        MaximumDiscountAmount = c.MaximumDiscountAmount,
                        MaxTotalUses = c.MaxTotalUses,
                        MaxUsesPerUser = c.MaxUsesPerUser,
                        CurrentTotalUses = c.CurrentTotalUses,
                        IsFirstOrderOnly = c.IsFirstOrderOnly,
                        IsUserSpecific = c.IsUserSpecific,
                        AllowedUserEmails = c.AllowedUserEmails,
                        IsActive = c.IsActive,
                        ValidFrom = c.ValidFrom,
                        ValidUntil = c.ValidUntil,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        CreatedBy = c.CreatedBy
                    })
                    .ToListAsync();

                return Ok(new CouponsResponseDto
                {
                    Success = true,
                    Coupons = coupons,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving coupons");
                return StatusCode(500, new CouponsResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to retrieve coupons"
                });
            }
        }

        /// <summary>
        /// Get a specific coupon by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CouponResponseDto>> GetCoupon(int id)
        {
            try
            {
                var coupon = await _context.Coupons
                    .Where(c => c.Id == id)
                    .Select(c => new CouponDto
                    {
                        Id = c.Id,
                        Code = c.Code,
                        Description = c.Description,
                        Type = c.Type,
                        Value = c.Value,
                        MinimumOrderAmount = c.MinimumOrderAmount,
                        MaximumDiscountAmount = c.MaximumDiscountAmount,
                        MaxTotalUses = c.MaxTotalUses,
                        MaxUsesPerUser = c.MaxUsesPerUser,
                        CurrentTotalUses = c.CurrentTotalUses,
                        IsFirstOrderOnly = c.IsFirstOrderOnly,
                        IsUserSpecific = c.IsUserSpecific,
                        AllowedUserEmails = c.AllowedUserEmails,
                        IsActive = c.IsActive,
                        ValidFrom = c.ValidFrom,
                        ValidUntil = c.ValidUntil,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        CreatedBy = c.CreatedBy
                    })
                    .FirstOrDefaultAsync();

                if (coupon == null)
                {
                    return NotFound(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Coupon not found"
                    });
                }

                return Ok(new CouponResponseDto
                {
                    Success = true,
                    Coupon = coupon
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving coupon {CouponId}", id);
                return StatusCode(500, new CouponResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to retrieve coupon"
                });
            }
        }

        /// <summary>
        /// Create a new coupon
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CouponResponseDto>> CreateCoupon([FromBody] CreateCouponDto request)
        {
            try
            {
                _logger.LogInformation("Creating coupon with code: {Code}", request.Code);
                // Check if coupon code already exists
                var existingCoupon = await _context.Coupons
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.Code.ToUpper());

                if (existingCoupon != null)
                {
                    return BadRequest(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "A coupon with this code already exists"
                    });
                }

                // Validate dates
                if (request.ValidFrom.HasValue && request.ValidUntil.HasValue &&
                    request.ValidFrom.Value >= request.ValidUntil.Value)
                {
                    return BadRequest(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Valid from date must be before valid until date"
                    });
                }

                // Validate user-specific coupon requirements
                if (request.IsUserSpecific && string.IsNullOrWhiteSpace(request.AllowedUserEmails))
                {
                    return BadRequest(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Allowed user emails are required for user-specific coupons"
                    });
                }

                var currentUser = User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";

                var coupon = new Coupon
                {
                    Code = request.Code.ToUpper(),
                    Description = request.Description,
                    Type = request.Type,
                    Value = request.Value,
                    MinimumOrderAmount = request.MinimumOrderAmount,
                    MaximumDiscountAmount = request.MaximumDiscountAmount,
                    MaxTotalUses = request.MaxTotalUses,
                    MaxUsesPerUser = request.MaxUsesPerUser,
                    IsFirstOrderOnly = request.IsFirstOrderOnly,
                    IsUserSpecific = request.IsUserSpecific,
                    AllowedUserEmails = request.AllowedUserEmails,
                    IsActive = request.IsActive,
                    ValidFrom = request.ValidFrom,
                    ValidUntil = request.ValidUntil,
                    CreatedBy = currentUser,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Coupons.Add(coupon);
                await _context.SaveChangesAsync();

                var couponDto = new CouponDto
                {
                    Id = coupon.Id,
                    Code = coupon.Code,
                    Description = coupon.Description,
                    Type = coupon.Type,
                    Value = coupon.Value,
                    MinimumOrderAmount = coupon.MinimumOrderAmount,
                    MaximumDiscountAmount = coupon.MaximumDiscountAmount,
                    MaxTotalUses = coupon.MaxTotalUses,
                    MaxUsesPerUser = coupon.MaxUsesPerUser,
                    CurrentTotalUses = coupon.CurrentTotalUses,
                    IsFirstOrderOnly = coupon.IsFirstOrderOnly,
                    IsUserSpecific = coupon.IsUserSpecific,
                    AllowedUserEmails = coupon.AllowedUserEmails,
                    IsActive = coupon.IsActive,
                    ValidFrom = coupon.ValidFrom,
                    ValidUntil = coupon.ValidUntil,
                    CreatedAt = coupon.CreatedAt,
                    UpdatedAt = coupon.UpdatedAt,
                    CreatedBy = coupon.CreatedBy
                };

                return CreatedAtAction(nameof(GetCoupon), new { id = coupon.Id }, new CouponResponseDto
                {
                    Success = true,
                    Coupon = couponDto,
                    Message = "Coupon created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating coupon");
                return StatusCode(500, new CouponResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to create coupon"
                });
            }
        }

        /// <summary>
        /// Update an existing coupon
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<CouponResponseDto>> UpdateCoupon(int id, [FromBody] CreateCouponDto request)
        {
            try
            {
                var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Id == id);

                if (coupon == null)
                {
                    return NotFound(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Coupon not found"
                    });
                }

                // Validate user-specific coupon requirements
                if (request.IsUserSpecific && string.IsNullOrWhiteSpace(request.AllowedUserEmails))
                {
                    return BadRequest(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "User-specific coupons must have at least one email address specified"
                    });
                }

                // Validate date range
                if (request.ValidFrom.HasValue && request.ValidUntil.HasValue &&
                    request.ValidFrom.Value >= request.ValidUntil.Value)
                {
                    return BadRequest(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Valid From date must be before Valid Until date"
                    });
                }

                // Check for duplicate coupon code (excluding current coupon)
                var existingCoupon = await _context.Coupons
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.Code.ToUpper() && c.Id != id);

                if (existingCoupon != null)
                {
                    return BadRequest(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "A coupon with this code already exists"
                    });
                }

                // Update all fields (full update)
                coupon.Code = request.Code.ToUpper();
                coupon.Description = request.Description;
                coupon.Type = request.Type;
                coupon.Value = request.Value;
                coupon.MinimumOrderAmount = request.MinimumOrderAmount;
                coupon.MaximumDiscountAmount = request.MaximumDiscountAmount;
                coupon.MaxTotalUses = request.MaxTotalUses;
                coupon.MaxUsesPerUser = request.MaxUsesPerUser;
                coupon.IsFirstOrderOnly = request.IsFirstOrderOnly;
                coupon.IsUserSpecific = request.IsUserSpecific;
                coupon.AllowedUserEmails = request.IsUserSpecific ? request.AllowedUserEmails : null;
                coupon.IsActive = request.IsActive;
                coupon.ValidFrom = request.ValidFrom;
                coupon.ValidUntil = request.ValidUntil;
                coupon.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var couponDto = new CouponDto
                {
                    Id = coupon.Id,
                    Code = coupon.Code,
                    Description = coupon.Description,
                    Type = coupon.Type,
                    Value = coupon.Value,
                    MinimumOrderAmount = coupon.MinimumOrderAmount,
                    MaximumDiscountAmount = coupon.MaximumDiscountAmount,
                    MaxTotalUses = coupon.MaxTotalUses,
                    MaxUsesPerUser = coupon.MaxUsesPerUser,
                    CurrentTotalUses = coupon.CurrentTotalUses,
                    IsFirstOrderOnly = coupon.IsFirstOrderOnly,
                    IsUserSpecific = coupon.IsUserSpecific,
                    AllowedUserEmails = coupon.AllowedUserEmails,
                    IsActive = coupon.IsActive,
                    ValidFrom = coupon.ValidFrom,
                    ValidUntil = coupon.ValidUntil,
                    CreatedAt = coupon.CreatedAt,
                    UpdatedAt = coupon.UpdatedAt,
                    CreatedBy = coupon.CreatedBy
                };

                return Ok(new CouponResponseDto
                {
                    Success = true,
                    Coupon = couponDto,
                    Message = "Coupon updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating coupon {CouponId}", id);
                return StatusCode(500, new CouponResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to update coupon"
                });
            }
        }

        /// <summary>
        /// Delete a coupon
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<CouponResponseDto>> DeleteCoupon(int id)
        {
            try
            {
                var coupon = await _context.Coupons
                    .Include(c => c.CouponUsages)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (coupon == null)
                {
                    return NotFound(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Coupon not found"
                    });
                }

                // Check if coupon has been used
                if (coupon.CouponUsages.Any())
                {
                    return BadRequest(new CouponResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Cannot delete coupon that has been used. Consider deactivating it instead."
                    });
                }

                _context.Coupons.Remove(coupon);
                await _context.SaveChangesAsync();

                return Ok(new CouponResponseDto
                {
                    Success = true,
                    Message = "Coupon deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting coupon {CouponId}", id);
                return StatusCode(500, new CouponResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to delete coupon"
                });
            }
        }

        /// <summary>
        /// Get coupon usage statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<CouponStatsDto>> GetCouponStats()
        {
            try
            {
                var totalCoupons = await _context.Coupons.CountAsync();
                var activeCoupons = await _context.Coupons.CountAsync(c => c.IsActive);
                var expiredCoupons = await _context.Coupons
                    .CountAsync(c => c.ValidUntil.HasValue && c.ValidUntil.Value < DateTime.UtcNow);
                var totalUsages = await _context.CouponUsages.CountAsync();
                var totalDiscountGiven = await _context.CouponUsages.SumAsync(cu => cu.DiscountAmount);

                var topCoupons = await _context.CouponUsages
                    .GroupBy(cu => new { cu.CouponId, cu.Coupon.Code, cu.Coupon.Description })
                    .Select(g => new CouponUsageStatsDto
                    {
                        Code = g.Key.Code,
                        Description = g.Key.Description,
                        UsageCount = g.Count(),
                        TotalDiscountGiven = g.Sum(cu => cu.DiscountAmount)
                    })
                    .OrderByDescending(c => c.UsageCount)
                    .Take(10)
                    .ToListAsync();

                return Ok(new CouponStatsDto
                {
                    TotalCoupons = totalCoupons,
                    ActiveCoupons = activeCoupons,
                    ExpiredCoupons = expiredCoupons,
                    TotalUsages = totalUsages,
                    TotalDiscountGiven = totalDiscountGiven,
                    TopCoupons = topCoupons
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving coupon statistics");
                return StatusCode(500, new { success = false, message = "Failed to retrieve statistics" });
            }
        }

        private string GetCurrentUserName()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";
        }
    }
}
