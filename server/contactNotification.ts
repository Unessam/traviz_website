// Postmark notification abstraction for contact form submissions
// Never logs form content, email addresses, provider errors, or secrets

export interface PostmarkClient {
  sendEmail(message: {
    From: string;
    To: string;
    Subject: string;
    HtmlBody: string;
    TextBody: string;
  }): Promise<void>;
}

export interface NotificationResult {
  success: boolean;
  configured: boolean;
}

export interface ContactNotifier {
  notify(submission: {
    name: string;
    email: string;
    company?: string;
    message: string;
  }): Promise<NotificationResult>;
}

export interface ContactNotifierConfig {
  postmarkApiKey?: string;
  fromEmail?: string;
  toEmail?: string;
}

function createNotifier(
  config: ContactNotifierConfig,
  client: PostmarkClient | null = null
): ContactNotifier {
  const isConfigured = !!(
    config.postmarkApiKey &&
    config.fromEmail &&
    config.toEmail
  );

  return {
    async notify(submission): Promise<NotificationResult> {
      if (!isConfigured) {
        return { success: false, configured: false };
      }

      if (!client) {
        return { success: false, configured: true };
      }

      try {
        await client.sendEmail({
          From: config.fromEmail!,
          To: config.toEmail!,
          Subject: `New Contact Form Submission from ${submission.name}`,
          HtmlBody: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${submission.name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            ${submission.company ? `<p><strong>Company:</strong> ${submission.company}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${submission.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>Submitted at: ${new Date().toISOString()}</em></p>
          `,
          TextBody: `
            New Contact Form Submission

            Name: ${submission.name}
            Email: ${submission.email}
            ${submission.company ? `Company: ${submission.company}` : ''}

            Message:
            ${submission.message}

            Submitted at: ${new Date().toISOString()}
          `
        });
        return { success: true, configured: true };
      } catch (error) {
        // Never log provider errors or secrets
        return { success: false, configured: true };
      }
    }
  };
}

export function createContactNotifier(
  env: Record<string, string | undefined> = process.env,
  client: PostmarkClient | null = null
): ContactNotifier {
  const config: ContactNotifierConfig = {
    postmarkApiKey: env.POSTMARK_API_KEY,
    fromEmail: env.POSTMARK_FROM_EMAIL || "noreply@traviz.co",
    toEmail: env.POSTMARK_TO_EMAIL || "info@traviz.co",
  };

  return createNotifier(config, client);
}
