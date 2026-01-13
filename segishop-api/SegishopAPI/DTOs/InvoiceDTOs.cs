using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class InvoiceRequestDto
    {
        [Required]
        public int OrderId { get; set; }
    }

    public class InvoiceResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ErrorCode { get; set; }
        public InvoiceDataDto? Data { get; set; }
    }

    public class InvoiceDataDto
    {
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        
        // Company Information
        public InvoiceCompanyDto Company { get; set; } = new();
        
        // Customer Information
        public InvoiceCustomerDto Customer { get; set; } = new();
        
        // Billing Address
        public InvoiceAddressDto BillingAddress { get; set; } = new();
        
        // Shipping Address
        public InvoiceAddressDto ShippingAddress { get; set; } = new();
        
        // Items
        public List<InvoiceItemDto> Items { get; set; } = new();
        
        // Totals
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ShippingAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal CouponDiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        
        // Additional Information
        public string? Notes { get; set; }
        public string? Terms { get; set; }
    }

    public class InvoiceCompanyDto
    {
        public string Name { get; set; } = "PrintOscar";
        public string Address { get; set; } = "123 Business Street";
        public string City { get; set; } = "Business City";
        public string State { get; set; } = "BC";
        public string ZipCode { get; set; } = "12345";
        public string Country { get; set; } = "United States";
        public string Phone { get; set; } = "(555) 123-4567";
        public string Email { get; set; } = "support@printoscar.com";
        public string Website { get; set; } = "www.printoscar.com";
        public string? TaxId { get; set; } = "TAX123456789";
    }

    public class InvoiceCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int CustomerId { get; set; }
    }

    public class InvoiceAddressDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }

    public class InvoiceItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? SKU { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? ProductAttributes { get; set; }
    }
}
