using Microsoft.AspNetCore.Mvc;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InquiryController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly SegishopDbContext _context;
        private readonly ILogger<InquiryController> _logger;

        public InquiryController(IEmailService emailService, SegishopDbContext context, ILogger<InquiryController> logger)
        {
            _emailService = emailService;
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Submit handmade product inquiry
        /// </summary>
        [HttpPost("handmade")]
        public async Task<ActionResult<HandmadeInquiryResponseDto>> SubmitHandmadeInquiry([FromBody] HandmadeInquiryDto inquiry)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new HandmadeInquiryResponseDto
                    {
                        Success = false,
                        Message = "Please fill in all required fields correctly.",
                        ErrorCode = "VALIDATION_ERROR"
                    });
                }

                var fullPhone = $"{inquiry.CountryCode} {inquiry.Phone}";

                // Store handmade inquiry in database
                var handmadeInquiry = new HandmadeInquiry
                {
                    Name = inquiry.Name,
                    Email = inquiry.Email,
                    Phone = inquiry.Phone,
                    CountryCode = inquiry.CountryCode,
                    PreferredContact = inquiry.PreferredContact,
                    ItemType = inquiry.ItemType,
                    NeedByDate = inquiry.NeedByDate,
                    ShippingAddress = inquiry.ShippingAddress,
                    DressLength = inquiry.DressLength,
                    DressColors = inquiry.DressColors,
                    TotalDresses = inquiry.TotalDresses,
                    BagStyle = inquiry.BagStyle,
                    BagSize = inquiry.BagSize,
                    BagQuantity = inquiry.BagQuantity,
                    FunKitFill = inquiry.FunKitFill,
                    CustomLabels = inquiry.CustomLabels,
                    DetailedPreferences = inquiry.DetailedPreferences,
                    ProductLink = inquiry.ProductLink,
                    ReferralSource = inquiry.ReferralSource,
                    Status = "New",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.HandmadeInquiries.Add(handmadeInquiry);
                await _context.SaveChangesAsync();

                // Send email to admin/artisan team (non-blocking)
                var adminEmailSent = false;
                var confirmationEmailSent = false;

                try
                {
                    adminEmailSent = await _emailService.SendHandmadeInquiryEmailAsync(
                        inquiry.Email,
                        inquiry.Name,
                        fullPhone,
                        inquiry.ItemType,
                        inquiry.DetailedPreferences,
                        inquiry.ProductLink
                    );
                }
                catch (Exception emailEx)
                {
                    _logger.LogWarning(emailEx, "Failed to send handmade inquiry email to admin for submission from {Email}", inquiry.Email);
                }

                try
                {
                    confirmationEmailSent = await _emailService.SendHandmadeInquiryConfirmationEmailAsync(
                        inquiry.Email,
                        inquiry.Name,
                        inquiry.ItemType
                    );
                }
                catch (Exception emailEx)
                {
                    _logger.LogWarning(emailEx, "Failed to send handmade inquiry confirmation email to {Email}", inquiry.Email);
                }

                if (!adminEmailSent)
                {
                    _logger.LogWarning("Failed to send handmade inquiry email to admin for submission from {Email}", inquiry.Email);
                }

                if (!confirmationEmailSent)
                {
                    _logger.LogWarning("Failed to send handmade inquiry confirmation email to {Email}", inquiry.Email);
                }

                // Always consider it successful since data is stored in database
                _logger.LogInformation("Handmade inquiry submitted successfully by {Name} ({Email}) for {ItemType} - ID: {Id} (Admin Email: {AdminEmailSent}, Confirmation Email: {ConfirmationEmailSent})",
                    inquiry.Name, inquiry.Email, inquiry.ItemType, handmadeInquiry.Id, adminEmailSent, confirmationEmailSent);

                return Ok(new HandmadeInquiryResponseDto
                {
                    Success = true,
                    Message = "Thank you for your handmade inquiry! Our artisan team will contact you within 12 hours with availability and pricing."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing handmade inquiry from {Email}", inquiry.Email);
                
                return StatusCode(500, new HandmadeInquiryResponseDto
                {
                    Success = false,
                    Message = "An unexpected error occurred. Please try again later.",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }
    }
}
