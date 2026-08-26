import type { ContactSubmission, User } from "@shared/schema";

export const CONTACT_RETENTION_MONTHS = 12;
export const OAUTH_USER_RETENTION_DAYS = 90;

export type RetentionDecisionStatus =
  | "eligible"
  | "legal_hold"
  | "not_due"
  | "missing_timestamp";

export interface RetentionDecision {
  eligible: boolean;
  status: RetentionDecisionStatus;
  cutoff: Date;
}

function assertValidDate(value: Date, name: string): void {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError(`${name} must be a valid Date`);
  }
}

function subtractMonths(referenceTime: Date, months: number): Date {
  assertValidDate(referenceTime, "referenceTime");

  const year = referenceTime.getUTCFullYear();
  const month = referenceTime.getUTCMonth() - months;
  const day = referenceTime.getUTCDate();
  const lastDayOfTargetMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cutoff = new Date(Date.UTC(
    year,
    month,
    Math.min(day, lastDayOfTargetMonth),
    referenceTime.getUTCHours(),
    referenceTime.getUTCMinutes(),
    referenceTime.getUTCSeconds(),
    referenceTime.getUTCMilliseconds(),
  ));

  return cutoff;
}

function subtractDays(referenceTime: Date, days: number): Date {
  assertValidDate(referenceTime, "referenceTime");
  return new Date(referenceTime.getTime() - days * 24 * 60 * 60 * 1000);
}

export function getContactSubmissionDeletionCutoff(referenceTime: Date): Date {
  return subtractMonths(referenceTime, CONTACT_RETENTION_MONTHS);
}

export function getOAuthUserAnonymisationCutoff(referenceTime: Date): Date {
  return subtractDays(referenceTime, OAUTH_USER_RETENTION_DAYS);
}

export function getOAuthAccessRestorationPatch(): { accessRemovedAt: null } {
  return { accessRemovedAt: null };
}

export function getContactSubmissionRetentionDecision(
  submission: Pick<ContactSubmission, "createdAt" | "legalHold">,
  referenceTime: Date,
): RetentionDecision {
  const cutoff = getContactSubmissionDeletionCutoff(referenceTime);

  if (submission.legalHold) {
    return { eligible: false, status: "legal_hold", cutoff };
  }

  if (!submission.createdAt) {
    return { eligible: false, status: "missing_timestamp", cutoff };
  }

  return {
    eligible: submission.createdAt.getTime() <= cutoff.getTime(),
    status: submission.createdAt.getTime() <= cutoff.getTime() ? "eligible" : "not_due",
    cutoff,
  };
}

export function getOAuthUserRetentionDecision(
  user: Pick<User, "accessRemovedAt" | "legalHold">,
  referenceTime: Date,
): RetentionDecision {
  const cutoff = getOAuthUserAnonymisationCutoff(referenceTime);

  if (user.legalHold) {
    return { eligible: false, status: "legal_hold", cutoff };
  }

  if (!user.accessRemovedAt) {
    return { eligible: false, status: "missing_timestamp", cutoff };
  }

  return {
    eligible: user.accessRemovedAt.getTime() <= cutoff.getTime(),
    status: user.accessRemovedAt.getTime() <= cutoff.getTime() ? "eligible" : "not_due",
    cutoff,
  };
}

export function isContactSubmissionEligibleForDeletion(
  submission: Pick<ContactSubmission, "createdAt" | "legalHold">,
  referenceTime: Date,
): boolean {
  return getContactSubmissionRetentionDecision(submission, referenceTime).eligible;
}

export function isOAuthUserEligibleForAnonymisation(
  user: Pick<User, "accessRemovedAt" | "legalHold">,
  referenceTime: Date,
): boolean {
  return getOAuthUserRetentionDecision(user, referenceTime).eligible;
}