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
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric-teal">Version 1.6</p>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">Privacy Notice</h1>
            <p className="text-lg leading-relaxed text-gray-100">Effective date: 7 October 2026</p>
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
              "Are a business contact whose professional details we obtain from a business-contact data provider so that we can send you business-to-business emails about our services or a possible business partnership.",
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
                [<strong className="text-charcoal">Business-contact details</strong>, "Your name, job title or role, employer, work email address, country, and the provider's identifier and email-verification status where available", "To identify one relevant contact at an organisation and to send and manage customer-outbound emails or, for the UK partner pipeline, up to four partnership emails"],
                [<strong className="text-charcoal">Outreach and partner-pipeline records</strong>, "Which emails we sent and when, whether they were delivered, whether you replied, any request not to be contacted, and the minimum evidence needed to check location, corporate-subscriber status and suppression", "To run our outreach, respect your wishes and show that we followed the rules"],
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
            <p>For B2B outreach and the UK partner pipeline, we obtain limited business-contact information from a business-contact data provider and from official and publicly available business sources, for example company websites and official business registers. Where we obtain your information from a source other than you, we give you this privacy information within the time the UK GDPR requires, including no later than our first email to you where we contact you. If we look you up but do not email you, the separate section “If we look you up but do not email you” explains the information route or limited exception that applies.</p>
            <div className="rounded-2xl border border-logo-purple/20 bg-soft-lilac p-7 sm:p-9">
              <h3 className="mb-5 text-2xl font-semibold text-charcoal">How we find and contact business prospects</h3>
              <div className="space-y-5">
                <p>We obtain limited professional information about people who work for organisations that may benefit from our services from Apollo.io, a business-to-business data provider operated by ZenLeads, Inc. in the United States. Apollo says it obtains business-contact information from publicly accessible websites, professional directories, public regulatory and government sources, and vetted third-party data providers. If you want to know where your details came from, ask us and we will tell you what we know.</p>
                <p>We use limited automated filtering of company and professional-role information in the provider&apos;s database to choose one relevant person at each organisation. We look at a short list of matching roles only at an organisation we have already decided to contact, and we keep details only for the person we contact. This is usually the person responsible for data, technology or operations, or a founder at a smaller firm. This choice has no legal or similarly significant effect on you. We contact only people based in the United Kingdom or the United States through this programme, and we email only people at limited companies, corporations, public limited companies and limited liability partnerships. We check each organisation&apos;s legal form before contacting anyone there; we do not email sole traders or partnerships that are not limited liability partnerships.</p>
                <p>We obtain your work email address only when an email to you is ready, and we send our first email promptly, normally within two working days. Every email tells you who we are, where we obtained your details and how to ask us to stop. We send at most three emails: a first email and up to two follow-ups. We stop as soon as you reply.</p>
                <p>An artificial intelligence service helps us research organisations and draft our emails. We give it information about your organisation only, never your name, job title, email address or profile, and we add your first name to the email in our own systems. While researching, it reads public web pages about the organisation, which can mention people; we instruct it not to use or keep personal details from those pages.</p>
                <p>We rely on our legitimate interests in developing our business by telling relevant organisations about services that may help them. We have a written assessment of this interest and its effect on you; you can ask us for a summary.</p>
                <p><strong className="text-charcoal">Your right to object.</strong> You can object at any time to our use of your information for direct marketing. If you do, we stop at once. Reply &ldquo;stop&rdquo; to any of our emails or use the details in &ldquo;Contact us&rdquo;. We keep the minimum information needed to respect your objection, normally your email address in a protected form and the date, including across any pause, closure or later restart of our marketing. We remove or change that record only if you withdraw your objection or later give valid permission for the relevant marketing.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-logo-purple/20 bg-soft-lilac p-7 sm:p-9">
              <h3 className="mb-5 text-2xl font-semibold text-charcoal">How we find and contact potential partners</h3>
              <div className="space-y-5">
                <p>We may contact a limited number of people at UK technology, consulting, data, software and managed-service businesses about a possible business partnership. This may include referral, subcontracting, white-label delivery or implementation work.</p>
                <p>We use Apollo.io, a business-contact data provider, to search for a company and, only when our message for that company is ready, to look up one relevant business contact. We obtain only the person’s work email address, name, job role, employer and country. Apollo says that it obtains business-contact data from public websites, professional directories, public regulatory and government sources, and vetted third-party data providers. We may also use public information about the company. If you ask, we will tell you what we know about the source of your details.</p>
                <p>We use this information to decide whether the company may be a suitable partner, prepare a draft email and manage any reply, request to stop, or complaint. We do not use special-category information, personal email addresses, home addresses or telephone numbers for this purpose. We do not use the information to make a decision that has a legal or similarly important effect on you.</p>
                <p>Our legal basis is our legitimate interests under Article 6(1)(f) of the UK GDPR. Our interest is to develop Traviz’s business by making relevant, limited B2B partnership approaches. We use a written assessment and safeguards described below. You can ask us for a summary of that assessment.</p>
                <p>We contact only people located in the United Kingdom and only through a work address at a corporate subscriber. A corporate subscriber is normally a company, LLP, Scottish partnership, other legal person or qualifying public body. We do not use this route for sole traders, ordinary partnerships, personal mailboxes, free-mail addresses, or an unknown business type. We send no more than four emails: the first email and up to three follow-ups, normally about 5, 11 and 30 days later. Every email is sent by a person, not automatically. We stop this marketing at once if you reply, ask us to stop or object.</p>
                <p>We keep the contact in a private Traviz review queue before an email is sent. We create a draft in Traviz’s Google Workspace Gmail account for the CEO to review and send. We do not give your name, job role, work email address or other personal data to our AI research or writing tools. Those tools may read public company pages to prepare company-level material only; they are instructed not to use or keep personal details found on those pages.</p>
                <p><strong className="text-charcoal">Your right to object to direct marketing.</strong> You can object at any time. You do not need to give a reason. Reply “stop” to an email or email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>. We will stop using your information for direct marketing. We keep only the minimum record needed to make sure we respect the objection. This may be a protected or hashed work email address, the date and the channel. We use one Traviz-wide suppression list for this partner pipeline and our customer-outbound pipeline.</p>
                <h3 className="text-2xl font-semibold text-charcoal">If we look you up but do not email you</h3>
                <p>If we look up a person but do not email them, we delete their personal details from Traviz-controlled records on the same day. We do not send an information-only email.</p>
                <p>For this limited situation, Traviz may rely on the Article 14(5)(e) exception only where providing the Article 14 information for that person would be impossible or would involve disproportionate effort. We record the reason, the factors considered, the safeguards applied, the public privacy information relied on, and the same-day deletion result for that case. This exception is not automatic and does not apply where those facts are not recorded.</p>
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
                [<strong className="text-charcoal">UK partner-pipeline contact and partnership approach</strong>, "Legitimate interests (Article 6(1)(f))", "We process a limited set of professional contact details to identify one relevant person at a UK corporate subscriber, prepare and send a small number of human-sent partnership emails, and respect objections and requests to stop."],
                [<strong className="text-charcoal">Website delivery and security</strong>, "Legitimate interests (Article 6(1)(f))", "We process technical data, such as IP address and request information, through our hosting provider to deliver and protect our website."],
              ]}
            />
            <h3 className="text-2xl font-semibold text-charcoal">Legitimate interests assessment</h3>
            <p>Traviz maintains documented legitimate-interests assessments for processing contact form submissions, website delivery and security, and B2B outreach. You may object to processing based on legitimate interests at any time (see “Your rights”).</p>
            <h3 className="text-2xl font-semibold text-charcoal">Electronic marketing</h3>
            <p>Under the Privacy and Electronic Communications Regulations 2003 (PECR), Traviz sends unsolicited B2B marketing emails without prior consent only to people using a work address for a UK corporate subscriber. We do not use this route for sole traders, ordinary partnerships, personal mailboxes or an unknown business type. Every marketing email identifies Traviz and gives a simple, free way to tell us to stop. The partner pipeline is UK-only at this time. A future US partner route needs a separate review and notice update before use. For people in the United States contacted through another Traviz programme, we also follow the CAN-SPAM Act: our emails are labelled as advertisements, include our postal address, and we stop within 10 business days of a request at the latest (in practice at once).</p>
          </Section>

          <Section title="How we use your information">
            <p>We use your personal information for the following purposes:</p>
            {bullets([
              "To respond to your enquiry sent through our contact form or via email;",
              "To identify one relevant business contact at an organisation that may benefit from our services, and to send and manage up to three business emails;",
              "To identify one relevant business contact at a UK organisation that may be a suitable business partner, prepare and manage up to four human-sent partnership emails, and manage replies, objections, requests to stop and complaints; and",
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
                [<strong className="text-charcoal">Notion (Notion Labs, Inc.)</strong>, "Our internal CRM for organisations we research and for business contacts who reply to us or otherwise engage with us. We do not copy records from our Apollo customer-outbound outreach into it automatically. For the partner pipeline, we use a private internal review queue with the minimum contact and review details.", "UK Extension to the EU-US Data Privacy Framework / UK adequacy while certification applies, plus Notion's Data Processing Addendum; data hosted in the United States by default"],
                [<strong className="text-charcoal">Apollo.io (ZenLeads, Inc.)</strong>, "Supplies business-contact information, holds our customer-outbound prospect records, and sends and records our customer-outbound emails. Apollo is an independent controller of its own database and acts as our processor for the records we keep and the emails we send. Apollo's privacy policy says it may use information held in its service to maintain its own database. For the partner pipeline, we use Apollo to search for companies and, once a company message is ready, to enrich one business contact with their work email address, name, role, employer and country.", "Apollo's data processing addendum; data held in the United States; Apollo participates in the UK Extension to the EU-US Data Privacy Framework, which UK law recognises as giving adequate protection"],
                [<strong className="text-charcoal">Google (Google LLC)</strong>, "Our business email service, which sends customer-outbound emails and holds replies. For the partner pipeline, Google Workspace Gmail holds the draft, sends an email only after the CEO presses Send, and holds replies.", "Google acts as our processor under its data processing terms; data may be processed in the United States; Google LLC participates in the UK Extension to the EU-US Data Privacy Framework"],
              ]}
            />
            <p>For the partner pipeline, AI research and writing tools receive company-level public information only. They must not receive the person’s name, role, work email address or other personal data. If this technical boundary changes, Traviz will update this notice before making the change.</p>
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
                [<strong className="text-charcoal">Customer-outbound prospect records in Apollo</strong>, "Up to 12 months after our last email to you, then deleted, unless you become a client or ask us to delete them sooner"],
                [<strong className="text-charcoal">Partner-pipeline records for a person we email</strong>, "Up to 12 months after the last email, then deleted, unless the person replies, becomes a client or asks for earlier deletion"],
                [<strong className="text-charcoal">People looked up but not emailed</strong>, "Deleted from the partner-pipeline review queue, working files and other Traviz-controlled records on the same day; see “If we look you up but do not email you”"],
                [<strong className="text-charcoal">Marketing suppression record</strong>, "As long as needed to respect your objection, including across the partner and customer-outbound pipelines and across any pause, closure or later restart of our marketing; removed or changed only if you withdraw the objection or later give valid permission for the relevant marketing"],
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
                [<strong className="text-charcoal">Right of access</strong>, "You can request a copy of the personal information we hold about you.", <>Email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a> with “Subject Access Request” in the subject line.</>],
                [<strong className="text-charcoal">Right to rectification</strong>, "You can ask us to correct inaccurate or incomplete information.", <>Email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a> with details of the correction required.</>],
                [<strong className="text-charcoal">Right to erasure</strong>, "You can ask us to delete your information in certain circumstances.", <>Email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>; we will assess your request and respond within one month.</>],
                [<strong className="text-charcoal">Right to restrict processing</strong>, "You can ask us to limit how we use your information while a dispute is resolved.", <>Email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a> with details of your request.</>],
                [<strong className="text-charcoal">Right to data portability</strong>, "You can ask us to provide your information in a structured, machine-readable format.", <>Email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>; this right applies where processing is based on consent or contract and is carried out by automated means.</>],
                [<strong className="text-charcoal">Right to object to legitimate interests</strong>, "You can object to processing based on legitimate interests.", <>Email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>; Traviz will assess the objection and stop unless it has compelling legitimate grounds.</>],
                [<strong className="text-charcoal">Right to object to direct marketing</strong>, "You can object to direct marketing at any time. We will stop using your information for direct marketing, including related profiling.", <>Reply “stop” to any marketing email or email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>. You do not have to give a reason.</>],
                [<strong className="text-charcoal">Withdrawal of consent</strong>, "Where Traviz relies on consent, you may withdraw it at any time.", <>Email <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>; withdrawal does not affect processing already carried out before it was withdrawn.</>],
              ]}
            />
            <p>We will respond to your request within one month, unless your request is complex, in which case we may extend this by a further two months. We will inform you of any extension.</p>
          </Section>

          <Section title="Changes to this notice">
            <p>We may update this privacy notice from time to time to reflect changes in our practices, legal requirements, or business activities. We will publish the updated notice on our website and, where practicable, notify significant changes to existing contacts.</p>
          </Section>

          <Section title="Your right to complain">
            <p>If you are unhappy with how we handle your personal information, you can complain to Traviz at <a className="text-logo-purple underline" href="mailto:info@traviz.co">info@traviz.co</a>. We will acknowledge your complaint within 30 days, make appropriate enquiries, keep you informed of progress where appropriate, and tell you the outcome without undue delay.</p>
            <p>You can also complain to the Information Commissioner’s Office (ICO), the UK data-protection regulator. Its contact and complaint details are at <a className="text-logo-purple underline" href="https://ico.org.uk/make-a-complaint/">https://ico.org.uk/make-a-complaint/</a>. You may contact us first if you wish, but you do not have to.</p>
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
