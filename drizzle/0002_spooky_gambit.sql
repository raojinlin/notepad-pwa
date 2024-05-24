ALTER TABLE "nt_note_share" ALTER COLUMN "expiredAt" SET DEFAULT null;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_share_idx" ON "nt_note_share" ("sid");