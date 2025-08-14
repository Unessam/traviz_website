import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Check, ExternalLink, Calendar } from "lucide-react";
import type { Product } from "@/types";

export default function Products() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const defaultProducts = [
    {
      id: "1",
      name: "Agentiq AI CRM",
      description: "Revolutionary AI-powered CRM that automates customer interactions, predicts sales opportunities, and enhances customer relationship management through intelligent automation and predictive analytics.",
      features: [
        "Intelligent lead scoring and prioritization",
        "Automated follow-up sequences",
        "Predictive analytics and forecasting",
        "Smart email campaigns and personalized outreach automation"
      ],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      websiteUrl: "https://agentiq.ai",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  if (isLoading) {
    return (
      <div className="bg-off-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-soft-lilac to-warm-sand rounded-2xl p-8 md:p-12 animate-pulse">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="h-8 bg-gray-300 rounded mb-6"></div>
                  <div className="h-4 bg-gray-300 rounded mb-6"></div>
                  <div className="space-y-3 mb-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="h-12 bg-gray-300 rounded w-32"></div>
                    <div className="h-12 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-300 rounded-xl h-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Our Products</h2>
          <p className="text-lg text-muted-blue max-w-3xl mx-auto">
            In addition to consultancy, Traviz develops AI-powered products that revolutionize how businesses operate and engage with customers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {displayProducts.map((product) => (
            <Card key={product.id} className="bg-gradient-to-br from-soft-lilac to-warm-sand rounded-2xl p-8 md:p-12 shadow-xl border border-cool-gray mb-12">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-logo-purple to-electric-teal rounded-xl flex items-center justify-center mr-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold gradient-text">{product.name}</h3>
                    </div>
                    
                    <p className="text-lg text-muted-blue mb-8">{product.description}</p>
                    
                    <div className="space-y-4 mb-8">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-6 h-6 bg-logo-purple rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-muted-blue">{feature}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {product.websiteUrl && (
                        <Button 
                          className="bg-logo-purple text-white hover:bg-opacity-90 transition-all duration-300 font-semibold"
                          onClick={() => window.open(product.websiteUrl, '_blank')}
                          data-testid={`button-visit-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit {product.name.split(' ')[0]}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="border-2 border-electric-teal text-electric-teal hover:bg-electric-teal hover:text-white transition-all duration-300 font-semibold"
                        data-testid={`button-demo-${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Request Demo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
                      alt={`${product.name} dashboard interface`}
                      className="rounded-xl shadow-lg w-full h-auto"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Coming Soon Products */}
          <Card className="bg-gradient-to-r from-soft-lilac to-warm-sand rounded-2xl p-12 text-center">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-charcoal mb-4">More Products Coming Soon</h3>
              <p className="text-lg text-muted-blue mb-8 max-w-2xl mx-auto">
                We're continuously developing innovative AI solutions to address emerging business challenges. Stay tuned for exciting new products that will transform how you work.
              </p>
              <Button 
                className="bg-electric-teal text-white hover:bg-opacity-90 transition-all duration-300 font-semibold"
                data-testid="button-early-access"
              >
                Get Early Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
