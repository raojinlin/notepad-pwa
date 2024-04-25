CREATE TABLE IF NOT EXISTS "nt_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"expiredAt" timestamp NOT NULL,
	"data" json NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "session_idx" ON "nt_sessions" ("name");