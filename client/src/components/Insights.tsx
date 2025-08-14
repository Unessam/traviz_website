import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";

export default function Insights() {
  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

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
              <article key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="bg-cool-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Latest Insights</h2>
            <p className="text-lg text-muted-blue max-w-3xl mx-auto">
              Educational articles on AI trends, automation strategies, and lessons from our projects
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-muted-blue text-lg">No blog posts available at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-cool-gray py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Latest Insights</h2>
          <p className="text-lg text-muted-blue max-w-3xl mx-auto">
            Educational articles on AI trends, automation strategies, and lessons from our projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, 6).map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={post.imageUrl || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300"} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-logo-purple text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-charcoal mb-3 hover:text-logo-purple transition-colors duration-300 line-clamp-2">
                  <button 
                    className="text-left"
                    data-testid={`button-read-article-${post.id}`}
                  >
                    {post.title}
                  </button>
                </h3>
                
                <p className="text-muted-blue mb-4 line-clamp-3" data-testid={`post-excerpt-${post.id}`}>
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-blue">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span data-testid={`post-date-${post.id}`}>
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                    {post.readTime && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span data-testid={`post-read-time-${post.id}`}>
                          {post.readTime} min read
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-logo-purple hover:text-electric-teal transition-colors p-0 h-auto font-semibold"
                    data-testid={`button-read-more-${post.id}`}
                  >
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-logo-purple text-white hover:bg-opacity-90 transition-all duration-300 font-semibold"
            data-testid="button-view-all-insights"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
