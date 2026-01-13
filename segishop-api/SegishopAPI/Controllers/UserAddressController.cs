using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;
using SegishopAPI.Services;
using System.Security.Claims;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserAddressController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IShippingCalculationService _shippingService;
        private readonly IPostalCodeValidationService _postalValidationService;
        private readonly ILogger<UserAddressController> _logger;

        public UserAddressController(
            SegishopDbContext context,
            IShippingCalculationService shippingService,
            IPostalCodeValidationService postalValidationService,
            ILogger<UserAddressController> logger)
        {
            _context = context;
            _shippingService = shippingService;
            _postalValidationService = postalValidationService;
            _logger = logger;
        }

        /// <summary>
        /// Get all addresses for the authenticated user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<UserAddressesResponseDto>> GetUserAddresses()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new UserAddressesResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Invalid user token"
                    });
                }

                var addresses = await _context.UserAddresses
                    .Where(a => a.UserId == userId.Value && a.IsActive)
                    .OrderByDescending(a => a.IsDefault)
                    .ThenBy(a => a.Type)
                    .ThenByDescending(a => a.CreatedAt)
                    .Select(a => new UserAddressDto
                    {
                        Id = a.Id,
                        UserId = a.UserId,
                        Type = a.Type,
                        FirstName = a.FirstName,
                        LastName = a.LastName,
                        Company = a.Company,
                        Address1 = a.Address1,
                        Address2 = a.Address2,
                        City = a.City,
                        State = a.State,
                        ZipCode = a.ZipCode,
                        Country = a.Country,
                        Phone = a.Phone,
                        IsDefault = a.IsDefault,
                        IsActive = a.IsActive,
                        CreatedAt = a.CreatedAt,
                        UpdatedAt = a.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(new UserAddressesResponseDto
                {
                    Success = true,
                    Addresses = addresses
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user addresses");
                return StatusCode(500, new UserAddressesResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to retrieve addresses"
                });
            }
        }

        /// <summary>
        /// Get a specific address by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserAddressResponseDto>> GetAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new UserAddressResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Invalid user token"
                    });
                }

                var address = await _context.UserAddresses
                    .Where(a => a.Id == id && a.UserId == userId.Value && a.IsActive)
                    .Select(a => new UserAddressDto
                    {
                        Id = a.Id,
                        UserId = a.UserId,
                        Type = a.Type,
                        FirstName = a.FirstName,
                        LastName = a.LastName,
                        Company = a.Company,
                        Address1 = a.Address1,
                        Address2 = a.Address2,
                        City = a.City,
                        State = a.State,
                        ZipCode = a.ZipCode,
                        Country = a.Country,
                        Phone = a.Phone,
                        IsDefault = a.IsDefault,
                        IsActive = a.IsActive,
                        CreatedAt = a.CreatedAt,
                        UpdatedAt = a.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (address == null)
                {
                    return NotFound(new UserAddressResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Address not found"
                    });
                }

                return Ok(new UserAddressResponseDto
                {
                    Success = true,
                    Address = address
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving address {AddressId}", id);
                return StatusCode(500, new UserAddressResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to retrieve address"
                });
            }
        }

        /// <summary>
        /// Create a new address for the authenticated user
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<UserAddressResponseDto>> CreateAddress([FromBody] CreateUserAddressDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new UserAddressResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Invalid user token"
                    });
                }

                // If this is set as default, unset other default addresses
                if (request.IsDefault)
                {
                    await UnsetDefaultAddresses(userId.Value);
                }

                var address = new UserAddress
                {
                    UserId = userId.Value,
                    Type = request.Type,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Company = request.Company,
                    Address1 = request.Address1,
                    Address2 = request.Address2,
                    City = request.City,
                    State = request.State,
                    ZipCode = request.ZipCode,
                    Country = request.Country,
                    Phone = request.Phone,
                    IsDefault = request.IsDefault,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.UserAddresses.Add(address);
                await _context.SaveChangesAsync();

                var addressDto = new UserAddressDto
                {
                    Id = address.Id,
                    UserId = address.UserId,
                    Type = address.Type,
                    FirstName = address.FirstName,
                    LastName = address.LastName,
                    Company = address.Company,
                    Address1 = address.Address1,
                    Address2 = address.Address2,
                    City = address.City,
                    State = address.State,
                    ZipCode = address.ZipCode,
                    Country = address.Country,
                    Phone = address.Phone,
                    IsDefault = address.IsDefault,
                    IsActive = address.IsActive,
                    CreatedAt = address.CreatedAt,
                    UpdatedAt = address.UpdatedAt
                };

                return CreatedAtAction(nameof(GetAddress), new { id = address.Id }, new UserAddressResponseDto
                {
                    Success = true,
                    Address = addressDto,
                    Message = "Address created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating address");
                return StatusCode(500, new UserAddressResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to create address"
                });
            }
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : null;
        }

        /// <summary>
        /// Update an existing address
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<UserAddressResponseDto>> UpdateAddress(int id, [FromBody] UpdateUserAddressDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new UserAddressResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Invalid user token"
                    });
                }

                var address = await _context.UserAddresses
                    .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId.Value && a.IsActive);

                if (address == null)
                {
                    return NotFound(new UserAddressResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Address not found"
                    });
                }

                // If setting as default, unset other default addresses
                if (request.IsDefault == true)
                {
                    await UnsetDefaultAddresses(userId.Value);
                }

                // Update fields if provided
                if (!string.IsNullOrEmpty(request.Type)) address.Type = request.Type;
                if (!string.IsNullOrEmpty(request.FirstName)) address.FirstName = request.FirstName;
                if (!string.IsNullOrEmpty(request.LastName)) address.LastName = request.LastName;
                if (request.Company != null) address.Company = request.Company;
                if (!string.IsNullOrEmpty(request.Address1)) address.Address1 = request.Address1;
                if (request.Address2 != null) address.Address2 = request.Address2;
                if (!string.IsNullOrEmpty(request.City)) address.City = request.City;
                if (!string.IsNullOrEmpty(request.State)) address.State = request.State;
                if (!string.IsNullOrEmpty(request.ZipCode)) address.ZipCode = request.ZipCode;
                if (!string.IsNullOrEmpty(request.Country)) address.Country = request.Country;
                if (request.Phone != null) address.Phone = request.Phone;
                if (request.IsDefault.HasValue) address.IsDefault = request.IsDefault.Value;

                address.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var addressDto = new UserAddressDto
                {
                    Id = address.Id,
                    UserId = address.UserId,
                    Type = address.Type,
                    FirstName = address.FirstName,
                    LastName = address.LastName,
                    Company = address.Company,
                    Address1 = address.Address1,
                    Address2 = address.Address2,
                    City = address.City,
                    State = address.State,
                    ZipCode = address.ZipCode,
                    Country = address.Country,
                    Phone = address.Phone,
                    IsDefault = address.IsDefault,
                    IsActive = address.IsActive,
                    CreatedAt = address.CreatedAt,
                    UpdatedAt = address.UpdatedAt
                };

                return Ok(new UserAddressResponseDto
                {
                    Success = true,
                    Address = addressDto,
                    Message = "Address updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating address {AddressId}", id);
                return StatusCode(500, new UserAddressResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to update address"
                });
            }
        }

        /// <summary>
        /// Delete an address (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserAddressResponseDto>> DeleteAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new UserAddressResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Invalid user token"
                    });
                }

                var address = await _context.UserAddresses
                    .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId.Value && a.IsActive);

                if (address == null)
                {
                    return NotFound(new UserAddressResponseDto
                    {
                        Success = false,
                        ErrorMessage = "Address not found"
                    });
                }

                // Soft delete
                address.IsActive = false;
                address.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new UserAddressResponseDto
                {
                    Success = true,
                    Message = "Address deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting address {AddressId}", id);
                return StatusCode(500, new UserAddressResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to delete address"
                });
            }
        }

        /// <summary>
        /// Validate an address and get shipping zone information
        /// </summary>
        [HttpPost("validate")]
        public async Task<ActionResult<AddressValidationResponseDto>> ValidateAddress([FromBody] CreateUserAddressDto request)
        {
            try
            {
                // Basic field validation
                var isComplete = !string.IsNullOrEmpty(request.Address1) &&
                               !string.IsNullOrEmpty(request.City) &&
                               !string.IsNullOrEmpty(request.State) &&
                               !string.IsNullOrEmpty(request.ZipCode) &&
                               !string.IsNullOrEmpty(request.Country);

                if (!isComplete)
                {
                    return Ok(new AddressValidationResponseDto
                    {
                        Success = true,
                        IsValid = false,
                        Message = "Please provide a complete address"
                    });
                }

                // Enhanced postal code validation
                var postalValidation = await _postalValidationService.ValidatePostalCodeAsync(
                    request.ZipCode,
                    request.Country,
                    request.State
                );

                if (!postalValidation.IsValid)
                {
                    return Ok(new AddressValidationResponseDto
                    {
                        Success = true,
                        IsValid = false,
                        Message = postalValidation.ErrorMessage ?? "Invalid postal code format"
                    });
                }

                // Convert to ShippingAddressDto for shipping zone validation
                var shippingAddress = new ShippingAddressDto
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Address = request.Address1,
                    Apartment = request.Address2,
                    City = request.City,
                    State = request.State,
                    ZipCode = postalValidation.FormattedPostalCode ?? request.ZipCode,
                    Country = request.Country,
                    Phone = request.Phone
                };

                // Check shipping zone
                var zone = await _shippingService.GetShippingZoneForAddressAsync(shippingAddress);
                if (zone == null)
                {
                    return Ok(new AddressValidationResponseDto
                    {
                        Success = true,
                        IsValid = false,
                        Message = "We don't currently ship to this address"
                    });
                }

                return Ok(new AddressValidationResponseDto
                {
                    Success = true,
                    IsValid = true,
                    Message = postalValidation.City != null
                        ? $"Address validated for {postalValidation.City}, {request.State}"
                        : "Address is valid",
                    ShippingZoneId = zone.Id,
                    ShippingZoneName = zone.Name
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating address");
                return StatusCode(500, new AddressValidationResponseDto
                {
                    Success = false,
                    ErrorMessage = "Failed to validate address"
                });
            }
        }

        /// <summary>
        /// Get postal code suggestions for a partial postal code
        /// </summary>
        [HttpGet("postal-suggestions")]
        public async Task<ActionResult<object>> GetPostalCodeSuggestions(
            [FromQuery] string partialCode,
            [FromQuery] string country,
            [FromQuery] string? state = null)
        {
            try
            {
                if (string.IsNullOrEmpty(partialCode) || string.IsNullOrEmpty(country))
                {
                    return BadRequest(new { success = false, message = "Partial code and country are required" });
                }

                var suggestions = await _postalValidationService.GetSuggestionsAsync(partialCode, country, state);

                return Ok(new
                {
                    success = true,
                    suggestions = suggestions,
                    isValidFormat = _postalValidationService.IsValidFormat(partialCode, country)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting postal code suggestions for {PartialCode}", partialCode);
                return StatusCode(500, new { success = false, message = "Failed to get suggestions" });
            }
        }

        private async Task UnsetDefaultAddresses(int userId)
        {
            var defaultAddresses = await _context.UserAddresses
                .Where(a => a.UserId == userId && a.IsDefault && a.IsActive)
                .ToListAsync();

            foreach (var address in defaultAddresses)
            {
                address.IsDefault = false;
                address.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
