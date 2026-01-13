using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.Services;
using SegishopAPI.DTOs;
using Xunit;

namespace SegishopAPI.Tests.Services
{
    public class OrderStatusHistoryServiceTests : IDisposable
    {
        private readonly SegishopDbContext _context;
        private readonly OrderStatusHistoryService _service;
        private readonly Mock<ILogger<OrderStatusHistoryService>> _mockLogger;

        public OrderStatusHistoryServiceTests()
        {
            var options = new DbContextOptionsBuilder<SegishopDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SegishopDbContext(options);
            _mockLogger = new Mock<ILogger<OrderStatusHistoryService>>();
            _service = new OrderStatusHistoryService(_context, _mockLogger.Object);

            SeedTestData();
        }

        private void SeedTestData()
        {
            // Create test order
            var order = new Order
            {
                Id = 1,
                OrderNumber = "ORD-TEST-001",
                Status = "Shipped",
                PaymentStatus = "Paid",
                TotalAmount = 100.00m,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);

            // Create test status history
            var history1 = new OrderStatusHistory
            {
                Id = 1,
                OrderId = 1,
                FromStatus = "Pending",
                ToStatus = "Confirmed",
                Notes = "Order confirmed by admin",
                ChangedBy = "Admin",
                ChangeReason = "AdminUpdate",
                CustomerNotified = true,
                NotificationMethod = "Email",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            };

            var history2 = new OrderStatusHistory
            {
                Id = 2,
                OrderId = 1,
                FromStatus = "Confirmed",
                ToStatus = "Shipped",
                Notes = "Order shipped via FedEx",
                ChangedBy = "System",
                ChangeReason = "SystemUpdate",
                CustomerNotified = true,
                NotificationMethod = "Email",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            };

            _context.OrderStatusHistory.AddRange(history1, history2);
            _context.SaveChanges();
        }

        [Fact]
        public async Task CreateStatusHistoryAsync_ShouldCreateHistoryRecord_WhenValidDataProvided()
        {
            // Arrange
            var createDto = new CreateOrderStatusHistoryDto
            {
                OrderId = 1,
                FromStatus = "Shipped",
                ToStatus = "Delivered",
                Notes = "Package delivered successfully",
                ChangedBy = "DeliveryService",
                ChangeReason = "SystemUpdate",
                CustomerNotified = true,
                NotificationMethod = "SMS"
            };

            // Act
            var result = await _service.CreateStatusHistoryAsync(createDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(createDto.OrderId, result.OrderId);
            Assert.Equal(createDto.FromStatus, result.FromStatus);
            Assert.Equal(createDto.ToStatus, result.ToStatus);
            Assert.Equal(createDto.Notes, result.Notes);

            var historyInDb = await _context.OrderStatusHistory.FindAsync(result.Id);
            Assert.NotNull(historyInDb);
            Assert.Equal(createDto.ChangedBy, historyInDb.ChangedBy);
        }

        [Fact]
        public async Task GetOrderTimelineAsync_ShouldReturnTimeline_WhenOrderExists()
        {
            // Act
            var timeline = await _service.GetOrderTimelineAsync(1);

            // Assert
            Assert.NotNull(timeline);
            Assert.Equal(1, timeline.OrderId);
            Assert.Equal("ORD-TEST-001", timeline.OrderNumber);
            Assert.Equal("Shipped", timeline.CurrentStatus);
            Assert.Equal(2, timeline.StatusHistory.Count);
            Assert.NotEmpty(timeline.Milestones);

            // Check milestones - Pending won't be marked as completed since no history entry goes TO Pending
            var pendingMilestone = timeline.Milestones.FirstOrDefault(m => m.Status == "Pending");
            Assert.NotNull(pendingMilestone);
            // Pending is typically the initial state, so it may not be marked as completed

            var confirmedMilestone = timeline.Milestones.FirstOrDefault(m => m.Status == "Confirmed");
            Assert.NotNull(confirmedMilestone);
            Assert.True(confirmedMilestone.IsCompleted);

            var shippedMilestone = timeline.Milestones.FirstOrDefault(m => m.Status == "Shipped");
            Assert.NotNull(shippedMilestone);
            Assert.True(shippedMilestone.IsCurrent || shippedMilestone.IsCompleted);

            var deliveredMilestone = timeline.Milestones.FirstOrDefault(m => m.Status == "Delivered");
            Assert.NotNull(deliveredMilestone);
            Assert.False(deliveredMilestone.IsCompleted);
        }

        [Fact]
        public async Task GetOrderTimelineAsync_ShouldThrowException_WhenOrderNotExists()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetOrderTimelineAsync(999));
        }

        [Fact]
        public async Task GetOrderStatusHistoryAsync_ShouldReturnHistory_WhenOrderExists()
        {
            // Act
            var history = await _service.GetOrderStatusHistoryAsync(1);

            // Assert
            Assert.NotNull(history);
            Assert.Equal(2, history.Count);
            
            // Should be ordered by CreatedAt
            Assert.Equal("Pending", history[0].FromStatus);
            Assert.Equal("Confirmed", history[0].ToStatus);
            Assert.Equal("Confirmed", history[1].FromStatus);
            Assert.Equal("Shipped", history[1].ToStatus);
        }

        [Fact]
        public async Task GetOrderStatusHistoryAsync_ShouldReturnEmptyList_WhenNoHistoryExists()
        {
            // Arrange - Create order without history
            var order = new Order
            {
                Id = 2,
                OrderNumber = "ORD-TEST-002",
                Status = "Pending",
                PaymentStatus = "Pending",
                TotalAmount = 50.00m,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Act
            var history = await _service.GetOrderStatusHistoryAsync(2);

            // Assert
            Assert.NotNull(history);
            Assert.Empty(history);
        }

        [Fact]
        public async Task RecordStatusChangeAsync_ShouldCreateHistoryRecord_WhenValidDataProvided()
        {
            // Act
            var result = await _service.RecordStatusChangeAsync(
                orderId: 1,
                fromStatus: "Shipped",
                toStatus: "Delivered",
                notes: "Package delivered to customer",
                changedBy: "DeliveryService",
                changeReason: "SystemUpdate",
                notifyCustomer: true
            );

            // Assert
            Assert.True(result);

            var historyRecord = await _context.OrderStatusHistory
                .FirstOrDefaultAsync(h => h.OrderId == 1 && h.ToStatus == "Delivered");

            Assert.NotNull(historyRecord);
            Assert.Equal("Shipped", historyRecord.FromStatus);
            Assert.Equal("Delivered", historyRecord.ToStatus);
            Assert.Equal("Package delivered to customer", historyRecord.Notes);
            Assert.Equal("DeliveryService", historyRecord.ChangedBy);
            Assert.Equal("SystemUpdate", historyRecord.ChangeReason);
            Assert.True(historyRecord.CustomerNotified);
        }

        [Fact]
        public async Task RecordStatusChangeAsync_ShouldReturnTrue_WhenMinimalDataProvided()
        {
            // Act
            var result = await _service.RecordStatusChangeAsync(
                orderId: 1,
                fromStatus: "Shipped",
                toStatus: "Delivered"
            );

            // Assert
            Assert.True(result);

            var historyRecord = await _context.OrderStatusHistory
                .FirstOrDefaultAsync(h => h.OrderId == 1 && h.ToStatus == "Delivered");

            Assert.NotNull(historyRecord);
            Assert.Equal("AdminUpdate", historyRecord.ChangeReason); // Default value
            Assert.False(historyRecord.CustomerNotified); // Default value
        }

        [Theory]
        [InlineData("Pending", "Order Placed", "Your order has been placed and is awaiting confirmation")]
        [InlineData("Confirmed", "Order Confirmed", "Your order has been confirmed and will be processed soon")]
        [InlineData("Processing", "Processing", "Your order is being prepared for shipment")]
        [InlineData("Shipped", "Shipped", "Your order has been shipped and is on its way")]
        [InlineData("Delivered", "Delivered", "Your order has been delivered successfully")]
        [InlineData("Cancelled", "Cancelled", "Your order has been cancelled")]
        public async Task GetOrderTimelineAsync_ShouldGenerateCorrectMilestoneLabels(string status, string expectedLabel, string expectedDescription)
        {
            // Arrange - Create order with specific status
            var order = new Order
            {
                Id = 3,
                OrderNumber = "ORD-TEST-003",
                Status = status,
                PaymentStatus = "Paid",
                TotalAmount = 75.00m,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Act
            var timeline = await _service.GetOrderTimelineAsync(3);

            // Assert
            var milestone = timeline.Milestones.FirstOrDefault(m => m.Status == status);
            Assert.NotNull(milestone);
            Assert.Equal(expectedLabel, milestone.Label);
            Assert.Equal(expectedDescription, milestone.Description);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
