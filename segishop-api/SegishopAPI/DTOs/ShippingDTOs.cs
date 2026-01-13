using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // Shipping Address DTO
    public class ShippingAddressDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Address { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Apartment { get; set; }

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
    }

    // Shipping Option DTO (for customer selection)
    public class ShippingOptionDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string MethodType { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string EstimatedDays { get; set; } = string.Empty;
        public bool IsTaxable { get; set; }
        public bool IsEnabled { get; set; }
    }

    // Shipping Zone DTO
    public class ShippingZoneDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public int SortOrder { get; set; }
        public List<ShippingZoneRegionDto> Regions { get; set; } = new();
        public List<ShippingZoneMethodDto> Methods { get; set; } = new();
    }

    // Shipping Zone Region DTO
    public class ShippingZoneRegionDto
    {
        public int Id { get; set; }
        public int ShippingZoneId { get; set; }
        public string RegionType { get; set; } = string.Empty;
        public string RegionCode { get; set; } = string.Empty;
        public string RegionName { get; set; } = string.Empty;
        public bool IsIncluded { get; set; }
        public int Priority { get; set; }
    }

    // Shipping Zone Method DTO
    public class ShippingZoneMethodDto
    {
        public int Id { get; set; }
        public int ShippingZoneId { get; set; }
        public int ShippingMethodId { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public int SortOrder { get; set; }
        public decimal BaseCost { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public decimal? MaxOrderAmount { get; set; }
        public int? EstimatedDaysMin { get; set; }
        public int? EstimatedDaysMax { get; set; }
        public bool RequiresCoupon { get; set; }
        public string MethodName { get; set; } = string.Empty;
        public string MethodType { get; set; } = string.Empty;
        public List<ShippingClassCostDto> ClassCosts { get; set; } = new();
    }

    // Shipping Method DTO
    public class ShippingMethodDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MethodType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsTaxable { get; set; }
    }

    // Shipping Class DTO
    public class ShippingClassDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int ProductCount { get; set; }
    }

    // Shipping Class Cost DTO
    public class ShippingClassCostDto
    {
        public int Id { get; set; }
        public int ShippingZoneMethodId { get; set; }
        public int ShippingClassId { get; set; }
        public decimal Cost { get; set; }
        public string CostType { get; set; } = string.Empty;
        public string ShippingClassName { get; set; } = string.Empty;
    }

    // Create/Update DTOs
    public class CreateShippingZoneDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsEnabled { get; set; } = true;
        public int SortOrder { get; set; } = 0;
    }

    public class CreateShippingZoneRegionDto
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
        public int Priority { get; set; } = 0;
    }

    public class CreateShippingMethodDto
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

    public class CreateShippingZoneMethodDto
    {
        [Required]
        public int ShippingZoneId { get; set; }

        [Required]
        public int ShippingMethodId { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        public bool IsEnabled { get; set; } = true;
        public int SortOrder { get; set; } = 0;
        public decimal BaseCost { get; set; } = 0;
        public decimal? MinOrderAmount { get; set; }
        public decimal? MaxOrderAmount { get; set; }
        public int? EstimatedDaysMin { get; set; }
        public int? EstimatedDaysMax { get; set; }
        public bool RequiresCoupon { get; set; } = false;
    }

    public class CreateShippingClassDto
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

    public class CreateShippingClassCostDto
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

    // Shipping calculation request/response
    public class ShippingCalculationRequestDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public decimal Subtotal { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; } = new();
    }

    public class ShippingCalculationResponseDto
    {
        public List<ShippingOptionDto> Options { get; set; } = new();
        public string? ErrorMessage { get; set; }
        public bool Success { get; set; } = true;
    }

    // Tax calculation DTOs
    public class TaxCalculationRequestDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public decimal Subtotal { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; } = new();
        public int? SelectedShippingOptionId { get; set; }
    }

    public class TaxCalculationResponseDto
    {
        public decimal TaxAmount { get; set; }
        public decimal TaxRate { get; set; }
        public bool IsTaxable { get; set; }
        public string? ErrorMessage { get; set; }
        public bool Success { get; set; } = true;
    }

    // Order totals DTOs
    public class OrderTotalsRequestDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public decimal Subtotal { get; set; }
        public ShippingAddressDto ShippingAddress { get; set; } = new();
        public int? SelectedShippingOptionId { get; set; }
        public string? CouponCode { get; set; }
    }

    public class OrderTotalsDto
    {
        public decimal Subtotal { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal Total { get; set; }
        public string? AppliedCoupon { get; set; }
    }

    public class OrderTotalsResponseDto
    {
        public OrderTotalsDto Totals { get; set; } = new();
        public string? ErrorMessage { get; set; }
        public bool Success { get; set; } = true;
    }

    // Address validation DTOs
    public class AddressValidationResponseDto
    {
        public bool IsValid { get; set; }
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
        public bool Success { get; set; } = true;
        public int? ShippingZoneId { get; set; }
        public string? ShippingZoneName { get; set; }
    }
}
