import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ShoppingCart, Factory, Banknote, ArrowRight } from "lucide-react";
import type { CaseStudy } from "@shared/schema";

const industryIcons = {
  healthcare: Building,
  ecommerce: ShoppingCart,
  manufacturing: Factory,
  finance: Banknote,
  default: Building,
};

export default function CaseStudies() {
  const { data: caseStudies = [], isLoading } = useQuery<CaseStudy[]>({
    queryKey: ["/api/case-studies"],
  });

  const defaultCaseStudies = [
    {
      id: "1",
      title: "Dental Practice Automation",
      client: "Smile Dental Group",
      industry: "healthcare",
      challenge: "Multi-location dental practice struggling with appointment scheduling, patient communication, and administrative overhead.",
      solution: "Implemented AI-powered receptionist agent that handles appointment booking, patient inquiries, and follow-up communications 24/7.",
      results: "65% reduction in administrative time, 30% increase in bookings, improved patient satisfaction scores.",
      testimonial: "The AI agent has transformed our practice. We're now available to patients 24/7, and our staff can focus on patient care instead of administrative tasks.",
      testimonialAuthor: "Dr. Sarah Johnson",
      testimonialRole: "DDS",
      metrics: { adminReduction: "65%", bookingIncrease: "30%" },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2", 
      title: "E-commerce Personalization",
      client: "ShopSmart",
      industry: "ecommerce",
      challenge: "Online retailer experiencing low conversion rates and poor customer engagement with generic product recommendations.",
      solution: "Developed AI-powered recommendation engine with real-time personalization and dynamic pricing optimization.",
      results: "45% higher conversion rates, $2.3M additional revenue, improved customer lifetime value.",
      testimonial: "The personalization engine completely changed our business. Customer engagement is through the roof, and our revenue has grown by over 40%.",
      testimonialAuthor: "Mark Thompson",
      testimonialRole: "CEO",
      metrics: { conversionIncrease: "45%", additionalRevenue: "$2.3M" },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Manufacturing Optimization", 
      client: "ProManufacturing",
      industry: "manufacturing",
      challenge: "Manufacturing company facing quality control issues and inefficient production scheduling leading to waste and delays.",
      solution: "Implemented predictive maintenance system and AI-driven quality control with computer vision for defect detection.",
      results: "50% reduction in defects, 25% increase in efficiency, significant cost savings through predictive maintenance.",
      testimonial: "Traviz's AI solution revolutionized our production line. We've eliminated most quality issues and our efficiency has never been higher.",
      testimonialAuthor: "Jennifer Liu",
      testimonialRole: "Production Director",
      metrics: { defectReduction: "50%", efficiencyIncrease: "25%" },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Financial Services Automation",
      client: "FirstBank",
      industry: "finance", 
      challenge: "Regional bank struggling with loan processing times and fraud detection, leading to customer dissatisfaction and financial losses.",
      solution: "Deployed automated loan processing system with AI fraud detection and risk assessment algorithms.",
      results: "80% faster processing, 95% fraud detection rate, improved customer satisfaction and reduced losses.",
      testimonial: "The AI system has transformed our operations. Loan approvals that used to take weeks now happen in hours, and our fraud losses have virtually disappeared.",
      testimonialAuthor: "Robert Chen",
      testimonialRole: "VP of Operations",
      metrics: { processingSpeed: "80%", fraudDetection: "95%" },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayCaseStudies = caseStudies.length > 0 ? caseStudies : defaultCaseStudies;

  if (isLoading) {
    return (
      <div className="bg-cool-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg animate-pulse">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-48"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cool-gray py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Success Stories</h2>
          <p className="text-lg text-muted-blue max-w-3xl mx-auto">
            Real results from our AI automation implementations across diverse industries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayCaseStudies.map((study) => {
            const IconComponent = industryIcons[study.industry as keyof typeof industryIcons] || industryIcons.default;
            
            return (
              <Card key={study.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-logo-purple rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal">{study.title}</h3>
                      <span className="text-sm font-semibold text-muted-blue capitalize">{study.industry}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-charcoal mb-2">Challenge:</h4>
                    <p className="text-muted-blue text-sm">{study.challenge}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-charcoal mb-2">Solution:</h4>
                    <p className="text-muted-blue text-sm">{study.solution}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-charcoal mb-2">Results:</h4>
                    {study.metrics && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {Object.entries(study.metrics).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-soft-lilac rounded-lg">
                            <div className="text-2xl font-bold text-logo-purple">{value}</div>
                            <div className="text-xs text-charcoal capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-muted-blue text-sm">{study.results}</p>
                  </div>

                  {study.testimonial && (
                    <div className="border-l-4 border-logo-purple pl-4 bg-soft-lilac p-4 rounded-r-lg mb-6">
                      <p className="text-muted-blue italic text-sm mb-2">"{study.testimonial}"</p>
                      <p className="text-charcoal font-medium text-sm">
                        - {study.testimonialAuthor}{study.testimonialRole ? `, ${study.testimonialRole}` : ''}, {study.client}
                      </p>
                    </div>
                  )}

                  <Button 
                    variant="ghost" 
                    className="text-logo-purple hover:text-electric-teal transition-colors p-0 h-auto font-semibold"
                    data-testid={`button-read-case-study-${study.id}`}
                  >
                    Read Full Case Study <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            className="bg-logo-purple text-white hover:bg-opacity-90 transition-all duration-300 font-semibold"
            data-testid="button-view-all-case-studies"
          >
            View All Case Studies
          </Button>
        </div>
      </div>
    </div>
  );
}
