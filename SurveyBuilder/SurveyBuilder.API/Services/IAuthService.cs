using SurveyBuilder.API.DTOs;

namespace SurveyBuilder.API.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest dto);
    Task<AuthResponse?> LoginAsync(LoginRequest dto);
}
