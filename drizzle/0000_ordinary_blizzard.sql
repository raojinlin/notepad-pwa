CREATE TABLE IF NOT EXISTS "nt_note_share" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" serial NOT NULL,
	"noteID" serial NOT NULL,
	"password" text DEFAULT '',
	"public" boolean DEFAULT false,
	"accessCount" serial NOT NULL,
	"expiredAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nt_note_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" serial NOT NULL,
	"tagID" serial NOT NULL,
	"noteID" serial NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nt_notepad" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userID" serial NOT NULL,
	"content" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nt_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userID" serial NOT NULL,
	"content" text NOT NULL,
	"color" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_tag_note_idx" ON "nt_note_tags" ("userID","tagID","noteID");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_tag_idx" ON "nt_tags" ("userID","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" ("email");