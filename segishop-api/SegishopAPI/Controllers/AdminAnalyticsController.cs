using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/analytics")]
    [Authorize(Roles = "Admin")]
    public class AdminAnalyticsController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminAnalyticsController> _logger;

        public AdminAnalyticsController(SegishopDbContext context, ILogger<AdminAnalyticsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get comprehensive analytics data
        /// </summary>
        [HttpGet("overview")]
        public async Task<ActionResult<AnalyticsOverviewDto>> GetAnalyticsOverview([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var now = DateTime.UtcNow;
                var start = startDate ?? now.AddDays(-30);
                var end = endDate ?? now;

                // Revenue Analytics
                var orders = await _context.Orders
                    .Where(o => o.CreatedAt >= start && o.CreatedAt <= end)
                    .ToListAsync();

                var confirmedOrders = orders.Where(o => o.Status == "Confirmed").ToList();
                var totalRevenue = confirmedOrders.Sum(o => o.TotalAmount);
                var totalOrders = orders.Count;
                var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                // Previous period comparison
                var previousStart = start.AddDays(-(end - start).Days);
                var previousEnd = start;
                var previousOrders = await _context.Orders
                    .Where(o => o.CreatedAt >= previousStart && o.CreatedAt < previousEnd)
                    .ToListAsync();

                var previousRevenue = previousOrders.Where(o => o.Status == "Confirmed").Sum(o => o.TotalAmount);
                var revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

                // Customer Analytics
                var totalCustomers = await _context.Users.Where(u => u.Role == "Customer").CountAsync();
                var newCustomers = await _context.Users
                    .Where(u => u.Role == "Customer" && u.CreatedAt >= start && u.CreatedAt <= end)
                    .CountAsync();

                // Product Analytics
                var totalProducts = await _context.Products.CountAsync();
                var activeProducts = await _context.Products.CountAsync(p => p.IsActive);

                // Revenue by day for chart
                var revenueByDay = orders
                    .Where(o => o.Status == "Confirmed")
                    .GroupBy(o => o.CreatedAt.Date)
                    .Select(g => new RevenueByDayDto
                    {
                        Date = g.Key,
                        Revenue = g.Sum(o => o.TotalAmount),
                        Orders = g.Count()
                    })
                    .OrderBy(x => x.Date)
                    .ToList();

                // Order status distribution
                var orderStatusDistribution = orders
                    .GroupBy(o => o.Status)
                    .Select(g => new OrderStatusDto
                    {
                        Status = g.Key,
                        Count = g.Count(),
                        Percentage = (decimal)g.Count() / totalOrders * 100
                    })
                    .ToList();

                // Top products by revenue
                var topProducts = await _context.OrderItems
                    .Include(oi => oi.Product)
                    .Include(oi => oi.Order)
                    .Where(oi => oi.Order.CreatedAt >= start && oi.Order.CreatedAt <= end && oi.Order.Status == "Confirmed")
                    .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
                    .Select(g => new TopProductDto
                    {
                        ProductId = g.Key.ProductId,
                        ProductName = g.Key.Name,
                        TotalSold = g.Sum(oi => oi.Quantity),
                        TotalRevenue = g.Sum(oi => oi.UnitPrice * oi.Quantity)
                    })
                    .OrderByDescending(p => p.TotalRevenue)
                    .Take(10)
                    .ToListAsync();

                // Customer insights
                var topCustomers = await _context.Orders
                    .Include(o => o.User)
                    .Where(o => o.CreatedAt >= start && o.CreatedAt <= end && o.Status == "Confirmed")
                    .Where(o => o.UserId.HasValue) // Only include orders with authenticated users
                    .GroupBy(o => new { o.UserId, o.User!.FirstName, o.User.LastName, o.User.Email })
                    .Select(g => new TopCustomerDto
                    {
                        CustomerId = g.Key.UserId!.Value,
                        CustomerName = $"{g.Key.FirstName} {g.Key.LastName}",
                        CustomerEmail = g.Key.Email,
                        TotalOrders = g.Count(),
                        TotalSpent = g.Sum(o => o.TotalAmount)
                    })
                    .OrderByDescending(c => c.TotalSpent)
                    .Take(10)
                    .ToListAsync();

                var analytics = new AnalyticsOverviewDto
                {
                    // KPIs
                    TotalRevenue = totalRevenue,
                    TotalOrders = totalOrders,
                    TotalCustomers = totalCustomers,
                    TotalProducts = totalProducts,
                    ActiveProducts = activeProducts,
                    NewCustomers = newCustomers,
                    AverageOrderValue = averageOrderValue,
                    RevenueGrowth = (decimal)revenueGrowth,

                    // Chart data
                    RevenueByDay = revenueByDay,
                    OrderStatusDistribution = orderStatusDistribution,
                    TopProducts = topProducts,
                    TopCustomers = topCustomers,

                    // Date range
                    StartDate = start,
                    EndDate = end
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting analytics overview");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get coupon analytics
        /// </summary>
        [HttpGet("coupons")]
        public async Task<ActionResult<CouponAnalyticsDto>> GetCouponAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var now = DateTime.UtcNow;
                var start = startDate ?? now.AddDays(-30);
                var end = endDate ?? now;

                var couponUsages = await _context.CouponUsages
                    .Include(cu => cu.Coupon)
                    .Include(cu => cu.Order)
                    .Where(cu => cu.UsedAt >= start && cu.UsedAt <= end)
                    .ToListAsync();

                var couponStats = couponUsages
                    .GroupBy(cu => new { cu.CouponId, cu.Coupon.Code, cu.Coupon.Type, cu.Coupon.Value })
                    .Select(g => new CouponAnalyticsStatsDto
                    {
                        CouponCode = g.Key.Code,
                        UsageCount = g.Count(),
                        TotalDiscount = g.Sum(cu => cu.DiscountAmount),
                        TotalRevenue = g.Sum(cu => cu.Order.TotalAmount)
                    })
                    .OrderByDescending(c => c.UsageCount)
                    .ToList();

                var analytics = new CouponAnalyticsDto
                {
                    TotalCouponsUsed = couponUsages.Count,
                    TotalDiscountGiven = couponUsages.Sum(cu => cu.DiscountAmount),
                    CouponStats = couponStats,
                    StartDate = start,
                    EndDate = end
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting coupon analytics");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }
}
