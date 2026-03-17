# ReliefLink Local Implementation

This repository contains the complete local implementation for the ReliefLink project:

- Next.js frontend portal (`apps/web`)
- Auth Service (`services/auth-service`)
- Request Service (`services/request-service`)
- Volunteer Service (`services/volunteer-service`)
- Notification Service (`services/notification-service`)

Cloud-native deployment assets are intentionally not implemented in this stage.

## Prerequisites

- Node.js 20+
- pnpm 10+

## Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
pnpm install
```

3. Start all services and frontend:

```bash
pnpm dev
```

## Default Local URLs

- Web: http://localhost:3000
- Auth: http://localhost:3001
- Request: http://localhost:3002
- Volunteer: http://localhost:3003
- Notification: http://localhost:3004

## Seed Login

- Email: coordinator@relieflink.local
- Password: Admin@123

## Implemented API Coverage

### Auth Service

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/users/:id`
- `PATCH /api/v1/users/:id/role`
- `GET /health`

### Request Service

- `POST /api/v1/requests`
- `GET /api/v1/requests`
- `GET /api/v1/requests/:id`
- `PATCH /api/v1/requests/:id`
- `PATCH /api/v1/requests/:id/status`
- `GET /health`

### Volunteer Service

- `POST /api/v1/volunteers`
- `GET /api/v1/volunteers`
- `PATCH /api/v1/volunteers/:id/availability`
- `POST /api/v1/resources`
- `GET /api/v1/resources`
- `POST /api/v1/assignments`
- `GET /api/v1/assignments/:requestId`
- `GET /health`

### Notification Service

- `POST /api/v1/notifications`
- `GET /api/v1/notifications/user/:userId`
- `POST /api/v1/status-events`
- `GET /api/v1/status-events/request/:requestId`
- `GET /health`

## Frontend Pages

- `/login`
- `/register`
- `/dashboard`
- `/requests`
- `/requests/new`
- `/volunteers`
- `/resources`
- `/assignments`
- `/notifications`
- `/admin`
