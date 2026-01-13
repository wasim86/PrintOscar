using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using SegishopAPI.DTOs;
using System.Text.Json;

namespace SegishopAPI.Services
{
    public interface ICustomerPaymentMethodService
    {
        Task<List<CustomerPaymentMethodDto>> GetCustomerPaymentMethodsAsync(int customerId);
        Task<CustomerPaymentMethodDto?> GetPaymentMethodByIdAsync(int id, int customerId);
        Task<CustomerPaymentMethodDto> CreatePaymentMethodAsync(int customerId, CreateCustomerPaymentMethodDto createDto);
        Task<CustomerPaymentMethodDto?> UpdatePaymentMethodAsync(int id, int customerId, UpdateCustomerPaymentMethodDto updateDto);
        Task<bool> DeletePaymentMethodAsync(int id, int customerId);
        Task<bool> SetDefaultPaymentMethodAsync(int customerId, int paymentMethodId);
    }

    public class CustomerPaymentMethodService : ICustomerPaymentMethodService
    {
        private readonly SegishopDbContext _context;

        public CustomerPaymentMethodService(SegishopDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerPaymentMethodDto>> GetCustomerPaymentMethodsAsync(int customerId)
        {
            var paymentMethods = await _context.CustomerPaymentMethods
                .Where(pm => pm.CustomerId == customerId && pm.IsActive)
                .OrderByDescending(pm => pm.IsDefault)
                .ThenByDescending(pm => pm.CreatedAt)
                .ToListAsync();

            return paymentMethods.Select(MapToDto).ToList();
        }

        public async Task<CustomerPaymentMethodDto?> GetPaymentMethodByIdAsync(int id, int customerId)
        {
            var paymentMethod = await _context.CustomerPaymentMethods
                .FirstOrDefaultAsync(pm => pm.Id == id && pm.CustomerId == customerId && pm.IsActive);

            return paymentMethod != null ? MapToDto(paymentMethod) : null;
        }

        public async Task<CustomerPaymentMethodDto> CreatePaymentMethodAsync(int customerId, CreateCustomerPaymentMethodDto createDto)
        {
            // Validate business rules
            await ValidatePaymentMethodAsync(createDto);

            // If this is set as default, unset other defaults
            if (createDto.IsDefault)
            {
                await UnsetAllDefaultsAsync(customerId);
            }

            var paymentMethod = new CustomerPaymentMethod
            {
                CustomerId = customerId,
                Type = createDto.Type,
                DisplayName = createDto.DisplayName,
                Last4Digits = createDto.Last4Digits,
                CardBrand = createDto.CardBrand,
                ExpiryMonth = createDto.ExpiryMonth,
                ExpiryYear = createDto.ExpiryYear,
                CardholderName = createDto.CardholderName,
                ZipCode = createDto.ZipCode,
                StripePaymentMethodId = createDto.StripePaymentMethodId,
                PayPalPaymentMethodId = createDto.PayPalPaymentMethodId,
                IsDefault = createDto.IsDefault,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CustomerPaymentMethods.Add(paymentMethod);
            await _context.SaveChangesAsync();

            return MapToDto(paymentMethod);
        }

        public async Task<CustomerPaymentMethodDto?> UpdatePaymentMethodAsync(int id, int customerId, UpdateCustomerPaymentMethodDto updateDto)
        {
            var paymentMethod = await _context.CustomerPaymentMethods
                .FirstOrDefaultAsync(pm => pm.Id == id && pm.CustomerId == customerId && pm.IsActive);

            if (paymentMethod == null)
                return null;

            // If setting as default, unset other defaults
            if (updateDto.IsDefault == true)
            {
                await UnsetAllDefaultsAsync(customerId);
            }

            // Update fields
            if (!string.IsNullOrEmpty(updateDto.DisplayName))
                paymentMethod.DisplayName = updateDto.DisplayName;

            if (updateDto.IsDefault.HasValue)
                paymentMethod.IsDefault = updateDto.IsDefault.Value;

            if (updateDto.IsActive.HasValue)
                paymentMethod.IsActive = updateDto.IsActive.Value;

            paymentMethod.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(paymentMethod);
        }

        public async Task<bool> DeletePaymentMethodAsync(int id, int customerId)
        {
            var paymentMethod = await _context.CustomerPaymentMethods
                .FirstOrDefaultAsync(pm => pm.Id == id && pm.CustomerId == customerId);

            if (paymentMethod == null)
                return false;

            // Soft delete
            paymentMethod.IsActive = false;
            paymentMethod.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetDefaultPaymentMethodAsync(int customerId, int paymentMethodId)
        {
            var paymentMethod = await _context.CustomerPaymentMethods
                .FirstOrDefaultAsync(pm => pm.Id == paymentMethodId && pm.CustomerId == customerId && pm.IsActive);

            if (paymentMethod == null)
                return false;

            // Unset all defaults first
            await UnsetAllDefaultsAsync(customerId);

            // Set the new default
            paymentMethod.IsDefault = true;
            paymentMethod.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        private async Task UnsetAllDefaultsAsync(int customerId)
        {
            var defaultMethods = await _context.CustomerPaymentMethods
                .Where(pm => pm.CustomerId == customerId && pm.IsDefault && pm.IsActive)
                .ToListAsync();

            foreach (var method in defaultMethods)
            {
                method.IsDefault = false;
                method.UpdatedAt = DateTime.UtcNow;
            }
        }

        private async Task ValidatePaymentMethodAsync(CreateCustomerPaymentMethodDto createDto)
        {
            var errors = new List<string>();

            // Validate card-specific fields
            if (createDto.Type == "card")
            {
                if (string.IsNullOrEmpty(createDto.Last4Digits))
                    errors.Add("Last 4 digits are required for card payments");

                if (string.IsNullOrEmpty(createDto.CardBrand))
                    errors.Add("Card brand is required for card payments");

                if (string.IsNullOrEmpty(createDto.ExpiryMonth) || string.IsNullOrEmpty(createDto.ExpiryYear))
                    errors.Add("Expiry month and year are required for card payments");

                // Validate expiry date is not in the past
                if (!string.IsNullOrEmpty(createDto.ExpiryMonth) && !string.IsNullOrEmpty(createDto.ExpiryYear))
                {
                    if (int.TryParse(createDto.ExpiryMonth, out int month) && int.TryParse(createDto.ExpiryYear, out int year))
                    {
                        var expiryDate = new DateTime(year, month, DateTime.DaysInMonth(year, month));
                        if (expiryDate < DateTime.Now.Date)
                        {
                            errors.Add("Card expiry date cannot be in the past");
                        }
                    }
                }
            }

            // Validate PayPal-specific fields
            if (createDto.Type == "paypal")
            {
                if (string.IsNullOrEmpty(createDto.PayPalPaymentMethodId))
                    errors.Add("PayPal payment method ID is required for PayPal payments");
            }

            // Validate Stripe-specific fields
            if (createDto.Type == "card" && !string.IsNullOrEmpty(createDto.StripePaymentMethodId))
            {
                // Additional Stripe validation could go here
            }

            if (errors.Any())
            {
                throw new ArgumentException(string.Join("; ", errors));
            }
        }

        private static CustomerPaymentMethodDto MapToDto(CustomerPaymentMethod paymentMethod)
        {
            return new CustomerPaymentMethodDto
            {
                Id = paymentMethod.Id,
                CustomerId = paymentMethod.CustomerId,
                Type = paymentMethod.Type,
                DisplayName = paymentMethod.DisplayName,
                Last4Digits = paymentMethod.Last4Digits,
                CardBrand = paymentMethod.CardBrand,
                ExpiryMonth = paymentMethod.ExpiryMonth,
                ExpiryYear = paymentMethod.ExpiryYear,
                CardholderName = paymentMethod.CardholderName,
                ZipCode = paymentMethod.ZipCode,
                IsDefault = paymentMethod.IsDefault,
                IsActive = paymentMethod.IsActive,
                CreatedAt = paymentMethod.CreatedAt,
                UpdatedAt = paymentMethod.UpdatedAt
            };
        }
    }
}
