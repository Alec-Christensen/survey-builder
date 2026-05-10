namespace SurveyBuilder.API.DTOs;

public class OptionResultResponse
{
    public Guid OptionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}
