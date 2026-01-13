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
    public class NewsletterController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly SegishopDbContext _context;
        private readonly IRecaptchaService _recaptchaService;
        private readonly ILogger<NewsletterController> _logger;

        public NewsletterController(
            IEmailService emailService,
            SegishopDbContext context,
            IRecaptchaService recaptchaService,
            ILogger<NewsletterController> logger)
        {
            _emailService = emailService;
            _context = context;
            _recaptchaService = recaptchaService;
            _logger = logger;
        }

        /// <summary>
        /// Subscribe to newsletter
        /// </summary>
        [HttpPost("subscribe")]
        public async Task<ActionResult<NewsletterSubscriptionResponseDto>> Subscribe([FromBody] NewsletterSubscriptionDto subscription)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new NewsletterSubscriptionResponseDto
                    {
                        Success = false,
                        Message = "Please provide a valid email address.",
                        ErrorCode = "VALIDATION_ERROR"
                    });
                }

                // Validate reCAPTCHA if token is provided
                if (!string.IsNullOrEmpty(subscription.RecaptchaToken))
                {
                    var recaptchaResult = await _recaptchaService.ValidateTokenAsync(
                        subscription.RecaptchaToken,
                        "newsletter_subscription",
                        HttpContext.Connection.RemoteIpAddress?.ToString());

                    if (!recaptchaResult.IsValid)
                    {
                        _logger.LogWarning("Newsletter subscription blocked due to failed reCAPTCHA validation. Email: {Email}, Score: {Score}",
                            subscription.Email, recaptchaResult.Score);
                        return BadRequest(new NewsletterSubscriptionResponseDto
                        {
                            Success = false,
                            Message = "Security verification failed. Please try again.",
                            ErrorCode = "RECAPTCHA_FAILED"
                        });
                    }

                    _logger.LogInformation("Newsletter subscription reCAPTCHA validation successful. Email: {Email}, Score: {Score}",
                        subscription.Email, recaptchaResult.Score);
                }

                // Check if email is already subscribed
                var existingSubscription = await _context.NewsletterSubscriptions
                    .FirstOrDefaultAsync(ns => ns.Email.ToLower() == subscription.Email.ToLower());

                if (existingSubscription != null)
                {
                    if (existingSubscription.IsActive)
                    {
                        return Ok(new NewsletterSubscriptionResponseDto
                        {
                            Success = true,
                            Message = "You're already subscribed to our newsletter! Thank you for your continued interest."
                        });
                    }
                    else
                    {
                        // Reactivate subscription
                        existingSubscription.IsActive = true;
                        existingSubscription.SubscribedAt = DateTime.UtcNow;
                        await _context.SaveChangesAsync();
                    }
                }
                else
                {
                    // Create new subscription
                    var newSubscription = new NewsletterSubscription
                    {
                        Email = subscription.Email.ToLower(),
                        IsActive = true,
                        SubscribedAt = DateTime.UtcNow
                    };

                    _context.NewsletterSubscriptions.Add(newSubscription);
                    await _context.SaveChangesAsync();
                }

                // Send confirmation email
                var emailSent = await _emailService.SendNewsletterSubscriptionConfirmationEmailAsync(subscription.Email);

                if (!emailSent)
                {
                    _logger.LogWarning("Failed to send newsletter subscription confirmation email to {Email}", subscription.Email);
                }

                _logger.LogInformation("Newsletter subscription successful for {Email}", subscription.Email);

                return Ok(new NewsletterSubscriptionResponseDto
                {
                    Success = true,
                    Message = "Thank you for subscribing! Check your email for a confirmation message."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing newsletter subscription for {Email}", subscription.Email);
                
                return StatusCode(500, new NewsletterSubscriptionResponseDto
                {
                    Success = false,
                    Message = "An unexpected error occurred. Please try again later.",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }

        /// <summary>
        /// Unsubscribe from newsletter
        /// </summary>
        [HttpPost("unsubscribe")]
        public async Task<ActionResult<NewsletterSubscriptionResponseDto>> Unsubscribe([FromBody] NewsletterSubscriptionDto subscription)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new NewsletterSubscriptionResponseDto
                    {
                        Success = false,
                        Message = "Please provide a valid email address.",
                        ErrorCode = "VALIDATION_ERROR"
                    });
                }

                var existingSubscription = await _context.NewsletterSubscriptions
                    .FirstOrDefaultAsync(ns => ns.Email.ToLower() == subscription.Email.ToLower());

                if (existingSubscription != null && existingSubscription.IsActive)
                {
                    existingSubscription.IsActive = false;
                    existingSubscription.UnsubscribedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Newsletter unsubscription successful for {Email}", subscription.Email);

                    return Ok(new NewsletterSubscriptionResponseDto
                    {
                        Success = true,
                        Message = "You have been successfully unsubscribed from our newsletter."
                    });
                }
                else
                {
                    return Ok(new NewsletterSubscriptionResponseDto
                    {
                        Success = true,
                        Message = "Email address not found in our newsletter list."
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing newsletter unsubscription for {Email}", subscription.Email);
                
                return StatusCode(500, new NewsletterSubscriptionResponseDto
                {
                    Success = false,
                    Message = "An unexpected error occurred. Please try again later.",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }
    }
}
