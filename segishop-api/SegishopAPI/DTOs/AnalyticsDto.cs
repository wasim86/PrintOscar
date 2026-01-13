namespace SegishopAPI.DTOs
{
    public class AnalyticsOverviewDto
    {
        // KPIs
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalProducts { get; set; }
        public int ActiveProducts { get; set; }
        public int NewCustomers { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal RevenueGrowth { get; set; }

        // Chart data
        public List<RevenueByDayDto> RevenueByDay { get; set; } = new();
        public List<OrderStatusDto> OrderStatusDistribution { get; set; } = new();
        public List<TopProductDto> TopProducts { get; set; } = new();
        public List<TopCustomerDto> TopCustomers { get; set; } = new();

        // Date range
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class RevenueByDayDto
    {
        public DateTime Date { get; set; }
        public decimal Revenue { get; set; }
        public int Orders { get; set; }
    }

    public class OrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class TopProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class TopCustomerDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class CouponAnalyticsDto
    {
        public int TotalCouponsUsed { get; set; }
        public decimal TotalDiscountGiven { get; set; }
        public List<CouponAnalyticsStatsDto> CouponStats { get; set; } = new();
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class CouponAnalyticsStatsDto
    {
        public string CouponCode { get; set; } = string.Empty;
        public int UsageCount { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class ProductCategoryAnalyticsDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int ProductCount { get; set; }
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AveragePrice { get; set; }
    }

    public class MonthlyRevenueDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Orders { get; set; }
        public int NewCustomers { get; set; }
    }

    public class CustomerSegmentDto
    {
        public string SegmentName { get; set; } = string.Empty;
        public int CustomerCount { get; set; }
        public decimal AverageSpent { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal Percentage { get; set; }
    }

    public class InventoryAnalyticsDto
    {
        public int TotalProducts { get; set; }
        public int LowStockProducts { get; set; }
        public int OutOfStockProducts { get; set; }
        public List<LowStockProductDto> LowStockItems { get; set; } = new();
    }

    public class LowStockProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class SalesPerformanceDto
    {
        public decimal TodayRevenue { get; set; }
        public int TodayOrders { get; set; }
        public decimal WeekRevenue { get; set; }
        public int WeekOrders { get; set; }
        public decimal MonthRevenue { get; set; }
        public int MonthOrders { get; set; }
        public decimal YearRevenue { get; set; }
        public int YearOrders { get; set; }
    }

    public class ConversionAnalyticsDto
    {
        public int TotalVisitors { get; set; }
        public int TotalOrders { get; set; }
        public decimal ConversionRate { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal RevenuePerVisitor { get; set; }
    }
}
