using ImageMagick;
using Microsoft.AspNetCore.Http;

namespace SegishopAPI.Services
{
    public class ImageProcessingService : IImageProcessingService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ImageProcessingService> _logger;

        public ImageProcessingService(IWebHostEnvironment environment, IConfiguration configuration, ILogger<ImageProcessingService> logger)
        {
            _environment = environment;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<(string FileName, string ImageUrl, long FileSize)> ProcessAndSaveAsync(IFormFile file, HttpRequest request)
        {
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "bannerImages");
            Directory.CreateDirectory(uploadsPath);

            var maxWidth = _configuration.GetValue<int?>("ImageSettings:MaxWidth") ?? 2000;
            var maxHeight = _configuration.GetValue<int?>("ImageSettings:MaxHeight") ?? 2000;
            var quality = _configuration.GetValue<int?>("ImageSettings:WebPQuality") ?? 85;
            var useLosslessForPng = _configuration.GetValue<bool?>("ImageSettings:UseLosslessForPng") ?? true;
            var keepOriginal = _configuration.GetValue<bool?>("ImageSettings:KeepOriginal") ?? false;

            using var input = new MemoryStream();
            await file.CopyToAsync(input);
            input.Position = 0;

            using var image = new MagickImage(input);

            try
            {
                image.AutoOrient();

                if (image.Width > maxWidth || image.Height > maxHeight)
                {
                    var geometry = new MagickGeometry(maxWidth, maxHeight) { IgnoreAspectRatio = false, FillArea = false };
                    image.Resize(geometry);
                }

                var icc = image.GetColorProfile();
                image.Strip();
                if (icc != null) image.SetProfile(icc);

                image.Quality = quality;

                var isPng = Path.GetExtension(file.FileName).Equals(".png", StringComparison.OrdinalIgnoreCase);

                var fileName = $"{Guid.NewGuid()}.webp";
                var filePath = Path.Combine(uploadsPath, fileName);

                image.Settings.Format = MagickFormat.WebP;
                image.Settings.SetDefine(MagickFormat.WebP, "webp:method", "6");
                if (isPng && useLosslessForPng)
                {
                    image.Settings.SetDefine(MagickFormat.WebP, "webp:lossless", "true");
                }

                image.Write(filePath, MagickFormat.WebP);

                if (keepOriginal)
                {
                    try
                    {
                        var originalsPath = Path.Combine(uploadsPath, "originals");
                        Directory.CreateDirectory(originalsPath);
                        var originalName = $"{Path.GetFileNameWithoutExtension(fileName)}{Path.GetExtension(file.FileName).ToLowerInvariant()}";
                        var originalPath = Path.Combine(originalsPath, originalName);
                        input.Position = 0;
                        using var outStream = new FileStream(originalPath, FileMode.Create);
                        await input.CopyToAsync(outStream);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to save original image backup");
                    }
                }

                var configuredBaseUrl = _configuration["ImageSettings:BaseUrl"];
                var envName = _environment.EnvironmentName ?? string.Empty;
                var useConfigured = !string.IsNullOrEmpty(configuredBaseUrl) && string.Equals(envName, "Production", StringComparison.OrdinalIgnoreCase);
                var baseUrl = useConfigured ? configuredBaseUrl : $"{request.Scheme}://{request.Host}";
                var imageUrl = $"{baseUrl}/uploads/bannerImages/{fileName}";

                var info = new FileInfo(filePath);
                return (fileName, imageUrl, info.Length);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing image");
                throw;
            }
        }

        public async Task<bool> ProcessFileAsync(string inputPath, string outputPath)
        {
            var maxWidth = _configuration.GetValue<int?>("ImageSettings:MaxWidth") ?? 2000;
            var maxHeight = _configuration.GetValue<int?>("ImageSettings:MaxHeight") ?? 2000;
            var quality = _configuration.GetValue<int?>("ImageSettings:WebPQuality") ?? 85;
            var useLosslessForPng = _configuration.GetValue<bool?>("ImageSettings:UseLosslessForPng") ?? true;

            try
            {
                using var image = new MagickImage(inputPath);
                
                image.AutoOrient();

                if (image.Width > maxWidth || image.Height > maxHeight)
                {
                    var geometry = new MagickGeometry(maxWidth, maxHeight) { IgnoreAspectRatio = false, FillArea = false };
                    image.Resize(geometry);
                }

                var icc = image.GetColorProfile();
                image.Strip();
                if (icc != null) image.SetProfile(icc);

                image.Quality = quality;

                var isPng = Path.GetExtension(inputPath).Equals(".png", StringComparison.OrdinalIgnoreCase);

                image.Settings.Format = MagickFormat.WebP;
                image.Settings.SetDefine(MagickFormat.WebP, "webp:method", "6");
                if (isPng && useLosslessForPng)
                {
                    image.Settings.SetDefine(MagickFormat.WebP, "webp:lossless", "true");
                }

                await image.WriteAsync(outputPath);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing file: {InputPath}", inputPath);
                return false;
            }
        }
    }
}
