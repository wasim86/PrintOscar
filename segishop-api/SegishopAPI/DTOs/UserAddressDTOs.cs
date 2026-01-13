using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // User Address DTO for responses
    public class UserAddressDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string Address1 { get; set; } = string.Empty;
        public string? Address2 { get; set; }
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // Create User Address DTO
    public class CreateUserAddressDto
    {
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // 'Home', 'Work', 'Other'

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Company { get; set; }

        [Required]
        [StringLength(255)]
        public string Address1 { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Address2 { get; set; }

        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string State { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        public bool IsDefault { get; set; } = false;
    }

    // Update User Address DTO
    public class UpdateUserAddressDto
    {
        [StringLength(50)]
        public string? Type { get; set; }

        [StringLength(100)]
        public string? FirstName { get; set; }

        [StringLength(100)]
        public string? LastName { get; set; }

        [StringLength(100)]
        public string? Company { get; set; }

        [StringLength(255)]
        public string? Address1 { get; set; }

        [StringLength(255)]
        public string? Address2 { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(20)]
        public string? ZipCode { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        public bool? IsDefault { get; set; }
    }



    // User addresses list response
    public class UserAddressesResponseDto
    {
        public bool Success { get; set; } = true;
        public List<UserAddressDto> Addresses { get; set; } = new();
        public string? ErrorMessage { get; set; }
    }

    // Single address response
    public class UserAddressResponseDto
    {
        public bool Success { get; set; } = true;
        public UserAddressDto? Address { get; set; }
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
