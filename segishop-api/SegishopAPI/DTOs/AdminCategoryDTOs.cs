using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // Admin Category DTOs for CRUD operations
    public class AdminCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int? ParentId { get; set; }
        public string? ParentName { get; set; }
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
        public string? Slug { get; set; }
        public string ConfigurationType { get; set; } = "Regular";
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int ProductCount { get; set; }
        public int ChildrenCount { get; set; }
        public List<AdminCategoryDto> Children { get; set; } = new();
    }

    public class AdminCategoriesResponseDto
    {
        public bool Success { get; set; }
        public List<AdminCategoryDto> Categories { get; set; } = new();
        public int TotalCount { get; set; }
        public string? Message { get; set; }
    }

    public class AdminCategoryResponseDto
    {
        public bool Success { get; set; }
        public AdminCategoryDto? Category { get; set; }
        public string? Message { get; set; }
    }

    public class CreateAdminCategoryDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public int? ParentId { get; set; }

        public bool IsActive { get; set; } = true;

        [Range(0, int.MaxValue)]
        public int SortOrder { get; set; } = 0;

        [StringLength(255)]
        public string? Slug { get; set; }

        [StringLength(50)]
        public string ConfigurationType { get; set; } = "Regular";

        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }
    }

    public class UpdateAdminCategoryDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public int? ParentId { get; set; }

        public bool IsActive { get; set; } = true;

        [Range(0, int.MaxValue)]
        public int SortOrder { get; set; } = 0;

        [StringLength(255)]
        public string? Slug { get; set; }

        [StringLength(50)]
        public string ConfigurationType { get; set; } = "Regular";

        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }
    }
}
