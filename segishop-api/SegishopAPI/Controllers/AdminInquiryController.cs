using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using SegishopAPI.Models;
using System.Text;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminInquiryController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminInquiryController> _logger;

        public AdminInquiryController(SegishopDbContext context, ILogger<AdminInquiryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all handmade inquiries with filtering and pagination
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<HandmadeInquiriesResponse>> GetHandmadeInquiries(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] string? itemType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] bool? isResponded = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.HandmadeInquiries.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(h => 
                        h.Name.Contains(search) || 
                        h.Email.Contains(search) || 
                        h.ItemType.Contains(search) || 
                        h.DetailedPreferences.Contains(search));
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(h => h.Status == status);
                }

                if (!string.IsNullOrEmpty(itemType))
                {
                    query = query.Where(h => h.ItemType.Contains(itemType));
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(h => h.CreatedAt >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(h => h.CreatedAt <= toDate.Value.AddDays(1));
                }

                if (isResponded.HasValue)
                {
                    query = query.Where(h => h.IsResponded == isResponded.Value);
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var inquiries = await query
                    .OrderByDescending(h => h.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new HandmadeInquiriesResponse
                {
                    Inquiries = inquiries,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving handmade inquiries");
                return StatusCode(500, new { message = "An error occurred while retrieving handmade inquiries" });
            }
        }

        /// <summary>
        /// Get handmade inquiry statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<HandmadeInquiryStatistics>> GetHandmadeInquiryStatistics()
        {
            try
            {
                var total = await _context.HandmadeInquiries.CountAsync();
                var responded = await _context.HandmadeInquiries.CountAsync(h => h.IsResponded);
                var pending = total - responded;
                var thisMonth = await _context.HandmadeInquiries
                    .CountAsync(h => h.CreatedAt >= DateTime.UtcNow.AddDays(-30));

                var statusCounts = await _context.HandmadeInquiries
                    .GroupBy(h => h.Status)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync();

                var itemTypeCounts = await _context.HandmadeInquiries
                    .GroupBy(h => h.ItemType)
                    .Select(g => new { ItemType = g.Key, Count = g.Count() })
                    .OrderByDescending(x => x.Count)
                    .Take(10)
                    .ToListAsync();

                var totalQuotedValue = await _context.HandmadeInquiries
                    .Where(h => h.QuotedPrice.HasValue)
                    .SumAsync(h => h.QuotedPrice ?? 0);

                return Ok(new HandmadeInquiryStatistics
                {
                    TotalInquiries = total,
                    RespondedInquiries = responded,
                    PendingInquiries = pending,
                    InquiriesThisMonth = thisMonth,
                    StatusBreakdown = statusCounts.ToDictionary(x => x.Status, x => x.Count),
                    PopularItemTypes = itemTypeCounts.ToDictionary(x => x.ItemType, x => x.Count),
                    TotalQuotedValue = totalQuotedValue
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving handmade inquiry statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving statistics" });
            }
        }

        /// <summary>
        /// Get a specific handmade inquiry by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<HandmadeInquiry>> GetHandmadeInquiry(int id)
        {
            try
            {
                var inquiry = await _context.HandmadeInquiries.FindAsync(id);
                if (inquiry == null)
                {
                    return NotFound(new { message = "Handmade inquiry not found" });
                }

                return Ok(inquiry);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving handmade inquiry {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the handmade inquiry" });
            }
        }

        /// <summary>
        /// Update handmade inquiry status, pricing, and admin notes
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<HandmadeInquiry>> UpdateHandmadeInquiry(int id, [FromBody] UpdateHandmadeInquiryDto updateDto)
        {
            try
            {
                var inquiry = await _context.HandmadeInquiries.FindAsync(id);
                if (inquiry == null)
                {
                    return NotFound(new { message = "Handmade inquiry not found" });
                }

                // Update fields
                if (!string.IsNullOrEmpty(updateDto.Status))
                {
                    inquiry.Status = updateDto.Status;
                }

                if (updateDto.IsResponded.HasValue)
                {
                    inquiry.IsResponded = updateDto.IsResponded.Value;
                    if (updateDto.IsResponded.Value && !inquiry.RespondedAt.HasValue)
                    {
                        inquiry.RespondedAt = DateTime.UtcNow;
                        inquiry.RespondedBy = updateDto.RespondedBy ?? "Admin";
                    }
                }

                if (updateDto.QuotedPrice.HasValue)
                {
                    inquiry.QuotedPrice = updateDto.QuotedPrice.Value;
                }

                if (updateDto.EstimatedCompletionDate.HasValue)
                {
                    inquiry.EstimatedCompletionDate = updateDto.EstimatedCompletionDate.Value;
                }

                if (!string.IsNullOrEmpty(updateDto.AdminNotes))
                {
                    inquiry.AdminNotes = updateDto.AdminNotes;
                }

                inquiry.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Handmade inquiry {Id} updated by admin", id);

                return Ok(inquiry);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating handmade inquiry {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the handmade inquiry" });
            }
        }

        /// <summary>
        /// Delete a handmade inquiry
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteHandmadeInquiry(int id)
        {
            try
            {
                var inquiry = await _context.HandmadeInquiries.FindAsync(id);
                if (inquiry == null)
                {
                    return NotFound(new { message = "Handmade inquiry not found" });
                }

                _context.HandmadeInquiries.Remove(inquiry);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Handmade inquiry {Id} deleted by admin", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting handmade inquiry {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the handmade inquiry" });
            }
        }

        /// <summary>
        /// Export handmade inquiries to CSV
        /// </summary>
        [HttpGet("export")]
        public async Task<ActionResult> ExportHandmadeInquiries(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] string? itemType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] bool? isResponded = null)
        {
            try
            {
                var query = _context.HandmadeInquiries.AsQueryable();

                // Apply same filters as the main endpoint
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(h =>
                        h.Name.Contains(search) ||
                        h.Email.Contains(search) ||
                        h.ItemType.Contains(search) ||
                        h.DetailedPreferences.Contains(search));
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(h => h.Status == status);
                }

                if (!string.IsNullOrEmpty(itemType))
                {
                    query = query.Where(h => h.ItemType.Contains(itemType));
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(h => h.CreatedAt >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(h => h.CreatedAt <= toDate.Value.AddDays(1));
                }

                if (isResponded.HasValue)
                {
                    query = query.Where(h => h.IsResponded == isResponded.Value);
                }

                var inquiries = await query
                    .OrderByDescending(h => h.CreatedAt)
                    .ToListAsync();

                var csv = new StringBuilder();
                csv.AppendLine("ID,Name,Email,Phone,CountryCode,PreferredContact,ItemType,NeedByDate,ShippingAddress,DressLength,DressColors,TotalDresses,BagStyle,BagSize,BagQuantity,FunKitFill,CustomLabels,DetailedPreferences,ProductLink,ReferralSource,Status,QuotedPrice,EstimatedCompletionDate,IsResponded,RespondedAt,RespondedBy,AdminNotes,CreatedAt,UpdatedAt");

                foreach (var inquiry in inquiries)
                {
                    csv.AppendLine($"{inquiry.Id}," +
                                 $"\"{inquiry.Name}\"," +
                                 $"\"{inquiry.Email}\"," +
                                 $"\"{inquiry.Phone}\"," +
                                 $"\"{inquiry.CountryCode}\"," +
                                 $"\"{inquiry.PreferredContact}\"," +
                                 $"\"{inquiry.ItemType}\"," +
                                 $"\"{inquiry.NeedByDate}\"," +
                                 $"\"{inquiry.ShippingAddress}\"," +
                                 $"\"{inquiry.DressLength}\"," +
                                 $"\"{inquiry.DressColors}\"," +
                                 $"\"{inquiry.TotalDresses}\"," +
                                 $"\"{inquiry.BagStyle}\"," +
                                 $"\"{inquiry.BagSize}\"," +
                                 $"\"{inquiry.BagQuantity}\"," +
                                 $"{inquiry.FunKitFill}," +
                                 $"{inquiry.CustomLabels}," +
                                 $"\"{inquiry.DetailedPreferences.Replace("\"", "\"\"")}\"," +
                                 $"\"{inquiry.ProductLink}\"," +
                                 $"\"{inquiry.ReferralSource}\"," +
                                 $"\"{inquiry.Status}\"," +
                                 $"{inquiry.QuotedPrice}," +
                                 $"{inquiry.EstimatedCompletionDate?.ToString("yyyy-MM-dd")}," +
                                 $"{inquiry.IsResponded}," +
                                 $"{inquiry.RespondedAt?.ToString("yyyy-MM-dd HH:mm:ss")}," +
                                 $"\"{inquiry.RespondedBy}\"," +
                                 $"\"{inquiry.AdminNotes?.Replace("\"", "\"\"")}\"," +
                                 $"{inquiry.CreatedAt:yyyy-MM-dd HH:mm:ss}," +
                                 $"{inquiry.UpdatedAt:yyyy-MM-dd HH:mm:ss}");
                }

                var fileName = $"handmade-inquiries-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
                return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting handmade inquiries");
                return StatusCode(500, new { message = "An error occurred while exporting handmade inquiries" });
            }
        }
    }

    // DTOs for the admin inquiry controller
    public class HandmadeInquiriesResponse
    {
        public List<HandmadeInquiry> Inquiries { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class HandmadeInquiryStatistics
    {
        public int TotalInquiries { get; set; }
        public int RespondedInquiries { get; set; }
        public int PendingInquiries { get; set; }
        public int InquiriesThisMonth { get; set; }
        public Dictionary<string, int> StatusBreakdown { get; set; } = new();
        public Dictionary<string, int> PopularItemTypes { get; set; } = new();
        public decimal TotalQuotedValue { get; set; }
    }

    public class UpdateHandmadeInquiryDto
    {
        public string? Status { get; set; }
        public bool? IsResponded { get; set; }
        public decimal? QuotedPrice { get; set; }
        public DateTime? EstimatedCompletionDate { get; set; }
        public string? AdminNotes { get; set; }
        public string? RespondedBy { get; set; }
    }
}
