import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (relativePath: string) =>
  readFile(new URL(relativePath, import.meta.url), "utf8");

const approvedPublicTextFixture = [
  "Version 1.6",
  "Effective date: 7 October 2026",
  "Are a business contact whose professional details we obtain from a business-contact data provider so that we can send you business-to-business emails about our services or a possible business partnership.",
  "Business-contact details",
  "Your name, job title or role, employer, work email address, country, and the provider's identifier and email-verification status where available",
  "To identify one relevant contact at an organisation and to send and manage customer-outbound emails or, for the UK partner pipeline, up to four partnership emails",
  "Outreach and partner-pipeline records",
  "Which emails we sent and when, whether they were delivered, whether you replied, any request not to be contacted, and the minimum evidence needed to check location, corporate-subscriber status and suppression",
  "To run our outreach, respect your wishes and show that we followed the rules",
  "For B2B outreach and the UK partner pipeline, we obtain limited business-contact information from a business-contact data provider and from official and publicly available business sources, for example company websites and official business registers. Where we obtain your information from a source other than you, we give you this privacy information within the time the UK GDPR requires, including no later than our first email to you where we contact you. If we look you up but do not email you, the separate section “If we look you up but do not email you” explains the information route or limited exception that applies.",
  "How we find and contact potential partners",
  "We may contact a limited number of people at UK technology, consulting, data, software and managed-service businesses about a possible business partnership. This may include referral, subcontracting, white-label delivery or implementation work.",
  "We use Apollo.io, a business-contact data provider, to search for a company and, only when our message for that company is ready, to look up one relevant business contact. We obtain only the person’s work email address, name, job role, employer and country. Apollo says that it obtains business-contact data from public websites, professional directories, public regulatory and government sources, and vetted third-party data providers. We may also use public information about the company. If you ask, we will tell you what we know about the source of your details.",
  "We use this information to decide whether the company may be a suitable partner, prepare a draft email and manage any reply, request to stop, or complaint. We do not use special-category information, personal email addresses, home addresses or telephone numbers for this purpose. We do not use the information to make a decision that has a legal or similarly important effect on you.",
  "Our legal basis is our legitimate interests under Article 6(1)(f) of the UK GDPR. Our interest is to develop Traviz’s business by making relevant, limited B2B partnership approaches. We use a written assessment and safeguards described below. You can ask us for a summary of that assessment.",
  "We contact only people located in the United Kingdom and only through a work address at a corporate subscriber. A corporate subscriber is normally a company, LLP, Scottish partnership, other legal person or qualifying public body. We do not use this route for sole traders, ordinary partnerships, personal mailboxes, free-mail addresses, or an unknown business type. We send no more than four emails: the first email and up to three follow-ups, normally about 5, 11 and 30 days later. Every email is sent by a person, not automatically. We stop this marketing at once if you reply, ask us to stop or object.",
  "We keep the contact in a private Traviz review queue before an email is sent. We create a draft in Traviz’s Google Workspace Gmail account for the CEO to review and send. We do not give your name, job role, work email address or other personal data to our AI research or writing tools. Those tools may read public company pages to prepare company-level material only; they are instructed not to use or keep personal details found on those pages.",
  "Your right to object to direct marketing. You can object at any time. You do not need to give a reason. Reply “stop” to an email or email info@traviz.co. We will stop using your information for direct marketing. We keep only the minimum record needed to make sure we respect the objection. This may be a protected or hashed work email address, the date and the channel. We use one Traviz-wide suppression list for this partner pipeline and our customer-outbound pipeline.",
  "If we look you up but do not email you",
  "If we look up a person but do not email them, we delete their personal details from Traviz-controlled records on the same day. We do not send an information-only email.",
  "For this limited situation, Traviz may rely on the Article 14(5)(e) exception only where providing the Article 14 information for that person would be impossible or would involve disproportionate effort. We record the reason, the factors considered, the safeguards applied, the public privacy information relied on, and the same-day deletion result for that case. This exception is not automatic and does not apply where those facts are not recorded.",
  "UK partner-pipeline contact and partnership approach",
  "Legitimate interests (Article 6(1)(f))",
  "We process a limited set of professional contact details to identify one relevant person at a UK corporate subscriber, prepare and send a small number of human-sent partnership emails, and respect objections and requests to stop.",
  "To respond to your enquiry sent through our contact form or via email;",
  "To identify one relevant business contact at an organisation that may benefit from our services, and to send and manage up to three business emails;",
  "To identify one relevant business contact at a UK organisation that may be a suitable business partner, prepare and manage up to four human-sent partnership emails, and manage replies, objections, requests to stop and complaints; and",
  "To record and respect your contact preferences, including any request not to be contacted again.",
  "Under the Privacy and Electronic Communications Regulations 2003 (PECR), Traviz sends unsolicited B2B marketing emails without prior consent only to people using a work address for a UK corporate subscriber. We do not use this route for sole traders, ordinary partnerships, personal mailboxes or an unknown business type. Every marketing email identifies Traviz and gives a simple, free way to tell us to stop. The partner pipeline is UK-only at this time. A future US partner route needs a separate review and notice update before use. For people in the United States contacted through another Traviz programme, we also follow the CAN-SPAM Act: our emails are labelled as advertisements, include our postal address, and we stop within 10 business days of a request at the latest (in practice at once).",
  "Replit",
  "Website hosting, database, and file/object storage",
  "Replit's Data Processing Addendum and the applicable UK transfer mechanism; data hosted in the United States on Google Cloud",
  "Postmark (operated by ActiveCampaign)",
  "Email notifications for contact form submissions",
  "Postmark's Data Processing Addendum incorporating the UK Addendum where applicable; data hosted in the United States",
  "Notion (Notion Labs, Inc.)",
  "Our internal CRM for organisations we research and for business contacts who reply to us or otherwise engage with us. We do not copy records from our Apollo customer-outbound outreach into it automatically. For the partner pipeline, we use a private internal review queue with the minimum contact and review details.",
  "UK Extension to the EU-US Data Privacy Framework / UK adequacy while certification applies, plus Notion's Data Processing Addendum; data hosted in the United States by default",
  "Apollo.io (ZenLeads, Inc.)",
  "Supplies business-contact information, holds our customer-outbound prospect records, and sends and records our customer-outbound emails. Apollo is an independent controller of its own database and acts as our processor for the records we keep and the emails we send. Apollo's privacy policy says it may use information held in its service to maintain its own database. For the partner pipeline, we use Apollo to search for companies and, once a company message is ready, to enrich one business contact with their work email address, name, role, employer and country.",
  "Apollo's data processing addendum; data held in the United States; Apollo participates in the UK Extension to the EU-US Data Privacy Framework, which UK law recognises as giving adequate protection",
  "Google (Google LLC)",
  "Our business email service, which sends customer-outbound emails and holds replies. For the partner pipeline, Google Workspace Gmail holds the draft, sends an email only after the CEO presses Send, and holds replies.",
  "Google acts as our processor under its data processing terms; data may be processed in the United States; Google LLC participates in the UK Extension to the EU-US Data Privacy Framework",
  "For the partner pipeline, AI research and writing tools receive company-level public information only. They must not receive the person’s name, role, work email address or other personal data. If this technical boundary changes, Traviz will update this notice before making the change.",
  "Personal information may be processed in the United States by some of our service providers and other recipients. Where a recipient participates in a UK adequacy arrangement, including the UK Extension to the EU-US Data Privacy Framework, we rely on the applicable UK adequacy regulations. Where adequacy does not apply, we use an appropriate safeguard such as the UK International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual Clauses and complete any required data protection test. You may contact us for further information about the safeguards applying to your personal information.",
  "Contact form submissions",
  "Deleted after 12 months where no client relationship begins",
  "Customer-outbound prospect records in Apollo",
  "Up to 12 months after our last email to you, then deleted, unless you become a client or ask us to delete them sooner",
  "Partner-pipeline records for a person we email",
  "Up to 12 months after the last email, then deleted, unless the person replies, becomes a client or asks for earlier deletion",
  "People looked up but not emailed",
  "Deleted from the partner-pipeline review queue, working files and other Traviz-controlled records on the same day; see “If we look you up but do not email you”",
  "Marketing suppression record",
  "As long as needed to respect your objection, including across the partner and customer-outbound pipelines and across any pause, closure or later restart of our marketing; removed or changed only if you withdraw the objection or later give valid permission for the relevant marketing",
  "Right to object to direct marketing",
  "You can object to direct marketing at any time. We will stop using your information for direct marketing, including related profiling.",
  "Reply “stop” to any marketing email or email info@traviz.co. You do not have to give a reason.",
  "If you are unhappy with how we handle your personal information, you can complain to Traviz at info@traviz.co. We will acknowledge your complaint within 30 days, make appropriate enquiries, keep you informed of progress where appropriate, and tell you the outcome without undue delay.",
  "You can also complain to the Information Commissioner’s Office (ICO), the UK data-protection regulator. Its contact and complaint details are at https://ico.org.uk/make-a-complaint/. You may contact us first if you wish, but you do not have to.",
] as const;

const publicFacingSource = (page: string) =>
  page
    .replace(/<a\b[^>]*>([^<]+)<\/a>/g, "$1")
    .replace(/<strong\b[^>]*>([^<]+)<\/strong>/g, "$1");

const assertInOrder = (source: string, values: readonly string[], label: string) => {
  let previousIndex = -1;
  for (const value of values) {
    const index = source.indexOf(value, previousIndex + 1);
    assert.ok(index > previousIndex, `${label} is missing or out of order: ${value}`);
    previousIndex = index;
  }
};

test("privacy notice v1.6 contains every final reviewed public sentence and cell", async () => {
  const page = await readSource("./PrivacyNotice.tsx");
  const publicText = publicFacingSource(page);

  for (const text of approvedPublicTextFixture) {
    assert.ok(publicText.includes(text), `Missing final reviewed public text: ${text}`);
  }

  for (const nonPublicOrSupersededText of [
    "Editorial note",
    "Editorial release note",
    "Final table rows",
    "Before use, Traviz must verify",
    "complete the required privacy and transfer checks before the change",
    "Personal information in the partner pipeline may be processed outside the United Kingdom by Apollo, Notion and Google.",
    "Partner-pipeline suppression record",
    "People we choose not to contact",
    "Prospect records in Apollo",
    "Version 1.5",
    "Effective date: 30 September 2026",
    "a small number of business-to-business emails about our services.",
    "the address of your public business profile on a professional network",
    "For B2B outreach, we obtain limited business-contact information",
    "Under the Privacy and Electronic Communications Regulations 2003 (PECR) we send unsolicited B2B marketing emails",
    "You can object to direct marketing at any time, and we will stop.",
    "We encourage you to contact us first where appropriate",
  ]) {
    assert.ok(!publicText.includes(nonPublicOrSupersededText), `Non-public or superseded text returned: ${nonPublicOrSupersededText}`);
  }
});

test("final partner headings, bullets, recipient rows and retention rows have the reviewed placement", async () => {
  const page = await readSource("./PrivacyNotice.tsx");

  assertInOrder(page, [
    '<h3 className="mb-5 text-2xl font-semibold text-charcoal">How we find and contact business prospects</h3>',
    '<h3 className="mb-5 text-2xl font-semibold text-charcoal">How we find and contact potential partners</h3>',
    '<h3 className="text-2xl font-semibold text-charcoal">If we look you up but do not email you</h3>',
  ], "Partner headings");
  assert.ok(!page.includes("<h4 className=\"text-xl font-semibold text-charcoal\">If we look you up but do not email you</h4>"));

  const useStart = page.indexOf('<Section title="How we use your information">');
  const useEnd = page.indexOf('<Section title="Who we share your information with">', useStart);
  const useSection = page.slice(useStart, useEnd);
  assertInOrder(useSection, [
    approvedPublicTextFixture[24],
    approvedPublicTextFixture[25],
    approvedPublicTextFixture[26],
    approvedPublicTextFixture[27],
  ], "How we use your information bullets");

  const shareStart = page.indexOf('<Section title="Who we share your information with">');
  const shareEnd = page.indexOf('<Section title="International data transfers">', shareStart);
  const shareSection = page.slice(shareStart, shareEnd);
  assertInOrder(shareSection, [
    ">Replit</strong>",
    ">Postmark (operated by ActiveCampaign)</strong>",
    ">Notion (Notion Labs, Inc.)</strong>",
    ">Apollo.io (ZenLeads, Inc.)</strong>",
    ">Google (Google LLC)</strong>",
  ], "Recipient rows");

  const retentionStart = page.indexOf('<Section title="How long we keep your information">');
  const retentionEnd = page.indexOf('<Section title="Cookies">', retentionStart);
  const retentionSection = page.slice(retentionStart, retentionEnd);
  assertInOrder(retentionSection, [
    ">Contact form submissions</strong>",
    ">Customer-outbound prospect records in Apollo</strong>",
    ">Partner-pipeline records for a person we email</strong>",
    ">People looked up but not emailed</strong>",
    ">Marketing suppression record</strong>",
  ], "Retention rows");
  assert.equal((retentionSection.match(/>Marketing suppression record<\/strong>/g) ?? []).length, 1);
});

test("customer-outbound provider, email and retention text remains in v1.6", async () => {
  const page = publicFacingSource(await readSource("./PrivacyNotice.tsx"));
  for (const customerOutboundText of [
    "To identify one relevant business contact at an organisation that may benefit from our services, and to send and manage up to three business emails;",
    "Our internal CRM for organisations we research and for business contacts who reply to us or otherwise engage with us. We do not copy records from our Apollo customer-outbound outreach into it automatically.",
    "Supplies business-contact information, holds our customer-outbound prospect records, and sends and records our customer-outbound emails.",
    "Our business email service, which sends customer-outbound emails and holds replies.",
    "Customer-outbound prospect records in Apollo",
    "Up to 12 months after our last email to you, then deleted, unless you become a client or ask us to delete them sooner",
    "Apollo participates in the UK Extension to the EU-US Data Privacy Framework",
    "Google acts as our processor under its data processing terms",
  ]) {
    assert.ok(page.includes(customerOutboundText), `Customer-outbound text was removed: ${customerOutboundText}`);
  }
});

test("every info@traviz.co occurrence is a mailto link", async () => {
  const page = await readSource("./PrivacyNotice.tsx");
  const links = page.match(/<a className="text-logo-purple underline" href="mailto:info@traviz\.co">info@traviz\.co<\/a>/g) ?? [];
  const occurrences = page.match(/info@traviz\.co/g) ?? [];

  assert.equal(links.length, 13);
  assert.equal(occurrences.length, links.length * 2);
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
