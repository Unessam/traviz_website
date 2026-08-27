import {
  users,
  heroContent,
  services,
  products,
  caseStudies,
  testimonials,
  blogPosts,
  aboutContent,
  contactSubmissions,
  stats,
  resources,
  retentionRuns,
  retentionAuditEvents,
  type User,
  type UpsertUser,
  type HeroContent,
  type InsertHeroContent,
  type Service,
  type InsertService,
  type Product,
  type InsertProduct,
  type CaseStudy,
  type InsertCaseStudy,
  type Testimonial,
  type InsertTestimonial,
  type BlogPost,
  type InsertBlogPost,
  type AboutContent,
  type InsertAboutContent,
  type ContactSubmission,
  type InsertContactSubmission,
  type Stats,
  type InsertStats,
  type Resource,
  type InsertResource,
  type RetentionRun,
  type RetentionAuditEvent,
} from "@shared/schema";
import { db } from "./db";
import {
  type RetentionAuditContext,
  type RetentionAuditEventType,
  type RetentionTargetContact,
  type RetentionTargetUser,
  getContactSubmissionDeletionCutoff,
  getOAuthAccessRestorationPatch,
  getOAuthUserAnonymisationCutoff,
} from "./retention";
import { and, desc, eq, isNotNull, isNull, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  setUserLegalHold(id: string, legalHold: boolean, reason?: string, audit?: RetentionAuditContext): Promise<User | undefined>;
  recordUserAccessRemoval(id: string, removedAt: Date, audit?: RetentionAuditContext): Promise<User | undefined>;
  anonymizeEligibleUser(id: string, referenceTime: Date, audit?: RetentionAuditContext): Promise<User | undefined>;

  // Hero content
  getHeroContent(): Promise<HeroContent | undefined>;
  updateHeroContent(content: InsertHeroContent): Promise<HeroContent>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Case Studies
  getCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(id: string): Promise<CaseStudy | undefined>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: string, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy>;
  deleteCaseStudy(id: string): Promise<void>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, blogPost: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;

  // About content
  getAboutContent(): Promise<AboutContent | undefined>;
  updateAboutContent(content: InsertAboutContent): Promise<AboutContent>;

  // Contact submissions
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  markContactSubmissionAsRead(id: string): Promise<void>;
  setContactSubmissionLegalHold(id: string, legalHold: boolean, reason?: string, audit?: RetentionAuditContext): Promise<ContactSubmission | undefined>;
  deleteEligibleContactSubmission(id: string, referenceTime: Date, audit?: RetentionAuditContext): Promise<boolean>;

  getRetentionTargets(): Promise<{ contacts: RetentionTargetContact[]; users: RetentionTargetUser[] }>;
  createRetentionRun(input: {
    requestedBy: string;
    referenceTime: Date;
    dryRun: boolean;
    status: string;
    candidateFingerprint: string;
  }): Promise<RetentionRun>;
  updateRetentionRun(id: string, update: Partial<{
    status: string;
    contactEligible: number;
    usersEligible: number;
    contactsDeleted: number;
    usersAnonymized: number;
    blockedByLegalHold: number;
    skipped: number;
    failureCode: string | null;
    completedAt: Date;
  }>): Promise<RetentionRun | undefined>;
  getRetentionRun(id: string): Promise<RetentionRun | undefined>;
  getRecentRetentionRuns(limit?: number): Promise<RetentionRun[]>;
  getRecentRetentionAuditEvents(limit?: number): Promise<RetentionAuditEvent[]>;
  recordRetentionAuditEvent(input: {
    eventType: RetentionAuditEventType;
    targetType: string;
    targetId?: string;
    actorId: string;
    runId?: string;
    dryRun?: boolean;
    details?: Record<string, unknown>;
  }): Promise<void>;

  // Stats
  getStats(): Promise<Stats | undefined>;
  updateStats(stats: InsertStats): Promise<Stats>;

  // Resources
  getResources(): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource>;
  deleteResource(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          ...getOAuthAccessRestorationPatch(),
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async setUserLegalHold(
    id: string,
    legalHold: boolean,
    reason?: string,
    audit?: RetentionAuditContext,
  ): Promise<User | undefined> {
    return await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(users)
        .set({
          legalHold,
          legalHoldReason: legalHold ? reason ?? null : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();
      if (updated && audit) {
        await this.insertRetentionAuditEvent(tx, {
          eventType: "user_legal_hold_changed",
          targetType: "user",
          targetId: id,
          actorId: audit.actorId,
          runId: audit.runId,
          dryRun: audit.dryRun,
          details: { legalHold, hasReason: Boolean(reason) },
        });
      }
      return updated;
    });
  }

  async recordUserAccessRemoval(id: string, removedAt: Date, audit?: RetentionAuditContext): Promise<User | undefined> {
    return await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(users)
        .set({
          accessRemovedAt: removedAt,
          updatedAt: removedAt,
        })
        .where(eq(users.id, id))
        .returning();
      if (updated && audit) {
        await this.insertRetentionAuditEvent(tx, {
          eventType: "user_access_removed",
          targetType: "user",
          targetId: id,
          actorId: audit.actorId,
          runId: audit.runId,
          dryRun: audit.dryRun,
          details: { removedAt: removedAt.toISOString() },
        });
      }
      return updated;
    });
  }

  async anonymizeEligibleUser(id: string, referenceTime: Date, audit?: RetentionAuditContext): Promise<User | undefined> {
    const cutoff = getOAuthUserAnonymisationCutoff(referenceTime);
    return await db.transaction(async (tx) => {
      const [anonymized] = await tx
        .update(users)
        .set({
          email: null,
          firstName: null,
          lastName: null,
          profileImageUrl: null,
          retentionActionAt: referenceTime,
          updatedAt: referenceTime,
        })
        .where(and(
          eq(users.id, id),
          eq(users.legalHold, false),
          isNotNull(users.accessRemovedAt),
          isNull(users.retentionActionAt),
          lte(users.accessRemovedAt, cutoff),
        ))
        .returning();
      if (anonymized && audit) {
        await this.insertRetentionAuditEvent(tx, {
          eventType: "user_anonymized",
          targetType: "user",
          targetId: id,
          actorId: audit.actorId,
          runId: audit.runId,
          dryRun: audit.dryRun,
          details: { referenceTime: referenceTime.toISOString() },
        });
      }
      return anonymized;
    });
  }

  // Hero content
  async getHeroContent(): Promise<HeroContent | undefined> {
    const [content] = await db.select().from(heroContent).limit(1);
    return content;
  }

  async updateHeroContent(content: InsertHeroContent): Promise<HeroContent> {
    const existing = await this.getHeroContent();
    if (existing) {
      const [updated] = await db
        .update(heroContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(heroContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(heroContent).values(content).returning();
      return created;
    }
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.order);
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await db.update(services).set({ isActive: false }).where(eq(services.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  // Case Studies
  async getCaseStudies(): Promise<CaseStudy[]> {
    return await db.select().from(caseStudies).where(eq(caseStudies.isActive, true)).orderBy(desc(caseStudies.createdAt));
  }

  async getCaseStudy(id: string): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db.select().from(caseStudies).where(eq(caseStudies.id, id));
    return caseStudy;
  }

  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const [created] = await db.insert(caseStudies).values(caseStudy).returning();
    return created;
  }

  async updateCaseStudy(id: string, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const [updated] = await db
      .update(caseStudies)
      .set({ ...caseStudy, updatedAt: new Date() })
      .where(eq(caseStudies.id, id))
      .returning();
    return updated;
  }

  async deleteCaseStudy(id: string): Promise<void> {
    await db.update(caseStudies).set({ isActive: false }).where(eq(caseStudies.id, id));
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(desc(testimonials.createdAt));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [created] = await db.insert(testimonials).values(testimonial).returning();
    return created;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [updated] = await db
      .update(testimonials)
      .set({ ...testimonial, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return updated;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.update(testimonials).set({ isActive: false }).where(eq(testimonials.id, id));
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [blogPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return blogPost;
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(blogPost).returning();
    return created;
  }

  async updateBlogPost(id: string, blogPost: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...blogPost, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // About content
  async getAboutContent(): Promise<AboutContent | undefined> {
    const [content] = await db.select().from(aboutContent).limit(1);
    return content;
  }

  async updateAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const existing = await this.getAboutContent();
    if (existing) {
      const [updated] = await db
        .update(aboutContent)
        .set({ ...content, updatedAt: new Date() })
        .where(eq(aboutContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(aboutContent).values(content).returning();
      return created;
    }
  }

  // Contact submissions
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db
      .insert(contactSubmissions)
      .values({
        ...submission,
        legalHold: false,
        legalHoldReason: null,
      })
      .returning();
    return created;
  }

  async markContactSubmissionAsRead(id: string): Promise<void> {
    await db.update(contactSubmissions).set({ isRead: true }).where(eq(contactSubmissions.id, id));
  }

  async setContactSubmissionLegalHold(
    id: string,
    legalHold: boolean,
    reason?: string,
    audit?: RetentionAuditContext,
  ): Promise<ContactSubmission | undefined> {
    return await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(contactSubmissions)
        .set({
          legalHold,
          legalHoldReason: legalHold ? reason ?? null : null,
        })
        .where(eq(contactSubmissions.id, id))
        .returning();
      if (updated && audit) {
        await this.insertRetentionAuditEvent(tx, {
          eventType: "contact_legal_hold_changed",
          targetType: "contact_submission",
          targetId: id,
          actorId: audit.actorId,
          runId: audit.runId,
          dryRun: audit.dryRun,
          details: { legalHold, hasReason: Boolean(reason) },
        });
      }
      return updated;
    });
  }

  async deleteEligibleContactSubmission(id: string, referenceTime: Date, audit?: RetentionAuditContext): Promise<boolean> {
    const cutoff = getContactSubmissionDeletionCutoff(referenceTime);
    return await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(contactSubmissions)
        .where(and(
          eq(contactSubmissions.id, id),
          eq(contactSubmissions.legalHold, false),
          lte(contactSubmissions.createdAt, cutoff),
        ))
        .returning({ id: contactSubmissions.id });
      if (deleted.length > 0 && audit) {
        await this.insertRetentionAuditEvent(tx, {
          eventType: "contact_deleted",
          targetType: "contact_submission",
          targetId: id,
          actorId: audit.actorId,
          runId: audit.runId,
          dryRun: audit.dryRun,
          details: { referenceTime: referenceTime.toISOString() },
        });
      }
      return deleted.length > 0;
    });
  }

  async getRetentionTargets(): Promise<{ contacts: RetentionTargetContact[]; users: RetentionTargetUser[] }> {
    const [contacts, userTargets] = await Promise.all([
      db.select({
        id: contactSubmissions.id,
        createdAt: contactSubmissions.createdAt,
        legalHold: contactSubmissions.legalHold,
      }).from(contactSubmissions),
      db.select({
        id: users.id,
        accessRemovedAt: users.accessRemovedAt,
        retentionActionAt: users.retentionActionAt,
        legalHold: users.legalHold,
      }).from(users),
    ]);
    return { contacts, users: userTargets };
  }

  async createRetentionRun(input: {
    requestedBy: string;
    referenceTime: Date;
    dryRun: boolean;
    status: string;
    candidateFingerprint: string;
  }): Promise<RetentionRun> {
    const [run] = await db.insert(retentionRuns).values(input).returning();
    return run;
  }

  async updateRetentionRun(
    id: string,
    update: Partial<{
      status: string;
      contactEligible: number;
      usersEligible: number;
      contactsDeleted: number;
      usersAnonymized: number;
      blockedByLegalHold: number;
      skipped: number;
      failureCode: string | null;
      completedAt: Date;
    }>,
  ): Promise<RetentionRun | undefined> {
    const [run] = await db.update(retentionRuns).set(update).where(eq(retentionRuns.id, id)).returning();
    return run;
  }

  async getRetentionRun(id: string): Promise<RetentionRun | undefined> {
    const [run] = await db.select().from(retentionRuns).where(eq(retentionRuns.id, id));
    return run;
  }

  async getRecentRetentionRuns(limit = 20): Promise<RetentionRun[]> {
    return await db.select().from(retentionRuns).orderBy(desc(retentionRuns.createdAt)).limit(Math.min(Math.max(limit, 1), 100));
  }

  async getRecentRetentionAuditEvents(limit = 50): Promise<RetentionAuditEvent[]> {
    return await db
      .select()
      .from(retentionAuditEvents)
      .orderBy(desc(retentionAuditEvents.createdAt))
      .limit(Math.min(Math.max(limit, 1), 100));
  }

  async recordRetentionAuditEvent(input: {
    eventType: RetentionAuditEventType;
    targetType: string;
    targetId?: string;
    actorId: string;
    runId?: string;
    dryRun?: boolean;
    details?: Record<string, unknown>;
  }): Promise<void> {
    await db.insert(retentionAuditEvents).values({
      ...input,
      targetId: input.targetId ?? null,
      runId: input.runId ?? null,
      dryRun: input.dryRun ?? false,
      details: input.details ?? {},
    });
  }

  private async insertRetentionAuditEvent(
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
    input: {
      eventType: RetentionAuditEventType;
      targetType: string;
      targetId?: string;
      actorId: string;
      runId?: string;
      dryRun?: boolean;
      details?: Record<string, unknown>;
    },
  ): Promise<void> {
    await tx.insert(retentionAuditEvents).values({
      ...input,
      targetId: input.targetId ?? null,
      runId: input.runId ?? null,
      dryRun: input.dryRun ?? false,
      details: input.details ?? {},
    });
  }

  // Stats
  async getStats(): Promise<Stats | undefined> {
    const [statsData] = await db.select().from(stats).limit(1);
    return statsData;
  }

  async updateStats(statsData: InsertStats): Promise<Stats> {
    const existing = await this.getStats();
    if (existing) {
      const [updated] = await db
        .update(stats)
        .set({ ...statsData, updatedAt: new Date() })
        .where(eq(stats.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(stats).values(statsData).returning();
      return created;
    }
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.isActive, true)).orderBy(desc(resources.createdAt));
  }

  async getResource(id: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [created] = await db.insert(resources).values(resource).returning();
    return created;
  }

  async updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource> {
    const [updated] = await db
      .update(resources)
      .set({ ...resource, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return updated;
  }

  async deleteResource(id: string): Promise<void> {
    await db.update(resources).set({ isActive: false }).where(eq(resources.id, id));
  }
}

export const storage = new DatabaseStorage();
