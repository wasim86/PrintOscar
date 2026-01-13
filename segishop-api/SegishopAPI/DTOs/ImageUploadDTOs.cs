namespace SegishopAPI.DTOs
{
    public class ImageUploadResponseDto
    {
        public bool Success { get; set; }
        public string? ImageUrl { get; set; }
        public string? FileName { get; set; }
        public string? OriginalFileName { get; set; }
        public long? FileSize { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class MultipleImageUploadResponseDto
    {
        public bool Success { get; set; }
        public List<ImageUploadResult> Results { get; set; } = new List<ImageUploadResult>();
        public int SuccessCount { get; set; }
        public int FailureCount { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class ImageUploadResult
    {
        public string OriginalFileName { get; set; } = string.Empty;
        public string? FileName { get; set; }
        public string? ImageUrl { get; set; }
        public long? FileSize { get; set; }
        public bool Success { get; set; }
        public string? Error { get; set; }
    }

    public class ImageDeleteResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    // Cloud storage DTOs (for future implementation)
    public class CloudImageUploadResponseDto
    {
        public bool Success { get; set; }
        public string? ImageUrl { get; set; }
        public string? CloudFileName { get; set; }
        public string? OriginalFileName { get; set; }
        public long? FileSize { get; set; }
        public string? StorageProvider { get; set; } // "AWS", "Azure", etc.
        public string Message { get; set; } = string.Empty;
    }

    public class CloudStorageConfigDto
    {
        public string Provider { get; set; } = "Local"; // "Local", "AWS", "Azure"
        public string? BucketName { get; set; }
        public string? Region { get; set; }
        public string? AccessKey { get; set; }
        public string? SecretKey { get; set; }
        public string? ConnectionString { get; set; }
    }
}
