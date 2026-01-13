using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // Admin User DTOs for customer management operations
    public class AdminCustomerDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public string FullName => $"{FirstName} {LastName}".Trim();
        public int DaysSinceRegistration => (DateTime.UtcNow - CreatedAt).Days;
        public int DaysSinceLastLogin => LastLoginAt.HasValue ? (DateTime.UtcNow - LastLoginAt.Value).Days : -1;
    }

    public class AdminUsersResponseDto
    {
        public bool Success { get; set; }
        public List<AdminCustomerDto> Users { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public string? Message { get; set; }
    }

    public class AdminUserResponseDto
    {
        public bool Success { get; set; }
        public AdminCustomerDto? User { get; set; }
        public string? Message { get; set; }
    }

    public class AdminUserDetailDto : AdminCustomerDto
    {
        public List<AdminUserOrderDto> RecentOrders { get; set; } = new();
        public AdminUserStatsDto Stats { get; set; } = new();
    }

    public class AdminUserOrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public int ItemCount { get; set; }
    }

    public class AdminUserStatsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal AverageOrderValue { get; set; }
        public DateTime? FirstOrderDate { get; set; }
        public DateTime? LastOrderDate { get; set; }
        public int DaysSinceFirstOrder { get; set; }
        public int DaysSinceLastOrder { get; set; }
        public string CustomerSegment { get; set; } = string.Empty; // New, Regular, VIP, Inactive
    }

    public class CreateAdminUserDto
    {
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        [StringLength(50)]
        public string Role { get; set; } = "Customer";

        public bool IsActive { get; set; } = true;

        [StringLength(100, MinimumLength = 6)]
        public string? Password { get; set; } // Optional - if not provided, system generates one
    }

    public class UpdateAdminUserDto
    {
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        [StringLength(50)]
        public string Role { get; set; } = "Customer";

        public bool IsActive { get; set; } = true;
    }

    public class AdminUsersSearchParams
    {
        public string? SearchTerm { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public DateTime? LastLoginFrom { get; set; }
        public DateTime? LastLoginTo { get; set; }
        public string? Gender { get; set; }
        public string? CustomerSegment { get; set; }
        public decimal? MinTotalSpent { get; set; }
        public decimal? MaxTotalSpent { get; set; }
        public int? MinOrders { get; set; }
        public int? MaxOrders { get; set; }
        public string SortBy { get; set; } = "createdAt";
        public string SortOrder { get; set; } = "desc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class AdminUserPasswordResetDto
    {
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; } = string.Empty;
    }

    public class AdminUserBulkActionDto
    {
        [Required]
        public List<int> UserIds { get; set; } = new();

        [Required]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // activate, deactivate, delete, changeRole

        public string? NewRole { get; set; } // For changeRole action
    }

    public class AdminUserAnalyticsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int NewUsersThisMonth { get; set; }
        public int NewUsersLastMonth { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageOrderValue { get; set; }
        public List<AdminUserSegmentDto> UserSegments { get; set; } = new();
        public List<AdminUserRegistrationTrendDto> RegistrationTrend { get; set; } = new();
    }

    public class AdminUserSegmentDto
    {
        public string Segment { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class AdminUserRegistrationTrendDto
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }
}
