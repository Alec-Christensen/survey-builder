using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Services;

namespace SurveyBuilder.API.Controllers;

[ApiController]
[Route("api/surveys")]
[Authorize]
public class SurveysController : ControllerBase
{
    private readonly ISurveyService _surveyService;

    public SurveysController(ISurveyService surveyService)
    {
        _surveyService = surveyService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SurveyResponse>>> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var surveys = await _surveyService.GetUserSurveysAsync(userId);
        return Ok(surveys);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SurveyResponse>> GetById(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var survey = await _surveyService.GetByIdAsync(id, userId);
        if (survey is null) return NotFound();
        return Ok(survey);
    }

    [HttpPost]
    public async Task<ActionResult<SurveyResponse>> Create(CreateSurveyRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var survey = await _surveyService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = survey.Id }, survey);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SurveyResponse>> Update(Guid id, UpdateSurveyRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var survey = await _surveyService.UpdateAsync(id, dto, userId);
        if (survey is null) return NotFound();
        return Ok(survey);
    }

    [HttpGet("{id:guid}/results")]
    public async Task<ActionResult<SurveyResultsResponse>> GetResults(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var results = await _surveyService.GetResultsAsync(id, userId);
        if (results is null) return NotFound();
        return Ok(results);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var deleted = await _surveyService.DeleteAsync(id, userId);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
