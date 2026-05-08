namespace SurveyBuilder.API.Models;

public class Survey
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public string ShareableCode { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    public ICollection<Question> Questions { get; set; } = [];
    public ICollection<Response> Responses { get; set; } = [];
}
