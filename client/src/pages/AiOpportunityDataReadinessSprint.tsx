import { useEffect } from "react";
import { Check, Clock, CreditCard, Laptop, PoundSterling } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const commercialTerms = [
  { label: "Price", value: "£4,500 excluding VAT", icon: PoundSterling },
  { label: "Schedule", value: "Ten business days over two calendar weeks", icon: Clock },
  { label: "Delivery", value: "Remote", icon: Laptop },
  { label: "Payment", value: "50% on booking; 50% on delivery", icon: CreditCard },
];

const deliverables = [
  "Data-quality and availability scorecard.",
  "Agreed KPI, target-definition, and labelling rules.",
  "Baseline opportunity analysis.",
  "Prioritised implementation roadmap.",
  "Fixed-scope implementation proposal.",
];

const exclusions = [
  "Implementation or deployment.",
  "Production changes.",
  "Ongoing monitoring.",
  "24/7 support.",
  "Data remediation.",
  "Work outside the five deliverables.",
];

const clientResponsibilities = [
  "Provide the agreed read-only access or representative extract.",
  "Make the business owner and data owner available for the KPI and target-definition work.",
  "Confirm access, environment, and security conditions.",
  "Decide whether to address data problems, access delays, or other prerequisites that fall outside the sprint scope.",
];

export default function AiOpportunityDataReadinessSprint() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "AI Opportunity & Data Readiness Sprint | Traviz";

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute(
      "content",
      "A fixed-price, remote readiness sprint to assess a priority AI or automation opportunity, test data and workflow readiness, and provide a prioritised implementation plan.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-off-white">
      <Navigation />
      <main className="pt-16">
        <section className="bg-charcoal py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric-teal">
              Fixed-price remote assessment
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
              AI Opportunity &amp; Data Readiness Sprint
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-gray-100">
              The sprint considers a priority business opportunity and tests whether the available data, workflow, and operating conditions are ready for an AI or automation solution. It provides a fixed implementation plan before a larger build is considered.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <section className="mb-16" aria-labelledby="commercial-terms">
            <h2 id="commercial-terms" className="mb-8 text-3xl font-bold text-charcoal">
              Sprint terms
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {commercialTerms.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-cool-gray bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-logo-purple">
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-logo-purple">{label}</p>
                  <p className="text-lg font-semibold leading-relaxed text-charcoal">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 rounded-2xl bg-soft-lilac p-8 sm:p-10" aria-labelledby="implementation-credit">
            <h2 id="implementation-credit" className="mb-4 text-3xl font-bold text-charcoal">
              30-day implementation credit
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-muted-blue">
              The full sprint fee is credited against a fixed-scope implementation if it is signed within 30 days of sprint delivery.
            </p>
            <p className="leading-relaxed text-muted-blue">
              The credit is applied against the later implementation price. It is not a cash refund. There is no approved extension to the 30-day credit period.
            </p>
          </section>

          <section className="mb-16" aria-labelledby="deliverables">
            <h2 id="deliverables" className="mb-4 text-3xl font-bold text-charcoal">
              Five deliverables
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-blue">
              The sprint covers assessment, analysis, and planning for these five deliverables.
            </p>
            <ol className="grid gap-5 sm:grid-cols-2">
              {deliverables.map((deliverable, index) => (
                <li key={deliverable} className="flex gap-4 rounded-xl border border-cool-gray bg-white p-6 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-logo-purple font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="font-semibold leading-relaxed text-charcoal">{deliverable}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16 grid gap-8 lg:grid-cols-2">
            <div aria-labelledby="exclusions">
              <h2 id="exclusions" className="mb-5 text-3xl font-bold text-charcoal">
                Not included
              </h2>
              <ul className="space-y-4 text-lg leading-relaxed text-muted-blue">
                {exclusions.map((exclusion) => (
                  <li key={exclusion} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-logo-purple" aria-hidden="true" />
                    <span>{exclusion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div aria-labelledby="client-responsibilities">
              <h2 id="client-responsibilities" className="mb-5 text-3xl font-bold text-charcoal">
                Client responsibilities
              </h2>
              <ul className="space-y-4 text-lg leading-relaxed text-muted-blue">
                {clientResponsibilities.map((responsibility) => (
                  <li key={responsibility} className="flex gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-logo-purple" aria-hidden="true" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-16 rounded-xl border border-cool-gray bg-white p-8 shadow-sm" aria-labelledby="data-condition">
            <h2 id="data-condition" className="mb-4 text-3xl font-bold text-charcoal">
              Data condition
            </h2>
            <p className="text-lg leading-relaxed text-muted-blue">
              Personal data is excluded unless it is separately justified and approved through the separately approved route.
            </p>
          </section>

          <section className="rounded-2xl bg-charcoal p-8 text-white sm:p-10" aria-labelledby="outcome-boundary">
            <h2 id="outcome-boundary" className="mb-4 text-3xl font-bold">
              Outcome boundary
            </h2>
            <p className="text-lg leading-relaxed text-gray-100">
              The sprint provides an evidence-led readiness assessment and implementation plan. It does not warrant retention, ROI, revenue, or model performance.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
