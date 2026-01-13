using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace SegishopAPI.Services
{
    public interface IRecaptchaService
    {
        Task<RecaptchaValidationResult> ValidateTokenAsync(string token, string action, string? remoteIp = null);
        Task<bool> IsValidTokenAsync(string token, string action, double minimumScore = 0.5);
    }

    public class RecaptchaValidationResult
    {
        public bool Success { get; set; }
        public double Score { get; set; }
        public string Action { get; set; } = string.Empty;
        public DateTime ChallengeTimestamp { get; set; }
        public string Hostname { get; set; } = string.Empty;
        public string[] ErrorCodes { get; set; } = Array.Empty<string>();
        public bool IsValid => Success && Score >= 0.5;
    }

    public class RecaptchaService : IRecaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<RecaptchaService> _logger;
        private readonly string? _secretKey;

        public RecaptchaService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<RecaptchaService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            
            // Get secret key from environment variable or configuration
            _secretKey = Environment.GetEnvironmentVariable("RECAPTCHA_SECRET_KEY") ?? 
                        _configuration["Recaptcha:SecretKey"];
        }

        public async Task<RecaptchaValidationResult> ValidateTokenAsync(string token, string action, string? remoteIp = null)
        {
            if (string.IsNullOrEmpty(_secretKey))
            {
                _logger.LogWarning("reCAPTCHA secret key not configured");
                return new RecaptchaValidationResult
                {
                    Success = false,
                    ErrorCodes = new[] { "missing-secret-key" }
                };
            }

            if (string.IsNullOrEmpty(token))
            {
                return new RecaptchaValidationResult
                {
                    Success = false,
                    ErrorCodes = new[] { "missing-input-response" }
                };
            }

            try
            {
                var requestData = new List<KeyValuePair<string, string>>
                {
                    new("secret", _secretKey),
                    new("response", token)
                };

                if (!string.IsNullOrEmpty(remoteIp))
                {
                    requestData.Add(new("remoteip", remoteIp));
                }

                var requestContent = new FormUrlEncodedContent(requestData);

                var response = await _httpClient.PostAsync(
                    "https://www.google.com/recaptcha/api/siteverify",
                    requestContent);

                var responseContent = await response.Content.ReadAsStringAsync();
                
                _logger.LogDebug("reCAPTCHA API response: {Response}", responseContent);

                var result = JsonSerializer.Deserialize<GoogleRecaptchaResponse>(responseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                if (result == null)
                {
                    _logger.LogError("Failed to deserialize reCAPTCHA response");
                    return new RecaptchaValidationResult
                    {
                        Success = false,
                        ErrorCodes = new[] { "invalid-response" }
                    };
                }

                var validationResult = new RecaptchaValidationResult
                {
                    Success = result.Success,
                    Score = result.Score,
                    Action = result.Action ?? string.Empty,
                    ChallengeTimestamp = result.ChallengeTs,
                    Hostname = result.Hostname ?? string.Empty,
                    ErrorCodes = result.ErrorCodes ?? Array.Empty<string>()
                };

                // Validate action matches
                if (validationResult.Success && !string.IsNullOrEmpty(action) && 
                    !string.Equals(validationResult.Action, action, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("reCAPTCHA action mismatch. Expected: {Expected}, Actual: {Actual}", 
                        action, validationResult.Action);
                    validationResult.Success = false;
                    validationResult.ErrorCodes = validationResult.ErrorCodes.Concat(new[] { "action-mismatch" }).ToArray();
                }

                _logger.LogInformation("reCAPTCHA validation result: Success={Success}, Score={Score}, Action={Action}", 
                    validationResult.Success, validationResult.Score, validationResult.Action);

                return validationResult;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating reCAPTCHA token");
                return new RecaptchaValidationResult
                {
                    Success = false,
                    ErrorCodes = new[] { "network-error" }
                };
            }
        }

        public async Task<bool> IsValidTokenAsync(string token, string action, double minimumScore = 0.5)
        {
            var result = await ValidateTokenAsync(token, action);
            return result.Success && result.Score >= minimumScore;
        }

        private class GoogleRecaptchaResponse
        {
            public bool Success { get; set; }
            public double Score { get; set; }
            public string? Action { get; set; }
            public DateTime ChallengeTs { get; set; }
            public string? Hostname { get; set; }
            public string[]? ErrorCodes { get; set; }
        }
    }
}
