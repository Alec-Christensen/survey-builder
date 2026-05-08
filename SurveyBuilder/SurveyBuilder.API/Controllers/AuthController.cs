using Microsoft.AspNetCore.Mvc;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Services;

namespace SurveyBuilder.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest dto)
    {
        try
        {
            var response = await _authService.RegisterAsync(dto);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { errors = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest dto)
    {
        var response = await _authService.LoginAsync(dto);
        if (response is null) return Unauthorized();
        return Ok(response);
    }
}
