using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    // Request DTOs
    public class AddToCartRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        public string? ProductAttributes { get; set; } // JSON for size, color, etc.

        public decimal? CalculatedPrice { get; set; } // Calculated price from product detail page
    }

    public class UpdateCartItemRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }

    // Response DTOs
    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSlug { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
        public string? ProductImage { get; set; }
        public string? ProductAttributes { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public bool IsInStock { get; set; }
        public int StockQuantity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CartSummaryDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public int TotalItems { get; set; }
        public decimal Subtotal { get; set; }
        public int UniqueItemsCount { get; set; }
    }

    public class CartResponse
    {
        public bool Success { get; set; }
        public CartSummaryDto? Cart { get; set; }
        public string? Message { get; set; }
    }

    public class CartItemResponse
    {
        public bool Success { get; set; }
        public CartItemDto? CartItem { get; set; }
        public string? Message { get; set; }
    }
}
