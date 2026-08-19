import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Book, Download } from "lucide-react";
import type { Resource } from "@shared/schema";

const resourceIcons = {
  pdf: FileText,
  template: BarChart3,
  guide: Book,
  default: FileText,
};

export default function Resources() {
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const defaultResources = [
    {
      id: "1",
      title: "AI Readiness Assessment",
      description: "Evaluate your organization's readiness for AI implementation with our comprehensive checklist.",
      type: "pdf",
      icon: "pdf",
      downloadCount: 245,
      downloadUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "ROI Calculator Template",
      description: "Calculate the potential return on investment for your AI automation projects.",
      type: "template",
      icon: "template",
      downloadCount: 189,
      downloadUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "AI Implementation Playbook",
      description: "Step-by-step guide to successfully implementing AI solutions in your organization.",
      type: "guide",
      icon: "guide",
      downloadCount: 312,
      downloadUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayResources = resources.length > 0 ? resources : defaultResources;

  if (isLoading) {
    return (
      <div className="bg-soft-lilac py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (displayResources.length === 0) {
    return (
      <div className="bg-soft-lilac py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Free Resources</h2>
            <p className="text-lg text-muted-blue max-w-3xl mx-auto">
              Download our comprehensive guides and tools to accelerate your AI journey.
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-muted-blue text-lg">No resources available at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-soft-lilac py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Free Resources</h2>
          <p className="text-lg text-muted-blue max-w-3xl mx-auto">
            Download our comprehensive guides and tools to accelerate your AI journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayResources.map((resource) => {
            const IconComponent = resourceIcons[resource.icon as keyof typeof resourceIcons] || resourceIcons.default;
            
            return (
              <Card key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-logo-purple to-electric-teal rounded-lg flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-charcoal mb-3" data-testid={`resource-title-${resource.id}`}>
                    {resource.title}
                  </h3>
                  
                  <p className="text-muted-blue mb-6" data-testid={`resource-description-${resource.id}`}>
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-blue">
                      {resource.downloadCount} downloads
                    </span>
                    <span className="text-sm text-electric-teal font-semibold capitalize">
                      {resource.type}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full bg-logo-purple text-white hover:bg-opacity-90 transition-all duration-300 font-semibold"
                    onClick={() => {
                      if (resource.downloadUrl) {
                        window.open(resource.downloadUrl, '_blank');
                      }
                    }}
                    data-testid={`button-download-${resource.id}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {resource.type === 'template' ? 'Template' : resource.type === 'guide' ? 'Guide' : 'Free Guide'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
