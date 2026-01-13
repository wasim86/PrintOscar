using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // Admin Product DTOs for CRUD operations
    public class AdminProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? LongDescription { get; set; }
        public decimal Price { get; set; }
        public decimal? SalePrice { get; set; }
        public string? SKU { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? Slug { get; set; }
        public int? ShippingClassId { get; set; }
        public string? ShippingClassName { get; set; }
        public List<ProductImageDto> Images { get; set; } = new();
        public List<ProductAttributeDto> Attributes { get; set; } = new();
        public List<ProductFilterValueDto> FilterValues { get; set; } = new();
    }

    public class ProductFilterValueDto
    {
        public int Id { get; set; }
        public int FilterOptionId { get; set; }
        public string FilterName { get; set; } = string.Empty;
        public string FilterDisplayName { get; set; } = string.Empty;
        public string FilterType { get; set; } = string.Empty;
        public int? FilterOptionValueId { get; set; }
        public string? Value { get; set; }
        public string? DisplayValue { get; set; }
        public string? CustomValue { get; set; }
        public decimal? NumericValue { get; set; }
    }

    public class AdminProductsResponseDto
    {
        public bool Success { get; set; }
        public List<AdminProductDto> Products { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }

    public class AdminProductStatsDto
    {
        public int TotalProducts { get; set; }
        public int ActiveProducts { get; set; }
        public int InactiveProducts { get; set; }
        public int LowStockProducts { get; set; }
        public int OutOfStockProducts { get; set; }
        public int InStockProducts { get; set; }
        public decimal TotalInventoryValue { get; set; }
        public int FeaturedProducts { get; set; }
    }

    public class CreateAdminProductDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public string? LongDescription { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? SalePrice { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } = 0;

        public string? ImageUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;

        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }

        public List<string>? ImageGallery { get; set; }
        public List<CreateProductAttributeDto>? Attributes { get; set; }
        public List<CreateProductFilterValueDto>? FilterValues { get; set; }
    }

    public class UpdateAdminProductDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public string? LongDescription { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? SalePrice { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        public string? ImageUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }

        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }

        public int? ShippingClassId { get; set; }

        public List<string>? ImageGallery { get; set; }
        public List<CreateProductAttributeDto>? Attributes { get; set; }
        public List<CreateProductFilterValueDto>? FilterValues { get; set; }
    }

    public class CreateProductFilterValueDto
    {
        [Required]
        public int FilterOptionId { get; set; }
        public int? FilterOptionValueId { get; set; }
        public string? CustomValue { get; set; }
        public decimal? NumericValue { get; set; }
    }

    public class AdminProductResponseDto
    {
        public bool Success { get; set; }
        public AdminProductDto? Product { get; set; }
        public string? Message { get; set; }
    }

    // Admin Filter Management DTOs
    public class AdminFilterOptionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string FilterType { get; set; } = string.Empty;
        public decimal? MinValue { get; set; }
        public decimal? MaxValue { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProductCount { get; set; } = 0; // Number of products using this filter
        public bool CanDelete { get; set; } = true; // Whether this filter can be deleted
        public List<AdminFilterOptionValueDto> FilterOptionValues { get; set; } = new();
    }

    public class AdminFilterOptionValueDto
    {
        public int Id { get; set; }
        public int FilterOptionId { get; set; }
        public string Value { get; set; } = string.Empty;
        public string DisplayValue { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ColorCode { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateAdminFilterOptionDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(255)]
        public string DisplayName { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(50)]
        public string FilterType { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal? MinValue { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? MaxValue { get; set; }

        [Range(0, int.MaxValue)]
        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public List<CreateAdminFilterOptionValueDto>? FilterOptionValues { get; set; }
    }

    public class UpdateAdminFilterOptionDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(255)]
        public string DisplayName { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(50)]
        public string FilterType { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal? MinValue { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? MaxValue { get; set; }

        [Range(0, int.MaxValue)]
        public int SortOrder { get; set; }

        public bool IsActive { get; set; }

        public List<CreateAdminFilterOptionValueDto>? FilterOptionValues { get; set; }
    }

    public class CreateAdminFilterOptionValueDto
    {
        [Required]
        [StringLength(255)]
        public string Value { get; set; } = string.Empty;

        [StringLength(255)]
        public string DisplayValue { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [StringLength(50)]
        public string? ColorCode { get; set; }

        [Range(0, int.MaxValue)]
        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }

    public class AdminFilterOptionsResponseDto
    {
        public bool Success { get; set; }
        public List<AdminFilterOptionDto> FilterOptions { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
        public string? Message { get; set; }
    }

    public class AdminFilterOptionResponseDto
    {
        public bool Success { get; set; }
        public AdminFilterOptionDto? FilterOption { get; set; }
        public string? Message { get; set; }
    }

    // DTOs for file-based product operations
    public class CreateAdminProductWithFilesDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public string? LongDescription { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? SalePrice { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } = 0;

        [Required]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;

        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }

        // File uploads
        public IFormFile? MainImage { get; set; }
        public List<IFormFile>? ImageGallery { get; set; }

        // Optional: Still support URL-based images for backward compatibility
        public string? ImageUrl { get; set; }
        public List<string>? ImageUrls { get; set; }

        public List<CreateProductAttributeDto>? Attributes { get; set; }
        public List<CreateProductFilterValueDto>? FilterValues { get; set; }
    }

    public class UpdateAdminProductWithFilesDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public string? LongDescription { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? SalePrice { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }

        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }

        // File uploads
        public IFormFile? MainImage { get; set; }
        public List<IFormFile>? ImageGallery { get; set; }

        // Optional: Still support URL-based images for backward compatibility
        public string? ImageUrl { get; set; }
        public List<string>? ImageUrls { get; set; }

        // Images to delete (file names)
        public List<string>? ImagesToDelete { get; set; }

        public List<CreateProductAttributeDto>? Attributes { get; set; }
        public List<CreateProductFilterValueDto>? FilterValues { get; set; }
    }
}
