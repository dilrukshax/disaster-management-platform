# ReliefLink Implementation Plan

## 1. Scope
This implementation covers:
- 4 backend services (Auth, Request, Volunteer/Resource, Notification)
- PostgreSQL persistence with Prisma models and migrations
- Next.js frontend pages and forms for full MVP flow
- Local development setup only (cloud deployment intentionally excluded)

## 2. Delivered Backend Architecture
- Auth Service on port 3001
- Request Service on port 3002
- Volunteer Service on port 3003
- Notification Service on port 3004

Each service now includes:
- Prisma schema
- Initial SQL migration (`prisma/migrations/0001_init/migration.sql`)
- Prisma client generation scripts
- `prisma migrate deploy` scripts

## 3. Database Model Coverage
- Auth: `User`, `Role`
- Request: `ReliefRequest`, `RequestCategory`, `Urgency`, `RequestStatus`
- Volunteer: `Volunteer`, `Resource`, `Assignment` + availability/status enums
- Notification: `Notification`, `StatusEvent` + channel/delivery enums

## 4. API Coverage
- Auth
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `GET /api/v1/users/:id`
  - `PATCH /api/v1/users/:id/role`
- Request
  - `POST /api/v1/requests`
  - `GET /api/v1/requests`
  - `GET /api/v1/requests/:id`
  - `PATCH /api/v1/requests/:id`
  - `PATCH /api/v1/requests/:id/status`
- Volunteer/Resource
  - `POST /api/v1/volunteers`
  - `GET /api/v1/volunteers`
  - `PATCH /api/v1/volunteers/:id/availability`
  - `POST /api/v1/resources`
  - `GET /api/v1/resources`
  - `POST /api/v1/assignments`
  - `GET /api/v1/assignments/:requestId`
- Notification
  - `POST /api/v1/notifications`
  - `GET /api/v1/notifications/user/:userId`
  - `POST /api/v1/status-events`
  - `GET /api/v1/status-events/request/:requestId`

## 5. Frontend Coverage
Implemented UI/pages for:
- Authentication: login, registration
- Dashboard: operational metrics
- Requests: creation, listing, filtering, status update
- Volunteers: registration + listing
- Resources: creation + listing
- Assignments: create + history lookup
- Notifications: user notifications + status timeline lookup
- Admin: role update form

## 6. Local Run Sequence
1. Ensure `.env` exists in repo root with service DB URLs.
2. Install dependencies:
   - `pnpm install`
3. Generate Prisma clients:
   - `pnpm --filter @relieflink/auth-service prisma:generate`
   - `pnpm --filter @relieflink/request-service prisma:generate`
   - `pnpm --filter @relieflink/volunteer-service prisma:generate`
   - `pnpm --filter @relieflink/notification-service prisma:generate`
4. Apply migrations:
   - `pnpm --filter @relieflink/auth-service prisma:migrate`
   - `pnpm --filter @relieflink/request-service prisma:migrate`
   - `pnpm --filter @relieflink/volunteer-service prisma:migrate`
   - `pnpm --filter @relieflink/notification-service prisma:migrate`
5. Run full stack:
   - `pnpm dev`

## 7. End-to-End Validation Scenario
1. Register or login as requester.
2. Create a relief request.
3. Login as coordinator.
4. Register volunteer/resource and create assignment.
5. Verify request status moves to `assigned`.
6. Check notification entries and status timeline.

## 8. Non-Goals in This Iteration
- Azure deployment, ACR, Key Vault, App Insights
- CI/CD pipeline automation
- SAST/DevSecOps integration

These are intentionally deferred per requirement.
