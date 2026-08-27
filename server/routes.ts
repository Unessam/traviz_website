import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isRetentionAuthorized } from "./replitAuth";
import { createContactNotifier, type ContactNotifier } from "./contactNotification";
import { persistContactSubmissionAndNotify } from "./contactSubmission";
import { 
  insertHeroContentSchema,
  insertServiceSchema,
  insertProductSchema,
  insertCaseStudySchema,
  insertTestimonialSchema,
  insertBlogPostSchema,
  insertAboutContentSchema,
  contactFormSubmissionSchema,
  insertStatsSchema,
  insertResourceSchema
} from "@shared/schema";
import {
  executeRetentionRun,
  getRetentionPreview,
} from "./retentionService";
import { RETENTION_APPLY_CONFIRMATION } from "./retention";
import { z } from "zod";

function getRouteId(params: { id?: string | string[] }): string {
  if (typeof params.id !== "string") {
    throw new Error("A single resource ID is required");
  }

  return params.id;
}

export interface RouteDependencies {
  contactNotifier?: ContactNotifier;
}

export async function registerRoutes(
  app: Express,
  dependencies: RouteDependencies = {},
): Promise<Server> {
  const contactNotifier = dependencies.contactNotifier ?? createContactNotifier();

  // Auth middleware
  await setupAuth(app);
  const retentionAuth = [isAuthenticated, isRetentionAuthorized] as const;
  const retentionDate = z.string().datetime({ offset: true }).optional();
  const retentionRunSchema = z.object({
    dryRun: z.boolean(),
    referenceTime: retentionDate,
    previewRunId: z.string().min(1).optional(),
    confirmation: z.string().optional(),
  }).strict();
  const legalHoldSchema = z.object({
    legalHold: z.boolean(),
    reason: z.string().trim().min(1).max(2000),
  }).strict();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public content routes
  app.get('/api/hero', isAuthenticated, async (req, res) => {
    try {
      const heroContent = await storage.getHeroContent();
      res.json(heroContent);
    } catch (error) {
      console.error("Error fetching hero content:", error);
      res.status(500).json({ message: "Failed to fetch hero content" });
    }
  });

  app.get('/api/services', isAuthenticated, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/products', isAuthenticated, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/case-studies', isAuthenticated, async (req, res) => {
    try {
      const caseStudies = await storage.getCaseStudies();
      res.json(caseStudies);
    } catch (error) {
      console.error("Error fetching case studies:", error);
      res.status(500).json({ message: "Failed to fetch case studies" });
    }
  });

  app.get('/api/testimonials', isAuthenticated, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get('/api/blog-posts', isAuthenticated, async (req, res) => {
    try {
      const blogPosts = await storage.getPublishedBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/about', isAuthenticated, async (req, res) => {
    try {
      const aboutContent = await storage.getAboutContent();
      res.json(aboutContent);
    } catch (error) {
      console.error("Error fetching about content:", error);
      res.status(500).json({ message: "Failed to fetch about content" });
    }
  });

  app.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/resources', isAuthenticated, async (req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = contactFormSubmissionSchema.parse(req.body);
      
      const submission = await persistContactSubmissionAndNotify(
        validatedData,
        storage,
        contactNotifier,
      );
      
      res.status(201).json({ message: "Contact form submitted successfully", id: submission.id });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(400).json({ message: "Invalid form data" });
    }
  });

  // Protected admin routes
  app.get('/api/admin/blog-posts', isAuthenticated, async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/admin/contact-submissions', ...retentionAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  // Admin CRUD routes for hero content
  app.post('/api/admin/hero', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertHeroContentSchema.parse(req.body);
      const heroContent = await storage.updateHeroContent(validatedData);
      res.json(heroContent);
    } catch (error) {
      console.error("Error updating hero content:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put('/api/admin/hero', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertHeroContentSchema.parse(req.body);
      const heroContent = await storage.updateHeroContent(validatedData);
      res.json(heroContent);
    } catch (error) {
      console.error("Error updating hero content:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Admin CRUD routes for services
  app.post('/api/admin/services', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put('/api/admin/services/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete('/api/admin/services/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      await storage.deleteService(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Admin CRUD routes for products
  app.post('/api/admin/products', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put('/api/admin/products/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete('/api/admin/products/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin CRUD routes for case studies
  app.post('/api/admin/case-studies', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.parse(req.body);
      const caseStudy = await storage.createCaseStudy(validatedData);
      res.status(201).json(caseStudy);
    } catch (error) {
      console.error("Error creating case study:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put('/api/admin/case-studies/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      const validatedData = insertCaseStudySchema.partial().parse(req.body);
      const caseStudy = await storage.updateCaseStudy(id, validatedData);
      res.json(caseStudy);
    } catch (error) {
      console.error("Error updating case study:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete('/api/admin/case-studies/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      await storage.deleteCaseStudy(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting case study:", error);
      res.status(500).json({ message: "Failed to delete case study" });
    }
  });

  // Admin CRUD routes for testimonials
  app.post('/api/admin/testimonials', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put('/api/admin/testimonials/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, validatedData);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete('/api/admin/testimonials/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      await storage.deleteTestimonial(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Admin CRUD routes for blog posts
  app.post('/api/admin/blog-posts', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validatedData);
      res.status(201).json(blogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put('/api/admin/blog-posts/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const blogPost = await storage.updateBlogPost(id, validatedData);
      res.json(blogPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete('/api/admin/blog-posts/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Admin routes for about content
  app.put('/api/admin/about', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAboutContentSchema.parse(req.body);
      const aboutContent = await storage.updateAboutContent(validatedData);
      res.json(aboutContent);
    } catch (error) {
      console.error("Error updating about content:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Admin routes for stats
  app.put('/api/admin/stats', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertStatsSchema.parse(req.body);
      const stats = await storage.updateStats(validatedData);
      res.json(stats);
    } catch (error) {
      console.error("Error updating stats:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Admin CRUD routes for resources
  app.post('/api/admin/resources', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put('/api/admin/resources/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      const validatedData = insertResourceSchema.partial().parse(req.body);
      const resource = await storage.updateResource(id, validatedData);
      res.json(resource);
    } catch (error) {
      console.error("Error updating resource:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete('/api/admin/resources/:id', isAuthenticated, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      await storage.deleteResource(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resource:", error);
      res.status(500).json({ message: "Failed to delete resource" });
    }
  });

  // Mark contact submission as read
  app.patch('/api/admin/contact-submissions/:id/read', ...retentionAuth, async (req, res) => {
    try {
      const id = getRouteId(req.params);
      await storage.markContactSubmissionAsRead(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking submission as read:", error);
      res.status(500).json({ message: "Failed to update submission" });
    }
  });

  app.get('/api/admin/retention/preview', ...retentionAuth, async (req, res) => {
    try {
      const query = z.object({ referenceTime: retentionDate }).strict().parse(req.query);
      const referenceTime = query.referenceTime ? new Date(query.referenceTime) : new Date();
      const preview = await getRetentionPreview(storage, referenceTime);
      res.json(preview);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid retention preview request" });
    }
  });

  app.get('/api/admin/retention/runs', ...retentionAuth, async (req, res) => {
    try {
      const limit = z.coerce.number().int().min(1).max(100).default(20).parse(req.query.limit);
      res.json(await storage.getRecentRetentionRuns(limit));
    } catch {
      res.status(400).json({ message: "Invalid retention run query" });
    }
  });

  app.get('/api/admin/retention/audit-events', ...retentionAuth, async (req, res) => {
    try {
      const limit = z.coerce.number().int().min(1).max(100).default(50).parse(req.query.limit);
      res.json(await storage.getRecentRetentionAuditEvents(limit));
    } catch {
      res.status(400).json({ message: "Invalid retention audit query" });
    }
  });

  app.post('/api/admin/retention/runs', ...retentionAuth, async (req: any, res) => {
    try {
      const body = retentionRunSchema.parse(req.body);
      if (!body.dryRun && body.confirmation !== RETENTION_APPLY_CONFIRMATION) {
        return res.status(400).json({ message: `Confirmation must equal ${RETENTION_APPLY_CONFIRMATION}` });
      }
      const referenceTime = body.referenceTime ? new Date(body.referenceTime) : new Date();
      const run = await executeRetentionRun(storage, {
        requestedBy: req.user.claims.sub,
        referenceTime,
        dryRun: body.dryRun,
        previewRunId: body.previewRunId,
      });
      return res.status(body.dryRun ? 200 : 202).json(run);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Retention run failed";
      const status = message === "RETENTION_AUTOMATION_DISABLED" || message === "DRY_RUN_REVIEW_REQUIRED" || message === "INVALID_DRY_RUN_REVIEW" || message === "REFERENCE_TIME_MISMATCH" || message === "DRY_RUN_REVIEW_STALE" ? 409 : 400;
      return res.status(status).json({ message });
    }
  });

  app.patch('/api/admin/users/:id/access-removal', ...retentionAuth, async (req: any, res) => {
    try {
      const body = z.object({ removedAt: retentionDate }).strict().parse(req.body);
      const removedAt = body.removedAt ? new Date(body.removedAt) : new Date();
      if (removedAt.getTime() > Date.now()) return res.status(400).json({ message: "removedAt cannot be in the future" });
      const user = await storage.recordUserAccessRemoval(getRouteId(req.params), removedAt, { actorId: req.user.claims.sub });
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ id: user.id, accessRemovedAt: user.accessRemovedAt });
    } catch {
      return res.status(400).json({ message: "Invalid access-removal request" });
    }
  });

  app.patch('/api/admin/users/:id/legal-hold', ...retentionAuth, async (req: any, res) => {
    try {
      const body = legalHoldSchema.parse(req.body);
      const user = await storage.setUserLegalHold(getRouteId(req.params), body.legalHold, body.reason, { actorId: req.user.claims.sub });
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ id: user.id, legalHold: user.legalHold, legalHoldReason: user.legalHoldReason });
    } catch {
      return res.status(400).json({ message: "Invalid legal-hold request" });
    }
  });

  app.patch('/api/admin/contact-submissions/:id/legal-hold', ...retentionAuth, async (req: any, res) => {
    try {
      const body = legalHoldSchema.parse(req.body);
      const submission = await storage.setContactSubmissionLegalHold(getRouteId(req.params), body.legalHold, body.reason, { actorId: req.user.claims.sub });
      if (!submission) return res.status(404).json({ message: "Contact submission not found" });
      return res.json({ id: submission.id, legalHold: submission.legalHold, legalHoldReason: submission.legalHoldReason });
    } catch {
      return res.status(400).json({ message: "Invalid legal-hold request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
