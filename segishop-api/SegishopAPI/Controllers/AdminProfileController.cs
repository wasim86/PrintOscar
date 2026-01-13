using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SegishopAPI.Services;
using SegishopAPI.DTOs;
using System.Security.Claims;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/profile")]
    [Authorize]
    public class AdminProfileController : ControllerBase
    {
        private readonly IAdminProfileService _profileService;
        private readonly ILogger<AdminProfileController> _logger;

        public AdminProfileController(
            IAdminProfileService profileService,
            ILogger<AdminProfileController> logger)
        {
            _profileService = profileService;
            _logger = logger;
        }

        /// <summary>
        /// Get current admin user profile
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ProfileResponseDto>> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { success = false, message = "User not authenticated" });
                }

                var result = await _profileService.GetProfileAsync(userId.Value);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin profile");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Update admin user profile
        /// </summary>
        [HttpPut]
        public async Task<ActionResult<ProfileResponseDto>> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Validation failed",
                        errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                    });
                }

                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { success = false, message = "User not authenticated" });
                }

                var result = await _profileService.UpdateProfileAsync(userId.Value, updateDto);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating admin profile");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Change admin user password
        /// </summary>
        [HttpPut("change-password")]
        public async Task<ActionResult<PasswordChangeResponseDto>> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Validation failed",
                        errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                    });
                }

                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { success = false, message = "User not authenticated" });
                }

                var result = await _profileService.ChangePasswordAsync(userId.Value, changePasswordDto);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing admin password");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null;
        }
    }
}
