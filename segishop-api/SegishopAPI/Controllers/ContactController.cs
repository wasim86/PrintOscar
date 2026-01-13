using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly SegishopDbContext _context;
        private readonly IRecaptchaService _recaptchaService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(
            IEmailService emailService,
            SegishopDbContext context,
            IRecaptchaService recaptchaService,
            ILogger<ContactController> logger)
        {
            _emailService = emailService;
            _context = context;
            _recaptchaService = recaptchaService;
            _logger = logger;
        }

        /// <summary>
        /// Submit contact form
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ContactFormResponseDto>> SubmitContactForm([FromBody] ContactFormDto contactForm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ContactFormResponseDto
                    {
                        Success = false,
                        Message = "Please fill in all required fields correctly.",
                        ErrorCode = "VALIDATION_ERROR"
                    });
                }

                // Validate reCAPTCHA if token is provided
                if (!string.IsNullOrEmpty(contactForm.RecaptchaToken))
                {
                    var recaptchaResult = await _recaptchaService.ValidateTokenAsync(
                        contactForm.RecaptchaToken,
                        "contact_form",
                        HttpContext.Connection.RemoteIpAddress?.ToString());

                    if (!recaptchaResult.IsValid)
                    {
                        _logger.LogWarning("Contact form submission blocked due to failed reCAPTCHA validation. Score: {Score}", recaptchaResult.Score);
                        return BadRequest(new ContactFormResponseDto
                        {
                            Success = false,
                            Message = "Security verification failed. Please try again.",
                            ErrorCode = "RECAPTCHA_FAILED"
                        });
                    }

                    _logger.LogInformation("Contact form reCAPTCHA validation successful. Score: {Score}", recaptchaResult.Score);
                }

                // Store contact submission in database
                var contactSubmission = new ContactSubmission
                {
                    Name = contactForm.Name,
                    Email = contactForm.Email,
                    Subject = contactForm.Subject,
                    Message = contactForm.Message,
                    HearAbout = contactForm.HearAbout,
                    Status = "New",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ContactSubmissions.Add(contactSubmission);
                await _context.SaveChangesAsync();

                // Send email to admin/support (non-blocking)
                var adminEmailSent = false;
                var confirmationEmailSent = false;

                try
                {
                    adminEmailSent = await _emailService.SendContactFormEmailAsync(
                        contactForm.Email,
                        contactForm.Name,
                        contactForm.Subject,
                        contactForm.Message,
                        contactForm.HearAbout
                    );
                }
                catch (Exception emailEx)
                {
                    _logger.LogWarning(emailEx, "Failed to send contact form email to admin for submission from {Email}", contactForm.Email);
                }

                try
                {
                    confirmationEmailSent = await _emailService.SendContactFormConfirmationEmailAsync(
                        contactForm.Email,
                        contactForm.Name,
                        contactForm.Subject
                    );
                }
                catch (Exception emailEx)
                {
                    _logger.LogWarning(emailEx, "Failed to send contact form confirmation email to {Email}", contactForm.Email);
                }

                if (!adminEmailSent)
                {
                    _logger.LogWarning("Failed to send contact form email to admin for submission from {Email}", contactForm.Email);
                }

                if (!confirmationEmailSent)
                {
                    _logger.LogWarning("Failed to send contact form confirmation email to {Email}", contactForm.Email);
                }

                // Always consider it successful since data is stored in database
                _logger.LogInformation("Contact form submitted successfully by {Name} ({Email}) - ID: {Id} (Admin Email: {AdminEmailSent}, Confirmation Email: {ConfirmationEmailSent})",
                    contactForm.Name, contactForm.Email, contactSubmission.Id, adminEmailSent, confirmationEmailSent);

                return Ok(new ContactFormResponseDto
                {
                    Success = true,
                    Message = "Thank you for your message! We'll get back to you within 24 hours."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing contact form submission from {Email}", contactForm.Email);
                
                return StatusCode(500, new ContactFormResponseDto
                {
                    Success = false,
                    Message = "An unexpected error occurred. Please try again later.",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }
    }
}
