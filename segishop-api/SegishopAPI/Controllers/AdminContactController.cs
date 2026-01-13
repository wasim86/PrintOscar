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
    public class AdminContactController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly ILogger<AdminContactController> _logger;

        public AdminContactController(SegishopDbContext context, ILogger<AdminContactController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all contact submissions with filtering and pagination
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ContactSubmissionsResponse>> GetContactSubmissions(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] bool? isResponded = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.ContactSubmissions.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(c => 
                        c.Name.Contains(search) || 
                        c.Email.Contains(search) || 
                        c.Subject.Contains(search) || 
                        c.Message.Contains(search));
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(c => c.Status == status);
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(c => c.CreatedAt >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(c => c.CreatedAt <= toDate.Value.AddDays(1));
                }

                if (isResponded.HasValue)
                {
                    query = query.Where(c => c.IsResponded == isResponded.Value);
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var submissions = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new ContactSubmissionsResponse
                {
                    Submissions = submissions,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving contact submissions");
                return StatusCode(500, new { message = "An error occurred while retrieving contact submissions" });
            }
        }

        /// <summary>
        /// Get contact submission statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<ContactStatistics>> GetContactStatistics()
        {
            try
            {
                var total = await _context.ContactSubmissions.CountAsync();
                var responded = await _context.ContactSubmissions.CountAsync(c => c.IsResponded);
                var pending = total - responded;
                var thisMonth = await _context.ContactSubmissions
                    .CountAsync(c => c.CreatedAt >= DateTime.UtcNow.AddDays(-30));

                var statusCounts = await _context.ContactSubmissions
                    .GroupBy(c => c.Status)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync();

                return Ok(new ContactStatistics
                {
                    TotalSubmissions = total,
                    RespondedSubmissions = responded,
                    PendingSubmissions = pending,
                    SubmissionsThisMonth = thisMonth,
                    StatusBreakdown = statusCounts.ToDictionary(x => x.Status, x => x.Count)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving contact statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving statistics" });
            }
        }

        /// <summary>
        /// Get a specific contact submission by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactSubmission>> GetContactSubmission(int id)
        {
            try
            {
                var submission = await _context.ContactSubmissions.FindAsync(id);
                if (submission == null)
                {
                    return NotFound(new { message = "Contact submission not found" });
                }

                return Ok(submission);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving contact submission {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the contact submission" });
            }
        }

        /// <summary>
        /// Update contact submission status and admin notes
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ContactSubmission>> UpdateContactSubmission(int id, [FromBody] UpdateContactSubmissionDto updateDto)
        {
            try
            {
                var submission = await _context.ContactSubmissions.FindAsync(id);
                if (submission == null)
                {
                    return NotFound(new { message = "Contact submission not found" });
                }

                // Update fields
                if (!string.IsNullOrEmpty(updateDto.Status))
                {
                    submission.Status = updateDto.Status;
                }

                if (updateDto.IsResponded.HasValue)
                {
                    submission.IsResponded = updateDto.IsResponded.Value;
                    if (updateDto.IsResponded.Value && !submission.RespondedAt.HasValue)
                    {
                        submission.RespondedAt = DateTime.UtcNow;
                        submission.RespondedBy = updateDto.RespondedBy ?? "Admin";
                    }
                }

                if (!string.IsNullOrEmpty(updateDto.AdminNotes))
                {
                    submission.AdminNotes = updateDto.AdminNotes;
                }

                submission.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Contact submission {Id} updated by admin", id);

                return Ok(submission);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating contact submission {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the contact submission" });
            }
        }

        /// <summary>
        /// Delete a contact submission
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContactSubmission(int id)
        {
            try
            {
                var submission = await _context.ContactSubmissions.FindAsync(id);
                if (submission == null)
                {
                    return NotFound(new { message = "Contact submission not found" });
                }

                _context.ContactSubmissions.Remove(submission);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Contact submission {Id} deleted by admin", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting contact submission {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the contact submission" });
            }
        }

        /// <summary>
        /// Export contact submissions to CSV
        /// </summary>
        [HttpGet("export")]
        public async Task<ActionResult> ExportContactSubmissions(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] bool? isResponded = null)
        {
            try
            {
                var query = _context.ContactSubmissions.AsQueryable();

                // Apply same filters as the main endpoint
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(c =>
                        c.Name.Contains(search) ||
                        c.Email.Contains(search) ||
                        c.Subject.Contains(search) ||
                        c.Message.Contains(search));
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(c => c.Status == status);
                }

                if (fromDate.HasValue)
                {
                    query = query.Where(c => c.CreatedAt >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(c => c.CreatedAt <= toDate.Value.AddDays(1));
                }

                if (isResponded.HasValue)
                {
                    query = query.Where(c => c.IsResponded == isResponded.Value);
                }

                var submissions = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                var csv = new StringBuilder();
                csv.AppendLine("ID,Name,Email,Subject,Message,HearAbout,Status,IsResponded,RespondedAt,RespondedBy,AdminNotes,CreatedAt,UpdatedAt");

                foreach (var submission in submissions)
                {
                    csv.AppendLine($"{submission.Id}," +
                                 $"\"{submission.Name}\"," +
                                 $"\"{submission.Email}\"," +
                                 $"\"{submission.Subject}\"," +
                                 $"\"{submission.Message.Replace("\"", "\"\"")}\"," +
                                 $"\"{submission.HearAbout}\"," +
                                 $"\"{submission.Status}\"," +
                                 $"{submission.IsResponded}," +
                                 $"{submission.RespondedAt?.ToString("yyyy-MM-dd HH:mm:ss")}," +
                                 $"\"{submission.RespondedBy}\"," +
                                 $"\"{submission.AdminNotes?.Replace("\"", "\"\"")}\"," +
                                 $"{submission.CreatedAt:yyyy-MM-dd HH:mm:ss}," +
                                 $"{submission.UpdatedAt:yyyy-MM-dd HH:mm:ss}");
                }

                var fileName = $"contact-submissions-{DateTime.UtcNow:yyyyMMdd-HHmmss}.csv";
                return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting contact submissions");
                return StatusCode(500, new { message = "An error occurred while exporting contact submissions" });
            }
        }
    }

    // DTOs for the admin contact controller
    public class ContactSubmissionsResponse
    {
        public List<ContactSubmission> Submissions { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class ContactStatistics
    {
        public int TotalSubmissions { get; set; }
        public int RespondedSubmissions { get; set; }
        public int PendingSubmissions { get; set; }
        public int SubmissionsThisMonth { get; set; }
        public Dictionary<string, int> StatusBreakdown { get; set; } = new();
    }

    public class UpdateContactSubmissionDto
    {
        public string? Status { get; set; }
        public bool? IsResponded { get; set; }
        public string? AdminNotes { get; set; }
        public string? RespondedBy { get; set; }
    }
}
