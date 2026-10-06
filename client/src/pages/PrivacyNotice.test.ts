import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (relativePath: string) =>
  readFile(new URL(relativePath, import.meta.url), "utf8");

test("privacy notice v1.6 describes the Apollo outbound and UK partner programmes (DEC-LOG-118 and DEC-LOG-140)", async () => {
  const page = await readSource("./PrivacyNotice.tsx");
  const requiredText = [
    "Version 1.6",
    "Effective date: 7 October 2026",
    "How we find and contact business prospects",
    "operated by ZenLeads, Inc. in the United States",
    "public regulatory and government sources, and vetted third-party data providers",
    "limited automated filtering of company and professional-role information",
    "no legal or similarly significant effect",
    "only people based in the United Kingdom or the United States",
    "We send at most three emails",
    "never your name, job title, email address or profile",
    "we instruct it not to use or keep personal details from those pages",
    "We check each organisation&apos;s legal form before contacting anyone there",
    "including across any pause, closure or later restart of our marketing",
    "How we find and contact potential partners",
    "We may contact a limited number of people at UK technology, consulting, data, software and managed-service businesses about a possible business partnership.",
    "only when our message for that company is ready, to look up one relevant business contact",
    "We contact only people located in the United Kingdom and only through a work address at a corporate subscriber.",
    "Every email is sent by a person, not automatically.",
    "We use one Traviz-wide suppression list for this partner pipeline and our customer-outbound pipeline.",
    "If we look you up but do not email you",
    "we delete their personal details from Traviz-controlled records on the same day",
    "This exception is not automatic and does not apply where those facts are not recorded.",
    "UK partner-pipeline contact and partnership approach",
    "The partner pipeline is UK-only at this time.",
    "For the partner pipeline, AI research and writing tools receive company-level public information only.",
    "Personal information in the partner pipeline may be processed outside the United Kingdom by Apollo, Notion and Google.",
    "Partner-pipeline records for a person we email",
    "People looked up but not emailed",
    "Partner-pipeline suppression record",
    "including related profiling",
    "https://ico.org.uk/make-a-complaint/",
  ];
  for (const text of requiredText) {
    assert.ok(page.includes(text), `Missing reviewed privacy text: ${text}`);
  }
  for (const removedText of [
    "Version 1.5",
    "Effective date: 30 September 2026",
    "a small number of business-to-business emails about our services.",
    "the address of your public business profile on a professional network",
    "To identify one relevant contact at an organisation and to send and manage up to three business emails about our services",
    "For B2B outreach, we obtain limited business-contact information",
    "Under the Privacy and Electronic Communications Regulations 2003 (PECR) we send unsolicited B2B marketing emails",
    "Apollo participates in the UK Extension to the EU-US Data Privacy Framework",
    "Google acts as our processor under its data processing terms",
    "Where a recipient participates in a UK adequacy arrangement",
    "You can object to direct marketing at any time, and we will stop.",
    "We encourage you to contact us first where appropriate",
    "supplier-evaluation",
    "discovery pilot",
    "Cognition&apos;s Devin service is used only",
    "No outreach is authorised by the pilot",
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
