ALTER TABLE "retention_runs" ADD COLUMN IF NOT EXISTS "candidate_fingerprint" varchar;
--> statement-breakpoint
UPDATE "retention_runs"
SET "candidate_fingerprint" = 'legacy-unreviewable'
WHERE "candidate_fingerprint" IS NULL;
--> statement-breakpoint
ALTER TABLE "retention_runs" ALTER COLUMN "candidate_fingerprint" SET NOT NULL;