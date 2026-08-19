import { Link } from "wouter";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CaseStudies() {
  return (
    <div className="bg-cool-gray py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-charcoal">Case study</h2>
        </div>
        <Card className="mx-auto max-w-4xl bg-white shadow-lg">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-logo-purple">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-blue">An anonymised European sportsbook operator</p>
                <h3 className="text-2xl font-bold text-charcoal">From churn ambiguity to a route for earlier retention action</h3>
                <span className="mt-3 inline-flex rounded-full bg-soft-lilac px-3 py-1 text-sm font-semibold text-logo-purple">Churn prediction</span>
              </div>
            </div>
            <div className="space-y-5 text-muted-blue">
              <p><strong className="text-charcoal">Challenge:</strong> Retention decisions relied on retrospective signals and rule-based targeting, while data quality made it difficult to define an earlier operational churn signal.</p>
              <p><strong className="text-charcoal">Approach:</strong> Traviz bridged target definition, behavioural modelling, time-aware evaluation, and a joint technical handover into client-owned scoring and monitoring workflows.</p>
              <p><strong className="text-charcoal">What changed:</strong> The joint team established a shared churn definition, evaluation approach, prediction capability, and ownership model for continued integration.</p>
            </div>
            <Link href="/case-studies/sportsbook-churn-prediction" className="mt-8 inline-flex items-center gap-2 font-semibold text-logo-purple transition-opacity hover:opacity-75">
              Read the case study
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-cool-gray bg-off-white p-8">
          <h3 className="mb-3 text-xl font-bold text-charcoal">More Traviz case studies are in preparation</h3>
          <p className="leading-relaxed text-muted-blue">We are preparing additional real case studies from Traviz work across iGaming, healthcare, aviation, finance and other operationally complex environments.</p>
        </div>
      </div>
    </div>
  );
}
