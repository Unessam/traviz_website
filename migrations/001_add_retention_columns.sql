-- Migration: Add retention and legal hold columns
-- IMPORTANT: This migration must be applied only through the approved deployment process, not ad hoc.
-- This is an additive, idempotent migration using IF NOT EXISTS for safe re-runs.

-- Add columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT,
  ADD COLUMN IF NOT EXISTS access_removed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS retention_action_at TIMESTAMP;

-- Add columns to contact_submissions table
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS legal_hold_reason TEXT;
