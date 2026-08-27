import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ContentEditor from "@/components/admin/ContentEditor";
import RetentionConsole from "@/components/admin/RetentionConsole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Settings, 
  FileText, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Briefcase,
  Award,
  Download,
  BarChart3,
  LogOut
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-logo-purple to-electric-teal rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-xl font-bold text-charcoal">Admin Dashboard</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-2">Content Management</h2>
          <p className="text-muted-blue">Manage your website content with ease</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Home className="w-5 h-5 text-logo-purple mr-3" />
              <CardTitle className="text-sm font-medium">Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Update hero content, headlines, and CTAs
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-hero">
                Edit Content
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Settings className="w-5 h-5 text-electric-teal mr-3" />
              <CardTitle className="text-sm font-medium">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Manage service descriptions and features
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-services">
                Edit Services
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Briefcase className="w-5 h-5 text-logo-purple mr-3" />
              <CardTitle className="text-sm font-medium">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Add, edit, or remove products
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-products">
                Manage Products
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Award className="w-5 h-5 text-electric-teal mr-3" />
              <CardTitle className="text-sm font-medium">Case Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Add, edit, or remove case studies
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-cases">
                Manage Cases
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <MessageSquare className="w-5 h-5 text-logo-purple mr-3" />
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Update client testimonials and reviews
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-testimonials">
                Edit Testimonials
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="w-5 h-5 text-electric-teal mr-3" />
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Create and manage blog content
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-blog">
                Manage Blog
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="w-5 h-5 text-logo-purple mr-3" />
              <CardTitle className="text-sm font-medium">About Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Update company information and team
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-about">
                Edit About
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Download className="w-5 h-5 text-electric-teal mr-3" />
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Manage downloadable resources
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-resources">
                Manage Resources
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BarChart3 className="w-5 h-5 text-logo-purple mr-3" />
              <CardTitle className="text-sm font-medium">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-blue mb-4">
                Update company stats and metrics
              </p>
              <Button size="sm" className="w-full" data-testid="button-edit-stats">
                Edit Stats
              </Button>
            </CardContent>
          </Card>
        </div>

        <ContentEditor />
        <div className="mt-12">
          <RetentionConsole />
        </div>
      </div>
    </div>
  );
}
