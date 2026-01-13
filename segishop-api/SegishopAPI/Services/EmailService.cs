using MailKit.Net.Smtp;
using MimeKit;

namespace SegishopAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendWelcomeEmailAsync(string email, string password)
        {
            try
            {
                var subject = "Welcome to PrintOscar - Your Login Details";
                var body = CreateWelcomeEmailBody(email, password);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to {Email}", email);
                _logger.LogInformation("Password for {Email}: {Password}", email, password);
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string userName, string resetToken)
        {
            try
            {
                var subject = "Reset Your Password - PrintOscar";
                var body = CreatePasswordResetEmailBody(userName, resetToken);

                return await SendEmailAsync(toEmail, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
                _logger.LogInformation("Password reset token for {Email}: {Token}", toEmail, resetToken);
                return false;
            }
        }

        public async Task<bool> SendOrderConfirmationEmailAsync(string email, string orderNumber, decimal totalAmount)
        {
            try
            {
                var subject = $"Order Confirmation - {orderNumber}";
                var body = CreateOrderConfirmationEmailBody(orderNumber, totalAmount);
                
                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send order confirmation email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string htmlBody, string? plainTextBody = null)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var smtpHost = emailSettings["SmtpHost"];
                var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
                var smtpUsername = emailSettings["SmtpUsername"];
                var smtpPassword = emailSettings["SmtpPassword"];
                var fromEmail = emailSettings["FromEmail"];
                var fromName = emailSettings["FromName"] ?? "PrintOscar";
                var enableSsl = bool.Parse(emailSettings["EnableSsl"] ?? "true");

                _logger.LogInformation("Email configuration - Host: {Host}, Port: {Port}, SSL: {EnableSsl}, Username: {Username}",
                    smtpHost, smtpPort, enableSsl, smtpUsername);

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    _logger.LogWarning("Email settings not configured. Email not sent to {Email}", toEmail);
                    return false;
                }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail ?? smtpUsername));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody,
                TextBody = plainTextBody ?? ConvertHtmlToText(htmlBody)
            };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // Determine the correct secure socket options based on port and SSL setting
            MailKit.Security.SecureSocketOptions secureSocketOptions;
            if (enableSsl)
            {
                // Port 465 requires SslOnConnect, port 587 uses StartTls
                secureSocketOptions = smtpPort == 465
                    ? MailKit.Security.SecureSocketOptions.SslOnConnect
                    : MailKit.Security.SecureSocketOptions.StartTls;
            }
            else
            {
                secureSocketOptions = MailKit.Security.SecureSocketOptions.None;
            }

            _logger.LogInformation("Connecting to SMTP server {Host}:{Port} with {SecurityOption}",
                smtpHost, smtpPort, secureSocketOptions);

                await client.ConnectAsync(smtpHost, smtpPort, secureSocketOptions);
                await client.AuthenticateAsync(smtpUsername, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent successfully to {Email}", toEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
                return false;
            }
        }

        private string CreateWelcomeEmailBody(string email, string password)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #333;'>Welcome to PrintOscar!</h2>
                    <p>Thank you for registering with us. Here are your login details:</p>
                    
                    <div style='background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Password:</strong> <code style='background: #e0e0e0; padding: 2px 5px; border-radius: 3px;'>{password}</code></p>
                    </div>
                    
                    <p>Please keep this information secure and login to start shopping!</p>
                    
                    <p>Best regards,<br>
                    <strong>PrintOscar Team</strong></p>
                </div>";
        }

        private string CreatePasswordResetEmailBody(string userName, string resetToken)
        {
            var resetLink = $"http://localhost:3000/reset-password?token={resetToken}";

            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                    </div>

                    <h2 style='color: #333; margin-bottom: 20px;'>Reset Your Password</h2>

                    <p style='color: #555; line-height: 1.6;'>Hello {userName},</p>

                    <p style='color: #555; line-height: 1.6;'>
                        We received a request to reset your password for your PrintOscar account.
                        Click the button below to create a new password:
                    </p>

                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{resetLink}'
                           style='background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>
                            Reset Password
                        </a>
                    </div>

                    <p style='color: #555; line-height: 1.6; font-size: 14px;'>
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style='color: #f97316; word-break: break-all; font-size: 14px;'>{resetLink}</p>

                    <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;'>
                        <p style='color: #888; font-size: 12px; line-height: 1.4;'>
                            This link will expire in 1 hour for security reasons. If you didn't request this password reset,
                            please ignore this email or contact our support team.
                        </p>

                        <p style='color: #555; margin-top: 20px;'>
                            Best regards,<br>
                            <strong>The PrintOscar Team</strong>
                        </p>
                    </div>
                </div>";
        }

        public async Task<bool> SendOrderStatusUpdateEmailAsync(string email, string userName, string orderNumber, string oldStatus, string newStatus, string? notes = null)
        {
            try
            {
                var subject = $"Order Update - {orderNumber} is now {newStatus}";
                var body = CreateOrderStatusUpdateEmailBody(userName, orderNumber, oldStatus, newStatus, notes);

                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send order status update email to {Email}", email);
                return false;
            }
        }

        public async Task<bool> SendOrderFailureEmailAsync(string email, string userName, string orderNumber, string failureReason)
        {
            try
            {
                var subject = $"Order Issue - {orderNumber}";
                var body = CreateOrderFailureEmailBody(userName, orderNumber, failureReason);

                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send order failure email to {Email}", email);
                return false;
            }
        }

        private string CreateOrderConfirmationEmailBody(string orderNumber, decimal totalAmount)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #333;'>Order Confirmation</h2>
                    <p>Thank you for your order! Here are the details:</p>

                    <div style='background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                        <p><strong>Order Number:</strong> {orderNumber}</p>
                        <p><strong>Total Amount:</strong> ${totalAmount:F2}</p>
                    </div>

                    <p>We'll send you another email when your order ships.</p>

                    <p>Best regards,<br>
                    <strong>PrintOscar Team</strong></p>
                </div>";
        }

        private string CreateOrderStatusUpdateEmailBody(string userName, string orderNumber, string oldStatus, string newStatus, string? notes)
        {
            var statusMessage = newStatus.ToLower() switch
            {
                "processing" => "Your order is now being processed and will be prepared for shipment soon.",
                "shipped" => "Great news! Your order has been shipped and is on its way to you.",
                "delivered" => "Your order has been successfully delivered. We hope you enjoy your purchase!",
                "cancelled" => "Your order has been cancelled. If you have any questions, please contact our support team.",
                "failed" => "Unfortunately, there was an issue with your order. Our team will contact you shortly.",
                _ => $"Your order status has been updated to {newStatus}."
            };

            var notesSection = !string.IsNullOrEmpty(notes)
                ? $@"<div style='background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196f3;'>
                        <p><strong>Additional Notes:</strong></p>
                        <p style='margin: 5px 0;'>{notes}</p>
                     </div>"
                : "";

            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                    </div>

                    <h2 style='color: #333; margin-bottom: 20px;'>Order Status Update</h2>

                    <p style='color: #555; line-height: 1.6;'>Hello {userName},</p>

                    <p style='color: #555; line-height: 1.6;'>{statusMessage}</p>

                    <div style='background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                        <p><strong>Order Number:</strong> {orderNumber}</p>
                        <p><strong>Previous Status:</strong> {oldStatus}</p>
                        <p><strong>Current Status:</strong> <span style='color: #f97316; font-weight: bold;'>{newStatus}</span></p>
                    </div>

                    {notesSection}

                    <p style='color: #555; line-height: 1.6;'>
                        You can track your order status anytime by visiting our website and using your order number.
                    </p>

                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='http://localhost:3000/track-order'
                           style='background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                            Track Your Order
                        </a>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        If you have any questions, please don't hesitate to contact our customer support team.
                    </p>

                    <p style='color: #555; line-height: 1.6;'>
                        Best regards,<br>
                        <strong>PrintOscar Team</strong>
                    </p>
                </div>";
        }

        private string CreateOrderFailureEmailBody(string userName, string orderNumber, string failureReason)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                    </div>

                    <h2 style='color: #d32f2f; margin-bottom: 20px;'>Order Issue Notification</h2>

                    <p style='color: #555; line-height: 1.6;'>Hello {userName},</p>

                    <p style='color: #555; line-height: 1.6;'>
                        We're writing to inform you about an issue with your recent order. We sincerely apologize for any inconvenience this may cause.
                    </p>

                    <div style='background: #ffebee; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d32f2f;'>
                        <p><strong>Order Number:</strong> {orderNumber}</p>
                        <p><strong>Issue:</strong> {failureReason}</p>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        Our customer service team will contact you within 24 hours to resolve this issue and discuss next steps.
                        In the meantime, if you have any immediate questions or concerns, please don't hesitate to reach out to us.
                    </p>

                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='mailto:contact@printoscar.com'
                           style='background: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                            Contact Support
                        </a>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        Thank you for your patience and understanding.
                    </p>

                    <p style='color: #555; line-height: 1.6;'>
                        Best regards,<br>
                        <strong>PrintOscar Customer Service Team</strong>
                    </p>
                </div>";
        }

        public async Task<bool> SendContactFormEmailAsync(string customerEmail, string customerName, string subject, string message, string hearAbout)
        {
            try
            {
                var emailSubject = $"New Contact Form Submission - {subject}";
                var body = CreateContactFormEmailBody(customerEmail, customerName, subject, message, hearAbout);

                // Send to admin/support email
                var adminEmail = _configuration.GetSection("EmailSettings")["FromEmail"] ?? "contact@printoscar.com";
                return await SendEmailAsync(adminEmail, emailSubject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact form email from {Email}", customerEmail);
                return false;
            }
        }

        public async Task<bool> SendContactFormConfirmationEmailAsync(string customerEmail, string customerName, string subject)
        {
            try
            {
                var emailSubject = "Thank you for contacting PrintOscar";
                var body = CreateContactFormConfirmationEmailBody(customerName, subject);

                return await SendEmailAsync(customerEmail, emailSubject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact form confirmation email to {Email}", customerEmail);
                return false;
            }
        }

        public async Task<bool> SendHandmadeInquiryEmailAsync(string customerEmail, string customerName, string phone, string itemType, string detailedPreferences, string? productLink = null)
        {
            try
            {
                var emailSubject = $"New Handmade Inquiry - {itemType}";
                var body = CreateHandmadeInquiryEmailBody(customerEmail, customerName, phone, itemType, detailedPreferences, productLink);

                // Send to admin/support email
                var adminEmail = _configuration.GetSection("EmailSettings")["FromEmail"] ?? "contact@printoscar.com";
                return await SendEmailAsync(adminEmail, emailSubject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send handmade inquiry email from {Email}", customerEmail);
                return false;
            }
        }

        public async Task<bool> SendHandmadeInquiryConfirmationEmailAsync(string customerEmail, string customerName, string itemType)
        {
            try
            {
                var emailSubject = "Thank you for your handmade inquiry";
                var body = CreateHandmadeInquiryConfirmationEmailBody(customerName, itemType);

                return await SendEmailAsync(customerEmail, emailSubject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send handmade inquiry confirmation email to {Email}", customerEmail);
                return false;
            }
        }

        public async Task<bool> SendNewsletterSubscriptionConfirmationEmailAsync(string email)
        {
            try
            {
                var subject = "Welcome to PrintOscar Newsletter!";
                var body = CreateNewsletterSubscriptionConfirmationEmailBody();

                return await SendEmailAsync(email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send newsletter subscription confirmation email to {Email}", email);
                return false;
            }
        }

        private string CreateContactFormEmailBody(string customerEmail, string customerName, string subject, string message, string hearAbout)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                        <h2 style='color: #333; margin: 10px 0;'>New Contact Form Submission</h2>
                    </div>

                    <div style='background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                        <h3 style='color: #333; margin-top: 0;'>Customer Information</h3>
                        <p><strong>Name:</strong> {customerName}</p>
                        <p><strong>Email:</strong> {customerEmail}</p>
                        <p><strong>Subject:</strong> {subject}</p>
                        <p><strong>How they heard about us:</strong> {hearAbout}</p>
                    </div>

                    <div style='background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;'>
                        <h3 style='color: #333; margin-top: 0;'>Message</h3>
                        <p style='line-height: 1.6; white-space: pre-wrap;'>{message}</p>
                    </div>

                    <div style='background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                        <p style='margin: 0; color: #1976d2;'><strong>Action Required:</strong> Please respond to this customer inquiry within 24 hours.</p>
                    </div>

                    <p style='color: #666; font-size: 12px; margin-top: 30px;'>
                        This email was sent from the PrintOscar contact form at {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC.
                    </p>
                </div>";
        }

        private string CreateContactFormConfirmationEmailBody(string customerName, string subject)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                    </div>

                    <h2 style='color: #333; margin-bottom: 20px;'>Thank You for Contacting Us!</h2>

                    <p style='color: #555; line-height: 1.6;'>Hello {customerName},</p>

                    <p style='color: #555; line-height: 1.6;'>
                        Thank you for reaching out to us regarding: <strong>{subject}</strong>
                    </p>

                    <p style='color: #555; line-height: 1.6;'>
                        We have received your message and our team will review it carefully.
                        You can expect to hear back from us within 24 hours during business days.
                    </p>

                    <div style='background: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f97316;'>
                        <p style='margin: 0; color: #333;'>
                            <strong>What happens next?</strong><br>
                            • Our customer service team will review your inquiry<br>
                            • We'll respond with helpful information or next steps<br>
                            • For urgent matters, you can also call us directly
                        </p>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        In the meantime, feel free to browse our latest products and offers on our website.
                    </p>

                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='http://localhost:3000'
                           style='background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                            Visit Our Store
                        </a>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        Best regards,<br>
                        <strong>PrintOscar Customer Service Team</strong>
                    </p>
                </div>";
        }

        private string CreateHandmadeInquiryEmailBody(string customerEmail, string customerName, string phone, string itemType, string detailedPreferences, string? productLink)
        {
            var productLinkSection = !string.IsNullOrEmpty(productLink)
                ? $"<p><strong>Reference Product Link:</strong> <a href='{productLink}'>{productLink}</a></p>"
                : "";

            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                        <h2 style='color: #333; margin: 10px 0;'>New Handmade Product Inquiry</h2>
                    </div>

                    <div style='background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                        <h3 style='color: #333; margin-top: 0;'>Customer Information</h3>
                        <p><strong>Name:</strong> {customerName}</p>
                        <p><strong>Email:</strong> {customerEmail}</p>
                        <p><strong>Phone:</strong> {phone}</p>
                        <p><strong>Item Type:</strong> {itemType}</p>
                        {productLinkSection}
                    </div>

                    <div style='background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;'>
                        <h3 style='color: #333; margin-top: 0;'>Detailed Preferences & Requirements</h3>
                        <p style='line-height: 1.6; white-space: pre-wrap;'>{detailedPreferences}</p>
                    </div>

                    <div style='background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;'>
                        <p style='margin: 0; color: #856404;'><strong>Priority Inquiry:</strong> This is a custom handmade product request. Please respond within 12 hours with availability and pricing.</p>
                    </div>

                    <p style='color: #666; font-size: 12px; margin-top: 30px;'>
                        This email was sent from the PrintOscar handmade inquiry form at {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC.
                    </p>
                </div>";
        }

        private string CreateHandmadeInquiryConfirmationEmailBody(string customerName, string itemType)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                    </div>

                    <h2 style='color: #333; margin-bottom: 20px;'>Thank You for Your Handmade Inquiry!</h2>

                    <p style='color: #555; line-height: 1.6;'>Hello {customerName},</p>

                    <p style='color: #555; line-height: 1.6;'>
                        Thank you for your interest in our custom handmade <strong>{itemType}</strong>!
                    </p>

                    <p style='color: #555; line-height: 1.6;'>
                        We have received your detailed requirements and our artisan team is excited to work on your custom piece.
                        You can expect to hear back from us within 12 hours with:
                    </p>

                    <div style='background: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f97316;'>
                        <ul style='margin: 0; color: #333; padding-left: 20px;'>
                            <li>Availability confirmation for your requested timeline</li>
                            <li>Detailed pricing based on your specifications</li>
                            <li>Design mockups or samples (if applicable)</li>
                            <li>Next steps for placing your custom order</li>
                        </ul>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        Our handmade products are crafted with love and attention to detail. Each piece is unique and made specifically for you.
                    </p>

                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='http://localhost:3000/handmade'
                           style='background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                            View Our Handmade Collection
                        </a>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        Best regards,<br>
                        <strong>PrintOscar Artisan Team</strong>
                    </p>
                </div>";
        }

        private string CreateNewsletterSubscriptionConfirmationEmailBody()
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #f97316; margin: 0;'>PrintOscar</h1>
                    </div>

                    <h2 style='color: #333; margin-bottom: 20px;'>Welcome to Our Newsletter! 🎉</h2>

                    <p style='color: #555; line-height: 1.6;'>
                        Thank you for subscribing to the PrintOscar newsletter! You're now part of our exclusive community.
                    </p>

                    <div style='background: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f97316;'>
                        <h3 style='color: #333; margin-top: 0;'>What to expect:</h3>
                        <ul style='margin: 0; color: #555; padding-left: 20px;'>
                            <li>🛍️ Exclusive deals and early access to sales</li>
                            <li>✨ New product announcements</li>
                            <li>🎨 Behind-the-scenes content from our artisans</li>
                            <li>💡 Style tips and product care guides</li>
                            <li>🎁 Special subscriber-only offers</li>
                        </ul>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        We promise to only send you valuable content and never spam your inbox.
                        You can unsubscribe at any time using the link in our emails.
                    </p>

                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='http://localhost:3000'
                           style='background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                            Start Shopping
                        </a>
                    </div>

                    <p style='color: #555; line-height: 1.6;'>
                        Happy shopping!<br>
                        <strong>The PrintOscar Team</strong>
                    </p>
                </div>";
        }

        private string ConvertHtmlToText(string html)
        {
            // Simple HTML to text conversion
            return System.Text.RegularExpressions.Regex.Replace(html, "<.*?>", string.Empty)
                .Replace("&nbsp;", " ")
                .Replace("&amp;", "&")
                .Replace("&lt;", "<")
                .Replace("&gt;", ">")
                .Trim();
        }
    }
}
