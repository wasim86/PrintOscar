using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Services
{
    public interface IAdminAuthService
    {
        Task<AdminAuthResponseDto> LoginAsync(AdminLoginRequestDto request);
        Task<AdminUserDto?> GetAdminByIdAsync(int userId);
        Task<AdminAuthResponseDto> ValidateAdminTokenAsync(string token);
        Task<AdminAuthResponseDto> CreateAdminUserAsync();
    }

    public class AdminAuthService : IAdminAuthService
    {
        private readonly SegishopDbContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<AdminAuthService> _logger;

        public AdminAuthService(
            SegishopDbContext context, 
            IAuthService authService,
            ILogger<AdminAuthService> logger)
        {
            _context = context;
            _authService = authService;
            _logger = logger;
        }

        public async Task<AdminAuthResponseDto> LoginAsync(AdminLoginRequestDto request)
        {
            try
            {
                // Find user by email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

                if (user == null)
                {
                    _logger.LogWarning("Admin login attempt with non-existent email: {Email}", request.Email);
                    return new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    _logger.LogWarning("Admin login attempt with invalid password for email: {Email}", request.Email);
                    return new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Check if user has admin role
                if (user.Role != "Admin")
                {
                    _logger.LogWarning("Non-admin user attempted admin login: {Email} with role: {Role}", request.Email, user.Role);
                    return new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Access denied. Admin privileges required."
                    };
                }

                // Update last login time
                user.LastLoginAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Generate JWT token
                var token = _authService.GenerateJwtToken(user.Id, user.Email, user.Role);

                _logger.LogInformation("Admin user logged in successfully: {Email}", user.Email);

                return new AdminAuthResponseDto
                {
                    Success = true,
                    Message = "Admin login successful",
                    Token = token,
                    User = new AdminUserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt,
                        LastLoginAt = user.LastLoginAt ?? DateTime.UtcNow
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during admin login for email: {Email}", request.Email);
                return new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred during login. Please try again."
                };
            }
        }

        public async Task<AdminUserDto?> GetAdminByIdAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && u.Role == "Admin");

                if (user == null)
                {
                    return null;
                }

                return new AdminUserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt,
                    LastLoginAt = user.LastLoginAt ?? DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin user by ID: {UserId}", userId);
                return null;
            }
        }

        public async Task<AdminAuthResponseDto> ValidateAdminTokenAsync(string token)
        {
            try
            {
                // This would typically involve JWT token validation
                // For now, we'll return a simple response
                // In a real implementation, you'd decode the JWT and validate it
                
                return new AdminAuthResponseDto
                {
                    Success = true,
                    Message = "Token is valid"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating admin token");
                return new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "Invalid token"
                };
            }
        }

        public async Task<AdminAuthResponseDto> CreateAdminUserAsync()
        {
            try
            {
                // Check if admin user already exists
                var existingAdmin = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == "admin@printoscar.com");

                if (existingAdmin != null)
                {
                    return new AdminAuthResponseDto
                    {
                        Success = false,
                        Message = "Admin user already exists"
                    };
                }

                // Create admin user
                var adminUser = new User
                {
                    Email = "admin@printoscar.com",
                    FirstName = "Admin",
                    LastName = "User",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin user created successfully: {Email}", adminUser.Email);

                return new AdminAuthResponseDto
                {
                    Success = true,
                    Message = "Admin user created successfully",
                    User = new AdminUserDto
                    {
                        Id = adminUser.Id,
                        Email = adminUser.Email,
                        FirstName = adminUser.FirstName,
                        LastName = adminUser.LastName,
                        Role = adminUser.Role,
                        CreatedAt = adminUser.CreatedAt,
                        LastLoginAt = adminUser.LastLoginAt ?? DateTime.UtcNow
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating admin user");
                return new AdminAuthResponseDto
                {
                    Success = false,
                    Message = "Failed to create admin user"
                };
            }
        }
    }
}
