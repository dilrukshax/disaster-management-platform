# ReliefLink Workspace Structure

This workspace is organized as a monorepo scaffold for the ReliefLink architecture.

## Top-Level Layout

- `apps/web` - Next.js frontend portal
- `services/auth-service` - Auth and user identity microservice
- `services/request-service` - Relief request lifecycle microservice
- `services/volunteer-service` - Volunteer/resource/assignment microservice
- `services/notification-service` - Notification and status event microservice
- `infra` - Docker, Azure, and CI/CD deployment assets
- `docs` - architecture, API contracts, and demo assets
- `scripts` - local automation scripts

## Four Backend Service Architecture

1. Auth Service
2. Request Service
3. Volunteer & Resource Service
4. Notification Service

Each service has a NestJS-style internal structure under `src/`:

- `config`
- `common/guards`
- `common/interceptors`
- `common/filters`
- `common/dto`
- `modules/*` (service-specific domain modules)
- `prisma`
- `health`
- `docs`
