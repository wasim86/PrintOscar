namespace SegishopAPI.Services
{
    public interface IEmailService
    {
        Task<bool> SendWelcomeEmailAsync(string email, string password);
        Task<bool> SendPasswordResetEmailAsync(string toEmail, string userName, string resetToken);
        Task<bool> SendOrderConfirmationEmailAsync(string email, string orderNumber, decimal totalAmount);
        Task<bool> SendOrderStatusUpdateEmailAsync(string email, string userName, string orderNumber, string oldStatus, string newStatus, string? notes = null);
        Task<bool> SendOrderFailureEmailAsync(string email, string userName, string orderNumber, string failureReason);
        Task<bool> SendContactFormEmailAsync(string customerEmail, string customerName, string subject, string message, string hearAbout);
        Task<bool> SendContactFormConfirmationEmailAsync(string customerEmail, string customerName, string subject);
        Task<bool> SendHandmadeInquiryEmailAsync(string customerEmail, string customerName, string phone, string itemType, string detailedPreferences, string? productLink = null);
        Task<bool> SendHandmadeInquiryConfirmationEmailAsync(string customerEmail, string customerName, string itemType);
        Task<bool> SendNewsletterSubscriptionConfirmationEmailAsync(string email);
        Task<bool> SendEmailAsync(string toEmail, string subject, string htmlBody, string? plainTextBody = null);
    }
}
