import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { HeroContent, Stats } from "@shared/schema";

export default function Hero() {
  const { data: heroContent } = useQuery<HeroContent>({
    queryKey: ["/api/hero"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const defaultHero = {
    title: "AI Automation",
    subtitle: "for Real Business Impact",
    description: "Transform your business operations with cutting-edge AI solutions. We help companies automate processes, enhance decision-making, and drive measurable growth through intelligent technology.",
    primaryButtonText: "Book a Consultation",
    secondaryButtonText: "Learn More",
  };

  const hero = heroContent || defaultHero;
  
  const defaultStats = {
    hoursSaved: 1000,
    clientsServed: 50,
    roiIncrease: 300,
    projectsCompleted: 100,
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-off-white via-soft-lilac to-warm-sand">
        <div className="absolute inset-0 bg-gradient-to-r from-off-white/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="gradient-text">{hero.title}</span><br />
                <span className="text-charcoal text-2xl sm:text-3xl lg:text-4xl">{hero.subtitle}</span>
              </h1>
              <p className="text-xl text-muted-blue mb-8 leading-relaxed">
                {hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-logo-purple text-white hover:bg-opacity-90 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                  data-testid="button-primary-cta"
                >
                  {hero.primaryButtonText}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-electric-teal text-electric-teal hover:bg-electric-teal hover:text-white transition-all duration-300 font-semibold text-lg"
                  data-testid="button-secondary-cta"
                >
                  {hero.secondaryButtonText}
                </Button>
              </div>
            </div>
            <div className="animate-fade-in">
              <img 
                src={hero.heroImageUrl || "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
                alt="AI technology business automation" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Intro */}
      <div className="bg-off-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-charcoal mb-6">
            Empowering Businesses Through Intelligent Automation
          </h2>
          <p className="text-lg text-muted-blue leading-relaxed">
            Traviz is a leading AI consultancy that specializes in transforming traditional business operations into intelligent, automated systems. We combine deep technical expertise with practical business acumen to deliver solutions that drive real, measurable impact for our clients across diverse industries.
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-cool-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-logo-purple mb-4" data-testid="stat-years-experience">
                7+
              </div>
              <div className="text-charcoal font-medium leading-relaxed">
                Years delivering AI solutions across industries
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-electric-teal mb-4" data-testid="stat-hours-saved">
                1000+
              </div>
              <div className="text-charcoal font-medium leading-relaxed">
                Hours saved annually for clients through automation
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-logo-purple mb-4" data-testid="stat-industry-projects">
                ∞
              </div>
              <div className="text-charcoal font-medium leading-relaxed">
                Projects in healthcare, aviation, gaming, finance, and more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
