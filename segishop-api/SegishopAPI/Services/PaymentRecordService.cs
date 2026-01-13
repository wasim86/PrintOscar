using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;

namespace SegishopAPI.Services
{
    public interface IPaymentRecordService
    {
        Task<PaymentRecordDto> CreatePaymentRecordAsync(CreatePaymentRecordDto createDto);
        Task<RefundResponseDto> ProcessRefundAsync(RefundRequestDto refundRequest);
        // Database-only refund method removed - only gateway refunds are supported
        Task<PaymentSummaryDto> GetOrderPaymentSummaryAsync(int orderId);
        Task<List<PaymentRecordDto>> GetOrderPaymentRecordsAsync(int orderId);
        Task<PaymentRecordDto?> GetPaymentRecordByIdAsync(int id);
        Task<bool> UpdatePaymentRecordStatusAsync(int id, string status, string? notes = null);
    }

    public class PaymentRecordService : IPaymentRecordService
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<PaymentRecordService> _logger;
        private readonly IPaymentGatewayRefundService _paymentGatewayRefundService;

        public PaymentRecordService(
            SegishopDbContext context,
            ILogger<PaymentRecordService> logger,
            IPaymentGatewayRefundService paymentGatewayRefundService)
        {
            _context = context;
            _logger = logger;
            _paymentGatewayRefundService = paymentGatewayRefundService;
        }

        public async Task<PaymentRecordDto> CreatePaymentRecordAsync(CreatePaymentRecordDto createDto)
        {
            var paymentRecord = new PaymentRecord
            {
                OrderId = createDto.OrderId,
                PaymentMethod = createDto.PaymentMethod,
                PaymentType = createDto.PaymentType,
                Status = createDto.Status,
                Amount = createDto.Amount,
                Currency = createDto.Currency,
                TransactionId = createDto.TransactionId,
                PaymentIntentId = createDto.PaymentIntentId,
                ChargeId = createDto.ChargeId,
                RefundId = createDto.RefundId,
                RefundedFromPaymentId = createDto.RefundedFromPaymentId,
                PaymentMethodDetails = createDto.PaymentMethodDetails,
                FailureReason = createDto.FailureReason,
                Notes = createDto.Notes,
                Metadata = createDto.Metadata,
                ProcessedBy = createDto.ProcessedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.PaymentRecords.Add(paymentRecord);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Payment record created: {PaymentRecordId} for order {OrderId}", 
                paymentRecord.Id, paymentRecord.OrderId);

            return MapToDto(paymentRecord);
        }

        public async Task<RefundResponseDto> ProcessRefundAsync(RefundRequestDto refundRequest)
        {
            try
            {
                // Get the original payment record
                var originalPayment = await _context.PaymentRecords
                    .FirstOrDefaultAsync(p => p.Id == refundRequest.PaymentRecordId && p.OrderId == refundRequest.OrderId);

                if (originalPayment == null)
                {
                    return new RefundResponseDto
                    {
                        Success = false,
                        Message = "Original payment record not found",
                        ErrorCode = "PAYMENT_NOT_FOUND"
                    };
                }

                _logger.LogInformation("Found original payment: Id={PaymentId}, Method={PaymentMethod}, Amount={Amount}, TransactionId={TransactionId}, PaymentIntentId={PaymentIntentId}",
                    originalPayment.Id, originalPayment.PaymentMethod, originalPayment.Amount, originalPayment.TransactionId, originalPayment.PaymentIntentId);

                _logger.LogInformation("Found original payment: Id={PaymentId}, Method={PaymentMethod}, Amount={Amount}, TransactionId={TransactionId}, PaymentIntentId={PaymentIntentId}",
                    originalPayment.Id, originalPayment.PaymentMethod, originalPayment.Amount, originalPayment.TransactionId, originalPayment.PaymentIntentId);

                // Check if refund amount is valid
                var existingRefunds = await _context.PaymentRecords
                    .Where(p => p.RefundedFromPaymentId == originalPayment.Id && p.Status == "Completed")
                    .SumAsync(p => p.Amount);

                var availableForRefund = originalPayment.Amount - existingRefunds;

                if (refundRequest.Amount > availableForRefund)
                {
                    return new RefundResponseDto
                    {
                        Success = false,
                        Message = $"Refund amount ${refundRequest.Amount} exceeds available amount ${availableForRefund}",
                        ErrorCode = "INSUFFICIENT_REFUND_AMOUNT"
                    };
                }

                // Process refund through payment gateway
                PaymentGatewayRefundResult gatewayResult;

                if (originalPayment.PaymentMethod.Equals("Stripe", StringComparison.OrdinalIgnoreCase) ||
                    originalPayment.PaymentMethod.Equals("credit_card", StringComparison.OrdinalIgnoreCase))
                {
                    // For Stripe, try PaymentIntentId first, then TransactionId (for backward compatibility)
                    var paymentIntentId = !string.IsNullOrEmpty(originalPayment.PaymentIntentId)
                        ? originalPayment.PaymentIntentId
                        : originalPayment.TransactionId;

                    if (string.IsNullOrEmpty(paymentIntentId))
                    {
                        return new RefundResponseDto
                        {
                            Success = false,
                            Message = "Payment Intent ID not found for Stripe refund",
                            ErrorCode = "MISSING_PAYMENT_INTENT_ID"
                        };
                    }

                    _logger.LogInformation("Processing Stripe refund with PaymentIntentId: {PaymentIntentId} (from {Source})",
                        paymentIntentId, !string.IsNullOrEmpty(originalPayment.PaymentIntentId) ? "PaymentIntentId" : "TransactionId");

                    gatewayResult = await _paymentGatewayRefundService.ProcessStripeRefundAsync(
                        paymentIntentId,
                        refundRequest.Amount,
                        refundRequest.Reason);
                }
                else if (originalPayment.PaymentMethod.Equals("PayPal", StringComparison.OrdinalIgnoreCase) ||
                         originalPayment.PaymentMethod.Equals("paypal", StringComparison.OrdinalIgnoreCase))
                {
                    if (string.IsNullOrEmpty(originalPayment.TransactionId))
                    {
                        return new RefundResponseDto
                        {
                            Success = false,
                            Message = "Transaction ID not found for PayPal refund",
                            ErrorCode = "MISSING_TRANSACTION_ID"
                        };
                    }

                    _logger.LogInformation("Processing PayPal refund for payment {PaymentId} with transaction ID {TransactionId}",
                        originalPayment.Id, originalPayment.TransactionId);

                    gatewayResult = await _paymentGatewayRefundService.ProcessPayPalRefundAsync(
                        originalPayment.TransactionId,
                        refundRequest.Amount,
                        refundRequest.Reason);
                }
                else
                {
                    return new RefundResponseDto
                    {
                        Success = false,
                        Message = $"Refunds not supported for payment method: {originalPayment.PaymentMethod}",
                        ErrorCode = "UNSUPPORTED_PAYMENT_METHOD"
                    };
                }

                // Check if gateway refund was successful
                if (!gatewayResult.Success)
                {
                    _logger.LogError("Payment gateway refund failed for payment {PaymentId}: {ErrorMessage}",
                        refundRequest.PaymentRecordId, gatewayResult.ErrorMessage);

                    return new RefundResponseDto
                    {
                        Success = false,
                        Message = $"Payment gateway refund failed: {gatewayResult.ErrorMessage}",
                        ErrorCode = gatewayResult.ErrorCode ?? "GATEWAY_REFUND_FAILED"
                    };
                }

                // Create refund record with gateway information
                var refundRecord = new PaymentRecord
                {
                    OrderId = refundRequest.OrderId,
                    PaymentMethod = originalPayment.PaymentMethod,
                    PaymentType = refundRequest.Amount == originalPayment.Amount ? "Refund" : "PartialRefund",
                    Status = gatewayResult.Status == "succeeded" || gatewayResult.Status == "COMPLETED" ? "Completed" : "Pending",
                    Amount = gatewayResult.RefundedAmount,
                    Currency = originalPayment.Currency,
                    RefundedFromPaymentId = originalPayment.Id,
                    RefundId = gatewayResult.RefundId,
                    TransactionId = gatewayResult.RefundId, // Use refund ID as transaction ID for refunds
                    Notes = $"Refund reason: {refundRequest.Reason}. {refundRequest.Notes}",
                    Metadata = gatewayResult.GatewayResponse,
                    ProcessedBy = "Admin", // This should come from the authenticated user
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.PaymentRecords.Add(refundRecord);

                // Update order payment status if fully refunded
                var order = await _context.Orders.FindAsync(refundRequest.OrderId);
                if (order != null)
                {
                    var totalRefunded = existingRefunds + refundRequest.Amount;
                    var totalPaid = await _context.PaymentRecords
                        .Where(p => p.OrderId == refundRequest.OrderId && 
                                   p.PaymentType == "Payment" && 
                                   p.Status == "Completed")
                        .SumAsync(p => p.Amount);

                    if (totalRefunded >= totalPaid)
                    {
                        order.PaymentStatus = "Refunded";
                        order.UpdatedAt = DateTime.UtcNow;
                    }
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Refund processed: {RefundAmount} for payment {PaymentId} on order {OrderId}. Gateway RefundId: {RefundId}",
                    gatewayResult.RefundedAmount, refundRequest.PaymentRecordId, refundRequest.OrderId, gatewayResult.RefundId);

                return new RefundResponseDto
                {
                    Success = true,
                    Message = $"Refund processed successfully through {originalPayment.PaymentMethod}. Refund ID: {gatewayResult.RefundId}",
                    RefundRecord = MapToDto(refundRecord),
                    RefundedAmount = gatewayResult.RefundedAmount,
                    RemainingAmount = availableForRefund - gatewayResult.RefundedAmount
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing refund for payment {PaymentId}", refundRequest.PaymentRecordId);
                return new RefundResponseDto
                {
                    Success = false,
                    Message = "An error occurred while processing the refund",
                    ErrorCode = "REFUND_PROCESSING_ERROR"
                };
            }
        }

        // Database-only refund method removed - only gateway refunds are supported

        public async Task<PaymentSummaryDto> GetOrderPaymentSummaryAsync(int orderId)
        {
            var paymentRecords = await _context.PaymentRecords
                .Where(p => p.OrderId == orderId)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            var payments = paymentRecords.Where(p => p.PaymentType == "Payment").ToList();
            var refunds = paymentRecords.Where(p => p.PaymentType == "Refund" || p.PaymentType == "PartialRefund").ToList();

            var totalPaid = payments.Where(p => p.Status == "Completed").Sum(p => p.Amount);
            var totalRefunded = refunds.Where(p => p.Status == "Completed").Sum(p => p.Amount);

            return new PaymentSummaryDto
            {
                TotalPaid = totalPaid,
                TotalRefunded = totalRefunded,
                NetAmount = totalPaid - totalRefunded,
                PaymentCount = payments.Count,
                RefundCount = refunds.Count,
                Payments = payments.Select(MapToDto).ToList(),
                Refunds = refunds.Select(MapToDto).ToList()
            };
        }

        public async Task<List<PaymentRecordDto>> GetOrderPaymentRecordsAsync(int orderId)
        {
            var paymentRecords = await _context.PaymentRecords
                .Where(p => p.OrderId == orderId)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();

            return paymentRecords.Select(MapToDto).ToList();
        }

        public async Task<PaymentRecordDto?> GetPaymentRecordByIdAsync(int id)
        {
            var paymentRecord = await _context.PaymentRecords.FindAsync(id);
            return paymentRecord != null ? MapToDto(paymentRecord) : null;
        }

        public async Task<bool> UpdatePaymentRecordStatusAsync(int id, string status, string? notes = null)
        {
            var paymentRecord = await _context.PaymentRecords.FindAsync(id);
            if (paymentRecord == null) return false;

            paymentRecord.Status = status;
            paymentRecord.UpdatedAt = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(notes))
            {
                paymentRecord.Notes = string.IsNullOrEmpty(paymentRecord.Notes) 
                    ? notes 
                    : $"{paymentRecord.Notes}\n\n[{DateTime.UtcNow:yyyy-MM-dd HH:mm}] {notes}";
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private static PaymentRecordDto MapToDto(PaymentRecord paymentRecord)
        {
            return new PaymentRecordDto
            {
                Id = paymentRecord.Id,
                OrderId = paymentRecord.OrderId,
                PaymentMethod = paymentRecord.PaymentMethod,
                PaymentType = paymentRecord.PaymentType,
                Status = paymentRecord.Status,
                Amount = paymentRecord.Amount,
                Currency = paymentRecord.Currency,
                TransactionId = paymentRecord.TransactionId,
                PaymentIntentId = paymentRecord.PaymentIntentId,
                ChargeId = paymentRecord.ChargeId,
                RefundId = paymentRecord.RefundId,
                RefundedFromPaymentId = paymentRecord.RefundedFromPaymentId,
                PaymentMethodDetails = paymentRecord.PaymentMethodDetails,
                FailureReason = paymentRecord.FailureReason,
                Notes = paymentRecord.Notes,
                Metadata = paymentRecord.Metadata,
                CreatedAt = paymentRecord.CreatedAt,
                UpdatedAt = paymentRecord.UpdatedAt,
                ProcessedBy = paymentRecord.ProcessedBy
            };
        }
    }
}
