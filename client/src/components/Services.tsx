import { Bot, Cpu, Database, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { title: "AI Opportunity & Data Readiness Sprint", description: "A fixed-price assessment of a priority AI or automation opportunity. It tests whether the data, workflow, and operating conditions are ready, then provides a fixed implementation plan before a larger build is considered.", outputs: "Outputs: data-quality and availability scorecard; agreed KPI, target-definition, and labelling rules; baseline opportunity analysis; prioritised implementation roadmap; fixed-scope implementation proposal.", href: "/services/ai-opportunity-data-readiness-sprint", icon: Lightbulb },
  { title: "Customer Intelligence and Retention AI", description: "For CRM, retention and data leaders, Traviz helps turn customer and behavioural data into a clear operational decision: what to predict, when it matters, how it should be evaluated and how teams can use it responsibly.", outputs: "Move from retrospective reporting to earlier, more useful decisions.", icon: Cpu },
  { title: "Workflow Automation and Agentic Operations", description: "Traviz identifies repetitive, decision-heavy workflows where automation can improve speed, consistency and visibility—then defines the process, controls and implementation path needed to make it work in practice.", outputs: "Remove operational friction without automating the wrong process.", icon: Bot },
  { title: "AI and Data Implementation Planning", description: "Traviz brings business decision design, data requirements, evaluation thinking and implementation planning together so product, data and operational teams can move forward with fewer surprises.", outputs: "Bridge the gap between a promising use case and a deliverable technical plan.", icon: Database },
];

export default function Services() {
  return (
    <div id="services" className="bg-cool-gray py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center"><h2 className="mb-4 text-4xl font-bold text-charcoal">How Traviz works</h2><p className="mx-auto max-w-3xl text-lg text-muted-blue">Practical AI decisions, validated use cases and implementation plans for digital businesses.</p></div>
        <div className="grid gap-8 md:grid-cols-2">
          {services.map(({ title, description, outputs, href, icon: Icon }) => <Card key={title} className="bg-white shadow-lg"><CardContent className="p-8"><div className="mb-5 flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-lg bg-logo-purple"><Icon className="h-6 w-6 text-white" /></div><h3 className="text-2xl font-bold text-charcoal">{title}</h3></div><p className="mb-5 leading-relaxed text-muted-blue">{description}</p><p className="font-semibold leading-relaxed text-charcoal">{outputs}</p>{href && <a href={href} className="mt-6 inline-flex font-semibold text-logo-purple transition-opacity hover:opacity-80">View sprint details</a>}</CardContent></Card>)}
        </div>
      </div>
    </div>
  );
}
