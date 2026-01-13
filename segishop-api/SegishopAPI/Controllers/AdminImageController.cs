using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SegishopAPI.DTOs;
using System.ComponentModel.DataAnnotations;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ImageController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ImageController> _logger;
        private readonly IConfiguration _configuration;
        private readonly SegishopAPI.Services.IImageProcessingService _imageProcessingService;
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private readonly string[] _allowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };

        public ImageController(IWebHostEnvironment environment, ILogger<ImageController> logger, IConfiguration configuration, SegishopAPI.Services.IImageProcessingService imageProcessingService)
        {
            _environment = environment;
            _logger = logger;
            _configuration = configuration;
            _imageProcessingService = imageProcessingService;
        }

        /// <summary>
        /// Upload single image
        /// </summary>
        [HttpPost("upload")]
        public async Task<ActionResult<ImageUploadResponseDto>> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new ImageUploadResponseDto
                    {
                        Success = false,
                        Message = "No file provided"
                    });
                }

                // Validate file size
                if (file.Length > _maxFileSize)
                {
                    return BadRequest(new ImageUploadResponseDto
                    {
                        Success = false,
                        Message = $"File size must be less than {_maxFileSize / (1024 * 1024)}MB"
                    });
                }

                // Validate file type
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(extension))
                {
                    return BadRequest(new ImageUploadResponseDto
                    {
                        Success = false,
                        Message = $"File type {extension} is not supported. Allowed types: {string.Join(", ", _allowedExtensions)}"
                    });
                }

                if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
                {
                    return BadRequest(new ImageUploadResponseDto
                    {
                        Success = false,
                        Message = $"MIME type {file.ContentType} is not supported"
                    });
                }

                var result = await _imageProcessingService.ProcessAndSaveAsync(file, Request);

                _logger.LogInformation("Image uploaded successfully: {FileName} -> {ImageUrl}", file.FileName, result.ImageUrl);

                return Ok(new ImageUploadResponseDto
                {
                    Success = true,
                    ImageUrl = result.ImageUrl,
                    FileName = result.FileName,
                    OriginalFileName = file.FileName,
                    FileSize = result.FileSize,
                    Message = "Image uploaded successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image: {FileName}", file?.FileName);
                return StatusCode(500, new ImageUploadResponseDto
                {
                    Success = false,
                    Message = "Internal server error occurred while uploading image"
                });
            }
        }

        /// <summary>
        /// Upload multiple images
        /// </summary>
        [HttpPost("upload-multiple")]
        public async Task<ActionResult<MultipleImageUploadResponseDto>> UploadMultipleImages(List<IFormFile> files)
        {
            try
            {
                if (files == null || !files.Any())
                {
                    return BadRequest(new MultipleImageUploadResponseDto
                    {
                        Success = false,
                        Message = "No files provided"
                    });
                }

                if (files.Count > 10)
                {
                    return BadRequest(new MultipleImageUploadResponseDto
                    {
                        Success = false,
                        Message = "Maximum 10 files allowed per upload"
                    });
                }

                var results = new List<ImageUploadResult>();

                foreach (var file in files)
                {
                    try
                    {
                        // Validate each file
                        if (file.Length > _maxFileSize)
                        {
                            results.Add(new ImageUploadResult
                            {
                                OriginalFileName = file.FileName,
                                Success = false,
                                Error = $"File size must be less than {_maxFileSize / (1024 * 1024)}MB"
                            });
                            continue;
                        }

                        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                        if (!_allowedExtensions.Contains(extension))
                        {
                            results.Add(new ImageUploadResult
                            {
                                OriginalFileName = file.FileName,
                                Success = false,
                                Error = $"File type {extension} is not supported"
                            });
                            continue;
                        }
                        var processed = await _imageProcessingService.ProcessAndSaveAsync(file, Request);

                        results.Add(new ImageUploadResult
                        {
                            OriginalFileName = file.FileName,
                            FileName = processed.FileName,
                            ImageUrl = processed.ImageUrl,
                            FileSize = processed.FileSize,
                            Success = true
                        });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error uploading file: {FileName}", file.FileName);
                        results.Add(new ImageUploadResult
                        {
                            OriginalFileName = file.FileName,
                            Success = false,
                            Error = "Upload failed"
                        });
                    }
                }

                var successCount = results.Count(r => r.Success);
                var failureCount = results.Count(r => !r.Success);

                return Ok(new MultipleImageUploadResponseDto
                {
                    Success = successCount > 0,
                    Results = results,
                    SuccessCount = successCount,
                    FailureCount = failureCount,
                    Message = $"Uploaded {successCount} of {files.Count} files successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading multiple images");
                return StatusCode(500, new MultipleImageUploadResponseDto
                {
                    Success = false,
                    Message = "Internal server error occurred while uploading images"
                });
            }
        }

        /// <summary>
        /// Reprocess existing images to WebP and update links
        /// </summary>
        [HttpPost("reprocess")]
        public async Task<ActionResult> ReprocessImages([FromQuery] bool dryRun = false)
        {
            try
            {
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
                Directory.CreateDirectory(uploadsPath);

                var files = Directory.GetFiles(uploadsPath)
                    .Where(p => new[] { ".jpg", ".jpeg", ".png" }.Contains(Path.GetExtension(p).ToLowerInvariant()))
                    .ToList();

                var reprocessed = new List<string>();
                foreach (var path in files)
                {
                    var name = Path.GetFileName(path);
                    var webpName = Path.GetFileNameWithoutExtension(path) + ".webp";
                    var webpPath = Path.Combine(uploadsPath, webpName);
                    if (System.IO.File.Exists(webpPath)) continue;

                    if (dryRun)
                    {
                        reprocessed.Add(name);
                        continue;
                    }

                    using var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
                    var formFile = new FormFile(fs, 0, fs.Length, name, name)
                    {
                        Headers = new HeaderDictionary(),
                        ContentType = GetMimeFromExtension(Path.GetExtension(path))
                    };

                    await _imageProcessingService.ProcessAndSaveAsync(formFile, Request);
                    reprocessed.Add(name);
                }

                return Ok(new { success = true, count = reprocessed.Count, dryRun, files = reprocessed });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reprocessing images");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        private static string GetMimeFromExtension(string ext)
        {
            ext = ext.ToLowerInvariant();
            return ext switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }

        /// <summary>
        /// Delete image
        /// </summary>
        [HttpDelete("{fileName}")]
        public ActionResult<ImageDeleteResponseDto> DeleteImage(string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    return BadRequest(new ImageDeleteResponseDto
                    {
                        Success = false,
                        Message = "File name is required"
                    });
                }

                // Validate filename to prevent directory traversal
                if (fileName.Contains("..") || fileName.Contains("/") || fileName.Contains("\\"))
                {
                    return BadRequest(new ImageDeleteResponseDto
                    {
                        Success = false,
                        Message = "Invalid file name"
                    });
                }

                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
                var filePath = Path.Combine(uploadsPath, fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new ImageDeleteResponseDto
                    {
                        Success = false,
                        Message = "File not found"
                    });
                }

                System.IO.File.Delete(filePath);

                _logger.LogInformation("Image deleted successfully: {FileName}", fileName);

                return Ok(new ImageDeleteResponseDto
                {
                    Success = true,
                    Message = "Image deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image: {FileName}", fileName);
                return StatusCode(500, new ImageDeleteResponseDto
                {
                    Success = false,
                    Message = "Internal server error occurred while deleting image"
                });
            }
        }
    }
}
