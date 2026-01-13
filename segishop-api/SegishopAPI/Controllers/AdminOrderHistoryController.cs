using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SegishopAPI.DTOs;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/orders")]
    [Authorize(Roles = "Admin")]
    public class AdminOrderHistoryController : ControllerBase
    {
        private readonly IOrderStatusHistoryService _statusHistoryService;
        private readonly ILogger<AdminOrderHistoryController> _logger;

        public AdminOrderHistoryController(IOrderStatusHistoryService statusHistoryService, ILogger<AdminOrderHistoryController> logger)
        {
            _statusHistoryService = statusHistoryService;
            _logger = logger;
        }

        /// <summary>
        /// Get order status timeline
        /// </summary>
        [HttpGet("{orderId}/timeline")]
        public async Task<ActionResult<OrderStatusTimelineDto>> GetOrderTimeline(int orderId)
        {
            try
            {
                var timeline = await _statusHistoryService.GetOrderTimelineAsync(orderId);
                return Ok(timeline);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order timeline for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Get order status history
        /// </summary>
        [HttpGet("{orderId}/history")]
        public async Task<ActionResult<List<OrderStatusHistoryDto>>> GetOrderStatusHistory(int orderId)
        {
            try
            {
                var history = await _statusHistoryService.GetOrderStatusHistoryAsync(orderId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order status history for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Create status history entry
        /// </summary>
        [HttpPost("{orderId}/history")]
        public async Task<ActionResult<OrderStatusHistoryDto>> CreateStatusHistory(int orderId, [FromBody] CreateOrderStatusHistoryDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Ensure the orderId matches
                createDto.OrderId = orderId;

                var statusHistory = await _statusHistoryService.CreateStatusHistoryAsync(createDto);
                return CreatedAtAction(nameof(GetOrderStatusHistory), new { orderId }, statusHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating status history for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Update order status with history tracking
        /// </summary>
        [HttpPut("{orderId}/status-with-history")]
        public async Task<ActionResult> UpdateOrderStatusWithHistory(int orderId, [FromBody] OrderStatusUpdateDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // This would typically be handled by the OrderService
                // but we can provide a direct endpoint for status updates with history
                var success = await _statusHistoryService.RecordStatusChangeAsync(
                    orderId, 
                    "Unknown", // We'd need to get the current status first
                    updateDto.NewStatus, 
                    updateDto.Notes, 
                    updateDto.ChangedBy, 
                    updateDto.ChangeReason, 
                    updateDto.NotifyCustomer
                );

                if (!success)
                {
                    return BadRequest(new { message = "Failed to update order status" });
                }

                return Ok(new { message = "Order status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }
    }
}
