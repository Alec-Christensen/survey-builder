using System.ComponentModel.DataAnnotations;

namespace SurveyBuilder.API.DTOs;

public class CreateOptionRequest
{
    [Required]
    public string Text { get; set; } = string.Empty;

    public int Order { get; set; }
}
