using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.DTOs;

public class PublicQuestionResponse
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public int Order { get; set; }
    public bool IsRequired { get; set; }
    public List<OptionResponse> Options { get; set; } = [];
}
