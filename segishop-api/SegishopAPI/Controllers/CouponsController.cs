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
    [Route("api/coupons")]
    public class CouponValidationController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<CouponValidationController> _logger;

        public CouponValidationController(SegishopDbContext context, ILogger<CouponValidationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get available coupons for display to customers
        /// </summary>
        [HttpGet("available")]
        public async Task<ActionResult<CouponAvailableResponseDto>> GetAvailableCoupons()
        {
            try
            {
                var now = DateTime.UtcNow;

                var availableCoupons = await _context.Coupons
                    .Where(c => c.IsActive &&
                               (!c.ValidFrom.HasValue || c.ValidFrom <= now) &&
                               (!c.ValidUntil.HasValue || c.ValidUntil >= now) &&
                               (!c.MaxTotalUses.HasValue || c.CurrentTotalUses < c.MaxTotalUses.Value))
                    .OrderBy(c => c.CreatedAt)
                    .Take(5) // Limit to 5 most recent available coupons
                    .Select(c => new CouponAvailableDto
                    {
                        Code = c.Code,
                        Description = c.Description,
                        Type = c.Type,
                        Value = c.Value
                    })
                    .ToListAsync();

                return Ok(new CouponAvailableResponseDto
                {
                    Success = true,
                    Coupons = availableCoupons
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available coupons");
                return StatusCode(500, new CouponAvailableResponseDto
                {
                    Success = false,
                    ErrorMessage = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Validate a coupon code for the current user
        /// </summary>
        [HttpPost("validate")]
        [Authorize]
        public async Task<ActionResult<CouponValidationResponseDto>> ValidateCoupon([FromBody] ValidateCouponDto request)
        {
            try
            {
                var userId = GetCurrentUserId();

                var coupon = await _context.Coupons
                    .Include(c => c.CouponUsages)
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.Code.ToUpper());

                if (coupon == null)
                {
                    return Ok(new CouponValidationResponseDto
                    {
                        Success = true,
                        IsValid = false,
                        Message = "Invalid coupon code"
                    });
                }

                // Validate coupon - require authentication for first-order-only coupons
                if (coupon.IsFirstOrderOnly && !userId.HasValue)
                {
                    return Ok(new CouponValidationResponseDto
                    {
                        Success = true,
                        IsValid = false,
                        Message = "Please log in to use this coupon"
                    });
                }

                // Check if user has any previous orders (for first order coupons)
                var userOrderCount = 0;
                if (userId.HasValue)
                {
                    userOrderCount = await _context.Orders
                        .CountAsync(o => o.UserId == userId.Value && o.Status != "Cancelled");
                }

                // Validate coupon
                if (userId.HasValue && !coupon.CanUserUseCoupon(userId.Value, userOrderCount))
                {
                    var message = GetCouponInvalidMessage(coupon);
                    return Ok(new CouponValidationResponseDto
                    {
                        Success = true,
                        IsValid = false,
                        Message = message
                    });
                }

                // Calculate discount
                var discountAmount = coupon.CalculateDiscount(request.OrderSubtotal);
                var finalTotal = Math.Max(0, request.OrderSubtotal - discountAmount);

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

                return Ok(new CouponValidationResponseDto
                {
                    Success = true,
                    IsValid = true,
                    Message = $"Coupon applied! You save ${discountAmount:F2}",
                    Coupon = couponDto,
                    DiscountAmount = discountAmount,
                    FinalTotal = finalTotal
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating coupon {CouponCode}", request.Code);
                return StatusCode(500, new CouponValidationResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to validate coupon"
                });
            }
        }

        /// <summary>
        /// Apply a coupon to calculate order totals
        /// </summary>
        [HttpPost("apply")]
        [Authorize]
        public async Task<ActionResult<object>> ApplyCoupon([FromBody] ApplyCouponDto request)
        {
            try
            {
                var userId = GetCurrentUserId(); // Can be null for guest users

                var coupon = await _context.Coupons
                    .Include(c => c.CouponUsages)
                    .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.Code.ToUpper());

                if (coupon == null)
                {
                    return BadRequest(new { success = false, message = "Invalid coupon code" });
                }

                // Check if user has any previous orders (for first order coupons)
                var userOrderCount = 0;
                if (userId.HasValue)
                {
                    userOrderCount = await _context.Orders
                        .CountAsync(o => o.UserId == userId.Value && o.Status != "Cancelled");
                }

                // Validate coupon - require authentication for first-order-only coupons
                if (coupon.IsFirstOrderOnly && !userId.HasValue)
                {
                    return BadRequest(new { success = false, message = "Please log in to use this coupon" });
                }

                if (userId.HasValue)
                {
                    var canUse = coupon.CanUserUseCoupon(userId.Value, userOrderCount);
                    var userUsageCount = coupon.CouponUsages.Count(cu => cu.UserId == userId.Value);

                    // Debug logging
                    Console.WriteLine($"DEBUG: UserId={userId.Value}, UserUsageCount={userUsageCount}, IsFirstOrderOnly={coupon.IsFirstOrderOnly}, CanUse={canUse}");

                    if (!canUse)
                    {
                        var message = GetCouponInvalidMessage(coupon);
                        return BadRequest(new { success = false, message = message });
                    }
                }

                // Check user-specific coupon restrictions
                if (coupon.IsUserSpecific)
                {
                    if (!userId.HasValue)
                    {
                        return BadRequest(new { success = false, message = "Please log in to use this coupon" });
                    }

                    var currentUser = await _context.Users.FindAsync(userId.Value);
                    if (currentUser == null || !coupon.IsUserAllowed(currentUser.Email))
                    {
                        return BadRequest(new { success = false, message = "This coupon is not available for your account" });
                    }
                }

                // For guest users, only check basic coupon validity (active, not expired, etc.)
                if (!userId.HasValue)
                {
                    if (!coupon.IsActive)
                    {
                        return BadRequest(new { success = false, message = "This coupon is not active" });
                    }

                    if (coupon.ValidUntil.HasValue && coupon.ValidUntil.Value < DateTime.UtcNow)
                    {
                        return BadRequest(new { success = false, message = "This coupon has expired" });
                    }

                    if (coupon.MaxTotalUses.HasValue)
                    {
                        var totalUsages = await _context.CouponUsages.CountAsync(cu => cu.CouponId == coupon.Id);
                        if (totalUsages >= coupon.MaxTotalUses.Value)
                        {
                            return BadRequest(new { success = false, message = "This coupon has reached its usage limit" });
                        }
                    }
                }

                // Calculate discount and shipping
                var discountAmount = coupon.CalculateDiscount(request.OrderSubtotal);
                var subtotalAfterDiscount = request.OrderSubtotal - discountAmount;

                // Handle free shipping coupons
                var shippingAmount = request.ShippingAmount;
                var shippingDiscount = 0m;
                var responseMessage = "";

                if (coupon.Type == CouponType.FreeShipping && coupon.ProvidesFreeShipping(request.OrderSubtotal))
                {
                    shippingDiscount = request.ShippingAmount;
                    shippingAmount = 0;
                    responseMessage = $"Coupon applied! Free shipping saves you ${shippingDiscount:F2}";
                }
                else if (discountAmount > 0)
                {
                    responseMessage = $"Coupon applied! You save ${discountAmount:F2}";
                }
                else
                {
                    responseMessage = "Coupon applied successfully";
                }

                var finalTotal = subtotalAfterDiscount + shippingAmount + request.TaxAmount;

                return Ok(new
                {
                    success = true,
                    message = responseMessage,
                    coupon = new
                    {
                        id = coupon.Id,
                        code = coupon.Code,
                        description = coupon.Description,
                        type = coupon.Type.ToString(),
                        value = coupon.Value
                    },
                    orderTotals = new
                    {
                        subtotal = request.OrderSubtotal,
                        discountAmount = discountAmount,
                        subtotalAfterDiscount = subtotalAfterDiscount,
                        shippingAmount = shippingAmount,
                        shippingDiscount = shippingDiscount,
                        taxAmount = request.TaxAmount,
                        totalAmount = finalTotal,
                        freeShippingApplied = coupon.Type == CouponType.FreeShipping && shippingDiscount > 0
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying coupon {CouponCode}", request.Code);
                return StatusCode(500, new { success = false, message = "Failed to apply coupon" });
            }
        }

        /// <summary>
        /// Remove applied coupon
        /// </summary>
        [HttpPost("remove")]
        public async Task<ActionResult<object>> RemoveCoupon([FromBody] ApplyCouponDto request)
        {
            try
            {
                // Calculate totals without coupon
                var finalTotal = request.OrderSubtotal + request.ShippingAmount + request.TaxAmount;

                return Ok(new
                {
                    success = true,
                    message = "Coupon removed",
                    orderTotals = new
                    {
                        subtotal = request.OrderSubtotal,
                        discountAmount = 0m,
                        subtotalAfterDiscount = request.OrderSubtotal,
                        shippingAmount = request.ShippingAmount,
                        taxAmount = request.TaxAmount,
                        totalAmount = finalTotal
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing coupon");
                return StatusCode(500, new { success = false, message = "Failed to remove coupon" });
            }
        }

        private int? GetCurrentUserId()
        {
            // Debug: Log all claims
            Console.WriteLine("=== JWT CLAIMS DEBUG ===");
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }
            Console.WriteLine("========================");

            // Try different claim types
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                             User.FindFirst("sub")?.Value ??
                             User.FindFirst("userId")?.Value ??
                             User.FindFirst("id")?.Value;

            Console.WriteLine($"Found UserId Claim: {userIdClaim}");
            return int.TryParse(userIdClaim, out int userId) ? userId : null;
        }

        private string GetCouponInvalidMessage(Coupon coupon)
        {
            if (!coupon.IsActive)
                return "This coupon is no longer active";

            if (coupon.ValidFrom.HasValue && DateTime.UtcNow < coupon.ValidFrom.Value)
                return "This coupon is not yet valid";

            if (coupon.ValidUntil.HasValue && DateTime.UtcNow > coupon.ValidUntil.Value)
                return "This coupon has expired";

            if (coupon.HasReachedUsageLimit())
                return "This coupon has reached its usage limit";

            var currentUserId = GetCurrentUserId();
            var userUsageCount = coupon.CouponUsages.Count(cu => cu.UserId == currentUserId);

            if (coupon.IsFirstOrderOnly && userUsageCount > 0)
                return "This coupon is only valid for first-time customers and you have already used it";

            if (coupon.MaxUsesPerUser.HasValue && userUsageCount >= coupon.MaxUsesPerUser.Value)
                return "You have already used this coupon the maximum number of times";

            return "This coupon is not valid for your order";
        }
    }
}
