# SurveyBuilder

A web application where users can create, share and analyze surveys.
Built as a thesis project at Nackademin (Webbutvecklare .NET, CMS24).

## Tech Stack
- Backend: ASP.NET Core Web API (.NET 8), C#
- ORM: Entity Framework Core
- Database: PostgreSQL
- Frontend: React
- Containerization: Docker

## Architecture
The backend follows a layered architecture:
- Controllers - handle HTTP requests and responses
- Services - contain business logic
- Repositories - handle database access via EF Core
- Models - entity classes mapped to database tables
- DTOs - data transfer objects for API requests/responses

## Code Style
- Use conventional commits for all git commits
  - feat, fix, docs, chore, refactor, test
- Commit regularly - after each meaningful unit of work
  (a working endpoint, a new service method, a completed feature).
  Not too small (one line changes) and not too large (hours of work in one commit).
- Never add Co-Authored-By lines to commit messages
- Use async/await for all database and I/O operations
- Keep controllers thin - business logic belongs in services
- Use DTOs to avoid exposing entities directly in API responses

## Git Branching
- Always work on feature branches, never directly on main
- Branch naming: feat/feature-name, fix/bug-name, chore/task-name
- Merge to main only when a feature is complete and working

## Features
### Completed
1. User authentication with ASP.NET Identity
2. Survey CRUD (create, read, update, delete)
3. Question management with multiple question types
4. Unique shareable survey links
5. Response collection without requiring respondent login
6. Results dashboard with analytics

### Pending
7. Conditional question logic

## Backend API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Surveys
- `GET /api/surveys`
- `POST /api/surveys`
- `GET /api/surveys/{id}`
- `PUT /api/surveys/{id}`
- `DELETE /api/surveys/{id}`
- `GET /api/surveys/{id}/results`

### Questions
- `GET /api/surveys/{id}/questions`
- `POST /api/surveys/{id}/questions`
- `GET /api/surveys/{id}/questions/{questionId}`
- `PUT /api/surveys/{id}/questions/{questionId}`
- `DELETE /api/surveys/{id}/questions/{questionId}`

### Options
- `GET /api/surveys/{id}/questions/{questionId}/options`
- `POST /api/surveys/{id}/questions/{questionId}/options`
- `GET /api/surveys/{id}/questions/{questionId}/options/{optionId}`
- `PUT /api/surveys/{id}/questions/{questionId}/options/{optionId}`
- `DELETE /api/surveys/{id}/questions/{questionId}/options/{optionId}`

### Public
- `GET /api/public/surveys/{shareableCode}`
- `POST /api/public/surveys/{shareableCode}/responses`

## Deployment
- Backend: https://survey-builder-production.up.railway.app
- Frontend: https://survey-builder-client-production.up.railway.app
- Hosted on Railway

## Frontend
- Mobile first responsive design
- React with TypeScript (Vite)
- React Router for navigation
- Axios for API calls
- API runs on http://localhost:5228 in development

### Pages
| Page | Route | Access |
|------|-------|--------|
| `LoginPage` | `/` | Public |
| `RegisterPage` | `/register` | Public |
| `DashboardPage` | `/dashboard` | Protected |
| `SurveyEditorPage` | `/surveys/create`, `/surveys/:id/edit` | Protected |
| `PublicSurveyPage` | `/survey/:shareableCode` | Public |
| `ResultsPage` | `/surveys/:id/results` | Protected |

## Project Structure
```
SurveyBuilder/
├── docker-compose.yml
├── SurveyBuilder.sln
├── SurveyBuilder.API/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── SurveysController.cs
│   │   ├── QuestionsController.cs
│   │   ├── OptionsController.cs
│   │   └── PublicSurveysController.cs
│   ├── Services/
│   │   ├── AuthService.cs / IAuthService.cs
│   │   ├── SurveyService.cs / ISurveyService.cs
│   │   ├── QuestionService.cs / IQuestionService.cs
│   │   ├── OptionService.cs / IOptionService.cs
│   │   └── PublicSurveyService.cs / IPublicSurveyService.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Survey.cs
│   │   ├── Question.cs
│   │   ├── QuestionType.cs
│   │   ├── Option.cs
│   │   ├── Response.cs
│   │   └── Answer.cs
│   ├── DTOs/
│   │   ├── Auth: LoginRequest, RegisterRequest, AuthResponse
│   │   ├── Survey: CreateSurveyRequest, UpdateSurveyRequest, SurveyResponse, SurveyResultsResponse
│   │   ├── Question: CreateQuestionRequest, UpdateQuestionRequest, QuestionResponse, QuestionResultResponse
│   │   ├── Option: CreateOptionRequest, UpdateOptionRequest, OptionResponse, OptionResultResponse
│   │   └── Public: PublicSurveyResponse, PublicQuestionResponse, SubmitResponseRequest, SubmitResponseResponse, SubmitAnswerRequest
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Migrations/
│   ├── Program.cs
│   └── appsettings.json
└── survey-builder-client/
    └── src/
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── SurveyEditorPage.tsx
        │   ├── PublicSurveyPage.tsx
        │   └── ResultsPage.tsx
        ├── components/
        │   └── ProtectedRoute.tsx
        ├── services/
        │   ├── api.ts
        │   ├── authService.ts
        │   ├── surveyService.ts
        │   ├── questionService.ts
        │   ├── optionService.ts
        │   ├── publicSurveyService.ts
        │   └── resultsService.ts
        ├── types/
        │   ├── auth.ts
        │   ├── survey.ts
        │   ├── question.ts
        │   ├── public.ts
        │   └── results.ts
        ├── App.tsx
        └── main.tsx
```