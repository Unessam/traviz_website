import { Client } from "postmark";
import type { ContactSubmission } from "@shared/schema";

export interface ContactNotificationClient {
  sendEmail(message: {
    From: string;
    To: string;
    Subject: string;
    HtmlBody: string;
    TextBody: string;
  }): Promise<unknown>;
}

export interface ContactNotificationLogger {
  error(message: string, context?: Record<string, unknown>): void;
}

export type ContactNotificationResult =
  | { sent: true; status: "sent" }
  | { sent: false; status: "not_configured" | "delivery_failed" };

export interface ContactNotifier {
  notify(submission: ContactSubmission): Promise<ContactNotificationResult>;
}

export interface ContactNotifierOptions {
  apiKey?: string;
  fromEmail?: string;
  toEmail?: string;
  client?: ContactNotificationClient;
  env?: NodeJS.ProcessEnv;
  logger?: ContactNotificationLogger;
}

const defaultLogger: ContactNotificationLogger = {
  error(message, context) {
    console.error(message, context);
  },
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildNotification(submission: ContactSubmission, fromEmail: string, toEmail: string) {
  const name = escapeHtml(submission.name);
  const email = escapeHtml(submission.email);
  const company = submission.company ? escapeHtml(submission.company) : "";
  const message = escapeHtml(submission.message).replaceAll("\n", "<br>");
  const submittedAt = submission.createdAt?.toISOString() ?? "unknown";

  return {
    From: fromEmail,
    To: toEmail,
    Subject: `New Contact Form Submission from ${submission.name}`,
    HtmlBody: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><em>Submitted at: ${submittedAt}</em></p>
    `,
    TextBody: [
      "New Contact Form Submission",
      "",
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      company ? `Company: ${submission.company}` : "",
      "",
      "Message:",
      submission.message,
      "",
      `Submitted at: ${submittedAt}`,
    ].filter(Boolean).join("\n"),
  };
}

export function createContactNotifier(options: ContactNotifierOptions = {}): ContactNotifier {
  const env = options.env ?? process.env;
  const apiKey = options.apiKey ?? env.POSTMARK_API_KEY;
  const fromEmail = options.fromEmail ?? env.POSTMARK_FROM_EMAIL;
  const toEmail = options.toEmail ?? env.POSTMARK_TO_EMAIL;
  const logger = options.logger ?? defaultLogger;

  if (!fromEmail || !toEmail || (!options.client && !apiKey)) {
    return {
      async notify() {
        return { sent: false, status: "not_configured" };
      },
    };
  }

  const client = options.client ?? new Client(apiKey!);

  return {
    async notify(submission) {
      try {
        await client.sendEmail(buildNotification(submission, fromEmail, toEmail));
        return { sent: true, status: "sent" };
      } catch {
        logger.error("[contact-notification] delivery failed", {
          reason: "provider_error",
        });
        return { sent: false, status: "delivery_failed" };
      }
    },
  };
}