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

## Project Structure
- SurveyBuilder.API - the main backend API project
- survey-builder-client - React frontend (Vite + TypeScript)

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

## Frontend
- Mobile first responsive design
- React with TypeScript (Vite)
- React Router for navigation
- Axios for API calls
- API runs on http://localhost:5228 in development