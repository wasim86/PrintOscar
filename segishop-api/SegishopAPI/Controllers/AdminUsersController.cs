using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IAuthService _authService;
        private readonly ILogger<AdminUsersController> _logger;

        public AdminUsersController(
            SegishopDbContext context,
            IAuthService authService,
            ILogger<AdminUsersController> logger)
        {
            _context = context;
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Get all users for admin with pagination and filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<AdminUsersResponseDto>> GetUsers(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? role = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] DateTime? createdFrom = null,
            [FromQuery] DateTime? createdTo = null,
            [FromQuery] DateTime? lastLoginFrom = null,
            [FromQuery] DateTime? lastLoginTo = null,
            [FromQuery] string? gender = null,
            [FromQuery] string? customerSegment = null,
            [FromQuery] decimal? minTotalSpent = null,
            [FromQuery] decimal? maxTotalSpent = null,
            [FromQuery] int? minOrders = null,
            [FromQuery] int? maxOrders = null,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] string? sortOrder = "desc",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Users
                    .Include(u => u.Orders)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(u => 
                        u.Email.Contains(searchTerm) ||
                        u.FirstName.Contains(searchTerm) ||
                        u.LastName.Contains(searchTerm) ||
                        u.Phone.Contains(searchTerm));
                }

                if (!string.IsNullOrEmpty(role))
                {
                    query = query.Where(u => u.Role == role);
                }

                if (isActive.HasValue)
                {
                    query = query.Where(u => u.IsActive == isActive.Value);
                }

                if (createdFrom.HasValue)
                {
                    query = query.Where(u => u.CreatedAt >= createdFrom.Value);
                }

                if (createdTo.HasValue)
                {
                    query = query.Where(u => u.CreatedAt <= createdTo.Value);
                }

                if (lastLoginFrom.HasValue)
                {
                    query = query.Where(u => u.LastLoginAt >= lastLoginFrom.Value);
                }

                if (lastLoginTo.HasValue)
                {
                    query = query.Where(u => u.LastLoginAt <= lastLoginTo.Value);
                }

                if (!string.IsNullOrEmpty(gender))
                {
                    query = query.Where(u => u.Gender == gender);
                }

                // Calculate user stats for filtering
                var usersWithStats = query.Select(u => new
                {
                    User = u,
                    TotalOrders = u.Orders.Count(),
                    TotalSpent = u.Orders.Sum(o => o.TotalAmount)
                });

                if (minTotalSpent.HasValue)
                {
                    usersWithStats = usersWithStats.Where(u => u.TotalSpent >= minTotalSpent.Value);
                }

                if (maxTotalSpent.HasValue)
                {
                    usersWithStats = usersWithStats.Where(u => u.TotalSpent <= maxTotalSpent.Value);
                }

                if (minOrders.HasValue)
                {
                    usersWithStats = usersWithStats.Where(u => u.TotalOrders >= minOrders.Value);
                }

                if (maxOrders.HasValue)
                {
                    usersWithStats = usersWithStats.Where(u => u.TotalOrders <= maxOrders.Value);
                }

                // Apply sorting
                usersWithStats = sortBy?.ToLower() switch
                {
                    "email" => sortOrder?.ToLower() == "desc" 
                        ? usersWithStats.OrderByDescending(u => u.User.Email)
                        : usersWithStats.OrderBy(u => u.User.Email),
                    "firstname" => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.User.FirstName)
                        : usersWithStats.OrderBy(u => u.User.FirstName),
                    "lastname" => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.User.LastName)
                        : usersWithStats.OrderBy(u => u.User.LastName),
                    "role" => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.User.Role)
                        : usersWithStats.OrderBy(u => u.User.Role),
                    "isactive" => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.User.IsActive)
                        : usersWithStats.OrderBy(u => u.User.IsActive),
                    "lastloginat" => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.User.LastLoginAt)
                        : usersWithStats.OrderBy(u => u.User.LastLoginAt),
                    "totalorders" => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.TotalOrders)
                        : usersWithStats.OrderBy(u => u.TotalOrders),
                    "totalspent" => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.TotalSpent)
                        : usersWithStats.OrderBy(u => u.TotalSpent),
                    _ => sortOrder?.ToLower() == "desc"
                        ? usersWithStats.OrderByDescending(u => u.User.CreatedAt)
                        : usersWithStats.OrderBy(u => u.User.CreatedAt)
                };

                var totalCount = await usersWithStats.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var users = await usersWithStats
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new AdminCustomerDto
                    {
                        Id = u.User.Id,
                        Email = u.User.Email,
                        FirstName = u.User.FirstName,
                        LastName = u.User.LastName,
                        Phone = u.User.Phone,
                        DateOfBirth = u.User.DateOfBirth,
                        Gender = u.User.Gender,
                        Role = u.User.Role,
                        IsActive = u.User.IsActive,
                        CreatedAt = u.User.CreatedAt,
                        UpdatedAt = u.User.UpdatedAt,
                        LastLoginAt = u.User.LastLoginAt,
                        TotalOrders = u.TotalOrders,
                        TotalSpent = u.TotalSpent
                    })
                    .ToListAsync();

                return Ok(new AdminUsersResponseDto
                {
                    Success = true,
                    Users = users,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = totalPages
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users for admin");
                return StatusCode(500, new AdminUsersResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Get user by ID for admin with detailed information
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminUserResponseDto>> GetUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Orders)
                        .ThenInclude(o => o.OrderItems)
                    .Where(u => u.Id == id)
                    .Select(u => new AdminUserDetailDto
                    {
                        Id = u.Id,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Phone = u.Phone,
                        DateOfBirth = u.DateOfBirth,
                        Gender = u.Gender,
                        Role = u.Role,
                        IsActive = u.IsActive,
                        CreatedAt = u.CreatedAt,
                        UpdatedAt = u.UpdatedAt,
                        LastLoginAt = u.LastLoginAt,
                        TotalOrders = u.Orders.Count(),
                        TotalSpent = u.Orders.Sum(o => o.TotalAmount),
                        RecentOrders = u.Orders
                            .OrderByDescending(o => o.CreatedAt)
                            .Take(10)
                            .Select(o => new AdminUserOrderDto
                            {
                                Id = o.Id,
                                OrderDate = o.CreatedAt,
                                Total = o.TotalAmount,
                                Status = o.Status,
                                ItemCount = o.OrderItems.Count()
                            })
                            .ToList(),
                        Stats = new AdminUserStatsDto
                        {
                            TotalOrders = u.Orders.Count(),
                            TotalSpent = u.Orders.Sum(o => o.TotalAmount),
                            AverageOrderValue = u.Orders.Any() ? u.Orders.Average(o => o.TotalAmount) : 0,
                            FirstOrderDate = u.Orders.Any() ? u.Orders.Min(o => o.CreatedAt) : null,
                            LastOrderDate = u.Orders.Any() ? u.Orders.Max(o => o.CreatedAt) : null,
                            DaysSinceFirstOrder = u.Orders.Any() ? (DateTime.UtcNow - u.Orders.Min(o => o.CreatedAt)).Days : 0,
                            DaysSinceLastOrder = u.Orders.Any() ? (DateTime.UtcNow - u.Orders.Max(o => o.CreatedAt)).Days : -1,
                            CustomerSegment = u.Orders.Count() == 0 ? "New" :
                                            u.Orders.Count() >= 10 ? "VIP" :
                                            u.Orders.Count() >= 3 ? "Regular" :
                                            (DateTime.UtcNow - u.Orders.Max(o => o.CreatedAt)).Days > 90 ? "Inactive" : "Active"
                        }
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new AdminUserResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                return Ok(new AdminUserResponseDto
                {
                    Success = true,
                    User = user
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user {UserId} for admin", id);
                return StatusCode(500, new AdminUserResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Create a new user
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AdminUserResponseDto>> CreateUser([FromBody] CreateAdminUserDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminUserResponseDto
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                }

                // Check if email already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (existingUser != null)
                {
                    return BadRequest(new AdminUserResponseDto
                    {
                        Success = false,
                        Message = "Email is already in use"
                    });
                }

                // Generate password if not provided
                var password = !string.IsNullOrEmpty(request.Password)
                    ? request.Password
                    : _authService.GenerateStrongPassword();

                var user = new User
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Phone = request.Phone,
                    DateOfBirth = request.DateOfBirth,
                    Gender = request.Gender,
                    Role = request.Role,
                    IsActive = request.IsActive,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var createdUser = new AdminCustomerDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Phone = user.Phone,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    LastLoginAt = user.LastLoginAt,
                    TotalOrders = 0,
                    TotalSpent = 0
                };

                _logger.LogInformation("User created successfully with ID: {UserId}", user.Id);

                return Ok(new AdminUserResponseDto
                {
                    Success = true,
                    User = createdUser,
                    Message = $"User created successfully. {(string.IsNullOrEmpty(request.Password) ? $"Generated password: {password}" : "")}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, new AdminUserResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Update user
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<AdminUserResponseDto>> UpdateUser(int id, [FromBody] UpdateAdminUserDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AdminUserResponseDto
                    {
                        Success = false,
                        Message = "Invalid request data"
                    });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new AdminUserResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                // Check if email is being changed and if it's already taken by another user
                if (request.Email != user.Email)
                {
                    var emailExists = await _context.Users
                        .AnyAsync(u => u.Email == request.Email && u.Id != id);

                    if (emailExists)
                    {
                        return BadRequest(new AdminUserResponseDto
                        {
                            Success = false,
                            Message = "Email is already in use by another account"
                        });
                    }
                }

                // Update user properties
                user.Email = request.Email;
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Phone = request.Phone;
                user.DateOfBirth = request.DateOfBirth;
                user.Gender = request.Gender;
                user.Role = request.Role;
                user.IsActive = request.IsActive;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var userStats = await _context.Users
                    .Where(u => u.Id == id)
                    .Select(u => new
                    {
                        TotalOrders = u.Orders.Count(),
                        TotalSpent = u.Orders.Sum(o => o.TotalAmount)
                    })
                    .FirstOrDefaultAsync();

                var updatedUser = new AdminCustomerDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Phone = user.Phone,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    LastLoginAt = user.LastLoginAt,
                    TotalOrders = userStats?.TotalOrders ?? 0,
                    TotalSpent = userStats?.TotalSpent ?? 0
                };

                _logger.LogInformation("User updated successfully with ID: {UserId}", user.Id);

                return Ok(new AdminUserResponseDto
                {
                    Success = true,
                    User = updatedUser,
                    Message = "User updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", id);
                return StatusCode(500, new AdminUserResponseDto
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        /// <summary>
        /// Delete user (hard delete if no orders, soft delete if has orders)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Orders)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }

                // Check if user has orders
                if (user.Orders.Count > 0)
                {
                    // Soft delete by setting IsActive to false (preserve data integrity)
                    user.IsActive = false;
                    user.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("User soft deleted (has orders) with ID: {UserId}", user.Id);
                    return Ok(new {
                        success = true,
                        message = "User deactivated successfully (user has order history)",
                        deletionType = "soft"
                    });
                }
                else
                {
                    // Hard delete (no orders to preserve)
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("User hard deleted with ID: {UserId}", user.Id);
                    return Ok(new {
                        success = true,
                        message = "User deleted successfully",
                        deletionType = "hard"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Reset user password
        /// </summary>
        [HttpPost("{id}/reset-password")]
        public async Task<ActionResult> ResetUserPassword(int id, [FromBody] AdminUserPasswordResetDto request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "User not found" });
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Password reset for user ID: {UserId}", user.Id);

                return Ok(new { success = true, message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password for user {UserId}", id);
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }
}
