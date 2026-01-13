using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.DTOs
{
    public class OrderStatusHistoryDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string FromStatus { get; set; } = string.Empty;
        public string ToStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? ChangedBy { get; set; }
        public string? ChangeReason { get; set; }
        public bool CustomerNotified { get; set; }
        public string? NotificationMethod { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Metadata { get; set; }
    }

    public class CreateOrderStatusHistoryDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        [StringLength(50)]
        public string FromStatus { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ToStatus { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(100)]
        public string? ChangedBy { get; set; }

        [StringLength(50)]
        public string? ChangeReason { get; set; } = "AdminUpdate";

        public bool CustomerNotified { get; set; } = false;

        [StringLength(255)]
        public string? NotificationMethod { get; set; }

        [StringLength(1000)]
        public string? Metadata { get; set; }
    }

    public class OrderStatusTimelineDto
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public List<OrderStatusHistoryDto> StatusHistory { get; set; } = new List<OrderStatusHistoryDto>();
        public List<StatusMilestoneDto> Milestones { get; set; } = new List<StatusMilestoneDto>();
    }

    public class StatusMilestoneDto
    {
        public string Status { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public bool IsCurrent { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? CompletedBy { get; set; }
        public string? Notes { get; set; }
    }

    public class OrderStatusUpdateDto
    {
        [Required]
        [StringLength(50)]
        public string NewStatus { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(50)]
        public string? ChangeReason { get; set; } = "AdminUpdate";

        public bool NotifyCustomer { get; set; } = true;

        [StringLength(255)]
        public string? NotificationMethod { get; set; } = "Email";

        [StringLength(100)]
        public string? ChangedBy { get; set; }
    }
}
