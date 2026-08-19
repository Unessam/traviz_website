import { Eye, Shield, Target } from "lucide-react";

const principles = [
  ["Decision-led", "Start with the customer, operational or workflow decision that needs to improve—not a technology demo."],
  ["Evidence-led", "Clarify the data, evaluation and ownership needed before committing to a larger implementation."],
  ["Practical", "Turn validated opportunities into focused implementation plans that product, data and operational teams can use."],
];

export default function About() {
  const icons = [Target, Eye, Shield];

  return (
    <div className="bg-warm-sand py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center"><h2 className="mb-4 text-4xl font-bold text-charcoal">About Traviz</h2><p className="text-lg leading-relaxed text-muted-blue">Traviz helps mid-market digital businesses turn customer and operational data into practical AI decisions, validated use cases and implementation plans—without requiring them to build a full internal AI team.</p></div>
        <div className="mb-16 grid gap-12 lg:grid-cols-2"><div><h3 className="mb-6 text-3xl font-bold text-charcoal">From opportunity to an implementation decision</h3><p className="text-lg leading-relaxed text-muted-blue">Traviz works with digital businesses that have valuable customer or operational data but need a clear route from an AI opportunity to a practical decision. The work combines business decision design, data requirements, evaluation thinking and implementation planning.</p></div><div className="rounded-2xl bg-white p-8 shadow-lg"><h3 className="mb-4 text-2xl font-bold text-charcoal">Founder-led, clearly attributed experience</h3><p className="leading-relaxed text-muted-blue">Founder experience spans automation, decision support, customer data and applied AI work across iGaming, healthcare, aviation, finance and other operationally complex environments. Client-specific proof is used only with the relevant permission.</p></div></div>
        <div className="grid gap-8 md:grid-cols-3">{principles.map(([title, description], index) => { const Icon = icons[index]; return <div key={title} className="text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-logo-purple"><Icon className="h-8 w-8 text-white" /></div><h3 className="mb-3 text-xl font-bold text-charcoal">{title}</h3><p className="leading-relaxed text-muted-blue">{description}</p></div>; })}</div>
      </div>
    </div>
  );
}
