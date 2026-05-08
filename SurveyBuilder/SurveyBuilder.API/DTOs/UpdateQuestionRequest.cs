using System.ComponentModel.DataAnnotations;
using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.DTOs;

public class UpdateQuestionRequest
{
    [Required]
    public string Text { get; set; } = string.Empty;

    [Required]
    public QuestionType Type { get; set; }

    public int Order { get; set; }

    public bool IsRequired { get; set; }
}
