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
- Controllers � handle HTTP requests and responses
- Services � contain business logic
- Repositories � handle database access via EF Core
- Models � entity classes mapped to database tables
- DTOs � data transfer objects for API requests/responses

## Code Style
- Use conventional commits for all git commits
  - feat, fix, docs, chore, refactor, test
- Commit regularly � after each meaningful unit of work 
  (a working endpoint, a new service method, a completed feature). 
  Not too small (one line changes) and not too large (hours of work in one commit).
- Never add Co-Authored-By lines to commit messages
- Use async/await for all database and I/O operations
- Keep controllers thin � business logic belongs in services
- Use DTOs to avoid exposing entities directly in API responses

## Git Branching
- Always work on feature branches, never directly on main
- Branch naming: feat/feature-name, fix/bug-name, chore/task-name
- Merge to main only when a feature is complete and working

## Project Structure
- SurveyBuilder.API � the main backend API project
- React frontend will be added in a separate folder

## Key Features to Build
1. User authentication with ASP.NET Identity
2. Survey CRUD (create, read, update, delete)
3. Question management with multiple question types
4. Unique shareable survey links
5. Response collection without requiring respondent login
6. Results dashboard with analytics
7. Conditional question logic