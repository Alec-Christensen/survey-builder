namespace SurveyBuilder.API.DTOs;

public class PublicSurveyResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ShareableCode { get; set; } = string.Empty;
    public List<PublicQuestionResponse> Questions { get; set; } = [];
}
