namespace SurveyBuilder.API.DTOs;

public class SubmitAnswerRequest
{
    public Guid QuestionId { get; set; }
    public string? TextValue { get; set; }
    public List<Guid> SelectedOptionIds { get; set; } = [];
}
