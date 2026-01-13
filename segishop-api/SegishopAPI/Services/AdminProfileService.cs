using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;
using BCrypt.Net;

namespace SegishopAPI.Services
{
    public interface IAdminProfileService
    {
        Task<ProfileResponseDto> GetProfileAsync(int userId);
        Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto updateDto);
        Task<PasswordChangeResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<bool> UpdateLastLoginAsync(int userId);
    }

    public class AdminProfileService : IAdminProfileService
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminProfileService> _logger;

        public AdminProfileService(SegishopDbContext context, ILogger<AdminProfileService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ProfileResponseDto> GetProfileAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Id == userId && u.Role == "Admin")
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return new ProfileResponseDto
                    {
                        Success = false,
                        Message = "Admin user not found"
                    };
                }

                var profileDto = MapToProfileDto(user);

                return new ProfileResponseDto
                {
                    Success = true,
                    Message = "Profile retrieved successfully",
                    Profile = profileDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin profile for user {UserId}", userId);
                return new ProfileResponseDto
                {
                    Success = false,
                    Message = "An error occurred while retrieving the profile"
                };
            }
        }

        public async Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto updateDto)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Id == userId && u.Role == "Admin")
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return new ProfileResponseDto
                    {
                        Success = false,
                        Message = "Admin user not found"
                    };
                }

                // Update user properties
                user.FirstName = updateDto.FirstName;
                user.LastName = updateDto.LastName;
                user.Phone = updateDto.Phone;
                user.DateOfBirth = updateDto.DateOfBirth;
                user.Gender = updateDto.Gender;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin profile updated successfully for user {UserId}", userId);

                var updatedProfileDto = MapToProfileDto(user);

                return new ProfileResponseDto
                {
                    Success = true,
                    Message = "Profile updated successfully",
                    Profile = updatedProfileDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating admin profile for user {UserId}", userId);
                return new ProfileResponseDto
                {
                    Success = false,
                    Message = "An error occurred while updating the profile"
                };
            }
        }

        public async Task<PasswordChangeResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.Id == userId && u.Role == "Admin")
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return new PasswordChangeResponseDto
                    {
                        Success = false,
                        Message = "Admin user not found"
                    };
                }

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
                {
                    return new PasswordChangeResponseDto
                    {
                        Success = false,
                        Message = "Current password is incorrect",
                        Errors = new List<string> { "Current password is incorrect" }
                    };
                }

                // Hash new password
                var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

                // Update password
                user.PasswordHash = newPasswordHash;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Password changed successfully for admin user {UserId}", userId);

                return new PasswordChangeResponseDto
                {
                    Success = true,
                    Message = "Password changed successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for admin user {UserId}", userId);
                return new PasswordChangeResponseDto
                {
                    Success = false,
                    Message = "An error occurred while changing the password"
                };
            }
        }

        public async Task<bool> UpdateLastLoginAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.LastLoginAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating last login for user {UserId}", userId);
                return false;
            }
        }

        private AdminProfileDto MapToProfileDto(User user)
        {
            return new AdminProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
                IsActive = user.IsActive
            };
        }
    }
}
