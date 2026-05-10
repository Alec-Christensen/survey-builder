using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.DTOs;

public class QuestionResultResponse
{
    public Guid QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public int Order { get; set; }
    public int AnswerCount { get; set; }
    public List<string> TextAnswers { get; set; } = [];
    public List<OptionResultResponse> OptionResults { get; set; } = [];
}
