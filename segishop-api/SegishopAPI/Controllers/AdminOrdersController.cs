using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SegishopAPI.Services;
using SegishopAPI.DTOs;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/orders")]
    [Authorize(Roles = "Admin")] // Require admin role for all endpoints
    public class AdminOrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<AdminOrdersController> _logger;

        public AdminOrdersController(IOrderService orderService, ILogger<AdminOrdersController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        /// <summary>
        /// Get all orders with filtering and pagination for admin
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<AdminOrderListResponseDto>> GetOrders([FromQuery] AdminOrderListRequestDto request)
        {
            try
            {
                var result = await _orderService.GetAdminOrdersAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin orders");
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Get order details by ID for admin
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminOrderDetailDto>> GetOrder(int id)
        {
            try
            {
                var order = await _orderService.GetAdminOrderByIdAsync(id);
                
                if (order == null)
                {
                    return NotFound(new { message = "Order not found" });
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin order {OrderId}", id);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Update order status
        /// </summary>
        [HttpPut("{id}/status")]
        public async Task<ActionResult<AdminOrderActionResponseDto>> UpdateOrderStatus(int id, [FromBody] DTOs.UpdateOrderStatusDto updateStatusDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _orderService.UpdateOrderStatusAdminAsync(id, updateStatusDto);
                
                if (!result.Success)
                {
                    if (result.ErrorCode == "ORDER_NOT_FOUND")
                    {
                        return NotFound(result);
                    }
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {OrderId}", id);
                return StatusCode(500, new AdminOrderActionResponseDto
                {
                    Success = false,
                    Message = "An internal error occurred",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }

        /// <summary>
        /// Update order details
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<AdminOrderActionResponseDto>> UpdateOrder(int id, [FromBody] UpdateOrderDto updateOrderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _orderService.UpdateOrderAsync(id, updateOrderDto);
                
                if (!result.Success)
                {
                    if (result.ErrorCode == "ORDER_NOT_FOUND")
                    {
                        return NotFound(result);
                    }
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order {OrderId}", id);
                return StatusCode(500, new AdminOrderActionResponseDto
                {
                    Success = false,
                    Message = "An internal error occurred",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }



        /// <summary>
        /// Get order statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<AdminOrderStatsDto>> GetOrderStats(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var stats = await _orderService.GetOrderStatsAsync(startDate, endDate);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order stats");
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Export orders to CSV
        /// </summary>
        [HttpGet("export")]
        public async Task<ActionResult> ExportOrders([FromQuery] AdminOrderListRequestDto request)
        {
            try
            {
                _logger.LogInformation("Starting order export with filters: Status={Status}, PaymentStatus={PaymentStatus}, StartDate={StartDate}, EndDate={EndDate}",
                    request.Status, request.PaymentStatus, request.StartDate, request.EndDate);

                // Set a large page size to get all orders for export (up to 50,000 orders)
                request.PageSize = 50000;
                request.Page = 1; // Always start from first page for export

                var result = await _orderService.GetAdminOrdersAsync(request);

                if (result.Orders == null || !result.Orders.Any())
                {
                    _logger.LogWarning("No orders found for export with current filters");
                    return BadRequest(new { message = "No orders found matching the specified criteria" });
                }

                var csv = GenerateOrdersCsv(result.Orders);
                var bytes = System.Text.Encoding.UTF8.GetBytes(csv);

                _logger.LogInformation("Successfully exported {OrderCount} orders", result.Orders.Count);

                var fileName = $"orders-export-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
                return File(bytes, "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting orders");
                return StatusCode(500, new { message = "An internal error occurred while exporting orders. Please try again." });
            }
        }

        private static string GenerateOrdersCsv(List<AdminOrderSummaryDto> orders)
        {
            var csv = new System.Text.StringBuilder();

            // Enhanced Header with available information
            csv.AppendLine("Order Number,Status,Payment Status,Payment Method,Customer Name,Customer Email,Total Amount,Discount Amount,Items Count,Created Date,Updated Date,Shipping City,Shipping State,Shipping Country,Shipping Method,Coupon Code,Payment Transaction ID");

            // Data rows with proper CSV escaping
            foreach (var order in orders)
            {
                var row = new[]
                {
                    EscapeCsvField(order.OrderNumber),
                    EscapeCsvField(order.Status),
                    EscapeCsvField(order.PaymentStatus),
                    EscapeCsvField(order.PaymentMethod ?? ""),
                    EscapeCsvField(order.CustomerName),
                    EscapeCsvField(order.CustomerEmail),
                    order.TotalAmount.ToString("F2"),
                    order.CouponDiscountAmount.ToString("F2"),
                    order.ItemCount.ToString(),
                    order.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                    order.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                    EscapeCsvField(order.ShippingCity),
                    EscapeCsvField(order.ShippingState),
                    EscapeCsvField(order.ShippingCountry),
                    EscapeCsvField(order.ShippingMethodTitle ?? ""),
                    EscapeCsvField(order.CouponCode ?? ""),
                    EscapeCsvField(order.PaymentTransactionId ?? "")
                };

                csv.AppendLine(string.Join(",", row));
            }

            return csv.ToString();
        }

        private static string EscapeCsvField(string field)
        {
            if (string.IsNullOrEmpty(field))
                return "\"\"";

            // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
            if (field.Contains("\"") || field.Contains(",") || field.Contains("\n") || field.Contains("\r"))
            {
                return "\"" + field.Replace("\"", "\"\"") + "\"";
            }

            return "\"" + field + "\"";
        }
    }
}
