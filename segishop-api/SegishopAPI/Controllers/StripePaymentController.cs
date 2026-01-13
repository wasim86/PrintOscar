using Microsoft.AspNetCore.Mvc;
using Stripe;
using SegishopAPI.Data;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/payments/stripe")]
    public class StripePaymentController : ControllerBase
    {
        private readonly SegishopDbContext _db;
        private readonly IConfiguration _config;
        private readonly ILogger<StripePaymentController> _logger;

        public StripePaymentController(SegishopDbContext db, IConfiguration config, ILogger<StripePaymentController> logger)
        {
            _db = db;
            _config = config;
            _logger = logger;
        }

        public class CreateIntentRequest
        {
            public decimal Amount { get; set; }
            public string? Currency { get; set; } = "usd";
            public Dictionary<string, string>? Metadata { get; set; }
        }

        [HttpPost("create-intent")]
        public ActionResult<object> CreateIntent([FromBody] CreateIntentRequest req)
        {
            try
            {
                if (req.Amount <= 0)
                {
                    return BadRequest(new { success = false, error = "Invalid amount" });
                }

                var secret = _db.PaymentGatewaySettings.FirstOrDefault()?.StripeSecretKey
                    ?? Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY")
                    ?? _config["Stripe:SecretKey"];

                if (string.IsNullOrWhiteSpace(secret))
                {
                    return StatusCode(500, new { success = false, error = "Stripe secret key not configured" });
                }

                var client = new StripeClient(secret);
                var service = new PaymentIntentService(client);

                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)Math.Round(req.Amount * 100m),
                    Currency = (req.Currency ?? "usd").ToLower(),
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true
                    },
                    Metadata = req.Metadata ?? new Dictionary<string, string>()
                };

                var intent = service.Create(options);

                return Ok(new { success = true, clientSecret = intent.ClientSecret, paymentIntentId = intent.Id });
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe error creating payment intent");
                return StatusCode(500, new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Stripe payment intent");
                return StatusCode(500, new { success = false, error = "Payment intent creation failed" });
            }
        }
    }
}