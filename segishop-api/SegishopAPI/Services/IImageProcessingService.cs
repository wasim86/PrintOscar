using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;

namespace SegishopAPI.Services
{
    public interface IImageProcessingService
    {
        Task<(string FileName, string ImageUrl, long FileSize)> ProcessAndSaveAsync(IFormFile file, HttpRequest request);
        Task<bool> ProcessFileAsync(string inputPath, string outputPath);
    }
}
