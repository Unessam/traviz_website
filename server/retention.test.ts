import assert from "node:assert/strict";
import test from "node:test";
import type {
  ContactSubmission,
  InsertContactSubmission,
  User,
} from "@shared/schema";
import { contactFormSubmissionSchema } from "@shared/schema";
import {
  getOAuthAccessRestorationPatch,
  getContactSubmissionRetentionDecision,
  getOAuthUserRetentionDecision,
  isContactSubmissionEligibleForDeletion,
  isOAuthUserEligibleForAnonymisation,
} from "./retention";
import {
  createContactNotifier,
  type ContactNotificationClient,
} from "./contactNotification";
import {
  persistContactSubmissionAndNotify,
  type ContactSubmissionStore,
} from "./contactSubmission";

const referenceTime = new Date("2026-08-26T12:00:00.000Z");

function contact(overrides: Partial<ContactSubmission> = {}): ContactSubmission {
  return {
    id: "contact-1",
    name: "Synthetic Contact",
    email: "synthetic@example.test",
    company: "Synthetic Company",
    message: "Synthetic message",
    isRead: false,
    legalHold: false,
    legalHoldReason: null,
    createdAt: new Date("2025-08-26T12:00:00.000Z"),
    ...overrides,
  };
}

function user(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    email: "synthetic@example.test",
    firstName: "Synthetic",
    lastName: "User",
    profileImageUrl: "https://example.test/profile.png",
    legalHold: false,
    legalHoldReason: null,
    accessRemovedAt: new Date("2026-05-28T12:00:00.000Z"),
    retentionActionAt: null,
    createdAt: new Date("2025-01-01T12:00:00.000Z"),
    updatedAt: new Date("2025-01-01T12:00:00.000Z"),
    ...overrides,
  };
}

test("contact submissions become eligible after twelve months", () => {
  const decision = getContactSubmissionRetentionDecision(contact(), referenceTime);

  assert.equal(decision.eligible, true);
  assert.equal(decision.status, "eligible");
  assert.equal(isContactSubmissionEligibleForDeletion(contact(), referenceTime), true);
});

test("a legal hold blocks an otherwise eligible contact submission", () => {
  const held = contact({
    legalHold: true,
    legalHoldReason: "Synthetic legal review",
  });
  const decision = getContactSubmissionRetentionDecision(held, referenceTime);

  assert.equal(decision.eligible, false);
  assert.equal(decision.status, "legal_hold");
  assert.equal(isContactSubmissionEligibleForDeletion(held, referenceTime), false);
});

test("OAuth users become eligible ninety days after access removal", () => {
  const decision = getOAuthUserRetentionDecision(user(), referenceTime);

  assert.equal(decision.eligible, true);
  assert.equal(decision.status, "eligible");
  assert.equal(isOAuthUserEligibleForAnonymisation(user(), referenceTime), true);
});

test("a legal hold blocks an otherwise eligible OAuth user", () => {
  const held = user({
    legalHold: true,
    legalHoldReason: "Synthetic legal review",
  });
  const decision = getOAuthUserRetentionDecision(held, referenceTime);

  assert.equal(decision.eligible, false);
  assert.equal(decision.status, "legal_hold");
  assert.equal(isOAuthUserEligibleForAnonymisation(held, referenceTime), false);
});

test("restored OAuth access clears a stale removal timestamp", () => {
  const staleUser = user();
  assert.equal(isOAuthUserEligibleForAnonymisation(staleUser, referenceTime), true);

  const restoredUser = {
    ...staleUser,
    ...getOAuthAccessRestorationPatch(),
  };
  const decision = getOAuthUserRetentionDecision(restoredUser, referenceTime);

  assert.equal(decision.eligible, false);
  assert.equal(decision.status, "missing_timestamp");
});

test("the public contact schema rejects legal-hold controls", () => {
  const parsed = contactFormSubmissionSchema.safeParse({
    ...submissionInput(),
    legalHold: true,
    legalHoldReason: "Attempted bypass",
  });

  assert.equal(parsed.success, false);
});

class MemoryContactStore implements ContactSubmissionStore {
  submissions: ContactSubmission[] = [];

  async createContactSubmission(submissionData: InsertContactSubmission): Promise<ContactSubmission> {
    const stored: ContactSubmission = {
      ...submissionData,
      id: `contact-${this.submissions.length + 1}`,
      isRead: false,
      legalHold: false,
      legalHoldReason: null,
      createdAt: referenceTime,
    };
    this.submissions.push(stored);
    return stored;
  }
}

function submissionInput() {
  return {
    name: "Synthetic Contact",
    email: "synthetic@example.test",
    company: "Synthetic Company",
    message: "Synthetic message",
  };
}

test("contact storage completes before a successful notification", async () => {
  const store = new MemoryContactStore();
  const messages: Array<Record<string, string>> = [];
  const client: ContactNotificationClient = {
    async sendEmail(message) {
      assert.equal(store.submissions.length, 1);
      messages.push(message);
    },
  };
  const notifier = createContactNotifier({
    client,
    fromEmail: "noreply@example.test",
    toEmail: "inbox@example.test",
  });

  const stored = await persistContactSubmissionAndNotify(
    submissionInput(),
    store,
    notifier,
  );

  assert.equal(store.submissions.length, 1);
  assert.equal(stored.id, store.submissions[0].id);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].From, "noreply@example.test");
});

test("notification failure preserves the stored contact and logs no sensitive details", async () => {
  const store = new MemoryContactStore();
  const logs: Array<{ message: string; context?: Record<string, unknown> }> = [];
  const client: ContactNotificationClient = {
    async sendEmail() {
      throw new Error("secret provider response synthetic@example.test Synthetic message");
    },
  };
  const notifier = createContactNotifier({
    client,
    fromEmail: "noreply@example.test",
    toEmail: "inbox@example.test",
    logger: {
      error(message, context) {
        logs.push({ message, context });
      },
    },
  });

  const stored = await persistContactSubmissionAndNotify(
    submissionInput(),
    store,
    notifier,
  );

  assert.equal(store.submissions.length, 1);
  assert.equal(stored.email, "synthetic@example.test");
  assert.equal(logs.length, 1);
  const serializedLogs = JSON.stringify(logs);
  assert.match(serializedLogs, /provider_error/);
  assert.doesNotMatch(serializedLogs, /synthetic@example\.test/);
  assert.doesNotMatch(serializedLogs, /Synthetic message/);
});

test("missing Postmark configuration is a safe no-op", async () => {
  const notifier = createContactNotifier({ env: {} });
  const result = await notifier.notify(contact());

  assert.deepEqual(result, { sent: false, status: "not_configured" });
});