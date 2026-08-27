import type { RetentionRun } from "@shared/schema";
import { createHash } from "node:crypto";
import {
  getContactSubmissionRetentionDecision,
  getOAuthUserRetentionDecision,
  type RetentionAuditContext,
  type RetentionTargetContact,
  type RetentionTargetUser,
} from "./retention";

export interface RetentionPreview {
  referenceTime: Date;
  contacts: {
    total: number;
    eligible: number;
    legalHold: number;
    notDue: number;
    missingTimestamp: number;
  };
  users: {
    total: number;
    eligible: number;
    legalHold: number;
    notDue: number;
    missingTimestamp: number;
    alreadyAnonymized: number;
  };
}

export interface RetentionRunnerStore {
  getRetentionTargets(): Promise<{
    contacts: RetentionTargetContact[];
    users: RetentionTargetUser[];
  }>;
  createRetentionRun(input: {
    requestedBy: string;
    referenceTime: Date;
    dryRun: boolean;
    status: string;
    candidateFingerprint: string;
  }): Promise<RetentionRun>;
  updateRetentionRun(id: string, update: Record<string, unknown>): Promise<RetentionRun | undefined>;
  getRetentionRun(id: string): Promise<RetentionRun | undefined>;
  deleteEligibleContactSubmission(id: string, referenceTime: Date, audit?: RetentionAuditContext): Promise<boolean>;
  anonymizeEligibleUser(id: string, referenceTime: Date, audit?: RetentionAuditContext): Promise<unknown>;
  recordRetentionAuditEvent(input: {
    eventType: "retention_dry_run" | "retention_run_failed";
    targetType: string;
    targetId?: string;
    actorId: string;
    runId?: string;
    dryRun?: boolean;
    details?: Record<string, unknown>;
  }): Promise<void>;
}

function assertReferenceTime(referenceTime: Date): void {
  if (!(referenceTime instanceof Date) || Number.isNaN(referenceTime.getTime())) {
    throw new TypeError("referenceTime must be a valid Date");
  }
  if (referenceTime.getTime() > Date.now()) {
    throw new RangeError("referenceTime cannot be in the future");
  }
}

function countContactStatuses(targets: RetentionTargetContact[], referenceTime: Date) {
  const counts = { total: targets.length, eligible: 0, legalHold: 0, notDue: 0, missingTimestamp: 0 };
  for (const target of targets) {
    const status = getContactSubmissionRetentionDecision(target, referenceTime).status;
    counts[status === "eligible" ? "eligible" : status === "legal_hold" ? "legalHold" : status === "not_due" ? "notDue" : "missingTimestamp"]++;
  }
  return counts;
}

function countUserStatuses(targets: RetentionTargetUser[], referenceTime: Date) {
  const counts = { total: targets.length, eligible: 0, legalHold: 0, notDue: 0, missingTimestamp: 0, alreadyAnonymized: 0 };
  for (const target of targets) {
    if (target.retentionActionAt) {
      counts.alreadyAnonymized++;
      continue;
    }
    const status = getOAuthUserRetentionDecision(target, referenceTime).status;
    counts[status === "eligible" ? "eligible" : status === "legal_hold" ? "legalHold" : status === "not_due" ? "notDue" : "missingTimestamp"]++;
  }
  return counts;
}

export async function getRetentionPreview(
  store: Pick<RetentionRunnerStore, "getRetentionTargets">,
  referenceTime: Date,
): Promise<RetentionPreview> {
  assertReferenceTime(referenceTime);
  const targets = await store.getRetentionTargets();
  return {
    referenceTime,
    contacts: countContactStatuses(targets.contacts, referenceTime),
    users: countUserStatuses(targets.users, referenceTime),
  };
}

export function isRetentionAutomationEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.RETENTION_AUTOMATION_ENABLED === "true";
}

function getCandidateFingerprint(
  contacts: RetentionTargetContact[],
  users: RetentionTargetUser[],
  referenceTime: Date,
): string {
  const contactIds = contacts
    .filter((target) => getContactSubmissionRetentionDecision(target, referenceTime).eligible)
    .map((target) => `contact:${target.id}`);
  const userIds = users
    .filter((target) => !target.retentionActionAt && getOAuthUserRetentionDecision(target, referenceTime).eligible)
    .map((target) => `user:${target.id}`);
  return createHash("sha256").update([...contactIds, ...userIds].sort().join("\n")).digest("hex");
}

export async function executeRetentionRun(
  store: RetentionRunnerStore,
  input: {
    requestedBy: string;
    referenceTime: Date;
    dryRun: boolean;
    previewRunId?: string;
  },
): Promise<RetentionRun> {
  assertReferenceTime(input.referenceTime);
  if (!input.dryRun && !isRetentionAutomationEnabled()) {
    throw new Error("RETENTION_AUTOMATION_DISABLED");
  }

  let reviewedRun: RetentionRun | undefined;
  if (!input.dryRun) {
    if (!input.previewRunId) {
      throw new Error("DRY_RUN_REVIEW_REQUIRED");
    }
    reviewedRun = await store.getRetentionRun(input.previewRunId);
    if (!reviewedRun || !reviewedRun.dryRun || reviewedRun.status !== "completed") {
      throw new Error("INVALID_DRY_RUN_REVIEW");
    }
    if (reviewedRun.referenceTime.getTime() !== input.referenceTime.getTime()) {
      throw new Error("REFERENCE_TIME_MISMATCH");
    }
  }

  const targets = await store.getRetentionTargets();
  const contactCounts = countContactStatuses(targets.contacts, input.referenceTime);
  const userCounts = countUserStatuses(targets.users, input.referenceTime);
  const candidateFingerprint = getCandidateFingerprint(targets.contacts, targets.users, input.referenceTime);
  if (!input.dryRun && reviewedRun?.candidateFingerprint !== candidateFingerprint) {
    throw new Error("DRY_RUN_REVIEW_STALE");
  }
  const run = await store.createRetentionRun({
    requestedBy: input.requestedBy,
    referenceTime: input.referenceTime,
    dryRun: input.dryRun,
    status: "running",
    candidateFingerprint,
  });

  const baseUpdate = {
    contactEligible: contactCounts.eligible,
    usersEligible: userCounts.eligible,
    blockedByLegalHold: contactCounts.legalHold + userCounts.legalHold,
    skipped: userCounts.alreadyAnonymized,
  };

  if (input.dryRun) {
    const completed = await store.updateRetentionRun(run.id, {
      ...baseUpdate,
      status: "completed",
      completedAt: new Date(),
    });
    await store.recordRetentionAuditEvent({
      eventType: "retention_dry_run",
      targetType: "retention_run",
      targetId: run.id,
      actorId: input.requestedBy,
      runId: run.id,
      dryRun: true,
      details: {
        contactEligible: contactCounts.eligible,
        usersEligible: userCounts.eligible,
        blockedByLegalHold: baseUpdate.blockedByLegalHold,
      },
    });
    return completed ?? run;
  }

  let contactsDeleted = 0;
  let usersAnonymized = 0;
  let skipped = baseUpdate.skipped;
  try {
    for (const target of targets.contacts) {
      if (!getContactSubmissionRetentionDecision(target, input.referenceTime).eligible) continue;
      const deleted = await store.deleteEligibleContactSubmission(target.id, input.referenceTime, {
        actorId: input.requestedBy,
        runId: run.id,
      });
      if (deleted) contactsDeleted++;
      else skipped++;
    }
    for (const target of targets.users) {
      if (target.retentionActionAt || !getOAuthUserRetentionDecision(target, input.referenceTime).eligible) continue;
      const anonymized = await store.anonymizeEligibleUser(target.id, input.referenceTime, {
        actorId: input.requestedBy,
        runId: run.id,
      });
      if (anonymized) usersAnonymized++;
      else skipped++;
    }
  } catch {
    await store.updateRetentionRun(run.id, {
      ...baseUpdate,
      contactsDeleted,
      usersAnonymized,
      skipped,
      status: "failed",
      failureCode: "ACTION_FAILED",
      completedAt: new Date(),
    });
    await store.recordRetentionAuditEvent({
      eventType: "retention_run_failed",
      targetType: "retention_run",
      targetId: run.id,
      actorId: input.requestedBy,
      runId: run.id,
      details: { failureCode: "ACTION_FAILED", contactsDeleted, usersAnonymized },
    });
    throw new Error("RETENTION_RUN_FAILED");
  }

  const completed = await store.updateRetentionRun(run.id, {
    ...baseUpdate,
    contactsDeleted,
    usersAnonymized,
    skipped,
    status: "completed",
    completedAt: new Date(),
  });
  return completed ?? run;
}