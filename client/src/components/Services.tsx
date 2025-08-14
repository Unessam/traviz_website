import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Bot, 
  Cpu, 
  Database, 
  Rocket,
  ArrowRight
} from "lucide-react";
import type { Service } from "@/types";

const iconMap = {
  lightbulb: Lightbulb,
  robot: Bot,
  cpu: Cpu,
  database: Database,
  rocket: Rocket,
};

export default function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const defaultServices = [
    {
      id: "1",
      title: "AI Strategy & Consultation",
      description: "Strategic planning and roadmap development for AI implementation across your organization.",
      features: ["AI readiness assessment", "Strategic roadmap development", "ROI analysis and business case", "Implementation timeline and milestones"],
      useCases: "Digital transformation planning, competitive analysis through AI, operational efficiency optimization, customer experience enhancement strategies.",
      icon: "lightbulb",
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2", 
      title: "Automation & AI Integration",
      description: "Seamlessly integrate AI solutions into existing workflows and business processes.",
      features: ["Process automation solutions", "API integrations and data pipelines", "Workflow optimization", "System monitoring and maintenance"],
      useCases: "Customer service automation, document processing, inventory management, financial reconciliation, quality assurance automation.",
      icon: "robot",
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Machine Learning & Engineering", 
      description: "Custom ML models and AI engineering solutions built for your specific requirements.",
      features: ["Custom ML model development", "Model training and optimization", "Production deployment solutions", "Performance monitoring and maintenance"],
      useCases: "Predictive analytics, recommendation engines, fraud detection, image recognition, natural language processing applications.",
      icon: "cpu",
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Data Engineering & Science",
      description: "Build robust data infrastructure and extract actionable insights from your data.",
      features: ["Data pipeline architecture", "Advanced analytics and reporting", "Data visualization dashboards", "Real-time data processing systems"],
      useCases: "Business intelligence platforms, real-time analytics, data warehousing, ETL processes, predictive modeling.",
      icon: "database",
      order: 4,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      title: "AI Product Development",
      description: "End-to-end development of AI-powered products and platforms.",
      features: ["Product strategy and design", "Full-stack development", "User experience optimization", "Scalable architecture solutions"],
      useCases: "SaaS platforms, mobile applications, chatbots and virtual assistants, recommendation systems, automated decision engines.",
      icon: "rocket",
      order: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (isLoading) {
    return (
      <div className="bg-cool-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-6"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
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
          <h2 className="text-4xl font-bold text-charcoal mb-4">Our Services</h2>
          <p className="text-lg text-muted-blue max-w-3xl mx-auto">
            Comprehensive AI solutions designed to transform your business operations and drive sustainable growth
          </p>
        </div>

        <div className="space-y-12">
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Lightbulb;
            const isEven = index % 2 === 0;
            
            return (
              <Card key={service.id} className="bg-white rounded-2xl shadow-lg">
                <CardContent className="p-8">
                  <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                    {!isEven && (
                      <div className="flex items-center justify-center lg:order-first">
                        <img 
                          src={service.imageUrl || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"} 
                          alt={service.title}
                          className="rounded-xl shadow-md w-full h-auto"
                        />
                      </div>
                    )}
                    
                    <div className="lg:col-span-2">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-logo-purple to-electric-teal rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-charcoal">{service.title}</h3>
                      </div>
                      
                      <p className="text-muted-blue mb-6">{service.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-charcoal mb-3">What We Deliver:</h4>
                        <ul className="space-y-2 text-muted-blue">
                          {service.features.map((feature, idx) => (
                            <li key={idx}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {service.useCases && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-charcoal mb-3">Example Use Cases:</h4>
                          <p className="text-muted-blue">{service.useCases}</p>
                        </div>
                      )}
                    </div>

                    {isEven && (
                      <div className="flex items-center justify-center">
                        <img 
                          src={service.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"} 
                          alt={service.title}
                          className="rounded-xl shadow-md w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
