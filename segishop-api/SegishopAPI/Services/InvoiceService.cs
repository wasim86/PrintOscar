using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Services
{
    public interface IInvoiceService
    {
        Task<InvoiceResponseDto> GenerateInvoiceAsync(int orderId, int userId);
        Task<byte[]> GenerateInvoicePdfAsync(int orderId, int userId);
        Task<InvoiceResponseDto> GenerateGuestInvoiceAsync(string orderNumber);
        Task<byte[]> GenerateGuestInvoicePdfAsync(string orderNumber);
    }

    public class InvoiceService : IInvoiceService
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<InvoiceService> _logger;

        public InvoiceService(SegishopDbContext context, ILogger<InvoiceService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<InvoiceResponseDto> GenerateInvoiceAsync(int orderId, int userId)
        {
            try
            {
                // Get order with all related data
                var order = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

                if (order == null)
                {
                    return new InvoiceResponseDto
                    {
                        Success = false,
                        Message = "Order not found or access denied.",
                        ErrorCode = "ORDER_NOT_FOUND"
                    };
                }

                // Generate invoice data
                var invoiceData = new InvoiceDataDto
                {
                    InvoiceNumber = GenerateInvoiceNumber(order),
                    InvoiceDate = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(30),
                    OrderNumber = order.OrderNumber,
                    OrderDate = order.CreatedAt,
                    Status = order.Status,
                    PaymentStatus = order.PaymentStatus,
                    PaymentMethod = order.PaymentMethod,
                    
                    Company = new InvoiceCompanyDto(),
                    
                    Customer = new InvoiceCustomerDto
                    {
                        CustomerId = order.UserId ?? 0, // Use 0 for guest orders
                        Name = order.BillingName ?? (order.User != null ? $"{order.User.FirstName} {order.User.LastName}" : $"{order.GuestFirstName} {order.GuestLastName}"),
                        Email = order.User?.Email ?? order.GuestEmail ?? "",
                        Phone = order.BillingPhone ?? order.ShippingPhone
                    },
                    
                    BillingAddress = new InvoiceAddressDto
                    {
                        Name = order.BillingName ?? (order.User != null ? $"{order.User.FirstName} {order.User.LastName}" : $"{order.GuestFirstName} {order.GuestLastName}"),
                        Address = order.BillingAddress ?? order.ShippingAddress,
                        City = order.BillingCity ?? order.ShippingCity,
                        State = order.BillingState ?? order.ShippingState,
                        ZipCode = order.BillingZip ?? order.ShippingZip,
                        Country = order.BillingCountry ?? order.ShippingCountry,
                        Phone = order.BillingPhone ?? order.ShippingPhone
                    },
                    
                    ShippingAddress = new InvoiceAddressDto
                    {
                        Name = order.ShippingName,
                        Address = order.ShippingAddress,
                        City = order.ShippingCity,
                        State = order.ShippingState,
                        ZipCode = order.ShippingZip,
                        Country = order.ShippingCountry,
                        Phone = order.ShippingPhone
                    },
                    
                    Items = order.OrderItems.Select(oi => new InvoiceItemDto
                    {
                        ProductId = oi.ProductId,
                        Name = oi.ProductName,
                        Description = oi.Product?.Description,
                        SKU = oi.ProductSKU,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        TotalPrice = oi.TotalPrice,
                        ProductAttributes = oi.ProductAttributes
                    }).ToList(),
                    
                    SubTotal = order.SubTotal,
                    TaxAmount = order.TaxAmount,
                    ShippingAmount = order.ShippingAmount,
                    DiscountAmount = order.DiscountAmount,
                    CouponDiscountAmount = order.CouponDiscountAmount,
                    TotalAmount = order.TotalAmount,
                    
                    Notes = order.Notes,
                    Terms = "Payment is due within 30 days. Thank you for your business!"
                };

                return new InvoiceResponseDto
                {
                    Success = true,
                    Message = "Invoice generated successfully",
                    Data = invoiceData
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating invoice for order {OrderId}", orderId);
                return new InvoiceResponseDto
                {
                    Success = false,
                    Message = "An error occurred while generating the invoice.",
                    ErrorCode = "INTERNAL_ERROR"
                };
            }
        }

        public async Task<byte[]> GenerateInvoicePdfAsync(int orderId, int userId)
        {
            var invoiceResponse = await GenerateInvoiceAsync(orderId, userId);

            if (!invoiceResponse.Success || invoiceResponse.Data == null)
            {
                throw new InvalidOperationException(invoiceResponse.Message);
            }

            // Generate HTML content for the invoice
            var htmlContent = GenerateInvoiceHtml(invoiceResponse.Data);

            // For now, return HTML as bytes (you can integrate a PDF library later)
            return System.Text.Encoding.UTF8.GetBytes(htmlContent);
        }

        public async Task<InvoiceResponseDto> GenerateGuestInvoiceAsync(string orderNumber)
        {
            try
            {
                // Find order by order number (for guest orders)
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

                if (order == null)
                {
                    throw new InvalidOperationException("Order not found.");
                }

                // Generate invoice data
                var invoiceData = new InvoiceDataDto
                {
                    InvoiceNumber = GenerateInvoiceNumber(order),
                    InvoiceDate = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(30),
                    OrderNumber = order.OrderNumber,
                    OrderDate = order.CreatedAt,
                    Status = order.Status,
                    PaymentStatus = order.PaymentStatus,
                    PaymentMethod = order.PaymentMethod,

                    Company = new InvoiceCompanyDto(),

                    Customer = new InvoiceCustomerDto
                    {
                        CustomerId = 0, // Guest customer
                        Name = $"{order.GuestFirstName} {order.GuestLastName}",
                        Email = order.GuestEmail ?? "",
                        Phone = order.GuestPhone
                    },

                    BillingAddress = new InvoiceAddressDto
                    {
                        Name = order.BillingName ?? $"{order.GuestFirstName} {order.GuestLastName}",
                        Address = order.BillingAddress ?? order.ShippingAddress,
                        City = order.BillingCity ?? order.ShippingCity,
                        State = order.BillingState ?? order.ShippingState,
                        ZipCode = order.BillingZip ?? order.ShippingZip,
                        Country = order.BillingCountry ?? order.ShippingCountry,
                        Phone = order.BillingPhone ?? order.ShippingPhone
                    },

                    ShippingAddress = new InvoiceAddressDto
                    {
                        Name = order.ShippingName ?? $"{order.GuestFirstName} {order.GuestLastName}",
                        Address = order.ShippingAddress,
                        City = order.ShippingCity,
                        State = order.ShippingState,
                        ZipCode = order.ShippingZip,
                        Country = order.ShippingCountry,
                        Phone = order.ShippingPhone
                    },

                    Items = order.OrderItems.Select(oi => new InvoiceItemDto
                    {
                        ProductId = oi.ProductId,
                        Name = oi.ProductName,
                        Description = oi.Product?.Description,
                        SKU = oi.ProductSKU,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        TotalPrice = oi.TotalPrice,
                        ProductAttributes = oi.ProductAttributes
                    }).ToList(),

                    SubTotal = order.SubTotal,
                    TaxAmount = order.TaxAmount,
                    ShippingAmount = order.ShippingAmount,
                    DiscountAmount = order.DiscountAmount,
                    CouponDiscountAmount = order.CouponDiscountAmount,
                    TotalAmount = order.TotalAmount,

                    Notes = order.Notes,
                    Terms = "Payment is due within 30 days. Thank you for your business!"
                };

                return new InvoiceResponseDto
                {
                    Success = true,
                    Message = "Invoice generated successfully",
                    Data = invoiceData
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating guest invoice for order {OrderNumber}", orderNumber);
                return new InvoiceResponseDto
                {
                    Success = false,
                    Message = "An error occurred while generating the invoice.",
                    ErrorCode = "INTERNAL_ERROR"
                };
            }
        }

        public async Task<byte[]> GenerateGuestInvoicePdfAsync(string orderNumber)
        {
            var invoiceResponse = await GenerateGuestInvoiceAsync(orderNumber);

            if (!invoiceResponse.Success || invoiceResponse.Data == null)
            {
                throw new InvalidOperationException(invoiceResponse.Message);
            }

            // Generate HTML content for the invoice
            var htmlContent = GenerateInvoiceHtml(invoiceResponse.Data);

            // For now, return HTML as bytes (you can integrate a PDF library later)
            return System.Text.Encoding.UTF8.GetBytes(htmlContent);
        }

        private string GenerateInvoiceNumber(Order order)
        {
            return $"INV-{order.OrderNumber.Replace("ORD-", "")}";
        }

        private string GenerateInvoiceHtml(InvoiceDataDto invoice)
        {
            var html = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Invoice {invoice.InvoiceNumber}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }}
        .header {{ display: flex; justify-content: space-between; margin-bottom: 30px; }}
        .company-info {{ text-align: left; }}
        .invoice-info {{ text-align: right; }}
        .company-name {{ font-size: 24px; font-weight: bold; color: #2563eb; }}
        .invoice-title {{ font-size: 28px; font-weight: bold; margin-bottom: 10px; }}
        .addresses {{ display: flex; justify-content: space-between; margin: 30px 0; }}
        .address-block {{ width: 45%; }}
        .address-title {{ font-weight: bold; margin-bottom: 10px; color: #374151; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }}
        th {{ background-color: #f9fafb; font-weight: bold; }}
        .totals {{ margin-top: 20px; }}
        .totals table {{ width: 300px; margin-left: auto; }}
        .total-row {{ font-weight: bold; font-size: 16px; }}
        .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }}
        .text-right {{ text-align: right; }}
        .text-center {{ text-align: center; }}
    </style>
</head>
<body>
    <div class='header'>
        <div class='company-info'>
            <div class='company-name'>{invoice.Company.Name}</div>
            <div>{invoice.Company.Address}</div>
            <div>{invoice.Company.City}, {invoice.Company.State} {invoice.Company.ZipCode}</div>
            <div>{invoice.Company.Country}</div>
            <div>Phone: {invoice.Company.Phone}</div>
            <div>Email: {invoice.Company.Email}</div>
        </div>
        <div class='invoice-info'>
            <div class='invoice-title'>INVOICE</div>
            <div><strong>Invoice #:</strong> {invoice.InvoiceNumber}</div>
            <div><strong>Invoice Date:</strong> {invoice.InvoiceDate:MMM dd, yyyy}</div>
            <div><strong>Due Date:</strong> {invoice.DueDate:MMM dd, yyyy}</div>
            <div><strong>Order #:</strong> {invoice.OrderNumber}</div>
        </div>
    </div>

    <div class='addresses'>
        <div class='address-block'>
            <div class='address-title'>Bill To:</div>
            <div><strong>{invoice.BillingAddress.Name}</strong></div>
            <div>{invoice.BillingAddress.Address}</div>
            <div>{invoice.BillingAddress.City}, {invoice.BillingAddress.State} {invoice.BillingAddress.ZipCode}</div>
            <div>{invoice.BillingAddress.Country}</div>
            {(string.IsNullOrEmpty(invoice.BillingAddress.Phone) ? "" : $"<div>Phone: {invoice.BillingAddress.Phone}</div>")}
        </div>
        <div class='address-block'>
            <div class='address-title'>Ship To:</div>
            <div><strong>{invoice.ShippingAddress.Name}</strong></div>
            <div>{invoice.ShippingAddress.Address}</div>
            <div>{invoice.ShippingAddress.City}, {invoice.ShippingAddress.State} {invoice.ShippingAddress.ZipCode}</div>
            <div>{invoice.ShippingAddress.Country}</div>
            {(string.IsNullOrEmpty(invoice.ShippingAddress.Phone) ? "" : $"<div>Phone: {invoice.ShippingAddress.Phone}</div>")}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>SKU</th>
                <th class='text-center'>Qty</th>
                <th class='text-right'>Unit Price</th>
                <th class='text-right'>Total</th>
            </tr>
        </thead>
        <tbody>";

            foreach (var item in invoice.Items)
            {
                html += $@"
            <tr>
                <td>
                    <div><strong>{item.Name}</strong></div>
                    {(string.IsNullOrEmpty(item.Description) ? "" : $"<div style='font-size: 12px; color: #6b7280;'>{item.Description}</div>")}
                    {(string.IsNullOrEmpty(item.ProductAttributes) ? "" : $"<div style='font-size: 12px; color: #6b7280;'>{item.ProductAttributes}</div>")}
                </td>
                <td>{item.SKU ?? "N/A"}</td>
                <td class='text-center'>{item.Quantity}</td>
                <td class='text-right'>${item.UnitPrice:F2}</td>
                <td class='text-right'>${item.TotalPrice:F2}</td>
            </tr>";
            }

            html += $@"
        </tbody>
    </table>

    <div class='totals'>
        <table>
            <tr>
                <td>Subtotal:</td>
                <td class='text-right'>${invoice.SubTotal:F2}</td>
            </tr>";

            if (invoice.DiscountAmount > 0)
            {
                html += $@"
            <tr>
                <td>Discount:</td>
                <td class='text-right'>-${invoice.DiscountAmount:F2}</td>
            </tr>";
            }

            if (invoice.CouponDiscountAmount > 0)
            {
                html += $@"
            <tr>
                <td>Coupon Discount:</td>
                <td class='text-right'>-${invoice.CouponDiscountAmount:F2}</td>
            </tr>";
            }

            if (invoice.ShippingAmount > 0)
            {
                html += $@"
            <tr>
                <td>Shipping:</td>
                <td class='text-right'>${invoice.ShippingAmount:F2}</td>
            </tr>";
            }

            if (invoice.TaxAmount > 0)
            {
                html += $@"
            <tr>
                <td>Tax:</td>
                <td class='text-right'>${invoice.TaxAmount:F2}</td>
            </tr>";
            }

            html += $@"
            <tr class='total-row'>
                <td><strong>Total:</strong></td>
                <td class='text-right'><strong>${invoice.TotalAmount:F2}</strong></td>
            </tr>
        </table>
    </div>

    <div class='footer'>
        <div><strong>Payment Status:</strong> {invoice.PaymentStatus}</div>
        <div><strong>Payment Method:</strong> {invoice.PaymentMethod}</div>
        {(string.IsNullOrEmpty(invoice.Terms) ? "" : $"<div style='margin-top: 20px;'><strong>Terms:</strong> {invoice.Terms}</div>")}
        {(string.IsNullOrEmpty(invoice.Notes) ? "" : $"<div style='margin-top: 10px;'><strong>Notes:</strong> {invoice.Notes}</div>")}
        
        <div class='text-center' style='margin-top: 30px; color: #6b7280;'>
            Thank you for your business!
        </div>
    </div>
</body>
</html>";

            return html;
        }
    }
}
