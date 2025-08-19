import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Linkedin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterData = z.infer<typeof newsletterSchema>;

export default function Footer() {
  const { toast } = useToast();

  const form = useForm<NewsletterData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const newsletterMutation = useMutation({
    mutationFn: async (data: NewsletterData) => {
      // This would typically be an API call to subscribe to newsletter
      console.log("Newsletter signup:", data);
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter!",
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Newsletter signup error:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onNewsletterSubmit = (data: NewsletterData) => {
    newsletterMutation.mutate(data);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/attached_assets/traviz_logo_no_background_1755634682120.png"
                alt="Traviz Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">Traviz</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transforming businesses through intelligent AI automation and cutting-edge technology solutions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/traviz/" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-logo-purple transition-colors"
                data-testid="footer-social-linkedin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/traviz.consulting" 
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-logo-purple transition-colors"
                data-testid="footer-social-instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-ai-strategy"
                >
                  AI Strategy
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-automation"
                >
                  Automation
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-machine-learning"
                >
                  Machine Learning
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-data-engineering"
                >
                  Data Engineering
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-product-development"
                >
                  Product Development
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#about" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-about"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#case-studies" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-case-studies"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a 
                  href="#insights" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-insights"
                >
                  Insights
                </a>
              </li>
              <li>
                <a 
                  href="#resources" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-resources"
                >
                  Resources
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-300 hover:text-electric-teal transition-colors"
                  data-testid="footer-link-contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-300 mb-4">Stay updated with the latest AI trends and insights.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onNewsletterSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your email"
                          className="bg-gray-700 border-gray-600 text-white focus:ring-logo-purple focus:border-transparent"
                          data-testid="input-newsletter-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-logo-purple text-white hover:bg-opacity-90 transition-all font-semibold"
                  disabled={newsletterMutation.isPending}
                  data-testid="button-newsletter-subscribe"
                >
                  {newsletterMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2" />
                      Subscribing...
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {currentYear} Traviz. All rights reserved. | 
            <a href="#" className="text-electric-teal hover:text-logo-purple transition-colors ml-1">
              Privacy Policy
            </a> | 
            <a href="#" className="text-electric-teal hover:text-logo-purple transition-colors ml-1">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
