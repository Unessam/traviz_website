import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Calendar, Linkedin, Instagram } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message! We'll get back to you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions"] });
    },
    onError: (error) => {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="bg-charcoal text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Let's Transform Your Business</h2>
            <p className="text-xl text-gray-300">
              Ready to unlock the power of AI automation? Let's discuss how we can help you achieve your goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-3 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-logo-purple to-electric-teal rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-300" data-testid="contact-email">info@traviz.co</div>
                  </div>
                </div>
                
                <a
                  href="https://calendly.com/traviz-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 hover:bg-gray-800 p-3 rounded-lg transition-colors"
                  data-testid="link-book-consultation"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-logo-purple to-electric-teal rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Book a Consultation</div>
                    <div className="text-gray-300">Schedule a free 30-minute strategy call</div>
                  </div>
                </a>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.linkedin.com/company/traviz/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-logo-purple transition-colors"
                    data-testid="social-linkedin"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a 
                    href="https://www.instagram.com/traviz.consulting" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-logo-purple transition-colors"
                    data-testid="social-instagram"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold">Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-700 border-gray-600 text-white focus:ring-logo-purple focus:border-transparent"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              className="bg-gray-700 border-gray-600 text-white focus:ring-logo-purple focus:border-transparent"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold">Company</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-700 border-gray-600 text-white focus:ring-logo-purple focus:border-transparent"
                              data-testid="input-company"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold">Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              className="bg-gray-700 border-gray-600 text-white focus:ring-logo-purple focus:border-transparent resize-none"
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-logo-purple to-electric-teal text-white hover:opacity-90 transition-all font-semibold"
                      disabled={contactMutation.isPending}
                      data-testid="button-send-message"
                    >
                      {contactMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="spinner mr-2" />
                          Sending...
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
