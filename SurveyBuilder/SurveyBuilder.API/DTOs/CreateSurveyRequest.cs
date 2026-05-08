using System.ComponentModel.DataAnnotations;

namespace SurveyBuilder.API.DTOs;

public class CreateSurveyRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }
}
