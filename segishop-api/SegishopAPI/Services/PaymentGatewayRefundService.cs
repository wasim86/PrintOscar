using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;

namespace SegishopAPI.Services
{
    public interface IPaymentGatewayRefundService
    {
        Task<PaymentGatewayRefundResult> ProcessStripeRefundAsync(string paymentIntentId, decimal amount, string reason);
        Task<PaymentGatewayRefundResult> ProcessPayPalRefundAsync(string transactionId, decimal amount, string reason);
    }

    public class PaymentGatewayRefundResult
    {
        public bool Success { get; set; }
        public string? RefundId { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ErrorCode { get; set; }
        public decimal RefundedAmount { get; set; }
        public string? Status { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public string? GatewayResponse { get; set; }
    }

    public class PaymentGatewayRefundService : IPaymentGatewayRefundService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<PaymentGatewayRefundService> _logger;
        private readonly StripeClient? _stripeClient;
        private readonly HttpClient _httpClient;
        private readonly Data.SegishopDbContext _db;

        public PaymentGatewayRefundService(
            IConfiguration configuration,
            ILogger<PaymentGatewayRefundService> logger,
            HttpClient httpClient,
            Data.SegishopDbContext db)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;
            _db = db;

            // Initialize Stripe client - check environment variables first, then configuration
            var stripeSecretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ??
                                 (_db.PaymentGatewaySettings.FirstOrDefault()?.StripeSecretKey) ??
                                 _configuration["Stripe:SecretKey"];
            if (!string.IsNullOrEmpty(stripeSecretKey))
            {
                _stripeClient = new StripeClient(stripeSecretKey);
            }
        }

        public async Task<PaymentGatewayRefundResult> ProcessStripeRefundAsync(string paymentIntentId, decimal amount, string reason)
        {
            try
            {
                if (_stripeClient == null)
                {
                    _logger.LogError("Stripe client not initialized - missing secret key");
                    return new PaymentGatewayRefundResult
                    {
                        Success = false,
                        ErrorMessage = "Stripe configuration is missing",
                        ErrorCode = "STRIPE_CONFIG_MISSING"
                    };
                }

                _logger.LogInformation("Processing Stripe refund for PaymentIntent {PaymentIntentId}, Amount: {Amount}, Reason: {Reason}",
                    paymentIntentId, amount, reason);

                // Log Stripe configuration status
                var stripeSecretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? (_db.PaymentGatewaySettings.FirstOrDefault()?.StripeSecretKey) ?? _configuration["Stripe:SecretKey"];
                _logger.LogInformation("Stripe configuration - SecretKey present: {HasSecretKey}, Length: {KeyLength}",
                    !string.IsNullOrEmpty(stripeSecretKey), stripeSecretKey?.Length ?? 0);

                // Create refund options
                var refundOptions = new RefundCreateOptions
                {
                    PaymentIntent = paymentIntentId,
                    Amount = (long)(amount * 100), // Convert to cents
                    Reason = GetStripeRefundReason(reason),
                    Metadata = new Dictionary<string, string>
                    {
                        { "refund_reason", reason },
                        { "processed_by", "admin" },
                        { "processed_at", DateTime.UtcNow.ToString("O") }
                    }
                };

                var refundService = new RefundService(_stripeClient);
                var refund = await refundService.CreateAsync(refundOptions);

                _logger.LogInformation("Stripe refund created successfully. RefundId: {RefundId}, Status: {Status}", 
                    refund.Id, refund.Status);

                return new PaymentGatewayRefundResult
                {
                    Success = true,
                    RefundId = refund.Id,
                    RefundedAmount = refund.Amount / 100m, // Convert back from cents
                    Status = refund.Status,
                    ProcessedAt = DateTime.UtcNow,
                    GatewayResponse = JsonSerializer.Serialize(new
                    {
                        id = refund.Id,
                        amount = refund.Amount,
                        status = refund.Status,
                        created = refund.Created,
                        reason = refund.Reason
                    })
                };
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe refund failed for PaymentIntent {PaymentIntentId}: {ErrorMessage}", 
                    paymentIntentId, ex.Message);

                return new PaymentGatewayRefundResult
                {
                    Success = false,
                    ErrorMessage = ex.Message,
                    ErrorCode = ex.StripeError?.Code ?? "STRIPE_ERROR"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error processing Stripe refund for PaymentIntent {PaymentIntentId}", 
                    paymentIntentId);

                return new PaymentGatewayRefundResult
                {
                    Success = false,
                    ErrorMessage = "An unexpected error occurred while processing the refund",
                    ErrorCode = "UNEXPECTED_ERROR"
                };
            }
        }

        public async Task<PaymentGatewayRefundResult> ProcessPayPalRefundAsync(string transactionId, decimal amount, string reason)
        {
            try
            {
                _logger.LogInformation("Processing PayPal refund for Transaction {TransactionId}, Amount: {Amount}, Reason: {Reason}",
                    transactionId, amount, reason);

                // Validate transaction ID format
                if (string.IsNullOrWhiteSpace(transactionId))
                {
                    _logger.LogError("PayPal refund failed: Transaction ID is null or empty");
                    return new PaymentGatewayRefundResult
                    {
                        Success = false,
                        ErrorMessage = "Transaction ID is required for PayPal refund",
                        ErrorCode = "MISSING_TRANSACTION_ID"
                    };
                }

                // Log transaction ID details for debugging
                _logger.LogInformation("PayPal refund details - TransactionId: '{TransactionId}', Length: {Length}, Starts with: {FirstChar}",
                    transactionId, transactionId.Length, transactionId.Length > 0 ? transactionId[0].ToString() : "N/A");

                // Check if this looks like a PayPal Order ID vs Capture ID
                var looksLikeOrderId = transactionId.Length == 17 && (transactionId.StartsWith("7") || transactionId.StartsWith("4") || transactionId.StartsWith("9") || transactionId.StartsWith("6") || transactionId.StartsWith("1"));
                var looksLikeCaptureId = transactionId.Length == 17 && transactionId.Contains("WH");
                _logger.LogInformation("PayPal ID Analysis - LooksLikeOrderId: {LooksLikeOrderId}, LooksLikeCaptureId: {LooksLikeCaptureId}",
                    looksLikeOrderId, looksLikeCaptureId);

                // Get PayPal access token
                var accessToken = await GetPayPalAccessTokenAsync();
                if (string.IsNullOrEmpty(accessToken))
                {
                    return new PaymentGatewayRefundResult
                    {
                        Success = false,
                        ErrorMessage = "Failed to obtain PayPal access token",
                        ErrorCode = "PAYPAL_AUTH_FAILED"
                    };
                }

                // Create refund request
                var refundRequest = new
                {
                    amount = new
                    {
                        value = amount.ToString("F2"),
                        currency_code = "USD"
                    },
                    note_to_payer = reason
                };

                var paypalBaseUrl = Environment.GetEnvironmentVariable("PAYPAL_BASE_URL") ??
                                   (_db.PaymentGatewaySettings.FirstOrDefault()?.PayPalBaseUrl) ??
                                   _configuration["PayPal:BaseUrl"] ??
                                   "https://api-m.sandbox.paypal.com";
                var requestUri = $"{paypalBaseUrl}/v2/payments/captures/{transactionId}/refund";

                _logger.LogInformation("Making PayPal refund request to: {RequestUri}", requestUri);

                var request = new HttpRequestMessage(HttpMethod.Post, requestUri);
                request.Headers.Add("Authorization", $"Bearer {accessToken}");
                request.Headers.Add("PayPal-Request-Id", Guid.NewGuid().ToString());
                request.Content = new StringContent(
                    JsonSerializer.Serialize(refundRequest),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var refundResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    var refundId = refundResponse.GetProperty("id").GetString();
                    var status = refundResponse.GetProperty("status").GetString();

                    _logger.LogInformation("PayPal refund created successfully. RefundId: {RefundId}, Status: {Status}", 
                        refundId, status);

                    return new PaymentGatewayRefundResult
                    {
                        Success = true,
                        RefundId = refundId,
                        RefundedAmount = amount,
                        Status = status,
                        ProcessedAt = DateTime.UtcNow,
                        GatewayResponse = responseContent
                    };
                }
                else
                {
                    _logger.LogError("PayPal refund failed for Transaction {TransactionId}. Status: {StatusCode}, Response: {Response}",
                        transactionId, response.StatusCode, responseContent);

                    // Try to parse the error response for more details
                    string errorMessage = $"PayPal refund failed: {response.StatusCode}";
                    string errorCode = "PAYPAL_REFUND_FAILED";

                    try
                    {
                        var errorResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                        if (errorResponse.TryGetProperty("message", out var messageElement))
                        {
                            errorMessage = messageElement.GetString() ?? errorMessage;
                        }
                        if (errorResponse.TryGetProperty("name", out var nameElement))
                        {
                            errorCode = nameElement.GetString() ?? errorCode;
                        }
                        if (errorResponse.TryGetProperty("details", out var detailsElement) && detailsElement.ValueKind == JsonValueKind.Array)
                        {
                            var details = detailsElement.EnumerateArray().FirstOrDefault();
                            if (details.TryGetProperty("description", out var descElement))
                            {
                                errorMessage += $" - {descElement.GetString()}";
                            }
                        }
                    }
                    catch (Exception parseEx)
                    {
                        _logger.LogWarning(parseEx, "Failed to parse PayPal error response");
                    }

                    return new PaymentGatewayRefundResult
                    {
                        Success = false,
                        ErrorMessage = errorMessage,
                        ErrorCode = errorCode,
                        GatewayResponse = responseContent
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error processing PayPal refund for Transaction {TransactionId}", 
                    transactionId);

                return new PaymentGatewayRefundResult
                {
                    Success = false,
                    ErrorMessage = "An unexpected error occurred while processing the refund",
                    ErrorCode = "UNEXPECTED_ERROR"
                };
            }
        }

        private async Task<string?> GetPayPalAccessTokenAsync()
        {
            try
            {
                var clientId = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID") ??
                              (_db.PaymentGatewaySettings.FirstOrDefault()?.PayPalClientId) ??
                              _configuration["PayPal:ClientId"];
                var clientSecret = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_SECRET") ??
                                  (_db.PaymentGatewaySettings.FirstOrDefault()?.PayPalClientSecret) ??
                                  _configuration["PayPal:ClientSecret"];
                var baseUrl = Environment.GetEnvironmentVariable("PAYPAL_BASE_URL") ??
                             _configuration["PayPal:BaseUrl"] ??
                             "https://api-m.sandbox.paypal.com";

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                {
                    _logger.LogError("PayPal credentials not configured");
                    return null;
                }

                var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

                var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/v1/oauth2/token");
                request.Headers.Add("Authorization", $"Basic {auth}");
                request.Content = new StringContent(
                    "grant_type=client_credentials",
                    Encoding.UTF8,
                    "application/x-www-form-urlencoded"
                );

                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var tokenResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    return tokenResponse.GetProperty("access_token").GetString();
                }

                _logger.LogError("Failed to get PayPal access token. Status: {StatusCode}, Response: {Response}", 
                    response.StatusCode, responseContent);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayPal access token");
                return null;
            }
        }

        private static string GetStripeRefundReason(string reason)
        {
            // Map custom reasons to Stripe's predefined reasons
            var lowerReason = reason.ToLowerInvariant();
            
            if (lowerReason.Contains("duplicate") || lowerReason.Contains("accidental"))
                return "duplicate";
            if (lowerReason.Contains("fraud"))
                return "fraudulent";
            if (lowerReason.Contains("customer") || lowerReason.Contains("request"))
                return "requested_by_customer";
            
            return "requested_by_customer"; // Default
        }
    }
}
