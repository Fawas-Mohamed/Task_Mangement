-- Initial migration: users and tasks
-- This mirrors what `prisma migrate dev` generates; kept here for reviewers
-- who want to read the schema as plain SQL.

CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE "users" (
  "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"         TEXT NOT NULL UNIQUE,
  "password_hash" TEXT NOT NULL,
  "name"          TEXT NOT NULL,
  "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(3) NOT NULL
);

CREATE TABLE "tasks" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "status"      "TaskStatus" NOT NULL DEFAULT 'PENDING',
  "priority"    "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "due_date"    TIMESTAMP(3),
  "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"  TIMESTAMP(3) NOT NULL,
  "user_id"     UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "tasks_user_id_idx" ON "tasks"("user_id");
CREATE INDEX "tasks_user_id_status_idx" ON "tasks"("user_id", "status");
CREATE INDEX "tasks_user_id_priority_idx" ON "tasks"("user_id", "priority");
CREATE INDEX "tasks_user_id_due_date_idx" ON "tasks"("user_id", "due_date");
CREATE INDEX "tasks_user_id_created_at_idx" ON "tasks"("user_id", "created_at");
