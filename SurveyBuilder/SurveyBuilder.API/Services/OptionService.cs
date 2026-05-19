using Microsoft.EntityFrameworkCore;
using SurveyBuilder.API.Data;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.Services;

public class OptionService : IOptionService
{
    private readonly AppDbContext _db;

    public OptionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<OptionResponse>> GetByQuestionAsync(Guid questionId, Guid surveyId, string userId)
    {
        return await _db.Options
            .Where(o => o.QuestionId == questionId
                     && o.Question.SurveyId == surveyId
                     && o.Question.Survey.UserId == userId)
            .OrderBy(o => o.Order)
            .Select(o => ToResponse(o))
            .ToListAsync();
    }

    public async Task<OptionResponse?> GetByIdAsync(Guid id, Guid questionId, Guid surveyId, string userId)
    {
        var option = await _db.Options
            .FirstOrDefaultAsync(o => o.Id == id
                                   && o.QuestionId == questionId
                                   && o.Question.SurveyId == surveyId
                                   && o.Question.Survey.UserId == userId);

        return option is null ? null : ToResponse(option);
    }

    public async Task<OptionResponse?> CreateAsync(Guid questionId, Guid surveyId, CreateOptionRequest dto, string userId)
    {
        var questionExists = await _db.Questions
            .AnyAsync(q => q.Id == questionId
                        && q.SurveyId == surveyId
                        && q.Survey.UserId == userId);

        if (!questionExists) return null;

        var option = new Option
        {
            QuestionId = questionId,
            Text = dto.Text,
            Order = dto.Order
        };

        _db.Options.Add(option);
        await _db.SaveChangesAsync();

        return ToResponse(option);
    }

    public async Task<OptionResponse?> UpdateAsync(Guid id, Guid questionId, Guid surveyId, UpdateOptionRequest dto, string userId)
    {
        var option = await _db.Options
            .FirstOrDefaultAsync(o => o.Id == id
                                   && o.QuestionId == questionId
                                   && o.Question.SurveyId == surveyId
                                   && o.Question.Survey.UserId == userId);

        if (option is null) return null;

        option.Text = dto.Text;
        option.Order = dto.Order;

        await _db.SaveChangesAsync();

        return ToResponse(option);
    }

    public async Task<(bool success, string? error)> DeleteAsync(Guid id, Guid questionId, Guid surveyId, string userId)
    {
        var option = await _db.Options
            .FirstOrDefaultAsync(o => o.Id == id
                                   && o.QuestionId == questionId
                                   && o.Question.SurveyId == surveyId
                                   && o.Question.Survey.UserId == userId);

        if (option is null) return (false, null);

        var hasAnswers = await _db.Answers.AnyAsync(a => a.SelectedOptionId == id);

        if (hasAnswers)
            return (false, "This option has existing responses and cannot be deleted.");

        _db.Options.Remove(option);
        await _db.SaveChangesAsync();

        return (true, null);
    }

    private static OptionResponse ToResponse(Option o) => new()
    {
        Id = o.Id,
        QuestionId = o.QuestionId,
        Text = o.Text,
        Order = o.Order
    };
}
