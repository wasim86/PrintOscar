using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly SegishopDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _emailService;

        public AuthService(
            SegishopDbContext context,
            IConfiguration configuration,
            ILogger<AuthService> logger,
            IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (existingUser != null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User with this email already exists"
                    };
                }

                // Hash the provided password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create user
                var user = new User
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PasswordHash = passwordHash,
                    Role = "Customer",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Generate JWT token
                var token = GenerateJwtToken(user.Id, user.Email, user.Role);

                // Send welcome email
                try
                {
                    var emailSent = await _emailService.SendWelcomeEmailAsync(user.Email, request.Password);
                    if (!emailSent)
                    {
                        _logger.LogWarning("Failed to send welcome email to {Email}", user.Email);
                    }
                    else
                    {
                        _logger.LogInformation("Welcome email sent successfully to {Email}", user.Email);
                    }
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Error sending welcome email to {Email}", user.Email);
                    // Don't fail registration if email fails
                }

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Registration successful",
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Phone = user.Phone,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Registration failed. Please try again."
                };
            }
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var token = GenerateJwtToken(user.Id, user.Email, user.Role);

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Phone = user.Phone,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Login failed. Please try again."
                };
            }
        }

        public async Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

                if (user == null)
                {
                    // Return success even if user not found for security reasons
                    return new AuthResponseDto
                    {
                        Success = true,
                        Message = "If an account with that email exists, a password reset link has been sent."
                    };
                }

                // Generate reset token
                var resetToken = Guid.NewGuid().ToString("N");
                var expiresAt = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour

                // Invalidate any existing tokens for this user
                var existingTokens = await _context.PasswordResetTokens
                    .Where(t => t.UserId == user.Id && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow)
                    .ToListAsync();

                foreach (var token in existingTokens)
                {
                    token.IsUsed = true;
                }

                // Create new reset token
                var passwordResetToken = new PasswordResetToken
                {
                    UserId = user.Id,
                    Token = resetToken,
                    ExpiresAt = expiresAt,
                    CreatedAt = DateTime.UtcNow
                };

                _context.PasswordResetTokens.Add(passwordResetToken);
                await _context.SaveChangesAsync();

                // Send password reset email
                var userName = $"{user.FirstName} {user.LastName}".Trim();
                var emailSent = await _emailService.SendPasswordResetEmailAsync(user.Email, userName, resetToken);

                if (!emailSent)
                {
                    _logger.LogWarning("Failed to send password reset email to {Email}", user.Email);
                    // Still log the reset link as fallback for development
                    var resetLink = $"http://localhost:3000/reset-password?token={resetToken}";
                    _logger.LogInformation("Password reset link for {Email}: {ResetLink}", user.Email, resetLink);
                }

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "If an account with that email exists, a password reset link has been sent."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset for email: {Email}", request.Email);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Password reset failed. Please try again."
                };
            }
        }

        public async Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            try
            {
                var resetToken = await _context.PasswordResetTokens
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Token == request.Token && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow);

                if (resetToken == null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid or expired reset token"
                    };
                }

                // Update user password
                resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                resetToken.User.UpdatedAt = DateTime.UtcNow;

                // Mark token as used
                resetToken.IsUsed = true;

                await _context.SaveChangesAsync();

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Password has been reset successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset with token: {Token}", request.Token);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Password reset failed. Please try again."
                };
            }
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<AuthResponseDto> UpdateProfileAsync(int userId, UpdateProfileRequestDto request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

                if (user == null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Phone = request.Phone;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Profile updated successfully",
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Phone = user.Phone,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile for user: {UserId}", userId);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Profile update failed. Please try again."
                };
            }
        }

        public async Task<AuthResponseDto> ChangePasswordAsync(int userId, ChangePasswordRequestDto request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

                if (user == null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Current password is incorrect"
                    };
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Password changed successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for user: {UserId}", userId);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Password change failed. Please try again."
                };
            }
        }

        public async Task<AuthResponseDto> DeleteAccountAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

                if (user == null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                user.IsActive = false;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Account deactivated for user ID: {UserId}", userId);

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Account deactivated successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting account for user: {UserId}", userId);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Account deletion failed"
                };
            }
        }

        public string GenerateJwtToken(int userId, string email, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-that-is-at-least-32-characters-long";
            var issuer = jwtSettings["Issuer"] ?? "SegishopAPI";
            var audience = jwtSettings["Audience"] ?? "SegishopClient";
            var expiryMinutes = int.Parse(jwtSettings["ExpiryMinutes"] ?? "1440"); // 24 hours

            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateStrongPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            var length = random.Next(8, 11); // 8-10 characters
            var password = new StringBuilder();

            // Ensure at least one of each type
            password.Append(chars[random.Next(0, 26)]); // uppercase
            password.Append(chars[random.Next(26, 52)]); // lowercase
            password.Append(chars[random.Next(52, 62)]); // number
            password.Append(chars[random.Next(62, chars.Length)]); // special

            // Fill the rest randomly
            for (int i = 4; i < length; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }

            // Shuffle the password
            var passwordArray = password.ToString().ToCharArray();
            for (int i = passwordArray.Length - 1; i > 0; i--)
            {
                int j = random.Next(i + 1);
                (passwordArray[i], passwordArray[j]) = (passwordArray[j], passwordArray[i]);
            }

            return new string(passwordArray);
        }
    }
}
