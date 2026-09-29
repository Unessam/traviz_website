import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (relativePath: string) =>
  readFile(new URL(relativePath, import.meta.url), "utf8");

test("privacy notice v1.5 describes the Apollo outbound programme (DEC-LOG-118)", async () => {
  const page = await readSource("./PrivacyNotice.tsx");
  const requiredText = [
    "Version 1.5",
    "Effective date: 30 September 2026",
    "How we find and contact business prospects",
    "operated by ZenLeads, Inc. in the United States",
    "public regulatory and government sources, and vetted third-party data providers",
    "limited automated filtering of company and professional-role information",
    "no legal or similarly significant effect",
    "only people based in the United Kingdom or the United States",
    "we also follow the CAN-SPAM Act",
    "We send at most three emails",
    "never your name, job title, email address or profile",
    "we instruct it not to use or keep personal details from those pages",
    "We check each organisation&apos;s legal form before contacting anyone there",
    "including across any pause, closure or later restart of our marketing",
    "Google (Google LLC)",
    "Apollo participates in the UK Extension to the EU-US Data Privacy Framework",
    "Up to 12 months after our last email to you",
    "the UK data-protection regulator",
    "Apollo is an independent controller of its own database and acts as our processor for the records we keep and the emails we send",
    "Google acts as our processor under its data processing terms",
    "limited companies, corporations, public limited companies and limited liability partnerships",
    "We stop as soon as you reply",
    "As long as needed to respect your objection",
    "We give it information about your organisation only",
    "We do not copy records from our Apollo outreach into it automatically",
  ];
  for (const text of requiredText) {
    assert.ok(page.includes(text), `Missing reviewed privacy text: ${text}`);
  }
  for (const removedText of [
    "supplier-evaluation",
    "discovery pilot",
    "Cognition&apos;s Devin service is used only",
    "No outreach is authorised by the pilot",
    "Information Commissioner&apos;s Office",
    "hybrid-pilot",
    "person-level",
    "in-memory",
    "in memory",
    "anonymous aggregate",
    "Business-contact records for B2B outreach (our internal CRM)",
  ]) {
    assert.ok(!page.includes(removedText), `Superseded wording returned: ${removedText}`);
  }
});

test("privacy notice is publicly routed and linked from the footer", async () => {
  const [app, footer] = await Promise.all([
    readSource("../App.tsx"),
    readSource("../components/Footer.tsx"),
  ]);

  assert.ok(app.includes('import PrivacyNotice from "@/pages/PrivacyNotice"'));
  assert.ok(app.includes('<Route path="/privacy" component={PrivacyNotice} />'));
  assert.ok(footer.includes('href="/privacy"'));
  assert.ok(footer.includes("Privacy Notice"));
});
