namespace SurveyBuilder.API.DTOs;

public class SurveyResultsResponse
{
    public Guid SurveyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ResponseCount { get; set; }
    public List<QuestionResultResponse> Questions { get; set; } = [];
}
