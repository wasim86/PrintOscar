using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;

namespace SegishopAPI.Services
{
    public interface IOrderStatusHistoryService
    {
        Task<OrderStatusHistoryDto> CreateStatusHistoryAsync(CreateOrderStatusHistoryDto createDto);
        Task<OrderStatusTimelineDto> GetOrderTimelineAsync(int orderId);
        Task<List<OrderStatusHistoryDto>> GetOrderStatusHistoryAsync(int orderId);
        Task<bool> RecordStatusChangeAsync(int orderId, string fromStatus, string toStatus, string? notes = null, string? changedBy = null, string? changeReason = null, bool notifyCustomer = false);
    }

    public class OrderStatusHistoryService : IOrderStatusHistoryService
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<OrderStatusHistoryService> _logger;

        public OrderStatusHistoryService(SegishopDbContext context, ILogger<OrderStatusHistoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<OrderStatusHistoryDto> CreateStatusHistoryAsync(CreateOrderStatusHistoryDto createDto)
        {
            var statusHistory = new OrderStatusHistory
            {
                OrderId = createDto.OrderId,
                FromStatus = createDto.FromStatus,
                ToStatus = createDto.ToStatus,
                Notes = createDto.Notes,
                ChangedBy = createDto.ChangedBy,
                ChangeReason = createDto.ChangeReason,
                CustomerNotified = createDto.CustomerNotified,
                NotificationMethod = createDto.NotificationMethod,
                Metadata = createDto.Metadata,
                CreatedAt = DateTime.UtcNow
            };

            _context.OrderStatusHistory.Add(statusHistory);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order status history created: Order {OrderId} changed from {FromStatus} to {ToStatus}", 
                statusHistory.OrderId, statusHistory.FromStatus, statusHistory.ToStatus);

            return MapToDto(statusHistory);
        }

        public async Task<OrderStatusTimelineDto> GetOrderTimelineAsync(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                throw new ArgumentException($"Order with ID {orderId} not found");
            }

            var statusHistory = await _context.OrderStatusHistory
                .Where(h => h.OrderId == orderId)
                .OrderBy(h => h.CreatedAt)
                .ToListAsync();

            var milestones = GenerateStatusMilestones(order.Status, statusHistory);

            return new OrderStatusTimelineDto
            {
                OrderId = orderId,
                OrderNumber = order.OrderNumber,
                CurrentStatus = order.Status,
                StatusHistory = statusHistory.Select(MapToDto).ToList(),
                Milestones = milestones
            };
        }

        public async Task<List<OrderStatusHistoryDto>> GetOrderStatusHistoryAsync(int orderId)
        {
            var statusHistory = await _context.OrderStatusHistory
                .Where(h => h.OrderId == orderId)
                .OrderBy(h => h.CreatedAt)
                .ToListAsync();

            return statusHistory.Select(MapToDto).ToList();
        }

        public async Task<bool> RecordStatusChangeAsync(int orderId, string fromStatus, string toStatus, 
            string? notes = null, string? changedBy = null, string? changeReason = null, bool notifyCustomer = false)
        {
            try
            {
                var statusHistory = new OrderStatusHistory
                {
                    OrderId = orderId,
                    FromStatus = fromStatus,
                    ToStatus = toStatus,
                    Notes = notes,
                    ChangedBy = changedBy,
                    ChangeReason = changeReason ?? "AdminUpdate",
                    CustomerNotified = notifyCustomer,
                    NotificationMethod = notifyCustomer ? "Email" : null,
                    CreatedAt = DateTime.UtcNow
                };

                _context.OrderStatusHistory.Add(statusHistory);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Status change recorded: Order {OrderId} from {FromStatus} to {ToStatus} by {ChangedBy}", 
                    orderId, fromStatus, toStatus, changedBy ?? "System");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording status change for order {OrderId}", orderId);
                return false;
            }
        }

        private static List<StatusMilestoneDto> GenerateStatusMilestones(string currentStatus, List<OrderStatusHistory> statusHistory)
        {
            var standardMilestones = new List<string> { "Pending", "Confirmed", "Processing", "Shipped", "Delivered" };
            var milestones = new List<StatusMilestoneDto>();

            foreach (var milestone in standardMilestones)
            {
                var historyEntry = statusHistory.FirstOrDefault(h => h.ToStatus == milestone);
                var isCompleted = historyEntry != null;
                var isCurrent = currentStatus == milestone;

                milestones.Add(new StatusMilestoneDto
                {
                    Status = milestone,
                    Label = GetStatusLabel(milestone),
                    Description = GetStatusDescription(milestone),
                    IsCompleted = isCompleted,
                    IsCurrent = isCurrent,
                    CompletedAt = historyEntry?.CreatedAt,
                    CompletedBy = historyEntry?.ChangedBy,
                    Notes = historyEntry?.Notes
                });
            }

            // Handle special statuses like Cancelled or Failed
            if (currentStatus == "Cancelled" || currentStatus == "Failed")
            {
                var historyEntry = statusHistory.FirstOrDefault(h => h.ToStatus == currentStatus);
                milestones.Add(new StatusMilestoneDto
                {
                    Status = currentStatus,
                    Label = GetStatusLabel(currentStatus),
                    Description = GetStatusDescription(currentStatus),
                    IsCompleted = true,
                    IsCurrent = true,
                    CompletedAt = historyEntry?.CreatedAt,
                    CompletedBy = historyEntry?.ChangedBy,
                    Notes = historyEntry?.Notes
                });
            }

            return milestones;
        }

        private static string GetStatusLabel(string status)
        {
            return status switch
            {
                "Pending" => "Order Placed",
                "Confirmed" => "Order Confirmed",
                "Processing" => "Processing",
                "Shipped" => "Shipped",
                "Delivered" => "Delivered",
                "Cancelled" => "Cancelled",
                "Failed" => "Failed",
                _ => status
            };
        }

        private static string GetStatusDescription(string status)
        {
            return status switch
            {
                "Pending" => "Your order has been placed and is awaiting confirmation",
                "Confirmed" => "Your order has been confirmed and will be processed soon",
                "Processing" => "Your order is being prepared for shipment",
                "Shipped" => "Your order has been shipped and is on its way",
                "Delivered" => "Your order has been delivered successfully",
                "Cancelled" => "Your order has been cancelled",
                "Failed" => "Your order could not be processed",
                _ => $"Order status: {status}"
            };
        }

        private static OrderStatusHistoryDto MapToDto(OrderStatusHistory statusHistory)
        {
            return new OrderStatusHistoryDto
            {
                Id = statusHistory.Id,
                OrderId = statusHistory.OrderId,
                FromStatus = statusHistory.FromStatus,
                ToStatus = statusHistory.ToStatus,
                Notes = statusHistory.Notes,
                ChangedBy = statusHistory.ChangedBy,
                ChangeReason = statusHistory.ChangeReason,
                CustomerNotified = statusHistory.CustomerNotified,
                NotificationMethod = statusHistory.NotificationMethod,
                CreatedAt = statusHistory.CreatedAt,
                Metadata = statusHistory.Metadata
            };
        }
    }
}
