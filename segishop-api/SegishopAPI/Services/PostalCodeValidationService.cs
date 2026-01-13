using System.Text.RegularExpressions;

namespace SegishopAPI.Services
{
    public interface IPostalCodeValidationService
    {
        Task<PostalCodeValidationResult> ValidatePostalCodeAsync(string postalCode, string country, string? state = null);
        Task<List<string>> GetSuggestionsAsync(string partialPostalCode, string country, string? state = null);
        bool IsValidFormat(string postalCode, string country);
    }

    public class PostalCodeValidationResult
    {
        public bool IsValid { get; set; }
        public string? FormattedPostalCode { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? County { get; set; }
        public List<string> Suggestions { get; set; } = new();
        public string? ErrorMessage { get; set; }
        public PostalCodeValidationType ValidationType { get; set; }
    }

    public enum PostalCodeValidationType
    {
        Valid,
        InvalidFormat,
        InvalidCode,
        NotFound,
        Ambiguous
    }

    public class PostalCodeValidationService : IPostalCodeValidationService
    {
        private readonly ILogger<PostalCodeValidationService> _logger;
        private readonly Dictionary<string, PostalCodePattern> _countryPatterns;

        public PostalCodeValidationService(ILogger<PostalCodeValidationService> logger)
        {
            _logger = logger;
            _countryPatterns = InitializeCountryPatterns();
        }

        public async Task<PostalCodeValidationResult> ValidatePostalCodeAsync(string postalCode, string country, string? state = null)
        {
            try
            {
                var result = new PostalCodeValidationResult();
                
                // Clean and normalize postal code
                var cleanedCode = CleanPostalCode(postalCode);
                
                // Check format first
                if (!IsValidFormat(cleanedCode, country))
                {
                    result.IsValid = false;
                    result.ValidationType = PostalCodeValidationType.InvalidFormat;
                    result.ErrorMessage = GetFormatErrorMessage(country);
                    result.Suggestions = await GetSuggestionsAsync(cleanedCode, country, state);
                    return result;
                }

                // Format the postal code according to country standards
                result.FormattedPostalCode = FormatPostalCode(cleanedCode, country);

                // Validate against known postal codes (simplified validation)
                var validationResult = await ValidateAgainstDatabase(result.FormattedPostalCode, country, state);
                
                result.IsValid = validationResult.IsValid;
                result.City = validationResult.City;
                result.State = validationResult.State;
                result.County = validationResult.County;
                result.ValidationType = validationResult.ValidationType;
                result.ErrorMessage = validationResult.ErrorMessage;

                if (!result.IsValid && result.ValidationType == PostalCodeValidationType.NotFound)
                {
                    result.Suggestions = await GetSuggestionsAsync(cleanedCode, country, state);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating postal code {PostalCode} for country {Country}", postalCode, country);
                return new PostalCodeValidationResult
                {
                    IsValid = false,
                    ValidationType = PostalCodeValidationType.InvalidCode,
                    ErrorMessage = "Unable to validate postal code at this time"
                };
            }
        }

        public async Task<List<string>> GetSuggestionsAsync(string partialPostalCode, string country, string? state = null)
        {
            // In a real implementation, this would query a postal code database
            // For now, we'll provide basic suggestions based on format
            var suggestions = new List<string>();
            
            try
            {
                var pattern = GetCountryPattern(country);
                if (pattern != null)
                {
                    suggestions.AddRange(GenerateFormatSuggestions(partialPostalCode, pattern));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating suggestions for {PostalCode}", partialPostalCode);
            }

            return suggestions;
        }

        public bool IsValidFormat(string postalCode, string country)
        {
            var pattern = GetCountryPattern(country);
            if (pattern == null) return true; // If we don't have a pattern, assume valid

            return Regex.IsMatch(postalCode, pattern.Regex, RegexOptions.IgnoreCase);
        }

        private Dictionary<string, PostalCodePattern> InitializeCountryPatterns()
        {
            return new Dictionary<string, PostalCodePattern>(StringComparer.OrdinalIgnoreCase)
            {
                ["US"] = new PostalCodePattern
                {
                    Regex = @"^\d{5}(-\d{4})?$",
                    Format = "NNNNN or NNNNN-NNNN",
                    Example = "12345 or 12345-6789"
                },
                ["United States"] = new PostalCodePattern
                {
                    Regex = @"^\d{5}(-\d{4})?$",
                    Format = "NNNNN or NNNNN-NNNN",
                    Example = "12345 or 12345-6789"
                },
                ["CA"] = new PostalCodePattern
                {
                    Regex = @"^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$",
                    Format = "ANA NAN",
                    Example = "K1A 0A6"
                },
                ["Canada"] = new PostalCodePattern
                {
                    Regex = @"^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$",
                    Format = "ANA NAN",
                    Example = "K1A 0A6"
                },
                ["GB"] = new PostalCodePattern
                {
                    Regex = @"^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$",
                    Format = "AN NAA or ANN NAA or ANA NAA or AANN NAA",
                    Example = "SW1A 1AA"
                },
                ["UK"] = new PostalCodePattern
                {
                    Regex = @"^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$",
                    Format = "AN NAA or ANN NAA or ANA NAA or AANN NAA",
                    Example = "SW1A 1AA"
                },
                ["DE"] = new PostalCodePattern
                {
                    Regex = @"^\d{5}$",
                    Format = "NNNNN",
                    Example = "12345"
                },
                ["Germany"] = new PostalCodePattern
                {
                    Regex = @"^\d{5}$",
                    Format = "NNNNN",
                    Example = "12345"
                },
                ["FR"] = new PostalCodePattern
                {
                    Regex = @"^\d{5}$",
                    Format = "NNNNN",
                    Example = "75001"
                },
                ["France"] = new PostalCodePattern
                {
                    Regex = @"^\d{5}$",
                    Format = "NNNNN",
                    Example = "75001"
                }
            };
        }

        private PostalCodePattern? GetCountryPattern(string country)
        {
            _countryPatterns.TryGetValue(country, out var pattern);
            return pattern;
        }

        private string CleanPostalCode(string postalCode)
        {
            return postalCode?.Trim().ToUpperInvariant() ?? string.Empty;
        }

        private string FormatPostalCode(string postalCode, string country)
        {
            // Apply country-specific formatting
            switch (country.ToUpperInvariant())
            {
                case "US":
                case "UNITED STATES":
                    if (postalCode.Length == 9 && !postalCode.Contains('-'))
                    {
                        return $"{postalCode.Substring(0, 5)}-{postalCode.Substring(5)}";
                    }
                    break;
                case "CA":
                case "CANADA":
                    if (postalCode.Length == 6)
                    {
                        return $"{postalCode.Substring(0, 3)} {postalCode.Substring(3)}";
                    }
                    break;
                case "GB":
                case "UK":
                    // UK postal codes have various formats, basic spacing
                    if (postalCode.Length >= 5 && !postalCode.Contains(' '))
                    {
                        return $"{postalCode.Substring(0, postalCode.Length - 3)} {postalCode.Substring(postalCode.Length - 3)}";
                    }
                    break;
            }
            
            return postalCode;
        }

        private async Task<PostalCodeValidationResult> ValidateAgainstDatabase(string postalCode, string country, string? state)
        {
            // In a real implementation, this would query a postal code database
            // For now, we'll do basic validation and return mock data for demonstration
            
            await Task.Delay(100); // Simulate API call
            
            // Basic validation - assume most codes are valid if they match format
            return new PostalCodeValidationResult
            {
                IsValid = true,
                ValidationType = PostalCodeValidationType.Valid,
                City = GetMockCity(postalCode, country),
                State = state,
                County = GetMockCounty(postalCode, country)
            };
        }

        private string? GetMockCity(string postalCode, string country)
        {
            // Mock city data for demonstration
            return country.ToUpperInvariant() switch
            {
                "US" or "UNITED STATES" => postalCode.StartsWith("10") ? "New York" : 
                                          postalCode.StartsWith("90") ? "Los Angeles" : 
                                          postalCode.StartsWith("20") ? "Washington" : "Unknown City",
                "CA" or "CANADA" => "Toronto",
                "GB" or "UK" => "London",
                _ => null
            };
        }

        private string? GetMockCounty(string postalCode, string country)
        {
            // Mock county data for demonstration
            return country.ToUpperInvariant() switch
            {
                "US" or "UNITED STATES" => postalCode.StartsWith("10") ? "New York County" : 
                                          postalCode.StartsWith("90") ? "Los Angeles County" : 
                                          postalCode.StartsWith("20") ? "District of Columbia" : null,
                _ => null
            };
        }

        private List<string> GenerateFormatSuggestions(string partialCode, PostalCodePattern pattern)
        {
            var suggestions = new List<string>();
            
            // Add format example as suggestion
            suggestions.Add($"Format: {pattern.Format}");
            suggestions.Add($"Example: {pattern.Example}");
            
            return suggestions;
        }

        private string GetFormatErrorMessage(string country)
        {
            var pattern = GetCountryPattern(country);
            if (pattern != null)
            {
                return $"Invalid postal code format for {country}. Expected format: {pattern.Format} (e.g., {pattern.Example})";
            }
            
            return "Invalid postal code format";
        }
    }

    public class PostalCodePattern
    {
        public string Regex { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public string Example { get; set; } = string.Empty;
    }
}
