# SurveyBuilder

A full-stack web application for creating, sharing, and analyzing surveys. Built as a thesis project at Nackademin (Webbutvecklare .NET, CMS24).

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://survey-builder-client-production.up.railway.app |
| Backend API | https://survey-builder-production.up.railway.app |

## Tech Stack

| Technology | Role |
|------------|------|
| ASP.NET Core Web API (.NET 8) | REST API backend |
| Entity Framework Core | ORM for database access |
| PostgreSQL 16 | Relational database |
| ASP.NET Identity | User authentication |
| JWT (JSON Web Tokens) | Stateless auth tokens |
| React 19 + TypeScript | Frontend UI |
| Vite | Frontend build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Docker + Docker Compose | Containerization and local orchestration |
| Railway | Cloud deployment platform |

## Architecture

The backend follows a **layered architecture** with clear separation of concerns:

```
HTTP Request
    └── Controller        (routes, request/response handling)
        └── Service       (business logic)
            └── Repository / EF Core  (database access)
                └── PostgreSQL
```

- **Controllers** — thin layer that delegates to services and returns HTTP responses
- **Services** — all business logic lives here; controllers call services, not the database
- **EF Core + AppDbContext** — database access via strongly-typed models
- **DTOs** — separate request/response types keep entity models off the wire

The **frontend is fully decoupled** from the backend. It is a standalone React SPA that communicates with the API over HTTP, with no server-side rendering.

## Features

- **User accounts** — register and log in with JWT-based authentication
- **Survey management** — create, edit, and delete surveys from a personal dashboard
- **Question builder** — four question types: Text, Single Choice, Multiple Choice, and Rating
- **Shareable links** — each survey gets a unique public URL; no login required to respond
- **Response collection** — anonymous respondents can fill out and submit surveys
- **Results dashboard** — view aggregated analytics per question after responses come in
- **Safe deletion** — options with existing responses cannot be deleted, preventing data loss

## Local Development Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (only needed if running the backend without Docker)
- [Node.js 20+](https://nodejs.org/) (only needed if running the frontend without Docker)

### 1. Clone the repository

```bash
git clone <repository-url>
cd SurveyBuilder
```

### 2. Run with Docker (recommended)

This starts PostgreSQL and the API together. No extra configuration needed.

```bash
docker compose up --build
```

- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger *(not available in production mode — see note below)*

> **Note:** The Docker Compose setup runs the API in `Production` environment, which disables Swagger. To enable Swagger locally, set `ASPNETCORE_ENVIRONMENT=Development` in `docker-compose.yml`.

Then start the frontend separately:

```bash
cd survey-builder-client
npm install
npm run dev
```

Frontend: http://localhost:5173

### 3. Run the backend manually (without Docker)

Start a local PostgreSQL instance first, then:

```bash
cd SurveyBuilder.API
dotnet run
```

The API will be available at http://localhost:5228 and Swagger at http://localhost:5228/swagger.

The connection string and JWT settings are read from `appsettings.Development.json`. Update them to match your local PostgreSQL credentials if needed.

### 4. Run the frontend manually

```bash
cd survey-builder-client
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5228` in development. This is configured in the Vite dev server proxy.

## API Overview

| Group | Endpoints |
|-------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Surveys | `GET/POST /api/surveys`, `GET/PUT/DELETE /api/surveys/{id}`, `GET /api/surveys/{id}/results` |
| Questions | `GET/POST /api/surveys/{id}/questions`, `GET/PUT/DELETE /api/surveys/{id}/questions/{questionId}` |
| Options | `GET/POST /api/surveys/{id}/questions/{questionId}/options`, `GET/PUT/DELETE …/options/{optionId}` |
| Public | `GET /api/public/surveys/{shareableCode}`, `POST /api/public/surveys/{shareableCode}/responses` |

All protected endpoints require a `Bearer` token in the `Authorization` header.

## Deployment

The application is hosted on [Railway](https://railway.app/) using Docker.

- The backend is built and deployed from `SurveyBuilder.API/Dockerfile` using a multi-stage build (SDK image for build, ASP.NET runtime image for serving).
- The frontend is built with `npm run build` and served as a static site.
- PostgreSQL runs as a managed Railway service.
- Environment variables (connection string, JWT secret, CORS origin) are configured in Railway's dashboard per service.

## Project Structure

```
SurveyBuilder/
├── docker-compose.yml
├── SurveyBuilder.sln
├── SurveyBuilder.API/
│   ├── Controllers/        # HTTP endpoints
│   ├── Services/           # Business logic
│   ├── Models/             # EF Core entity classes
│   ├── DTOs/               # Request and response types
│   ├── Data/               # AppDbContext
│   ├── Migrations/         # EF Core migrations
│   ├── Dockerfile
│   └── Program.cs
└── survey-builder-client/
    └── src/
        ├── pages/          # Route-level components
        ├── components/     # Shared UI components
        ├── services/       # Axios API calls
        └── types/          # TypeScript type definitions
```

## Author

**Alec Christensen**
Nackademin — Webbutvecklare .NET, CMS24

- GitHub: https://github.com/Alec-Christensen
- LinkedIn: https://www.linkedin.com/in/alec-christensen-3a4a4a338/
