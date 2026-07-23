# TaskFlow

A task management system built for a software engineering internship assessment.
React + TypeScript frontend, Node.js + Express + TypeScript backend, PostgreSQL via Prisma.

Login with the seeded demo account — no registration flow, by design:

```
Email:    admin@test.com
Password: 123456
```

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Database setup](#database-setup)
- [Environment variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [API documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Future improvements](#future-improvements)

---

## Overview

TaskFlow lets a signed-in user create, organize, and track daily tasks: title,
description, priority, status, and due date, with a dashboard that summarizes
where things stand. It's intentionally scoped — single user, no registration —
so the assessment can focus on architecture and code quality rather than
account management.

Diagrams (ER diagram, sequence diagrams, architecture diagram) live in
[`docs/DIAGRAMS.md`](./docs/DIAGRAMS.md). A ready-to-import Postman collection
is at [`docs/TaskFlow.postman_collection.json`](./docs/TaskFlow.postman_collection.json).

## Features

- **Authentication** — JWT access + refresh tokens, protected routes, logout.
- **Dashboard** — total/pending/in-progress/completed/overdue counts, a
  completion donut chart, recent tasks, and upcoming deadlines.
- **Task CRUD** — create, edit, delete, and view task details (title,
  description, priority, status, due date, created/updated timestamps).
- **Real-time search** — debounced search by task title.
- **Filtering** — by status and priority, multiple filters at once.
- **Sorting** — newest, oldest, or by due date.
- **Validation** — mirrored on the frontend (Zod) and backend
  (express-validator), including "due date cannot be before today."
- **Pagination** — server-side, page + limit query params.
- **Dark-mode-ready design tokens**, loading skeletons, toast notifications,
  empty states, and subtle motion (Framer Motion).
- **Security** — Helmet, rate limiting (general + a stricter one on auth),
  CORS, bcrypt password hashing, environment-based secrets.
- **Docker** — Dockerfiles for both apps plus a root `docker-compose.yml`
  for one-command local development against a real Postgres instance.
- **Unit tests** — Vitest suites for the backend's JWT and error-handling
  utilities.

## Architecture

The backend follows a layered architecture — **routes → validators →
controllers → services → repositories → Prisma** — so each layer has one job:
validators reject bad input before it reaches business logic, controllers only
translate HTTP ↔ service calls, services hold business rules, and repositories
are the only place that talks to the database. See
[`docs/DIAGRAMS.md`](./docs/DIAGRAMS.md) for the full system diagram and
request sequences.

The frontend is organized around **pages → components → hooks → services**:
pages compose feature components, hooks wrap TanStack Query for server state,
and a thin Axios client centralizes auth headers and token refresh so no
component has to think about it.

## Folder structure

```
task-manager/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── config/         # env, Prisma client singleton
│       ├── controllers/    # HTTP request/response only
│       ├── routes/         # Express routers
│       ├── middlewares/    # auth, error handling, rate limiting, validation
│       ├── services/       # business logic
│       ├── repositories/   # Prisma data access
│       ├── validators/     # express-validator chains
│       └── utils/          # AppError, asyncHandler, JWT helpers
├── frontend/
│   └── src/
│       ├── components/     # ui/, layout/, tasks/, dashboard/
│       ├── pages/           # LoginPage, DashboardPage, TasksPage
│       ├── layouts/          # AppShell (sidebar + outlet)
│       ├── hooks/            # useTasks, useDebouncedValue
│       ├── services/         # apiClient, authApi, taskApi
│       ├── contexts/         # AuthContext
│       ├── types/            # shared TS types
│       └── utils/            # formatting, Zod schemas
├── docs/
│   ├── DIAGRAMS.md
│   └── TaskFlow.postman_collection.json
└── docker-compose.yml
```

## Installation

Prerequisites: Node.js 20+, npm, and a PostgreSQL database (local, Docker, or
a hosted one like Neon).

```bash
# Backend
cd backend
npm install
cp .env.example .env        # then fill in DATABASE_URL and JWT secrets
npm run prisma:migrate      # creates the schema
npm run prisma:seed         # creates admin@test.com / 123456 + sample tasks
npm run dev                 # starts on http://localhost:4000

# Frontend, in a second terminal
cd frontend
npm install
cp .env.example .env        # VITE_API_URL, defaults to http://localhost:4000/api
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173` and sign in with the seeded credentials.

## Database setup

The schema lives in [`backend/prisma/schema.prisma`](./backend/prisma/schema.prisma)
with a plain-SQL mirror at
[`backend/prisma/migrations/00000000000000_init/migration.sql`](./backend/prisma/migrations/00000000000000_init/migration.sql)
for anyone who wants to read it without Prisma.

Two tables:

- **users** — id, email (unique), password_hash, name, timestamps.
- **tasks** — id, title, description, status enum, priority enum, due_date,
  timestamps, and a `user_id` foreign key (`ON DELETE CASCADE`).

Indexes are composite and scoped to `user_id` first, matching how every task
query actually runs (always filtered by the owning user, then optionally by
status, priority, due date, or creation time).

```bash
npm run prisma:migrate   # apply migrations (dev)
npm run prisma:deploy    # apply migrations (prod, non-interactive)
npm run prisma:seed      # seed the demo user + sample tasks
npm run prisma:studio    # browse the data in Prisma Studio
```

## Environment variables

**Backend** (`backend/.env`, see `backend/.env.example`):

| Variable                 | Description                                   |
|---------------------------|------------------------------------------------|
| `PORT`                    | Port the API listens on (default `4000`)       |
| `NODE_ENV`                | `development` \| `production`                  |
| `DATABASE_URL`            | PostgreSQL connection string                   |
| `JWT_SECRET`              | Signing secret for access tokens               |
| `JWT_EXPIRES_IN`          | Access token lifetime (default `15m`)          |
| `JWT_REFRESH_SECRET`      | Signing secret for refresh tokens (different!) |
| `JWT_REFRESH_EXPIRES_IN`  | Refresh token lifetime (default `7d`)          |
| `CORS_ORIGIN`             | Allowed frontend origin                        |

**Frontend** (`frontend/.env`, see `frontend/.env.example`):

| Variable       | Description                          |
|-----------------|----------------------------------------|
| `VITE_API_URL`  | Base URL of the backend API           |

## Running with Docker

```bash
docker compose up --build
```

This starts Postgres, runs `prisma migrate deploy` against it, then brings up
the API on `:4000` and the frontend (served by nginx) on `:5173`. Seed the
demo user afterward with:

```bash
docker compose exec backend npm run prisma:seed
```

## API documentation

Base URL: `/api`. All `/tasks` routes require `Authorization: Bearer <accessToken>`.

| Method | Endpoint                | Description                                  |
|--------|--------------------------|-----------------------------------------------|
| POST   | `/auth/login`             | Log in, returns access + refresh tokens       |
| POST   | `/auth/refresh`           | Exchange a refresh token for a new pair       |
| POST   | `/auth/logout`            | Logout (client discards tokens)               |
| GET    | `/tasks`                  | List tasks — supports pagination/search/filter/sort |
| GET    | `/tasks/:id`              | Get one task                                  |
| POST   | `/tasks`                  | Create a task                                 |
| PUT    | `/tasks/:id`              | Update a task                                 |
| DELETE | `/tasks/:id`              | Delete a task                                 |
| GET    | `/tasks/dashboard/stats`  | Dashboard counts + recent/upcoming tasks      |

**`GET /tasks` query params:** `page`, `limit` (max 100), `search` (title,
case-insensitive), `status` (repeatable: `PENDING` \| `IN_PROGRESS` \|
`COMPLETED`), `priority` (repeatable: `LOW` \| `MEDIUM` \| `HIGH`), `sortBy`
(`newest` \| `oldest` \| `dueDate`).

**Example — create a task:**

```http
POST /api/tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Write onboarding guide",
  "description": "Draft the internal onboarding doc",
  "status": "PENDING",
  "priority": "MEDIUM",
  "dueDate": "2026-08-15"
}
```

Every response follows `{ success, message?, data?, errors?, pagination? }`.
Validation failures return `400` with an `errors` array of `{ field, message }`.
Import the full collection from
[`docs/TaskFlow.postman_collection.json`](./docs/TaskFlow.postman_collection.json)
for ready-to-run requests (it auto-captures tokens and the created task id).

## Testing

```bash
cd backend && npm test     # Vitest — JWT + AppError unit tests
```

## Deployment

- **Frontend → Vercel:** import the `frontend/` folder as the project root,
  build command `npm run build`, output directory `dist`. Set `VITE_API_URL`
  to the deployed backend's URL.
- **Backend → Render:** import `backend/` as a Web Service, build command
  `npm install && npm run build && npx prisma generate`, start command
  `npx prisma migrate deploy && npm start`. Set all backend environment
  variables from the table above, with `CORS_ORIGIN` pointing at the Vercel URL.
- **Database → Neon:** create a Postgres project, copy the pooled connection
  string into `DATABASE_URL` on Render.

## Known limitations

- Single-user by design — there's no registration or multi-tenant support.
- Refresh tokens are stateless JWTs, not stored server-side, so there's no
  way to revoke one before it expires (fine for this assessment's scope;
  a real product would track them in the database or a fast store).
- No file attachments, comments, or subtasks — the brief scoped this to the
  five core task fields.
- Prisma's engine binaries need normal internet access to download during
  `prisma generate`; this doesn't affect anywhere with standard network
  access (local machines, CI, Render, Docker Hub builds).

## Future improvements

- Task tags/labels and a Kanban board view alongside the list view.
- Bulk actions (multi-select delete, bulk status change).
- Server-persisted refresh token revocation (logout-everywhere).
- Activity log per task ("status changed to In Progress on ...").
- Keyboard shortcuts for power users (Linear-style command palette).
