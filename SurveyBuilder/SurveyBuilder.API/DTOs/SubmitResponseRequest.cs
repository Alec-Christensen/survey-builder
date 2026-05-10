namespace SurveyBuilder.API.DTOs;

public class SubmitResponseRequest
{
    public List<SubmitAnswerRequest> Answers { get; set; } = [];
}
