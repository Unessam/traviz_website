import type {
  ContactFormSubmission,
  ContactSubmission,
  InsertContactSubmission,
} from "@shared/schema";
import type { ContactNotifier } from "./contactNotification";

export interface ContactSubmissionStore {
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
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

  try {
    await notifier.notify(submission);
  } catch {
    logger.error("[contact-notification] notifier boundary failed", {
      reason: "notifier_error",
    });
  }

  return submission;
}