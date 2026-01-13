using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SegishopAPI.Services;
using SegishopAPI.DTOs;
using System.Security.Claims;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly ILogger<InvoiceController> _logger;

        public InvoiceController(IInvoiceService invoiceService, ILogger<InvoiceController> logger)
        {
            _invoiceService = invoiceService;
            _logger = logger;
        }

        /// <summary>
        /// Generate invoice data for an order
        /// </summary>
        [HttpGet("order/{orderId}")]
        public async Task<ActionResult<InvoiceResponseDto>> GenerateInvoice(int orderId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new InvoiceResponseDto
                    {
                        Success = false,
                        Message = "Invalid user authentication.",
                        ErrorCode = "INVALID_USER"
                    });
                }

                var result = await _invoiceService.GenerateInvoiceAsync(orderId, userId);
                
                if (!result.Success)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating invoice for order {OrderId}", orderId);
                return StatusCode(500, new InvoiceResponseDto
                {
                    Success = false,
                    Message = "An internal error occurred while generating the invoice.",
                    ErrorCode = "INTERNAL_ERROR"
                });
            }
        }

        /// <summary>
        /// Download invoice as HTML file for an order
        /// </summary>
        [HttpGet("order/{orderId}/download")]
        public async Task<ActionResult> DownloadInvoice(int orderId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user authentication." });
                }

                var invoiceBytes = await _invoiceService.GenerateInvoicePdfAsync(orderId, userId);
                
                // Get invoice data to create filename
                var invoiceResponse = await _invoiceService.GenerateInvoiceAsync(orderId, userId);
                var filename = $"Invoice-{invoiceResponse.Data?.InvoiceNumber ?? orderId.ToString()}.html";

                return File(invoiceBytes, "text/html", filename);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading invoice for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred while downloading the invoice." });
            }
        }

        /// <summary>
        /// Download invoice for guest orders using order number
        /// </summary>
        [HttpGet("guest/order/{orderNumber}/download")]
        [AllowAnonymous]
        public async Task<ActionResult> DownloadGuestInvoice(string orderNumber)
        {
            try
            {
                var invoiceBytes = await _invoiceService.GenerateGuestInvoicePdfAsync(orderNumber);

                // Get invoice data to create filename
                var invoiceResponse = await _invoiceService.GenerateGuestInvoiceAsync(orderNumber);
                var filename = $"Invoice-{invoiceResponse.Data?.InvoiceNumber ?? orderNumber}.html";

                return File(invoiceBytes, "text/html", filename);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading guest invoice for order {OrderNumber}", orderNumber);
                return StatusCode(500, new { message = "An internal error occurred while downloading the invoice." });
            }
        }

        /// <summary>
        /// Download invoice as PDF file for an order (future implementation)
        /// </summary>
        [HttpGet("order/{orderId}/download-pdf")]
        public async Task<ActionResult> DownloadInvoicePdf(int orderId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user authentication." });
                }

                // For now, return HTML. You can integrate a PDF library like iTextSharp or PuppeteerSharp later
                var invoiceBytes = await _invoiceService.GenerateInvoicePdfAsync(orderId, userId);

                // Get invoice data to create filename
                var invoiceResponse = await _invoiceService.GenerateInvoiceAsync(orderId, userId);
                var filename = $"Invoice-{invoiceResponse.Data?.InvoiceNumber ?? orderId.ToString()}.html";

                return File(invoiceBytes, "text/html", filename);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading PDF invoice for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred while downloading the PDF invoice." });
            }
        }
    }
}
