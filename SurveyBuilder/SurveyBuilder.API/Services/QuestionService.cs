using Microsoft.EntityFrameworkCore;
using SurveyBuilder.API.Data;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.Services;

public class QuestionService : IQuestionService
{
    private readonly AppDbContext _db;

    public QuestionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<QuestionResponse>> GetBySurveyAsync(Guid surveyId, string userId)
    {
        return await _db.Questions
            .Where(q => q.SurveyId == surveyId && q.Survey.UserId == userId)
            .OrderBy(q => q.Order)
            .Select(q => ToResponse(q))
            .ToListAsync();
    }

    public async Task<QuestionResponse?> GetByIdAsync(Guid id, Guid surveyId, string userId)
    {
        var question = await _db.Questions
            .FirstOrDefaultAsync(q => q.Id == id && q.SurveyId == surveyId && q.Survey.UserId == userId);

        return question is null ? null : ToResponse(question);
    }

    public async Task<QuestionResponse?> CreateAsync(Guid surveyId, CreateQuestionRequest dto, string userId)
    {
        var surveyExists = await _db.Surveys
            .AnyAsync(s => s.Id == surveyId && s.UserId == userId);

        if (!surveyExists) return null;

        var question = new Question
        {
            SurveyId = surveyId,
            Text = dto.Text,
            Type = dto.Type,
            Order = dto.Order,
            IsRequired = dto.IsRequired
        };

        _db.Questions.Add(question);
        await _db.SaveChangesAsync();

        return ToResponse(question);
    }

    public async Task<QuestionResponse?> UpdateAsync(Guid id, Guid surveyId, UpdateQuestionRequest dto, string userId)
    {
        var question = await _db.Questions
            .FirstOrDefaultAsync(q => q.Id == id && q.SurveyId == surveyId && q.Survey.UserId == userId);

        if (question is null) return null;

        question.Text = dto.Text;
        question.Type = dto.Type;
        question.Order = dto.Order;
        question.IsRequired = dto.IsRequired;

        await _db.SaveChangesAsync();

        return ToResponse(question);
    }

    public async Task<(bool success, string? error)> DeleteAsync(Guid id, Guid surveyId, string userId)
    {
        var question = await _db.Questions
            .FirstOrDefaultAsync(q => q.Id == id && q.SurveyId == surveyId && q.Survey.UserId == userId);

        if (question is null) return (false, null);

        var hasResponses = await _db.Answers
            .AnyAsync(a => a.QuestionId == id);

        if (hasResponses)
            return (false, "This question has existing responses and cannot be deleted.");

        _db.Questions.Remove(question);
        await _db.SaveChangesAsync();
        return (true, null);
    }

    private static QuestionResponse ToResponse(Question q) => new()
    {
        Id = q.Id,
        SurveyId = q.SurveyId,
        Text = q.Text,
        Type = q.Type,
        Order = q.Order,
        IsRequired = q.IsRequired
    };
}
