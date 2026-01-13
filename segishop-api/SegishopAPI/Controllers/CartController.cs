using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.DTOs;
using SegishopAPI.Models;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<CartController> _logger;

        public CartController(SegishopDbContext context, ILogger<CartController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get cart items for a user
        /// </summary>
        [HttpGet("{userId}")]
        public async Task<ActionResult<CartResponse>> GetCart(int userId)
        {
            try
            {
                var cartItems = await _context.CartItems
                    .Include(ci => ci.Product)
                    .ThenInclude(p => p.Images)
                    .Where(ci => ci.UserId == userId)
                    .OrderBy(ci => ci.CreatedAt)
                    .ToListAsync();

                var cartItemDtos = cartItems.Select(ci =>
                {
                    // Try to extract calculated price from ProductAttributes JSON
                    decimal unitPrice = ci.Product.Price; // Default to product price

                    if (!string.IsNullOrEmpty(ci.ProductAttributes))
                    {
                        try
                        {
                            var config = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(ci.ProductAttributes);
                            if (config != null && config.ContainsKey("calculatedPrice"))
                            {
                                if (decimal.TryParse(config["calculatedPrice"].ToString(), out decimal calculatedPrice))
                                {
                                    unitPrice = calculatedPrice;
                                }
                            }
                        }
                        catch
                        {
                            // If JSON parsing fails, use product price
                            unitPrice = ci.Product.Price;
                        }
                    }

                    return new CartItemDto
                    {
                        Id = ci.Id,
                        ProductId = ci.ProductId,
                        ProductName = ci.Product.Name,
                        ProductSlug = ci.Product.Slug ?? "",
                        ProductPrice = unitPrice, // Use calculated price if available
                        ProductImage = ci.Product.Images.FirstOrDefault()?.ImageUrl ?? ci.Product.ImageUrl,
                        ProductAttributes = ci.ProductAttributes,
                        Quantity = ci.Quantity,
                        TotalPrice = unitPrice * ci.Quantity, // Use calculated price for total
                        IsInStock = ci.Product.Stock > 0,
                        StockQuantity = ci.Product.Stock,
                        CreatedAt = ci.CreatedAt,
                        UpdatedAt = ci.UpdatedAt
                    };
                }).ToList();

                var cartSummary = new CartSummaryDto
                {
                    Items = cartItemDtos,
                    TotalItems = cartItemDtos.Sum(ci => ci.Quantity),
                    Subtotal = cartItemDtos.Sum(ci => ci.TotalPrice),
                    UniqueItemsCount = cartItemDtos.Count
                };

                return Ok(new CartResponse
                {
                    Success = true,
                    Cart = cartSummary
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cart for user {UserId}", userId);
                return StatusCode(500, new CartResponse
                {
                    Success = false,
                    Message = "An error occurred while retrieving the cart"
                });
            }
        }

        /// <summary>
        /// Add item to cart
        /// </summary>
        [HttpPost("{userId}/items")]
        public async Task<ActionResult<CartItemResponse>> AddToCart(int userId, [FromBody] AddToCartRequest request)
        {
            try
            {
                // Check if product exists and is active
                var product = await _context.Products
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive);

                if (product == null)
                {
                    return NotFound(new CartItemResponse
                    {
                        Success = false,
                        Message = "Product not found or not available"
                    });
                }

                // Check if item already exists in cart with same attributes
                var existingCartItem = await _context.CartItems
                    .FirstOrDefaultAsync(ci => ci.UserId == userId && 
                                             ci.ProductId == request.ProductId && 
                                             ci.ProductAttributes == request.ProductAttributes);

                if (existingCartItem != null)
                {
                    // Update quantity
                    existingCartItem.Quantity += request.Quantity;
                    existingCartItem.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    // Create new cart item
                    existingCartItem = new CartItem
                    {
                        UserId = userId,
                        ProductId = request.ProductId,
                        Quantity = request.Quantity,
                        ProductAttributes = request.ProductAttributes,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.CartItems.Add(existingCartItem);
                }

                await _context.SaveChangesAsync();

                // Calculate the correct price (use calculated price if provided, otherwise use product price)
                var unitPrice = request.CalculatedPrice ?? product.Price;

                // Return updated cart item
                var cartItemDto = new CartItemDto
                {
                    Id = existingCartItem.Id,
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ProductSlug = product.Slug ?? "",
                    ProductPrice = unitPrice, // Use calculated price as the unit price
                    ProductImage = product.Images.FirstOrDefault()?.ImageUrl ?? product.ImageUrl,
                    ProductAttributes = existingCartItem.ProductAttributes,
                    Quantity = existingCartItem.Quantity,
                    TotalPrice = unitPrice * existingCartItem.Quantity, // Use calculated price for total
                    IsInStock = product.Stock > 0,
                    StockQuantity = product.Stock,
                    CreatedAt = existingCartItem.CreatedAt,
                    UpdatedAt = existingCartItem.UpdatedAt
                };

                return Ok(new CartItemResponse
                {
                    Success = true,
                    CartItem = cartItemDto,
                    Message = "Item added to cart successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to cart for user {UserId}", userId);
                return StatusCode(500, new CartItemResponse
                {
                    Success = false,
                    Message = "An error occurred while adding item to cart"
                });
            }
        }

        /// <summary>
        /// Update cart item quantity
        /// </summary>
        [HttpPut("{userId}/items/{cartItemId}")]
        public async Task<ActionResult<CartItemResponse>> UpdateCartItem(int userId, int cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                var cartItem = await _context.CartItems
                    .Include(ci => ci.Product)
                    .ThenInclude(p => p.Images)
                    .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.UserId == userId);

                if (cartItem == null)
                {
                    return NotFound(new CartItemResponse
                    {
                        Success = false,
                        Message = "Cart item not found"
                    });
                }

                cartItem.Quantity = request.Quantity;
                cartItem.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var cartItemDto = new CartItemDto
                {
                    Id = cartItem.Id,
                    ProductId = cartItem.Product.Id,
                    ProductName = cartItem.Product.Name,
                    ProductSlug = cartItem.Product.Slug ?? "",
                    ProductPrice = cartItem.Product.Price,
                    ProductImage = NormalizeImageUrl(cartItem.Product.Images.FirstOrDefault()?.ImageUrl ?? cartItem.Product.ImageUrl),
                    ProductAttributes = cartItem.ProductAttributes,
                    Quantity = cartItem.Quantity,
                    TotalPrice = cartItem.Product.Price * cartItem.Quantity,
                    IsInStock = cartItem.Product.Stock > 0,
                    StockQuantity = cartItem.Product.Stock,
                    CreatedAt = cartItem.CreatedAt,
                    UpdatedAt = cartItem.UpdatedAt
                };

                return Ok(new CartItemResponse
                {
                    Success = true,
                    CartItem = cartItemDto,
                    Message = "Cart item updated successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cart item {CartItemId} for user {UserId}", cartItemId, userId);
                return StatusCode(500, new CartItemResponse
                {
                    Success = false,
                    Message = "An error occurred while updating cart item"
                });
            }
        }

        /// <summary>
        /// Remove item from cart
        /// </summary>
        [HttpDelete("{userId}/items/{cartItemId}")]
        public async Task<ActionResult<CartResponse>> RemoveFromCart(int userId, int cartItemId)
        {
            try
            {
                var cartItem = await _context.CartItems
                    .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.UserId == userId);

                if (cartItem == null)
                {
                    return NotFound(new CartResponse
                    {
                        Success = false,
                        Message = "Cart item not found"
                    });
                }

                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();

                return Ok(new CartResponse
                {
                    Success = true,
                    Message = "Item removed from cart successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cart item {CartItemId} for user {UserId}", cartItemId, userId);
                return StatusCode(500, new CartResponse
                {
                    Success = false,
                    Message = "An error occurred while removing item from cart"
                });
            }
        }

        /// <summary>
        /// Clear all items from cart
        /// </summary>
        [HttpDelete("{userId}/clear")]
        public async Task<ActionResult<CartResponse>> ClearCart(int userId)
        {
            try
            {
                var cartItems = await _context.CartItems
                    .Where(ci => ci.UserId == userId)
                    .ToListAsync();

                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return Ok(new CartResponse
                {
                    Success = true,
                    Message = "Cart cleared successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart for user {UserId}", userId);
                return StatusCode(500, new CartResponse
                {
                    Success = false,
                    Message = "An error occurred while clearing cart"
                });
            }
        }

        private string? NormalizeImageUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return url;
        var origin = $"{Request.Scheme}://{Request.Host.Value}";
        if (url.StartsWith("http://localhost") || url.StartsWith("https://localhost") || url.StartsWith("http://0.0.0.0") || url.StartsWith("https://0.0.0.0"))
        {
            try
            {
                var u = new Uri(url);
                var pathAndQuery = u.PathAndQuery;
                return origin + pathAndQuery;
            }
            catch { return origin; }
        }
        if (url.StartsWith("/")) return origin + url;
        if (url.StartsWith("uploads/")) return origin + "/" + url;
        return url;
    }
    }
}
