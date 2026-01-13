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
    public class PaymentRecordServiceTests : IDisposable
    {
        private readonly SegishopDbContext _context;
        private readonly PaymentRecordService _service;
        private readonly Mock<ILogger<PaymentRecordService>> _mockLogger;

        public PaymentRecordServiceTests()
        {
            var options = new DbContextOptionsBuilder<SegishopDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SegishopDbContext(options);
            _mockLogger = new Mock<ILogger<PaymentRecordService>>();
            var mockPaymentGatewayRefundService = new Mock<IPaymentGatewayRefundService>();
            _service = new PaymentRecordService(_context, _mockLogger.Object, mockPaymentGatewayRefundService.Object);





            SeedTestData();
        }

        private void SeedTestData()
        {
            // Create test order
            var order = new Order
            {
                Id = 1,
                OrderNumber = "ORD-TEST-001",
                Status = "Confirmed",
                PaymentStatus = "Paid",
                TotalAmount = 100.00m,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);

            // Create test payment record
            var payment = new PaymentRecord
            {
                Id = 1,
                OrderId = 1,
                PaymentMethod = "CreditCard",
                PaymentType = "Payment",
                Status = "Completed",
                Amount = 100.00m,
                Currency = "USD",
                TransactionId = "txn_test_123",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.PaymentRecords.Add(payment);
            _context.SaveChanges();
        }

        [Fact]
        public async Task CreatePaymentRecordAsync_ShouldCreatePaymentRecord_WhenValidDataProvided()
        {
            // Arrange
            var createDto = new CreatePaymentRecordDto
            {
                OrderId = 1,
                PaymentMethod = "PayPal",
                PaymentType = "Payment",
                Status = "Completed",
                Amount = 50.00m,
                Currency = "USD",
                TransactionId = "txn_paypal_456"
            };

            // Act
            var result = await _service.CreatePaymentRecordAsync(createDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(createDto.OrderId, result.OrderId);
            Assert.Equal(createDto.PaymentMethod, result.PaymentMethod);
            Assert.Equal(createDto.Amount, result.Amount);

            var paymentInDb = await _context.PaymentRecords.FindAsync(result.Id);
            Assert.NotNull(paymentInDb);
            Assert.Equal(createDto.TransactionId, paymentInDb.TransactionId);
        }

        [Fact]
        public async Task ProcessRefundAsync_ShouldCreateRefundRecord_WhenValidRefundRequested()
        {
            // Arrange
            var refundRequest = new RefundRequestDto
            {
                OrderId = 1,
                PaymentRecordId = 1,
                Amount = 30.00m,
                Reason = "Customer Request",
                Notes = "Test refund",
                NotifyCustomer = true
            };

            // Act
            var result = await _service.ProcessRefundAsync(refundRequest);

            // Assert
            Assert.True(result.Success);
            Assert.Equal(30.00m, result.RefundedAmount);
            Assert.Equal(70.00m, result.RemainingAmount);
            Assert.NotNull(result.RefundRecord);

            var refundInDb = await _context.PaymentRecords
                .FirstOrDefaultAsync(p => p.RefundedFromPaymentId == 1);
            Assert.NotNull(refundInDb);
            Assert.Equal("PartialRefund", refundInDb.PaymentType);
            Assert.Equal(30.00m, refundInDb.Amount);
        }

        [Fact]
        public async Task ProcessRefundAsync_ShouldFailRefund_WhenAmountExceedsAvailable()
        {
            // Arrange
            var refundRequest = new RefundRequestDto
            {
                OrderId = 1,
                PaymentRecordId = 1,
                Amount = 150.00m, // More than the original payment
                Reason = "Customer Request",
                NotifyCustomer = true
            };

            // Act
            var result = await _service.ProcessRefundAsync(refundRequest);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("INSUFFICIENT_REFUND_AMOUNT", result.ErrorCode);
            Assert.Contains("exceeds available amount", result.Message);
        }

        [Fact]
        public async Task GetOrderPaymentSummaryAsync_ShouldReturnCorrectSummary()
        {
            // Arrange
            // Add a refund to the existing payment
            var refund = new PaymentRecord
            {
                OrderId = 1,
                PaymentMethod = "CreditCard",
                PaymentType = "PartialRefund",
                Status = "Completed",
                Amount = 20.00m,
                Currency = "USD",
                RefundedFromPaymentId = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.PaymentRecords.Add(refund);
            await _context.SaveChangesAsync();

            // Act
            var summary = await _service.GetOrderPaymentSummaryAsync(1);

            // Assert
            Assert.Equal(100.00m, summary.TotalPaid);
            Assert.Equal(20.00m, summary.TotalRefunded);
            Assert.Equal(80.00m, summary.NetAmount);
            Assert.Equal(1, summary.PaymentCount);
            Assert.Equal(1, summary.RefundCount);
        }

        [Fact]
        public async Task GetOrderPaymentRecordsAsync_ShouldReturnAllRecordsForOrder()
        {
            // Act
            var records = await _service.GetOrderPaymentRecordsAsync(1);

            // Assert
            Assert.Single(records);
            Assert.Equal(1, records[0].OrderId);
            Assert.Equal("Payment", records[0].PaymentType);
        }

        [Fact]
        public async Task UpdatePaymentRecordStatusAsync_ShouldUpdateStatus_WhenRecordExists()
        {
            // Act
            var result = await _service.UpdatePaymentRecordStatusAsync(1, "Failed", "Payment failed due to insufficient funds");

            // Assert
            Assert.True(result);

            var updatedRecord = await _context.PaymentRecords.FindAsync(1);
            Assert.NotNull(updatedRecord);
            Assert.Equal("Failed", updatedRecord.Status);
            Assert.Contains("Payment failed due to insufficient funds", updatedRecord.Notes);
        }

        [Fact]
        public async Task UpdatePaymentRecordStatusAsync_ShouldReturnFalse_WhenRecordNotExists()
        {
            // Act
            var result = await _service.UpdatePaymentRecordStatusAsync(999, "Failed");

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetPaymentRecordByIdAsync_ShouldReturnRecord_WhenExists()
        {
            // Act
            var record = await _service.GetPaymentRecordByIdAsync(1);

            // Assert
            Assert.NotNull(record);
            Assert.Equal(1, record.Id);
            Assert.Equal("CreditCard", record.PaymentMethod);
        }

        [Fact]
        public async Task GetPaymentRecordByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            // Act
            var record = await _service.GetPaymentRecordByIdAsync(999);

            // Assert
            Assert.Null(record);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
