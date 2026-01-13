using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/dashboard")]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminDashboardController> _logger;

        public AdminDashboardController(SegishopDbContext context, ILogger<AdminDashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get comprehensive dashboard statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<AdminDashboardStatsDto>> GetDashboardStats()
        {
            try
            {
                var now = DateTime.UtcNow;
                var thirtyDaysAgo = now.AddDays(-30);
                var sixtyDaysAgo = now.AddDays(-60);

                // Get current period stats
                var currentOrders = await _context.Orders
                    .Where(o => o.CreatedAt >= thirtyDaysAgo)
                    .Select(o => new { o.TotalAmount, o.Status })
                    .ToListAsync();

                var previousOrders = await _context.Orders
                    .Where(o => o.CreatedAt >= sixtyDaysAgo && o.CreatedAt < thirtyDaysAgo)
                    .Select(o => new { o.TotalAmount, o.Status })
                    .ToListAsync();

                // Calculate stats
                var totalRevenue = currentOrders.Where(o => o.Status == "Confirmed").Sum(o => o.TotalAmount);
                var previousRevenue = previousOrders.Where(o => o.Status == "Confirmed").Sum(o => o.TotalAmount);
                var revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

                var totalOrders = currentOrders.Count;
                var previousOrdersCount = previousOrders.Count;
                var ordersChange = previousOrdersCount > 0 ? ((totalOrders - previousOrdersCount) / (decimal)previousOrdersCount) * 100 : 0;

                var totalCustomers = await _context.Users.Where(u => u.Role == "Customer").CountAsync();
                var newCustomers = await _context.Users
                    .Where(u => u.Role == "Customer" && u.CreatedAt >= thirtyDaysAgo)
                    .CountAsync();
                var previousNewCustomers = await _context.Users
                    .Where(u => u.Role == "Customer" && u.CreatedAt >= sixtyDaysAgo && u.CreatedAt < thirtyDaysAgo)
                    .CountAsync();
                var customersChange = previousNewCustomers > 0 ? ((newCustomers - previousNewCustomers) / (decimal)previousNewCustomers) * 100 : 0;

                var totalProducts = await _context.Products.CountAsync();
                var activeProducts = await _context.Products.CountAsync(p => p.IsActive);

                // Get recent orders
                var recentOrders = await _context.Orders
                    .Include(o => o.User)
                    .OrderByDescending(o => o.CreatedAt)
                    .Take(5)
                    .Select(o => new AdminDashboardOrderDto
                    {
                        Id = o.Id,
                        OrderNumber = o.OrderNumber,
                        CustomerName = o.User != null
                            ? (o.User.FirstName + " " + o.User.LastName)
                            : "Guest",
                        CustomerEmail = o.User != null ? o.User.Email : string.Empty,
                        TotalAmount = o.TotalAmount,
                        Status = o.Status,
                        CreatedAt = o.CreatedAt,
                        ItemCount = o.OrderItems.Count()
                    })
                    .ToListAsync();

                // Get top products (mock for now - can be enhanced with actual sales data)
                var topProducts = await _context.Products
                    .Where(p => p.IsActive)
                    .OrderByDescending(p => p.Stock) // Using stock as proxy for popularity
                    .Take(4)
                    .Select(p => new AdminDashboardProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Sales = 0, // Would need order items analysis
                        Revenue = 0, // Would need order items analysis
                        ImageUrl = p.ImageUrl
                    })
                    .ToListAsync();

                var dashboardStats = new AdminDashboardStatsDto
                {
                    TotalRevenue = totalRevenue,
                    TotalOrders = totalOrders,
                    TotalCustomers = totalCustomers,
                    TotalProducts = totalProducts,
                    RevenueChange = (decimal)revenueChange,
                    OrdersChange = ordersChange,
                    CustomersChange = customersChange,
                    ProductsChange = 0, // Would need historical data
                    RecentOrders = recentOrders,
                    TopProducts = topProducts
                };

                return Ok(dashboardStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard statistics");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }
}
