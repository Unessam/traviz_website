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
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric-teal">Version 1.4</p>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">Privacy Notice</h1>
            <p className="text-lg leading-relaxed text-gray-100">Effective date: 15 September 2026</p>
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
              "Are a business contact whom we identify and contact for business-to-business (B2B) outreach;",
              "Are included in a limited business-contact supplier-evaluation test; or",
              "Are included in a limited Apollo company-first prospect-discovery pilot.",
            ])}
            <p>Traviz provides services primarily on a B2B basis. This notice applies to individuals whose personal information Traviz processes as controller through its website, contact form, B2B outreach activity, limited supplier-evaluation testing, and the limited Apollo discovery pilot described below. It does not replace a client&apos;s privacy information where Traviz acts solely as that client&apos;s processor.</p>
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
            <p>Where we identify organisations that may benefit from our services, we hold a limited set of business-contact information about relevant individuals in those organisations:</p>
            <NoticeTable
              headers={["Category", "Information collected", "Purpose"]}
              rows={[
                [<strong className="text-charcoal">Business-contact details</strong>, "Name, business role/title, business email address, employer/organisation name, provider-issued identifier and verification status where applicable", "To conduct limited business prospect research, make and manage relevant B2B outreach where separately authorised, and record contact preferences"],
              ]}
            />
            <p>We hold only a limited set of business-contact information. We do not build detailed profiles or buy bulk contact lists. We may use a business-to-business information provider for limited supplier evaluation and the limited company-first discovery pilot described below.</p>
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
              <><strong className="text-charcoal">From other sources</strong> for B2B outreach, limited supplier evaluation and the limited Apollo discovery pilot described below.</>,
            ])}
            <h3 className="text-2xl font-semibold text-charcoal">Information we obtain from other sources</h3>
            <p>For ordinary B2B outreach, we may obtain limited business-contact information from official and publicly available business sources, for example company websites and official business registers. Where we obtain your information from a source other than you, we provide this notice at or before our first contact with you, or within one month at the latest, unless a narrow legal exception applies.</p>
            <p>For the bounded transient supplier-evaluation processing described below, we make this information publicly available rather than retaining contact information and initiating a communication solely to describe a short internal test. For the limited Apollo discovery pilot, person-level results are used only transiently for aggregate evaluation and are not saved by Traviz in Apollo or our CRM. No outreach is authorised by the pilot.</p>
            <div className="rounded-2xl border border-logo-purple/20 bg-soft-lilac p-7 sm:p-9">
              <h3 className="mb-5 text-2xl font-semibold text-charcoal">Business-contact data obtained from third-party providers</h3>
              <div className="space-y-5">
                <p>We may obtain limited professional information about people working for organisations that we consider potential business customers from business-to-business information providers, including Apollo.io (ZenLeads, Inc.). This may include your name, job title, employer, a provider-issued identifier, whether a business email is available and, for limited supplier-evaluation testing, your business email address.</p>
                <p>We use this information on the basis of our legitimate interests in evaluating and improving the accuracy and suitability of the data sources and processes we use for business-to-business prospect research.</p>
                <p>For limited supplier-evaluation tests, we may receive this information only temporarily, compare it in memory and delete the person-level result immediately. We retain only anonymous aggregate results and minimal technical or control records that do not contain the contact information supplied by the provider. Information processed for such a test is not used to contact you, make a decision about you, or add provider-supplied contact information to our CRM.</p>
                <p>The information may come from Apollo.io and its business-contact database. Apollo states that it obtains business-contact information from sources including publicly accessible websites and directories, public or regulatory sources and third-party data providers. Apollo is based in the United States.</p>
                <p>Where necessary for a limited supplier-evaluation test, we may send a provider-issued identifier back to that provider solely to retrieve the corresponding business-contact record. Where this involves a transfer of personal data outside the United Kingdom, we use an applicable lawful transfer mechanism, which may include UK adequacy regulations such as the UK Extension to the EU-US Data Privacy Framework or other appropriate safeguards.</p>
                <p>For one limited Apollo company-first discovery pilot, we may use Apollo&apos;s official MCP connection through Devin to identify organisations that appear to match our business criteria. Cognition&apos;s Devin service is used only for this organisation-level stage. Apollo people-search, people-enrichment and person-level results are technically unavailable to Devin. We use a strict company-field allowlist and exclude sole traders, person-identifying domains and any result containing natural-person information. We verify the organisation, remove existing CRM duplicates, carry out our conflict screen and apply fixed company-ranking rules before requesting personal information.</p>
                <p>For no more than five selected organisations, an isolated local process may obtain up to ten current professional-role candidates, choose one person using fixed role, company-size, seniority and tenure rules, and check that person&apos;s verified work email. Person-level Apollo results do not pass through Devin. We use those results only to count whether Apollo found a suitable role and verified work email, then discard them. We do not create an Apollo contact, write the information to our CRM, contact the person, make any legal or similarly significant decision about them or use the information for automated sending.</p>
                <p>If an Apollo search or enrichment tool unexpectedly saves or retains a contact in the Traviz Apollo workspace, the pilot stops. We delete that Apollo-derived record and downstream copies as soon as reasonably practicable; 30 days is the contractual outer limit unless we document a separate independent lawful basis. Merely suppressing or ceasing active use does not count as deletion. We retain only sanitized control evidence that the unexpected persistence occurred and was removed.</p>
                <p>You have the right to object to processing based on our legitimate interests. You can exercise this and your other data-protection rights using the contact details in the “Contact us” section of this Privacy Notice. Information about your right to complain to the Information Commissioner&apos;s Office is provided in the section dealing with your data-protection rights.</p>
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
                [<strong className="text-charcoal">Business-contact supplier evaluation and limited discovery pilot</strong>, "Legitimate interests (Article 6(1)(f))", "We process limited professional information to test data sources and, for the bounded Apollo pilot, identify and internally review relevant business contacts at screened organisations."],
                [<strong className="text-charcoal">Website delivery and security</strong>, "Legitimate interests (Article 6(1)(f))", "We process technical data, such as IP address and request information, through our hosting provider to deliver and protect our website."],
              ]}
            />
            <h3 className="text-2xl font-semibold text-charcoal">Legitimate interests assessment</h3>
            <p>Traviz maintains documented legitimate-interests assessments for processing contact form submissions, B2B outreach, limited business-contact supplier evaluation and the limited Apollo discovery pilot. You may object to processing based on legitimate interests at any time (see “Your rights”).</p>
            <h3 className="text-2xl font-semibold text-charcoal">Electronic marketing</h3>
            <p>We send unsolicited B2B marketing emails without prior consent only where permitted by the Privacy and Electronic Communications Regulations (PECR), including to corporate subscribers. We do not send unsolicited electronic marketing to sole traders or other individual subscribers unless consent or another applicable PECR exception applies. Every marketing message includes a clear way to opt out, and you can ask us to stop at any time.</p>
          </Section>

          <Section title="How we use your information">
            <p>We use your personal information for the following purposes:</p>
            {bullets([
              "To respond to your enquiry sent through our contact form or via email;",
              "To make and manage relevant B2B outreach where separately authorised, and to record your contact preferences, including any request not to be contacted;",
              "To run limited supplier-evaluation tests as described in this notice; and",
              "To evaluate transiently whether Apollo can identify suitable roles and verified work emails for up to five screened organisations; no person-level result is saved by Traviz and no outreach is authorised by that pilot.",
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
                [<strong className="text-charcoal">Apollo.io (ZenLeads, Inc.)</strong>, "Limited business-contact supplier evaluation and company-first prospect discovery, including transiently returning Apollo's provider-issued identifier to retrieve the matching record; Traviz does not create or save Apollo contacts in this pilot", "An applicable UK transfer mechanism, including the UK Extension to the EU-US Data Privacy Framework while it lawfully applies, or other appropriate safeguards"],
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
                [<strong className="text-charcoal">B2B outreach / business-contact records</strong>, "Reviewed at least every 12 months; inactive prospect records are deleted. Minimal information about people who object or opt out is retained on a suppression list as necessary to ensure they are not contacted again."],
                [<strong className="text-charcoal">Limited supplier-evaluation test</strong>, "Provider-supplied person-level results are deleted immediately after the in-memory comparison. Anonymous aggregate results are reviewed after 24 months. Keyed control evidence is retained for 12 months and sanitised technical failure records for 90 days."],
                [<strong className="text-charcoal">Apollo hybrid-pilot person results</strong>, "Person-level values are handled only in local process memory and deleted immediately after the in-memory comparison and anonymous aggregate counting. Traviz creates no Apollo contact and writes no person-level result to its CRM. Only anonymous aggregate and sanitized control evidence is retained under the applicable internal schedule."],
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
            <p>You also have the right to complain to the UK Information Commissioner&apos;s Office (ICO). Current contact and complaint options are published through the ICO&apos;s official website and complaint process. We encourage you to contact us first where appropriate so we can address your concerns directly.</p>
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
