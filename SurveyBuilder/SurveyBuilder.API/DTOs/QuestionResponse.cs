using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.DTOs;

public class QuestionResponse
{
    public Guid Id { get; set; }
    public Guid SurveyId { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public int Order { get; set; }
    public bool IsRequired { get; set; }
}
