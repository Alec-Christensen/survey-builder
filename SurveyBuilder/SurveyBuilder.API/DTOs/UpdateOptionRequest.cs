using System.ComponentModel.DataAnnotations;

namespace SurveyBuilder.API.DTOs;

public class UpdateOptionRequest
{
    [Required]
    public string Text { get; set; } = string.Empty;

    public int Order { get; set; }
}
