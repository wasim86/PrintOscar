using Microsoft.EntityFrameworkCore;
using SegishopAPI.Models;

namespace SegishopAPI.Data
{
    public static class ShippingSeedData
    {
        public static void SeedShippingData(ModelBuilder modelBuilder)
        {
            // Seed Shipping Classes (based on WooCommerce setup)
            modelBuilder.Entity<ShippingClass>().HasData(
                new ShippingClass
                {
                    Id = 1,
                    Name = "Segi Bella",
                    Slug = "segi-bella",
                    Description = "Standard shipping for Segi Bella products",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingClass
                {
                    Id = 2,
                    Name = "Segi Snacks - Bulk",
                    Slug = "segi-snacks-bulk",
                    Description = "Bulk snack orders requiring higher shipping costs",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingClass
                {
                    Id = 3,
                    Name = "Segi Snacks - Individual",
                    Slug = "segi-snacks-individual",
                    Description = "Individual snack packs",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingClass
                {
                    Id = 4,
                    Name = "Segi Snacks - Invoice_Event Wholesale",
                    Slug = "segi-snacks-invoice",
                    Description = "Wholesale invoice event orders",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingClass
                {
                    Id = 5,
                    Name = "Segi Snacks - Variety Box",
                    Slug = "segi-snacks-variety-box",
                    Description = "Variety box configurations",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingClass
                {
                    Id = 6,
                    Name = "Segi Snacks - Wholesale",
                    Slug = "segi-snacks-wholesale",
                    Description = "Wholesale snack orders",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Shipping Methods
            modelBuilder.Entity<ShippingMethod>().HasData(
                new ShippingMethod
                {
                    Id = 1,
                    Name = "Standard Shipping",
                    MethodType = "FlatRate",
                    Description = "Standard delivery service",
                    IsEnabled = true,
                    IsTaxable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingMethod
                {
                    Id = 2,
                    Name = "Express Shipping",
                    MethodType = "FlatRate",
                    Description = "Faster delivery service",
                    IsEnabled = true,
                    IsTaxable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingMethod
                {
                    Id = 3,
                    Name = "Next Day Air",
                    MethodType = "FlatRate",
                    Description = "Next business day delivery",
                    IsEnabled = true,
                    IsTaxable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingMethod
                {
                    Id = 4,
                    Name = "Free Standard Shipping",
                    MethodType = "FreeShipping",
                    Description = "Free shipping with conditions",
                    IsEnabled = true,
                    IsTaxable = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingMethod
                {
                    Id = 5,
                    Name = "Local Pickup",
                    MethodType = "LocalPickup",
                    Description = "Customer pickup at store location",
                    IsEnabled = true,
                    IsTaxable = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Shipping Zones
            modelBuilder.Entity<ShippingZone>().HasData(
                new ShippingZone
                {
                    Id = 1,
                    Name = "Local - 25miles",
                    Description = "Local delivery within 25 miles",
                    IsEnabled = true,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingZone
                {
                    Id = 2,
                    Name = "Zone 1 (East Coast and Nearby States)",
                    Description = "East coast states",
                    IsEnabled = true,
                    SortOrder = 2,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingZone
                {
                    Id = 3,
                    Name = "Zone 2 (Central U.S.)",
                    Description = "Central United States",
                    IsEnabled = true,
                    SortOrder = 3,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingZone
                {
                    Id = 4,
                    Name = "Zone 3 (West Coast and Distant States)",
                    Description = "West coast and distant states",
                    IsEnabled = true,
                    SortOrder = 4,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingZone
                {
                    Id = 5,
                    Name = "International - North America / Caribbean",
                    Description = "International shipping to North America",
                    IsEnabled = true,
                    SortOrder = 5,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingZone
                {
                    Id = 6,
                    Name = "International - South America",
                    Description = "International shipping to South America",
                    IsEnabled = true,
                    SortOrder = 6,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new ShippingZone
                {
                    Id = 7,
                    Name = "Rest of the world",
                    Description = "All other international destinations",
                    IsEnabled = true,
                    SortOrder = 7,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Shipping Zone Regions
            modelBuilder.Entity<ShippingZoneRegion>().HasData(
                // Local - 25miles regions
                new ShippingZoneRegion { Id = 1, ShippingZoneId = 1, RegionType = "State", RegionCode = "MD", RegionName = "Maryland", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 2, ShippingZoneId = 1, RegionType = "State", RegionCode = "VA", RegionName = "Virginia", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 3, ShippingZoneId = 1, RegionType = "State", RegionCode = "DC", RegionName = "District of Columbia", IsIncluded = true, Priority = 1 },

                // Zone 1 (East Coast) regions
                new ShippingZoneRegion { Id = 4, ShippingZoneId = 2, RegionType = "State", RegionCode = "DE", RegionName = "Delaware", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 5, ShippingZoneId = 2, RegionType = "State", RegionCode = "NJ", RegionName = "New Jersey", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 6, ShippingZoneId = 2, RegionType = "State", RegionCode = "NY", RegionName = "New York", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 7, ShippingZoneId = 2, RegionType = "State", RegionCode = "PA", RegionName = "Pennsylvania", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 8, ShippingZoneId = 2, RegionType = "State", RegionCode = "NC", RegionName = "North Carolina", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 9, ShippingZoneId = 2, RegionType = "State", RegionCode = "SC", RegionName = "South Carolina", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 10, ShippingZoneId = 2, RegionType = "State", RegionCode = "WV", RegionName = "West Virginia", IsIncluded = true, Priority = 1 },

                // Zone 2 (Central) regions
                new ShippingZoneRegion { Id = 11, ShippingZoneId = 3, RegionType = "State", RegionCode = "AL", RegionName = "Alabama", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 12, ShippingZoneId = 3, RegionType = "State", RegionCode = "AR", RegionName = "Arkansas", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 13, ShippingZoneId = 3, RegionType = "State", RegionCode = "GA", RegionName = "Georgia", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 14, ShippingZoneId = 3, RegionType = "State", RegionCode = "IL", RegionName = "Illinois", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 15, ShippingZoneId = 3, RegionType = "State", RegionCode = "IN", RegionName = "Indiana", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 16, ShippingZoneId = 3, RegionType = "State", RegionCode = "IA", RegionName = "Iowa", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 17, ShippingZoneId = 3, RegionType = "State", RegionCode = "KY", RegionName = "Kentucky", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 18, ShippingZoneId = 3, RegionType = "State", RegionCode = "LA", RegionName = "Louisiana", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 19, ShippingZoneId = 3, RegionType = "State", RegionCode = "MI", RegionName = "Michigan", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 20, ShippingZoneId = 3, RegionType = "State", RegionCode = "MN", RegionName = "Minnesota", IsIncluded = true, Priority = 1 },

                // International regions
                new ShippingZoneRegion { Id = 21, ShippingZoneId = 5, RegionType = "Country", RegionCode = "CA", RegionName = "Canada", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 22, ShippingZoneId = 6, RegionType = "Country", RegionCode = "BR", RegionName = "Brazil", IsIncluded = true, Priority = 1 },
                new ShippingZoneRegion { Id = 23, ShippingZoneId = 6, RegionType = "Country", RegionCode = "AR", RegionName = "Argentina", IsIncluded = true, Priority = 1 }
            );

            // Seed Shipping Zone Methods
            modelBuilder.Entity<ShippingZoneMethod>().HasData(
                // Local - 25miles methods
                new ShippingZoneMethod { Id = 1, ShippingZoneId = 1, ShippingMethodId = 1, Title = "Standard Shipping (3-10 business days)", IsEnabled = true, SortOrder = 1, BaseCost = 5.99m, MinOrderAmount = 75m, EstimatedDaysMin = 3, EstimatedDaysMax = 10 },
                new ShippingZoneMethod { Id = 2, ShippingZoneId = 1, ShippingMethodId = 2, Title = "Express Shipping (1-4 Business Days)", IsEnabled = true, SortOrder = 2, BaseCost = 15.00m, EstimatedDaysMin = 1, EstimatedDaysMax = 4 },
                new ShippingZoneMethod { Id = 3, ShippingZoneId = 1, ShippingMethodId = 3, Title = "Next Day Air (1 Business Day)", IsEnabled = true, SortOrder = 3, BaseCost = 25.00m, EstimatedDaysMin = 1, EstimatedDaysMax = 1 },
                new ShippingZoneMethod { Id = 4, ShippingZoneId = 1, ShippingMethodId = 4, Title = "Free Standard Shipping (3-10 Business Days)", IsEnabled = true, SortOrder = 4, BaseCost = 0m, MinOrderAmount = 75m, EstimatedDaysMin = 3, EstimatedDaysMax = 10 },
                new ShippingZoneMethod { Id = 5, ShippingZoneId = 1, ShippingMethodId = 5, Title = "Farmers Market Pickup: West End, Del Ray, Reston, or Crystal City", IsEnabled = true, SortOrder = 5, BaseCost = 0m, EstimatedDaysMin = 0, EstimatedDaysMax = 0 },

                // Zone 1 (East Coast) methods
                new ShippingZoneMethod { Id = 6, ShippingZoneId = 2, ShippingMethodId = 1, Title = "Standard Shipping (3-10 business days)", IsEnabled = true, SortOrder = 1, BaseCost = 8.99m, MinOrderAmount = 75m, EstimatedDaysMin = 3, EstimatedDaysMax = 10 },
                new ShippingZoneMethod { Id = 7, ShippingZoneId = 2, ShippingMethodId = 2, Title = "Express Shipping (1-4 Business Days)", IsEnabled = true, SortOrder = 2, BaseCost = 18.00m, EstimatedDaysMin = 1, EstimatedDaysMax = 4 },
                new ShippingZoneMethod { Id = 8, ShippingZoneId = 2, ShippingMethodId = 3, Title = "Next Day Air (1 Business Day)", IsEnabled = true, SortOrder = 3, BaseCost = 28.00m, EstimatedDaysMin = 1, EstimatedDaysMax = 1 },
                new ShippingZoneMethod { Id = 9, ShippingZoneId = 2, ShippingMethodId = 4, Title = "Free Standard Shipping (3-10 Business Days)", IsEnabled = true, SortOrder = 4, BaseCost = 0m, MinOrderAmount = 75m, EstimatedDaysMin = 3, EstimatedDaysMax = 10 },

                // Zone 2 (Central) methods
                new ShippingZoneMethod { Id = 10, ShippingZoneId = 3, ShippingMethodId = 1, Title = "Standard Shipping (3-10 business days)", IsEnabled = true, SortOrder = 1, BaseCost = 12.99m, MinOrderAmount = 75m, EstimatedDaysMin = 3, EstimatedDaysMax = 10 },
                new ShippingZoneMethod { Id = 11, ShippingZoneId = 3, ShippingMethodId = 2, Title = "Express Shipping (1-4 Business Days)", IsEnabled = true, SortOrder = 2, BaseCost = 22.00m, EstimatedDaysMin = 1, EstimatedDaysMax = 4 },
                new ShippingZoneMethod { Id = 12, ShippingZoneId = 3, ShippingMethodId = 3, Title = "Next Day Air (1 Business Day)", IsEnabled = true, SortOrder = 3, BaseCost = 32.00m, EstimatedDaysMin = 1, EstimatedDaysMax = 1 },
                new ShippingZoneMethod { Id = 13, ShippingZoneId = 3, ShippingMethodId = 4, Title = "Free Standard Shipping (3-10 Business Days)", IsEnabled = true, SortOrder = 4, BaseCost = 0m, MinOrderAmount = 75m, EstimatedDaysMin = 3, EstimatedDaysMax = 10 },

                // International methods
                new ShippingZoneMethod { Id = 14, ShippingZoneId = 5, ShippingMethodId = 1, Title = "International Flat Rate (6-20 Business Days)", IsEnabled = true, SortOrder = 1, BaseCost = 19.99m, EstimatedDaysMin = 6, EstimatedDaysMax = 20 },
                new ShippingZoneMethod { Id = 15, ShippingZoneId = 6, ShippingMethodId = 1, Title = "International Flat Rate (6-20 Business Days)", IsEnabled = true, SortOrder = 1, BaseCost = 24.99m, EstimatedDaysMin = 6, EstimatedDaysMax = 20 },
                new ShippingZoneMethod { Id = 16, ShippingZoneId = 7, ShippingMethodId = 1, Title = "International Flat Rate (6-20 Business Days)", IsEnabled = true, SortOrder = 1, BaseCost = 29.99m, EstimatedDaysMin = 6, EstimatedDaysMax = 20 }
            );
        }
    }
}
