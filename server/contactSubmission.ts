import type {
  ContactFormSubmission,
  ContactSubmission,
  InsertContactSubmission,
} from "@shared/schema";
import type { ContactNotifier } from "./contactNotification";
import { randomUUID } from "node:crypto";

export const MAX_CONTACT_NOTIFICATION_ATTEMPTS = 3;
export const CONTACT_NOTIFICATION_CLAIM_LEASE_MS = 5 * 60 * 1000;

export type ContactNotificationFailureCode =
  | "not_configured"
  | "configuration_invalid"
  | "provider_error"
  | "notifier_error";

export interface ContactSubmissionStore {
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  claimContactNotificationAttempt(
    id: string,
    claimToken: string,
    attemptedAt: Date,
    maxAttempts: number,
  ): Promise<ContactSubmission | undefined>;
  completeContactNotificationAttempt(
    id: string,
    claimToken: string,
    result: {
      status: "sent" | "failed";
      failureCode: ContactNotificationFailureCode | null;
    },
  ): Promise<ContactSubmission | undefined>;
}

export interface ContactSubmissionFlowLogger {
  error(message: string, context?: Record<string, unknown>): void;
}

const defaultLogger: ContactSubmissionFlowLogger = {
  error(message, context) {
    console.error(message, context);
  },
};

export async function persistContactSubmissionAndNotify(
  submissionData: ContactFormSubmission,
  store: ContactSubmissionStore,
  notifier: ContactNotifier,
  logger: ContactSubmissionFlowLogger = defaultLogger,
): Promise<ContactSubmission> {
  const submission = await store.createContactSubmission(submissionData);
  return (await attemptContactNotification(submission.id, store, notifier, logger)) ?? submission;
}

export async function attemptContactNotification(
  submissionId: string,
  store: ContactSubmissionStore,
  notifier: ContactNotifier,
  logger: ContactSubmissionFlowLogger = defaultLogger,
): Promise<ContactSubmission | undefined> {
  const claimToken = randomUUID();
  const claimed = await store.claimContactNotificationAttempt(
    submissionId,
    claimToken,
    new Date(),
    MAX_CONTACT_NOTIFICATION_ATTEMPTS,
  );
  if (!claimed) return undefined;

  try {
    const result = await notifier.notify(claimed);
    return await store.completeContactNotificationAttempt(submissionId, claimToken, {
      status: result.sent ? "sent" : "failed",
      failureCode: result.sent
        ? null
        : result.status === "delivery_failed"
          ? "provider_error"
          : result.status,
    });
  } catch {
    logger.error("[contact-notification] notifier boundary failed", {
      reason: "notifier_error",
    });
    return await store.completeContactNotificationAttempt(submissionId, claimToken, {
      status: "failed",
      failureCode: "notifier_error",
    });
  }
}