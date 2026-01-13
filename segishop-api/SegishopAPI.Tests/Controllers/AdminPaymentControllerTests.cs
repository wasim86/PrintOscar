using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using System.Text.Json;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;
using Xunit;
using System.Net;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace SegishopAPI.Tests.Controllers
{
    public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public TestAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, "TestAdmin"),
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, "Test");

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }

    public class AdminPaymentControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public AdminPaymentControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove the existing DbContext registration
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<SegishopDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Add in-memory database for testing
                    services.AddDbContext<SegishopDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDb_" + Guid.NewGuid());
                    });

                    // Remove authentication for testing
                    services.AddAuthentication("Test")
                        .AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, TestAuthenticationHandler>(
                            "Test", options => { });
                });
            });

            _client = _factory.CreateClient();
            SeedTestData();
        }

        private void SeedTestData()
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<SegishopDbContext>();

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

            context.Orders.Add(order);

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

            context.PaymentRecords.Add(payment);
            context.SaveChanges();
        }

        [Fact]
        public async Task GetOrderPaymentSummary_ShouldReturnSummary_WhenOrderExists()
        {
            // Act
            var response = await _client.GetAsync("/api/admin/payments/order/1/summary");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var summary = JsonSerializer.Deserialize<PaymentSummaryDto>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(summary);
            Assert.Equal(100.00m, summary.TotalPaid);
            Assert.Equal(0m, summary.TotalRefunded);
            Assert.Equal(100.00m, summary.NetAmount);
            Assert.Equal(1, summary.PaymentCount);
            Assert.Equal(0, summary.RefundCount);
        }

        [Fact]
        public async Task GetOrderPaymentRecords_ShouldReturnRecords_WhenOrderExists()
        {
            // Act
            var response = await _client.GetAsync("/api/admin/payments/order/1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var records = JsonSerializer.Deserialize<List<PaymentRecordDto>>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(records);
            Assert.Single(records);
            Assert.Equal(1, records[0].OrderId);
            Assert.Equal("CreditCard", records[0].PaymentMethod);
            Assert.Equal("Payment", records[0].PaymentType);
            Assert.Equal(100.00m, records[0].Amount);
        }

        [Fact]
        public async Task GetPaymentRecord_ShouldReturnRecord_WhenExists()
        {
            // Act
            var response = await _client.GetAsync("/api/admin/payments/1");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var record = JsonSerializer.Deserialize<PaymentRecordDto>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(record);
            Assert.Equal(1, record.Id);
            Assert.Equal("txn_test_123", record.TransactionId);
        }

        [Fact]
        public async Task GetPaymentRecord_ShouldReturnNotFound_WhenNotExists()
        {
            // Act
            var response = await _client.GetAsync("/api/admin/payments/999");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task CreatePaymentRecord_ShouldCreateRecord_WhenValidDataProvided()
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
            var response = await _client.PostAsJsonAsync("/api/admin/payments", createDto);

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var record = JsonSerializer.Deserialize<PaymentRecordDto>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(record);
            Assert.Equal(createDto.PaymentMethod, record.PaymentMethod);
            Assert.Equal(createDto.Amount, record.Amount);
        }

        [Fact]
        public async Task CreatePaymentRecord_ShouldReturnBadRequest_WhenInvalidDataProvided()
        {
            // Arrange
            var createDto = new CreatePaymentRecordDto
            {
                // Missing required fields
                PaymentMethod = "",
                Amount = -10.00m // Invalid amount
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/admin/payments", createDto);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task ProcessRefund_ShouldCreateRefund_WhenValidRequestProvided()
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
            var response = await _client.PostAsJsonAsync("/api/admin/payments/refund", refundRequest);

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var refundResponse = JsonSerializer.Deserialize<RefundResponseDto>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(refundResponse);
            Assert.True(refundResponse.Success);
            Assert.Equal(30.00m, refundResponse.RefundedAmount);
            Assert.Equal(70.00m, refundResponse.RemainingAmount);
            Assert.NotNull(refundResponse.RefundRecord);
        }

        [Fact]
        public async Task ProcessRefund_ShouldReturnBadRequest_WhenAmountExceedsAvailable()
        {
            // Arrange
            var refundRequest = new RefundRequestDto
            {
                OrderId = 1,
                PaymentRecordId = 1,
                Amount = 150.00m, // More than available
                Reason = "Customer Request",
                NotifyCustomer = true
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/admin/payments/refund", refundRequest);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task UpdatePaymentRecordStatus_ShouldUpdateStatus_WhenValidDataProvided()
        {
            // Arrange
            var updateDto = new
            {
                Status = "Failed",
                Notes = "Payment failed due to insufficient funds"
            };

            // Act
            var response = await _client.PutAsJsonAsync("/api/admin/payments/1/status", updateDto);

            // Assert
            response.EnsureSuccessStatusCode();

            // Verify the update
            var getResponse = await _client.GetAsync("/api/admin/payments/1");
            var content = await getResponse.Content.ReadAsStringAsync();
            var record = JsonSerializer.Deserialize<PaymentRecordDto>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(record);
            Assert.Equal("Failed", record.Status);
            Assert.Contains("Payment failed due to insufficient funds", record.Notes);
        }

        [Fact]
        public async Task UpdatePaymentRecordStatus_ShouldReturnNotFound_WhenRecordNotExists()
        {
            // Arrange
            var updateDto = new
            {
                Status = "Failed"
            };

            // Act
            var response = await _client.PutAsJsonAsync("/api/admin/payments/999/status", updateDto);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
