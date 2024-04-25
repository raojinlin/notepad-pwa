DROP INDEX IF EXISTS "session_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_session_idx" ON "nt_sessions" ("userID");