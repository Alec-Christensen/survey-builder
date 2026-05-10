using Microsoft.EntityFrameworkCore;
using SurveyBuilder.API.Data;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.Services;

public class SurveyService : ISurveyService
{
    private readonly AppDbContext _db;

    public SurveyService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SurveyResponse>> GetUserSurveysAsync(string userId)
    {
        return await _db.Surveys
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => ToResponse(s))
            .ToListAsync();
    }

    public async Task<SurveyResponse?> GetByIdAsync(Guid id, string userId)
    {
        var survey = await _db.Surveys
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        return survey is null ? null : ToResponse(survey);
    }

    public async Task<SurveyResponse> CreateAsync(CreateSurveyRequest dto, string userId)
    {
        var survey = new Survey
        {
            Title = dto.Title,
            Description = dto.Description,
            UserId = userId,
            ShareableCode = Guid.NewGuid().ToString("N"),
            CreatedAt = DateTime.UtcNow
        };

        _db.Surveys.Add(survey);
        await _db.SaveChangesAsync();

        return ToResponse(survey);
    }

    public async Task<SurveyResponse?> UpdateAsync(Guid id, UpdateSurveyRequest dto, string userId)
    {
        var survey = await _db.Surveys
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (survey is null) return null;

        survey.Title = dto.Title;
        survey.Description = dto.Description;
        survey.IsPublished = dto.IsPublished;

        await _db.SaveChangesAsync();

        return ToResponse(survey);
    }

    public async Task<bool> DeleteAsync(Guid id, string userId)
    {
        var survey = await _db.Surveys
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (survey is null) return false;

        _db.Surveys.Remove(survey);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<SurveyResultsResponse?> GetResultsAsync(Guid id, string userId)
    {
        var survey = await _db.Surveys
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (survey is null) return null;

        var responseCount = await _db.Responses.CountAsync(r => r.SurveyId == id);

        var questions = await _db.Questions
            .Where(q => q.SurveyId == id)
            .Include(q => q.Options.OrderBy(o => o.Order))
            .OrderBy(q => q.Order)
            .ToListAsync();

        var answers = await _db.Answers
            .Where(a => a.Question.SurveyId == id)
            .ToListAsync();

        var answersByQuestion = answers.ToLookup(a => a.QuestionId);

        var questionResults = questions.Select(q =>
        {
            var questionAnswers = answersByQuestion[q.Id].ToList();

            var result = new QuestionResultResponse
            {
                QuestionId = q.Id,
                Text = q.Text,
                Type = q.Type,
                Order = q.Order,
                AnswerCount = questionAnswers.Count
            };

            if (q.Type is QuestionType.Text or QuestionType.Rating)
            {
                result.TextAnswers = questionAnswers
                    .Where(a => a.TextValue is not null)
                    .Select(a => a.TextValue!)
                    .ToList();
            }
            else
            {
                result.OptionResults = q.Options.Select(o =>
                {
                    var count = questionAnswers.Count(a => a.SelectedOptionId == o.Id);
                    return new OptionResultResponse
                    {
                        OptionId = o.Id,
                        Text = o.Text,
                        Count = count,
                        Percentage = responseCount > 0
                            ? Math.Round((double)count / responseCount * 100, 1)
                            : 0
                    };
                }).ToList();
            }

            return result;
        }).ToList();

        return new SurveyResultsResponse
        {
            SurveyId = survey.Id,
            Title = survey.Title,
            ResponseCount = responseCount,
            Questions = questionResults
        };
    }

    private static SurveyResponse ToResponse(Survey s) => new()
    {
        Id = s.Id,
        Title = s.Title,
        Description = s.Description,
        IsPublished = s.IsPublished,
        ShareableCode = s.ShareableCode,
        CreatedAt = s.CreatedAt
    };
}
