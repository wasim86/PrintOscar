using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<CustomerUploadController> _logger;

        public CustomerUploadController(IWebHostEnvironment environment, ILogger<CustomerUploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { success = false, message = "No file uploaded" });
                }

                // 10MB limit
                if (file.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { success = false, message = "File size exceeds 10MB limit" });
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".pdf", ".txt", ".doc", ".docx" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { success = false, message = "Invalid file type. Allowed: Images, PDF, TXT, DOC" });
                }

                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "customer");
                Directory.CreateDirectory(uploadsPath);

                var fileName = $"{Guid.NewGuid():N}{extension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativeUrl = $"/uploads/customer/{fileName}";
                var fullUrl = $"{Request.Scheme}://{Request.Host}{relativeUrl}";

                return Ok(new
                {
                    success = true,
                    url = fullUrl,
                    fileName = file.FileName,
                    storedFileName = fileName
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading customer file");
                return StatusCode(500, new { success = false, message = "Internal server error during upload" });
            }
        }
    }
}
