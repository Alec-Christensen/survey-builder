using SurveyBuilder.API.DTOs;

namespace SurveyBuilder.API.Services;

public interface ISurveyService
{
    Task<List<SurveyResponse>> GetUserSurveysAsync(string userId);
    Task<SurveyResponse?> GetByIdAsync(Guid id, string userId);
    Task<SurveyResponse> CreateAsync(CreateSurveyRequest dto, string userId);
    Task<SurveyResponse?> UpdateAsync(Guid id, UpdateSurveyRequest dto, string userId);
    Task<bool> DeleteAsync(Guid id, string userId);
}
