using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SegishopAPI.DTOs;
using SegishopAPI.Services;
using System.Security.Claims;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/auth")]
    public class AdminAuthController : ControllerBase
    {
        private readonly IAdminAuthService _adminAuthService;
        private readonly ILogger<AdminAuthController> _logger;

        public AdminAuthController(
            IAdminAuthService adminAuthService,
            ILogger<AdminAuthController> logger)
        {
            _adminAuthService = adminAuthService;
            _logger = logger;
        }

        /// <summary>
        /// Admin login endpoint
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AdminAuthResponseDto>> Login([FromBody] AdminLoginRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                }

                var result = await _adminAuthService.LoginAsync(request);

                if (result.Success)
                {
                    _logger.LogInformation("Admin login successful for email: {Email}", request.Email);
                    return Ok(result);
                }

                _logger.LogWarning("Admin login failed for email: {Email}", request.Email);
                return Unauthorized(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in admin login endpoint for email: {Email}", request.Email);
                return StatusCode(500, new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Get current admin user profile
        /// </summary>
        [HttpGet("profile")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AdminAuthResponseDto>> GetProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid token"
                    });
                }

                var adminUser = await _adminAuthService.GetAdminByIdAsync(userId);
                if (adminUser == null)
                {
                    return NotFound(new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Admin user not found"
                    });
                }

                return Ok(new AdminAuthResponseDto
                {
                    Success = true,
                    Message = "Profile retrieved successfully",
                    User = adminUser
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin profile");
                return StatusCode(500, new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Admin logout endpoint
        /// </summary>
        [HttpPost("logout")]
        [Authorize(Roles = "Admin")]
        public ActionResult<AdminAuthResponseDto> Logout()
        {
            try
            {
                // In a real implementation, you might want to blacklist the token
                // For now, we'll just return a success response
                // The client should remove the token from storage

                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                _logger.LogInformation("Admin user logged out: {Email}", userEmail);

                return Ok(new AdminAuthResponseDto
                {
                    Success = true,
                    Message = "Logout successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in admin logout endpoint");
                return StatusCode(500, new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Validate admin token
        /// </summary>
        [HttpPost("validate")]
        [Authorize(Roles = "Admin")]
        public ActionResult<AdminAuthResponseDto> ValidateToken()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (userRole != "Admin")
                {
                    return Unauthorized(new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Access denied. Admin privileges required."
                    });
                }

                return Ok(new AdminAuthResponseDto
                {
                    Success = true,
                    Message = "Token is valid"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating admin token");
                return StatusCode(500, new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create admin user (temporary endpoint for setup)
        /// </summary>
        [HttpPost("create-admin")]
        public async Task<ActionResult<AdminAuthResponseDto>> CreateAdmin()
        {
            try
            {
                var result = await _adminAuthService.CreateAdminUserAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating admin user");
                return StatusCode(500, new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred while creating admin user"
                });
            }
        }
    }
}
