using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SegishopAPI.DTOs;
using SegishopAPI.Services;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/payments")]
    [Authorize(Roles = "Admin")]
    public class AdminPaymentController : ControllerBase
    {
        private readonly IPaymentRecordService _paymentRecordService;
        private readonly ILogger<AdminPaymentController> _logger;

        public AdminPaymentController(IPaymentRecordService paymentRecordService, ILogger<AdminPaymentController> logger)
        {
            _paymentRecordService = paymentRecordService;
            _logger = logger;
        }

        /// <summary>
        /// Get payment summary for an order
        /// </summary>
        [HttpGet("order/{orderId}/summary")]
        public async Task<ActionResult<PaymentSummaryDto>> GetOrderPaymentSummary(int orderId)
        {
            try
            {
                var summary = await _paymentRecordService.GetOrderPaymentSummaryAsync(orderId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment summary for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Get all payment records for an order
        /// </summary>
        [HttpGet("order/{orderId}")]
        public async Task<ActionResult<List<PaymentRecordDto>>> GetOrderPaymentRecords(int orderId)
        {
            try
            {
                var paymentRecords = await _paymentRecordService.GetOrderPaymentRecordsAsync(orderId);
                return Ok(paymentRecords);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment records for order {OrderId}", orderId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Get payment record by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentRecordDto>> GetPaymentRecord(int id)
        {
            try
            {
                var paymentRecord = await _paymentRecordService.GetPaymentRecordByIdAsync(id);
                if (paymentRecord == null)
                {
                    return NotFound(new { message = "Payment record not found" });
                }

                return Ok(paymentRecord);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment record {PaymentRecordId}", id);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Create a payment record
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PaymentRecordDto>> CreatePaymentRecord([FromBody] CreatePaymentRecordDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var paymentRecord = await _paymentRecordService.CreatePaymentRecordAsync(createDto);
                return CreatedAtAction(nameof(GetPaymentRecord), new { id = paymentRecord.Id }, paymentRecord);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment record for order {OrderId}", createDto.OrderId);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        // Database-only refund endpoint removed - only gateway refunds are supported

        /// <summary>
        /// Process a refund through payment gateway
        /// </summary>
        [HttpPost("refund")]
        public async Task<ActionResult<RefundResponseDto>> ProcessRefund([FromBody] RefundRequestDto? refundRequest)
        {
            try
            {
                if (refundRequest == null)
                {
                    return BadRequest(new {
                        success = false,
                        message = "Refund request is required",
                        errors = new[] { "Request body cannot be null" }
                    });
                }

                // Log the incoming request for debugging
                _logger.LogInformation("Received refund request: OrderId={OrderId}, PaymentRecordId={PaymentRecordId}, Amount={Amount}, Reason={Reason}, Notes={Notes}, NotifyCustomer={NotifyCustomer}",
                    refundRequest.OrderId, refundRequest.PaymentRecordId, refundRequest.Amount, refundRequest.Reason, refundRequest.Notes, refundRequest.NotifyCustomer);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Model validation failed for refund request. Errors: {Errors}",
                        string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
                    return BadRequest(new {
                        success = false,
                        message = "Validation failed",
                        errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                    });
                }

                _logger.LogInformation("Processing refund request for Order {OrderId}, Payment {PaymentRecordId}, Amount {Amount}",
                    refundRequest.OrderId, refundRequest.PaymentRecordId, refundRequest.Amount);

                var refundResponse = await _paymentRecordService.ProcessRefundAsync(refundRequest);

                if (!refundResponse.Success)
                {
                    _logger.LogWarning("Refund failed for Payment {PaymentRecordId}: {ErrorMessage}",
                        refundRequest.PaymentRecordId, refundResponse.Message);
                    return BadRequest(refundResponse);
                }

                _logger.LogInformation("Refund processed successfully for Payment {PaymentRecordId}. Refunded Amount: {RefundedAmount}",
                    refundRequest.PaymentRecordId, refundResponse.RefundedAmount);

                return Ok(refundResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing refund for payment {PaymentRecordId}", refundRequest?.PaymentRecordId);
                return StatusCode(500, new {
                    success = false,
                    message = "An internal error occurred while processing the refund",
                    errorCode = "INTERNAL_ERROR"
                });
            }
        }

        /// <summary>
        /// Debug endpoint to test refund request validation
        /// </summary>
        [HttpPost("refund/debug")]
        public ActionResult DebugRefundRequest([FromBody] RefundRequestDto refundRequest)
        {
            try
            {
                _logger.LogInformation("Debug refund request received: {@RefundRequest}", refundRequest);

                var validationResults = new List<string>();

                if (refundRequest == null)
                {
                    validationResults.Add("RefundRequest is null");
                }
                else
                {
                    if (refundRequest.OrderId <= 0)
                        validationResults.Add("OrderId must be greater than 0");
                    if (refundRequest.PaymentRecordId <= 0)
                        validationResults.Add("PaymentRecordId must be greater than 0");
                    if (refundRequest.Amount <= 0)
                        validationResults.Add("Amount must be greater than 0");
                    if (string.IsNullOrEmpty(refundRequest.Reason))
                        validationResults.Add("Reason is required");
                    if (!string.IsNullOrEmpty(refundRequest.Reason) && refundRequest.Reason.Length > 500)
                        validationResults.Add("Reason cannot exceed 500 characters");
                    if (!string.IsNullOrEmpty(refundRequest.Notes) && refundRequest.Notes.Length > 1000)
                        validationResults.Add("Notes cannot exceed 1000 characters");
                }

                return Ok(new
                {
                    success = true,
                    message = "Debug refund request processed",
                    modelStateValid = ModelState.IsValid,
                    validationResults = validationResults,
                    modelStateErrors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList(),
                    receivedData = refundRequest
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in debug refund request");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Update payment record status
        /// </summary>
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdatePaymentRecordStatus(int id, [FromBody] UpdatePaymentStatusDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _paymentRecordService.UpdatePaymentRecordStatusAsync(id, updateDto.Status, updateDto.Notes);
                
                if (!success)
                {
                    return NotFound(new { message = "Payment record not found" });
                }

                return Ok(new { message = "Payment record status updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment record status {PaymentRecordId}", id);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }
    }

    public class UpdatePaymentStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
