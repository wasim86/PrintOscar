using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShippingController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IShippingCalculationService _shippingService;
        private readonly ILogger<ShippingController> _logger;

        public ShippingController(
            SegishopDbContext context, 
            IShippingCalculationService shippingService,
            ILogger<ShippingController> logger)
        {
            _context = context;
            _shippingService = shippingService;
            _logger = logger;
        }

        /// <summary>
        /// Calculate shipping options for a cart and address
        /// </summary>
        [HttpPost("calculate")]
        public async Task<ActionResult<ShippingCalculationResponseDto>> CalculateShipping([FromBody] ShippingCalculationRequestDto request)
        {
            try
            {
                var cart = new CartSummaryDto
                {
                    Items = request.Items,
                    Subtotal = request.Subtotal,
                    TotalItems = request.Items.Sum(i => i.Quantity),
                    UniqueItemsCount = request.Items.Count
                };

                var options = await _shippingService.CalculateShippingOptionsAsync(cart, request.ShippingAddress);

                return Ok(new ShippingCalculationResponseDto
                {
                    Options = options,
                    Success = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating shipping options");
                return Ok(new ShippingCalculationResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to calculate shipping options"
                });
            }
        }

        /// <summary>
        /// Calculate tax for a cart and address
        /// </summary>
        [HttpPost("calculate-tax")]
        public async Task<ActionResult<TaxCalculationResponseDto>> CalculateTax([FromBody] TaxCalculationRequestDto request)
        {
            try
            {
                var cart = new CartSummaryDto
                {
                    Items = request.Items,
                    Subtotal = request.Subtotal,
                    TotalItems = request.Items.Sum(i => i.Quantity),
                    UniqueItemsCount = request.Items.Count
                };

                var taxAmount = await _shippingService.CalculateTaxAsync(cart, request.ShippingAddress, request.SelectedShippingOptionId);

                return Ok(new TaxCalculationResponseDto
                {
                    TaxAmount = taxAmount,
                    TaxRate = 0.08m, // This should come from tax service
                    IsTaxable = taxAmount > 0,
                    Success = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating tax");
                return Ok(new TaxCalculationResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to calculate tax"
                });
            }
        }

        /// <summary>
        /// Calculate complete order totals including shipping, tax, and discounts
        /// </summary>
        [HttpPost("calculate-totals")]
        public async Task<ActionResult<OrderTotalsResponseDto>> CalculateOrderTotals([FromBody] OrderTotalsRequestDto request)
        {
            try
            {
                var cart = new CartSummaryDto
                {
                    Items = request.Items,
                    Subtotal = request.Subtotal,
                    TotalItems = request.Items.Sum(i => i.Quantity),
                    UniqueItemsCount = request.Items.Count
                };

                // Calculate shipping cost with free shipping logic
                var shippingCost = 0m;
                if (request.SelectedShippingOptionId.HasValue)
                {
                    // Get the shipping zone method to check if it's standard shipping
                    var zoneMethod = await _context.ShippingZoneMethods
                        .Include(zm => zm.ShippingMethod)
                        .FirstOrDefaultAsync(zm => zm.Id == request.SelectedShippingOptionId.Value);

                    if (zoneMethod != null)
                    {
                        // Apply free shipping logic
                        const decimal FREE_SHIPPING_THRESHOLD = 120.00m;
                        bool qualifiesForFreeShipping = cart.Subtotal >= FREE_SHIPPING_THRESHOLD;

                        // If it's standard shipping (FlatRate) and qualifies for free shipping, set cost to 0
                        if (zoneMethod.ShippingMethod.MethodType == "FlatRate" && zoneMethod.ShippingMethod.Name.Contains("Standard") && qualifiesForFreeShipping)
                        {
                            shippingCost = 0m;
                        }
                        else if (zoneMethod.ShippingMethod.MethodType == "FreeShipping" && qualifiesForFreeShipping)
                        {
                            shippingCost = 0m;
                        }
                        else
                        {
                            // Calculate regular shipping cost
                            shippingCost = await _shippingService.CalculateShippingCostAsync(request.SelectedShippingOptionId.Value, cart);
                        }
                    }
                }

                // Calculate tax
                var taxAmount = await _shippingService.CalculateTaxAsync(cart, request.ShippingAddress, request.SelectedShippingOptionId);

                // Calculate discount (placeholder - implement coupon service)
                var discountAmount = 0m;
                string? appliedCoupon = null;
                if (!string.IsNullOrEmpty(request.CouponCode))
                {
                    // TODO: Implement coupon validation and discount calculation
                    if (request.CouponCode.ToUpper() == "FIRSTSEGI10")
                    {
                        discountAmount = cart.Subtotal * 0.10m;
                        appliedCoupon = "FIRSTSEGI10";
                    }
                }

                var total = cart.Subtotal + shippingCost + taxAmount - discountAmount;

                return Ok(new OrderTotalsResponseDto
                {
                    Totals = new OrderTotalsDto
                    {
                        Subtotal = cart.Subtotal,
                        ShippingCost = shippingCost,
                        TaxAmount = taxAmount,
                        DiscountAmount = discountAmount,
                        Total = total,
                        AppliedCoupon = appliedCoupon
                    },
                    Success = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating order totals");
                return Ok(new OrderTotalsResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to calculate order totals"
                });
            }
        }

        /// <summary>
        /// Validate shipping address
        /// </summary>
        [HttpPost("validate-address")]
        public async Task<ActionResult<AddressValidationResponseDto>> ValidateAddress([FromBody] ShippingAddressDto address)
        {
            try
            {
                // Basic validation
                var isValid = !string.IsNullOrEmpty(address.Address) &&
                             !string.IsNullOrEmpty(address.City) &&
                             !string.IsNullOrEmpty(address.State) &&
                             !string.IsNullOrEmpty(address.ZipCode) &&
                             !string.IsNullOrEmpty(address.Country);

                // Check if we can find a shipping zone for this address
                if (isValid)
                {
                    var zone = await _shippingService.GetShippingZoneForAddressAsync(address);
                    if (zone == null)
                    {
                        return Ok(new AddressValidationResponseDto
                        {
                            IsValid = false,
                            Message = "We don't currently ship to this address",
                            Success = true
                        });
                    }
                }

                return Ok(new AddressValidationResponseDto
                {
                    IsValid = isValid,
                    Message = isValid ? "Address is valid" : "Please provide a complete address",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating address");
                return Ok(new AddressValidationResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to validate address"
                });
            }
        }

        /// <summary>
        /// Test if a zip code is serviceable for a zone
        /// </summary>
        [HttpGet("test-zipcode/{zipCode}/zone/{zoneId}")]
        public async Task<ActionResult<bool>> TestZipCode(string zipCode, int zoneId)
        {
            try
            {
                var isServiceable = await _shippingService.IsZipCodeServiceableAsync(zipCode, zoneId);
                return Ok(isServiceable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing zip code {ZipCode} for zone {ZoneId}", zipCode, zoneId);
                return BadRequest("Error testing zip code");
            }
        }

        /// <summary>
        /// Get shipping zone for an address
        /// </summary>
        [HttpPost("zone")]
        public async Task<ActionResult<ShippingZoneDto?>> GetShippingZone([FromBody] ShippingAddressDto address)
        {
            try
            {
                var zone = await _shippingService.GetShippingZoneForAddressAsync(address);
                if (zone == null)
                {
                    return NotFound("No shipping zone found for this address");
                }

                var zoneDto = new ShippingZoneDto
                {
                    Id = zone.Id,
                    Name = zone.Name,
                    Description = zone.Description,
                    IsEnabled = zone.IsEnabled,
                    SortOrder = zone.SortOrder
                };

                return Ok(zoneDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error finding shipping zone for address");
                return BadRequest("Error finding shipping zone");
            }
        }

        /// <summary>
        /// Initialize shipping system with sample data (for testing)
        /// </summary>
        [HttpPost("initialize")]
        public async Task<ActionResult> InitializeShippingSystem()
        {
            try
            {
                // Check if shipping data already exists
                var existingZones = await _context.ShippingZones.AnyAsync();
                if (existingZones)
                {
                    return BadRequest("Shipping system already initialized");
                }

                // This endpoint can be used to manually create the shipping tables and seed data
                // if the migration doesn't work
                return Ok("Shipping system initialization endpoint ready");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing shipping system");
                return BadRequest("Error initializing shipping system");
            }
        }
    }
}
