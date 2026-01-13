using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SegishopAPI.Services;
using SegishopAPI.DTOs;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new order from checkout
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CreateOrderResponseDto>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToList();

                    return BadRequest(new CreateOrderResponseDto
                    {
                        Success = false,
                        Message = "Validation failed",
                        ValidationErrors = errors
                    });
                }

                var result = await _orderService.CreateOrderAsync(createOrderDto);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, new CreateOrderResponseDto
                {
                    Success = false,
                    Message = "An internal error occurred",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }

        /// <summary>
        /// Get order by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                
                if (order == null)
                {
                    return NotFound(new { message = "Order not found" });
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order {OrderId}", id);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Get order by order number
        /// </summary>
        [HttpGet("number/{orderNumber}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrderByNumber(string orderNumber)
        {
            try
            {
                var order = await _orderService.GetOrderByNumberAsync(orderNumber);
                
                if (order == null)
                {
                    return NotFound(new { message = "Order not found" });
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order {OrderNumber}", orderNumber);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Track order by order number and billing email (public endpoint)
        /// </summary>
        [HttpPost("track")]
        public async Task<ActionResult<OrderTrackingResponseDto>> TrackOrder([FromBody] TrackOrderRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new OrderTrackingResponseDto
                    {
                        Success = false,
                        Message = "Please provide valid order number and billing email.",
                        ErrorCode = "VALIDATION_ERROR"
                    });
                }

                var result = await _orderService.TrackOrderAsync(request);

                if (!result.Success)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking order {OrderNumber}", request.OrderNumber);
                return StatusCode(500, new OrderTrackingResponseDto
                {
                    Success = false,
                    Message = "An internal error occurred while tracking your order.",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }

        /// <summary>
        /// Get orders for a specific user
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<OrderListResponseDto>> GetUserOrders(
            int userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null)
        {
            try
            {
                var orders = await _orderService.GetOrdersAsync(page, pageSize, status, userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting orders for user {UserId}", userId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Update order status
        /// </summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] SimpleUpdateOrderStatusDto updateStatusDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _orderService.UpdateOrderStatusAsync(id, updateStatusDto.Status);
                
                if (!success)
                {
                    return NotFound(new { message = "Order not found" });
                }

                return Ok(new { message = "Order status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {OrderId}", id);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Generate a new order number (for testing purposes)
        /// </summary>
        [HttpGet("generate-order-number")]
        public async Task<ActionResult<string>> GenerateOrderNumber()
        {
            try
            {
                var orderNumber = await _orderService.GenerateOrderNumberAsync();
                return Ok(new { orderNumber });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating order number");
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }
    }

    public class SimpleUpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
