import { Button } from "@/components/ui/button";
import heroImage from "@assets/Gemini_Generated_Image_lc83uqlc83uqlc83_1759267871295.png";

export default function Hero() {
  return (
    <div className="min-h-screen pt-16">
      <div className="relative bg-gradient-to-br from-off-white via-soft-lilac to-warm-sand">
        <div className="absolute inset-0 bg-gradient-to-r from-off-white/90 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <p className="mb-4 font-semibold text-logo-purple">Traviz AI strategy, automation and delivery</p>
              <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                <span className="gradient-text">Turn customer and operational data into practical AI decisions.</span>
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-muted-blue">Traviz helps digital businesses identify where AI can create operational value, test whether the data and workflow are ready, and leave with a focused implementation plan. From retention and customer intelligence to workflow automation, the work starts with a business decision—not a technology demo.</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="bg-logo-purple text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:shadow-xl" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-primary-cta">Book a 20-minute AI readiness call</Button>
                <Button variant="outline" size="lg" className="border-2 border-electric-teal text-lg font-semibold text-electric-teal transition-all duration-300 hover:bg-electric-teal hover:text-white" asChild data-testid="button-secondary-cta"><a href="/services/ai-opportunity-data-readiness-sprint">View sprint details</a></Button>
              </div>
            </div>
            <div className="animate-fade-in"><img src={heroImage} alt="AI planning and operational decision-making" className="h-auto w-full rounded-2xl shadow-2xl" /></div>
          </div>
        </div>
      </div>
      <div className="bg-cool-gray py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 text-center sm:px-6 md:grid-cols-3 lg:px-8">
          <div><div className="mb-4 text-4xl font-bold text-logo-purple">1,000+ hours</div><div className="font-medium leading-relaxed text-charcoal">Estimated annual time saved through Traviz-led automation work</div></div>
          <div><div className="mb-4 text-4xl font-bold text-electric-teal">Cross-sector</div><div className="font-medium leading-relaxed text-charcoal">iGaming, healthcare, aviation, finance and other operationally complex environments</div></div>
          <div><div className="mb-4 text-4xl font-bold text-logo-purple">Practical delivery</div><div className="font-medium leading-relaxed text-charcoal">Experience spanning automation, decision support, customer data and applied AI implementation</div></div>
        </div>
      </div>
    </div>
  );
}
