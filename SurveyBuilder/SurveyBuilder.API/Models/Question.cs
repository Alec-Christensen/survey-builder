namespace SurveyBuilder.API.Models;

public class Question
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public int Order { get; set; }
    public bool IsRequired { get; set; } = false;

    public Guid SurveyId { get; set; }
    public Survey Survey { get; set; } = null!;

    public ICollection<Option> Options { get; set; } = [];
    public ICollection<Answer> Answers { get; set; } = [];
}
