using System.ComponentModel.DataAnnotations;

namespace SurveyBuilder.API.DTOs;

public class UpdateSurveyRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsPublished { get; set; }
}
