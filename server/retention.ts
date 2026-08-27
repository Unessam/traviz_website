// Retention eligibility logic - pure functions with no DB/IO
export const CONTACT_RETENTION_MONTHS = 12;
export const OAUTH_ANONYMISE_DAYS = 90;

export interface ContactSubmissionRetentionInput {
  createdAt: Date | null | undefined;
  legalHold: boolean;
}

export interface OAuthUserRetentionInput {
  accessRemovedAt: Date | null | undefined;
  legalHold: boolean;
  retentionActionAt: Date | null | undefined;
}

/**
 * Determines if a contact submission is eligible for deletion.
 * Eligible only if:
 * - Not on legal hold
 * - createdAt is present
 * - createdAt is older than 12 months from referenceTime
 */
export function isContactSubmissionEligibleForDeletion(
  input: ContactSubmissionRetentionInput,
  referenceTime: Date
): boolean {
  if (!(referenceTime instanceof Date) || isNaN(referenceTime.getTime())) {
    throw new Error("referenceTime must be a valid Date");
  }

  if (referenceTime > new Date()) {
    throw new Error("referenceTime cannot be in the future");
  }

  if (input.legalHold) {
    return false;
  }

  if (!input.createdAt) {
    return false;
  }

  const cutoffDate = new Date(referenceTime);
  cutoffDate.setMonth(cutoffDate.getMonth() - CONTACT_RETENTION_MONTHS);

  return input.createdAt <= cutoffDate;
}

/**
 * Determines if an OAuth user is eligible for anonymisation.
 * Eligible only if:
 * - Not on legal hold
 * - accessRemovedAt is present
 * - retentionActionAt is null (not already actioned)
 * - accessRemovedAt is older than 90 days from referenceTime
 */
export function isOAuthUserEligibleForAnonymisation(
  input: OAuthUserRetentionInput,
  referenceTime: Date
): boolean {
  if (!(referenceTime instanceof Date) || isNaN(referenceTime.getTime())) {
    throw new Error("referenceTime must be a valid Date");
  }

  if (referenceTime > new Date()) {
    throw new Error("referenceTime cannot be in the future");
  }

  if (input.legalHold) {
    return false;
  }

  if (!input.accessRemovedAt) {
    return false;
  }

  if (input.retentionActionAt) {
    return false;
  }

  const cutoffDate = new Date(referenceTime);
  cutoffDate.setDate(cutoffDate.getDate() - OAUTH_ANONYMISE_DAYS);

  return input.accessRemovedAt <= cutoffDate;
}
