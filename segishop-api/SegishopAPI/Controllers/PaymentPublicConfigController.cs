using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/payment/public-config")]
    [AllowAnonymous]
    public class PaymentPublicConfigController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PaymentPublicConfigController> _logger;

        public PaymentPublicConfigController(SegishopDbContext context, IConfiguration configuration, ILogger<PaymentPublicConfigController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            try
            {
                var settings = await _context.PaymentGatewaySettings.FirstOrDefaultAsync();

                var paypalClientId = settings?.PayPalClientId
                    ?? Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID")
                    ?? _configuration["PayPal:ClientId"]
                    ?? string.Empty;

                var stripePublishableKey = settings?.StripePublishableKey
                    ?? Environment.GetEnvironmentVariable("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
                    ?? _configuration["Stripe:PublishableKey"]
                    ?? string.Empty;

                return Ok(new
                {
                    paypalClientId,
                    stripePublishableKey,
                    paypalEnabled = settings?.PayPalEnabled ?? !string.IsNullOrEmpty(paypalClientId),
                    stripeEnabled = settings?.StripeEnabled ?? !string.IsNullOrEmpty(stripePublishableKey)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting public payment configuration");
                return Ok(new
                {
                    paypalClientId = string.Empty,
                    stripePublishableKey = string.Empty,
                    paypalEnabled = false,
                    stripeEnabled = false
                });
            }
        }
    }
}