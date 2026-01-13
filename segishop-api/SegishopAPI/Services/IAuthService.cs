using SegishopAPI.DTOs;

namespace SegishopAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request);
        Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request);
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<AuthResponseDto> UpdateProfileAsync(int userId, UpdateProfileRequestDto request);
        Task<AuthResponseDto> ChangePasswordAsync(int userId, ChangePasswordRequestDto request);
        Task<AuthResponseDto> DeleteAccountAsync(int userId);
        string GenerateJwtToken(int userId, string email, string role);
        string GenerateStrongPassword();
    }
}
