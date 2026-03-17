# ReliefLink API Gateway + Config Server Implementation Plan

## Goal
Move to a Microsoft-friendly microservices runtime model where:
- API Gateway handles inbound API traffic as a single entry point.
- Config Service centralizes runtime configuration for internal and public consumers.

## Architecture
- `services/config-service` on `:3006`
  - `GET /health`
  - `GET /api/v1/config/public`
  - `GET /api/v1/config/internal`
- `services/api-gateway` on `:3005`
  - `GET /health`
  - `ALL /api/*` route forwarding to backend microservices

## Routing Strategy in API Gateway
- `/api/v1/auth*` and `/api/v1/users*` -> Auth Service
- `/api/v1/requests*` -> Request Service
- `/api/v1/volunteers*`, `/api/v1/resources*`, `/api/v1/assignments*` -> Volunteer Service
- `/api/v1/notifications*`, `/api/v1/status-events*` -> Notification Service
- `/api/v1/config*` -> Config Service

## Configuration Ownership
Config Service exposes:
- Public app config for clients (`/api/v1/config/public`)
- Internal service URLs for infrastructure consumers (`/api/v1/config/internal`)

API Gateway periodically refreshes upstream URLs from Config Service and falls back to `.env` values if unavailable.

## Frontend Integration
Frontend is switched to a single API base URL:
- `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3005`)

All existing frontend API calls remain unchanged in path structure, but now pass through gateway.

## Environment Variables Added
- `CONFIG_SERVICE_PORT`
- `API_GATEWAY_PORT`
- `CONFIG_SERVICE_URL`
- `API_GATEWAY_URL`
- `NEXT_PUBLIC_API_BASE_URL`

## DevOps/Run Changes
Root scripts now include gateway and config service for both `dev` and `build`.
VS Code tasks health check includes gateway and config service endpoints.

## Validation Steps
1. `pnpm install`
2. `pnpm build`
3. `pnpm dev`
4. Verify:
   - `http://localhost:3006/health`
   - `http://localhost:3005/health`
   - Login via gateway endpoint: `POST http://localhost:3005/api/v1/auth/login`

## Notes
This implementation keeps your existing domain services intact and overlays a gateway/config control plane pattern suited for microservices evolution and cloud readiness.
