namespace SurveyBuilder.API.Models;

public class Response
{
    public Guid Id { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public string? RespondentToken { get; set; }

    public Guid SurveyId { get; set; }
    public Survey Survey { get; set; } = null!;

    public ICollection<Answer> Answers { get; set; } = [];
}
