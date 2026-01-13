using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class TestPaymentGatewayController : ControllerBase
    {
        private readonly IPaymentGatewayRefundService _paymentGatewayRefundService;
        private readonly ILogger<TestPaymentGatewayController> _logger;
        private readonly IConfiguration _configuration;

        public TestPaymentGatewayController(
            IPaymentGatewayRefundService paymentGatewayRefundService,
            ILogger<TestPaymentGatewayController> logger,
            IConfiguration configuration)
        {
            _paymentGatewayRefundService = paymentGatewayRefundService;
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Test payment gateway configuration
        /// </summary>
        [HttpGet("config-test")]
        public ActionResult TestConfiguration()
        {
            try
            {
                var stripeKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? 
                               _configuration["Stripe:SecretKey"];
                var paypalClientId = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID") ?? 
                                    _configuration["PayPal:ClientId"];
                var paypalSecret = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_SECRET") ?? 
                                  _configuration["PayPal:ClientSecret"];

                var result = new
                {
                    success = true,
                    message = "Payment gateway configuration test",
                    stripe = new
                    {
                        configured = !string.IsNullOrEmpty(stripeKey),
                        keyPrefix = stripeKey?.Substring(0, Math.Min(7, stripeKey.Length)) + "..."
                    },
                    paypal = new
                    {
                        configured = !string.IsNullOrEmpty(paypalClientId) && !string.IsNullOrEmpty(paypalSecret),
                        clientIdPrefix = paypalClientId?.Substring(0, Math.Min(10, paypalClientId.Length)) + "..."
                    },
                    environment = new
                    {
                        stripeFromEnv = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY")),
                        paypalFromEnv = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID"))
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing payment gateway configuration");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error testing configuration",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Test Stripe refund (dry run - doesn't actually process)
        /// </summary>
        [HttpPost("test-stripe-refund")]
        public async Task<ActionResult> TestStripeRefund([FromBody] TestRefundRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.PaymentIntentId))
                {
                    return BadRequest(new { success = false, message = "PaymentIntentId is required" });
                }

                _logger.LogInformation("Testing Stripe refund for PaymentIntent: {PaymentIntentId}", request.PaymentIntentId);

                var result = await _paymentGatewayRefundService.ProcessStripeRefundAsync(
                    request.PaymentIntentId, 
                    request.Amount, 
                    request.Reason ?? "Test refund");

                return Ok(new
                {
                    success = result.Success,
                    message = result.Success ? "Stripe refund test completed" : "Stripe refund test failed",
                    result = new
                    {
                        refundId = result.RefundId,
                        refundedAmount = result.RefundedAmount,
                        status = result.Status,
                        errorMessage = result.ErrorMessage,
                        errorCode = result.ErrorCode
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing Stripe refund");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error testing Stripe refund",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Test PayPal refund (dry run - doesn't actually process)
        /// </summary>
        [HttpPost("test-paypal-refund")]
        public async Task<ActionResult> TestPayPalRefund([FromBody] TestRefundRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.TransactionId))
                {
                    return BadRequest(new { success = false, message = "TransactionId is required" });
                }

                _logger.LogInformation("Testing PayPal refund for Transaction: {TransactionId}", request.TransactionId);

                var result = await _paymentGatewayRefundService.ProcessPayPalRefundAsync(
                    request.TransactionId, 
                    request.Amount, 
                    request.Reason ?? "Test refund");

                return Ok(new
                {
                    success = result.Success,
                    message = result.Success ? "PayPal refund test completed" : "PayPal refund test failed",
                    result = new
                    {
                        refundId = result.RefundId,
                        refundedAmount = result.RefundedAmount,
                        status = result.Status,
                        errorMessage = result.ErrorMessage,
                        errorCode = result.ErrorCode
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing PayPal refund");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Error testing PayPal refund",
                    error = ex.Message 
                });
            }
        }
    }

    public class TestRefundRequest
    {
        public string? PaymentIntentId { get; set; }
        public string? TransactionId { get; set; }
        public decimal Amount { get; set; } = 1.00m;
        public string? Reason { get; set; }
    }
}
