using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SegishopAPI.Models
{
    public class Coupon
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public CouponType Type { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Value { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? MinimumOrderAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? MaximumDiscountAmount { get; set; }

        public int? MaxTotalUses { get; set; }

        public int? MaxUsesPerUser { get; set; }

        public int CurrentTotalUses { get; set; } = 0;

        public bool IsFirstOrderOnly { get; set; } = false;

        public bool IsUserSpecific { get; set; } = false;

        [StringLength(2000)]
        public string? AllowedUserEmails { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime? ValidFrom { get; set; }

        public DateTime? ValidUntil { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? CreatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<CouponUsage> CouponUsages { get; set; } = new List<CouponUsage>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

        // Helper methods
        public bool IsValidNow()
        {
            if (!IsActive) return false;
            
            var now = DateTime.UtcNow;
            
            if (ValidFrom.HasValue && now < ValidFrom.Value) return false;
            if (ValidUntil.HasValue && now > ValidUntil.Value) return false;
            
            return true;
        }

        public bool HasReachedUsageLimit()
        {
            return MaxTotalUses.HasValue && CurrentTotalUses >= MaxTotalUses.Value;
        }

        public bool CanUserUseCoupon(int userId, int userOrderCount)
        {
            if (!IsValidNow()) return false;
            if (HasReachedUsageLimit()) return false;

            // Check if user has already used this specific coupon
            var userUsageCount = CouponUsages.Count(cu => cu.UserId == userId);

            // For first-order-only coupons, check if user has used this coupon before
            if (IsFirstOrderOnly && userUsageCount > 0) return false;

            // Check per-user usage limit
            if (MaxUsesPerUser.HasValue && userUsageCount >= MaxUsesPerUser.Value) return false;

            return true;
        }

        public decimal CalculateDiscount(decimal orderSubtotal)
        {
            if (!IsValidNow()) return 0;

            // Check minimum order amount
            if (MinimumOrderAmount.HasValue && orderSubtotal < MinimumOrderAmount.Value)
                return 0;

            decimal discount = 0;

            switch (Type)
            {
                case CouponType.Percentage:
                    discount = orderSubtotal * (Value / 100);
                    break;
                case CouponType.FixedAmount:
                    discount = Value;
                    break;
                case CouponType.FreeShipping:
                    // Free shipping coupons don't provide subtotal discount
                    discount = 0;
                    break;
            }

            // Apply maximum discount limit
            if (MaximumDiscountAmount.HasValue && discount > MaximumDiscountAmount.Value)
                discount = MaximumDiscountAmount.Value;

            // Ensure discount doesn't exceed order subtotal
            if (discount > orderSubtotal)
                discount = orderSubtotal;

            return Math.Round(discount, 2);
        }

        public bool ProvidesFreeShipping(decimal orderSubtotal)
        {
            if (!IsValidNow()) return false;
            if (Type != CouponType.FreeShipping) return false;

            // Check minimum order amount
            if (MinimumOrderAmount.HasValue && orderSubtotal < MinimumOrderAmount.Value)
                return false;

            return true;
        }

        public bool IsUserAllowed(string? userEmail)
        {
            // If not user-specific, allow all users
            if (!IsUserSpecific) return true;

            // If user-specific but no email provided, deny access
            if (string.IsNullOrEmpty(userEmail)) return false;

            // If no allowed emails specified, deny access
            if (string.IsNullOrEmpty(AllowedUserEmails)) return false;

            // Check if user email is in the allowed list
            var allowedEmails = AllowedUserEmails
                .Split(new[] { ',', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(email => email.Trim().ToLowerInvariant())
                .Where(email => !string.IsNullOrEmpty(email))
                .ToList();

            return allowedEmails.Contains(userEmail.Trim().ToLowerInvariant());
        }
    }

    public enum CouponType
    {
        Percentage = 1,
        FixedAmount = 2,
        FreeShipping = 3
    }

    public class CouponUsage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CouponId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal DiscountAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal OrderSubtotal { get; set; }

        public DateTime UsedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CouponId")]
        public virtual Coupon Coupon { get; set; } = null!;

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;
    }
}
