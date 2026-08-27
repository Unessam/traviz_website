-- Retention controls are additive and deliberately idempotent so this can be
-- introduced to databases that were previously maintained with `db:push`.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "legal_hold" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "legal_hold_reason" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "access_removed_at" timestamp;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "retention_action_at" timestamp;
--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "legal_hold" boolean DEFAULT false NOT NULL;
ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "legal_hold_reason" text;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "retention_runs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "requested_by" varchar NOT NULL,
  "reference_time" timestamp NOT NULL,
  "dry_run" boolean NOT NULL,
  "status" varchar NOT NULL,
  "contact_eligible" integer DEFAULT 0 NOT NULL,
  "users_eligible" integer DEFAULT 0 NOT NULL,
  "contacts_deleted" integer DEFAULT 0 NOT NULL,
  "users_anonymized" integer DEFAULT 0 NOT NULL,
  "blocked_by_legal_hold" integer DEFAULT 0 NOT NULL,
  "skipped" integer DEFAULT 0 NOT NULL,
  "failure_code" varchar,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "retention_audit_events" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_type" varchar NOT NULL,
  "target_type" varchar NOT NULL,
  "target_id" varchar,
  "actor_id" varchar NOT NULL,
  "run_id" varchar,
  "dry_run" boolean DEFAULT false NOT NULL,
  "details" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_retention_runs_created_at" ON "retention_runs" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_retention_audit_events_created_at" ON "retention_audit_events" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_retention_audit_events_target" ON "retention_audit_events" USING btree ("target_type", "target_id");