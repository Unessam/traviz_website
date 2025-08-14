# Overview

This is a modern full-stack web application for Traviz, an AI automation consultancy company. The application serves as both a public-facing marketing website and an internal content management system. It features a clean, professional design showcasing AI services, products, case studies, and company information, while providing authenticated users with administrative capabilities to manage all website content dynamically.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript running on Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with a comprehensive design system using CSS custom properties for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components for consistent, accessible interface elements
- **State Management**: TanStack Query (React Query) for server state management with optimistic updates and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **File Uploads**: Uppy integration for handling file uploads to cloud storage

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Authentication**: Custom Replit OAuth integration with session-based authentication
- **API Design**: RESTful API with consistent error handling and request/response patterns

## Content Management System
- **Dynamic Content**: All website sections (hero, services, products, case studies, testimonials, blog posts, about, stats, resources) are stored in the database and can be managed through the admin interface
- **Real-time Updates**: Content changes are immediately reflected on the public site without requiring deployments
- **Media Handling**: Integration with cloud storage (Google Cloud Storage) for image and file uploads
- **Contact Management**: Contact form submissions are stored and can be reviewed through the admin panel

## Authentication & Authorization
- **Provider**: Replit OAuth for seamless integration with the Replit ecosystem
- **Session Management**: PostgreSQL-based session storage with configurable TTL
- **Route Protection**: Middleware-based authentication checks for admin routes
- **User Management**: User profile storage with OAuth claims integration

## Database Design
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Data Models**: Comprehensive content models including users, hero content, services, products, case studies, testimonials, blog posts, about content, contact submissions, stats, and resources
- **Relationships**: Well-defined relationships between content entities with proper indexing

## Performance Optimizations
- **Build Process**: Vite for frontend bundling with code splitting and tree shaking
- **Server Bundling**: ESBuild for optimized server-side bundling
- **Caching Strategy**: Query-based caching with TanStack Query for efficient data fetching
- **Image Optimization**: Cloud storage integration for optimized image delivery

# External Dependencies

## Core Technologies
- **Database**: PostgreSQL via Neon serverless for scalable, managed database hosting
- **Cloud Storage**: Google Cloud Storage for file and media asset storage
- **Authentication Provider**: Replit OAuth for user authentication and session management

## Development Tools
- **Package Manager**: npm with lockfile for reproducible builds
- **Type Checking**: TypeScript compiler for static type analysis
- **Development Server**: Vite development server with HMR and error overlay
- **Database Tools**: Drizzle Kit for schema management and migrations

## Third-party Libraries
- **UI Framework**: React with comprehensive Radix UI component primitives
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Form Handling**: React Hook Form with Hookform Resolvers for Zod integration
- **Data Fetching**: TanStack React Query for server state management
- **File Uploads**: Uppy ecosystem for robust file upload handling
- **Validation**: Zod for runtime type validation and schema definition
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Utilities**: Various utility libraries for enhanced functionality (memoizee, nanoid, etc.)

## Deployment Environment
- **Platform**: Replit for development and hosting environment
- **Build Tools**: Native ES modules support with modern JavaScript features
- **Environment Configuration**: Environment variable based configuration for different deployment stages