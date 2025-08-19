import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Shield, Rocket, GraduationCap, Award, BookOpen } from "lucide-react";
import type { AboutContent } from "@shared/schema";
import founderImage from "@assets/60338d05-c257-4825-b3e4-01ba17919cc1_1755637770252.jpg";

const valueIcons = {
  transparency: Eye,
  reliability: Shield,
  innovation: Rocket,
};

export default function About() {
  const { data: aboutContent, isLoading } = useQuery<AboutContent>({
    queryKey: ["/api/about"],
  });

  if (isLoading) {
    return (
      <div className="bg-warm-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-16 animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-32"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaultAbout = {
    story: "Traviz was born from a simple observation: while AI technology was advancing rapidly, most businesses struggled to implement it effectively. We founded Traviz to bridge this gap, making cutting-edge AI accessible and practical for businesses of all sizes.",
    mission: "To democratize artificial intelligence by making it accessible, practical, and profitable for businesses across all industries. We believe that every organization, regardless of size, should have the opportunity to leverage AI for competitive advantage and sustainable growth.",
    philosophy: "We approach every project with a focus on practical results rather than theoretical possibilities. Our solutions are designed to integrate seamlessly with existing business processes while delivering measurable improvements in efficiency, accuracy, and profitability.",
    values: {
      excellence: "We strive for excellence in every project, delivering solutions that exceed expectations and drive exceptional results for our clients.",
      innovation: "We continuously explore emerging technologies and methodologies to provide cutting-edge solutions that keep our clients ahead of the curve.",
      partnership: "We build long-term partnerships with our clients, understanding their unique challenges and working collaboratively to achieve their goals."
    },
    founderName: "Alex Chen",
    founderBio: "With over 15 years in AI and machine learning, Alex has led transformational projects at Fortune 500 companies and innovative startups. He holds a PhD in Computer Science from MIT and has published extensively on practical AI applications.",
    founderCredentials: ["PhD Computer Science, MIT", "15+ Years AI/ML Experience", "50+ Published Research Papers"],
  };

  const about = aboutContent || defaultAbout;

  return (
    <div className="bg-warm-sand py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal mb-4">About Traviz</h2>
          <p className="text-lg text-muted-blue max-w-3xl mx-auto">
            Empowering businesses through intelligent automation and cutting-edge AI solutions
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-charcoal mb-6">Our Story</h3>
              <p className="text-lg text-muted-blue mb-6 leading-relaxed" data-testid="about-story">
                {about.story}
              </p>
              <p className="text-lg text-muted-blue leading-relaxed">
                Today, we're proud to be trusted partners to organizations across industries, helping them unlock the transformational power of AI automation.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern innovative workspace representing Traviz company culture"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Mission & Philosophy */}
        <div className="bg-gradient-to-r from-soft-lilac to-white rounded-2xl p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-charcoal mb-6">Our Mission</h3>
              <p className="text-lg text-muted-blue leading-relaxed" data-testid="about-mission">
                {about.mission}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-charcoal mb-6">Our Philosophy</h3>
              <p className="text-lg text-muted-blue leading-relaxed" data-testid="about-philosophy">
                {about.philosophy}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-charcoal text-center mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(about.values || defaultAbout.values).map(([key, value]) => {
              const IconComponent = valueIcons[key as keyof typeof valueIcons] || Eye;
              
              return (
                <div key={key} className="text-center">
                  <div className="w-16 h-16 bg-logo-purple rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-muted-blue leading-relaxed" data-testid={`value-${key}`}>
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meet the Founder */}
        <Card className="bg-white rounded-2xl shadow-lg border border-cool-gray">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold text-charcoal text-center mb-12">Meet the Founder</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <img 
                  src={founderImage}
                  alt="Professional founder portrait in modern office setting"
                  className="rounded-xl shadow-lg w-full max-w-sm mx-auto lg:mx-0 object-cover object-top aspect-square"
                />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-charcoal mb-4">Meet the Founder</h4>
                <h5 className="text-xl font-semibold text-logo-purple mb-3" data-testid="founder-name">
                  {about.founderName}
                </h5>
                <p className="text-muted-blue leading-relaxed mb-6" data-testid="founder-bio">
                  {about.founderBio}
                </p>
                <div className="space-y-2">
                  {(about.founderCredentials || defaultAbout.founderCredentials).map((credential, index) => {
                    const icons = [GraduationCap, Award, BookOpen];
                    const IconComponent = icons[index] || GraduationCap;
                    
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-electric-teal flex-shrink-0" />
                        <span className="text-muted-blue" data-testid={`founder-credential-${index}`}>
                          {credential}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
