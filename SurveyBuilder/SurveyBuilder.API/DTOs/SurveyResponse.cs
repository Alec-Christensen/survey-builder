namespace SurveyBuilder.API.DTOs;

public class SurveyResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublished { get; set; }
    public string ShareableCode { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
