using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class CategoryDto
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
        public List<CategoryDto> Children { get; set; } = new List<CategoryDto>();
        public int ProductCount { get; set; }
    }

    public class CreateCategoryDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public int? ParentId { get; set; }

        public int SortOrder { get; set; } = 0;

        [StringLength(255)]
        public string? Slug { get; set; }

        [StringLength(50)]
        public string ConfigurationType { get; set; } = "Regular";
    }

    public class FilterOptionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string FilterType { get; set; } = string.Empty;
        public decimal? MinValue { get; set; }
        public decimal? MaxValue { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public List<FilterOptionValueDto> FilterOptionValues { get; set; } = new List<FilterOptionValueDto>();
    }

    public class FilterOptionValueDto
    {
        public int Id { get; set; }
        public int FilterOptionId { get; set; }
        public string Value { get; set; } = string.Empty;
        public string DisplayValue { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ColorCode { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class ProductImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? AltText { get; set; }
        public int SortOrder { get; set; }
        public bool IsPrimary { get; set; }
    }

    public class ProductAttributeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }

    public class ProductDto
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
        public string? ParentCategoryName { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Slug { get; set; }
        public List<ProductImageDto> Images { get; set; } = new List<ProductImageDto>();
        public List<ProductAttributeDto> Attributes { get; set; } = new List<ProductAttributeDto>();
    }

    public class ProductListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? SalePrice { get; set; }
        public string? ImageUrl { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CategoryConfigurationType { get; set; } = "Regular";
        public bool HasActiveConfigurations { get; set; } = false; // Indicates if product actually has active configurations
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public int Stock { get; set; }
        public string? Slug { get; set; }
    }

    public class CreateProductRequestDto
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

        [StringLength(100)]
        public string? SKU { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } = 0;

        public string? ImageUrl { get; set; }

        public List<string>? ImageGallery { get; set; }

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

        public Dictionary<string, object>? Attributes { get; set; }
    }

    public class UpdateProductRequestDto
    {
        [StringLength(255)]
        public string? Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public string? LongDescription { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? Price { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? SalePrice { get; set; }

        [StringLength(100)]
        public string? SKU { get; set; }

        [Range(0, int.MaxValue)]
        public int? Stock { get; set; }

        public string? ImageUrl { get; set; }

        public List<string>? ImageGallery { get; set; }

        public int? CategoryId { get; set; }

        public bool? IsActive { get; set; }

        public bool? IsFeatured { get; set; }

        [StringLength(255)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }

        public Dictionary<string, object>? Attributes { get; set; }
    }

    public class ProductSearchRequestDto
    {
        public string? SearchTerm { get; set; }
        public int? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsActive { get; set; } = true;
        public bool? IsFeatured { get; set; }
        public bool? InStock { get; set; }

        // Filter values - key is filter name, value is list of selected values
        public Dictionary<string, List<string>> Filters { get; set; } = new Dictionary<string, List<string>>();

        public string? SortBy { get; set; } = "name"; // name, price, created, featured
        public string? SortOrder { get; set; } = "asc"; // asc, desc
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public bool IncludeFilters { get; set; } = false; // Whether to include available filters in response
    }

    // Custom model binder for handling filters from query string
    public class FilterDictionary : Dictionary<string, List<string>>
    {
        public FilterDictionary() : base() { }

        public FilterDictionary(IDictionary<string, List<string>> dictionary) : base(dictionary) { }
    }

    public class ProductSearchResponseDto
    {
        public List<ProductListDto> Products { get; set; } = new List<ProductListDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }

    }

    public class CreateProductImageDto
    {
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(255)]
        public string? AltText { get; set; }

        public int SortOrder { get; set; } = 0;
        public bool IsPrimary { get; set; } = false;
    }

    public class CreateProductAttributeDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Value { get; set; } = string.Empty;

        public int SortOrder { get; set; } = 0;
    }

    // Product Detail Enhancement DTOs
    public class ProductDetailDto : ProductDto
    {
        public ProductConfigurationDto? Configuration { get; set; }
        public List<ProductHighlightDto> Highlights { get; set; } = new();
        public List<ProductQuantitySetDto> QuantitySets { get; set; } = new();
        public List<ProductVarietyBoxOptionDto> VarietyBoxOptions { get; set; } = new();
        public List<ProductConfigurationItemDto> DynamicConfigurations { get; set; } = new();
    }

    public class ProductConfigurationDto
    {
        public int Id { get; set; }
        public string ConfigurationType { get; set; } = string.Empty;
        public bool HasQuantitySets { get; set; }
        public bool HasVarietyBoxOptions { get; set; }
        public bool HasBulkQuantity { get; set; }
        public int? MinBulkQuantity { get; set; }
        public int? MaxBulkQuantity { get; set; }
        public string? DefaultHighlight { get; set; }
    }

    public class ProductHighlightDto
    {
        public int Id { get; set; }
        public string Highlight { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }

    public class ProductQuantitySetDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal PriceMultiplier { get; set; }
        public bool IsDefault { get; set; }
        public int SortOrder { get; set; }
    }

    public class ProductVarietyBoxOptionDto
    {
        public int Id { get; set; }
        public string SlotName { get; set; } = string.Empty;
        public int SlotQuantity { get; set; }
        public int SortOrder { get; set; }
        public List<VarietyBoxSnackOptionDto> SnackOptions { get; set; } = new();
    }

    public class VarietyBoxSnackOptionDto
    {
        public int Id { get; set; }
        public int SnackProductId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string? Size { get; set; }
        public int SortOrder { get; set; }
    }

    // Request DTOs for creating/updating product configurations
    public class CreateProductConfigurationDto
    {
        [Required]
        public string ConfigurationType { get; set; } = string.Empty;
        public bool HasQuantitySets { get; set; } = false;
        public bool HasVarietyBoxOptions { get; set; } = false;
        public bool HasBulkQuantity { get; set; } = false;
        public int? MinBulkQuantity { get; set; }
        public int? MaxBulkQuantity { get; set; }
        public string? DefaultHighlight { get; set; }
    }

    public class CreateProductHighlightDto
    {
        [Required]
        [StringLength(500)]
        public string Highlight { get; set; } = string.Empty;
        public int SortOrder { get; set; } = 0;
    }

    public class CreateProductQuantitySetDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string DisplayName { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal PriceMultiplier { get; set; }

        public bool IsDefault { get; set; } = false;
        public int SortOrder { get; set; } = 0;
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasPreviousPage => Page > 1;
        public bool HasNextPage => Page < TotalPages;
    }
}
