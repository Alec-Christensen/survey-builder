using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Services;

namespace SurveyBuilder.API.Controllers;

[ApiController]
[Route("api/surveys/{surveyId:guid}/questions")]
[Authorize]
public class QuestionsController : ControllerBase
{
    private readonly IQuestionService _questionService;

    public QuestionsController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<QuestionResponse>>> GetAll(Guid surveyId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var questions = await _questionService.GetBySurveyAsync(surveyId, userId);
        return Ok(questions);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QuestionResponse>> GetById(Guid surveyId, Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var question = await _questionService.GetByIdAsync(id, surveyId, userId);
        if (question is null) return NotFound();
        return Ok(question);
    }

    [HttpPost]
    public async Task<ActionResult<QuestionResponse>> Create(Guid surveyId, CreateQuestionRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var question = await _questionService.CreateAsync(surveyId, dto, userId);
        if (question is null) return NotFound();
        return CreatedAtAction(nameof(GetById), new { surveyId, id = question.Id }, question);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<QuestionResponse>> Update(Guid surveyId, Guid id, UpdateQuestionRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var question = await _questionService.UpdateAsync(id, surveyId, dto, userId);
        if (question is null) return NotFound();
        return Ok(question);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid surveyId, Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var (success, error) = await _questionService.DeleteAsync(id, surveyId, userId);
        if (!success && error != null)
            return BadRequest(new { message = error });
        if (!success)
            return NotFound();
        return NoContent();
    }
}
