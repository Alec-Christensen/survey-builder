using SurveyBuilder.API.DTOs;

namespace SurveyBuilder.API.Services;

public interface IOptionService
{
    Task<List<OptionResponse>> GetByQuestionAsync(Guid questionId, Guid surveyId, string userId);
    Task<OptionResponse?> GetByIdAsync(Guid id, Guid questionId, Guid surveyId, string userId);
    Task<OptionResponse?> CreateAsync(Guid questionId, Guid surveyId, CreateOptionRequest dto, string userId);
    Task<OptionResponse?> UpdateAsync(Guid id, Guid questionId, Guid surveyId, UpdateOptionRequest dto, string userId);
    Task<bool> DeleteAsync(Guid id, Guid questionId, Guid surveyId, string userId);
}
