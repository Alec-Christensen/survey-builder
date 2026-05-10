using Microsoft.EntityFrameworkCore;
using SurveyBuilder.API.Data;
using SurveyBuilder.API.DTOs;
using SurveyBuilder.API.Models;

namespace SurveyBuilder.API.Services;

public class PublicSurveyService : IPublicSurveyService
{
    private readonly AppDbContext _db;

    public PublicSurveyService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PublicSurveyResponse?> GetByShareableCodeAsync(string shareableCode)
    {
        var survey = await _db.Surveys
            .Include(s => s.Questions.OrderBy(q => q.Order))
                .ThenInclude(q => q.Options.OrderBy(o => o.Order))
            .FirstOrDefaultAsync(s => s.ShareableCode == shareableCode && s.IsPublished);

        return survey is null ? null : ToPublicResponse(survey);
    }

    public async Task<(SubmitResponseResponse? Result, string? Error)> SubmitResponseAsync(
        string shareableCode, SubmitResponseRequest dto)
    {
        var survey = await _db.Surveys
            .Include(s => s.Questions)
            .FirstOrDefaultAsync(s => s.ShareableCode == shareableCode && s.IsPublished);

        if (survey is null)
            return (null, null);

        var answeredQuestionIds = dto.Answers
            .Where(a => !string.IsNullOrEmpty(a.TextValue) || a.SelectedOptionIds.Count > 0)
            .Select(a => a.QuestionId)
            .ToHashSet();

        var missingRequired = survey.Questions
            .Where(q => q.IsRequired && !answeredQuestionIds.Contains(q.Id))
            .Select(q => q.Text)
            .ToList();

        if (missingRequired.Count > 0)
            return (null, $"Required questions missing answers: {string.Join(", ", missingRequired)}");

        var response = new Response
        {
            SurveyId = survey.Id,
            SubmittedAt = DateTime.UtcNow
        };

        var answers = new List<Answer>();

        foreach (var answerDto in dto.Answers)
        {
            if (!string.IsNullOrEmpty(answerDto.TextValue))
            {
                answers.Add(new Answer
                {
                    Response = response,
                    QuestionId = answerDto.QuestionId,
                    TextValue = answerDto.TextValue
                });
            }

            foreach (var optionId in answerDto.SelectedOptionIds)
            {
                answers.Add(new Answer
                {
                    Response = response,
                    QuestionId = answerDto.QuestionId,
                    SelectedOptionId = optionId
                });
            }
        }

        _db.Responses.Add(response);
        _db.Answers.AddRange(answers);
        await _db.SaveChangesAsync();

        return (new SubmitResponseResponse { ResponseId = response.Id, SubmittedAt = response.SubmittedAt }, null);
    }

    private static PublicSurveyResponse ToPublicResponse(Survey s) => new()
    {
        Id = s.Id,
        Title = s.Title,
        Description = s.Description,
        ShareableCode = s.ShareableCode,
        Questions = s.Questions.Select(q => new PublicQuestionResponse
        {
            Id = q.Id,
            Text = q.Text,
            Type = q.Type,
            Order = q.Order,
            IsRequired = q.IsRequired,
            Options = q.Options.Select(o => new OptionResponse
            {
                Id = o.Id,
                QuestionId = o.QuestionId,
                Text = o.Text,
                Order = o.Order
            }).ToList()
        }).ToList()
    };
}
