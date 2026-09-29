import { useEffect, type ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type TableProps = {
  headers: string[];
  rows: ReactNode[][];
};

function NoticeTable({ headers, rows }: TableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-cool-gray bg-white shadow-sm">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead className="bg-soft-lilac text-charcoal">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-4 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cool-gray">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4 align-top leading-relaxed text-muted-blue">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <section className="mb-14" aria-labelledby={id}>
      <h2 id={id} className="mb-5 text-3xl font-bold text-charcoal">{title}</h2>
      <div className="space-y-5 text-lg leading-relaxed text-muted-blue">{children}</div>
    </section>
  );
}

const bullets = (items: ReactNode[]) => (
  <ul className="list-disc space-y-3 pl-6">
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ul>
);

export default function PrivacyNotice() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Notice | Traviz";

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute("content", "How Traviz Ltd collects, uses, shares, protects and retains personal information.");
  }, []);

  return (
    <div className="min-h-screen bg-off-white">
      <Navigation />
      <main className="pt-16">
        <section className="bg-charcoal py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric-teal">Version 1.5</p>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">Privacy Notice</h1>
            <p className="text-lg leading-relaxed text-gray-100">Effective date: 30 September 2026</p>
          </div>
        </section>

        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Section title="Who we are">
            <p>Traviz Ltd is the controller for the personal information described in this notice, where Traviz determines the purposes and means of processing. Where Traviz processes personal information solely on a client&apos;s documented instructions as its processor, that client remains responsible for the relevant controller privacy information.</p>
            <div className="rounded-xl border border-cool-gray bg-white p-6 shadow-sm">
              <dl className="grid gap-4 sm:grid-cols-[minmax(0,12rem)_1fr]">
                <dt className="font-semibold text-charcoal">Company name</dt><dd>Traviz Ltd</dd>
                <dt className="font-semibold text-charcoal">Registered address</dt><dd>45 Galloway Drive, Manchester, England, M12 5QQ</dd>
                <dt className="font-semibold text-charcoal">Company registration number</dt><dd>15182618</dd>
                <dt className="font-semibold text-charcoal">Email</dt><dd><a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a></dd>
                <dt className="font-semibold text-charcoal">Website</dt><dd><a className="text-logo-purple underline" href="https://traviz.co/">https://traviz.co/</a></dd>
                <dt className="font-semibold text-charcoal">Data protection contact</dt><dd><a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a></dd>
              </dl>
            </div>
          </Section>

          <Section title="What this notice covers">
            <p>This privacy notice explains how Traviz Ltd collects, uses, and protects personal information when you:</p>
            {bullets([
              "Visit our website;",
              "Submit our contact form;",
              "Contact us via email;",
              "Are a business contact whom we identify and contact for business-to-business (B2B) outreach; or",
              "Are a business contact whose professional details we obtain from a business-contact data provider so that we can send you a small number of business-to-business emails about our services.",
            ])}
            <p>Traviz provides services primarily on a B2B basis. This notice applies to individuals whose personal information Traviz processes as controller through its website, contact form and B2B outreach activity described below. It does not replace a client&apos;s privacy information where Traviz acts solely as that client&apos;s processor.</p>
          </Section>

          <Section title="Personal information we collect">
            <h3 className="text-2xl font-semibold text-charcoal">From our website and contact form</h3>
            <p>We collect the following personal information through our contact form:</p>
            <NoticeTable
              headers={["Category", "Information collected", "Purpose"]}
              rows={[
                [<strong className="text-charcoal">Contact details</strong>, "Name, email address, company (optional)", "To respond to your enquiry"],
                [<strong className="text-charcoal">Message content</strong>, "Your message", "To respond to your enquiry"],
              ]}
            />
            <h3 className="text-2xl font-semibold text-charcoal">For business-to-business outreach</h3>
            <p>Where we identify organisations that may benefit from our services, we hold a limited set of business-contact information about one relevant individual in each organisation:</p>
            <NoticeTable
              headers={["Category", "Information collected", "Purpose"]}
              rows={[
                [<strong className="text-charcoal">Business-contact details</strong>, "Your name, job title, employer, work email address, the address of your public business profile on a professional network, and the provider's identifier and email-verification status", "To identify one relevant contact at an organisation and to send and manage up to three business emails about our services"],
                [<strong className="text-charcoal">Outreach records</strong>, "Which emails we sent and when, whether they were delivered, whether you replied, and any request not to be contacted", "To run our outreach, respect your wishes and show that we followed the rules"],
              ]}
            />
            <p>We do not collect your personal email address, home address or telephone number for this purpose, and we do not use special category information.</p>
            <h3 className="text-2xl font-semibold text-charcoal">Technical data</h3>
            <p>When you visit our website, our hosting provider processes technical data such as your IP address and request information in order to deliver and secure the website. We rely on our legitimate interests in providing and protecting our website for this processing.</p>
            <p><strong className="text-charcoal">We do not typically collect:</strong></p>
            {bullets([
              "Special category data (health, political opinions, religious beliefs, etc.);",
              "Criminal records;",
              "Biometric data; or",
              "Information about children.",
            ])}
            <p>If exceptional processing of special-category or criminal-offence data is considered, Traviz will first identify the applicable Article 6 lawful basis and, where relevant, Article 9, Article 10, and Schedule 1 conditions, provide any required additional information, and obtain the required approvals. Explicit consent is only one possible condition and is not assumed.</p>
          </Section>

          <Section title="How we collect your information">
            <p>We collect personal information:</p>
            {bullets([
              <><strong className="text-charcoal">Directly from you</strong> when you submit our contact form or contact us via email; and</>,
              <><strong className="text-charcoal">From other sources</strong> — from a business-contact data provider and from public company information, for the B2B outreach described below.</>,
            ])}
            <h3 className="text-2xl font-semibold text-charcoal">Information we obtain from other sources</h3>
            <p>For B2B outreach, we obtain limited business-contact information from a business-contact data provider and from official and publicly available business sources, for example company websites and official business registers. Where we obtain your information from a source other than you, we give you this privacy information at the latest in our first email to you, and in any event within one month.</p>
            <div className="rounded-2xl border border-logo-purple/20 bg-soft-lilac p-7 sm:p-9">
              <h3 className="mb-5 text-2xl font-semibold text-charcoal">How we find and contact business prospects</h3>
              <div className="space-y-5">
                <p>We obtain limited professional information about people who work for organisations that may benefit from our services from Apollo.io, a business-to-business data provider operated by ZenLeads, Inc. in the United States. Apollo says it obtains business-contact information from publicly accessible websites, professional directories, public regulatory and government sources, and vetted third-party data providers. If you want to know where your details came from, ask us and we will tell you what we know.</p>
                <p>We use limited automated filtering of company and professional-role information in the provider&apos;s database to choose one relevant person at each organisation. We look at a short list of matching roles only at an organisation we have already decided to contact, and we keep details only for the person we contact. This is usually the person responsible for data, technology or operations, or a founder at a smaller firm. This choice has no legal or similarly significant effect on you. We contact only people based in the United Kingdom through this programme, and we email only people at limited companies, public limited companies and limited liability partnerships. We check each organisation&apos;s legal form before contacting anyone there; we do not email sole traders or partnerships that are not limited liability partnerships.</p>
                <p>We obtain your work email address only when an email to you is ready, and we send our first email promptly, normally within two working days. Every email tells you who we are, where we obtained your details and how to ask us to stop. We send at most three emails: a first email and up to two follow-ups. We stop as soon as you reply.</p>
                <p>An artificial intelligence service helps us research organisations and draft our emails. We give it information about your organisation only, never your name, job title, email address or profile, and we add your first name to the email in our own systems. While researching, it reads public web pages about the organisation, which can mention people; we instruct it not to use or keep personal details from those pages.</p>
                <p>We rely on our legitimate interests in developing our business by telling relevant organisations about services that may help them. We have a written assessment of this interest and its effect on you; you can ask us for a summary.</p>
                <p><strong className="text-charcoal">Your right to object.</strong> You can object at any time to our use of your information for direct marketing. If you do, we stop at once. Reply &ldquo;stop&rdquo; to any of our emails or use the details in &ldquo;Contact us&rdquo;. We keep the minimum information needed to respect your objection, normally your email address in a protected form and the date, including across any pause, closure or later restart of our marketing. We remove or change that record only if you withdraw your objection or later give valid permission for the relevant marketing.</p>
              </div>
            </div>
          </Section>

          <Section title="Lawful bases for processing">
            <p>We rely on the following lawful bases under the UK GDPR for processing your personal information:</p>
            <NoticeTable
              headers={["Purpose", "Lawful basis", "Explanation"]}
              rows={[
                [<strong className="text-charcoal">Responding to enquiries</strong>, "Legitimate interests (Article 6(1)(f))", "We process your contact form submission to respond to your enquiry, which is a legitimate interest in providing our services."],
                [<strong className="text-charcoal">B2B outreach and relationship management</strong>, "Legitimate interests (Article 6(1)(f))", "We process limited business-contact information to identify and contact organisations that may benefit from our services, which is a legitimate interest in developing our business."],
                [<strong className="text-charcoal">Finding and contacting business prospects</strong>, "Legitimate interests (Article 6(1)(f))", "We process a limited set of business-contact information to identify one relevant person at an organisation and send that person a small number of business emails."],
                [<strong className="text-charcoal">Website delivery and security</strong>, "Legitimate interests (Article 6(1)(f))", "We process technical data, such as IP address and request information, through our hosting provider to deliver and protect our website."],
              ]}
            />
            <h3 className="text-2xl font-semibold text-charcoal">Legitimate interests assessment</h3>
            <p>Traviz maintains documented legitimate-interests assessments for processing contact form submissions, website delivery and security, and B2B outreach. You may object to processing based on legitimate interests at any time (see “Your rights”).</p>
            <h3 className="text-2xl font-semibold text-charcoal">Electronic marketing</h3>
            <p>Under the Privacy and Electronic Communications Regulations 2003 (PECR) we send unsolicited B2B marketing emails without prior consent only to people at corporate subscribers in the United Kingdom. We do not send unsolicited electronic marketing to sole traders or other individual subscribers unless consent or another applicable PECR exception applies. Every marketing email identifies us and gives a simple, free way to tell us to stop.</p>
          </Section>

          <Section title="How we use your information">
            <p>We use your personal information for the following purposes:</p>
            {bullets([
              "To respond to your enquiry sent through our contact form or via email;",
              "To identify one relevant business contact at an organisation that may benefit from our services, and to send and manage up to three business emails; and",
              "To record and respect your contact preferences, including any request not to be contacted again.",
            ])}
          </Section>

          <Section title="Who we share your information with">
            <p>We may share your personal information with the following service providers and other recipients:</p>
            <NoticeTable
              headers={["Recipient", "Purpose", "Safeguards"]}
              rows={[
                [<strong className="text-charcoal">Replit</strong>, "Website hosting, database, and file/object storage", "Replit's Data Processing Addendum and the applicable UK transfer mechanism; data hosted in the United States on Google Cloud"],
                [<strong className="text-charcoal">Postmark (operated by ActiveCampaign)</strong>, "Email notifications for contact form submissions", "Postmark's Data Processing Addendum incorporating the UK Addendum where applicable; data hosted in the United States"],
                [<strong className="text-charcoal">Notion (Notion Labs, Inc.)</strong>, "Business-contact records for B2B outreach (our internal CRM)", "UK Extension to the EU-US Data Privacy Framework / UK adequacy while certification applies, plus Notion's Data Processing Addendum; data hosted in the United States by default"],
                [<strong className="text-charcoal">Apollo.io (ZenLeads, Inc.)</strong>, "Supplies business-contact information, holds our prospect records, and sends and records our outreach emails. Apollo is an independent controller of its own database and acts as our processor for the records we keep and the emails we send. Apollo's privacy policy says it may use information held in its service to maintain its own database.", "Apollo's data processing addendum; data held in the United States; Apollo participates in the UK Extension to the EU-US Data Privacy Framework, which UK law recognises as giving adequate protection"],
                [<strong className="text-charcoal">Google (Google LLC)</strong>, "Our business email service, which sends our emails and holds any reply from you", "Google acts as our processor under its data processing terms; data may be processed in the United States; Google LLC participates in the UK Extension to the EU-US Data Privacy Framework"],
              ]}
            />
            <p>These providers may process personal data in the United States. See “International data transfers” below for the safeguards we rely on.</p>
            <p><strong className="text-charcoal">We do not:</strong></p>
            {bullets([
              "Sell your personal information to third parties; or",
              "Use your personal information for purposes unrelated to those described in this notice.",
            ])}
          </Section>

          <Section title="International data transfers">
            <p>Personal information may be processed in the United States by some of our service providers and other recipients. Where a recipient participates in a UK adequacy arrangement, including the UK Extension to the EU-US Data Privacy Framework, we rely on the applicable UK adequacy regulations. Where adequacy does not apply, we use an appropriate safeguard such as the UK International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual Clauses and complete any required data protection test. You may contact us for further information about the safeguards applying to your personal information.</p>
          </Section>

          <Section title="How long we keep your information">
            <p>We retain personal information for the following periods:</p>
            <NoticeTable
              headers={["Category", "Retention period"]}
              rows={[
                [<strong className="text-charcoal">Contact form submissions</strong>, "Deleted after 12 months where no client relationship begins"],
                [<strong className="text-charcoal">Prospect records in Apollo</strong>, "Up to 12 months after our last email to you, then deleted, unless you become a client or ask us to delete them sooner"],
                [<strong className="text-charcoal">People we choose not to contact</strong>, "Deleted from our working files the same day"],
                [<strong className="text-charcoal">Marketing suppression record</strong>, "As long as needed to respect your objection, including across any pause, closure or later restart of our marketing; removed or changed only if you withdraw your objection or later give valid permission"],
              ]}
            />
            <p>We will securely delete your information when it is no longer needed for the purposes for which it was collected, unless we are required by law to retain it.</p>
          </Section>

          <Section title="Cookies">
            <p>Our website uses the following cookies:</p>
            {bullets([
              <><strong className="text-charcoal">GAESA</strong> — a hosting/load-balancing cookie used to route requests consistently through our hosting infrastructure (retained for approximately 30 days). It is treated as strictly necessary for delivery of the website and therefore does not require consent.</>,
            ])}
            <p>Functional session and sidebar cookies apply only to logged-in admin users. We do not use analytics, advertising, or tracking cookies. Because only strictly-necessary cookies are used for public visitors, no cookie-consent banner is required; we provide the information above as good practice.</p>
          </Section>

          <Section title="Your rights">
            <p>Under the UK GDPR, you have the following rights in relation to your personal information:</p>
            <NoticeTable
              headers={["Right", "What it means", "How to exercise it"]}
              rows={[
                [<strong className="text-charcoal">Right of access</strong>, "You can request a copy of the personal information we hold about you.", "Email info@traviz.co with “Subject Access Request” in the subject line."],
                [<strong className="text-charcoal">Right to rectification</strong>, "You can ask us to correct inaccurate or incomplete information.", "Email info@traviz.co with details of the correction required."],
                [<strong className="text-charcoal">Right to erasure</strong>, "You can ask us to delete your information in certain circumstances.", "Email info@traviz.co; we will assess your request and respond within one month."],
                [<strong className="text-charcoal">Right to restrict processing</strong>, "You can ask us to limit how we use your information while a dispute is resolved.", "Email info@traviz.co with details of your request."],
                [<strong className="text-charcoal">Right to data portability</strong>, "You can ask us to provide your information in a structured, machine-readable format.", "Email info@traviz.co; this right applies where processing is based on consent or contract and is carried out by automated means."],
                [<strong className="text-charcoal">Right to object to legitimate interests</strong>, "You can object to processing based on legitimate interests.", "Email info@traviz.co; Traviz will assess the objection and stop unless it has compelling legitimate grounds."],
                [<strong className="text-charcoal">Right to object to direct marketing</strong>, "You can object to direct marketing at any time, and we will stop.", "Email info@traviz.co, or use the opt-out in any marketing message."],
                [<strong className="text-charcoal">Withdrawal of consent</strong>, "Where Traviz relies on consent, you may withdraw it at any time.", "Email info@traviz.co; withdrawal does not affect processing already carried out before it was withdrawn."],
              ]}
            />
            <p>We will respond to your request within one month, unless your request is complex, in which case we may extend this by a further two months. We will inform you of any extension.</p>
          </Section>

          <Section title="Changes to this notice">
            <p>We may update this privacy notice from time to time to reflect changes in our practices, legal requirements, or business activities. We will publish the updated notice on our website and, where practicable, notify significant changes to existing contacts.</p>
          </Section>

          <Section title="Your right to complain">
            <p>If you are unhappy with how we handle your personal information, you may contact us at <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>. We will acknowledge your complaint within 30 days and investigate and respond without undue delay.</p>
            <p>You also have the right to complain to the UK data-protection regulator. Its current contact and complaint details are on its official website. We encourage you to contact us first where appropriate so we can address your concerns directly.</p>
          </Section>

          <Section title="No automated decision-making">
            <p>Traviz does not currently make decisions based solely on automated processing, including profiling, that produce legal or similarly significant effects on individuals. If this changes, Traviz will update this notice and provide the safeguards required by applicable law.</p>
          </Section>

          <Section title="Contact us">
            <div className="rounded-xl border border-cool-gray bg-white p-6 shadow-sm">
              <p>If you have any questions about this privacy notice or how we handle your personal information, please contact us:</p>
              <p><strong className="text-charcoal">Email:</strong> <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a><br /><strong className="text-charcoal">Address:</strong> 45 Galloway Drive, Manchester, England, M12 5QQ<br /><strong className="text-charcoal">Website:</strong> <a className="text-logo-purple underline" href="https://traviz.co/">https://traviz.co/</a></p>
            </div>
          </Section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
