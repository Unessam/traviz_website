ALTER TABLE "contact_submissions" ADD COLUMN "notification_status" varchar DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "notification_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "notification_last_attempt_at" timestamp;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "notification_failure_code" varchar;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD COLUMN "notification_claim_token" varchar;