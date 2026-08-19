import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const phases = [
  ["Discover", "Understand the decision, available evidence, data quality, and behavioural patterns."],
  ["Define", "Agree the churn target, labels, evaluation approach, and operational ownership."],
  ["Model", "Engineer behavioural signals, compare approaches, validate over time, and interpret model behaviour."],
  ["Handover", "Document testing and monitoring, support non-production integration, and transfer production ownership."],
];

export default function CaseStudySportsbookChurnPrediction() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "From churn ambiguity to a route for earlier retention action | Traviz";

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute(
      "content",
      "How Traviz helped a European sportsbook operator define an operational churn decision, develop and evaluate a predictive capability, and prepare for client-owned integration.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-off-white">
      <Navigation />
      <main className="pt-16">
        <section className="bg-charcoal py-20 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric-teal">An anonymised European sportsbook operator</p>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">From churn ambiguity to a route for earlier retention action</h1>
            <p className="mb-6 text-lg text-gray-200">Churn prediction</p>
            <p className="text-lg leading-relaxed text-gray-100">Traviz worked with the client&apos;s Product, Data Engineering, CRM/Marketing, and technology teams to turn a broad retention concern into a defined churn decision, a developed and evaluated prediction capability, and a controlled route into client-owned scoring and monitoring workflows.</p>
          </div>
        </section>

        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <section className="mb-14">
            <h2 className="mb-5 text-3xl font-bold text-charcoal">The challenge</h2>
            <div className="space-y-5 text-lg leading-relaxed text-muted-blue">
              <p>The retention team wanted earlier, more operationally useful churn signals. Existing decisions relied on retrospective indicators and rule-based targeting, while relevant player behaviour, transaction patterns, and CRM interactions were difficult to translate into a consistent prediction problem.</p>
              <p>Data quality was the central delivery challenge. Before modelling could support an operational decision, the joint team needed to understand what the available data represented, define churn in a way that was meaningful to the business, and establish an evaluation approach that respected how behaviour changed over time.</p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-5 text-3xl font-bold text-charcoal">Defining the decision before the model</h2>
            <div className="space-y-5 text-lg leading-relaxed text-muted-blue">
              <p>Traviz worked with client stakeholders to define an observable churn target linked to a useful intervention window. The team aligned the target, labels, offline evaluation approach, and operational success measures before treating model development as the answer.</p>
              <p>This created a shared decision framework across Product, Data Engineering, CRM/Marketing, and technology leadership: what the model should predict, when its output could be useful, how it should be evaluated, and who would own each step after handover.</p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-8 text-3xl font-bold text-charcoal">A phased route from discovery to handover</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {phases.map(([title, description], index) => (
                <div key={title} className="rounded-xl border border-cool-gray bg-white p-6 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-logo-purple">{index + 1}. {title}</p>
                  <p className="leading-relaxed text-muted-blue">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-blue">
              <p>Traviz reviewed the available behavioural and transactional evidence, explored data quality and player patterns, and identified limitations that could affect the churn target or modelling approach.</p>
              <p>The joint team established the operational target, labelling logic, evaluation measures, and the intended relationship between a model score and a retention decision.</p>
              <p>Traviz engineered behavioural features, compared baseline and more advanced approaches, used time-aware validation, and analysed model behaviour to support an evidence-led technical choice. The work produced reproducible model artefacts, evaluation materials, and technical documentation for client review and continuation.</p>
              <p>Traviz documented model inputs, outputs, dependencies, testing expectations, monitoring requirements, cadence, limitations, and stability checks. Client Data Engineering retained responsibility for production scoring workflows, CRM retained operational ownership, Product aligned success measures, and Traviz supported technical review during the handover.</p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="mb-5 text-3xl font-bold text-charcoal">Joint delivery, clear ownership</h2>
            <p className="mb-5 text-lg leading-relaxed text-muted-blue">The engagement was designed as joint delivery rather than outsourced production ownership.</p>
            <ul className="mb-5 list-disc space-y-3 pl-6 text-lg leading-relaxed text-muted-blue">
              <li><strong className="text-charcoal">Traviz:</strong> technical discovery, target and evaluation support, feature engineering, modelling, analysis, documentation, testing guidance, and technical review.</li>
              <li><strong className="text-charcoal">Product:</strong> use-case alignment, prioritisation, and success measures.</li>
              <li><strong className="text-charcoal">Data Engineering:</strong> data remediation and client-owned scoring-pipeline implementation.</li>
              <li><strong className="text-charcoal">CRM/Marketing:</strong> operational context and ownership of how approved risk signals would be used.</li>
              <li><strong className="text-charcoal">Technology leadership:</strong> architecture, governance, and technical acceptance.</li>
            </ul>
            <p className="text-lg leading-relaxed text-muted-blue">At handover, client scoring-pipeline work and non-production testing were underway, with monitoring and stability expectations documented. The client retained production, deployment, and operational ownership.</p>
          </section>

          <section className="mb-14">
            <h2 className="mb-5 text-3xl font-bold text-charcoal">What changed</h2>
            <p className="mb-5 text-lg leading-relaxed text-muted-blue">The work established a defined decision system around churn rather than an isolated modelling experiment:</p>
            <ul className="list-disc space-y-3 pl-6 text-lg leading-relaxed text-muted-blue">
              <li>a shared operational churn definition and labelling approach;</li>
              <li>an agreed evaluation framework;</li>
              <li>a developed and evaluated prediction capability;</li>
              <li>reproducible model and evaluation artefacts;</li>
              <li>documented inputs, outputs, dependencies, testing, monitoring, cadence, and limitations; and</li>
              <li>a functional ownership model for continued client-led integration.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-soft-lilac p-8 text-center sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-charcoal">Could your retention team act earlier?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-blue">Contact Traviz to discuss how your data, decision process, and integration constraints could support a practical retention AI initiative.</p>
            <a href="/#contact" className="inline-flex rounded-lg bg-logo-purple px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">Contact Traviz</a>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
