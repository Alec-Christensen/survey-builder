namespace SurveyBuilder.API.Models;

public class Answer
{
    public Guid Id { get; set; }
    public string? TextValue { get; set; }

    public Guid ResponseId { get; set; }
    public Response Response { get; set; } = null!;

    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    public Guid? SelectedOptionId { get; set; }
    public Option? SelectedOption { get; set; }
}
