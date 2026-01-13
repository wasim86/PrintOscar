using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/payment-settings")]
    [Authorize(Roles = "Admin")]
    public class AdminPaymentSettingsController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AdminPaymentSettingsController> _logger;

        public AdminPaymentSettingsController(SegishopDbContext context, IConfiguration configuration, ILogger<AdminPaymentSettingsController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<object>> Get()
        {
            var settings = await _context.PaymentGatewaySettings.FirstOrDefaultAsync();

            var stripeSecret = settings?.StripeSecretKey ?? _configuration["Stripe:SecretKey"];
            var stripePublishable = settings?.StripePublishableKey ?? _configuration["Stripe:PublishableKey"];
            var paypalClientId = settings?.PayPalClientId ?? _configuration["PayPal:ClientId"];
            var paypalSecret = settings?.PayPalClientSecret ?? _configuration["PayPal:ClientSecret"];
            var paypalBaseUrl = settings?.PayPalBaseUrl ?? _configuration["PayPal:BaseUrl"] ?? "https://api-m.sandbox.paypal.com";

            string Mask(string? v, int prefix) => string.IsNullOrEmpty(v) ? string.Empty : (v.Length <= prefix ? v : v.Substring(0, prefix)) + "***";

            return Ok(new
            {
                stripe = new
                {
                    enabled = settings?.StripeEnabled ?? !string.IsNullOrEmpty(stripeSecret),
                    secretKeyMasked = Mask(stripeSecret, 7),
                    publishableKeyMasked = Mask(stripePublishable, 7)
                },
                paypal = new
                {
                    enabled = settings?.PayPalEnabled ?? (!string.IsNullOrEmpty(paypalClientId) && !string.IsNullOrEmpty(paypalSecret)),
                    clientIdMasked = Mask(paypalClientId, 10),
                    clientSecretMasked = Mask(paypalSecret, 7),
                    baseUrl = paypalBaseUrl
                },
                updatedAt = settings?.UpdatedAt,
                updatedBy = settings?.UpdatedBy
            });
        }

        public class UpdatePaymentSettingsDto
        {
            public bool StripeEnabled { get; set; }
            public string? StripeSecretKey { get; set; }
            public string? StripePublishableKey { get; set; }
            public bool PayPalEnabled { get; set; }
            public string? PayPalClientId { get; set; }
            public string? PayPalClientSecret { get; set; }
            public string? PayPalBaseUrl { get; set; }
        }

        [HttpPut]
        public async Task<ActionResult> Update([FromBody] UpdatePaymentSettingsDto dto)
        {
            try
            {
                var settings = await _context.PaymentGatewaySettings.FirstOrDefaultAsync();
                if (settings == null)
                {
                    settings = new PaymentGatewaySettings();
                    _context.PaymentGatewaySettings.Add(settings);
                }

                settings.StripeEnabled = dto.StripeEnabled;
                if (!string.IsNullOrWhiteSpace(dto.StripeSecretKey)) settings.StripeSecretKey = dto.StripeSecretKey;
                if (!string.IsNullOrWhiteSpace(dto.StripePublishableKey)) settings.StripePublishableKey = dto.StripePublishableKey;

                settings.PayPalEnabled = dto.PayPalEnabled;
                if (!string.IsNullOrWhiteSpace(dto.PayPalClientId)) settings.PayPalClientId = dto.PayPalClientId;
                if (!string.IsNullOrWhiteSpace(dto.PayPalClientSecret)) settings.PayPalClientSecret = dto.PayPalClientSecret;
                if (!string.IsNullOrWhiteSpace(dto.PayPalBaseUrl)) settings.PayPalBaseUrl = dto.PayPalBaseUrl;

                settings.UpdatedAt = DateTime.UtcNow;
                settings.UpdatedBy = User?.Identity?.Name ?? "admin";

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment gateway settings");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }
}