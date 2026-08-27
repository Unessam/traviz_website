import assert from "node:assert/strict";
import test from "node:test";
import type {
  ContactSubmission,
  InsertContactSubmission,
  RetentionRun,
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
import {
  executeRetentionRun,
  getRetentionPreview,
} from "./retentionService";

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

class MemoryRetentionStore {
  contacts: ContactSubmission[];
  users: User[];
  runs = new Map<string, RetentionRun>();
  events: Array<{ eventType: string; runId?: string }> = [];
  private nextRunId = 1;

  constructor(contacts: ContactSubmission[], users: User[]) {
    this.contacts = contacts;
    this.users = users;
  }

  async getRetentionTargets() {
    return {
      contacts: this.contacts.map(({ id, createdAt, legalHold }) => ({ id, createdAt, legalHold })),
      users: this.users.map(({ id, accessRemovedAt, retentionActionAt, legalHold }) => ({
        id,
        accessRemovedAt,
        retentionActionAt,
        legalHold,
      })),
    };
  }

  async createRetentionRun(input: {
    requestedBy: string;
    referenceTime: Date;
    dryRun: boolean;
    status: string;
  }): Promise<RetentionRun> {
    const run: RetentionRun = {
      id: `run-${this.nextRunId++}`,
      ...input,
      candidateFingerprint: input.candidateFingerprint,
      contactEligible: 0,
      usersEligible: 0,
      contactsDeleted: 0,
      usersAnonymized: 0,
      blockedByLegalHold: 0,
      skipped: 0,
      failureCode: null,
      createdAt: input.referenceTime,
      completedAt: null,
    };
    this.runs.set(run.id, run);
    return run;
  }

  async updateRetentionRun(id: string, update: Record<string, unknown>): Promise<RetentionRun | undefined> {
    const run = this.runs.get(id);
    if (!run) return undefined;
    const updated = { ...run, ...update } as RetentionRun;
    this.runs.set(id, updated);
    return updated;
  }

  async getRetentionRun(id: string): Promise<RetentionRun | undefined> {
    return this.runs.get(id);
  }

  async deleteEligibleContactSubmission(id: string): Promise<boolean> {
    const before = this.contacts.length;
    this.contacts = this.contacts.filter((submission) => submission.id !== id);
    return this.contacts.length < before;
  }

  async anonymizeEligibleUser(id: string, referenceTime: Date): Promise<User | undefined> {
    const target = this.users.find((candidate) => candidate.id === id);
    if (!target) return undefined;
    target.email = null;
    target.firstName = null;
    target.lastName = null;
    target.profileImageUrl = null;
    target.retentionActionAt = referenceTime;
    return target;
  }

  async recordRetentionAuditEvent(input: { eventType: string; runId?: string }): Promise<void> {
    this.events.push(input);
  }
}

test("a dry retention run is observable but never mutates eligible records", async () => {
  const store = new MemoryRetentionStore(
    [contact(), contact({ id: "held-contact", legalHold: true })],
    [user(), user({ id: "anonymized", retentionActionAt: referenceTime })],
  );

  const preview = await getRetentionPreview(store, referenceTime);
  const run = await executeRetentionRun(store, {
    requestedBy: "staff-1",
    referenceTime,
    dryRun: true,
  });

  assert.deepEqual(preview.contacts, {
    total: 2,
    eligible: 1,
    legalHold: 1,
    notDue: 0,
    missingTimestamp: 0,
  });
  assert.equal(preview.users.eligible, 1);
  assert.equal(preview.users.alreadyAnonymized, 1);
  assert.equal(run.status, "completed");
  assert.equal(run.contactsDeleted, 0);
  assert.equal(run.usersAnonymized, 0);
  assert.equal(store.contacts.length, 2);
  assert.equal(store.users[0].email, "synthetic@example.test");
  assert.equal(store.events[0].eventType, "retention_dry_run");
});

test("a live retention run requires activation and a matching completed dry run", async () => {
  const store = new MemoryRetentionStore([contact()], [user()]);
  const dryRun = await executeRetentionRun(store, {
    requestedBy: "staff-1",
    referenceTime,
    dryRun: true,
  });
  const previousValue = process.env.RETENTION_AUTOMATION_ENABLED;
  process.env.RETENTION_AUTOMATION_ENABLED = "true";

  try {
    const liveRun = await executeRetentionRun(store, {
      requestedBy: "staff-1",
      referenceTime,
      dryRun: false,
      previewRunId: dryRun.id,
    });

    assert.equal(liveRun.status, "completed");
    assert.equal(liveRun.contactsDeleted, 1);
    assert.equal(liveRun.usersAnonymized, 1);
    assert.equal(store.contacts.length, 0);
    assert.equal(store.users[0].email, null);
  } finally {
    if (previousValue === undefined) delete process.env.RETENTION_AUTOMATION_ENABLED;
    else process.env.RETENTION_AUTOMATION_ENABLED = previousValue;
  }
});

test("a live retention run rejects candidate changes after dry-run review", async () => {
  const store = new MemoryRetentionStore([contact()], []);
  const dryRun = await executeRetentionRun(store, {
    requestedBy: "staff-1",
    referenceTime,
    dryRun: true,
  });
  store.users.push(user());
  const previousValue = process.env.RETENTION_AUTOMATION_ENABLED;
  process.env.RETENTION_AUTOMATION_ENABLED = "true";

  try {
    await assert.rejects(
      () => executeRetentionRun(store, {
        requestedBy: "staff-1",
        referenceTime,
        dryRun: false,
        previewRunId: dryRun.id,
      }),
      /DRY_RUN_REVIEW_STALE/,
    );
    assert.equal(store.contacts.length, 1);
    assert.equal(store.users[0].email, "synthetic@example.test");
  } finally {
    if (previousValue === undefined) delete process.env.RETENTION_AUTOMATION_ENABLED;
    else process.env.RETENTION_AUTOMATION_ENABLED = previousValue;
  }
});

test("a legacy dry run without a candidate snapshot cannot authorize live actions", async () => {
  const store = new MemoryRetentionStore([contact()], [user()]);
  const dryRun = await executeRetentionRun(store, {
    requestedBy: "staff-1",
    referenceTime,
    dryRun: true,
  });
  const legacyRun = store.runs.get(dryRun.id);
  if (!legacyRun) throw new Error("Expected a stored dry run");
  store.runs.set(dryRun.id, { ...legacyRun, candidateFingerprint: "legacy-unreviewable" });
  const previousValue = process.env.RETENTION_AUTOMATION_ENABLED;
  process.env.RETENTION_AUTOMATION_ENABLED = "true";

  try {
    await assert.rejects(
      () => executeRetentionRun(store, {
        requestedBy: "staff-1",
        referenceTime,
        dryRun: false,
        previewRunId: dryRun.id,
      }),
      /DRY_RUN_REVIEW_STALE/,
    );
    assert.equal(store.contacts.length, 1);
    assert.equal(store.users[0].email, "synthetic@example.test");
  } finally {
    if (previousValue === undefined) delete process.env.RETENTION_AUTOMATION_ENABLED;
    else process.env.RETENTION_AUTOMATION_ENABLED = previousValue;
  }
});