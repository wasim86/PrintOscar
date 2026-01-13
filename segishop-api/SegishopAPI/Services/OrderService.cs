using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;

namespace SegishopAPI.Services
{
    public interface IOrderService
    {
        Task<CreateOrderResponseDto> CreateOrderAsync(CreateOrderDto createOrderDto);
        Task<OrderResponseDto?> GetOrderByIdAsync(int orderId);
        Task<OrderResponseDto?> GetOrderByNumberAsync(string orderNumber);
        Task<OrderListResponseDto> GetOrdersAsync(int page = 1, int pageSize = 10, string? status = null, int? userId = null);
        Task<bool> UpdateOrderStatusAsync(int orderId, string status);
        Task<string> GenerateOrderNumberAsync();
        Task<OrderTrackingResponseDto> TrackOrderAsync(TrackOrderRequestDto request);

        // Admin-specific methods
        Task<AdminOrderListResponseDto> GetAdminOrdersAsync(AdminOrderListRequestDto request);
        Task<AdminOrderDetailDto?> GetAdminOrderByIdAsync(int orderId);
        Task<AdminOrderActionResponseDto> UpdateOrderStatusAdminAsync(int orderId, UpdateOrderStatusDto updateStatusDto);
        Task<AdminOrderActionResponseDto> UpdateOrderAsync(int orderId, UpdateOrderDto updateOrderDto);

        Task<AdminOrderStatsDto> GetOrderStatsAsync(DateTime? startDate = null, DateTime? endDate = null);
    }

    public class OrderService : IOrderService
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<OrderService> _logger;
        private readonly IPaymentRecordService _paymentRecordService;
        private readonly IOrderStatusHistoryService _statusHistoryService;
        private readonly IEmailService _emailService;

        public OrderService(SegishopDbContext context, ILogger<OrderService> logger,
            IPaymentRecordService paymentRecordService, IOrderStatusHistoryService statusHistoryService,
            IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _paymentRecordService = paymentRecordService;
            _statusHistoryService = statusHistoryService;
            _emailService = emailService;
        }

        public async Task<CreateOrderResponseDto> CreateOrderAsync(CreateOrderDto createOrderDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Validate user exists (only for authenticated orders)
                User? user = null;
                if (createOrderDto.UserId.HasValue)
                {
                    user = await _context.Users.FindAsync(createOrderDto.UserId.Value);
                    if (user == null)
                    {
                        return new CreateOrderResponseDto
                        {
                            Success = false,
                            Message = "User not found",
                            ErrorCode = "USER_NOT_FOUND"
                        };
                    }
                }

                // Validate products exist and have sufficient stock
                var productIds = createOrderDto.Items.Select(i => i.ProductId).ToList();
                var products = await _context.Products
                    .Where(p => productIds.Contains(p.Id))
                    .ToDictionaryAsync(p => p.Id, p => p);

                var validationErrors = new List<string>();
                foreach (var item in createOrderDto.Items)
                {
                    if (!products.ContainsKey(item.ProductId))
                    {
                        validationErrors.Add($"Product with ID {item.ProductId} not found");
                    }
                    // Add stock validation here if you have inventory tracking
                }

                if (validationErrors.Any())
                {
                    return new CreateOrderResponseDto
                    {
                        Success = false,
                        Message = "Validation failed",
                        ValidationErrors = validationErrors
                    };
                }

                // Generate order number
                var orderNumber = await GenerateOrderNumberAsync();

                // Determine order status based on payment status
                var orderStatus = createOrderDto.PaymentInfo.PaymentStatus.ToLower() switch
                {
                    "success" => "Confirmed",
                    "pending" => "Pending",
                    "failed" => "Failed",
                    _ => "Pending"
                };

                // Look up CouponId if not provided but CouponCode is available
                if (!createOrderDto.CouponId.HasValue && !string.IsNullOrEmpty(createOrderDto.CouponCode))
                {
                    var coupon = await _context.Coupons
                        .FirstOrDefaultAsync(c => c.Code.ToUpper() == createOrderDto.CouponCode.ToUpper());
                    if (coupon != null)
                    {
                        createOrderDto.CouponId = coupon.Id;
                    }
                }



                // Create order
                var order = new Order
                {
                    UserId = createOrderDto.UserId,

                    // Guest customer information (for guest orders)
                    GuestEmail = createOrderDto.GuestEmail,
                    GuestFirstName = createOrderDto.GuestFirstName,
                    GuestLastName = createOrderDto.GuestLastName,
                    GuestPhone = createOrderDto.GuestPhone,



                    OrderNumber = orderNumber,
                    Status = orderStatus,
                    SubTotal = createOrderDto.Totals.SubTotal,
                    TaxAmount = createOrderDto.Totals.TaxAmount,
                    ShippingAmount = createOrderDto.Totals.ShippingAmount,
                    DiscountAmount = createOrderDto.Totals.DiscountAmount,
                    TotalAmount = createOrderDto.Totals.TotalAmount,
                    
                    // Coupon information
                    CouponId = createOrderDto.CouponId,
                    CouponCode = createOrderDto.CouponCode,
                    CouponDiscountAmount = createOrderDto.CouponDiscountAmount,
                    
                    // Shipping address
                    ShippingName = $"{createOrderDto.ShippingAddress.FirstName} {createOrderDto.ShippingAddress.LastName}",
                    ShippingAddress = createOrderDto.ShippingAddress.Address,
                    ShippingCity = createOrderDto.ShippingAddress.City,
                    ShippingState = createOrderDto.ShippingAddress.State,
                    ShippingZip = createOrderDto.ShippingAddress.ZipCode,
                    ShippingCountry = createOrderDto.ShippingAddress.Country,
                    ShippingPhone = createOrderDto.ShippingAddress.Phone,
                    
                    // Shipping method
                    ShippingZoneMethodId = createOrderDto.ShippingZoneMethodId,
                    ShippingMethodTitle = createOrderDto.ShippingMethodTitle,
                    
                    // Payment information
                    PaymentMethod = createOrderDto.PaymentInfo.PaymentMethod,
                    PaymentStatus = createOrderDto.PaymentInfo.PaymentStatus,
                    PaymentTransactionId = createOrderDto.PaymentInfo.PaymentTransactionId,
                    
                    Notes = createOrderDto.Notes,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Create order items
                foreach (var itemDto in createOrderDto.Items)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = itemDto.ProductId,
                        ProductName = itemDto.ProductName,
                        ProductSKU = itemDto.ProductSKU,
                        UnitPrice = itemDto.UnitPrice,
                        Quantity = itemDto.Quantity,
                        TotalPrice = itemDto.TotalPrice,
                        ProductAttributes = itemDto.ProductAttributes
                    };

                    _context.OrderItems.Add(orderItem);
                    await _context.SaveChangesAsync();

                    // Create order item configurations if any
                    if (itemDto.Configurations != null && itemDto.Configurations.Any())
                    {
                        foreach (var configDto in itemDto.Configurations)
                        {
                            var configuration = new OrderItemConfiguration
                            {
                                OrderItemId = orderItem.Id,
                                ConfigurationTypeId = configDto.ConfigurationTypeId,
                                ConfigurationOptionId = configDto.ConfigurationOptionId,
                                CustomValue = configDto.CustomValue,
                                CreatedAt = DateTime.UtcNow
                            };

                            _context.OrderItemConfigurations.Add(configuration);
                        }
                    }
                }

                await _context.SaveChangesAsync();

                // Create payment record if payment was successful
                if (!string.IsNullOrEmpty(createOrderDto.PaymentInfo.PaymentTransactionId) &&
                    string.Equals(createOrderDto.PaymentInfo.PaymentStatus, "success", StringComparison.OrdinalIgnoreCase))
                {
                    var paymentRecord = new PaymentRecord
                    {
                        OrderId = order.Id,
                        PaymentMethod = createOrderDto.PaymentInfo.PaymentMethod,
                        PaymentType = "Payment",
                        Status = "Completed",
                        Amount = createOrderDto.PaymentInfo.Amount > 0 ? createOrderDto.PaymentInfo.Amount : createOrderDto.Totals.TotalAmount,
                        Currency = createOrderDto.PaymentInfo.Currency ?? "USD",
                        TransactionId = createOrderDto.PaymentInfo.PaymentTransactionId,
                        PaymentIntentId = createOrderDto.PaymentInfo.PaymentIntentId,
                        PaymentMethodDetails = createOrderDto.PaymentInfo.PaymentMethodDetails,
                        Notes = "Payment processed during order creation",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        ProcessedBy = "System"
                    };

                    _context.PaymentRecords.Add(paymentRecord);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Payment record created for order {OrderNumber} with transaction ID {TransactionId}",
                        orderNumber, createOrderDto.PaymentInfo.PaymentTransactionId);
                }

                // Record coupon usage if a coupon was applied
                if (createOrderDto.UserId.HasValue && createOrderDto.UserId > 0 && createOrderDto.CouponDiscountAmount > 0 &&
                    createOrderDto.CouponId.HasValue)
                {
                    var couponUsage = new CouponUsage
                    {
                        CouponId = createOrderDto.CouponId.Value,
                        UserId = createOrderDto.UserId.Value,
                        OrderId = order.Id,
                        DiscountAmount = createOrderDto.CouponDiscountAmount,
                        OrderSubtotal = createOrderDto.Totals.SubTotal,
                        UsedAt = DateTime.UtcNow
                    };

                    _context.CouponUsages.Add(couponUsage);

                    // Update coupon's current total uses
                    var coupon = await _context.Coupons.FindAsync(createOrderDto.CouponId.Value);
                    if (coupon != null)
                    {
                        coupon.CurrentTotalUses++;
                        _context.Coupons.Update(coupon);
                    }

                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Coupon usage recorded for order {OrderNumber}, coupon {CouponCode}, user {UserId}",
                        orderNumber, createOrderDto.CouponCode, createOrderDto.UserId);
                }

                // Create initial status history record
                await _statusHistoryService.RecordStatusChangeAsync(
                    order.Id,
                    "New",
                    orderStatus,
                    "Order created",
                    "System",
                    "OrderCreation",
                    notifyCustomer: true
                );

                await transaction.CommitAsync();

                // Return created order
                var createdOrder = await GetOrderByIdAsync(order.Id);

                _logger.LogInformation("Order {OrderNumber} created successfully for user {UserId}", orderNumber, createOrderDto.UserId);

                // Send order confirmation email (only for successful orders)
                if (orderStatus == "Confirmed" && createdOrder != null)
                {
                    try
                    {
                        var emailSent = await _emailService.SendOrderConfirmationEmailAsync(
                            user.Email,
                            orderNumber,
                            createOrderDto.Totals.TotalAmount
                        );

                        if (!emailSent)
                        {
                            _logger.LogWarning("Failed to send order confirmation email for order {OrderNumber} to {Email}",
                                orderNumber, user.Email);
                        }
                        else
                        {
                            _logger.LogInformation("Order confirmation email sent successfully for order {OrderNumber} to {Email}",
                                orderNumber, user.Email);
                        }
                    }
                    catch (Exception emailEx)
                    {
                        _logger.LogError(emailEx, "Error sending order confirmation email for order {OrderNumber}", orderNumber);
                        // Don't fail the order creation if email fails
                    }
                }

                return new CreateOrderResponseDto
                {
                    Success = true,
                    Message = "Order created successfully",
                    Order = createdOrder
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating order for user {UserId}", createOrderDto.UserId);
                
                return new CreateOrderResponseDto
                {
                    Success = false,
                    Message = "An error occurred while creating the order",
                    ErrorCode = "INTERNAL_ERROR"
                };
            }
        }

        public async Task<string> GenerateOrderNumberAsync()
        {
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var random = new Random().Next(1000, 9999);
            var orderNumber = $"ORD-{timestamp}-{random}";
            
            // Ensure uniqueness
            while (await _context.Orders.AnyAsync(o => o.OrderNumber == orderNumber))
            {
                random = new Random().Next(1000, 9999);
                orderNumber = $"ORD-{timestamp}-{random}";
            }
            
            return orderNumber;
        }

        public async Task<OrderResponseDto?> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null) return null;

            return MapToOrderResponseDto(order);
        }

        public async Task<OrderResponseDto?> GetOrderByNumberAsync(string orderNumber)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

            if (order == null) return null;

            return MapToOrderResponseDto(order);
        }

        public async Task<OrderListResponseDto> GetOrdersAsync(int page = 1, int pageSize = 10, string? status = null, int? userId = null)
        {
            var query = _context.Orders
                .Include(o => o.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.Status.ToLower() == status.ToLower());
            }

            if (userId.HasValue)
            {
                query = query.Where(o => o.UserId == userId.Value);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrderSummaryDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    Status = o.Status,
                    PaymentStatus = o.PaymentStatus,
                    TotalAmount = o.TotalAmount,
                    ItemCount = o.OrderItems.Count,
                    CreatedAt = o.CreatedAt,
                    CustomerName = $"{o.User.FirstName} {o.User.LastName}",
                    CustomerEmail = o.User.Email,
                    ShippingMethodTitle = o.ShippingMethodTitle
                })
                .ToListAsync();

            return new OrderListResponseDto
            {
                Orders = orders,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages
            };
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return false;

            var oldStatus = order.Status;
            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Record status change in history
            await _statusHistoryService.RecordStatusChangeAsync(orderId, oldStatus, status,
                changeReason: "SystemUpdate");

            return true;
        }

        // Admin-specific methods implementation
        public async Task<AdminOrderListResponseDto> GetAdminOrdersAsync(AdminOrderListRequestDto request)
        {
            var query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Status))
            {
                query = query.Where(o => o.Status.ToLower() == request.Status.ToLower());
            }

            if (!string.IsNullOrEmpty(request.PaymentStatus))
            {
                query = query.Where(o => o.PaymentStatus.ToLower() == request.PaymentStatus.ToLower());
            }

            if (!string.IsNullOrEmpty(request.PaymentMethod))
            {
                query = query.Where(o => o.PaymentMethod.ToLower() == request.PaymentMethod.ToLower());
            }

            if (!string.IsNullOrEmpty(request.CustomerEmail))
            {
                query = query.Where(o => o.User.Email.ToLower().Contains(request.CustomerEmail.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.OrderNumber))
            {
                query = query.Where(o => o.OrderNumber.Contains(request.OrderNumber));
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt <= request.EndDate.Value);
            }

            if (request.MinAmount.HasValue)
            {
                query = query.Where(o => o.TotalAmount >= request.MinAmount.Value);
            }

            if (request.MaxAmount.HasValue)
            {
                query = query.Where(o => o.TotalAmount <= request.MaxAmount.Value);
            }

            // Apply sorting
            query = request.SortBy?.ToLower() switch
            {
                "totalamount" => request.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(o => o.TotalAmount)
                    : query.OrderByDescending(o => o.TotalAmount),
                "ordernumber" => request.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(o => o.OrderNumber)
                    : query.OrderByDescending(o => o.OrderNumber),
                _ => request.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(o => o.CreatedAt)
                    : query.OrderByDescending(o => o.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            var orders = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(o => new AdminOrderSummaryDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    Status = o.Status,
                    PaymentStatus = o.PaymentStatus,
                    PaymentMethod = o.PaymentMethod,
                    TotalAmount = o.TotalAmount,
                    ItemCount = o.OrderItems.Count,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,
                    CustomerName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : $"{o.GuestFirstName} {o.GuestLastName}",
                    CustomerEmail = o.User != null ? o.User.Email : o.GuestEmail ?? "",
                    ShippingCity = o.ShippingCity,
                    ShippingState = o.ShippingState,
                    ShippingCountry = o.ShippingCountry,
                    ShippingMethodTitle = o.ShippingMethodTitle,
                    TrackingNumber = o.TrackingNumber,
                    CourierService = o.CourierService,
                    EstimatedDeliveryDate = o.EstimatedDeliveryDate,
                    PaymentTransactionId = o.PaymentTransactionId,
                    CouponCode = o.CouponCode,
                    CouponDiscountAmount = o.CouponDiscountAmount
                })
                .ToListAsync();

            // Get stats
            var stats = await GetOrderStatsAsync(request.StartDate, request.EndDate);

            return new AdminOrderListResponseDto
            {
                Orders = orders,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                Stats = stats
            };
        }

        public async Task<AdminOrderDetailDto?> GetAdminOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null) return null;

            var adminOrder = MapToAdminOrderDetailDto(order);
            adminOrder.AvailableActions = GetAvailableActions(order);

            return adminOrder;
        }

        public async Task<AdminOrderActionResponseDto> UpdateOrderStatusAdminAsync(int orderId, UpdateOrderStatusDto updateStatusDto)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                {
                    return new AdminOrderActionResponseDto
                    {
                        Success = false,
                        Message = "Order not found",
                        ErrorCode = "ORDER_NOT_FOUND"
                    };
                }

                var oldStatus = order.Status;
                order.Status = updateStatusDto.Status;
                order.UpdatedAt = DateTime.UtcNow;

                // Update tracking information
                if (!string.IsNullOrEmpty(updateStatusDto.TrackingNumber))
                {
                    order.TrackingNumber = updateStatusDto.TrackingNumber;
                }

                if (!string.IsNullOrEmpty(updateStatusDto.CourierService))
                {
                    order.CourierService = updateStatusDto.CourierService;
                }

                if (updateStatusDto.EstimatedDeliveryDate.HasValue)
                {
                    order.EstimatedDeliveryDate = updateStatusDto.EstimatedDeliveryDate;
                }

                if (!string.IsNullOrEmpty(updateStatusDto.Notes))
                {
                    order.Notes = string.IsNullOrEmpty(order.Notes)
                        ? updateStatusDto.Notes
                        : $"{order.Notes}\n\n[{DateTime.UtcNow:yyyy-MM-dd HH:mm}] {updateStatusDto.Notes}";
                }

                await _context.SaveChangesAsync();

                // Record status change in history
                await _statusHistoryService.RecordStatusChangeAsync(orderId, oldStatus, updateStatusDto.Status,
                    updateStatusDto.Notes, "Admin", "AdminUpdate", notifyCustomer: true);

                _logger.LogInformation("Order {OrderNumber} status updated from {OldStatus} to {NewStatus}",
                    order.OrderNumber, oldStatus, updateStatusDto.Status);

                // Send order status update email to customer
                try
                {
                    var user = await _context.Users.FindAsync(order.UserId);
                    if (user != null)
                    {
                        var userName = $"{user.FirstName} {user.LastName}".Trim();
                        var emailSent = await _emailService.SendOrderStatusUpdateEmailAsync(
                            user.Email,
                            userName,
                            order.OrderNumber,
                            oldStatus,
                            updateStatusDto.Status,
                            updateStatusDto.Notes
                        );

                        if (!emailSent)
                        {
                            _logger.LogWarning("Failed to send order status update email for order {OrderNumber} to {Email}",
                                order.OrderNumber, user.Email);
                        }
                        else
                        {
                            _logger.LogInformation("Order status update email sent successfully for order {OrderNumber} to {Email}",
                                order.OrderNumber, user.Email);
                        }
                    }
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Error sending order status update email for order {OrderNumber}", order.OrderNumber);
                    // Don't fail the status update if email fails
                }

                var updatedOrder = await GetAdminOrderByIdAsync(orderId);

                return new AdminOrderActionResponseDto
                {
                    Success = true,
                    Message = $"Order status updated to {updateStatusDto.Status}",
                    Order = updatedOrder
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {OrderId}", orderId);
                return new AdminOrderActionResponseDto
                {
                    Success = false,
                    Message = "An error occurred while updating order status",
                    ErrorCode = "INTERNAL_ERROR"
                };
            }
        }

        private static OrderResponseDto MapToOrderResponseDto(Order order)
        {
            return new OrderResponseDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                SubTotal = order.SubTotal,
                TaxAmount = order.TaxAmount,
                ShippingAmount = order.ShippingAmount,
                DiscountAmount = order.DiscountAmount,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                PaymentTransactionId = order.PaymentTransactionId,
                Notes = order.Notes,

                // Shipping Information
                ShippingName = order.ShippingName,
                ShippingAddress = order.ShippingAddress,
                ShippingCity = order.ShippingCity,
                ShippingState = order.ShippingState,
                ShippingZip = order.ShippingZip,
                ShippingCountry = order.ShippingCountry,
                ShippingPhone = order.ShippingPhone,
                ShippingMethodTitle = order.ShippingMethodTitle,

                // Coupon Information
                CouponCode = order.CouponCode,
                CouponDiscountAmount = order.CouponDiscountAmount,

                // Tracking Information
                TrackingNumber = order.TrackingNumber,
                CourierService = order.CourierService,
                EstimatedDeliveryDate = order.EstimatedDeliveryDate,

                // Customer Information (authenticated user or guest)
                Customer = order.User != null ? new CustomerInfoDto
                {
                    Id = order.User.Id,
                    Email = order.User.Email,
                    FirstName = order.User.FirstName,
                    LastName = order.User.LastName,
                    Phone = order.User.Phone
                } : new CustomerInfoDto
                {
                    Id = 0, // Guest customer ID
                    Email = order.GuestEmail ?? "",
                    FirstName = order.GuestFirstName ?? "",
                    LastName = order.GuestLastName ?? "",
                    Phone = order.GuestPhone
                },

                // Order Items
                Items = order.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductSKU = oi.ProductSKU,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    TotalPrice = oi.TotalPrice,
                    ProductAttributes = oi.ProductAttributes
                }).ToList()
            };
        }

        public async Task<AdminOrderActionResponseDto> UpdateOrderAsync(int orderId, UpdateOrderDto updateOrderDto)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                {
                    return new AdminOrderActionResponseDto
                    {
                        Success = false,
                        Message = "Order not found",
                        ErrorCode = "ORDER_NOT_FOUND"
                    };
                }

                // Update notes
                if (!string.IsNullOrEmpty(updateOrderDto.Notes))
                {
                    order.Notes = updateOrderDto.Notes;
                }

                // Update shipping method
                if (!string.IsNullOrEmpty(updateOrderDto.ShippingMethodTitle))
                {
                    order.ShippingMethodTitle = updateOrderDto.ShippingMethodTitle;
                }

                // Update shipping address
                if (updateOrderDto.ShippingAddress != null)
                {
                    order.ShippingName = updateOrderDto.ShippingAddress.ShippingName;
                    order.ShippingAddress = updateOrderDto.ShippingAddress.ShippingAddress;
                    order.ShippingCity = updateOrderDto.ShippingAddress.ShippingCity;
                    order.ShippingState = updateOrderDto.ShippingAddress.ShippingState;
                    order.ShippingZip = updateOrderDto.ShippingAddress.ShippingZip;
                    order.ShippingCountry = updateOrderDto.ShippingAddress.ShippingCountry;
                    order.ShippingPhone = updateOrderDto.ShippingAddress.ShippingPhone;
                }

                order.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var updatedOrder = await GetAdminOrderByIdAsync(orderId);

                return new AdminOrderActionResponseDto
                {
                    Success = true,
                    Message = "Order updated successfully",
                    Order = updatedOrder
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order {OrderId}", orderId);
                return new AdminOrderActionResponseDto
                {
                    Success = false,
                    Message = "An error occurred while updating order",
                    ErrorCode = "INTERNAL_ERROR"
                };
            }
        }



        public async Task<AdminOrderStatsDto> GetOrderStatsAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Orders.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt <= endDate.Value);
            }

            var stats = await query
                .GroupBy(o => 1)
                .Select(g => new AdminOrderStatsDto
                {
                    TotalOrders = g.Count(),
                    PendingOrders = g.Count(o => o.Status == "Pending"),
                    ConfirmedOrders = g.Count(o => o.Status == "Confirmed"),
                    FailedOrders = g.Count(o => o.Status == "Failed"),
                    TotalRevenue = g.Where(o => o.Status == "Confirmed").Sum(o => o.TotalAmount),
                    AverageOrderValue = g.Where(o => o.Status == "Confirmed").Average(o => (decimal?)o.TotalAmount) ?? 0
                })
                .FirstOrDefaultAsync();

            return stats ?? new AdminOrderStatsDto();
        }

        private static AdminOrderDetailDto MapToAdminOrderDetailDto(Order order)
        {
            var baseOrder = MapToOrderResponseDto(order);

            return new AdminOrderDetailDto
            {
                Id = baseOrder.Id,
                OrderNumber = baseOrder.OrderNumber,
                Status = baseOrder.Status,
                PaymentStatus = baseOrder.PaymentStatus,
                SubTotal = baseOrder.SubTotal,
                TaxAmount = baseOrder.TaxAmount,
                ShippingAmount = baseOrder.ShippingAmount,
                DiscountAmount = baseOrder.DiscountAmount,
                TotalAmount = baseOrder.TotalAmount,
                CreatedAt = baseOrder.CreatedAt,
                UpdatedAt = baseOrder.UpdatedAt,
                PaymentTransactionId = baseOrder.PaymentTransactionId,
                Notes = baseOrder.Notes,
                ShippingName = baseOrder.ShippingName,
                ShippingAddress = baseOrder.ShippingAddress,
                ShippingCity = baseOrder.ShippingCity,
                ShippingState = baseOrder.ShippingState,
                ShippingZip = baseOrder.ShippingZip,
                ShippingCountry = baseOrder.ShippingCountry,
                ShippingPhone = baseOrder.ShippingPhone,
                ShippingMethodTitle = baseOrder.ShippingMethodTitle,
                CouponCode = baseOrder.CouponCode,
                CouponDiscountAmount = baseOrder.CouponDiscountAmount,

                // Tracking Information
                TrackingNumber = baseOrder.TrackingNumber,
                CourierService = baseOrder.CourierService,
                EstimatedDeliveryDate = baseOrder.EstimatedDeliveryDate,

                Customer = baseOrder.Customer,
                Items = baseOrder.Items
            };
        }

        private static List<AdminOrderActionDto> GetAvailableActions(Order order)
        {
            var actions = new List<AdminOrderActionDto>();

            switch (order.Status.ToLower())
            {
                case "pending":
                    actions.Add(new AdminOrderActionDto { Action = "confirm", Label = "Confirm Order", IsEnabled = true });
                    actions.Add(new AdminOrderActionDto { Action = "cancel", Label = "Cancel Order", IsEnabled = true });
                    break;
                case "confirmed":
                    actions.Add(new AdminOrderActionDto { Action = "ship", Label = "Mark as Shipped", IsEnabled = true });
                    actions.Add(new AdminOrderActionDto { Action = "cancel", Label = "Cancel Order", IsEnabled = true });
                    break;
                case "shipped":
                    actions.Add(new AdminOrderActionDto { Action = "deliver", Label = "Mark as Delivered", IsEnabled = true });
                    break;
                case "delivered":
                    actions.Add(new AdminOrderActionDto { Action = "refund", Label = "Process Refund", IsEnabled = true });
                    break;
            }

            return actions;
        }

        public async Task<OrderTrackingResponseDto> TrackOrderAsync(TrackOrderRequestDto request)
        {
            try
            {
                // Find order by order number and validate billing email
                var order = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync(o => o.OrderNumber == request.OrderNumber);

                if (order == null)
                {
                    return new OrderTrackingResponseDto
                    {
                        Success = false,
                        Message = "Order not found. Please check your order number.",
                        ErrorCode = "ORDER_NOT_FOUND"
                    };
                }

                // Validate billing email matches (use User.Email for authenticated users, GuestEmail for guest orders)
                var orderEmail = order.User?.Email ?? order.GuestEmail;
                if (string.IsNullOrEmpty(orderEmail) || !string.Equals(orderEmail, request.BillingEmail, StringComparison.OrdinalIgnoreCase))
                {
                    return new OrderTrackingResponseDto
                    {
                        Success = false,
                        Message = "Order not found. Please check your order number and billing email.",
                        ErrorCode = "INVALID_CREDENTIALS"
                    };
                }

                // Create timeline based on order status
                var timeline = CreateOrderTimeline(order);

                // Build tracking response
                var trackingData = new OrderTrackingDataDto
                {
                    OrderNumber = order.OrderNumber,
                    Status = order.Status,
                    OrderDate = order.CreatedAt,
                    EstimatedDelivery = order.EstimatedDeliveryDate ?? CalculateEstimatedDelivery(order),
                    TrackingNumber = order.TrackingNumber,
                    Carrier = order.CourierService,
                    Total = order.TotalAmount,
                    PaymentStatus = order.PaymentStatus,
                    CustomerInfo = new OrderTrackingCustomerDto
                    {
                        Name = order.BillingName ?? (order.User != null ? $"{order.User.FirstName} {order.User.LastName}" : $"{order.GuestFirstName} {order.GuestLastName}"),
                        Email = order.User?.Email ?? order.GuestEmail ?? "",
                        Phone = order.BillingPhone ?? order.ShippingPhone ?? order.GuestPhone
                    },
                    ShippingAddress = new OrderTrackingAddressDto
                    {
                        Street = order.ShippingAddress,
                        City = order.ShippingCity,
                        State = order.ShippingState,
                        ZipCode = order.ShippingZip,
                        Country = order.ShippingCountry
                    },
                    Items = order.OrderItems.Select(oi => new OrderTrackingItemDto
                    {
                        ProductId = oi.ProductId,
                        Name = oi.Product?.Name ?? oi.ProductName,
                        Quantity = oi.Quantity,
                        Price = oi.UnitPrice,
                        Image = oi.Product?.Images?.FirstOrDefault()?.ImageUrl
                    }).ToList(),
                    Timeline = timeline
                };

                return new OrderTrackingResponseDto
                {
                    Success = true,
                    Message = "Order found successfully",
                    Data = trackingData
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking order {OrderNumber}", request.OrderNumber);
                return new OrderTrackingResponseDto
                {
                    Success = false,
                    Message = "An error occurred while tracking your order. Please try again later.",
                    ErrorCode = "INTERNAL_ERROR"
                };
            }
        }

        private List<OrderTrackingTimelineDto> CreateOrderTimeline(Order order)
        {
            var timeline = new List<OrderTrackingTimelineDto>();

            // Order placed
            timeline.Add(new OrderTrackingTimelineDto
            {
                Status = "Order Placed",
                Date = order.CreatedAt,
                Description = "Your order has been received and is being processed.",
                Location = "PrintOscar Warehouse"
            });

            // Add status-specific timeline events
            switch (order.Status.ToLower())
            {
                case "confirmed":
                case "processing":
                    timeline.Add(new OrderTrackingTimelineDto
                    {
                        Status = "Order Confirmed",
                        Date = order.UpdatedAt,
                        Description = "Your order has been confirmed and is being prepared for shipment.",
                        Location = "PrintOscar Warehouse"
                    });
                    break;

                case "shipped":
                    timeline.Add(new OrderTrackingTimelineDto
                    {
                        Status = "Order Confirmed",
                        Date = order.UpdatedAt.AddHours(-24),
                        Description = "Your order has been confirmed and prepared for shipment.",
                        Location = "PrintOscar Warehouse"
                    });
                    timeline.Add(new OrderTrackingTimelineDto
                    {
                        Status = "Shipped",
                        Date = order.UpdatedAt,
                        Description = "Your order has been shipped and is on its way to you.",
                        Location = "In Transit"
                    });
                    break;

                case "delivered":
                    timeline.Add(new OrderTrackingTimelineDto
                    {
                        Status = "Order Confirmed",
                        Date = order.UpdatedAt.AddDays(-3),
                        Description = "Your order has been confirmed and prepared for shipment.",
                        Location = "PrintOscar Warehouse"
                    });
                    timeline.Add(new OrderTrackingTimelineDto
                    {
                        Status = "Shipped",
                        Date = order.UpdatedAt.AddDays(-2),
                        Description = "Your order has been shipped and is on its way to you.",
                        Location = "In Transit"
                    });
                    timeline.Add(new OrderTrackingTimelineDto
                    {
                        Status = "Delivered",
                        Date = order.UpdatedAt,
                        Description = "Your order has been successfully delivered.",
                        Location = $"{order.ShippingCity}, {order.ShippingState}"
                    });
                    break;

                case "cancelled":
                    timeline.Add(new OrderTrackingTimelineDto
                    {
                        Status = "Cancelled",
                        Date = order.UpdatedAt,
                        Description = "Your order has been cancelled.",
                        Location = "PrintOscar"
                    });
                    break;
            }

            return timeline.OrderBy(t => t.Date).ToList();
        }

        private DateTime? CalculateEstimatedDelivery(Order order)
        {
            switch (order.Status.ToLower())
            {
                case "processing":
                case "confirmed":
                    return DateTime.UtcNow.AddDays(7); // 7 days from now
                case "shipped":
                    return DateTime.UtcNow.AddDays(3); // 3 days from now
                case "delivered":
                    return order.UpdatedAt; // Already delivered
                default:
                    return null;
            }
        }


    }
}
