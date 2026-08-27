import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye,
  EyeOff,
  Calendar,
  MessageSquare,
  BarChart3
} from "lucide-react";
import type { 
  Service, 
  Product, 
  CaseStudy, 
  Testimonial, 
  BlogPost, 
  ContactSubmission, 
  Stats,
  Resource,
  HeroContent,
  AboutContent 
} from "@shared/schema";

// Form schemas
const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).default([]),
  useCases: z.string().optional(),
  imageUrl: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

const caseStudySchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client is required"),
  industry: z.string().min(1, "Industry is required"),
  challenge: z.string().min(1, "Challenge is required"),
  solution: z.string().min(1, "Solution is required"),
  results: z.string().min(1, "Results is required"),
  testimonial: z.string().optional(),
  testimonialAuthor: z.string().optional(),
  testimonialRole: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

const testimonialSchema = z.object({
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  authorRole: z.string().min(1, "Author role is required"),
  authorCompany: z.string().min(1, "Author company is required"),
  authorImageUrl: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
});

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().optional(),
  readTime: z.number().optional(),
  isPublished: z.boolean().default(false),
});

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  downloadUrl: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

const statsSchema = z.object({
  yearsExperience: z.number().min(0),
  hoursSavedAnnually: z.number().min(0),
  industryProjectsCount: z.string().min(1),
});

const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  primaryButtonText: z.string().min(1, "Primary button text is required"),
  secondaryButtonText: z.string().min(1, "Secondary button text is required"),
  heroImageUrl: z.string().optional(),
});

const aboutSchema = z.object({
  story: z.string().min(1, "Story is required"),
  mission: z.string().min(1, "Mission is required"),
  philosophy: z.string().min(1, "Philosophy is required"),
  founderName: z.string().min(1, "Founder name is required"),
  founderBio: z.string().min(1, "Founder bio is required"),
  founderImageUrl: z.string().optional(),
  founderCredentials: z.array(z.string()).default([]),
});

type ServiceFormData = z.infer<typeof serviceSchema>;
type ProductFormData = z.infer<typeof productSchema>;
type CaseStudyFormData = z.infer<typeof caseStudySchema>;
type TestimonialFormData = z.infer<typeof testimonialSchema>;
type BlogPostFormData = z.infer<typeof blogPostSchema>;
type ResourceFormData = z.infer<typeof resourceSchema>;
type StatsFormData = z.infer<typeof statsSchema>;
type HeroFormData = z.infer<typeof heroSchema>;
type AboutFormData = z.infer<typeof aboutSchema>;

export default function ContentEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>("");

  // Data queries
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/services"] });
  const { data: products = [] } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: caseStudies = [] } = useQuery<CaseStudy[]>({ queryKey: ["/api/case-studies"] });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials"] });
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/admin/blog-posts"] });
  const { data: resources = [] } = useQuery<Resource[]>({ queryKey: ["/api/resources"] });
  const { data: stats } = useQuery<Stats>({ queryKey: ["/api/stats"] });
  const { data: heroContent } = useQuery<HeroContent>({ queryKey: ["/api/hero"] });
  const { data: aboutContent } = useQuery<AboutContent>({ queryKey: ["/api/about"] });
  const { data: contactSubmissions = [], isSuccess: canViewContactSubmissions } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions"] 
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any }) => {
      await apiRequest("POST", `/api/admin/${type}`, data);
    },
    onSuccess: (_, { type }) => {
      toast({
        title: "Success",
        description: "Item created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${type}`] });
      setEditingItem(null);
      setEditingType("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create item.",
        variant: "destructive",
      });
    },
  });

  // Update mutation - handles both regular content and special cases like hero
  const updateMutation = useMutation({
    mutationFn: async ({ type, id, data }: { type: string; id?: string; data: any }) => {
      // Special case for hero and about content (no ID required)
      if (type === 'hero' || type === 'about') {
        await apiRequest("PUT", `/api/admin/${type}`, data);
      } else if (id) {
        await apiRequest("PUT", `/api/admin/${type}/${id}`, data);
      }
    },
    onSuccess: (_, { type }) => {
      toast({
        title: "Success",
        description: "Item updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${type}`] });
      setEditingItem(null);
      setEditingType("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update item.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      await apiRequest("DELETE", `/api/admin/${type}/${id}`, {});
    },
    onSuccess: (_, { type }) => {
      toast({
        title: "Success",
        description: "Item deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${type}`] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    },
  });

  // Mark contact submission as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/admin/contact-submissions/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to mark as read.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setEditingType(type);
  };

  const handleDelete = (id: string, type: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate({ type, id });
    }
  };

  // Generic form component
  const renderForm = (schema: any, type: string, defaultValues: any = {}) => {
    const form = useForm({
      resolver: zodResolver(schema),
      defaultValues: editingItem || defaultValues,
    });

    const onSubmit = (data: any) => {
      // Special cases for hero and about content - always update, never create
      if (type === 'hero' || type === 'about') {
        updateMutation.mutate({ type, data });
      } else if (editingItem) {
        updateMutation.mutate({ type, id: editingItem.id, data });
      } else {
        createMutation.mutate({ type, data });
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {Object.keys(schema.shape).map((key) => {
            const field = schema.shape[key];
            
            if (key === 'features' || key === 'founderCredentials') {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter one item per line"
                          value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                          onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            if (typeof field._def?.innerType?._def?.value === 'boolean') {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            if (key.includes('content') || key.includes('description') || key.includes('message') || key.includes('story') || key.includes('mission') || key.includes('philosophy') || key.includes('bio')) {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            if (key === 'category') {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ai-strategy">AI Strategy</SelectItem>
                          <SelectItem value="automation">Automation</SelectItem>
                          <SelectItem value="machine-learning">Machine Learning</SelectItem>
                          <SelectItem value="data-science">Data Science</SelectItem>
                          <SelectItem value="case-study">Case Study</SelectItem>
                          <SelectItem value="industry-trends">Industry Trends</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            if (key === 'type' && type === 'resources') {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Guide</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                          <SelectItem value="guide">Implementation Guide</SelectItem>
                          <SelectItem value="whitepaper">Whitepaper</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            if (key === 'rating') {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(rating => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} Star{rating > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            return (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type={typeof field.value === 'number' ? 'number' : 'text'}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-content"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingItem ? 'Update' : 'Create'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setEditingItem(null);
                setEditingType("");
              }}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="testimonials">Reviews</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Hero Content */}
        <TabsContent value="hero" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hero Section</h3>
          </div>
          <Card>
            <CardContent className="p-6">
              {renderForm(heroSchema, 'hero', {
                title: heroContent?.title || '',
                subtitle: heroContent?.subtitle || '',
                description: heroContent?.description || '',
                primaryButtonText: heroContent?.primaryButtonText || 'Book a Consultation',
                secondaryButtonText: heroContent?.secondaryButtonText || 'Learn More',
                heroImageUrl: heroContent?.heroImageUrl || '',
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Services ({services.length})</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-service">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>
                {renderForm(serviceSchema, 'services', {
                  title: '',
                  description: '',
                  features: [],
                  useCases: '',
                  imageUrl: '',
                  icon: '',
                  order: services.length,
                  isActive: true,
                })}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(service, 'services')}
                          data-testid={`button-edit-service-${service.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Service</DialogTitle>
                        </DialogHeader>
                        {editingItem?.id === service.id && renderForm(serviceSchema, 'services')}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(service.id, 'services')}
                      data-testid={`button-delete-service-${service.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Products */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Products ({products.length})</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-product">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                {renderForm(productSchema, 'products', {
                  name: '',
                  description: '',
                  features: [],
                  imageUrl: '',
                  websiteUrl: '',
                  isActive: true,
                })}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(product, 'products')}
                          data-testid={`button-edit-product-${product.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {editingItem?.id === product.id && renderForm(productSchema, 'products')}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(product.id, 'products')}
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Case Studies */}
        <TabsContent value="cases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Case Studies ({caseStudies.length})</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-case-study">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Case Study
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Case Study</DialogTitle>
                </DialogHeader>
                {renderForm(caseStudySchema, 'case-studies', {
                  title: '',
                  client: '',
                  industry: '',
                  challenge: '',
                  solution: '',
                  results: '',
                  testimonial: '',
                  testimonialAuthor: '',
                  testimonialRole: '',
                  imageUrl: '',
                  isActive: true,
                })}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {caseStudies.map((caseStudy) => (
              <Card key={caseStudy.id}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{caseStudy.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {caseStudy.client} • {caseStudy.industry}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={caseStudy.isActive ? "default" : "secondary"}>
                      {caseStudy.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(caseStudy, 'case-studies')}
                          data-testid={`button-edit-case-study-${caseStudy.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Case Study</DialogTitle>
                        </DialogHeader>
                        {editingItem?.id === caseStudy.id && renderForm(caseStudySchema, 'case-studies')}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(caseStudy.id, 'case-studies')}
                      data-testid={`button-delete-case-study-${caseStudy.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Testimonials ({testimonials.length})</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-testimonial">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Testimonial</DialogTitle>
                </DialogHeader>
                {renderForm(testimonialSchema, 'testimonials', {
                  content: '',
                  authorName: '',
                  authorRole: '',
                  authorCompany: '',
                  authorImageUrl: '',
                  rating: 5,
                  isActive: true,
                })}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{testimonial.authorName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.authorRole}, {testimonial.authorCompany}
                    </p>
                    <p className="text-sm line-clamp-2 mt-1">{testimonial.content}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                      {testimonial.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(testimonial, 'testimonials')}
                          data-testid={`button-edit-testimonial-${testimonial.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Testimonial</DialogTitle>
                        </DialogHeader>
                        {editingItem?.id === testimonial.id && renderForm(testimonialSchema, 'testimonials')}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(testimonial.id, 'testimonials')}
                      data-testid={`button-delete-testimonial-${testimonial.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blog Posts */}
        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Blog Posts ({blogPosts.length})</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-blog-post">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Blog Post</DialogTitle>
                </DialogHeader>
                {renderForm(blogPostSchema, 'blog-posts', {
                  title: '',
                  excerpt: '',
                  content: '',
                  category: '',
                  author: '',
                  imageUrl: '',
                  readTime: 5,
                  isPublished: false,
                })}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{post.title}</CardTitle>
                      {post.isPublished ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {post.category} • {post.author}
                    </p>
                    <p className="text-sm line-clamp-1 mt-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={post.isPublished ? "default" : "secondary"}>
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(post, 'blog-posts')}
                          data-testid={`button-edit-blog-post-${post.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Blog Post</DialogTitle>
                        </DialogHeader>
                        {editingItem?.id === post.id && renderForm(blogPostSchema, 'blog-posts')}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(post.id, 'blog-posts')}
                      data-testid={`button-delete-blog-post-${post.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* About */}
        <TabsContent value="about" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">About Content</h3>
          </div>
          <Card>
            <CardContent className="p-6">
              {renderForm(aboutSchema, 'about', {
                story: aboutContent?.story || '',
                mission: aboutContent?.mission || '',
                philosophy: aboutContent?.philosophy || '',
                founderName: aboutContent?.founderName || '',
                founderBio: aboutContent?.founderBio || '',
                founderImageUrl: aboutContent?.founderImageUrl || '',
                founderCredentials: aboutContent?.founderCredentials || [],
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Resources ({resources.length})</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-resource">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                </DialogHeader>
                {renderForm(resourceSchema, 'resources', {
                  title: '',
                  description: '',
                  type: 'pdf',
                  downloadUrl: '',
                  icon: '',
                  isActive: true,
                })}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {resource.type} • {resource.downloadCount} downloads
                    </p>
                    <p className="text-sm line-clamp-1 mt-1">{resource.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={resource.isActive ? "default" : "secondary"}>
                      {resource.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(resource, 'resources')}
                          data-testid={`button-edit-resource-${resource.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Resource</DialogTitle>
                        </DialogHeader>
                        {editingItem?.id === resource.id && renderForm(resourceSchema, 'resources')}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(resource.id, 'resources')}
                      data-testid={`button-delete-resource-${resource.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Statistics & Contact Submissions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Website Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderForm(statsSchema, 'stats', {
              yearsExperience: stats?.yearsExperience || 7,
              hoursSavedAnnually: stats?.hoursSavedAnnually || 1000,
              industryProjectsCount: stats?.industryProjectsCount || "Multiple",
            })}
          </CardContent>
        </Card>

        {/* Contact Submissions */}
        {canViewContactSubmissions && <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Submissions ({contactSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {contactSubmissions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No contact submissions yet</p>
            ) : (
              contactSubmissions.map((submission) => (
                <div 
                  key={submission.id}
                  className={`p-4 rounded-lg border ${submission.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold" data-testid={`submission-name-${submission.id}`}>
                        {submission.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`submission-email-${submission.id}`}>
                        {submission.email}
                      </p>
                      {submission.company && (
                        <p className="text-sm text-muted-foreground" data-testid={`submission-company-${submission.id}`}>
                          {submission.company}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={submission.isRead ? "secondary" : "default"}>
                        {submission.isRead ? "Read" : "New"}
                      </Badge>
                      {!submission.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsReadMutation.mutate(submission.id)}
                          data-testid={`button-mark-read-${submission.id}`}
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm" data-testid={`submission-message-${submission.id}`}>
                    {submission.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'No date'}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>}
      </div>
    </div>
  );
}
