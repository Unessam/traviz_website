export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  heroImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  useCases?: string;
  imageUrl?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  imageUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  testimonial?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  imageUrl?: string;
  metrics?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorImageUrl?: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  imageUrl?: string;
  readTime?: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutContent {
  id: string;
  story: string;
  mission: string;
  philosophy: string;
  values?: any;
  founderName: string;
  founderBio: string;
  founderImageUrl?: string;
  founderCredentials: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Stats {
  id: string;
  hoursSaved: number;
  clientsServed: number;
  roiIncrease: number;
  projectsCompleted: number;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  downloadUrl?: string;
  icon?: string;
  isActive: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}
