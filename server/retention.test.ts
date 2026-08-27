import assert from "node:assert/strict";
import test from "node:test";
import express, { type Express, type RequestHandler } from "express";
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
import { registerRoutes } from "./routes";

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
  const logs: unknown[] = [];
  const notifier = createContactNotifier({
    env: {},
    logger: { error: (...args) => logs.push(args) },
  });
  const result = await notifier.notify(contact());

  assert.deepEqual(result, { sent: false, status: "not_configured" });
  assert.deepEqual(logs, []);
});

test("partial or invalid Postmark configuration fails safely with fixed diagnostics", async () => {
  const cases = [
    { env: { POSTMARK_API_KEY: "synthetic-key" } },
    {
      env: {
        POSTMARK_API_KEY: "synthetic-key",
        POSTMARK_FROM_EMAIL: "not-an-address",
        POSTMARK_TO_EMAIL: "inbox@example.test",
      },
    },
    {
      env: {
        POSTMARK_API_KEY: "   ",
        POSTMARK_FROM_EMAIL: "noreply@example.test",
        POSTMARK_TO_EMAIL: "inbox@example.test",
      },
    },
  ];

  for (const testCase of cases) {
    const logs: Array<{ message: string; context?: Record<string, unknown> }> = [];
    const notifier = createContactNotifier({
      env: testCase.env,
      logger: {
        error(message, context) {
          logs.push({ message, context });
        },
      },
    });

    assert.deepEqual(
      await notifier.notify(contact()),
      { sent: false, status: "configuration_invalid" },
    );
    assert.deepEqual(logs, [{
      message: "[contact-notification] configuration invalid",
      context: { reason: "configuration_error" },
    }]);
    assert.doesNotMatch(JSON.stringify(logs), /synthetic-key|not-an-address|inbox@example\.test/);
  }
});

test("configured notifications use trimmed approved identities", async () => {
  const messages: Array<Record<string, string>> = [];
  const notifier = createContactNotifier({
    apiKey: " synthetic-key ",
    fromEmail: " noreply@example.test ",
    toEmail: " inbox@example.test ",
    client: {
      async sendEmail(message) {
        messages.push(message);
        return { ErrorCode: 0, Message: "OK" };
      },
    },
  });

  assert.deepEqual(await notifier.notify(contact()), { sent: true, status: "sent" });
  assert.equal(messages.length, 1);
  assert.equal(messages[0].From, "noreply@example.test");
  assert.equal(messages[0].To, "inbox@example.test");
});

async function withContactHttpServer(
  createContactSubmission: (submission: InsertContactSubmission) => Promise<ContactSubmission>,
  run: (
    baseUrl: string,
    logs: Array<{ event: string; context: { category: "storage_error" } }>,
  ) => Promise<void>,
) {
  const logs: Array<{ event: string; context: { category: "storage_error" } }> = [];
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app, {
    setupAuth: async () => {},
    storage: { createContactSubmission } as typeof import("./storage").storage,
    contactNotifier: { notify: async () => ({ sent: true, status: "sent" }) },
    contactLogger: {
      error(event, context) {
        logs.push({ event, context });
      },
    },
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Expected TCP test server");

  try {
    await run(`http://127.0.0.1:${address.port}`, logs);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("contact validation failures return a safe client response without route diagnostics", async () => {
  await withContactHttpServer(
    async () => {
      throw new Error("Storage must not be called");
    },
    async (baseUrl, logs) => {
      const response = await fetch(`${baseUrl}/api/contact?credential=QUERY_SECRET`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "PRIVATE_NAME",
          email: "private-address@example.test",
          company: "PRIVATE_COMPANY",
        }),
      });

      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { message: "Invalid form data" });
      assert.deepEqual(logs, []);
    },
  );
});

test("contact storage failures log only fixed safe diagnostics", async () => {
  const submitted = {
    name: "PRIVATE_NAME",
    email: "private-address@example.test",
    company: "PRIVATE_COMPANY",
    message: "PRIVATE_MESSAGE",
  };
  const forbidden = [
    ...Object.values(submitted),
    "QUERY_SECRET",
    "DATABASE_SECRET",
    "postgres://credential:password@database.example/private",
    "insert into contact_submissions",
  ];

  await withContactHttpServer(
    async () => {
      throw new Error(
        "DATABASE_SECRET postgres://credential:password@database.example/private "
        + "insert into contact_submissions values (private-address@example.test)",
      );
    },
    async (baseUrl, logs) => {
      const response = await fetch(`${baseUrl}/api/contact?credential=QUERY_SECRET`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submitted),
      });

      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), { message: "Unable to submit contact form" });
      assert.deepEqual(logs, [{
        event: "[contact-submission] persistence failed",
        context: { category: "storage_error" },
      }]);

      const serialized = JSON.stringify(logs);
      for (const sensitiveValue of forbidden) {
        assert.doesNotMatch(serialized, new RegExp(sensitiveValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      }
    },
  );
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

const syntheticAuth: (app: Express) => Promise<void> = async (app) => {
  app.use(((req: any, _res, next) => {
    const email = req.header("x-test-user-email");
    const userId = req.header("x-test-user-id");
    req.user = {
      claims: { sub: userId, email },
      expires_at: Math.floor(Date.now() / 1000) + 60,
    };
    req.isAuthenticated = () => Boolean(userId);
    next();
  }) as RequestHandler);
};

async function withRetentionHttpServer(
  run: (baseUrl: string, calls: string[]) => Promise<void>,
) {
  const calls: string[] = [];
  const retentionStore = {
    async getContactSubmissions() {
      calls.push("getContactSubmissions");
      return [];
    },
    async getRetentionTargets() {
      calls.push("getRetentionTargets");
      return { contacts: [], users: [] };
    },
    async getRecentRetentionRuns() {
      calls.push("getRecentRetentionRuns");
      return [];
    },
    async getRecentRetentionAuditEvents() {
      calls.push("getRecentRetentionAuditEvents");
      return [];
    },
    async createRetentionRun(input: any) {
      calls.push("createRetentionRun");
      return {
        id: "synthetic-dry-run",
        ...input,
        candidateFingerprint: input.candidateFingerprint,
        contactEligible: 0,
        usersEligible: 0,
        contactsDeleted: 0,
        usersAnonymized: 0,
        blockedByLegalHold: 0,
        skipped: 0,
        failureCode: null,
        createdAt: referenceTime,
        completedAt: null,
      };
    },
    async updateRetentionRun(_id: string, update: any) {
      calls.push("updateRetentionRun");
      return {
        id: "synthetic-dry-run",
        requestedBy: "allowlisted-user",
        referenceTime,
        dryRun: true,
        candidateFingerprint: update.candidateFingerprint,
        contactEligible: 0,
        usersEligible: 0,
        contactsDeleted: 0,
        usersAnonymized: 0,
        blockedByLegalHold: 0,
        skipped: 0,
        failureCode: null,
        createdAt: referenceTime,
        completedAt: referenceTime,
        ...update,
      };
    },
    async recordRetentionAuditEvent() {
      calls.push("recordRetentionAuditEvent");
    },
  };
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app, {
    setupAuth: syntheticAuth,
    storage: retentionStore as typeof import("./storage").storage,
    contactNotifier: { notify: async () => ({ sent: false, status: "not_configured" }) },
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Expected TCP test server");

  try {
    await run(`http://127.0.0.1:${address.port}`, calls);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("retention routes reject authenticated staff outside the allowlist", async () => {
  const previousIds = process.env.RETENTION_ADMIN_USER_IDS;
  const previousEmails = process.env.RETENTION_ADMIN_EMAILS;
  process.env.RETENTION_ADMIN_USER_IDS = "allowlisted-user";
  process.env.RETENTION_ADMIN_EMAILS = "allowed@example.test";

  try {
    await withRetentionHttpServer(async (baseUrl, calls) => {
      const headers = { "x-test-user-id": "ordinary-staff", "x-test-user-email": "staff@example.test" };
      const requests = [
        fetch(`${baseUrl}/api/admin/contact-submissions`, { headers }),
        fetch(`${baseUrl}/api/admin/contact-submissions/contact-1/read`, { method: "PATCH", headers }),
        fetch(`${baseUrl}/api/admin/retention/preview`, { headers }),
        fetch(`${baseUrl}/api/admin/retention/runs`, { headers }),
        fetch(`${baseUrl}/api/admin/retention/audit-events`, { headers }),
        fetch(`${baseUrl}/api/admin/retention/runs`, {
          method: "POST",
          headers: { ...headers, "content-type": "application/json" },
          body: JSON.stringify({ dryRun: true }),
        }),
        fetch(`${baseUrl}/api/admin/users/user-1/access-removal`, {
          method: "PATCH",
          headers: { ...headers, "content-type": "application/json" },
          body: JSON.stringify({}),
        }),
        fetch(`${baseUrl}/api/admin/users/user-1/legal-hold`, {
          method: "PATCH",
          headers: { ...headers, "content-type": "application/json" },
          body: JSON.stringify({ legalHold: true, reason: "Synthetic hold" }),
        }),
        fetch(`${baseUrl}/api/admin/contact-submissions/contact-1/legal-hold`, {
          method: "PATCH",
          headers: { ...headers, "content-type": "application/json" },
          body: JSON.stringify({ legalHold: true, reason: "Synthetic hold" }),
        }),
      ];
      const responses = await Promise.all(requests);
      assert.deepEqual(responses.map((response) => response.status), responses.map(() => 403));
      assert.deepEqual(calls, []);
    });
  } finally {
    if (previousIds === undefined) delete process.env.RETENTION_ADMIN_USER_IDS;
    else process.env.RETENTION_ADMIN_USER_IDS = previousIds;
    if (previousEmails === undefined) delete process.env.RETENTION_ADMIN_EMAILS;
    else process.env.RETENTION_ADMIN_EMAILS = previousEmails;
  }
});

test("allowlisted staff can read retention data and execute only a dry run", async () => {
  const previousIds = process.env.RETENTION_ADMIN_USER_IDS;
  process.env.RETENTION_ADMIN_USER_IDS = "allowlisted-user";

  try {
    await withRetentionHttpServer(async (baseUrl, calls) => {
      const headers = { "x-test-user-id": "ALLOWLISTED-USER", "x-test-user-email": "staff@example.test" };
      const readResponses = await Promise.all([
        fetch(`${baseUrl}/api/admin/contact-submissions`, { headers }),
        fetch(`${baseUrl}/api/admin/retention/preview`, { headers }),
        fetch(`${baseUrl}/api/admin/retention/runs`, { headers }),
        fetch(`${baseUrl}/api/admin/retention/audit-events`, { headers }),
      ]);
      assert.deepEqual(readResponses.map((response) => response.status), [200, 200, 200, 200]);

      const dryRun = await fetch(`${baseUrl}/api/admin/retention/runs`, {
        method: "POST",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({ dryRun: true, referenceTime: referenceTime.toISOString() }),
      });
      assert.equal(dryRun.status, 200);
      assert.ok(calls.includes("createRetentionRun"));
      assert.ok(calls.includes("recordRetentionAuditEvent"));
    });
  } finally {
    if (previousIds === undefined) delete process.env.RETENTION_ADMIN_USER_IDS;
    else process.env.RETENTION_ADMIN_USER_IDS = previousIds;
  }
});