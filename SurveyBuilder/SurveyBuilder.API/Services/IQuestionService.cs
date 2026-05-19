using SurveyBuilder.API.DTOs;

namespace SurveyBuilder.API.Services;

public interface IQuestionService
{
    Task<List<QuestionResponse>> GetBySurveyAsync(Guid surveyId, string userId);
    Task<QuestionResponse?> GetByIdAsync(Guid id, Guid surveyId, string userId);
    Task<QuestionResponse?> CreateAsync(Guid surveyId, CreateQuestionRequest dto, string userId);
    Task<QuestionResponse?> UpdateAsync(Guid id, Guid surveyId, UpdateQuestionRequest dto, string userId);
    Task<(bool success, string? error)> DeleteAsync(Guid id, Guid surveyId, string userId);
}
