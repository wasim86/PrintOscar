using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // Configuration Type DTOs
    public class ConfigurationTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsRequired { get; set; }
        public bool ShowPriceImpact { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<ConfigurationOptionDto> Options { get; set; } = new List<ConfigurationOptionDto>();
        public List<string> UsedInCategories { get; set; } = new List<string>();
    }

    public class CreateConfigurationTypeDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsRequired { get; set; } = false;
        public bool ShowPriceImpact { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateConfigurationTypeDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsRequired { get; set; } = false;
        public bool ShowPriceImpact { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    // Configuration Option DTOs
    public class ConfigurationOptionDto
    {
        public int Id { get; set; }
        public int ConfigurationTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? Sku { get; set; }
        public decimal PriceModifier { get; set; }
        public string PriceType { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateConfigurationOptionDto
    {
        [Required]
        public int ConfigurationTypeId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Value { get; set; } = string.Empty;

        public decimal PriceModifier { get; set; } = 0;

        [Required]
        [StringLength(20)]
        public string PriceType { get; set; } = "fixed";

        public bool IsDefault { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateConfigurationOptionDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Value { get; set; } = string.Empty;

        public decimal PriceModifier { get; set; } = 0;

        [Required]
        [StringLength(20)]
        public string PriceType { get; set; } = "fixed";

        public bool IsDefault { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    // Category Configuration Template DTOs
    public class CategoryConfigurationTemplateDto
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int ConfigurationTypeId { get; set; }
        public string ConfigurationTypeName { get; set; } = string.Empty;
        public string ConfigurationType { get; set; } = string.Empty;
        public bool IsRequired { get; set; }
        public int SortOrder { get; set; }
        public bool InheritToSubcategories { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateCategoryConfigurationTemplateDto
    {
        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int ConfigurationTypeId { get; set; }

        public bool IsRequired { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public bool InheritToSubcategories { get; set; } = true;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateCategoryConfigurationTemplateDto
    {
        public bool IsRequired { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public bool InheritToSubcategories { get; set; } = true;
        public bool IsActive { get; set; } = true;
    }

    // Category Template Summary DTO
    public class CategoryTemplateDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public List<TemplateConfigurationDto> Configurations { get; set; } = new List<TemplateConfigurationDto>();
        public bool IsActive { get; set; }
        public bool InheritToSubcategories { get; set; }
        public int ProductsCount { get; set; }
    }

    public class TemplateConfigurationDto
    {
        public int ConfigurationTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRequired { get; set; }
        public bool ShowPriceImpact { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public List<ConfigurationOptionDto> Options { get; set; } = new List<ConfigurationOptionDto>();
    }

    // Analytics DTOs
    public class ConfigurationAnalyticsDto
    {
        public decimal TotalRevenueImpact { get; set; }
        public int ActiveConfigurationsCount { get; set; }
        public decimal CompletionRate { get; set; }
        public decimal AverageOrderValueIncrease { get; set; }
        public List<ConfigurationPerformanceDto> ConfigurationPerformance { get; set; } = new List<ConfigurationPerformanceDto>();
    }

    public class ConfigurationPerformanceDto
    {
        public string ConfigurationTypeName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal UsageRate { get; set; }
        public decimal RevenueImpact { get; set; }
        public decimal AveragePriceIncrease { get; set; }
    }

    // Product Configuration Override DTOs
    public class ProductConfigurationOverrideDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSku { get; set; } = string.Empty;
        public int ConfigurationTypeId { get; set; }
        public string ConfigurationTypeName { get; set; } = string.Empty;
        public string ConfigurationType { get; set; } = string.Empty; // dropdown, radio, etc.
        public string OverrideType { get; set; } = string.Empty; // inherit, custom, disabled
        public string? CustomOptions { get; set; } // JSON for custom options
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateProductConfigurationOverrideDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public int ConfigurationTypeId { get; set; }

        [Required]
        [StringLength(20)]
        public string OverrideType { get; set; } = "inherit"; // inherit, custom, disabled

        public string? CustomOptions { get; set; } // JSON for custom options

        public bool IsActive { get; set; } = true;
    }

    public class UpdateProductConfigurationOverrideDto
    {
        [Required]
        [StringLength(20)]
        public string OverrideType { get; set; } = "inherit"; // inherit, custom, disabled

        public string? CustomOptions { get; set; } // JSON for custom options

        public bool IsActive { get; set; } = true;
    }

    // Product Override Summary DTO (for listing products with overrides)
    public class ProductOverrideSummaryDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSku { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int CategoryConfigurationsCount { get; set; } // Configurations from category
        public int ProductOverridesCount { get; set; } // Product-specific overrides
        public List<ProductConfigurationOverrideDto> Overrides { get; set; } = new List<ProductConfigurationOverrideDto>();
        public List<ConfigurationTypeDto> CategoryConfigurations { get; set; } = new List<ConfigurationTypeDto>();
    }

    // Merged Configuration DTO (category + product overrides combined)
    public class MergedProductConfigurationDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public List<ProductConfigurationItemDto> Configurations { get; set; } = new List<ProductConfigurationItemDto>();
    }

    public class ProductConfigurationItemDto
    {
        public int ConfigurationTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // dropdown, radio, etc.
        public string Source { get; set; } = string.Empty; // "category" or "override"
        public string OverrideType { get; set; } = string.Empty; // inherit, custom, disabled (only for overrides)
        public bool IsRequired { get; set; }
        public bool ShowPriceImpact { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public List<ConfigurationOptionDto> Options { get; set; } = new List<ConfigurationOptionDto>();
        public string? CustomOptions { get; set; } // JSON for custom options (only for overrides)
    }
}
