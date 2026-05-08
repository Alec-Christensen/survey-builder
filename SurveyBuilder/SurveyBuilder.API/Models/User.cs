using Microsoft.AspNetCore.Identity;

namespace SurveyBuilder.API.Models;

public class User : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Survey> Surveys { get; set; } = [];
}
