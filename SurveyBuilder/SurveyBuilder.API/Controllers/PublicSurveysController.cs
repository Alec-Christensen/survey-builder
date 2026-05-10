using Microsoft.AspNetCore.Mvc;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Services;

namespace SurveyBuilder.API.Controllers;

[ApiController]
[Route("api/public/surveys")]
public class PublicSurveysController : ControllerBase
{
    private readonly IPublicSurveyService _publicSurveyService;

    public PublicSurveysController(IPublicSurveyService publicSurveyService)
    {
        _publicSurveyService = publicSurveyService;
    }

    [HttpGet("{shareableCode}")]
    public async Task<ActionResult<PublicSurveyResponse>> GetSurvey(string shareableCode)
    {
        var survey = await _publicSurveyService.GetByShareableCodeAsync(shareableCode);
        if (survey is null) return NotFound();
        return Ok(survey);
    }

    [HttpPost("{shareableCode}/responses")]
    public async Task<ActionResult<SubmitResponseResponse>> SubmitResponse(
        string shareableCode, SubmitResponseRequest request)
    {
        var (result, error) = await _publicSurveyService.SubmitResponseAsync(shareableCode, request);
        if (result is null && error is null) return NotFound();
        if (error is not null) return BadRequest(new { message = error });
        return Ok(result);
    }
}
