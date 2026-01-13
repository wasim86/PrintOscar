using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SegishopAPI.DTOs;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly IRecaptchaService _recaptchaService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService,
            IEmailService emailService,
            IRecaptchaService recaptchaService,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _emailService = emailService;
            _recaptchaService = recaptchaService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            // Validate reCAPTCHA if token is provided
            if (!string.IsNullOrEmpty(request.RecaptchaToken))
            {
                var recaptchaResult = await _recaptchaService.ValidateTokenAsync(
                    request.RecaptchaToken,
                    "user_registration",
                    HttpContext.Connection.RemoteIpAddress?.ToString());

                if (!recaptchaResult.IsValid)
                {
                    _logger.LogWarning("Registration blocked due to failed reCAPTCHA validation. Score: {Score}", recaptchaResult.Score);
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Security verification failed. Please try again."
                    });
                }

                _logger.LogInformation("Registration reCAPTCHA validation successful. Score: {Score}", recaptchaResult.Score);
            }

            var result = await _authService.RegisterAsync(request);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            // Validate reCAPTCHA if token is provided (optional for login)
            if (!string.IsNullOrEmpty(request.RecaptchaToken))
            {
                var recaptchaResult = await _recaptchaService.ValidateTokenAsync(
                    request.RecaptchaToken,
                    "user_login",
                    HttpContext.Connection.RemoteIpAddress?.ToString());

                if (!recaptchaResult.IsValid)
                {
                    _logger.LogWarning("Login blocked due to failed reCAPTCHA validation. Email: {Email}, Score: {Score}",
                        request.Email, recaptchaResult.Score);
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Security verification failed. Please try again."
                    });
                }

                _logger.LogInformation("Login reCAPTCHA validation successful. Email: {Email}, Score: {Score}",
                    request.Email, recaptchaResult.Score);
            }

            var result = await _authService.LoginAsync(request);

            if (result.Success)
            {
                return Ok(result);
            }

            return Unauthorized(result);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<AuthResponseDto>> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            var result = await _authService.ForgotPasswordAsync(request);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<AuthResponseDto>> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            var result = await _authService.ResetPasswordAsync(request);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _authService.GetUserByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult<AuthResponseDto>> UpdateProfile([FromBody] UpdateProfileRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid token"
                });
            }

            var result = await _authService.UpdateProfileAsync(userId, request);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult<AuthResponseDto>> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid token"
                });
            }

            var result = await _authService.ChangePasswordAsync(userId, request);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpDelete("account")]
        [Authorize]
        public async Task<ActionResult<AuthResponseDto>> DeleteAccount()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid token"
                });
            }

            var result = await _authService.DeleteAccountAsync(userId);
            
            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("validate-token")]
        [Authorize]
        public ActionResult ValidateToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                valid = true,
                userId = userIdClaim,
                email = emailClaim,
                role = roleClaim
            });
        }
    }
}
