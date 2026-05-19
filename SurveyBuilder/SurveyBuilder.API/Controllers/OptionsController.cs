using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Services;

namespace SurveyBuilder.API.Controllers;

[ApiController]
[Route("api/surveys/{surveyId:guid}/questions/{questionId:guid}/options")]
[Authorize]
public class OptionsController : ControllerBase
{
    private readonly IOptionService _optionService;

    public OptionsController(IOptionService optionService)
    {
        _optionService = optionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<OptionResponse>>> GetAll(Guid surveyId, Guid questionId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var options = await _optionService.GetByQuestionAsync(questionId, surveyId, userId);
        return Ok(options);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OptionResponse>> GetById(Guid surveyId, Guid questionId, Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var option = await _optionService.GetByIdAsync(id, questionId, surveyId, userId);
        if (option is null) return NotFound();
        return Ok(option);
    }

    [HttpPost]
    public async Task<ActionResult<OptionResponse>> Create(Guid surveyId, Guid questionId, CreateOptionRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var option = await _optionService.CreateAsync(questionId, surveyId, dto, userId);
        if (option is null) return NotFound();
        return CreatedAtAction(nameof(GetById), new { surveyId, questionId, id = option.Id }, option);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<OptionResponse>> Update(Guid surveyId, Guid questionId, Guid id, UpdateOptionRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var option = await _optionService.UpdateAsync(id, questionId, surveyId, dto, userId);
        if (option is null) return NotFound();
        return Ok(option);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid surveyId, Guid questionId, Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (success, error) = await _optionService.DeleteAsync(id, questionId, surveyId, userId);
        if (error is not null) return BadRequest(new { message = error });
        if (!success) return NotFound();
        return NoContent();
    }
}
