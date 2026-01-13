using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;

namespace SegishopAPI.Services
{
    public interface IShippingCalculationService
    {
        Task<List<ShippingOptionDto>> CalculateShippingOptionsAsync(CartSummaryDto cart, ShippingAddressDto address);
        Task<bool> IsZipCodeServiceableAsync(string zipCode, int shippingZoneId);
        Task<ShippingZone?> GetShippingZoneForAddressAsync(ShippingAddressDto address);
        Task<decimal> CalculateShippingCostAsync(int shippingZoneMethodId, CartSummaryDto cart);
        Task<decimal> CalculateTaxAsync(CartSummaryDto cart, ShippingAddressDto address, int? selectedShippingOptionId = null);
    }

    public class ShippingCalculationService : IShippingCalculationService
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<ShippingCalculationService> _logger;

        public ShippingCalculationService(SegishopDbContext context, ILogger<ShippingCalculationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<ShippingOptionDto>> CalculateShippingOptionsAsync(CartSummaryDto cart, ShippingAddressDto address)
        {
            try
            {
                // 1. Find the shipping zone for the address
                var shippingZone = await GetShippingZoneForAddressAsync(address);
                if (shippingZone == null)
                {
                    _logger.LogWarning("No shipping zone found for address: {State} {ZipCode}", address.State, address.ZipCode);
                    return new List<ShippingOptionDto>();
                }

                // 2. Get available shipping methods for this zone
                var zoneMethods = await _context.ShippingZoneMethods
                    .Include(zm => zm.ShippingMethod)
                    .Include(zm => zm.ClassCosts)
                        .ThenInclude(cc => cc.ShippingClass)
                    .Where(zm => zm.ShippingZoneId == shippingZone.Id && zm.IsEnabled)
                    .OrderBy(zm => zm.SortOrder)
                    .ToListAsync();

                var shippingOptions = new List<ShippingOptionDto>();

                const decimal FREE_SHIPPING_THRESHOLD = 120.00m;
                bool qualifiesForFreeShipping = cart.Subtotal >= FREE_SHIPPING_THRESHOLD;

                foreach (var zoneMethod in zoneMethods)
                {
                    var cost = await CalculateShippingCostAsync(zoneMethod.Id, cart);
                    var title = zoneMethod.Title;
                    bool shouldInclude = true;

                    // Handle Standard shipping (FlatRate) with free shipping logic
                    if (zoneMethod.ShippingMethod.MethodType == "FlatRate" && zoneMethod.ShippingMethod.Name.Contains("Standard"))
                    {
                        if (qualifiesForFreeShipping)
                        {
                            // Apply free shipping - set cost to 0 so frontend shows "FREE"
                            cost = 0;
                        }
                        // If not qualifying, show regular standard shipping with calculated cost
                    }
                    // Handle separate free shipping methods - don't show them as we use Standard shipping for free shipping
                    else if (zoneMethod.ShippingMethod.MethodType == "FreeShipping")
                    {
                        // Skip separate free shipping options
                        shouldInclude = false;
                    }

                    // Only add the option if it should be included
                    if (shouldInclude)
                    {
                        var option = new ShippingOptionDto
                        {
                            Id = zoneMethod.Id,
                            Title = title,
                            MethodType = zoneMethod.ShippingMethod.MethodType,
                            Cost = cost,
                            EstimatedDays = GetEstimatedDaysText(zoneMethod.EstimatedDaysMin, zoneMethod.EstimatedDaysMax),
                            IsTaxable = zoneMethod.ShippingMethod.IsTaxable,
                            IsEnabled = zoneMethod.IsEnabled
                        };

                        shippingOptions.Add(option);
                    }
                }

                return shippingOptions;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating shipping options for cart");
                return new List<ShippingOptionDto>();
            }
        }

        public async Task<bool> IsZipCodeServiceableAsync(string zipCode, int shippingZoneId)
        {
            try
            {
                var applicableRegions = await _context.ShippingZoneRegions
                    .Where(r => r.ShippingZoneId == shippingZoneId)
                    .Where(r => MatchesRegion(zipCode, r))
                    .OrderByDescending(r => r.Priority)
                    .ToListAsync();

                // If no matching regions, not serviceable
                if (!applicableRegions.Any()) return false;

                // Return the highest priority match
                return applicableRegions.First().IsIncluded;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking zip code serviceability: {ZipCode}", zipCode);
                return false;
            }
        }

        public async Task<ShippingZone?> GetShippingZoneForAddressAsync(ShippingAddressDto address)
        {
            try
            {
                var zones = await _context.ShippingZones
                    .Include(z => z.Regions)
                    .Where(z => z.IsEnabled)
                    .OrderBy(z => z.SortOrder)
                    .ToListAsync();

                foreach (var zone in zones)
                {
                    if (await IsAddressInZoneAsync(address, zone))
                    {
                        return zone;
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error finding shipping zone for address");
                return null;
            }
        }

        public async Task<decimal> CalculateShippingCostAsync(int shippingZoneMethodId, CartSummaryDto cart)
        {
            try
            {
                var zoneMethod = await _context.ShippingZoneMethods
                    .Include(zm => zm.ClassCosts)
                        .ThenInclude(cc => cc.ShippingClass)
                    .FirstOrDefaultAsync(zm => zm.Id == shippingZoneMethodId);

                if (zoneMethod == null) return 0;

                decimal totalCost = zoneMethod.BaseCost;

                // Calculate shipping class costs
                foreach (var item in cart.Items)
                {
                    var product = await _context.Products
                        .Include(p => p.ShippingClass)
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                    if (product?.ShippingClass != null)
                    {
                        var classCost = zoneMethod.ClassCosts
                            .FirstOrDefault(cc => cc.ShippingClassId == product.ShippingClassId);

                        if (classCost != null)
                        {
                            switch (classCost.CostType)
                            {
                                case "Fixed":
                                    totalCost += classCost.Cost;
                                    break;
                                case "PerItem":
                                    totalCost += classCost.Cost * item.Quantity;
                                    break;
                                case "Percentage":
                                    totalCost += (item.TotalPrice * classCost.Cost / 100);
                                    break;
                            }
                        }
                    }
                }

                return Math.Max(0, totalCost);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating shipping cost for zone method {ZoneMethodId}", shippingZoneMethodId);
                return 0;
            }
        }

        private async Task<bool> IsAddressInZoneAsync(ShippingAddressDto address, ShippingZone zone)
        {
            var applicableRegions = zone.Regions
                .Where(r => MatchesAddressRegion(address, r))
                .OrderByDescending(r => r.Priority)
                .ToList();

            if (!applicableRegions.Any()) return false;

            return applicableRegions.First().IsIncluded;
        }

        private bool MatchesRegion(string zipCode, ShippingZoneRegion region)
        {
            return region.RegionType switch
            {
                "State" => GetStateFromZip(zipCode) == region.RegionCode,
                "PostalCode" => zipCode == region.RegionCode,
                "PostalRange" => IsInRange(zipCode, region.RegionCode),
                "Country" => GetCountryFromZip(zipCode) == region.RegionCode,
                _ => false
            };
        }

        private bool MatchesAddressRegion(ShippingAddressDto address, ShippingZoneRegion region)
        {
            var state = address.State?.Trim() ?? string.Empty;
            var zip = address.ZipCode?.Trim() ?? string.Empty;
            var country = address.Country?.Trim() ?? string.Empty;

            switch (region.RegionType)
            {
                case "State":
                    var isCodeMatch = string.Equals(state, (region.RegionCode ?? string.Empty).Trim(), StringComparison.OrdinalIgnoreCase);
                    var isNameMatch = string.Equals(state, (region.RegionName ?? string.Empty).Trim(), StringComparison.OrdinalIgnoreCase);
                    if (isCodeMatch || isNameMatch) return true;
                    var zipState = GetStateFromZip(zip);
                    return string.Equals(zipState, region.RegionCode, StringComparison.OrdinalIgnoreCase);
                case "PostalCode":
                    return string.Equals(zip, region.RegionCode, StringComparison.OrdinalIgnoreCase);
                case "PostalRange":
                    return IsInRange(zip, region.RegionCode);
                case "Country":
                    return string.Equals(country, region.RegionCode, StringComparison.OrdinalIgnoreCase);
                default:
                    return false;
            }
        }

        private bool IsInRange(string zipCode, string range)
        {
            // Handle both formats: "20001-20099" and "20001...20099"
            string[] parts;
            if (range.Contains("..."))
            {
                parts = range.Split(new[] { "..." }, StringSplitOptions.None);
            }
            else
            {
                parts = range.Split('-');
            }

            if (parts.Length != 2) return false;

            var start = parts[0].Trim();
            var end = parts[1].Trim();

            return string.Compare(zipCode, start) >= 0 &&
                   string.Compare(zipCode, end) <= 0;
        }



        private string GetStateFromZip(string zipCode)
        {
            // Simple zip code to state mapping (you can expand this)
            if (zipCode.StartsWith("20") || zipCode.StartsWith("21")) return "MD";
            if (zipCode.StartsWith("22") || zipCode.StartsWith("23")) return "VA";
            if (zipCode.StartsWith("10") || zipCode.StartsWith("11") || zipCode.StartsWith("12") || zipCode.StartsWith("13") || zipCode.StartsWith("14")) return "NY";
            // Add more mappings as needed
            return "US"; // Default to US
        }

        private string GetCountryFromZip(string zipCode)
        {
            // Simple logic - can be enhanced
            return "US"; // Default to US for now
        }

        private string GetEstimatedDaysText(int? minDays, int? maxDays)
        {
            if (!minDays.HasValue && !maxDays.HasValue) return "Contact for delivery time";
            if (!minDays.HasValue) return $"Up to {maxDays} business days";
            if (!maxDays.HasValue) return $"{minDays}+ business days";
            if (minDays == maxDays) return $"{minDays} business day{(minDays == 1 ? "" : "s")}";
            return $"{minDays}-{maxDays} business days";
        }

        public async Task<decimal> CalculateTaxAsync(CartSummaryDto cart, ShippingAddressDto address, int? selectedShippingOptionId = null)
        {
            try
            {
                // Basic tax calculation - 8% for most states
                // In a real implementation, this would use a tax service like Avalara or TaxJar

                var taxableAmount = cart.Subtotal;

                // Add shipping cost to taxable amount if shipping is taxable
                if (selectedShippingOptionId.HasValue)
                {
                    var shippingCost = await CalculateShippingCostAsync(selectedShippingOptionId.Value, cart);

                    // Check if shipping method is taxable
                    var zoneMethod = await _context.ShippingZoneMethods
                        .Include(zm => zm.ShippingMethod)
                        .FirstOrDefaultAsync(zm => zm.Id == selectedShippingOptionId.Value);

                    if (zoneMethod?.ShippingMethod.IsTaxable == true)
                    {
                        taxableAmount += shippingCost;
                    }
                }

                // Apply tax rate based on state
                var taxRate = GetTaxRateForState(address.State);
                var taxAmount = taxableAmount * taxRate;

                return Math.Round(taxAmount, 2);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating tax for address: {State} {ZipCode}", address.State, address.ZipCode);
                return 0;
            }
        }

        private decimal GetTaxRateForState(string state)
        {
            // Simplified tax rates - in production, use a proper tax service
            return state.ToUpper() switch
            {
                "CA" => 0.0875m, // California
                "NY" => 0.08m,    // New York
                "TX" => 0.0625m,  // Texas
                "FL" => 0.06m,    // Florida
                "WA" => 0.065m,   // Washington
                "OR" => 0.0m,     // Oregon (no sales tax)
                "NH" => 0.0m,     // New Hampshire (no sales tax)
                "MT" => 0.0m,     // Montana (no sales tax)
                "DE" => 0.0m,     // Delaware (no sales tax)
                _ => 0.08m        // Default 8% for other states
            };
        }
    }
}
