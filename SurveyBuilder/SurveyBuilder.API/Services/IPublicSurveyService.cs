using SurveyBuilder.API.DTOs;

namespace SurveyBuilder.API.Services;

public interface IPublicSurveyService
{
    Task<PublicSurveyResponse?> GetByShareableCodeAsync(string shareableCode);
    Task<(SubmitResponseResponse? Result, string? Error)> SubmitResponseAsync(string shareableCode, SubmitResponseRequest dto);
}
