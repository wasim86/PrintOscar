using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // Admin Shipping Zone DTOs
    public class AdminShippingZoneDto
    { 
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int RegionCount { get; set; }
        public int MethodCount { get; set; }
        public List<AdminShippingZoneRegionDto> Regions { get; set; } = new();
        public List<AdminShippingZoneMethodDto> Methods { get; set; } = new();
    }

    public class AdminShippingZoneRegionDto
    {
        public int Id { get; set; }
        public string RegionType { get; set; } = string.Empty;
        public string RegionCode { get; set; } = string.Empty;
        public string RegionName { get; set; } = string.Empty;
        public bool IsIncluded { get; set; }
        public int Priority { get; set; }
    }

    public class AdminShippingZoneMethodDto
    {
        public int Id { get; set; }
        public int ShippingMethodId { get; set; }
        public string ShippingMethodName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public int SortOrder { get; set; }
        public decimal BaseCost { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public int? EstimatedDaysMin { get; set; }
        public int? EstimatedDaysMax { get; set; }
        public List<AdminShippingClassCostDto> ClassCosts { get; set; } = new();
    }

    // Admin Shipping Method DTOs
    public class AdminShippingMethodDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MethodType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsTaxable { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int ZoneCount { get; set; }
    }

    // Admin Shipping Class DTOs
    public class AdminShippingClassDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int ProductCount { get; set; }
        public List<AdminShippingClassCostDto> ClassCosts { get; set; } = new();
    }

    public class AdminShippingClassCostDto
    {
        public int Id { get; set; }
        public int ShippingZoneMethodId { get; set; }
        public int ShippingClassId { get; set; }
        public string ShippingZoneName { get; set; } = string.Empty;
        public string ShippingMethodName { get; set; } = string.Empty;
        public string ShippingClassName { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string CostType { get; set; } = string.Empty;
    }

    // Create/Update DTOs
    public class CreateAdminShippingZoneDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsEnabled { get; set; } = true;
        public int SortOrder { get; set; } = 0;
    }

    public class UpdateAdminShippingZoneDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsEnabled { get; set; }
        public int SortOrder { get; set; }
    }

    public class CreateAdminShippingMethodDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string MethodType { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsEnabled { get; set; } = true;
        public bool IsTaxable { get; set; } = true;
    }

    public class UpdateAdminShippingMethodDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string MethodType { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsEnabled { get; set; }
        public bool IsTaxable { get; set; }
    }

    public class CreateAdminShippingClassDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Slug { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class UpdateAdminShippingClassDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Slug { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class CreateAdminShippingZoneMethodDto
    {
        [Required]
        public int ShippingZoneId { get; set; }

        [Required]
        public int ShippingMethodId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public bool IsEnabled { get; set; } = true;
        public int SortOrder { get; set; } = 0;
        public decimal BaseCost { get; set; } = 0;
        public decimal? MinOrderAmount { get; set; }
        public int? EstimatedDaysMin { get; set; }
        public int? EstimatedDaysMax { get; set; }
    }

    public class UpdateAdminShippingZoneMethodDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public bool IsEnabled { get; set; }
        public int SortOrder { get; set; }
        public decimal BaseCost { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public int? EstimatedDaysMin { get; set; }
        public int? EstimatedDaysMax { get; set; }
    }

    public class CreateAdminShippingClassCostDto
    {
        [Required]
        public int ShippingZoneMethodId { get; set; }

        [Required]
        public int ShippingClassId { get; set; }

        public decimal Cost { get; set; } = 0;

        [Required]
        [StringLength(20)]
        public string CostType { get; set; } = "Fixed";
    }

    public class UpdateAdminShippingClassCostDto
    {
        public decimal Cost { get; set; }

        [Required]
        [StringLength(20)]
        public string CostType { get; set; } = "Fixed";
    }

    public class CreateAdminShippingZoneRegionDto
    {
        [Required]
        public int ShippingZoneId { get; set; }

        [Required]
        [StringLength(20)]
        public string RegionType { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string RegionCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string RegionName { get; set; } = string.Empty;

        public bool IsIncluded { get; set; } = true;
        public int Priority { get; set; } = 1;
    }

    // Response DTOs
    public class AdminShippingZonesResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<AdminShippingZoneDto> Zones { get; set; } = new();
        public int TotalCount { get; set; }
    }

    public class AdminShippingZoneResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public AdminShippingZoneDto? Zone { get; set; }
    }

    public class AdminShippingMethodsResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<AdminShippingMethodDto> Methods { get; set; } = new();
        public int TotalCount { get; set; }
    }

    public class AdminShippingMethodResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public AdminShippingMethodDto? Method { get; set; }
    }

    public class AdminShippingClassesResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<AdminShippingClassDto> Classes { get; set; } = new();
        public int TotalCount { get; set; }
    }

    public class AdminShippingClassResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public AdminShippingClassDto? Class { get; set; }
    }

    public class AdminShippingClassCostsResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<AdminShippingClassCostDto> Costs { get; set; } = new();
        public int TotalCount { get; set; }
    }

    public class AdminShippingOverviewDto
    {
        public int TotalZones { get; set; }
        public int ActiveZones { get; set; }
        public int TotalMethods { get; set; }
        public int ActiveMethods { get; set; }
        public int TotalClasses { get; set; }
        public int TotalClassCosts { get; set; }
        public int ProductsWithShippingClass { get; set; }
        public int ProductsWithoutShippingClass { get; set; }
    }
}
