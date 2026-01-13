using System.ComponentModel.DataAnnotations;
using SegishopAPI.DTOs;

namespace SegishopAPI.Attributes
{
    public class ValidateGuestOrUserAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not CreateOrderDto dto)
            {
                return false;
            }

            // Either UserId must be provided (authenticated user)
            // OR all guest customer fields must be provided (guest checkout)
            bool hasUserId = dto.UserId.HasValue && dto.UserId.Value > 0;
            bool hasGuestInfo = !string.IsNullOrWhiteSpace(dto.GuestEmail) &&
                               !string.IsNullOrWhiteSpace(dto.GuestFirstName) &&
                               !string.IsNullOrWhiteSpace(dto.GuestLastName);

            return hasUserId || hasGuestInfo;
        }

        public override string FormatErrorMessage(string name)
        {
            return "Either UserId must be provided for authenticated users, or GuestEmail, GuestFirstName, and GuestLastName must be provided for guest checkout.";
        }
    }
}
